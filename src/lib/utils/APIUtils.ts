import { ApplicationStatus } from "@/app/types/modelTypes";
import { prisma } from "../prisma";

export async function getDeletedStatus(): Promise<ApplicationStatus> {
  const [deletedStatus]: ApplicationStatus[] = await prisma.$queryRaw`
    select * from application_status where name = 'Deleted'
  `;

  return deletedStatus;
}