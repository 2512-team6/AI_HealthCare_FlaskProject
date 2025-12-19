import { UserSettings, HealthGoal } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface DBUser {
    id: number;
    email: string;
    name: string;
    height: number;
    target_weight: number;
    goal: string;
    age: number;
    gender: '남' | '여';
}

export const fetchUsers = async (): Promise<DBUser[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const mapDBUserToSettings = (dbUser: DBUser): UserSettings => {
    return {
        name: dbUser.name,
        email: dbUser.email,
        height: dbUser.height,
        target_weight: dbUser.target_weight,
        goal: dbUser.goal as HealthGoal,
        age: dbUser.age,
        gender: dbUser.gender
    };
};

export const login = async (email: string, password: string): Promise<DBUser> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
};

export const register = async (userData: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }
};

export const updateUser = async (user_id: number, settings: any): Promise<DBUser> => {
    // Backend expects snake_case for target_weight
    const payload = {
        ...settings,
        target_weight: settings.target_weight
    };

    const response = await fetch(`${API_BASE_URL}/users/${user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Update failed');
    }
    return data;
};

export const addWeightRecord = async (record: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/weight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add weight record');
    }
};

export const addWorkoutRecord = async (record: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add workout record');
    }
};

export const addHealthMetric = async (metric: any): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add health metric');
    }
};



export const getWeightRecords = async (userId: number) => {
  const res = await fetch(`${API_BASE_URL}/weight/${userId}`);
  if (!res.ok) throw new Error("체중 데이터 로딩 실패");
  return res.json();
};

export const getWorkoutRecords = async (userId: number) => {
  const res = await fetch(`${API_BASE_URL}/workouts/${userId}`);
  if (!res.ok) throw new Error("운동 데이터 로딩 실패");
  return res.json();
};

export const getHealthRecords = async (userId: number) => {
  const res = await fetch(`${API_BASE_URL}/health/${userId}`);
  if (!res.ok) throw new Error("건강 데이터 로딩 실패");
  return res.json();
};

export const getUserById = async (userId: number): Promise<DBUser> => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!res.ok) throw new Error("유저 정보 조회 실패");
  return res.json();
};
