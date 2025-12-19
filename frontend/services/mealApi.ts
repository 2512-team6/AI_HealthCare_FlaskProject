import { DietRequest } from './openaiService'; // 타입만 재사용 가능
import { API_BASE_URL } from './api';

export async function getDietRecommendation(req: DietRequest) {
  const res = await fetch(`${API_BASE_URL}/ai/meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'AI 식단 추천 실패');
  }

  return await res.json();
}