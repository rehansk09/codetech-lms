import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DashboardShell = ({ label, items }) => <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 sm:min-h-[calc(100vh-4.5rem)]">
  <div className="mx-auto flex max-w-[1600px]">
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-900 lg:block">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <nav className="mt-4 space-y-1" aria-label={`${label} navigation`}>{items.map(({ to, label: itemLabel, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}><Icon className="h-[18px] w-[18px]" />{itemLabel}</NavLink>)}</nav>
    </aside>
    <main className="min-w-0 flex-1"><nav className="sticky top-16 z-20 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:hidden" aria-label={`${label} mobile navigation`}>{items.map(({ to, label: itemLabel, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "text-slate-600 dark:text-slate-300"}`}><Icon className="h-4 w-4" />{itemLabel}</NavLink>)}</nav><div className="page-frame max-w-none xl:px-10"><Outlet /></div></main>
  </div>
</div>;

export default DashboardShell;
