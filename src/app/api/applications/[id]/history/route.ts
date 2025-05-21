import { JobApplication } from "@/app/types/modelTypes";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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
      { error: "Failed to update status", e },
      { status: 500 }
    );
  }
}
