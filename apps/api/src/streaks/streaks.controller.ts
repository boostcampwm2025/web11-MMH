import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { StreaksRecordRequestDto } from './dtos/streaks.dto';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  async getYearlyActivityCount(
    @Req() req: Request,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ) {
    const userId = Number((req.cookies as { userId?: string })?.userId);
    if (!userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    if (!year) {
      year = new Date().getFullYear();
    }
    return this.streaksService.getYearlyActivityCount(userId, year);
  }

  @Get('/sequence')
  async getConsecutiveDayCount(@Req() req: Request) {
    const userId = Number((req.cookies as { userId?: string })?.userId);
    if (!userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return this.streaksService.getConsecutiveDayCount(userId);
  }

  @Post()
  async recordDailyActivity(
    @Req() req: Request,
    @Body() requestDto?: StreaksRecordRequestDto,
  ) {
    const userId = Number((req.cookies as { userId?: string })?.userId);
    if (!userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const submittedAt = requestDto?.submittedAt
      ? new Date(requestDto.submittedAt)
      : new Date();
    return this.streaksService.recordDailyActivity(userId, submittedAt);
  }
}
