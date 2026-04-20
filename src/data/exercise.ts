export interface Exercise {
  label: string;
  apiName: string;
}

export const exercisesByMuscle: Record<string, Exercise[]> = {
  Peito: [
    { label: "Supino Reto", apiName: "barbell bench press" },
    { label: "Supino Inclinado", apiName: "barbell incline bench press" },
    { label: "Supino Declinado", apiName: "barbell decline bench press" },
    { label: "Supino com Halteres", apiName: "dumbbell bench press" },
    { label: "Crucifixo", apiName: "dumbbell fly" },
    { label: "Crucifixo Inclinado", apiName: "incline dumbbell fly" },
    { label: "Voador", apiName: "pec deck fly" },
    { label: "Crossover", apiName: "cable crossover" },
    { label: "Flexão de Braço", apiName: "push up" },
    { label: "Flexão Archer", apiName: "archer push up" },
    { label: "Mergulho Assistido", apiName: "assisted chest dip (kneeling)" },
    { label: "Pullover", apiName: "dumbbell pullover" },
    { label: "Supino com Band", apiName: "band bench press" },
  ],
  Costas: [
    { label: "Puxada Frontal", apiName: "lat pulldown" },
    { label: "Puxada Alternada", apiName: "alternate lateral pulldown" },
    { label: "Barra Fixa", apiName: "pull up" },
    { label: "Barra Fixa Assistida", apiName: "assisted pull-up" },
    { label: "Remada Curvada", apiName: "barbell bent over row" },
    { label: "Remada Unilateral", apiName: "dumbbell one arm row" },
    { label: "Remada Baixa", apiName: "seated cable row" },
    { label: "Remada Máquina", apiName: "machine row" },
    { label: "Levantamento Terra", apiName: "deadlift" },
    { label: "Encolhimento", apiName: "barbell shrug" },
    { label: "Extensão de Coluna", apiName: "back extension on exercise ball" },
  ],
  Ombro: [
    { label: "Desenvolvimento com Barra", apiName: "barbell overhead press" },
    {
      label: "Desenvolvimento com Halteres",
      apiName: "dumbbell shoulder press",
    },
    { label: "Arnold Press", apiName: "arnold press" },
    { label: "Elevação Lateral", apiName: "dumbbell lateral raise" },
    { label: "Elevação Frontal com Barra", apiName: "barbell front raise" },
    { label: "Elevação Frontal com Halteres", apiName: "dumbbell front raise" },
    { label: "Voador Invertido", apiName: "band reverse fly" },
    { label: "Remada Alta", apiName: "barbell upright row" },
    { label: "Desenvolvimento com Band", apiName: "band shoulder press" },
    {
      label: "Remada Posterior com Band",
      apiName: "band standing rear delt row",
    },
    { label: "Rear Delt Raise", apiName: "barbell rear delt raise" },
    { label: "Elevação Y com Band", apiName: "band y-raise" },
  ],
  Bíceps: [
    { label: "Rosca Direta", apiName: "barbell curl" },
    {
      label: "Rosca Alternada com Barra",
      apiName: "barbell alternate biceps curl",
    },
    {
      label: "Rosca Alternada com Halteres",
      apiName: "dumbbell alternate bicep curl",
    },
    { label: "Rosca Martelo", apiName: "hammer curl" },
    { label: "Rosca Concentrada", apiName: "concentration curl" },
    { label: "Rosca Concentrada com Band", apiName: "band concentration curl" },
    { label: "Rosca Scott", apiName: "ez barbell preacher curl" },
    { label: "Rosca no Cabo", apiName: "cable curl" },
    { label: "Rosca com Band", apiName: "band alternating biceps curl" },
  ],
  Tríceps: [
    { label: "Tríceps Corda", apiName: "cable triceps pushdown" },
    { label: "Tríceps Testa", apiName: "barbell skull crusher" },
    { label: "Tríceps Francês", apiName: "dumbbell tricep extension" },
    { label: "Tríceps Pulley", apiName: "triceps pushdown" },
    { label: "Supino Fechado", apiName: "barbell close-grip bench press" },
    { label: "Mergulho", apiName: "triceps dip" },
    { label: "Mergulho Assistido", apiName: "assisted triceps dip (kneeling)" },
    { label: "Tríceps Coice", apiName: "dumbbell kickback" },
    {
      label: "Tríceps Lateral com Band",
      apiName: "band side triceps extension",
    },
  ],
  Antebraço: [
    { label: "Flexão de Punho com Barra", apiName: "barbell wrist curl" },
    {
      label: "Extensão de Punho com Barra",
      apiName: "barbell reverse wrist curl",
    },
    { label: "Flexão de Punho com Band", apiName: "band wrist curl" },
    { label: "Extensão de Punho com Band", apiName: "band reverse wrist curl" },
    { label: "Flexão de Punho no Cabo", apiName: "cable reverse wrist curl" },
    {
      label: "Flexão de Punho em Pé",
      apiName: "barbell standing back wrist curl",
    },
  ],
  Pernas: [
    { label: "Agachamento Livre", apiName: "barbell squat" },
    { label: "Agachamento Hack", apiName: "hack squat" },
    { label: "Agachamento Sumô", apiName: "sumo squat" },
    { label: "Leg Press", apiName: "leg press" },
    { label: "Cadeira Extensora", apiName: "leg extension" },
    { label: "Cadeira Flexora", apiName: "leg curl" },
    { label: "Stiff", apiName: "romanian deadlift" },
    { label: "Avanço", apiName: "lunge" },
    { label: "Afundo", apiName: "dumbbell lunge" },
    { label: "Afundo Búlgaro", apiName: "bulgarian split squat" },
  ],
  Panturrilha: [
    {
      label: "Panturrilha em Pé com Barra",
      apiName: "barbell standing calf raise",
    },
    {
      label: "Panturrilha Sentado com Barra",
      apiName: "barbell seated calf raise",
    },
    {
      label: "Panturrilha Unilateral com Band",
      apiName: "band single leg calf raise",
    },
    {
      label: "Panturrilha no Chão com Barra",
      apiName: "barbell floor calf raise",
    },
    { label: "Standing Calf Raise", apiName: "standing calf raise" },
    { label: "Seated Calf Raise", apiName: "seated calf raise" },
  ],
  Abdômen: [
    { label: "Abdominal Supra", apiName: "crunch" },
    { label: "Sit-up 3/4", apiName: "3/4 sit-up" },
    { label: "Sit-up Completo", apiName: "arms overhead full sit-up (male)" },
    { label: "Abdominal Infra", apiName: "reverse crunch" },
    { label: "Prancha", apiName: "plank" },
    { label: "Oblíquo", apiName: "45° side bend" },
    { label: "Air Bike", apiName: "air bike" },
    { label: "Abdominal Alternado", apiName: "alternate heel touchers" },
    { label: "Elevação de Pernas", apiName: "leg raise" },
    { label: "Elevação de Joelhos", apiName: "assisted hanging knee raise" },
    { label: "Russian Twist", apiName: "russian twist" },
    { label: "Abdominal Máquina", apiName: "cable crunch" },
  ],
  Glúteo: [
    { label: "Elevação Pélvica", apiName: "hip thrust" },
    { label: "Glúteo no Cabo", apiName: "cable glute kickback" },
    { label: "Abdução de Quadril", apiName: "hip abduction" },
    {
      label: "Extensão de Quadril com Band",
      apiName: "band bent-over hip extension",
    },
    { label: "Step", apiName: "step up" },
    { label: "Coice com Caneleira", apiName: "donkey kick" },
  ],
};

export const muscleGroups = Object.keys(exercisesByMuscle);
