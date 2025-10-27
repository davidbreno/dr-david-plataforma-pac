import Link from "next/link";
import { Prisma, PatientStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PatientTable, type PatientRow } from "@/components/patients/patient-table";

type SearchParams = {
  search?: string;
  status?: string;
};

async function getPatients(filter: SearchParams): Promise<PatientRow[]> {
  const where: Prisma.PatientWhereInput = filter.search
    ? {
        OR: [
          { fullName: { contains: filter.search, mode: "insensitive" as const } },
          { email: { contains: filter.search, mode: "insensitive" as const } },
          { phone: { contains: filter.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  if (filter.status && filter.status !== "all") {
    where.status = filter.status as PatientStatus;
  }

  const patients = await prisma.patient.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return patients.map((patient) => ({
    id: patient.id,
    fullName: patient.fullName || `${patient.firstName} ${patient.lastName}`,
    status: patient.status,
    phone: patient.phone,
    email: patient.email,
    createdAt: patient.createdAt,
  }));
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const patients = await getPatients(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pacientes
          </h1>
          <p className="text-sm text-slate-500">
            Cadastre pacientes, acompanhe evolução clínica e organize anexos.
          </p>
        </div>
        <Button asChild className="h-11 rounded-xl px-5">
          <Link href="/patients/new">Adicionar paciente</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Lista de pacientes</CardTitle>
            <CardDescription>
              Utilize a busca para encontrar pacientes rapidamente.
            </CardDescription>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr,180px]" method="get">
            <Input
              name="search"
              defaultValue={searchParams.search ?? ""}
              placeholder="Buscar por nome, e-mail ou telefone"
            />
            <Select
              name="status"
              defaultValue={searchParams.status ?? "all"}
            >
              <option value="all">Todos os status</option>
              <option value="ACTIVE">Ativos</option>
              <option value="WAITING">Lista de espera</option>
              <option value="DISCHARGED">Alta</option>
              <option value="INACTIVE">Inativos</option>
            </Select>
          </form>
        </CardHeader>
      </Card>

      <PatientTable data={patients} />
    </div>
  );
}
