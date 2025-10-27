import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { getCurrentUser } from "@/lib/auth/session";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-transparent text-foreground">
      <Sidebar clinicName="Dr. David Breno" />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
