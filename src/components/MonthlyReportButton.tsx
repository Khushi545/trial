import React from 'react';
import { FileText } from 'lucide-react';

interface MonthlyReportButtonProps {
  onClick: () => void;
}

const MonthlyReportButton: React.FC<MonthlyReportButtonProps> = ({ onClick }) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-2xl p-6 mb-8">
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        <FileText className="mr-3" size={24} />
        Generate Monthly Report
      </button>
      <p className="text-gray-600 text-center mt-3 text-sm">
        View detailed analytics and download your impact report
      </p>
    </div>
  );
};

export default MonthlyReportButton;