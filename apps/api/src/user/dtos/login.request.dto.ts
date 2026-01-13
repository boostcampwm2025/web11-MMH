import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: 'user123',
  })
  nickname: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
  })
  password: string;
}
