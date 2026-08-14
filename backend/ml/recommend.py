import json
import sys

import pandas as pd
from recommendationEngine import load_data, preprocess_new_meals, recommend_meals

if __name__ == "__main__":
    user_id = int(sys.argv[1])

    meals_json = sys.stdin.read()

    raw_candidates = pd.DataFrame(json.loads(meals_json))

    dataset, scaler, vectorizers, encoder = load_data()

    processed_candidates = preprocess_new_meals(raw_candidates, scaler, vectorizers)

    recommendations = recommend_meals(
        user_id=user_id,
        user_dataset=dataset,
        processed_candidates=processed_candidates,
        original_candidates=raw_candidates,
        top_n=20,
    )

    results = recommendations[["id", "title", "image", "similarity"]].to_dict(
        orient="records"
    )

    print(json.dumps(results))
