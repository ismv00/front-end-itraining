"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import type {
  Role,
  LoginPayload,
  RegisterPayload,
  ApiError,
} from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("PERSONAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    role: "PERSONAL",
  });

  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", loginData);
      Cookies.set("token", data.token, { expires: 1 });
      router.push("/dashboard");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { ...registerData, role });
      setSuccess("Conta criada com sucesso! Faça login para continuar.");
      setTab("login");
      setError("");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex">
      {/* lado esquerdo */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-white/5">
        <span className="font-syne font-extrabold text-xl text-white tracking-tight">
          i<span className="text-[#C8F04C]">Training</span>
        </span>

        <div>
          <h1 className="font-syne font-bold text-5xl text-white leading-tight tracking-tight">
            Treine com
            <br />
            <span className="text-[#C8F04C]">propósito.</span>
          </h1>
          <p className="text-sm text-white/30 mt-4 leading-relaxed max-w-xs">
            Plataforma para personals e alunos que levam a evolução a sério.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            {[
              { num: "2.4k", label: "alunos ativos" },
              { num: "380", label: "personals" },
              { num: "18k", label: "treinos criados" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-syne font-extrabold text-3xl text-[#C8F04C]">
                  {s.num}
                </span>
                <span className="text-xs text-white/25">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F04C]" />
            847 treinando agora
          </div>
        </div>
      </div>

      {/* lado direito */}
      <div className="w-full lg:w-[480px] bg-[#111] flex flex-col justify-center items-center px-10 py-12">
        <div className="w-full max-w-sm">
          {/* tabs */}
          <div className="flex border-b border-white/5 mb-8">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? "text-[#C8F04C] border-[#C8F04C]"
                    : "text-white/30 border-transparent hover:text-white/50"
                }`}
              >
                {t === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {success && <p className="text-sm text-[#C8F04C] mb-4">{success}</p>}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <h2 className="font-syne font-bold text-2xl text-white tracking-tight">
                  Bem-vindo de volta
                </h2>
                <p className="text-sm text-white/30 mt-1">
                  Acesse sua conta para continuar
                </p>
              </div>

              <Field label="E-mail">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="Senha">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </Field>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="text-center text-xs text-white/15 my-1">ou</div>

              <button
                type="button"
                onClick={() => setTab("register")}
                className="w-full py-3.5 bg-transparent border border-[#C8F04C]/30 text-[#C8F04C] font-syne font-semibold rounded-lg text-sm hover:border-[#C8F04C]/60 transition-colors"
              >
                Criar conta
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <h2 className="font-syne font-bold text-2xl text-white tracking-tight">
                  Criar conta
                </h2>
                <p className="text-sm text-white/30 mt-1">
                  Escolha como quer usar o iTraining
                </p>
              </div>

              <div className="flex gap-2">
                {(["PERSONAL", "STUDENT"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setRegisterData({ ...registerData, role: r });
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-sm transition-all border ${
                      role === r
                        ? "border-[#C8F04C]/60 text-[#C8F04C] bg-[#C8F04C]/5"
                        : "border-white/5 text-white/30 hover:text-white/50"
                    }`}
                  >
                    {r === "PERSONAL" ? "Sou personal" : "Sou aluno"}
                  </button>
                ))}
              </div>

              <Field label="Nome completo">
                <input
                  type="text"
                  placeholder="João Silva"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="E-mail">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
              </Field>

              <Field label="Senha">
                <input
                  type="password"
                  placeholder="mín. 6 caracteres"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </Field>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-white/30 uppercase tracking-wider">
        {label}
      </label>
      <div className="[&_input]:w-full [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/5 [&_input]:rounded-lg [&_input]:px-3.5 [&_input]:py-3 [&_input]:text-sm [&_input]:text-white [&_input]:outline-none [&_input]:transition-colors [&_input:focus]:border-[#C8F04C]/50 [&_input::placeholder]:text-white/20">
        {children}
      </div>
    </div>
  );
}
