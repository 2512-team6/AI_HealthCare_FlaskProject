
import React, { useState } from 'react';
import { ExercisePart, Exercise, ExerciseStep, ExerciseEffect } from '../types';

// Mock data based on the provided SQL structure
const EXERCISE_PARTS: ExercisePart[] = [
  { id: 1, name: '목', description: '거북목 개선 및 경추 긴장 완화' },
  { id: 2, name: '어깨', description: '상체 안정성과 어깨 근력 강화' },
  { id: 3, name: '가슴', description: '상체 근력 강화 및 체형 개선' },
  { id: 4, name: '등', description: '자세 교정 및 허리 부담 감소' },
  { id: 5, name: '복부', description: '코어 안정성 및 체지방 관리' },
  { id: 6, name: '하체', description: '기초대사량 증가 및 근력 강화' },
];

const EXERCISES: Exercise[] = [
  // 목
  { id: 101, part_id: 1, name: '넥 스트레치', summary: '목 근육 이완 스트레칭', equipment: '맨몸', difficulty: '초급', met: 2.0, is_representative: true },
  { id: 102, part_id: 1, name: '친턱 운동', summary: '거북목 교정 운동', equipment: '맨몸', difficulty: '초급', met: 2.0, is_representative: true },
  { id: 103, part_id: 1, name: '측면 목 스트레치', summary: '목 좌우 유연성 향상', equipment: '맨몸', difficulty: '초급', met: 2.0, is_representative: true },
  { id: 104, part_id: 1, name: '목 회전 운동', summary: '경추 가동성 향상', equipment: '맨몸', difficulty: '초급', met: 2.5, is_representative: true },
  // 어깨
  { id: 201, part_id: 2, name: '레터럴 레이즈', summary: '어깨 측면 근육 강화', equipment: '덤벨', difficulty: '초급', met: 4.0, is_representative: true },
  { id: 202, part_id: 2, name: '숄더 프레스', summary: '어깨 전반 근력 강화', equipment: '덤벨', difficulty: '중급', met: 5.0, is_representative: true },
  { id: 203, part_id: 2, name: '프론트 레이즈', summary: '어깨 전면 근육 강화', equipment: '덤벨', difficulty: '초급', met: 4.0, is_representative: true },
  { id: 204, part_id: 2, name: '어깨 스트레칭', summary: '어깨 긴장 완화', equipment: '맨몸', difficulty: '초급', met: 2.5, is_representative: true },
  // 가슴
  { id: 301, part_id: 3, name: '푸쉬업', summary: '가슴 및 상체 전반 강화', equipment: '맨몸', difficulty: '초급', met: 8.0, is_representative: true },
  { id: 302, part_id: 3, name: '벤치 프레스', summary: '대흉근 집중 강화', equipment: '머신', difficulty: '중급', met: 6.0, is_representative: true },
  { id: 303, part_id: 3, name: '체스트 플라이', summary: '가슴 근육 수축 강화', equipment: '머신', difficulty: '중급', met: 5.0, is_representative: true },
  { id: 304, part_id: 3, name: '가슴 스트레칭', summary: '가슴 근육 이완', equipment: '맨몸', difficulty: '초급', met: 2.5, is_representative: true },
  // 등
  { id: 401, part_id: 4, name: '풀업', summary: '광배근 및 상체 강화', equipment: '맨몸', difficulty: '고급', met: 8.0, is_representative: true },
  { id: 402, part_id: 4, name: '랫 풀다운', summary: '등 상부 근력 강화', equipment: '머신', difficulty: '중급', met: 5.5, is_representative: true },
  { id: 403, part_id: 4, name: '바벨 로우', summary: '등 전체 근력 강화', equipment: '머신', difficulty: '중급', met: 6.0, is_representative: true },
  { id: 404, part_id: 4, name: '등 스트레칭', summary: '척추 및 등 근육 이완', equipment: '맨몸', difficulty: '초급', met: 2.5, is_representative: true },
  // 복부
  { id: 501, part_id: 5, name: '크런치', summary: '복직근 강화', equipment: '맨몸', difficulty: '초급', met: 5.0, is_representative: true },
  { id: 502, part_id: 5, name: '플랭크', summary: '코어 전반 강화', equipment: '맨몸', difficulty: '중급', met: 4.0, is_representative: true },
  { id: 503, part_id: 5, name: '레그 레이즈', summary: '하복부 강화', equipment: '맨몸', difficulty: '중급', met: 5.0, is_representative: true },
  { id: 504, part_id: 5, name: '마운틴 클라이머', summary: '복부 및 유산소 강화', equipment: '맨몸', difficulty: '중급', met: 8.0, is_representative: true },
  // 하체
  { id: 601, part_id: 6, name: '스쿼트', summary: '하체 전반 근력 강화', equipment: '맨몸', difficulty: '초급', met: 5.0, is_representative: true },
  { id: 602, part_id: 6, name: '런지', summary: '하체 균형 및 근력 강화', equipment: '맨몸', difficulty: '중급', met: 5.5, is_representative: true },
  { id: 603, part_id: 6, name: '레그 프레스', summary: '대퇴사두근 강화', equipment: '머신', difficulty: '중급', met: 6.0, is_representative: true },
  { id: 604, part_id: 6, name: '카프 레이즈', summary: '종아리 근육 강화', equipment: '맨몸', difficulty: '초급', met: 3.5, is_representative: true },
];

