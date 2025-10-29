import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "Dr. David Breno",
      email: "contato@drdavidbreno.com",
      hashedPassword: password,
      role: "ADMIN",
    },
  });

  console.log("✅ Usuário criado com sucesso:", user.email);
}

main()
  .catch((err) => {
    console.error("Erro:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
