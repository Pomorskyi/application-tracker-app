const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const statuses = [
    'Applied / Awaiting response',
    'Had the first organisational meeting / call',
    'Interviewed / Awaiting response',
    'Rejected',
    'Got offer',
    'Deleted'
  ];

  for (const name of statuses) {
    await prisma.application_status.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seeded statuses!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
