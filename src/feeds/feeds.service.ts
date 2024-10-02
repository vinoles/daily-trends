import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './schemas/feed.schema';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedsService {
  /**
   * Constructor to inject the Feed model.
   *
   * @param {Model<Feed>} feedModel
   */
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
  ) {}

  /**
   * Creates a new feed and saves it to the database.
   *
   * @param {CreateFeedDto} createFeedDto
   * @returns {Promise<Feed>}
   */
  async create(createFeedDto: CreateFeedDto): Promise<Feed> {
    const publishedAt = new Date().toISOString();
    const feedData = { ...createFeedDto, publishedAt };
    const createdFeed = await this.feedModel.create(feedData);
    return createdFeed;
  }

  /**
   * Retrieves all feeds stored in the database.
   *
   * @returns {Promise<Feed[]>}
   */
  async findAll(): Promise<Feed[]> {
    return await this.feedModel.find().exec();
  }

  /**
   * Retrieves a feed by its ID.
   *
   * @param {string} id
   * @returns {Promise<Feed | null>}
   */
  async findOne(id: string): Promise<Feed | null> {
    try {
      return await this.feedModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.error(`Error retrieving the feed with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Updates an existing feed in the database by its ID.
   *
   * @param {string} id
   * @param {UpdateFeedDto} updateFeedDto
   * @returns {Promise<Feed | null>}
   */
  async update(id: string, updateFeedDto: UpdateFeedDto): Promise<Feed | null> {
    const updatedAt = new Date().toISOString();
    const feedData = { ...updateFeedDto, updatedAt };
    try {
      return await this.feedModel
        .findByIdAndUpdate(id, feedData, { new: true })
        .exec();
    } catch (error) {
      console.error(`Error updating the feed with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Deletes a feed from the database by its ID.
   *
   * @param {string} id
   * @returns {Promise<Feed | null>}
   */
  async delete(id: string): Promise<Feed | null> {
    try {
      return await this.feedModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      console.error(`Error deleting the feed with ID ${id}:`, error);
      return null;
    }
  }
}
