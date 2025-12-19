import { BMIStatus } from '../types';

/**
 * BMI 계산
 * @param weight 체중 (kg)
 * @param height 키 (cm)
 * @returns BMI (소수점 1자리)
 */
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;

  const heightMeter = height / 100;
  const bmi = weight / (heightMeter * heightMeter);

  return Number(bmi.toFixed(1));
};

/**
 * BMI 상태 판별
 */
export const getBMIStatus = (bmi: number): BMIStatus => {
  if (bmi < 18.5) return BMIStatus.UNDERWEIGHT;
  if (bmi < 23) return BMIStatus.NORMAL;
  if (bmi < 25) return BMIStatus.OVERWEIGHT;
  return BMIStatus.OBESE;
};
