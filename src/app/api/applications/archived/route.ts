import { prisma } from "@/lib/prisma";
import { getDeletedStatus } from "@/lib/utils/APIUtils";
import { getUserFromRequest } from "@/lib/utils/AuthUtils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedStatus = await getDeletedStatus();

    const applications = await prisma.$queryRaw`
    select j.id, j.version, j.company, j.notes, j.created_at, j.position_name, j.status_id, j.user_id 
      from job_application j
          right join (
          select ja.id as id, max(ja.version) as vers
            from job_application ja 
            where ja.user_id = ${user.userId}
            group by ja.id
      ) help on j.id = help.id AND j.version = help.vers 
       where j.status_id = ${deletedStatus.id} order by j.id;
    `;

    return NextResponse.json({ applications });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
