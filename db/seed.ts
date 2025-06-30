import { PrismaClient } from '@/lib/generated/prisma';
import sampleData from "./sample-data";
import { getSeedUsers } from './sample-data';

 const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();


   // 🌱 Get users with hashed passwords
   const users = await getSeedUsers();

     // 🌱 Seed users
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // optional, avoids duplicate errors on reruns
  });

  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log(`Database has been seeded successfully. 🌱`);
}

main()