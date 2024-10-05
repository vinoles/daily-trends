import puppeteer, { Browser, Page } from 'puppeteer';
import { FeedsService } from '../feeds.service';

export class ScraperPage {
  public browser: Browser;
  public page: Page;
  public agent: string;
  public feedService: FeedsService;

  public excludeSections: string[];

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
   * Open a detailed page for an article.
   *
   * @param {string} url
   * @returns {Promise<Page>}
   */
  public async openDetailPage(url: string): Promise<Page> {
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
