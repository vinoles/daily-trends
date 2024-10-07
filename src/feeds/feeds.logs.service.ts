import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedLog } from './schemas/feed.logs.schema';
import { CreateFeedLogDto } from './dto/create-feed-log.dto';

@Injectable()
export class FeedLogService {
  constructor(
    @InjectModel(FeedLog.name) private readonly feedLogModel: Model<FeedLog>,
  ) {}

  async create(createFeedLogDto: CreateFeedLogDto): Promise<FeedLog> {
    const newFeedLog = new this.feedLogModel(createFeedLogDto);
    return newFeedLog.save();
  }

  async findAll(): Promise<FeedLog[]> {
    return this.feedLogModel.find().exec();
  }

  async findOne(id: string): Promise<FeedLog> {
    const feedLog = await this.feedLogModel.findById(id).exec();
    if (!feedLog) {
      throw new NotFoundException(`FeedLog with ID "${id}" not found`);
    }
    return feedLog;
  }
}
