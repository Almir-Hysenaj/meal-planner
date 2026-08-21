# Meal Planner

A full-stack meal recommendation system that provides personalised meal suggestions based on a user's preferences, profile, and saved meals.

**Live Demo:** https://meal-planner-tan-six.vercel.app

---

## Features

* User registration and authentication
* Password hashing and JWT-based authentication
* Personalised user profiles
* Calorie calculations
* Machine-learning-based meal recommendations
* Meal filtering by:

  * Diet
  * Meal type
  * Minimum and maximum calories
* Detailed meal information
* Save and unsave meals
* Responsive user interface
* Dockerised frontend and backend
* Cloud deployment using AWS and Vercel
* PostgreSQL database hosted on Neon

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express
* TypeScript
* PostgreSQL

### Machine Learning

* Python
* pandas
* scikit-learn

### Deployment

* Docker
* AWS EC2
* Vercel
* Neon PostgreSQL
* Git & GitHub

---

## Machine Learning

The application uses a machine-learning-based recommendation system to rank meals based on how well they match a user's profile and saved meals.

The recommendation process combines information from user profiles with characteristics of meals. The data is cleaned and transformed into features before being used by the recommendation system.

### Data Preprocessing

The preprocessing includes:

* Combining user profile data with meal data
* Processing user attributes such as activity level and goal
* Processing dietary and meal-related features
* Creating text-based features from relevant meal information
* Converting categorical and text data into numerical features
* Removing features that are not needed for the recommendation system

### Recommendation

Recommendations take factors such as the following into account:

* Fitness goal
* Activity level
* Dietary preferences
* Dietary restrictions
* Meal characteristics
* Nutritional information
* Saved meals

The system uses these features to rank meals and provide personalised recommendations.

---

## Running Locally

### Environment Variables

Create a file at:

```text
backend/.env
```

Add the required environment variables:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SPOONACULAR_API_KEY=your_spoonacular_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

Environment files containing secrets should not be committed to Git.

### Docker

Build and start the application:

```bash
docker compose up --build
```

The application will be available at:

```text
http://localhost:5173
```

To stop the containers:

```bash
docker compose down
```

---

## Deployment

The React frontend is hosted on Vercel, while the backend runs in a Docker container on an AWS EC2 instance.

The application uses Neon for hosted PostgreSQL database storage.

---

## What I Learned

This project gave me practical experience with:

* Full-stack web development
* React and TypeScript
* REST API development
* Authentication
* PostgreSQL
* Machine learning and data preprocessing
* Docker and Docker Compose
* AWS EC2
* Nginx
* Cloud deployment
* Git and GitHub

---

## Future Improvements

Potential future improvements include:

* Improving the recommendation algorithm
* Evaluating the recommendation system with more data
* User-created meal plans
* Automatic shopping-list generation
* More detailed nutritional analysis
