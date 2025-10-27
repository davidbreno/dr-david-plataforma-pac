import { AlertLevel, PrismaClient, QuestionType, UserRole } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed: iniciando carga do Odonto Manager...");

  const passwordHash = await argon2.hash("admin123");

  await prisma.user.upsert({
    where: { email: "contato@drdavidbreno.com" },
    update: {},
    create: {
      email: "contato@drdavidbreno.com",
      name: "Dr. David Breno",
      hashedPassword: passwordHash,
      role: UserRole.ADMIN,
    },
  });

  await prisma.anamnesisTemplate.createMany({
    data: [
      {
        name: "Anamnese Odontologica Completa",
        description: "Modelo para consultas iniciais de adultos.",
        category: "Adulto",
        isDefault: true,
      },
      {
        name: "Anamnese Infantil",
        description: "Perguntas direcionadas a pacientes infantis.",
        category: "Infantil",
        isDefault: true,
      },
    ],
    skipDuplicates: true,
  });

  const adultTemplate = await prisma.anamnesisTemplate.findFirst({
    where: { name: "Anamnese Odontologica Completa" },
  });
  const kidsTemplate = await prisma.anamnesisTemplate.findFirst({
    where: { name: "Anamnese Infantil" },
  });

  if (adultTemplate) {
    await prisma.anamnesisQuestion.createMany({
      data: [
        {
          templateId: adultTemplate.id,
          question: "Qual a queixa principal?",
          type: QuestionType.TEXT,
          order: 1,
        },
        {
          templateId: adultTemplate.id,
          question: "Esta em tratamento medico atualmente?",
          type: QuestionType.BOOLEAN,
          order: 2,
          alertLevel: AlertLevel.WARNING,
        },
        {
          templateId: adultTemplate.id,
          question: "Usa alguma medicacao?",
          type: QuestionType.TEXT,
          helperText: "Informe nome, dosagem e frequencia.",
          order: 3,
        },
        {
          templateId: adultTemplate.id,
          question: "Possui alguma alergia?",
          type: QuestionType.TEXT,
          order: 4,
        },
        {
          templateId: adultTemplate.id,
          question: "Escova os dentes quantas vezes por dia?",
          type: QuestionType.NUMBER,
          order: 5,
        },
      ],
      skipDuplicates: true,
    });
  }

  if (kidsTemplate) {
    await prisma.anamnesisQuestion.createMany({
      data: [
        {
          templateId: kidsTemplate.id,
          question: "Gestacao foi acompanhada?",
          type: QuestionType.BOOLEAN,
          order: 1,
        },
        {
          templateId: kidsTemplate.id,
          question: "Realiza aleitamento materno?",
          type: QuestionType.BOOLEAN,
          order: 2,
        },
        {
          templateId: kidsTemplate.id,
          question: "Ha uso de chupeta ou succao digital?",
          type: QuestionType.BOOLEAN,
          order: 3,
          alertLevel: AlertLevel.WARNING,
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log("Seed: concluido com sucesso.");
}

main()
  .catch((error) => {
    console.error("Seed: erro inesperado.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
