import { JobApplication } from "@/app/types/modelTypes";
import { useEffect, useState } from "react";

export const useApplicationHistory = () => {
  const [historyModalVersions, setHistoryModalVersions] = useState<
    JobApplication[]
  >([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [showingHistoryApplicationId, setShowingHistoryApplicationId] =
    useState<number | null>(null);

  const fetchHistoryData = async (appId: number) => {
    setLoadingHistory(true);
    const res = await fetch(`/api/applications/${appId}/history`, {
      method: "GET",
    });
    const data = await res.json();

    setHistoryModalVersions(data.versions || []);
    setLoadingHistory(false);
  };

  useEffect(() => {
    if (showingHistoryApplicationId !== null)
      fetchHistoryData(showingHistoryApplicationId);
  }, [showingHistoryApplicationId]);
  
  return {
    historyModalVersions,
    loadingHistory,
    setLoadingHistory,
    setShowingHistoryApplicationId,
  };
};
