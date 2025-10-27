import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main(): Promise<void> {
  const senha = "313722";
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.user.create({
    data: {
      name: "Novo Usuário",
      email: "novo@exemplo.com",
      hashedPassword: senhaHash
    }
  });

  console.log("Usuário criado com senha 313722");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
