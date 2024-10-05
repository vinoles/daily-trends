import { ScraperPageInterface } from '../ScraperPageInterface';
import { ScraperTheHelperCountry } from './ScraperTheHelperCountry';

export class ScraperTheCountryPage
  extends ScraperTheHelperCountry
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

      this.processArticles(categoryPageCountryArticles);
    } catch (error) {
      console.error('Error durante el scraping:', error);
    } finally {
      await this.browser.close();
    }
  }
}
