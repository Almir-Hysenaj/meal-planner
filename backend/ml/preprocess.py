import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import joblib
import os


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
        "id_x",
        "id_y",
        "meal_id",
        "user_id",
        "title",
        "image",
        "created_at_x",
        "created_at_y",
        "updated_at"
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
    categorical_columns = [
        "sex",
        "activity_level",
        "goal"
    ]

    encoder = OneHotEncoder(
        sparse_output=False,
        handle_unknown="ignore"
    )

    encoded = encoder.fit_transform(
        df[categorical_columns]
    )

    encoded_df = pd.DataFrame(
        encoded,
        columns=encoder.get_feature_names_out(categorical_columns)
    )

    df = pd.concat(
        [
            df.reset_index(drop=True),
            encoded_df.reset_index(drop=True)
        ],
        axis=1
    )

    df = df.drop(columns=categorical_columns)

    return df, encoder


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

        # Need at least 2 rows for meaningful TF-IDF
        if len(df[column]) > 1:
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

        else:
            # Temporary placeholder while testing with one meal
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
        "fat",
        "age",
        "height_cm",
        "weight_kg",
        "goal_rate"
    ]

    scaler = StandardScaler()

    df[numerical_columns] = scaler.fit_transform(
        df[numerical_columns]
    )

    return df, scaler


def save_preprocessors(encoder, vectorizers, scaler):

    os.makedirs("models", exist_ok=True)

    joblib.dump(
        encoder,
        "models/category_encoder.pkl"
    )

    joblib.dump(
        vectorizers,
        "models/text_vectorizers.pkl"
    )

    joblib.dump(
        scaler,
        "models/scaler.pkl"
    )

    print("Preprocessors saved")