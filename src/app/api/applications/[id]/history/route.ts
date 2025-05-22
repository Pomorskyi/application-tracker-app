import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id: number = parseInt(parts[3]);

    const applications = await prisma.$queryRaw`
      select * from job_application where id = ${id} order by version asc
    `;

    return NextResponse.json({ versions: applications });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch application history" },
      { status: 500 }
    );
  }
}
