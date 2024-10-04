import puppeteer, { Page, Browser } from 'puppeteer';
import {
  CategoryPage,
  CategoryPageCountryArticles,
  PageCountryArticle,
} from './ScraperPageInterface';
import { EnumOrigin, Feed } from '../schemas/feed.schema';
import { FeedsService } from '../feeds.service';
import { CreateFeedDto } from '../dto/create-feed.dto';

export class ScraperTheHelperCountry {
  public browser: Browser;
  public page: Page;
  public agent: string;
  public feedService: FeedsService;

  private excludeSections: string[];

  /**
   * Constructor to initialize
   *
   * @param {Browser} browser
   * @param {Page} page
   * @param {string} agent
   * @param {FeedsService} feedService
   */
  constructor(
    browser: Browser,
    page: Page,
    agent: string,
    feedService: FeedsService,
  ) {
    this.browser = browser;
    this.page = page;
    this.agent = agent;
    this.feedService = feedService;
    this.excludeSections = [
      'portada_cross-linking',
      'portada_tematicos_pasatiempos-en-el-pais',
      'portada_tematicos_el-pais-expres',
      '',
    ];
  }

  /**
   * Get the regions of the page.
   * Filters out regions that are excluded in excludeSections.
   *
   * @param {string} selector
   * @returns {Promise<CategoryPage[]>}
   */
  protected async getPageCategories(selector: string): Promise<CategoryPage[]> {
    const regions = await this.page.$$eval(selector, (elements) =>
      elements.map((el) => ({
        tag: el.tagName.toLowerCase(),
        categoryPage: el.getAttribute('data-dtm-region') || '',
      })),
    );

    return regions.filter(
      (element) =>
        element.categoryPage &&
        !this.excludeSections.includes(element.categoryPage),
    );
  }

  /**
   * Get the links of articles present in each region page (categories).
   *
   * @param {CategoryPage[]} categories
   * @returns {Promise<CategoryPageCountryArticles[]>}
   */
  protected async getArticlesLinks(
    categories: CategoryPage[],
  ): Promise<CategoryPageCountryArticles[]> {
    return Promise.all(
      categories.map(async (element) => {
        const articles = await this.page.$$eval(
          `[data-dtm-region="${element.categoryPage}"] article h2 a`,
          (links) =>
            links.map((link) => ({
              title: link.textContent?.trim() || '',
              url: link.href,
            })),
        );

        return {
          categoryPage: element.categoryPage,
          articles: articles.filter((article) => article.title !== ''),
        };
      }),
    );
  }

  /**
   * Process multiple articles from different regions.
   *
   * @param {CategoryPageCountryArticles[]} categoryPageCountryArticles
   */
  protected async processArticles(
    categoryPageCountryArticles: CategoryPageCountryArticles[],
  ) {
    for (const categoryPageCountryArticle of categoryPageCountryArticles) {
      const categoryPage = categoryPageCountryArticle.categoryPage;
      for (const article of categoryPageCountryArticle.articles) {
        try {
          await this.processArticle(article, categoryPage);
        } catch (error) {
          console.error(`Error processing article at ${article.url}:`, error);
        }
      }
    }
  }

