import React, { useState, useMemo } from 'react';
import { AppState } from '../types';
import DashboardCard from '../components/DashboardCard';
import { Scale, History, TrendingUp, Info } from 'lucide-react';
import { calculateBMI } from '../services/healthLogic';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface WeightTrackerProps {
  state: AppState;
  onAddLog: (log: { date: string; weight: number }) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ state, onAddLog }) => {
  const [newWeight, setNewWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const latestWeight = state.weightLogs.at(-1)?.weight ?? 0;
  const targetWeight = state.settings.target_weight;
  const bmiInfo = calculateBMI(latestWeight, state.settings.height);

  const remainKg = useMemo(
    () => Math.abs(latestWeight - targetWeight).toFixed(1),
    [latestWeight, targetWeight]
  );

  const handleAdd = () => {
    if (!newWeight) return;
    onAddLog({
      date,
      weight: parseFloat(newWeight)
    });
    setNewWeight('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* ======================
          목표 체중 요약
      ====================== */}
      <DashboardCard title="목표 체중">
        <p className="font-bold">현재 목표: {targetWeight}kg</p>
        <p className="text-sm text-slate-400">
          목표까지 {remainKg}kg
        </p>
      </DashboardCard>

      {/* ======================
          요약 카드 4개
      ====================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="현재 체중">
          <p className="text-2xl font-black">{latestWeight}kg</p>
        </DashboardCard>

        <DashboardCard title="키">
          <p className="text-2xl font-black">{state.settings.height}cm</p>
        </DashboardCard>

        <DashboardCard title="BMI">
          <p className="text-2xl font-black">{bmiInfo.value}</p>
        </DashboardCard>

        <DashboardCard title="총 기록 수">
          <p className="text-2xl font-black">{state.weightLogs.length}</p>
        </DashboardCard>
      </div>

      {/* ======================
          체중 변화 추이 그래프
      ====================== */}
      <DashboardCard title="체중 변화 추이">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.weightLogs}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip />

              {/* 현재 체중 */}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5 }}
              />

              {/* 목표 체중 */}
              <Line
                type="monotone"
                dataKey={() => targetWeight}
                stroke="#22c55e"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* ======================
          체중 입력
      ====================== */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Scale size={24} />
          </div>
          체중 관리 기록
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-50 border rounded-2xl px-5 py-4"
          />

          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="0.0"
            className="bg-slate-50 border rounded-2xl px-5 py-4 font-bold"
          />

          <button
            onClick={handleAdd}
            className="bg-slate-900 text-white rounded-2xl font-black"
          >
            기록 저장
          </button>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 mb-8 flex gap-4">
          <Info className="text-blue-500 mt-1" size={20} />
          <p className="text-sm text-blue-700">
            체중은 매일 같은 시간에 측정하는 것이 가장 정확합니다.
          </p>
        </div>

        {/* ======================
            기록 리스트
        ====================== */}
        <div className="space-y-3">
          {state.weightLogs.slice().reverse().map((log, i) => {
            const prev = state.weightLogs[state.weightLogs.length - 2 - i];
            const diff = prev ? log.weight - prev.weight : null;

            return (
              <div
                key={log.id}
                className="flex justify-between p-5 bg-slate-50 rounded-2xl"
              >
                <div>
                  <p className="font-black">{log.weight}kg</p>
                  <p className="text-xs text-slate-400">{log.date}</p>
                </div>

                {diff !== null && (
                  <div
                    className={`font-black ${
                      diff > 0 ? 'text-rose-500' : diff < 0 ? 'text-blue-500' : ''
                    }`}
                  >
                    {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}kg
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
