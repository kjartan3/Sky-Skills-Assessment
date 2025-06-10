


export const getLevel = (score) => {
  if (score > 3) return "Advanced";
  if (score > 2) return "Intermediate";
  return "Beginner";
};

