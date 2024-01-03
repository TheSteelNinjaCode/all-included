const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// User data
const userData = [
  {
    name: "Juan",
  },
];

async function main() {
  // User
  await prisma.user.deleteMany();
  await prisma.user.createMany({ data: userData });
  await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1`;
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
