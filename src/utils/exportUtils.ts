import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (statisticsData: any, correlationData: any) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('Statistics & Regression Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Date
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 20;

  // Statistics Section
  if (statisticsData) {
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Statistical Analysis', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    
    if (statisticsData.statistics) {
      const stats = statisticsData.statistics;
      const statsText = [
        `Mean: ${stats.mean.toFixed(4)}`,
        `Median: ${stats.median.toFixed(4)}`,
        `Mode: ${Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode}`,
        `Range: ${stats.range.toFixed(4)}`,
        `Variance: ${stats.variance.toFixed(4)}`,
        `Standard Deviation: ${stats.standardDeviation.toFixed(4)}`,
        `Coefficient of Variation: ${stats.coefficientOfVariation.toFixed(4)}%`
      ];

      statsText.forEach(line => {
        pdf.text(line, 20, yPosition);
        yPosition += 8;
      });
    }

    yPosition += 10;

    // Frequency Table
    if (statisticsData.frequencyTable && statisticsData.frequencyTable.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Frequency Distribution Table', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      
      // Table headers
      const headers = ['Class Interval', 'Class Boundaries', 'Midpoint', 'Frequency'];
      let xPosition = 20;
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += 40;
      });
      yPosition += 10;

      // Table data
      statisticsData.frequencyTable.forEach((row: any) => {
        xPosition = 20;
        pdf.text(row.interval, xPosition, yPosition);
        xPosition += 40;
        pdf.text(row.boundaries, xPosition, yPosition);
        xPosition += 40;
        pdf.text(row.midpoint.toFixed(2), xPosition, yPosition);
        xPosition += 40;
        pdf.text(row.frequency.toString(), xPosition, yPosition);
        yPosition += 8;
      });
    }
  }

  // Correlation Section
  if (correlationData) {
    yPosition += 20;
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Correlation & Regression Analysis', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    
    const corrText = [
      `Correlation Coefficient (r): ${correlationData.correlation.toFixed(6)}`,
      `Regression Equation: y = ${correlationData.regression.a.toFixed(4)} + ${correlationData.regression.b.toFixed(4)}x`,
      `Y-intercept (a): ${correlationData.regression.a.toFixed(4)}`,
      `Slope (b): ${correlationData.regression.b.toFixed(4)}`
    ];

    corrText.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 8;
    });
  }

  pdf.save('statistics-regression-report.pdf');
};

export const exportToCSV = (statisticsData: any, correlationData: any) => {
  let csvContent = 'Statistics & Regression Analysis Report\n\n';
  csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // Statistics Section
  if (statisticsData && statisticsData.statistics) {
    csvContent += 'Statistical Analysis\n';
    csvContent += 'Metric,Value\n';
    
    const stats = statisticsData.statistics;
    csvContent += `Mean,${stats.mean.toFixed(4)}\n`;
    csvContent += `Median,${stats.median.toFixed(4)}\n`;
    csvContent += `Mode,"${Array.isArray(stats.mode) ? stats.mode.join(', ') : stats.mode}"\n`;
    csvContent += `Range,${stats.range.toFixed(4)}\n`;
    csvContent += `Variance,${stats.variance.toFixed(4)}\n`;
    csvContent += `Standard Deviation,${stats.standardDeviation.toFixed(4)}\n`;
    csvContent += `Coefficient of Variation,${stats.coefficientOfVariation.toFixed(4)}%\n\n`;

    // Frequency Table
    if (statisticsData.frequencyTable && statisticsData.frequencyTable.length > 0) {
      csvContent += 'Frequency Distribution Table\n';
      csvContent += 'Class Interval,Class Boundaries,Midpoint,Frequency\n';
      
      statisticsData.frequencyTable.forEach((row: any) => {
        csvContent += `"${row.interval}","${row.boundaries}",${row.midpoint.toFixed(2)},${row.frequency}\n`;
      });
      csvContent += '\n';
    }
  }

  // Correlation Section
  if (correlationData) {
    csvContent += 'Correlation & Regression Analysis\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Correlation Coefficient (r),${correlationData.correlation.toFixed(6)}\n`;
    csvContent += `Y-intercept (a),${correlationData.regression.a.toFixed(4)}\n`;
    csvContent += `Slope (b),${correlationData.regression.b.toFixed(4)}\n`;
    csvContent += `Regression Equation,"y = ${correlationData.regression.a.toFixed(4)} + ${correlationData.regression.b.toFixed(4)}x"\n\n`;

    // Data Points
    if (correlationData.xValues && correlationData.yValues) {
      csvContent += 'Data Points\n';
      csvContent += 'X,Y\n';
      correlationData.xValues.forEach((x: number, index: number) => {
        csvContent += `${x},${correlationData.yValues[index]}\n`;
      });
    }
  }

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'statistics-regression-report.csv';
  link.click();
};