import React, { useState, useEffect } from 'react';
import { Moon, Sun, Download, Calculator, TrendingUp } from 'lucide-react';
import StatisticsCalculator from './components/StatisticsCalculator';
import CorrelationRegression from './components/CorrelationRegression';
import { exportToPDF, exportToCSV } from './utils/exportUtils';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleExportPDF = async () => {
    await exportToPDF(statisticsData, correlationData);
  };

  const handleExportCSV = () => {
    exportToCSV(statisticsData, correlationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="w-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-6 border-b border-gray-300 dark:border-gray-700 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Statistics & Probability</h2>
          <div className="text-lg text-gray-700 dark:text-gray-300 font-medium">Task #02</div>
          <div className="text-lg text-gray-700 dark:text-gray-300 font-medium">Umar Mustafa</div>
          <div className="text-lg text-gray-700 dark:text-gray-300 font-medium">SP23-BSE-058</div>
          <div className="text-lg text-gray-700 dark:text-gray-300 font-medium">Submit to: Sir M. Asif Rafique</div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Statistics & Regression Analyzer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced statistical analysis and visualization tool
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Export Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={handleExportPDF}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Statistics Calculator */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Statistical Analysis
                </h2>
              </div>
              <StatisticsCalculator onDataChange={setStatisticsData} />
            </div>
          </div>

          {/* Correlation & Regression */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Correlation & Regression
                </h2>
              </div>
              <CorrelationRegression onDataChange={setCorrelationData} />
            </div>
          </div>
        </div>

        {/* Mobile Export Buttons */}
        <div className="sm:hidden mt-8 flex justify-center space-x-4">
          <button
            onClick={handleExportPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;