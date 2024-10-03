import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { EnumOrigin, Feed } from '../schemas/feed.schema';
const _ = require('lodash');

@Injectable()
export class FakeFeedService {
  categories: string[] = ['technology', 'sport', 'finance'];
  origins: EnumOrigin[] = [
    EnumOrigin.COUNTRY_PAGE,
    EnumOrigin.LOCAL_PAGE,
    EnumOrigin.WORD_PAGE,
  ];

  createFakeFeed(): Feed {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: _.random(this.categories),
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: _.random(this.origins),
      content: faker.lorem.paragraph(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  createFakeFeeds(count: number): Feed[] {
    return Array.from({ length: count }, () => this.createFakeFeed());
  }

  createFakeFeedByOriginAndCategory(
    category: string,
    origin: EnumOrigin,
  ): Feed {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: category,
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: origin,
      content: faker.lorem.paragraph(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  createFakeFeedsByOriginAndCategory(
    count: number,
    category: string,
    origin: EnumOrigin,
  ): Feed[] {
    return Array.from({ length: count }, () =>
      this.createFakeFeedByOriginAndCategory(category, origin),
    );
  }
}
