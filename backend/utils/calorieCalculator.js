const calorieCalculator = (profile) => {
  const { age, sex, height_cm, weight_kg, activity_level, goal, goal_rate } =
    profile;
  let cal,
    calGoal = 0;

  const activityMultipliers = {
    not_active: 1.2,
    lightly_active: 1.375,
    active: 1.55,
    very_active: 1.725,
  };

  if (sex === 'male') {
    cal =
      (10 * weight_kg + 6.25 * height_cm - 5 * age + 5) *
      activityMultipliers[activity_level];
  } else {
    cal =
      (10 * weight_kg + 6.25 * height_cm - 5 * age - 161) *
      activityMultipliers[activity_level];
  }

  goal === 'lose'
    ? (calGoal = cal - (7700 * goal_rate) / 7)
    : (calGoal = cal + (7700 * goal_rate) / 7);

  return {
    maintenanceCalories: Math.round(cal),
    targetCalories: Math.round(calGoal),
  };
};

export default calorieCalculator;
