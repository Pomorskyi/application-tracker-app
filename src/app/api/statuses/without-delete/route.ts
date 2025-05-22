import { prisma } from "@/lib/prisma";
import { getDeletedStatus } from "@/lib/utils/APIUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const deletedStatus = await getDeletedStatus();

    const statuses = await prisma.$queryRaw`
        select * from application_status where id != ${deletedStatus.id}
    `;

    return NextResponse.json({ success: true, statuses });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
