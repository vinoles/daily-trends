import { Browser, Page } from 'puppeteer';
import { PageArticle, ScraperPageInterface } from '../ScraperPageInterface';
import { EnumOrigin } from '../../schemas/feed.schema';
import { ExtractArticleDto } from '../../dto/extract-article-dto';
import { ServiceScraperPage } from '../ServiceScraperPage';
import { FeedsService } from '../../feeds.service';
import { FeedLogService } from '../../feeds.logs.service';

export class ScraperTheWordPage
  extends ServiceScraperPage
  implements ScraperPageInterface
{
  excludeUrls: string[] = [
    'https://www.elmundo.es/deportes/futbol/primera-division/calendario.html',
  ];

  private urlBasePge: string = process.env.WORD_BASE_PAGE || 'www.elmundo.es';

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

      await this.page.goto(process.env.WORD_PAGE ?? '', {
        waitUntil: 'networkidle2',
        timeout: 10000,
      });

      const consentSelector = '#ue-accept-notice-button';
      const consentElement = await this.page.$(consentSelector);

      if (consentElement != null) {
        await this.page.click(consentSelector);
      }

      const pageCategories = await this.getPageCategories(
        process.env.MAIN_SELECTOR_WORD_PAGE ?? '',
      );

      this.processArticles(
        pageCategories,
        EnumOrigin.WORD_PAGE,
        this.extractArticleContent.bind(this),
      );
    } catch (error) {
      console.error('Error in scraping the word page:', error);
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
    const baseElements = 'body > main';
    const title = await this.getTextContent(
      detailPage,
      `${baseElements} [id^="H1_"]`,
    );

    const subtitle = await this.getTextContent(
      detailPage,
      `${baseElements} [class="ue-c-article__standfirst"] p`,
    );

    const selectorContent = `${baseElements} [data-section="articleBody"] p`;
    const elementContent = await detailPage.$(selectorContent);

    let content = subtitle;

    if (elementContent != null) {
      content = await this.getTextContentByList(detailPage, selectorContent);
    }

    const author = await this.getTextContentByList(
      detailPage,
      `${baseElements} [class="ue-c-article__author-name"] div`,
    );

    const publishedAt = await this.getTextContent(
      detailPage,
      `${baseElements} [class="ue-c-article__publishdate"] time`,
    );

    const urlImage = await this.getImageSrc(
      detailPage,
      `${baseElements} [class="ue-c-article__image"]`,
    );

    const updatedAt = publishedAt;
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
