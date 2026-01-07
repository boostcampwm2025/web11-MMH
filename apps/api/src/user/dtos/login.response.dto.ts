export class LoginResponseDto {
  user: {
    id: number;
    nickname: string | null;
    totalPoint: number | null;
    totalScore: number | null;
  };
  message: string;
}