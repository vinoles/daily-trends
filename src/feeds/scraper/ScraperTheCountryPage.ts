import { ScraperPageInterface } from './ScraperPageInterface';

export class ScraperTheCountryPage implements ScraperPageInterface {
  async processPage(): Promise<void> {
    try {
      console.log('Processing page El Pais');
    } catch (error) {
      console.error('Error durante el scraping:', error);
    }
  }
}
