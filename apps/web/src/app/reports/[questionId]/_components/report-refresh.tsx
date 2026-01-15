"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReportRefreshProps {
  enabled: boolean;
  submissionId: string;
}

function ReportRefresh({ enabled, submissionId }: ReportRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    async function checkStatusAndRefresh() {
      try {
        const res = await fetch(`/api/reports/${submissionId}`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const result = await res.json();

        if (result.status !== "PROCESSING") {
          clearInterval(intervalId);
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
  }, [enabled, submissionId, router]);

  return null;
}

export default ReportRefresh;
