import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { FeedsService } from '../feeds.service';
import { PageArticle } from './ScraperPageInterface';
import { CreateFeedDto } from '../dto/create-feed.dto';
import { EnumOrigin } from '../schemas/feed.schema';

export class ScraperPage {
  public browser: Browser;
  public page: Page;
  public agent: string;
  public feedService: FeedsService;
  public excludeSections: string[];

  private launchOptions: PuppeteerLaunchOptions = {
    executablePath: process.env.GOOGLE_CHROME_BIN,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 20000,
    protocolTimeout: 40000,
  };

  /**
   * Constructor to initialize
   *
   * @param {Browser} browser
   * @param {Page} page
   * @param {string} agent
   * @param {string[]} excludeSections
   * @param {FeedsService} feedService
   */
  constructor(
    browser: Browser,
    page: Page,
    agent: string,
    excludeSections: string[],
    feedService: FeedsService,
  ) {
    this.browser = browser;
    this.page = page;
    this.agent = agent;
    this.feedService = feedService;
    this.excludeSections = excludeSections;
  }

  /**
   * Process multiple articles from different regions.
   *
   * @param {PageArticle[]} ageWordArticles
   */
  protected async processArticles(
    pageWordArticles: PageArticle[],
    origin: EnumOrigin,
    extractArticleContent: (page: Page) => Promise<{
      title: string;
      subtitle: string;
      content: string;
      author: string;
      urlImage: string;
      publishedAt: string;
      updatedAt: string;
    }>,
  ) {
    for (const article of pageWordArticles) {
      try {
        await this.processArticle(article, origin, extractArticleContent);
      } catch (error) {
        console.error(`Error processing article at ${article.url}:`, error);
      }
    }
  }

  /**
   * Process a specific article.
   * Opens the detail page, extracts the content, and saves it as a Feed model.
   *
   * @param {PageArticle} article
   * @param {Function} extractArticleContent - Function to extract content from the article page.
   */
  protected async processArticle(
    article: PageArticle,
    origin: EnumOrigin,
    extractArticleContent: (page: Page) => Promise<{
      title: string;
      subtitle: string;
      content: string;
      author: string;
      urlImage: string;
      publishedAt: string;
      updatedAt: string;
    }>,
  ) {
    let detailPage: Page | null = null;
    try {
      detailPage = await this.openDetailPage(article.url ?? '');

      const {
        title,
        subtitle,
        content,
        author,
        urlImage,
        publishedAt,
        updatedAt,
      } = await extractArticleContent(detailPage);

      const feedDto: CreateFeedDto = {
        title,
        subtitle,
        category: article.category,
        urlImage,
        url: article.url,
        author,
        origin,
        content,
      };

      const feed = await this.feedService.createFromExternal(
        feedDto,
        publishedAt,
        updatedAt,
      );

      console.log(
        `processed new feed for the origin: ${origin} URL:: ${feed.url}`,
      );
    } catch (error) {
      console.error(`Error processing article at ${article.url}:`, error);
    } finally {
      if (detailPage) {
        await detailPage.browser().close();
      }
    }
  }

  /**
   * Open a detailed page for an article.
   *
   * @param {string} url
   * @returns {Promise<Page>}
   */
  public async openDetailPage(url: string): Promise<Page> {
    const detailBrowser = await puppeteer.launch(this.launchOptions);

    const page: Page = await detailBrowser.newPage();
    await page.setUserAgent(this.agent);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000, // Increases timeout for slow pages.
    });
    return page;
  }

  /**
   * Get the text content of an element on the page.
   *
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  public getTextContent = async (
    page: Page,
    selector: string,
  ): Promise<string> => {
    return await page.$eval(selector, (el) => el.textContent?.trim());
  };

  /**
   * Get the text content of all elements that match the selector on the page.
   * Concatenates the text from all matching elements.
   *
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  public getTextContentByList = async (
    page: Page,
    selector: string,
  ): Promise<string> => {
    return await page.$$eval(selector, (elements) =>
      elements
        .map((el) => `<p> ${el.textContent?.trim()} '</p>`)
        .filter((text) => text.length > 0)
        .join(' '),
    );
  };

  /**
   * Get the src attribute of an image on the page.
   *
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  public getImageSrc = async (
    page: Page,
    selector: string,
  ): Promise<string> => {
    return await page.$eval(selector, (el: any) => el.src);
  };

  public extractSegmentUrl(url: string) {
    const parts = url.split('/');
    return parts[4] || '';
  }
}
