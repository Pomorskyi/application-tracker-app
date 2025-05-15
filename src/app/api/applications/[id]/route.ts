import { JobApplication } from '@/app/types/modelTypes'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = parseInt(params.id)
//     const { statusId } = await req.json()

//     if (!statusId) {
//       return NextResponse.json({ error: 'Missing statusId' }, { status: 400 })
//     }

//     const updated = await prisma.job_application.update({
//       where: { id },
//       data: { statusId },
//     })

//     return NextResponse.json({ success: true, application: updated })
//   } catch (e) {
//     return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
//   }
// }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    const applications: JobApplication[] = await prisma.$queryRaw`select * from job_application where id = ${appId}`

    return NextResponse.json({ versions: applications })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
