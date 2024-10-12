import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { CreateFeedDto } from '../dto/create-feed.dto';
import { EnumOrigin } from '../schemas/feed.schema';
import { PageArticle } from './ScraperPageInterface';
import { FeedsService } from '../feeds.service';
import { FeedLogService } from '../feeds.logs.service';
import { ExtractArticleDto } from '../dto/extract-article-dto';

export class ArticlePageProcessor {
  public browser: Browser;
  public page: Page;
  public agent: string;
  public feedService: FeedsService;
  public feedLogService: FeedLogService;
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
   * @param {FeedLogService} feedLogService
   */
  constructor(
    browser: Browser,
    page: Page,
    agent: string,
    excludeSections: string[],
    feedService: FeedsService,
    feedLogService: FeedLogService,
  ) {
    this.browser = browser;
    this.page = page;
    this.agent = agent;
    this.feedService = feedService;
    this.excludeSections = excludeSections;
    this.feedLogService = feedLogService;
  }

  /**
   * Process multiple articles from different regions.
   *
   * @param {PageArticle[]} ageWordArticles
   */
  protected async processArticles(
    pageWordArticles: PageArticle[],
    origin: EnumOrigin,
    extractArticleContent: (page: Page) => Promise<ExtractArticleDto>,
  ) {
    for (const article of pageWordArticles) {
      await this.processArticle(article, origin, extractArticleContent);
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
    extractArticleContent: (page: Page) => Promise<ExtractArticleDto>,
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
      console.error(
        `Error processing article at ${article.url}:`,
        error.message,
      );
      await this.feedLogService.create({
        message: `Error processing article at ur;: ${article.url} :: Error: ${error.message}`,
        url: article.url,
        error,
        createdAt: new Date().toISOString(),
      });
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

    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 20000,
    });
    return page;
  }
}
