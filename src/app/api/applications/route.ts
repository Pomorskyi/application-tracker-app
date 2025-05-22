/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobApplication } from "@/app/types/modelTypes";
import { prisma } from "@/lib/prisma";
import { getDeletedStatus } from "@/lib/utils/APIUtils";
import { getUserFromRequest } from "@/lib/utils/AuthUtils";
import { getNowUTCTimestamp } from "@/lib/utils/DateUtils";
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
       where j.status_id != ${deletedStatus.id} order by j.id;
    `;

    return NextResponse.json({ applications });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { position_name, company, notes, status_id } = await req.json();

    if (!position_name || !company || !status_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const maxIdRow = await prisma.$queryRaw<{ max: number }[]>`
      SELECT MAX(id) as max FROM job_application
    `;

    const nextId = (maxIdRow[0]?.max ?? 0) + 1;

    const application = await prisma.$queryRaw`
    insert into job_application
    (id, version, position_name, company, notes, created_at, status_id, user_id) values
    (${nextId}, 1, ${position_name}, ${company}, ${notes}, ${getNowUTCTimestamp()}, ${status_id}, ${user.userId});
  `;

    const [applicationToReturn]: any[] = (await prisma.$queryRaw`
    select id, version, position_name, company, notes, created_at, status_id, user_id from job_application where id = ${nextId} and version = 1;
  `) as any[];

    return NextResponse.json({ application: applicationToReturn });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { applicationId } = await req.json();

    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const maxVersion = await prisma.$queryRaw<{ max: number }[]>`
      SELECT MAX(version) as max FROM job_application where user_id = ${user.userId} and id = ${applicationId}
    `;

    const currentVersion = maxVersion[0]?.max ?? 0;
    const nextVersion = currentVersion + 1;

    const [currentApplication]: JobApplication[] = await prisma.$queryRaw`
      select * from job_application where id = ${applicationId} and user_id = ${user.userId} and version = ${currentVersion}
      `;

    const deletedStatus = await getDeletedStatus();

    const application = await prisma.job_application.create({
      data: {
        id: applicationId,
        version: nextVersion,
        position_name: currentApplication.position_name,
        company: currentApplication.company,
        created_at: new Date(),
        notes: currentApplication.notes,
        user: { connect: { id: user.userId } },
        status: { connect: { id: deletedStatus.id } },
      },
      include: {
        status: true,
      },
    });

    return NextResponse.json({});
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
