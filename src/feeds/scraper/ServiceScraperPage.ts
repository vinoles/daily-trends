import { Browser, Page } from 'puppeteer';
import { FeedsService } from '../feeds.service';
import { FeedLogService } from '../feeds.logs.service';
import { ArticlePageProcessor } from './ArticlePageProcessor';

export class ServiceScraperPage extends ArticlePageProcessor {
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
    super(browser, page, agent, excludeSections, feedService, feedLogService);
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
