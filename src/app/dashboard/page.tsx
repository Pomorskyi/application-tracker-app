"use client";

import ApplicationKanban from "@/components/charts/ApplicationKanban";
import ApplicationTimelineChart from "@/components/charts/ApplicationTimelineChart";
import CompanyApplicationsBarChart from "@/components/charts/BarChartComponent";
import StatusDistributionPieChart from "@/components/charts/StatusDistributionPieChart";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { token, login } = useAuth();

  const router = useRouter();

  const [loadingData, setLoadingData] = useState(true);

  const [barChartData, setBarChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  // const [stuckStatuses, setStuckStatuses] = useState([]);
  const [kanbanData, setKanbanData] = useState<
    Record<string, { company: string; position: string }[]>
  >({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramsToken = params.get("token");

    if (paramsToken) {
      login(paramsToken); // your existing logic
      router.replace("/dashboard"); // clean the URL
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/dashboard`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
        setBarChartData(data.barChartData);
        setStatusData(data.pieChartData);
        setTimelineData(data.timelineData);
        // setStuckStatuses(data.topStuckStatuses);
        setKanbanData(data.kanbanData);

        setLoadingData(false);
      });
  }, [token]);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-2">User Dashboard</h1>
      <p className="mb-6">Here will be statistics of your job applications.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <CompanyApplicationsBarChart
          data={barChartData}
          loading={loadingData}
        />
        <StatusDistributionPieChart data={statusData} loading={loadingData} />
        <ApplicationTimelineChart data={timelineData} loading={loadingData} />
        {/* <TopStuckStatuses stuckStatuses={stuckStatuses} loading={loadingData} /> */}
      </div>

      <ApplicationKanban data={kanbanData} loading={loadingData} />
    </main>
  );
}
