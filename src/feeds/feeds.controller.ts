import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('feeds')
@ApiTags('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a feed' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a feed successful',
  })
  create(@Body() createFeedDto: CreateFeedDto) {
    console.log(createFeedDto);
    return this.feedsService.create(createFeedDto);
  }

  @Get()
  findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedsService.update(+id, updateFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsService.remove(+id);
  }
}
