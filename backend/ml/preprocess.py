import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

def preprocess_lists(df):
    list_columns = [
        "cuisines",
        "dish_types",
        "diets",
        "ingredients"
    ]

    for column in list_columns:
        df[column] = df[column].apply(
            lambda x: " ".join(x) if isinstance(x, list) else ""
        )

    return df


def drop_unused_columns(df):
    columns_to_drop = [
        "id",
        "meal_id",
        "title",
        "image",
        "user_id",
        "created_at"
    ]

    df = df.drop(columns=columns_to_drop)

    return df

def convert_booleans(df):
    boolean_columns = [
        "vegetarian",
        "vegan",
        "gluten_free",
        "dairy_free"
    ]

    for column in boolean_columns:
        df[column] = df[column].astype(int)

    return df


def encode_categories(df):
    return df, None


def create_text_features(df):
    text_columns = [
        "ingredients",
        "cuisines",
        "dish_types",
        "diets"
    ]

    vectorizers = {}
    text_features = []

    for column in text_columns:

        vectorizer = TfidfVectorizer()

        if len(df[column]) > 1 and df[column].str.strip().any():

            try:
                vectors = vectorizer.fit_transform(df[column])

                vector_df = pd.DataFrame(
                    vectors.toarray(),
                    columns=[
                        f"{column}_{word}"
                        for word in vectorizer.get_feature_names_out()
                    ]
                )

                text_features.append(vector_df)
                vectorizers[column] = vectorizer

            except ValueError:
                print(f"Skipping TF-IDF for {column}: empty vocabulary")

        else:
            print(f"Skipping TF-IDF for {column}: not enough data")


    if text_features:
        df = pd.concat(
            [
                df.reset_index(drop=True),
                *[
                    feature.reset_index(drop=True)
                    for feature in text_features
                ]
            ],
            axis=1
        )


    df = df.drop(columns=text_columns)

    return df, vectorizers

def scale_numerical_features(df):

    numerical_columns = [
        "ready_in_minutes",
        "servings",
        "calories",
        "protein",
        "carbs",
        "fat"
    ]

    scaler = StandardScaler()

    df[numerical_columns] = scaler.fit_transform(
        df[numerical_columns]
    )

    return df, scaler


def save_preprocessors(encoder, vectorizers, scaler):

    MODEL_DIR.mkdir(exist_ok=True)

    joblib.dump(
        encoder,
        MODEL_DIR / "category_encoder.pkl"
    )

    joblib.dump(
        vectorizers,
        MODEL_DIR / "text_vectorizers.pkl"
    )

    joblib.dump(
        scaler,
        MODEL_DIR / "scaler.pkl"
    )

    print("Preprocessors saved")