import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScraperTheCountryPage } from './ScraperTheCountryPage';
import { ScraperTheWordPage } from './ScraperTheWordPage';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  @Cron('* * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');

    const scrapeTheCountryPage = new ScraperTheCountryPage();
    scrapeTheCountryPage.processPage();

    const scrapeTheWordPage = new ScraperTheWordPage();
    scrapeTheWordPage.processPage();
  }
}