const EXERCISE_STEPS: Record<number, ExerciseStep[]> = {
  201: [
    { id: 1, exercise_id: 201, step_order: 1, title: '시작 자세', description: '덤벨을 양손에 들고 팔을 몸 옆에 둔 상태로 똑바로 선다. 가슴을 펴고 어깨를 내린다.' },
    { id: 2, exercise_id: 201, step_order: 2, title: '팔 들어올리기', description: '팔꿈치를 살짝 굽힌 상태로 덤벨을 어깨 높이까지 천천히 들어 올린다. 손등이 천장을 향하게 한다.' },
    { id: 3, exercise_id: 201, step_order: 3, title: '내리기', description: '어깨 근육의 긴장을 유지하며 천천히 시작 자세로 돌아온다.' }
  ],
  601: [
    { id: 1, exercise_id: 601, step_order: 1, title: '스탠스', description: '발을 어깨너비로 벌리고 발끝을 약간 바깥쪽으로 향하게 선다.' },
    { id: 2, exercise_id: 601, step_order: 2, title: '내려가기', description: '무릎이 발끝을 넘지 않도록 주의하며 엉덩이를 뒤로 빼고 앉는다. 허리는 곧게 편다.' },
    { id: 3, exercise_id: 601, step_order: 3, title: '올라오기', description: '발바닥 전체로 지면을 밀어내며 천천히 일어난다.' }
  ]
};

const EXERCISE_EFFECTS: Record<number, ExerciseEffect> = {
  201: { id: 1, exercise_id: 201, target_muscles: '삼각근 측면', primary_effect: '어깨 측면 근력 강화', secondary_effect: '상체 실루엣 개선', caution: '반동을 사용하지 말고 손목이 꺾이지 않도록 주의' },
  601: { id: 2, exercise_id: 601, target_muscles: '대퇴사두근, 둔근', primary_effect: '하체 전반 근력 강화', secondary_effect: '기초대사량 향상', caution: '무릎이 안쪽으로 모이지 않도록 주의' }
};

