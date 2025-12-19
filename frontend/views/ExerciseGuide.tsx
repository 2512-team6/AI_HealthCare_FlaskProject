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
   부위별 대표 이미지 (UI 전용)
========================= */
const PART_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=80' , // 목
  2: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80' , // 어깨
  3: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80', // 가슴
  4: 'https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=1200' , // 등
  5: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200' , // 복부
  6: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=1200' , // 하체
  7: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=1200' , // 팔
  8: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1200' , // 엉덩이
};

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTS.map(part => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className="
                flex items-center gap-4
                bg-slate-800 text-white
                p-6 rounded-2xl
                hover:bg-slate-700 transition
              "
            >
              {/* 아이콘 영역 (임시 원형) */}
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-lg font-bold">
                {part.name}
              </div>

              <div className="text-left">
                <h3 className="text-lg font-bold">{part.desc}</h3>
              </div>
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

          {/* 부위 대표 이미지 (추가된 부분) */}
          <div
            className="h-64 rounded-2xl bg-center bg-cover relative"
            style={{
              backgroundImage: `url(${PART_IMAGES[selectedPart]})`,
            }}
          >
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl" />

            {/* 부위명 텍스트 */}
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-bold text-emerald-400">
                {PARTS.find(p => p.id === selectedPart)?.name}
              </h2>
              <p className="text-sm opacity-90">
                {PARTS.find(p => p.id === selectedPart)?.desc}
              </p>
            </div>
          </div>

          {/* 기존 운동 카드 목록 (그대로 유지) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXERCISES
              .filter(ex => ex.part_id === selectedPart)
              .map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className="bg-white p-6 rounded-xl border text-left hover:shadow-md transition"
                >
                  {/* <span className="text-xs text-emerald-600 font-semibold">
                    {ex.part_name}
                  </span> */}
                  <h3 className="font-bold text-[13px] mt-1 text-emerald-600">{ex.name}</h3>
                  <p className="text-[12px] text-slate-600">{ex.summary}</p>
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
        <div className="space-y-5">
          <button
            onClick={() => setSelectedExercise(null)}
            className="text-emerald-600 hover:underline"
          >
            ← 목록으로
          </button>

          {/* ===== 상단 요약 카드 ===== */}
          <div className="bg-white p-8 rounded-2xl border space-y-4">
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
              {selectedExercise.part_name}
            </span>

            <h2 className="text-2xl font-bold text-slate-900">
              {selectedExercise.name}
            </h2>

            <p className="text-[14px] text-slate-600">
              {selectedExercise.summary}
            </p>

            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-2">
              <span className="px-3 py-1 bg-slate-100 rounded-full">
                MET {selectedExercise.met}
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-full">
                {selectedExercise.difficulty}
              </span>
              <span className="px-3 py-1 bg-slate-100 rounded-full">
                {selectedExercise.equipment}
              </span>
            </div>
          </div>

          {/* ===== 운동 코칭 ===== */}
          <div className="bg-emerald-50 p-6 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-emerald-700">운동 코칭</h3>

            <p className="text-[14px]">
              <strong className="text-slate-700">호흡</strong> · {selectedExercise.guide.breathing}
            </p>
            <p className="text-[14px]">
              <strong className="text-slate-700">자세 팁</strong> · {selectedExercise.guide.posture_tip}
            </p>
            <p className="text-[13px] text-red-600">
              ⚠ {selectedExercise.guide.common_mistake}
            </p>
          </div>

          {/* ===== 동작 가이드 ===== */}
          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h3 className="text-lg font-bold">동작 가이드</h3>

            <ul className="space-y-3">
              {selectedExercise.steps.map(step => (
                <li key={step.order} className="text-[14px]">
                  <strong className="text-emerald-600">
                    STEP {step.order}
                  </strong>
                  <span className="ml-2 font-semibold">{step.title}</span>
                  <p className="text-slate-600 mt-1">
                    {step.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== 운동 효과 ===== */}
          <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold">운동 효과</h3>

            <p className="text-[14px]">
              <strong className="text-emerald-600">타겟 근육</strong> : {selectedExercise.effects.target_muscles.join(', ')}
            </p>
            <p className="text-[14px]">
              <strong className="text-emerald-600">주요 효과</strong> : {selectedExercise.effects.primary}
            </p>
            <p className="text-[14px]">
              <strong className="text-emerald-600">부가 효과</strong> : {selectedExercise.effects.secondary.join(', ')}
            </p>
            <p className="text-[14px]">
              <strong className="text-emerald-600">추천 대상</strong> : {selectedExercise.effects.recommended_for.join(', ')}
            </p>

            <p className="text-red-600 text-[13px] mt-2">
              ⚠ {selectedExercise.effects.caution}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseGuide;
