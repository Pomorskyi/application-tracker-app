import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDeletedStatus } from "@/lib/utils/APIUtils";
import { getUserFromRequest } from "@/lib/utils/AuthUtils";

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedStatus = await getDeletedStatus();

    const applications = await prisma.$queryRaw`
      SELECT j.id, j.version, j.company, j.position_name, j.created_at, j.status_id, s.name AS status_name
      FROM job_application j
      JOIN (
        SELECT id, MAX(version) as max_version
        FROM job_application
        WHERE user_id = ${user.userId}
        GROUP BY id
      ) latest ON j.id = latest.id AND j.version = latest.max_version
      JOIN application_status s ON j.status_id = s.id
      WHERE j.status_id != ${deletedStatus.id}
    `;

    const applicationsPerCompany: Record<string, number> = {};
    const statusDistribution: Record<string, number> = {};
    const timeline: Record<string, number> = {};
    // const statusDurations: Record<string, number[]> = {};
    const kanbanData: Record<
      string,
      { id: number; company: string; position: string }[]
    > = {};

    for (const app of applications as any[]) {
      const { id, company, position_name, created_at, status_name } = app;

      applicationsPerCompany[company] =
        (applicationsPerCompany[company] || 0) + 1;

      statusDistribution[status_name] =
        (statusDistribution[status_name] || 0) + 1;

      const date = new Date(created_at).toISOString().split("T")[0];
      timeline[date] = (timeline[date] || 0) + 1;

      // Simulated durations (placeholder logic)
      //   const fakeDuration = Math.floor(Math.random() * 20) + 1;
      //   statusDurations[status_name] = statusDurations[status_name] || [];
      //   statusDurations[status_name].push(fakeDuration);

      if (!kanbanData[status_name]) kanbanData[status_name] = [];
      kanbanData[status_name].push({
        id,
        company,
        position: position_name,
      });
    }

    // const avgDurations = Object.entries(statusDurations).map(
    //   ([status, durations]) => ({
    //     status,
    //     avg: Math.round(
    //       durations.reduce((a, b) => a + b, 0) / durations.length
    //     ),
    //   })
    // );

    // const topStuckStatuses = avgDurations
    //   .sort((a, b) => b.avg - a.avg)
    //   .slice(0, 3);

    return NextResponse.json({
      barChartData: Object.entries(applicationsPerCompany).map(
        ([company, applications]) => ({
          company,
          applications,
        })
      ),
      pieChartData: Object.entries(statusDistribution).map(
        ([status, value]) => ({
          status,
          value,
        })
      ),
      timelineData: Object.entries(timeline).map(([date, count]) => ({
        date,
        count,
      })),
      //   topStuckStatuses,
      kanbanData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
