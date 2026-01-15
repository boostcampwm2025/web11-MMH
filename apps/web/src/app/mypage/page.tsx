import { BarChart3 } from "lucide-react";
import GraphView from "./_components/graph-view/graph-view";
import UserStatsCard from "./_components/user-stats-card/user-stats-card";
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
  const consecutiveDayCount = 0;
  const mockData = mockGraphData;
  // const mockData = { nodes: [], edges: [] };
  const streakCount = 0;
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

        <UserStatsCard
          nickname={userData.nickname}
          consecutiveDayCount={consecutiveDayCount}
          totalPoint={userData.totalPoint}
          totalScore={userData.totalScore}
        />
      </section>

      <section className="w-full flex flex-col gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            학습 그래프
          </h2>
          <div className="h-100">
            {mockData.nodes.length === 0 && mockData.edges.length === 0 ? (
              <div className="flex flex-col h-full w-full items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  아직 학습 데이터가 없습니다
                </h3>
                <p className="text-sm text-gray-500">
                  문제를 풀면 학습 그래프가 생성됩니다
                </p>
              </div>
            ) : (
              <GraphView mockData={mockData} />
            )}
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
