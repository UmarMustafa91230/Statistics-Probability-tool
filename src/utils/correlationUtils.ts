export interface RegressionResult {
  a: number; // y-intercept
  b: number; // slope
}

export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const calculateRegression = (x: number[], y: number[]): RegressionResult => {
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope (b)
  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Calculate y-intercept (a)
  const a = meanY - b * meanX;

  return { a, b };
};