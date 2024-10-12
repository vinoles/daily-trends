import { Page } from 'puppeteer';
import { ScraperPageInterface } from '../ScraperPageInterface';
import { HelperWordPage } from './HelperWordPage';
import { EnumOrigin } from 'src/feeds/schemas/feed.schema';
import { ExtractArticleDto } from 'src/feeds/dto/extract-article-dto';

export class ScraperTheWordPage
  extends HelperWordPage
  implements ScraperPageInterface
{
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
}
