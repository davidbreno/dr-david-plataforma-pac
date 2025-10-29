import React from "react";

export default function MinimalSidebar() {
  return (
    <aside className="h-screen w-64 p-6 bg-light-card text-light-text dark:bg-dark-card dark:text-dark-text flex flex-col gap-4 rounded-xl shadow-md">
      <div className="mb-8 flex items-center gap-2">
        <span className="font-bold text-xl tracking-tight">OdontoManager</span>
      </div>
      <nav className="flex flex-col gap-2">
        <a href="/dashboard" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Dashboard</a>
        <a href="/patients" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Pacientes</a>
        <a href="/finance" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Financeiro</a>
        <a href="/schedule" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Agenda</a>
        <a href="/reports" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Relatórios</a>
        <a href="/settings" className="py-2 px-4 rounded-xl hover:bg-light-bg dark:hover:bg-dark-bg transition">Configurações</a>
      </nav>
      <div className="mt-auto">
        <button className="w-full py-3 rounded-xl bg-dark-accent text-dark-card dark:bg-dark-green dark:text-dark-text font-semibold shadow-md hover:opacity-90 transition">Nova análise AI</button>
      </div>
    </aside>
  );
}
