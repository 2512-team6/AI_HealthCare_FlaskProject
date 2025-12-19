import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123',
            database='test'
        )
        return connection
    except Error as e:
        print(f"DB 연결 오류: {e}")
        return None
