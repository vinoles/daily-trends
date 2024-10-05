import { Page } from 'puppeteer';
import { ScraperPageInterface } from '../ScraperPageInterface';
import { HelperCountryPage } from './HelperCountryPage';
import { EnumOrigin } from 'src/feeds/schemas/feed.schema';

export class ScraperTheCountryPage
  extends HelperCountryPage
  implements ScraperPageInterface
{
  async processPage(): Promise<void> {
    try {
      await this.page.setUserAgent(this.agent);

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
      console.error('Error durante el scraping:', error);
    } finally {
      await this.browser.close();
    }
  }

  /**
   * Extract the content of an article from the detail page.
   * @param {Page} detailPage
   * @returns {Promise<Object>}
   */
  async extractArticleContent(detailPage: Page): Promise<Object> {
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

    const selectorElementTitleImageFooter =
      'body > article > header > div > figure > figcaption';

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
}
