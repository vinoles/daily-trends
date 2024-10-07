import { Page, Browser } from 'puppeteer';
import { PageArticle } from '../ScraperPageInterface';
import { FeedsService } from '../../feeds.service';
import { ScraperPage } from '../ScraperPage';
import { FeedLogService } from 'src/feeds/feeds.logs.service';

export class HelperWordPage extends ScraperPage {
  excludeUrls: string[] = [
    'https://www.elmundo.es/deportes/futbol/primera-division/calendario.html',
  ];

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

  private urlBasePge: string = process.env.WORD_BASE_PAGE || 'www.elmundo.es';

  /**
   * Get the regions of the page.
   * Filters out regions that are excluded in excludeSections.
   *
   * @param {string} selector
   * @returns {Promise<PageArticle[]>}
   */
  protected async getPageCategories(selector: string): Promise<PageArticle[]> {
    this.page.waitForSelector(selector);

    const sectionsLinks = await this.page.$$eval(selector, (elements) =>
      elements.map((element) => ({
        tag: element.tagName.toLowerCase(),

        links: Array.from(element.querySelectorAll('a')).map((link) => {
          let url = link.href;
          url = url.replace('#ancla_comentarios', '');
          const parts = url.split('/');
          const category = parts[3];
          const baseUrl = parts[2];

          return {
            title: link.textContent?.trim(),
            url: link.href,
            category: category,
            baseUrl: baseUrl,
          };
        }),
      })),
    );

    return sectionsLinks
      .map((sectionLink) => {
        return sectionLink.links.filter((link) => {
          return (
            link.baseUrl == this.urlBasePge &&
            !link.category.includes('.html') &&
            !this.excludeSections.includes(link.category) &&
            !this.excludeUrls.includes(link.url)
          );
        });
      })
      .flat();
  }
}
