import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { EnumFeed, Feed } from '../schemas/feed.schema';

@Injectable()
export class FakeFeedService {
  categories: string[] = ['technology', 'sport', 'finance'];
  origins: EnumFeed[] = [
    EnumFeed.COUNTRY_PAGE,
    EnumFeed.LOCAL_PAGE,
    EnumFeed.WORD_PAGE,
  ];

  createFakeFeed(): Feed {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: this.getRandomElement(this.categories),
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: this.getRandomElement(this.origins),
      content: faker.lorem.paragraph(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  createFakeFeeds(count: number): Feed[] {
    return Array.from({ length: count }, () => this.createFakeFeed());
  }

  private getRandomElement(array: any[]) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
}
