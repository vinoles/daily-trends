import { Page, Browser } from 'puppeteer';
import { CategoryPage, PageArticle } from '../ScraperPageInterface';
import { FeedsService } from '../../feeds.service';
import { ScraperPage } from '../ScraperPage';
import { FeedLogService } from 'src/feeds/feeds.logs.service';

export class HelperCountryPage extends ScraperPage {
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
