import { Controller, Get, Post, Body, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import type { User } from './entities/user.entity';
import { LoginResponseDto } from './dtos/login.response.dto';
import { LoginRequestDto } from './dtos/login.request.dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test-users')
  async getTestUsers(): Promise<User[]> {
    return this.userService.findAllTestUsers();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    const response: LoginResponseDto = {
      user: {
        id: user.id,
        nickname: user.nickname,
        totalPoint: user.totalPoint,
        totalScore: user.totalScore,
      },
      message: '로그인 성공',
    };

    res.json(response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response): void {
    res.clearCookie('userId');
    res.json({ message: '로그아웃 성공' });
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request): Promise<User | null> {
    const userId = req.cookies?.userId ? Number(req.cookies.userId) : undefined;
    return this.userService.getCurrentUser(userId);
  }
}

