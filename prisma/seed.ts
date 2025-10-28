import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main(): Promise<void> {
  const senhaHash = await bcrypt.hash("313722", 10);

  await prisma.user.upsert({
    where: { email: "novo@exemplo.com" },
    update: {},
    create: {
      name: "Novo Usuário",
      email: "novo@exemplo.com",
      hashedPassword: senhaHash
    }
  });

  console.log("Seed OK");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });