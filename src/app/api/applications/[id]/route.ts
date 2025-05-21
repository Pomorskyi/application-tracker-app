import { JobApplication } from "@/app/types/modelTypes";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as dfnsTz from "date-fns-tz";
import { getNowUTCTimestamp } from "@/lib/utils/DateUtils";
import { getUserFromRequest } from "@/lib/utils/AuthUtils";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { statusId, company, notes, positionName } = await req.json();
    const id = parseInt(params.id);

    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!statusId && !company && !notes && !positionName) {
      return NextResponse.json(
        { error: "At least one field have to be updated" },
        { status: 400 }
      );
    }

    const [lastVersion]: JobApplication[] = await prisma.$queryRaw`
    select * from job_application j right join (
      select ja.id as id, max(ja.version) as vers
        from job_application ja 
        where ja.user_id = ${user.userId} and ja.id = ${id}
        group by ja.id) help 
          on j.id = help.id AND j.version = help.vers;`;

    const updated = await prisma.$queryRaw`
  insert into job_application 
    (id, version, position_name, company, notes, created_at, status_id, user_id) values 
    (
      ${lastVersion.id},
      ${lastVersion.version + 1},
      ${positionName ?? lastVersion.position_name},
      ${company ?? lastVersion.company},
      ${notes ?? lastVersion.notes},
      ${getNowUTCTimestamp()},
      ${statusId ?? lastVersion.status_id},
      ${lastVersion.user_id}
    )
`;

    return NextResponse.json({ success: true, application: updated });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
