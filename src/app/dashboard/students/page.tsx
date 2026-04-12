"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { ApiError } from "@/types/auth";

import { useRouter } from "next/navigation";

interface StudentLink {
  id: string;
  status: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentLink[]>([]);
  const [filtered, setFiltered] = useState<StudentLink[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          s.student.name.toLowerCase().includes(q) ||
          s.student.email.toLowerCase().includes(q),
      ),
    );
  }, [search, students]);

  async function fetchStudents() {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/students", form);
      setSuccess("Aluno cadastrado com sucesso!");
      setForm({ name: "", email: "", password: "" });
      setModalOpen(false);
      fetchStudents();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Erro ao cadastrar aluno");
    } finally {
      setSubmitting(false);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* top bar */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-syne font-bold text-2xl text-white">Alunos</h1>
            <p className="text-xs text-white/25 mt-1">
              Gerencie seus alunos vinculados
            </p>
          </div>
          <button
            onClick={() => {
              setModalOpen(true);
              setError("");
              setSuccess("");
            }}
            className="bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Cadastrar aluno
          </button>
        </div>

        {success && <p className="text-sm text-[#C8F04C] mb-4">{success}</p>}

        {/* search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151515] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#C8F04C]/40 transition-colors"
          />
        </div>

        {/* tabela */}
        {loading ? (
          <p className="text-sm text-white/20">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/20">Nenhum aluno encontrado.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[11px] text-white/25 uppercase tracking-wider pb-3 border-b border-white/5 px-4">
                  Aluno
                </th>
                <th className="text-left text-[11px] text-white/25 uppercase tracking-wider pb-3 border-b border-white/5 px-4">
                  Status
                </th>
                <th className="text-left text-[11px] text-white/25 uppercase tracking-wider pb-3 border-b border-white/5 px-4">
                  Desde
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() =>
                    router.push(`/dashboard/students/${s.student.id}`)
                  }
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C8F04C]/10 flex items-center justify-center text-[11px] font-bold text-[#C8F04C] shrink-0">
                        {getInitials(s.student.name)}
                      </div>
                      <div>
                        <p className="text-sm text-white/80">
                          {s.student.name}
                        </p>
                        <p className="text-xs text-white/25">
                          {s.student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 border-b border-white/5">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full ${
                        s.status === "APPROVED"
                          ? "bg-[#C8F04C]/10 text-[#C8F04C]"
                          : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {s.status === "APPROVED" ? "aprovado" : "pendente"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-white/5 text-sm text-white/30">
                    {formatDate(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-7 w-full max-w-sm mx-4">
            <h2 className="font-syne font-bold text-lg text-white mb-1">
              Cadastrar aluno
            </h2>
            <p className="text-xs text-white/30 mb-6">
              O aluno receberá acesso à plataforma
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              {[
                {
                  label: "Nome completo",
                  key: "name",
                  type: "text",
                  placeholder: "João Silva",
                },
                {
                  label: "E-mail",
                  key: "email",
                  type: "email",
                  placeholder: "joao@email.com",
                },
                {
                  label: "Senha",
                  key: "password",
                  type: "password",
                  placeholder: "mín. 6 caracteres",
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-white/30 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    required
                    className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20"
                  />
                </div>
              ))}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-transparent border border-white/5 rounded-lg text-sm text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
