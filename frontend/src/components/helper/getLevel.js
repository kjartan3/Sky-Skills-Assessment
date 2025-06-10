


export const getLevel = (score) => {
  if (score >= 3.25) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

