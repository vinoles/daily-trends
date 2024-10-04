import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScraperTheCountryPage } from './ScraperTheCountryPage';
import { ScraperTheWordPage } from './ScraperTheWordPage';
import puppeteer, { Page } from 'puppeteer';
import { FeedsService } from '../feeds.service';

@Injectable()
export class ScrapeService {
  constructor(private readonly feedsService: FeedsService) {}
  private readonly logger = new Logger(ScrapeService.name);

  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.debug('Called when the current every 5 minutes');

    // const [width, height] = [1920, 1080];

    // const agent: string =
    //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    // const countryBrowser = await puppeteer.launch({
    //   headless: false,
    //   timeout: 10000,
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--disable-dev-shm-usage',
    //   ],
    // });
    // const countryPage: Page = await countryBrowser.newPage();

    // await countryPage.setViewport({ width, height });

    // const scrapeTheCountryPage = new ScraperTheCountryPage(
    //   countryBrowser,
    //   countryPage,
    //   agent,
    //   this.feedsService,
    // );

    // scrapeTheCountryPage.processPage();

    // const scrapeTheWordPage = new ScraperTheWordPage();
    // scrapeTheWordPage.processPage();
  }
}
