import pandas as pd
from db import conn
from pathlib import Path
from preprocess import (
    preprocess_lists,
    drop_unused_columns,
    convert_booleans,
    encode_categories,
    create_text_features,
    scale_numerical_features,
    save_preprocessors
)

BASE_DIR = Path(__file__).resolve().parent

# Load saved meals
meals = pd.read_sql("""
SELECT *
FROM saved_meals;
""", conn)


# Load user profiles
profiles = pd.read_sql("""
SELECT *
FROM profiles;
""", conn)


# Keep meals dataset separate
df = meals.copy()


# Apply preprocessing
df = preprocess_lists(df)

df = drop_unused_columns(df)

df = convert_booleans(df)

df, encoder = encode_categories(df)

df, vectorizers = create_text_features(df)

df, scaler = scale_numerical_features(df)

save_preprocessors(
    encoder,
    vectorizers,
    scaler
)

print("\nFinal Dataset:")
print(df.head())

print(df.info())

df.to_csv(
    BASE_DIR / "processed_dataset.csv",
    index=False
)

print("Processed dataset saved")