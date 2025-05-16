import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.webpage.create({
      data: {
        name: 'prisma/seed.ts',
        url: 'https://picslabstore.cl',
        isBasePage: true
      },
    }),
    prisma.webpage.create({
      data: {
        name: 'David and Joseph',
        url: 'https://davidandjoseph.cl',
        isBasePage: false
      },
    }),
    prisma.webpage.create({
      data: {
        name: 'Rincón Fotográfico',
        url: 'https://rinconfotografico.cl',
        isBasePage: false
      },
    }),
    prisma.webpage.create({
      data: {
        name: 'Apertura',
        url: 'https://apertura.cl',
        isBasePage: false
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
