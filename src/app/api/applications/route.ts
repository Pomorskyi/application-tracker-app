import { ApplicationStatus, JobApplication } from '@/app/types/modelTypes';
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function getDeletedStatus (): Promise<ApplicationStatus> {
  const [deletedStatus]: ApplicationStatus[] = await prisma.$queryRaw`select * from application_status where name = 'Deleted'`
  return deletedStatus
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserIdStr = searchParams.get('currentUserId');

    if (!currentUserIdStr) {
      return NextResponse.json({ error: 'currentUserId query param is required' }, { status: 400 });
    }

    const currentUserId = parseInt(currentUserIdStr);
    if (isNaN(currentUserId)) {
      return NextResponse.json({ error: 'currentUserId must be a valid number' }, { status: 400 });
    }

    const deletedStatus = await getDeletedStatus();

    const applications = await prisma.$queryRaw`
     select j.id, j.version, j.company, j.notes, j.created_at, 
	j.position_name, j.status_id, j.user_id from job_application j
	right join (
select ja.id as id, max(ja.version) as vers
from job_application ja 
where ja.user_id = ${currentUserId} and ja.status_id != ${deletedStatus.id}
group by ja.id
	) help on j.id = help.id AND j.version = help.vers;
    `;

    console.log('applications', applications);

    return NextResponse.json({ applications });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { position_name, company, notes, status_id, currentUserId } = await req.json()

    if (!position_name || !company || !status_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const maxIdRow = await prisma.$queryRaw<{ max: number }[]>`
      SELECT MAX(id) as max FROM job_application
    `;

    const nextId = (maxIdRow[0]?.max ?? 0) + 1;

    const application = await prisma.job_application.create({
      data: {
        id: nextId,
        version: 1,
        position_name: position_name,
        company,
        notes,
        user: { connect: { id: currentUserId } },
        status: { connect: { id: status_id } },
      },
      include: {
        status: true,
      },
    })

    return NextResponse.json({ application })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { applicationId, currentUserId } = await req.json()

        const maxVersion = await prisma.$queryRaw<{ max: number }[]>`
      SELECT MAX(version) as max FROM job_application where user_id = ${currentUserId} and id = ${applicationId}
    `;

    const currentVersion = maxVersion[0]?.max ?? 0
    const nextVersion = currentVersion + 1;

    const [currentApplication]: JobApplication[] = await prisma
      .$queryRaw`select * from job_application where id = ${applicationId} and user_id = ${currentUserId} and version = ${currentVersion}`

    const deletedStatus = await getDeletedStatus();

    const application = await prisma.job_application.create({
      data: {
        id: applicationId,
        version: nextVersion,
        position_name: currentApplication.position_name,
        company: currentApplication.company,
        notes: currentApplication.notes,
        user: { connect: { id: currentUserId } },
        status: { connect: { id: deletedStatus.id } },
      },
      include: {
        status: true,
      },
    })

    return NextResponse.json({})
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
