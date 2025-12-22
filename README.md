# 🏋️ HealthHub AI

개인 맞춤형 헬스 기록 & AI 건강 관리 플랫폼

HealthHub AI는 체중, 운동, 건강 지표, 식단을 하나의 플랫폼에서 통합 관리하고  
AI를 활용해 개인 맞춤형 분석과 식단 추천을 제공하는 헬스 기록 웹 애플리케이션입니다.

> 기록 → 분석 → 피드백 → 행동 유도를 연결하는 AI 헬스 파트너

---

## 🔗 Demo & Docs

- 🌐 Web URL:  
- 📊 PPT 기획안:  

---

## ✨ 주요 기능

- 이메일 기반 회원가입 / 로그인
- 개인별 건강 데이터 분리 관리
- 대시보드 기반 건강 상태 요약
- 체중 기록 & BMI 자동 계산
- 운동 플래너 + 캘린더 관리
- 혈압 / 혈당 / 수면 등 건강 지표 기록
- AI 기반 맞춤 식단 추천 (BMR / TDEE 계산)

---

## 🧠 서비스 컨셉

- All-in-One 헬스 관리
- 기록 → 분석 → 피드백 → 행동 유도
- AI 기반 개인 맞춤화
- 초보자 친화적 UI / 시각적 피드백 중심

---

## 🛠 기술 스택

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Recharts

### Backend
- Python Flask
- MySQL
- REST API

### AI
- OpenAI API
- GPT 기반 식단 추천

---

## 🗄 데이터베이스 구조 (요약)

- users
- weight_records
- workout_records
- health_metrics
- meal_logs

users 테이블을 중심으로 모든 건강 데이터를 사용자 단위로 관리하며  
외래키 + CASCADE 정책으로 데이터 무결성을 보장합니다.

---

## 🚀 향후 확장 계획

- 웨어러블 디바이스 연동
- AI 운동 루틴 추천
- 장기 건강 리포트 자동 생성
- 의료 데이터 연계

---

## 🎯 프로젝트 목표

HealthHub AI는  
기록에서 끝나는 헬스 앱이 아닌,  
**사용자의 행동을 변화시키는 AI 헬스 파트너**를 목표로 합니다.