  /**
   * Open a detailed page for an article.
   *
   * @param {string} url
   * @returns {Promise<Page>}
   */
  private async openDetailPage(url: string): Promise<Page> {
    const detailBrowser = await puppeteer.launch({
      headless: true,
      args: ['--start-maximized'],
    });
    const page: Page = await detailBrowser.newPage();
    await page.setUserAgent(this.agent);
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000, // Increases timeout for slow pages.
    });
    return page;
  }

  /**
   * Extract the content of an article from the detail page.
   * @param {Page} detailPage
   * @returns {Promise<Object>}
   */
  private async extractArticleContent(detailPage: Page) {
    const title = await this.getTextContent(
      detailPage,
      'body > article > header > div > h1',
    );

    const subtitle = await this.getTextContent(
      detailPage,
      'body > article > header > div > h2',
    );

    const selectorContent = 'body [data-dtm-region="articulo_cuerpo"] p';
    const elementContent = await detailPage.$(selectorContent);

    let content = subtitle;

    if (elementContent != null) {
      content = await this.getTextContent(detailPage, selectorContent);
    }

    const author = await this.getTextContent(
      detailPage,
      'body [data-dtm-region="articulo_firma"]',
    );

    const selectorImageOptionOne = 'body > article > header > div > figure img';
    const selectorImageOptionTwo = '[mm_imagen]';
    const elementUrlImageOptionOne = await detailPage.$(selectorImageOptionOne);
    const elementUrlImageOptionTwo = await detailPage.$(selectorImageOptionTwo);

    let urlImage: string | null = null;

    if (elementUrlImageOptionOne != null) {
      urlImage = await this.getImageSrc(detailPage, selectorImageOptionOne);
    } else if (elementUrlImageOptionTwo != null) {
      urlImage = await this.getImageSrc(detailPage, selectorImageOptionTwo);
    }

    const selectorElementTitleImageFooter =
      'body > article > header > div > figure > figcaption';

    const elementTitleImageFooter = await detailPage.$(
      selectorElementTitleImageFooter,
    );

    let titleImageFooter = title;
    if (elementTitleImageFooter != null) {
      titleImageFooter = await this.getTextContent(
        detailPage,
        selectorElementTitleImageFooter,
      );
    }

    const elementWithPublishedAt = await detailPage.$('[data-date]');

    let publishedAt: string | null = null;

    if (elementWithPublishedAt) {
      publishedAt = await detailPage.evaluate(
        (el) => el.getAttribute('data-date'),
        elementWithPublishedAt,
      );
    }

    const elementWithUpdatedAt = await detailPage.$('#article_date_u');

    let updatedAt: string | null = null;

    if (elementWithUpdatedAt) {
      updatedAt = await detailPage.evaluate(
        (el) => el.getAttribute('data-date'),
        elementWithUpdatedAt,
      );
    }

    return {
      title,
      subtitle,
      content,
      author,
      urlImage,
      titleImageFooter,
      publishedAt,
      updatedAt,
    };
  }

  /**
   * Process a specific article.
   * Opens the detail page, extracts the content, and saves it as a Feed model.
   *
   * @param {PageCountryArticle} pageCountryArticle
   * @param {string} category
   */
  protected async processArticle(
    pageCountryArticle: PageCountryArticle,
    category: string,
  ) {
    let detailPage: Page | null = null;
    try {
      detailPage = await this.openDetailPage(pageCountryArticle.url ?? '');

      // Extract article content
      const {
        title,
        subtitle,
        content,
        author,
        urlImage,
        publishedAt,
        updatedAt,
      } = await this.extractArticleContent(detailPage);

      const feedDto: CreateFeedDto = {
        title,
        subtitle,
        category,
        urlImage,
        url: pageCountryArticle.url,
        author,
        origin: EnumOrigin.COUNTRY_PAGE,
        content,
      };

      const feed = await this.feedService.createFromExternal(
        feedDto,
        publishedAt,
        updatedAt,
      );

      console.log('process new feed:', feed);
    } catch (error) {
      console.error(
        `Error processing article at ${pageCountryArticle.url}:`,
        error,
      );
    } finally {
      if (detailPage) {
        await detailPage.browser().close();
      }
    }
  }

  /**
   * Get the text content of an element on the page.
   *
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  private getTextContent = async (
    page: Page,
    selector: string,
  ): Promise<string> => {
    return (
      (await page.$eval(selector, (el) => el.textContent?.trim() || '')) || ''
    );
  };

  /**
   * Get the src attribute of an image on the page.
   *
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  private getImageSrc = async (
    page: Page,
    selector: string,
  ): Promise<string> => {
    return await page.$eval(selector, (el: any) => el.src);
  };
}
