import React from 'react';
import { X, TrendingUp, Heart, Utensils, Users, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SimpleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleReportModal: React.FC<SimpleReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Sample data for the current month
  const weeklyData = [
    { week: 'Week 1', donations: 28, recipes: 45, users: 65 },
    { week: 'Week 2', donations: 35, recipes: 52, users: 78 },
    { week: 'Week 3', donations: 42, recipes: 58, users: 85 },
    { week: 'Week 4', donations: 51, recipes: 67, users: 92 }
  ];

  const categoryData = [
    { category: 'Vegetables', amount: 45 },
    { category: 'Grains', amount: 35 },
    { category: 'Dairy', amount: 28 },
    { category: 'Fruits', amount: 22 }
  ];

  const handleDownload = () => {
    alert('Report download feature coming soon! This will generate a PDF with all your monthly statistics.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">Monthly Report</h2>
              <p className="text-purple-100">January 2025 - Your Impact Summary</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-2xl p-4 border-l-4 border-red-500">
              <Heart className="w-6 h-6 text-red-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">125</div>
              <div className="text-sm text-gray-600">Donations</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 border-l-4 border-orange-500">
              <Utensils className="w-6 h-6 text-orange-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">225</div>
              <div className="text-sm text-gray-600">Recipes</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border-l-4 border-blue-500">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">350</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500">
              <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">158kg</div>
              <div className="text-sm text-gray-600">Waste Saved</div>
            </div>
          </div>

          {/* Weekly Growth Chart */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">Weekly Growth Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  name="Donations"
                />
                <Line 
                  type="monotone" 
                  dataKey="recipes" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  name="Recipes"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Food Categories Chart */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-heading">Food Categories Donated</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 font-heading">Impact Summary</h3>
            <div className="space-y-2 text-gray-700">
              <p>✅ You've helped <strong>350 families</strong> this month</p>
              <p>✅ Prevented <strong>158kg of food waste</strong> from landfills</p>
              <p>✅ Generated <strong>225 creative recipes</strong> from leftovers</p>
              <p>✅ Your donations served <strong>920 meals</strong> to those in need</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleReportModal;
