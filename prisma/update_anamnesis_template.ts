import { PrismaClient, QuestionType, AlertLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const templateName = "Anamnese Odontologica Completa";
  const template = await prisma.anamnesisTemplate.findFirst({
    where: { name: templateName },
    include: { questions: true },
  });
  if (!template) {
    throw new Error(`Template '${templateName}' não encontrado.`);
  }

  const existing = new Set(
    template.questions.map((q) => q.question.trim().toLowerCase()),
  );

  const toAdd = [
    { question: "O que motivou sua visita hoje?", type: QuestionType.TEXT },
    { question: "Há quanto tempo o problema começou?", type: QuestionType.TEXT },
    { question: "A dor é constante ou aparece em certos momentos?", type: QuestionType.TEXT },
    {
      question:
        "Algo piora ou melhora o sintoma (frio, calor, mastigação, posição)?",
      type: QuestionType.TEXT,
    },
    { question: "Já tratou esse dente antes?", type: QuestionType.TEXT },
    {
      question: "Faz uso de medicamentos atualmente? Quais?",
      type: QuestionType.TEXT,
    },
    {
      question:
        "Tem ou já teve alguma doença sistêmica (diabetes, hipertensão, cardiopatia, epilepsia, etc.)?",
      type: QuestionType.TEXT,
      alertLevel: AlertLevel.WARNING,
    },
    { question: "Já passou por cirurgias? Quais?", type: QuestionType.TEXT },
    {
      question: "Tem alergias (medicamentos, alimentos, látex)?",
      type: QuestionType.TEXT,
      alertLevel: AlertLevel.WARNING,
    },
    {
      question: "Está em tratamento médico atualmente?",
      type: QuestionType.BOOLEAN,
    },
    {
      question: "Mulheres: está grávida ou amamentando?",
      type: QuestionType.BOOLEAN,
      alertLevel: AlertLevel.INFO,
    },
    { question: "Fuma?", type: QuestionType.BOOLEAN, alertLevel: AlertLevel.INFO },
    {
      question: "Consome bebidas alcoólicas com frequência?",
      type: QuestionType.BOOLEAN,
      alertLevel: AlertLevel.INFO,
    },
    {
      question: "Faz uso de drogas ilícitas?",
      type: QuestionType.BOOLEAN,
      alertLevel: AlertLevel.WARNING,
    },
    {
      question: "Escova os dentes quantas vezes ao dia?",
      type: QuestionType.NUMBER,
    },
    { question: "Usa fio dental regularmente?", type: QuestionType.BOOLEAN },
    {
      question: "Costuma ranger ou apertar os dentes (bruxismo)?",
      type: QuestionType.BOOLEAN,
    },
    {
      question: "Quando foi sua última visita ao dentista?",
      type: QuestionType.TEXT,
    },
    {
      question: "Já fez tratamento de canal, cirurgia ou extração?",
      type: QuestionType.TEXT,
    },
    {
      question: "Sente sangramento gengival ou mau hálito?",
      type: QuestionType.TEXT,
    },
    {
      question: "Já usou ou usa aparelho ortodôntico?",
      type: QuestionType.BOOLEAN,
    },
    {
      question: "Tem medo ou ansiedade em relação a tratamento odontológico?",
      type: QuestionType.BOOLEAN,
    },
    {
      question: "Pressão arterial / glicemia (quando indicado)",
      type: QuestionType.TEXT,
    },
    {
      question:
        "Observações do profissional (condição bucal, lesões, próteses, etc.)",
      type: QuestionType.TEXT,
    },
  ];

  const startOrder = template.questions.length;
  const create = toAdd
    .filter((q) => !existing.has(q.question.trim().toLowerCase()))
    .map((q, idx) => ({
      templateId: template.id,
      question: q.question,
      type: q.type,
      order: startOrder + idx,
      alertLevel: (q as any).alertLevel ?? AlertLevel.NONE,
      helperText: (q as any).helperText ?? null,
      isRequired: false,
    }));

  if (create.length === 0) {
    console.log("Nenhuma pergunta nova para adicionar – já estava completo.");
    return;
  }

  await prisma.anamnesisQuestion.createMany({ data: create });
  console.log(
    `Adicionadas ${create.length} perguntas ao template '${templateName}'.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
