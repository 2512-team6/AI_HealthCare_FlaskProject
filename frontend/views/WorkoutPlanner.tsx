import React, { useState } from 'react';
import { AppState, WorkoutRecord } from '../types';
import { calculateCalories } from '../services/met_service';
import { Dumbbell, Save } from 'lucide-react';

/* ===== 운동 데이터 ===== */
const exerciseData: Record<string, Record<string, number>> = {
  cardio: {
    "스핀(실내사이클)": 8.0,
    "런닝머신": 7.0,
    "엘립티컬": 6.0,
    "계단오르기": 8.5,
    "로잉머신": 7.0,
    "에어바이크": 10.0,
    "파워워킹": 6.5,
    "줄넘기": 9.0,
    "버피": 8.0,
    "마운틴클라이머": 8.5,
    "점프스쿼트": 7.5,
    "고강도인터벌": 11.0
  },
  strength: {
    "프리웨이트": 6.0,
    "머신운동": 5.0,
    "서킷트레이닝": 10.0,
    "크로스핏": 12.0,
    "케틀벨": 9.0,
    "바디웨이트": 7.0,
    "플라이오메트릭": 8.5,
    "파워리프팅": 6.5,
    "덤벨운동": 6.0,
    "바벨운동": 6.5,
    "밴드운동": 4.5,
    "펑셔널트레이닝": 7.5
  },
  combat: {
    "복싱": 10.0,
    "킥복싱": 9.0,
    "태권도": 9.0,
    "주짓수": 8.5,
    "MMA": 11.0,
    "가라테": 8.0,
    "검도": 7.5,
    "합기도": 7.0,
    "유도": 8.5,
    "무에타이": 10.0,
    "쿵푸": 8.0,
    "택견": 7.5
  },
  outdoor: {
    "하이킹": 7.0,
    "클라이밍": 8.0,
    "자전거": 8.0,
    "인라인": 7.5,
    "수영": 8.0,
    "서핑": 6.0,
    "스키": 9.0,
    "캠핑": 4.5,
    "트레킹": 7.5,
    "카약": 6.5,
    "스노보드": 8.5,
    "패러글라이딩": 4.0
  },
  sports: {
    "테니스": 7.0,
    "배드민턴": 5.5,
    "탁구": 4.0,
    "축구": 10.0,
    "농구": 8.0,
    "골프": 4.8,
    "야구": 5.0,
    "볼링": 3.0,
    "배구": 6.0,
    "스쿼시": 9.5,
    "라켓볼": 8.5,
    "핸드볼": 9.0
  },
  bodymind: {
    "요가": 3.0,
    "필라테스": 4.0,
    "스트레칭": 2.5,
    "명상": 1.5,
    "타이치": 3.0,
    "발레": 5.0,
    "댄스": 6.0,
    "맨손체조": 4.5,
    "아쉬탄가요가": 4.5,
    "핫요가": 3.5,
    "바레": 5.5,
    "짐나스틱": 6.0
  }
};

const categoryLabel: Record<string, string> = {
  cardio: "유산소",
  strength: "근력운동",
  combat: "격투기",
  outdoor: "야외활동",
  sports: "구기스포츠",
  bodymind: "바디마인드"
};

interface WorkoutPlannerProps {
  state: AppState;
  onAddWorkout: (workout: WorkoutRecord) => void;
}

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ state, onAddWorkout }) => {
  const [category, setCategory] = useState<keyof typeof exerciseData>('cardio');
  const [exercise, setExercise] = useState(Object.keys(exerciseData.cardio)[0]);
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');

  const met = exerciseData[category][exercise];
  const weight = state.weightLogs[state.weightLogs.length - 1]?.weight || 70;
  const finalDuration = customDuration ? Number(customDuration) : duration;
  const calories = calculateCalories(met, weight, finalDuration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workout: WorkoutRecord = {
      id: Math.random().toString(36).substring(2, 11),
      date,
      category: categoryLabel[category],
      type: exercise,
      intensity: '보통',
      duration: finalDuration,
      met,
      calories,
      completed: false,
      title: title || `${exercise} 운동`,
      memo: ''
    };

    onAddWorkout(workout);
    alert('운동 계획이 저장되었습니다!');
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ===== 좌측 칼로리 계산 카드 ===== */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 self-start">
          <div className="mb-4">
            <p className="font-bold text-lg text-slate-800">칼로리 계산</p>
            <p className="text-sm text-slate-500">실시간 소모 칼로리</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-center mb-6">
            <p className="text-4xl font-black text-white">{calories}</p>
            <p className="text-sm text-white/80">kcal 소모</p>
          </div>

          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-slate-500">선택된 운동</span>
              <span className="font-bold text-slate-800">{exercise}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">운동 강도</span>
              <span className="font-bold text-blue-600">MET {met}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">운동 시간</span>
              <span className="font-bold text-slate-800">{finalDuration}분</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">체중</span>
              <span className="font-bold text-slate-800">{weight}kg</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between font-bold">
            <span className="text-slate-500">총 소모 칼로리</span>
            <span className="text-emerald-600">{calories} kcal</span>
          </div>

          <p className="text-xs text-slate-400 text-center mt-3">
            운동과 시간을 선택하면 정확한 칼로리를 계산해드려요!
          </p>
        </div>

        {/* ===== 우측 운동 플래너 ===== */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-2">
              <Dumbbell className="text-blue-500" /> 운동 플래너
            </h2>
            <p className="text-slate-500">스마트한 운동 계획과 칼로리 계산</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(categoryLabel).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat as any);
                  setExercise(Object.keys(exerciseData[cat])[0]);
                }}
                className={`rounded-2xl p-6 font-bold border ${
                  category === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {categoryLabel[cat]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(exerciseData[category]).map(([name, m]) => (
              <button
                key={name}
                type="button"
                onClick={() => setExercise(name)}
                className={`rounded-xl p-4 border text-sm font-bold ${
                  exercise === name
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {name}
                <div className="text-xs opacity-70 mt-1">MET {m}</div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {[30, 60, 90, 120].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setDuration(m);
                  setCustomDuration('');
                }}
                className={`px-6 py-3 rounded-xl font-bold ${
                  duration === m && !customDuration
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {m}분
              </button>
            ))}
            <input
              type="number"
              placeholder="직접 입력 (분)"
              value={customDuration}
              onChange={e => setCustomDuration(e.target.value)}
              className="w-40 px-4 py-3 rounded-xl border bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-50"
            />
            <input
              type="text"
              placeholder="운동 제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-50"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
          >
            <Save /> 계획 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
