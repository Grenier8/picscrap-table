import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'Administrator',
      },
    }),
  ]);

  await Promise.all([
    prisma.user.create({
      data: {
        email: 'grjuako18@gmail.com',
        name: 'Admin',
        lastname: 'Picscrap',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        roleId: roles[0].id,
      },
    }),
  ]);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
