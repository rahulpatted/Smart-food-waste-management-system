// Calculate waste percentage
export const calculateWastePercentage = (waste, total) => {
  if (!total) return 0;
  return ((waste / total) * 100).toFixed(2);
};

// Cost savings calculation
export const calculateSavings = (wasteReducedKg) => {
  const costPerKg = 50; // example ₹
  return wasteReducedKg * costPerKg;
};
