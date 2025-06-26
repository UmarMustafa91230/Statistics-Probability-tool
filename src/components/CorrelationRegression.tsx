import React, { useState, useRef, useEffect } from 'react';
import { LineChart, AlertCircle, Info } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { calculateCorrelation, calculateRegression } from '../utils/correlationUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

interface CorrelationRegressionProps {
  onDataChange: (data: any) => void;
}

const CorrelationRegression: React.FC<CorrelationRegressionProps> = ({ onDataChange }) => {
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!xInput.trim() || !yInput.trim()) {
      setError('Please enter both X and Y values');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const xValues = xInput.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
      const yValues = yInput.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

      if (xValues.length === 0 || yValues.length === 0) {
        setError('Please enter valid numeric values');
        setLoading(false);
        return;
      }

      if (xValues.length !== yValues.length) {
        setError('X and Y arrays must have the same length');
        setLoading(false);
        return;
      }

      const correlation = calculateCorrelation(xValues, yValues);
      const regression = calculateRegression(xValues, yValues);

      const calculatedResults = {
        correlation,
        regression,
        xValues,
        yValues,
        dataPoints: xValues.map((x, i) => ({ x, y: yValues[i] }))
      };

      setResults(calculatedResults);
      onDataChange(calculatedResults);
    } catch (error) {
      setError('Error calculating correlation and regression. Please check your input.');
    }
    setLoading(false);
  };

  // Generate more points for smoother regression line
  const generateRegressionLine = (xValues: number[], regression: any) => {
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const range = maxX - minX;
    const step = range / 100; // 100 points for smooth line
    
    const linePoints = [];
    for (let x = minX - range * 0.1; x <= maxX + range * 0.1; x += step) {
      linePoints.push({
        x: x,
        y: regression.a + regression.b * x
      });
    }
    return linePoints;
  };

  const chartData = results ? {
    datasets: [
      {
        label: 'Data Points',
        data: results.dataPoints,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBorderWidth: 2,
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        showLine: false,
      },
      {
        label: 'Regression Line',
        data: generateRegressionLine(results.xValues, results.regression),
        type: 'line' as const,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: false,
      },
      // Add prediction points to show where regression line intersects with data X values
      {
        label: 'Predicted Values',
        data: results.xValues.map((x: number) => ({
          x,
          y: results.regression.a + results.regression.b * x
        })),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: 'triangle',
        showLine: false,
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          }
        }
      },
      title: {
        display: true,
        text: 'Scatter Plot with Dynamic Regression Line',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            if (label === 'Data Points') {
              return `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
            } else if (label === 'Predicted Values') {
              const actualY = results.yValues[results.xValues.indexOf(context.parsed.x)];
              const residual = actualY - context.parsed.y;
              return [
                `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`,
                `Residual: ${residual.toFixed(2)}`
              ];
            }
            return `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'X Values',
          font: {
            weight: 'bold' as const,
            size: 14,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 12,
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Y Values',
          font: {
            weight: 'bold' as const,
            size: 14,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
        },
        ticks: {
          font: {
            size: 12,
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            X Values (comma-separated):
          </label>
          <textarea
            value={xInput}
            onChange={(e) => setXInput(e.target.value)}
            placeholder="e.g., 1, 2, 3, 4, 5"
            className="w-full h-20 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Y Values (comma-separated):
          </label>
          <textarea
            value={yInput}
            onChange={(e) => setYInput(e.target.value)}
            placeholder="e.g., 2, 4, 6, 8, 10"
            className="w-full h-20 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={loading || !xInput.trim() || !yInput.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <LineChart className="w-5 h-5" />
              <span>Calculate Correlation & Regression</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Understanding the Regression Line:</p>
                <p>The regression line shows the best linear fit through your data points. It minimizes the sum of squared residuals (differences between actual and predicted values). The triangular points show predicted values for each X coordinate.</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Correlation Coefficient (r)
              </h3>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {results.correlation.toFixed(6)}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                {Math.abs(results.correlation) > 0.8 ? 'Strong' : 
                 Math.abs(results.correlation) > 0.5 ? 'Moderate' : 'Weak'} 
                {results.correlation > 0 ? ' positive' : ' negative'} correlation
              </div>
              <div className="mt-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg p-2">
                <div className="text-xs text-purple-600 dark:text-purple-300">
                  R² = {(results.correlation * results.correlation).toFixed(4)} 
                  <span className="block">({((results.correlation * results.correlation) * 100).toFixed(1)}% of variance explained)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Regression Equation
              </h3>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                y = {results.regression.a.toFixed(4)} + {results.regression.b.toFixed(4)}x
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                Slope: {results.regression.b.toFixed(4)}<br />
                Y-intercept: {results.regression.a.toFixed(4)}
              </div>
              <div className="mt-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg p-2">
                <div className="text-xs text-blue-600 dark:text-blue-300">
                  For every 1 unit increase in X, Y {results.regression.b > 0 ? 'increases' : 'decreases'} by {Math.abs(results.regression.b).toFixed(4)} units
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <div className="h-96">
              {chartData && <Scatter data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* Residuals Analysis */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
              Residuals Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-100 dark:bg-green-800/50">
                    <th className="px-4 py-2 text-left font-medium text-green-700 dark:text-green-300">X</th>
                    <th className="px-4 py-2 text-left font-medium text-green-700 dark:text-green-300">Actual Y</th>
                    <th className="px-4 py-2 text-left font-medium text-green-700 dark:text-green-300">Predicted Y</th>
                    <th className="px-4 py-2 text-left font-medium text-green-700 dark:text-green-300">Residual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-200 dark:divide-green-600">
                  {results.xValues.map((x: number, index: number) => {
                    const actualY = results.yValues[index];
                    const predictedY = results.regression.a + results.regression.b * x;
                    const residual = actualY - predictedY;
                    return (
                      <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-800/30 transition-colors">
                        <td className="px-4 py-2 text-green-900 dark:text-green-100">{x.toFixed(2)}</td>
                        <td className="px-4 py-2 text-green-900 dark:text-green-100">{actualY.toFixed(2)}</td>
                        <td className="px-4 py-2 text-green-900 dark:text-green-100">{predictedY.toFixed(2)}</td>
                        <td className="px-4 py-2 text-green-900 dark:text-green-100">
                          <span className={residual >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {residual.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationRegression;