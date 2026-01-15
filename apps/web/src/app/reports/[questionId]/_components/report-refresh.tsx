"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface ReportRefreshProps {
  pendingSubmissionIds: number[];
}

function ReportRefresh({ pendingSubmissionIds }: ReportRefreshProps) {
  const router = useRouter();
  const dependencyKey = JSON.stringify(pendingSubmissionIds);

  React.useEffect(() => {
    if (pendingSubmissionIds.length === 0) return;

    async function checkStatusAndRefresh() {
      try {
        const results = await Promise.all(
          pendingSubmissionIds.map((id) =>
            fetch(`/api/reports/${id}`, { cache: "no-store" }).then((res) => {
              if (!res.ok) {
                throw new Error(`Failed to fetch status for ${id}`);
              }
              return res.json();
            }),
          ),
        );

        // 하나라도 PROCESSING이 아니게 되면 (완료 또는 실패) 새로고침 실행
        if (results.some((result) => result.status !== "PROCESSING")) {
          router.refresh();
        }
      } catch (error) {
        console.error("[ReportRefresh]", error);
      }
    }

    const intervalId = setInterval(checkStatusAndRefresh, 2000);

    // 최초 1회 즉시 실행
    checkStatusAndRefresh();

    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencyKey, router]);

  return null;
}

export default ReportRefresh;
