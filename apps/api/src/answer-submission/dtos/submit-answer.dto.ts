import { IsInt, IsPositive, IsDefined } from 'class-validator';

export class SubmitAnswerDto {
  @IsDefined()
  @IsInt()
  @IsPositive()
  audioAssetId: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  questionId: number;
}
