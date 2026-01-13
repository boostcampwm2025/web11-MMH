import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import type { User } from './entities/user.entity';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginRequestDto } from './dtos/login.request.dto';

const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7일

@ApiTags('users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test-users')
  @ApiOperation({ summary: '테스트 사용자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '테스트 사용자 목록',
    type: [Object],
  })
  async getTestUsers(): Promise<User[]> {
    return this.userService.findAllTestUsers();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userService.login(
      loginRequestDto.nickname,
      loginRequestDto.password,
    );

    // HTTP 응답 처리 (쿠키 설정)
    res.cookie('userId', user.id.toString(), {
      httpOnly: false, // 프론트엔드에서도 접근 가능하도록
      maxAge: COOKIE_MAX_AGE_MS,
    });

    const response: LoginResponseDto = {
      user: {
        id: user.id,
        nickname: user.nickname,
      },
    };

    res.json(response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  @ApiCookieAuth('userId')
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '로그아웃 성공' },
      },
    },
  })
  logout(@Res() res: Response): void {
    res.clearCookie('userId');
    res.json({ message: '로그아웃 성공' });
  }

  @Get('me')
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiCookieAuth('userId')
  @ApiResponse({
    status: 200,
    description: '현재 사용자 정보',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: '로그인이 필요합니다',
  })
  async getCurrentUser(@Req() req: Request): Promise<User> {
    const userId = Number(req.cookies?.userId);
    if (!userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return this.userService.getCurrentUser(userId);
  }
}
