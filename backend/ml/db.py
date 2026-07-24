import os
from dotenv import load_dotenv
import psycopg

load_dotenv("../.env")

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg.connect(DATABASE_URL)