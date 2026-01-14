interface UserStatsCardProps {
  nickname: string;
  consecutiveDayCount: number;
  totalPoint: number;
  totalScore: number;
}

function UserStatsCard({
  nickname,
  consecutiveDayCount,
  totalPoint,
  totalScore,
}: UserStatsCardProps) {
  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">닉네임</p>
        <p className="text-2xl font-bold text-gray-900">{nickname}</p>
      </div>

      <div className="h-12 w-px bg-gray-200" />

      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">연속 출석</p>
        <p className="text-2xl font-bold text-blue-600">
          {consecutiveDayCount}일
        </p>
      </div>

      <div className="h-12 w-px bg-gray-200" />

      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">총 포인트</p>
        <p className="text-2xl font-bold text-green-600">{totalPoint}</p>
      </div>

      <div className="h-12 w-px bg-gray-200" />

      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">총 점수</p>
        <p className="text-2xl font-bold text-purple-600">{totalScore}</p>
      </div>
    </div>
  );
}

export default UserStatsCard;
