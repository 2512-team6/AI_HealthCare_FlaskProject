/// <reference types="vite/client" />

// services/openaiService.ts
import { API_BASE_URL } from "./api";

export interface DietRequest {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  mealTime: string;
  activityLevel: string;
  allergies?: string;
  preferences?: string;
  notes?: string;
  targetKcal: number;
}

// ❌ 프론트엔드에서 OpenAI API Key 사용 금지
// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// ✅ Flask 백엔드 API 주소
export async function getDietRecommendation(req: DietRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/meal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return data;

  } catch (e) {
    console.error('AI Recommendation Error:', e);

    // 🔻 백엔드 오류 시 fallback (기존 로직 유지)
    return {
      title: '기본 추천 식단',
      breakfast: '호밀빵과 저지방 우유',
      lunch: '현미밥과 닭가슴살 야채 볶음',
      dinner: '두부 샐러드와 삶은 계란',
      snack: '과일 1개',
      totalKcal: req.targetKcal,
      tip: '일시적인 오류로 기본 식단을 제공합니다.',
      nutrition: {
        carbs: '적정량',
        protein: '고단백',
        fat: '저지방',
      },
    };
  }
}
