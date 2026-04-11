"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { ApiError } from "@/types/auth";

interface Student {
  id: string;
  student: {
    id: string;
    name: string;
  };
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  finalWeight?: number;
}

interface Workout {
  id: string;
  title: string;
  description?: string;
  studentId: string;
  student: {
    id: string;
    name: string;
  };
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filtered, setFiltered] = useState<Workout[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState("");
  const [exerciseError, setExerciseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    studentId: "",
  });
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      workouts.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.student?.name.toLowerCase().includes(q),
      ),
    );
  }, [search, workouts]);

  async function fetchData() {
    try {
      const [workoutsRes, studentsRes] = await Promise.all([
        api.get("/workouts"),
        api.get("/students"),
      ]);
      setWorkouts(workoutsRes.data);
      setFiltered(workoutsRes.data);
      setStudents(studentsRes.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectWorkout(workout: Workout) {
    setSelectedWorkout(workout);
    fetchExercises(workout.id);
  }

  async function fetchExercises(workoutId: string) {
    try {
      const { data } = await api.get(`/workouts/${workoutId}/exercises`);
      setExercises(data);
    } catch {
      setExercises([]);
    }
  }

  async function handleCreateWorkout(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/workouts", form);
      setModalOpen(false);
      setForm({ title: "", description: "", studentId: "" });
      fetchData();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Erro ao criar treino");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateExercise(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedWorkout) return;
    setSubmitting(true);
    setExerciseError("");
    try {
      await api.post(`/workouts/${selectedWorkout.id}/exercises`, {
        name: exerciseForm.name,
        sets: Number(exerciseForm.sets),
        reps: Number(exerciseForm.reps),
        weight: exerciseForm.weight ? Number(exerciseForm.weight) : undefined,
      });
      setExerciseModalOpen(false);
      setExerciseForm({ name: "", sets: "", reps: "", weight: "" });
      fetchExercises(selectedWorkout.id);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setExerciseError(
        apiError.response?.data?.error || "Erro ao criar exercício",
      );
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

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex">
      <Sidebar />

      <main className="flex-1 p-10 relative">
        {/* top bar */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-syne font-bold text-2xl text-white">Treinos</h1>
            <p className="text-xs text-white/25 mt-1">
              Gerencie os treinos dos seus alunos
            </p>
          </div>
          <button
            onClick={() => {
              setModalOpen(true);
              setError("");
            }}
            className="bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Criar treino
          </button>
        </div>

        {/* search */}
        <input
          type="text"
          placeholder="Buscar por título ou aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151515] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#C8F04C]/40 transition-colors mb-6"
        />

        {/* cards */}
        {loading ? (
          <p className="text-sm text-white/20">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/20">Nenhum treino encontrado.</p>
        ) : (
          <div
            className={`grid gap-4 ${selectedWorkout ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {filtered.map((workout) => (
              <div
                key={workout.id}
                onClick={() => handleSelectWorkout(workout)}
                className={`bg-[#151515] border rounded-xl p-5 cursor-pointer transition-all hover:border-[#C8F04C]/30 ${
                  selectedWorkout?.id === workout.id
                    ? "border-[#C8F04C]/50"
                    : "border-white/5"
                }`}
              >
                <h3 className="font-syne font-bold text-sm text-white mb-1">
                  {workout.title}
                </h3>
                {workout.description && (
                  <p className="text-xs text-white/30 mb-3 leading-relaxed line-clamp-2">
                    {workout.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-[#C8F04C]/10 flex items-center justify-center text-[9px] font-bold text-[#C8F04C]">
                    {workout.student?.name
                      ? getInitials(workout.student.name)
                      : "?"}
                  </div>
                  <span className="text-xs text-white/30">
                    {workout.student?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* detail panel */}
        {selectedWorkout && (
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-[#111] border-l border-white/5 p-7 flex flex-col gap-4 overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-syne font-bold text-base text-white">
                  {selectedWorkout.title}
                </h2>
                <p className="text-xs text-white/25 mt-1">
                  {selectedWorkout.student?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="text-white/20 hover:text-white/50 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {selectedWorkout.description && (
              <p className="text-xs text-white/30 leading-relaxed border-t border-white/5 pt-4">
                {selectedWorkout.description}
              </p>
            )}

            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-white/25 uppercase tracking-wider">
                  Exercícios
                </p>
                <button
                  onClick={() => {
                    setExerciseModalOpen(true);
                    setExerciseError("");
                  }}
                  className="text-[11px] text-[#C8F04C] hover:opacity-70 transition-opacity"
                >
                  + Adicionar
                </button>
              </div>

              {exercises.length === 0 ? (
                <p className="text-xs text-white/20">
                  Nenhum exercício cadastrado.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {exercises.map((ex) => (
                    <div key={ex.id} className="bg-[#1a1a1a] rounded-lg p-3">
                      <p className="text-sm text-white/80 font-medium mb-2">
                        {ex.name}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <span className="text-xs text-white/30">
                          <span className="text-[#C8F04C] font-semibold">
                            {ex.sets}
                          </span>{" "}
                          séries
                        </span>
                        <span className="text-xs text-white/30">
                          <span className="text-[#C8F04C] font-semibold">
                            {ex.reps}
                          </span>{" "}
                          reps
                        </span>
                        {ex.weight && (
                          <span className="text-xs text-white/30">
                            <span className="text-[#C8F04C] font-semibold">
                              {ex.weight}kg
                            </span>{" "}
                            carga
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* modal criar treino */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-7 w-full max-w-sm mx-4">
            <h2 className="font-syne font-bold text-lg text-white mb-1">
              Criar treino
            </h2>
            <p className="text-xs text-white/30 mb-6">
              Associe um treino a um aluno
            </p>

            <form
              onSubmit={handleCreateWorkout}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-white/30 uppercase tracking-wider">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treino A — Peito e Tríceps"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-white/30 uppercase tracking-wider">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o objetivo do treino..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20 resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-white/30 uppercase tracking-wider">
                  Aluno
                </label>
                <select
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  required
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors"
                >
                  <option value="">Selecione um aluno</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.student.id}>
                      {s.student.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  {submitting ? "Criando..." : "Criar treino"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* modal adicionar exercício */}
      {exerciseModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-7 w-full max-w-sm mx-4">
            <h2 className="font-syne font-bold text-lg text-white mb-1">
              Adicionar exercício
            </h2>
            <p className="text-xs text-white/30 mb-6">
              Para: {selectedWorkout?.title}
            </p>

            <form
              onSubmit={handleCreateExercise}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-white/30 uppercase tracking-wider">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Ex: Supino Reto"
                  value={exerciseForm.name}
                  onChange={(e) =>
                    setExerciseForm({ ...exerciseForm, name: e.target.value })
                  }
                  required
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Séries", key: "sets", placeholder: "4" },
                  { label: "Reps", key: "reps", placeholder: "12" },
                  { label: "Carga (kg)", key: "weight", placeholder: "60" },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-white/30 uppercase tracking-wider">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={
                        exerciseForm[field.key as keyof typeof exerciseForm]
                      }
                      onChange={(e) =>
                        setExerciseForm({
                          ...exerciseForm,
                          [field.key]: e.target.value,
                        })
                      }
                      required={field.key !== "weight"}
                      className="bg-white/5 border border-white/5 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20"
                    />
                  </div>
                ))}
              </div>

              {exerciseError && (
                <p className="text-sm text-red-400">{exerciseError}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setExerciseModalOpen(false)}
                  className="flex-1 py-2.5 bg-transparent border border-white/5 rounded-lg text-sm text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
