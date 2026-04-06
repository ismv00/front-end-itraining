"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { Sidebar } from "../../components/Sidebar";

interface Student {
  id: string;
  studentId: string;
  status: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

interface Link {
  id: string;
  status: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

interface Workout {
  id: string;
  title: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [pendingLinks, setPendingLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, workoutsRes, linksRes] = await Promise.all([
          api.get("/students"),
          api.get("/workouts"),
          api.get("/links/personal/pending"),
        ]);
        setStudents(studentsRes.data);
        setWorkouts(workoutsRes.data);
        setPendingLinks(linksRes.data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const today = new Date()
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/\b\w/g, (c) => c.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <span className="text-white/30 text-sm">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* top bar */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-2xl text-white">
            Olá, <span className="text-[#C8F04C]">Personal</span> 👋
          </h1>
          <p className="text-xs text-white/25 mt-1 capitalize">{today}</p>
        </div>

        {/* cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-[#151515] border border-[#C8F04C]/15 rounded-xl p-6">
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
              Alunos ativos
            </p>
            <p className="font-syne font-extrabold text-4xl text-[#C8F04C]">
              {students.length}
            </p>
            <p className="text-xs text-white/20 mt-2">vinculados e aprovados</p>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-xl p-6">
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
              Treinos criados
            </p>
            <p className="font-syne font-extrabold text-4xl text-white">
              {workouts.length}
            </p>
            <p className="text-xs text-white/20 mt-2">no total</p>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-xl p-6">
            <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
              Vínculos pendentes
            </p>
            <p className="font-syne font-extrabold text-4xl text-amber-400">
              {pendingLinks.length}
            </p>
            {pendingLinks.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-amber-400/60">
                  aguardando resposta
                </span>
              </div>
            )}
          </div>
        </div>

        {/* alunos recentes */}
        <div>
          <h2 className="font-syne font-bold text-sm text-white mb-4">
            Alunos recentes
          </h2>

          {students.length === 0 ? (
            <p className="text-sm text-white/20">
              Nenhum aluno vinculado ainda.
            </p>
          ) : (
            <div className="flex flex-col">
              {students.slice(0, 5).map((student) => {
                const initials = student.student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 py-3 border-b border-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C8F04C]/10 flex items-center justify-center text-[11px] font-bold text-[#C8F04C] shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">
                        {student.student.name}
                      </p>
                      <p className="text-xs text-white/25">
                        {student.student.email}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#C8F04C]/10 text-[#C8F04C]">
                      aprovado
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
