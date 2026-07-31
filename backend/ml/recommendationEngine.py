import pandas as pd
import joblib
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"


def load_data():
    """
    Load processed dataset and preprocessing objects.
    """

    dataset = pd.read_csv(
        BASE_DIR / "processed_dataset.csv"
    )

    scaler = joblib.load(
        MODEL_DIR / "scaler.pkl"
    )

    vectorizers = joblib.load(
        MODEL_DIR / "text_vectorizers.pkl"
    )

    encoder = joblib.load(
        MODEL_DIR / "category_encoder.pkl"
    )

    return dataset, scaler, vectorizers, encoder



def preprocess_new_meals(meals, scaler, vectorizers):
    """
    Preprocess new meals using fitted preprocessing objects.
    """

    from preprocess import (
        preprocess_lists,
        drop_unused_columns,
        convert_booleans,
        create_text_features,
        scale_numerical_features
    )


    meals = preprocess_lists(meals)

    meals = drop_unused_columns(meals)

    meals = convert_booleans(meals)


    meals, _ = create_text_features(
        meals,
        training=False,
        vectorizers=vectorizers
    )


    meals, _ = scale_numerical_features(
        meals,
        training=False,
        scaler=scaler
    )


    return meals



def create_user_vector(user_id, dataset):
    """
    Create user preference vector from saved meals.
    """

    user_meals = dataset[
        dataset["user_id"] == user_id
    ]

    if user_meals.empty:
        raise ValueError(
            "User has no saved meals"
        )


    user_features = user_meals.drop(
        columns=["user_id"]
    )


    user_vector = user_features.mean(
        axis=0
    )

    return user_vector



def recommend_meals(
    user_id,
    user_dataset,
    processed_candidates,
    original_candidates,
    top_n=5
):
    """
    Rank meals using cosine similarity.
    """

    user_vector = create_user_vector(
        user_id,
        user_dataset
    )


    similarities = cosine_similarity(
        user_vector.values.reshape(1, -1),
        processed_candidates
    )[0]


    recommendations = original_candidates.copy()

    recommendations["similarity"] = similarities


    recommendations = recommendations.sort_values(
        by="similarity",
        ascending=False
    )


    return recommendations.head(top_n)