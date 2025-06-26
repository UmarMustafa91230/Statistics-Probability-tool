export interface Statistics {
  mean: number;
  median: number;
  mode: number[] | string;
  range: number;
  variance: number;
  standardDeviation: number;
  coefficientOfVariation: number;
}

export interface FrequencyTableRow {
  interval: string;
  boundaries: string;
  midpoint: number;
  frequency: number;
}

export const calculateStatistics = (data: number[]): Statistics => {
  const sortedData = [...data].sort((a, b) => a - b);
  const n = data.length;

  // Mean
  const mean = data.reduce((sum, val) => sum + val, 0) / n;

  // Median
  const median = n % 2 === 0 
    ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
    : sortedData[Math.floor(n / 2)];

  // Mode
  const frequency: { [key: number]: number } = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  
  const maxFreq = Math.max(...Object.values(frequency));
  const modes = Object.keys(frequency)
    .filter(key => frequency[Number(key)] === maxFreq)
    .map(Number);
  
  const mode = maxFreq === 1 ? "No mode" : modes;

  // Range
  const range = Math.max(...data) - Math.min(...data);

  // Variance (using grouped data approach for better accuracy)
  const frequencyTable = generateFrequencyTable(data);
  let varianceSum = 0;
  let totalFreq = 0;
  
  frequencyTable.forEach(row => {
    const deviation = row.midpoint - mean;
    varianceSum += row.frequency * deviation * deviation;
    totalFreq += row.frequency;
  });
  
  const variance = varianceSum / totalFreq;

  // Standard Deviation
  const standardDeviation = Math.sqrt(variance);

  // Coefficient of Variation
  const coefficientOfVariation = (standardDeviation / mean) * 100;

  return {
    mean,
    median,
    mode,
    range,
    variance,
    standardDeviation,
    coefficientOfVariation
  };
};

export const generateFrequencyTable = (data: number[]): FrequencyTableRow[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  // Sturges' rule for number of classes
  const numClasses = Math.ceil(Math.log2(data.length) + 1);
  const classWidth = Math.ceil(range / numClasses);
  
  const frequencyTable: FrequencyTableRow[] = [];
  
  for (let i = 0; i < numClasses; i++) {
    const lowerBound = min + i * classWidth;
    const upperBound = min + (i + 1) * classWidth;
    
    // Count frequency
    const frequency = data.filter(val => {
      if (i === numClasses - 1) {
        // Last class includes upper bound
        return val >= lowerBound && val <= upperBound;
      } else {
        return val >= lowerBound && val < upperBound;
      }
    }).length;
    
    if (frequency > 0 || i < numClasses - 1) {
      frequencyTable.push({
        interval: `${lowerBound} - ${upperBound - 1}`,
        boundaries: `${lowerBound - 0.5} - ${upperBound - 0.5}`,
        midpoint: (lowerBound + upperBound - 1) / 2,
        frequency
      });
    }
  }
  
  return frequencyTable.filter(row => row.frequency > 0);
};