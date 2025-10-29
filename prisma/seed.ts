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

  // Pacientes de exemplo
  await prisma.patient.createMany({
    data: [
      {
        id: "cmhb28bh40001utzknotxw054",
        firstName: "João",
        lastName: "Silva",
        fullName: "João Silva",
        status: "ACTIVE",
        gender: "MALE",
        birthDate: new Date("1990-01-01"),
        email: "joao.silva@example.com",
        phone: "11999999999",
        documentNumber: "12345678900"
      },
      {
        id: "cmhc0px8s0000tuc16fioio5",
        firstName: "Maria",
        lastName: "Oliveira",
        fullName: "Maria Oliveira",
        status: "ACTIVE",
        gender: "FEMALE",
        birthDate: new Date("1985-05-15"),
        email: "maria.oliveira@example.com",
        phone: "11988888888",
        documentNumber: "98765432100"
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed OK: Usuário e pacientes criados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });