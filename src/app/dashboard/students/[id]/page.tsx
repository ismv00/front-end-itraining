"use client";

import { useEffect, useState } from "react";
import { exercisesByMuscle, muscleGroups } from "@/data/exercise";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { ApiError } from "@/types/auth";

interface StudentDetail {
  id: string;
  status: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface Workout {
  id: string;
  title: string;
  description?: string;
  studentId: string;
  exercises?: Exercise[];
}

export default function StudentDetailPage() {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [studentLink, setStudentLink] = useState<StudentDetail | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [workoutForm, setWorkoutForm] = useState({
    title: "",
    description: "",
  });
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const [studentsRes, workoutsRes] = await Promise.all([
        api.get("/students"),
        api.get("/workouts"),
      ]);

      const link = studentsRes.data.find(
        (s: StudentDetail) => s.student.id === id,
      );
      setStudentLink(link || null);

      const studentWorkouts = workoutsRes.data.filter(
        (w: Workout) => w.studentId === id,
      );

      const workoutsWithExercises = await Promise.all(
        studentWorkouts.map(async (w: Workout) => {
          try {
            const { data } = await api.get(`/workouts/${w.id}/exercises`);
            return { ...w, exercises: data };
          } catch {
            return { ...w, exercises: [] };
          }
        }),
      );

      setWorkouts(workoutsWithExercises);
    } finally {
      setLoading(false);
    }
  }

  async function fetchExercises(workoutId: string) {
    try {
      const { data } = await api.get(`/workouts/${workoutId}/exercises`);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workoutId ? { ...w, exercises: data } : w)),
      );
    } catch {
      console.error("Erro ao buscar exercícios");
    }
  }

  async function handleCreateWorkout(e: React.FormEvent) {
    e.preventDefault();
    if (!studentLink) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/workouts", {
        ...workoutForm,
        studentId: studentLink.student.id,
      });
      setWorkoutModalOpen(false);
      setWorkoutForm({ title: "", description: "" });
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
    if (!selectedWorkoutId) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/workouts/${selectedWorkoutId}/exercises`, {
        name: exerciseForm.name,
        sets: Number(exerciseForm.sets),
        reps: Number(exerciseForm.reps),
        weight: exerciseForm.weight ? Number(exerciseForm.weight) : undefined,
      });
      setExerciseModalOpen(false);
      setExerciseForm({ name: "", sets: "", reps: "", weight: "" });
      fetchExercises(selectedWorkoutId);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Erro ao criar exercício");
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

  const totalExercises = workouts.reduce(
    (acc, w) => acc + (w.exercises?.length || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <span className="text-white/30 text-sm">Carregando...</span>
      </div>
    );
  }

  if (!studentLink) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <span className="text-white/30 text-sm">Aluno não encontrado.</span>
      </div>
    );
  }

  async function handleUnlink() {
    const confirmed = window.confirm(
      "Tem certeza que deseja desvincular este aluno?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/links/${studentLink?.id}`);
      router.push("/dashboard/students");
    } catch {
      alert("Erro ao desvincular aluno.");
    }
  }

  async function handleDeleteExercise(workoutId: string, exerciseId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este exercício?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
      fetchExercises(workoutId);
    } catch {
      alert("Erro ao excluir exercício.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* voltar */}
        <button
          onClick={() => router.push("/dashboard/students")}
          className="flex items-center gap-1.5 text-xs text-white/25 hover:text-white/50 transition-colors mb-6"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 3L4 7l4 4" />
          </svg>
          Voltar para alunos
        </button>

        {/* perfil */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C8F04C]/10 flex items-center justify-center font-syne font-extrabold text-xl text-[#C8F04C]">
              {getInitials(studentLink.student.name)}
            </div>
            <div>
              <h1 className="font-syne font-bold text-xl text-white">
                {studentLink.student.name}
              </h1>
              <p className="text-xs text-white/30 mt-0.5">
                {studentLink.student.email}
              </p>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#C8F04C]/10 text-[#C8F04C] mt-1.5 inline-block">
                {studentLink.status === "APPROVED" ? "aprovado" : "pendente"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUnlink}
              className="border border-red-400/20 text-red-400/50 hover:text-red-400 hover:border-red-400/40 font-syne font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
            >
              Desvincular
            </button>
            <button
              onClick={() => {
                setWorkoutModalOpen(true);
                setError("");
              }}
              className="bg-[#C8F04C] text-[#0e0e0e] font-syne font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              + Criar treino
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5">
            <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">
              Treinos
            </p>
            <p className="font-syne font-extrabold text-3xl text-[#C8F04C]">
              {workouts.length}
            </p>
          </div>
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5">
            <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">
              Exercícios
            </p>
            <p className="font-syne font-extrabold text-3xl text-white">
              {totalExercises}
            </p>
          </div>
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5">
            <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">
              Vinculado desde
            </p>
            <p className="font-syne font-bold text-base text-white mt-1">
              {formatDate(studentLink.createdAt)}
            </p>
          </div>
        </div>

        {/* treinos */}
        <h2 className="font-syne font-bold text-sm text-white mb-4">Treinos</h2>

        {workouts.length === 0 ? (
          <p className="text-sm text-white/20">Nenhum treino criado ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden hover:border-[#C8F04C]/20 transition-colors"
              >
                {/* header do treino */}
                <div
                  className="flex justify-between items-center p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedWorkout(
                      expandedWorkout === workout.id ? null : workout.id,
                    )
                  }
                >
                  <div>
                    <h3 className="font-syne font-bold text-sm text-white">
                      {workout.title}
                    </h3>
                    {workout.description && (
                      <p className="text-xs text-white/25 mt-0.5">
                        {workout.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/25">
                      {workout.exercises?.length || 0} exercícios
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`text-white/25 transition-transform ${expandedWorkout === workout.id ? "rotate-180" : ""}`}
                    >
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </div>
                </div>

                {/* exercícios expandidos */}
                {expandedWorkout === workout.id && (
                  <div className="border-t border-white/5 px-5 pb-5 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] text-white/25 uppercase tracking-wider">
                        Exercícios
                      </p>
                      <button
                        onClick={() => {
                          setSelectedWorkoutId(workout.id);
                          setExerciseModalOpen(true);
                          setError("");
                        }}
                        className="text-[11px] text-[#C8F04C] hover:opacity-70 transition-opacity"
                      >
                        + Adicionar
                      </button>
                    </div>

                    {workout.exercises?.length === 0 ? (
                      <p className="text-xs text-white/20">
                        Nenhum exercício ainda.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {workout.exercises?.map((ex) => (
                          <div
                            key={ex.id}
                            className="bg-[#1a1a1a] rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm text-white/80">{ex.name}</p>
                              <button
                                onClick={() =>
                                  handleDeleteExercise(workout.id, ex.id)
                                }
                                className="text-red-400/30 hover:text-red-400 transition-colors text-xs"
                              >
                                excluir
                              </button>
                            </div>
                            <div className="flex gap-3">
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
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* modal criar treino */}
      {workoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#151515] border border-white/5 rounded-xl p-7 w-full max-w-sm mx-4">
            <h2 className="font-syne font-bold text-lg text-white mb-1">
              Criar treino
            </h2>
            <p className="text-xs text-white/30 mb-6">
              Para: {studentLink.student.name}
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
                  value={workoutForm.title}
                  onChange={(e) =>
                    setWorkoutForm({ ...workoutForm, title: e.target.value })
                  }
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
                  value={workoutForm.description}
                  onChange={(e) =>
                    setWorkoutForm({
                      ...workoutForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20 resize-none"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setWorkoutModalOpen(false)}
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
              {workouts.find((w) => w.id === selectedWorkoutId)?.title}
            </p>

            <form
              onSubmit={handleCreateExercise}
              className="flex flex-col gap-4"
            >
              {/* grupo muscular */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-white/30 uppercase tracking-wider">
                  Grupo muscular
                </label>
                <select
                  value={selectedMuscle}
                  onChange={(e) => {
                    setSelectedMuscle(e.target.value);
                    setExerciseForm({ ...exerciseForm, name: "" });
                  }}
                  className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors"
                >
                  <option value="">Selecione um grupo</option>
                  {muscleGroups.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* exercício */}
              {selectedMuscle && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-white/30 uppercase tracking-wider">
                    Exercício
                  </label>
                  <select
                    value={exerciseForm.name}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, name: e.target.value })
                    }
                    className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors"
                  >
                    <option value="">Selecione um exercício</option>
                    {exercisesByMuscle[selectedMuscle].map((ex) => (
                      <option key={ex.apiName} value={ex.apiName}>
                        {ex.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* ou digitar manualmente */}
              {selectedMuscle && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-white/30 uppercase tracking-wider">
                    Ou digite manualmente
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Supino Reto"
                    value={exerciseForm.name}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, name: e.target.value })
                    }
                    className="bg-white/5 border border-white/5 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-[#C8F04C]/50 transition-colors placeholder-white/20"
                  />
                </div>
              )}

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

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setExerciseModalOpen(false);
                    setSelectedMuscle("");
                  }}
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
