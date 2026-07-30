import pandas as pd
import joblib
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"


def load_data():
    """
    Load the processed dataset and preprocessing objects.
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


def create_user_vector(user_id, dataset):
    """
    Create a preference vector based on a user's saved meals.
    """

    user_meals = dataset[
        dataset["user_id"] == user_id
    ]

    if user_meals.empty:
        raise ValueError("User has no saved meals")

    # Remove user_id before creating the vector
    user_features = user_meals.drop(
        columns=["user_id"]
    )

    # Average all saved meal vectors
    user_vector = user_features.mean(axis=0)

    return user_vector

def recommend_meals(user_id, dataset, top_n=5):
    """
    Recommend meals based on user's saved meal preferences.
    """

    user_vector = create_user_vector(
        user_id,
        dataset
    )

    # Remove user_id from comparison
    meal_features = dataset.drop(
        columns=["user_id"]
    )

    # Convert user vector into dataframe format
    user_vector_df = user_vector.values.reshape(1, -1)

    # Calculate similarity
    similarities = cosine_similarity(
        user_vector_df,
        meal_features
    )[0]

    recommendations = dataset.copy()

    recommendations["similarity"] = similarities

    # Remove meals already saved by the user
    # recommendations = recommendations[
    #     recommendations["user_id"] != user_id
    # ]

    # Sort highest similarity first
    recommendations = recommendations.sort_values(
        by="similarity",
        ascending=False
    )

    return recommendations.head(top_n)

if __name__ == "__main__":
    dataset, scaler, vectorizers, encoder = load_data()

    recommendations = recommend_meals(
        6,
        dataset
    )

    print("\nRecommendations:")
    print(recommendations)