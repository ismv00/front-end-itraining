"use client";

import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: "Alunos",
    path: "/dashboard/students",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" />
      </svg>
    ),
  },
  {
    label: "Treinos",
    path: "/dashboard/workouts",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 6h8M4 10h5M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    Cookies.remove("token");
    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação é irreversível.",
    );
    if (!confirmed) return;

    try {
      await api.delete("/users/me");
      Cookies.remove("token");
      router.push("/login");
    } catch {
      alert("Erro ao excluir conta.");
    }
  }

  return (
    <aside className="w-[220px] bg-[#111] border-r border-white/5 flex flex-col py-8 shrink-0">
      <span className="font-syne font-extrabold text-lg text-white px-6 mb-8">
        i<span className="text-[#C8F04C]">Training</span>
      </span>

      <nav className="flex flex-col flex-1">
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-all border-l-2 ${
                active
                  ? "text-[#C8F04C] border-[#C8F04C] bg-[#C8F04C]/5"
                  : "text-white/30 border-transparent hover:text-white/50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}

        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-3 px-6 py-2.5 text-sm text-red-400/50 border-l-2 border-transparent hover:text-red-400 transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
          </svg>
          Excluir conta
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-2.5 text-sm text-white/30 border-l-2 border-transparent hover:text-white/50 transition-all mt-auto"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6" />
          </svg>
          Sair
        </button>
      </nav>
    </aside>
  );
}
