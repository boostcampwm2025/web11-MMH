import { IsDefined, IsInt, IsPositive } from 'class-validator';

/**
 * POST /stt 요청 바디 DTO
 */
export class SttStartRequestDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  assetId: number;
}
