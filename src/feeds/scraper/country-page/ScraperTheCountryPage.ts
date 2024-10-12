import { Browser, Page } from 'puppeteer';
import {
  CategoryPage,
  PageArticle,
  ScraperPageInterface,
} from '../ScraperPageInterface';
import { EnumOrigin } from '../../schemas/feed.schema';
import { ExtractArticleDto } from '../../dto/extract-article-dto';
import { ServiceScraperPage } from '../ServiceScraperPage';
import { FeedsService } from '../../feeds.service';
import { FeedLogService } from '../../feeds.logs.service';

export class ScraperTheCountryPage
  extends ServiceScraperPage
  implements ScraperPageInterface
{
  constructor(
    browser: Browser,
    page: Page,
    agent: string,
    excludeSections: string[],
    feedService: FeedsService,
    feedLogService: FeedLogService,
  ) {
    super(browser, page, agent, excludeSections, feedService, feedLogService);
  }

  async processPage(): Promise<void> {
    try {
      await this.page.setUserAgent(this.agent);

      await this.page.setDefaultNavigationTimeout(0);

      await this.page.goto(process.env.COUNTRY_PAGE ?? '', {
        waitUntil: 'networkidle2',
        timeout: 10000,
      });

      const consentSelector = '.pmConsentWall-button';

      const consentElement = await this.page.$(consentSelector);

      if (consentElement != null) {
        await this.page.click(consentSelector);
      }

      const pageSections = await this.getPageCategories(
        process.env.MAIN_SELECTOR_COUNTRY_PAGE ?? '',
      );

      const categoryPageCountryArticles =
        await this.getArticlesLinks(pageSections);

      this.processArticles(
        categoryPageCountryArticles,
        EnumOrigin.COUNTRY_PAGE,
        this.extractArticleContent.bind(this),
      );
    } catch (error) {
      console.error('Error in scraping the country page:', error);
    } finally {
      await this.browser.close();
    }
  }

  /**
   * Extract the content of an article from the detail page.
   * @param {Page} detailPage
   * @returns {Promise<ExtractArticleDto>}
   */
  async extractArticleContent(detailPage: Page): Promise<ExtractArticleDto> {
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
      content = await this.getTextContentByList(detailPage, selectorContent);
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
      publishedAt,
      updatedAt,
    };
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
   * @returns {Promise<PageArticle[]>}
   */
  protected async getArticlesLinks(
    categories: CategoryPage[],
  ): Promise<PageArticle[]> {
    const articles = await Promise.all(
      categories.map(async (element) => {
        const articles = await this.page.$$eval(
          `[data-dtm-region="${element.categoryPage}"] article h2 a`,
          (links) =>
            links.map((link) => {
              const url = link.href;
              const parts = url.split('/');
              const category = parts[3];
              const baseUrl = parts[2];

              return {
                title: link.textContent?.trim() || '',
                url: link.href,
                category: category,
                baseUrl: baseUrl,
              };
            }),
        );

        return articles.filter((article) => article.title !== '');
      }),
    );

    return articles.flat();
  }
}
