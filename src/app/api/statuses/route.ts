import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const statuses = await prisma.application_status.findMany();

    return NextResponse.json({ success: true, statuses });
  } catch (e) {
    return NextResponse.json({ error: "Sth went wrong" }, { status: 400 });
  }
}
