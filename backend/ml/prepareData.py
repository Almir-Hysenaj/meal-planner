import pandas as pd
from db import conn
from preprocess import (
    preprocess_lists,
    drop_unused_columns,
    convert_booleans,
    encode_categories,
    create_text_features,
    scale_numerical_features,
    save_preprocessors
)

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


# Merge meals with profiles
df = meals.merge(
    profiles,
    on="user_id",
    how="left"
)


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

df.to_csv(
    "dataset.csv",
    index=False
)

print("\nFinal Dataset:")
print(df.head())

print(df.info())