const ExerciseGuide: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<ExercisePart | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const renderPartGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {EXERCISE_PARTS.map(part => (
        <button
          key={part.id}
          onClick={() => setSelectedPart(part)}
          className="bg-[#0F1B2D] p-8 rounded-3xl border border-white/5 hover:border-[#2DE2A6]/50 transition-all flex flex-col items-center group"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-[#2DE2A6] group-hover:scale-110 transition-transform">
            <PartIcon name={part.name} />
          </div>
          <h3 className="text-xl font-bold mb-2">{part.name}</h3>
          <p className="text-sm text-white/40 text-center leading-tight">{part.description}</p>
        </button>
      ))}
    </div>
  );

  const renderExerciseList = (partId: number) => {
    const partExercises = EXERCISES.filter(e => e.part_id === partId);
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedPart(null)} className="text-[#2DE2A6] flex items-center gap-2 mb-4 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          부위 선택으로 돌아가기
        </button>
        <h2 className="text-2xl font-bold mb-6 text-[#2DE2A6]">{selectedPart?.name} 부위 대표 운동</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="bg-[#0F1B2D] p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all text-left"
            >
              <div>
                <h4 className="font-bold text-lg">{ex.name}</h4>
                <p className="text-sm text-white/50">{ex.summary}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/10">{ex.equipment}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    ex.difficulty === '초급' ? 'bg-[#2DE2A6]/10 border-[#2DE2A6]/30 text-[#2DE2A6]' :
                    ex.difficulty === '중급' ? 'bg-[#FFB020]/10 border-[#FFB020]/30 text-[#FFB020]' : 'bg-[#FF5C7A]/10 border-[#FF5C7A]/30 text-[#FF5C7A]'
                  }`}>{ex.difficulty}</span>
                </div>
              </div>
              <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderExerciseDetail = (exercise: Exercise) => {
    const steps = EXERCISE_STEPS[exercise.id] || [
      { id: 1, exercise_id: exercise.id, step_order: 1, title: '준비', description: '바른 자세로 준비합니다. 호흡을 가다듬으세요.' },
      { id: 2, exercise_id: exercise.id, step_order: 2, title: '동작', description: '천천히 근육의 자극을 느끼며 동작을 수행합니다.' },
      { id: 3, exercise_id: exercise.id, step_order: 3, title: '마무리', description: '시작 자세로 돌아오며 근육을 이완합니다.' }
    ];
    const effects = EXERCISE_EFFECTS[exercise.id] || { 
      target_muscles: '주요 근육', 
      primary_effect: '근력 강화', 
      secondary_effect: '유연성 향상', 
      caution: '과도한 무게나 반동을 피하세요.' 
    };

    return (
      <div className="space-y-8 animate-fadeIn">
        <button onClick={() => setSelectedExercise(null)} className="text-[#2DE2A6] flex items-center gap-2 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          목록으로 돌아가기
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Info */}
          <div className="flex-1 space-y-8">
            <div className="bg-[#0F1B2D] p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
                  <p className="text-white/60">{exercise.summary}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white/40">MET</span>
                  <p className="text-2xl font-bold text-[#2DE2A6]">{exercise.met}</p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#2DE2A6] rounded-full"></span>
                  동작 가이드
                </h4>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2DE2A6] text-[#0B1220] flex items-center justify-center font-bold text-sm shrink-0">
                          {String(step.step_order).padStart(2, '0')}
                        </div>
                        {step.step_order !== steps.length && <div className="w-0.5 h-full bg-white/5 my-1"></div>}
                      </div>
                      <div className="pb-6">
                        <h5 className="font-bold mb-1 text-white/90">STEP {step.step_order}: {step.title}</h5>
                        <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Detail */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-[#0F1B2D] p-6 rounded-3xl border border-white/5">
              <h4 className="font-bold mb-4 text-[#2DE2A6]">운동 효과</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-white/30 uppercase block mb-1">타겟 근육</label>
                  <p className="text-sm font-medium">{effects.target_muscles}</p>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase block mb-1">주요 효과</label>
                  <p className="text-sm font-medium">{effects.primary_effect}</p>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase block mb-1">부가 효과</label>
                  <p className="text-sm font-medium">{effects.secondary_effect}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FF5C7A]/5 p-6 rounded-3xl border border-[#FF5C7A]/20">
              <h4 className="font-bold mb-3 text-[#FF5C7A] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                주의 사항
              </h4>
              <p className="text-xs text-[#FF5C7A] leading-relaxed opacity-80">{effects.caution}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {!selectedPart && renderPartGrid()}
      {selectedPart && !selectedExercise && renderExerciseList(selectedPart.id)}
      {selectedExercise && renderExerciseDetail(selectedExercise)}
    </div>
  );
};

const PartIcon = ({ name }: { name: string }) => {
  switch (name) {
    case '목': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case '어깨': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    case '가슴': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" /></svg>;
    case '등': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case '복부': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case '하체': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.606 3.1 1.547l.05.088m.033.033l.019.034" /></svg>;
    default: return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  }
};

export default ExerciseGuide;
