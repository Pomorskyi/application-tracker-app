import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobApplication } from "@/app/types/modelTypes";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const applications: JobApplication[] = await prisma.$queryRaw`
      select * from job_application where id = ${id} order by version asc
    `;

    return NextResponse.json({ versions: applications });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch application history", e },
      { status: 500 }
    );
  }
}
