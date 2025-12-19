import React, { useState } from 'react';
import exerciseData from '../data/exercise_app_final_64.json';

/* =========================
   타입 정의 (그대로 유지)
========================= */
export type Difficulty = '초급' | '중급' | '고급';

export interface ExerciseGuideInfo {
  breathing: string;
  posture_tip: string;
  common_mistake: string;
}

export interface ExerciseStep {
  order: number;
  title: string;
  description: string;
}

export interface ExerciseEffect {
  target_muscles: string[];
  primary: string;
  secondary: string[];
  recommended_for: string[];
  caution: string;
}

export interface Exercise {
  id: number;
  part_id: number;
  part_name: string;
  name: string;
  summary: string;
  equipment: string;
  difficulty: Difficulty;
  met: number;
  guide: ExerciseGuideInfo;
  steps: ExerciseStep[];
  effects: ExerciseEffect;
}

/* =========================
   데이터
========================= */
const EXERCISES: Exercise[] = exerciseData as Exercise[];

/* 부위 대분류 (UI용) */
const PARTS = [
  { id: 1, name: '목', desc: '거북목 및 경추 긴장 완화' },
  { id: 2, name: '어깨', desc: '삼각근 및 어깨 안정성 강화' },
  { id: 3, name: '가슴', desc: '상체 전면 근력 강화' },
  { id: 4, name: '등', desc: '자세 교정 및 광배근 강화' },
  { id: 5, name: '복부', desc: '코어 안정성 강화' },
  { id: 6, name: '하체', desc: '하체 근력 및 기초대사량 증가' },
  { id: 7, name: '팔', desc: '이두·삼두 라인 개선' },
  { id: 8, name: '엉덩이', desc: '힙업 및 골반 안정성 강화' },
];

/* =========================
   컴포넌트
========================= */
const ExerciseGuide: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <div className="space-y-10 pb-16">

      {/* =====================
          1️⃣ 부위 대분류 (3번째 이미지)
      ===================== */}
      {!selectedPart && !selectedExercise && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {PARTS.map(part => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className="bg-white p-8 rounded-2xl border text-left hover:shadow-md"
            >
              <h3 className="text-xl font-bold">{part.name}</h3>
              <p className="text-sm text-slate-600">{part.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* =====================
          2️⃣ 부위별 운동 목록
      ===================== */}
      {selectedPart && !selectedExercise && (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedPart(null)}
            className="text-emerald-600"
          >
            ← 목록으로
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXERCISES
              .filter(ex => ex.part_id === selectedPart)
              .map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className="bg-white p-6 rounded-xl border text-left hover:shadow-md transition"
                >
                  <span className="text-xs text-emerald-600 font-semibold">
                    {ex.part_name}
                  </span>
                  <h3 className="font-bold text-lg mt-1">{ex.name}</h3>
                  <p className="text-sm text-slate-600">{ex.summary}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    MET {ex.met} · {ex.difficulty} · {ex.equipment}
                  </p>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* =====================
          3️⃣ 운동 상세 (🔥 1번째 이미지 그대로)
      ===================== */}
      {selectedExercise && (
        <div className="bg-white p-8 rounded-2xl border space-y-8">
          <button
            onClick={() => setSelectedExercise(null)}
            className="text-emerald-600 hover:underline"
          >
            ← 목록으로
          </button>

          <div>
            <span className="text-sm text-emerald-600 font-semibold">
              {selectedExercise.part_name}
            </span>
            <h2 className="text-3xl font-bold">{selectedExercise.name}</h2>
            <p className="text-slate-600">{selectedExercise.summary}</p>
            <p className="text-sm text-slate-500 mt-2">
              MET {selectedExercise.met} · {selectedExercise.difficulty} · {selectedExercise.equipment}
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl space-y-2">
            <h3 className="text-xl font-bold">운동 코칭</h3>
            <p><strong>호흡:</strong> {selectedExercise.guide.breathing}</p>
            <p><strong>자세 팁:</strong> {selectedExercise.guide.posture_tip}</p>
            <p className="text-red-600">
              <strong>주의:</strong> {selectedExercise.guide.common_mistake}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">동작 가이드</h3>
            <ul className="space-y-4">
              {selectedExercise.steps.map(step => (
                <li key={step.order}>
                  <strong>
                    STEP {step.order}. {step.title}
                  </strong>
                  <p>{step.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl space-y-2">
            <h3 className="text-xl font-bold">운동 효과</h3>
            <p><strong>타겟 근육:</strong> {selectedExercise.effects.target_muscles.join(', ')}</p>
            <p><strong>주요 효과:</strong> {selectedExercise.effects.primary}</p>
            <p><strong>부가 효과:</strong> {selectedExercise.effects.secondary.join(', ')}</p>
            <p><strong>추천 대상:</strong> {selectedExercise.effects.recommended_for.join(', ')}</p>
            <p className="text-red-600 text-sm">⚠ {selectedExercise.effects.caution}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseGuide;
