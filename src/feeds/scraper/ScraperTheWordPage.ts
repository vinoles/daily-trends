import { ScraperPageInterface } from './ScraperPageInterface';

export class ScraperTheWordPage implements ScraperPageInterface {
  async processPage(): Promise<void> {
    try {
      console.log('Processing page El Mundo');
    } catch (error) {
      console.error('Error durante el scraping:', error);
    }
  }
}
