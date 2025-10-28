-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DENTIST', 'RECEPTION');

-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'WAITING', 'DISCHARGED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NON_BINARY', 'UNDISCLOSED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'BOOLEAN', 'MULTIPLE_CHOICE', 'NUMBER');

-- CreateEnum
CREATE TYPE "AlertLevel" AS ENUM ('NONE', 'INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "AnamnesisStatus" AS ENUM ('OPEN', 'FINALIZED');

-- CreateEnum
CREATE TYPE "OdontogramChartType" AS ENUM ('PERMANENT', 'DECIDUOUS');

-- CreateEnum
CREATE TYPE "ToothStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'NOTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DENTIST',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "status" "PatientStatus" NOT NULL DEFAULT 'ACTIVE',
    "gender" "Gender" NOT NULL DEFAULT 'UNDISCLOSED',
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "documentNumber" TEXT,
    "address" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "fee" DECIMAL(10,2),
    "paidAmount" DECIMAL(10,2),
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "dueDate" TIMESTAMP(3),
    "appointmentId" TEXT,
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnamnesisTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisQuestion" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "helperText" TEXT,
    "alertLabel" TEXT,
    "alertLevel" "AlertLevel" NOT NULL DEFAULT 'NONE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnamnesisQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisResponseSet" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "filledById" TEXT,
    "filledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AnamnesisStatus" NOT NULL DEFAULT 'OPEN',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "amountDue" DECIMAL(10,2),
    "amountPaid" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnamnesisResponseSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnamnesisAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "responseSetId" TEXT NOT NULL,
    "valueText" TEXT,
    "valueBoolean" BOOLEAN,
    "valueNumber" DECIMAL(10,2),
    "valueOptions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnamnesisAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "responseSetId" TEXT,
    "uploadedById" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OdontogramRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "responseSetId" TEXT,
    "chartType" "OdontogramChartType" NOT NULL DEFAULT 'PERMANENT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OdontogramRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OdontogramEntry" (
    "id" TEXT NOT NULL,
    "odontogramId" TEXT NOT NULL,
    "toothNumber" TEXT NOT NULL,
    "region" TEXT,
    "annotations" TEXT,
    "status" "ToothStatus" NOT NULL DEFAULT 'OPEN',
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OdontogramEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "appointmentId" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "category" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "recipientId" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImplantItem" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lengthMm" INTEGER,
    "diameterMm" DECIMAL(4,2),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImplantItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgeryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurgeryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorativeItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorativeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "Patient_fullName_idx" ON "Patient"("fullName");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_providerId_startAt_idx" ON "Appointment"("providerId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_startAt_idx" ON "Appointment"("startAt");

-- CreateIndex
CREATE INDEX "AnamnesisQuestion_templateId_order_idx" ON "AnamnesisQuestion"("templateId", "order");

-- CreateIndex
CREATE INDEX "AnamnesisResponseSet_patientId_templateId_idx" ON "AnamnesisResponseSet"("patientId", "templateId");

-- CreateIndex
CREATE INDEX "AnamnesisResponseSet_appointmentId_idx" ON "AnamnesisResponseSet"("appointmentId");

-- CreateIndex
CREATE INDEX "AnamnesisAnswer_responseSetId_idx" ON "AnamnesisAnswer"("responseSetId");

-- CreateIndex
CREATE INDEX "Attachment_patientId_idx" ON "Attachment"("patientId");

-- CreateIndex
CREATE INDEX "Attachment_appointmentId_idx" ON "Attachment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "OdontogramRecord_responseSetId_key" ON "OdontogramRecord"("responseSetId");

-- CreateIndex
CREATE INDEX "OdontogramRecord_patientId_idx" ON "OdontogramRecord"("patientId");

-- CreateIndex
CREATE INDEX "OdontogramEntry_odontogramId_idx" ON "OdontogramEntry"("odontogramId");

-- CreateIndex
CREATE INDEX "OdontogramEntry_toothNumber_idx" ON "OdontogramEntry"("toothNumber");

-- CreateIndex
CREATE INDEX "FinancialTransaction_patientId_idx" ON "FinancialTransaction"("patientId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_appointmentId_idx" ON "FinancialTransaction"("appointmentId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_type_status_idx" ON "FinancialTransaction"("type", "status");

-- CreateIndex
CREATE INDEX "ImplantItem_type_idx" ON "ImplantItem"("type");

-- CreateIndex
CREATE INDEX "SurgeryItem_name_idx" ON "SurgeryItem"("name");

-- CreateIndex
CREATE INDEX "RestorativeItem_name_idx" ON "RestorativeItem"("name");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisQuestion" ADD CONSTRAINT "AnamnesisQuestion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AnamnesisTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponseSet" ADD CONSTRAINT "AnamnesisResponseSet_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AnamnesisTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponseSet" ADD CONSTRAINT "AnamnesisResponseSet_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponseSet" ADD CONSTRAINT "AnamnesisResponseSet_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisResponseSet" ADD CONSTRAINT "AnamnesisResponseSet_filledById_fkey" FOREIGN KEY ("filledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisAnswer" ADD CONSTRAINT "AnamnesisAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AnamnesisQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnamnesisAnswer" ADD CONSTRAINT "AnamnesisAnswer_responseSetId_fkey" FOREIGN KEY ("responseSetId") REFERENCES "AnamnesisResponseSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_responseSetId_fkey" FOREIGN KEY ("responseSetId") REFERENCES "AnamnesisResponseSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdontogramRecord" ADD CONSTRAINT "OdontogramRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdontogramRecord" ADD CONSTRAINT "OdontogramRecord_responseSetId_fkey" FOREIGN KEY ("responseSetId") REFERENCES "AnamnesisResponseSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdontogramEntry" ADD CONSTRAINT "OdontogramEntry_odontogramId_fkey" FOREIGN KEY ("odontogramId") REFERENCES "OdontogramRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OdontogramEntry" ADD CONSTRAINT "OdontogramEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
