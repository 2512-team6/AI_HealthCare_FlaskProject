from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection
from mysql.connector import Error

# =========================
# AI 식단 추천 import
# =========================
from dotenv import load_dotenv
from openai import OpenAI
import os
import json

load_dotenv()

app = Flask(__name__)

# =========================
# CORS 설정
# =========================
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"]
        }
    }
)

# =========================
# OpenAI Client
# =========================
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def home():
    return "HealthHub AI Dashboard API is running!"

# =========================
# USERS
# =========================
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, email, name, height, target_weight, goal, age, gender, created_at FROM users"
        )
        users = cursor.fetchall()
        return jsonify(users)
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND password = %s",
            (email, password)
        )
        user = cursor.fetchone()

        if user:
            del user['password']
            return jsonify(user)
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['email', 'password', 'name', 'height', 'target_weight', 'goal', 'age', 'gender']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 409

        cursor.execute(
            """INSERT INTO users (email, password, name, height, target_weight, goal, age, gender)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                data['email'],
                data['password'],
                data['name'],
                data['height'],
                data['target_weight'],
                data['goal'],
                data['age'],
                data['gender']
            )
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, email, name, height, target_weight, goal, age, gender FROM users WHERE id = %s",
            (user_id,)
        )
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user)
    finally:
        cursor.close()
        conn.close()


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            return jsonify({"error": "User not found"}), 404

        fields = []
        values = []
        allowed_fields = ['name', 'height', 'target_weight', 'goal', 'age', 'gender']

        for field in allowed_fields:
            if field in data:
                fields.append(f"{field} = %s")
                values.append(data[field])

        if not fields:
            return jsonify({"message": "No fields to update"}), 200

        values.append(user_id)
        cursor.execute(
            f"UPDATE users SET {', '.join(fields)} WHERE id = %s",
            tuple(values)
        )
        conn.commit()

        cursor.execute(
            "SELECT id, email, name, height, target_weight, goal, age, gender FROM users WHERE id = %s",
            (user_id,)
        )
        return jsonify(cursor.fetchone())
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# =========================
# AI MEAL RECOMMENDATION
# =========================

@app.route('/api/ai/meal', methods=['POST'])
def ai_meal_recommend():
    data = request.json
    meal_time = data.get("mealTime", "전체")
    notes = data.get("notes", "")

    # 🔥 mealTime에 따른 활성 필드 결정
    active_meals = {
        "아침": ["breakfast"],
        "점심": ["lunch"],
        "저녁": ["dinner"],
        "간식": ["snack"],
        "전체": ["breakfast", "lunch", "dinner", "snack"]
    }.get(meal_time, ["breakfast", "lunch", "dinner", "snack"])

    def meal_rule(meal):
        return "반드시 채워라" if meal in active_meals else "빈 문자열로 둬라"

    # 🔥 추가 요청사항 해석 규칙
    food_context = "일반적인 가정식 기준"
    if "편의점" in notes:
        food_context = "한국 편의점(GS25, CU, 세븐일레븐)에서 실제 구매 가능한 식품 기준"
    elif "외식" in notes:
        food_context = "한국 프랜차이즈 외식 기준"
    elif "집" in notes:
        food_context = "가정에서 조리 가능한 식단 기준"

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            temperature=0.7,
            messages=[
                {
                    "role": "system",
                    "content": f"""
너는 한국어로 답변하는 전문 영양사다.

절대 규칙:
- 반드시 JSON만 반환
- 설명, 문장, 마크다운, 주석 금지
- {meal_time} 식사만 실제 추천 대상이다
- {food_context}
"""
                },
                {
                    "role": "user",
                    "content": f"""
입력 정보:
나이: {data['age']}
성별: {data['gender']}
키: {data['height']}
체중: {data['weight']}
활동 수준: {data['activityLevel']}
목표: {data['goal']}
목표 칼로리: {data['targetKcal']}
식사 시간: {meal_time}
알레르기: {data.get('allergies', '없음')}
선호: {data.get('preferences', '없음')}
추가 요청: {notes}

JSON 형식:
{{
  "title": "",
  "breakfast": "{meal_rule('breakfast')}",
  "lunch": "{meal_rule('lunch')}",
  "dinner": "{meal_rule('dinner')}",
  "snack": "{meal_rule('snack')}",
  "totalKcal": {data['targetKcal']},
  "tip": "",
  "nutrition": {{
    "carbs": "",
    "protein": "",
    "fat": ""
  }}
}}
"""
                }
            ]
        )

        content = response.choices[0].message.content.strip()
        return jsonify(json.loads(content))

    except Exception as e:
        return jsonify({
            "title": "AI 오류",
            "breakfast": "",
            "lunch": "",
            "dinner": "",
            "snack": "",
            "totalKcal": data.get("targetKcal", 0),
            "tip": f"AI 오류 발생: {str(e)}",
            "nutrition": {
                "carbs": "",
                "protein": "",
                "fat": ""
            }
        }), 200

# =========================
# WEIGHT
# =========================
@app.route('/api/weight/<int:user_id>', methods=['GET'])
def get_weight_records(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM weight_records WHERE user_id = %s ORDER BY date ASC",
            (user_id,)
        )
        return jsonify(cursor.fetchall())
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/weight', methods=['POST'])
def add_weight_record():
    data = request.json
    user_id = data.get('user_id')
    weight = data.get('weight')
    date = data.get('date')
    
    # bmi가 요청에 없으면 0.0으로 설정
    bmi = data.get('bmi', 0.0) 

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # INSERT 문에 bmi를 반드시 포함해야 합니다.
        query = "INSERT INTO weight_records (user_id, weight, date, bmi) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (user_id, weight, date, bmi))
        conn.commit()
        return jsonify({"message": "success"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
# =========================
# WORKOUT
# =========================
@app.route('/api/workouts/<int:user_id>', methods=['GET'])
def get_workout_records(user_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM workout_records WHERE user_id = %s ORDER BY date ASC",
            (user_id,)
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.route('/api/workouts', methods=['POST'])
def add_workout_record():
    data = request.json
    required_fields = ['user_id', 'date', 'category', 'type', 'intensity', 'duration', 'met', 'calories', 'title']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO workout_records
               (id, user_id, date, category, type, intensity, duration, met, calories, completed, title, memo)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                data.get('id'),
                data['user_id'],
                data['date'],
                data['category'],
                data['type'],
                data['intensity'],
                data['duration'],
                data['met'],
                data['calories'],
                data.get('completed', False),
                data['title'],
                data.get('memo')
            )
        )
        conn.commit()
        return jsonify({"message": "Workout record added"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# =========================
# HEALTH
# =========================
@app.route('/api/health/<int:user_id>', methods=['GET'])
def get_health_records(user_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM health_metrics WHERE user_id = %s ORDER BY date ASC",
            (user_id,)
        )
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.route('/api/health', methods=['POST'])
def add_health_metric():
    data = request.json
    required_fields = ['user_id', 'date', 'systolic', 'diastolic', 'blood_sugar', 'sleep_hours']

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO health_metrics
               (user_id, date, systolic, diastolic, blood_sugar, sleep_hours)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (
                data['user_id'],
                data['date'],
                data['systolic'],
                data['diastolic'],
                data['blood_sugar'],
                data['sleep_hours']
            )
        )
        conn.commit()
        return jsonify({"message": "Health metric added"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)