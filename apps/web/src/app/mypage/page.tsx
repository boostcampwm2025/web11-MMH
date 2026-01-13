import GraphView from "./_components/graph-view/graph-view";
import VoronoiStreak from "./_components/voronoi-streak/voronoi-streak";
import { mockGraphData } from "./_constants/graph-mock";

async function MyPage() {
  //실제 api 연동시 여기에 데이터 패칭 로직
  const userData = {
    id: 1,
    nickname: "김개발",
    totalPoint: 200,
    totalScore: 500,
  };
  const consecutiveDayCount = 15;
  const mockData = mockGraphData;
  const streakCount = 180;
  const imageSrc = "/starry-night.jpg";
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 min-h-screen  ">
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            마이페이지
          </h1>
          <p className="text-muted-foreground">학습 통계를 확인하세요</p>
        </div>

        <div className="flex items-center gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">닉네임</p>
            <p className="text-2xl font-bold text-gray-900">
              {userData.nickname}
            </p>
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
            <p className="text-2xl font-bold text-green-600">
              {userData.totalPoint}
            </p>
          </div>

          <div className="h-12 w-px bg-gray-200" />

          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">총 점수</p>
            <p className="text-2xl font-bold text-purple-600">
              {userData.totalScore}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            학습 그래프
          </h2>
          <div className="h-100">
            <GraphView mockData={mockData} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">학습 스트릭</h2>
            <section className="flex gap-1">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {streakCount}일 달성
              </span>
              <span className="text-sm font-medium text-green-600 bg-blue-50 px-3 py-1 rounded-full">
                {consecutiveDayCount}일 연속
              </span>
            </section>
          </div>
          <div className="h-100">
            <VoronoiStreak streakCount={streakCount} imageSrc={imageSrc} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyPage;
