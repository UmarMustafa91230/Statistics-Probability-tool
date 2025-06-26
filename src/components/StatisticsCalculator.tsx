import React, { useState } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import { calculateStatistics, generateFrequencyTable } from '../utils/statisticsUtils';

interface StatisticsCalculatorProps {
  onDataChange: (data: any) => void;
}

const StatisticsCalculator: React.FC<StatisticsCalculatorProps> = ({ onDataChange }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any>(null);
  const [frequencyTable, setFrequencyTable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const values = input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
      
      if (values.length === 0) {
        alert('Please enter valid numeric values');
        setLoading(false);
        return;
      }

      const stats = calculateStatistics(values);
      const freqTable = generateFrequencyTable(values);
      
      setResults(stats);
      setFrequencyTable(freqTable);
      onDataChange({ statistics: stats, frequencyTable: freqTable, rawData: values });
    } catch (error) {
      alert('Error calculating statistics. Please check your input.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter comma-separated numeric values:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 10, 15, 20, 25, 30, 35, 40"
          className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
        />
        <button
          onClick={handleCalculate}
          disabled={loading || !input.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? value.toFixed(4) : Array.isArray(value) ? value.join(', ') : value}
                </div>
              </div>
            ))}
          </div>

          {/* Frequency Distribution Table */}
          {frequencyTable.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Frequency Distribution Table
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 dark:bg-blue-900/50">
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Class Interval</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Class Boundaries</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Midpoint</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {frequencyTable.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{row.interval}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{row.boundaries}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{row.midpoint.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{row.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatisticsCalculator;