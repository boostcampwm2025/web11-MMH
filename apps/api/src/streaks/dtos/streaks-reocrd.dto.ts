import { ApiProperty } from '@nestjs/swagger';

export class RecordDailyActivityRequestDto {
  @ApiProperty({
    description: '제출 시간 (ISO 8601 형식, 선택사항)',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  submittedAt?: string;
}

export class RecordDailyActivityResponseDto {
  @ApiProperty({
    description: '기록 성공 여부',
    example: true,
  })
  success: boolean;
}
