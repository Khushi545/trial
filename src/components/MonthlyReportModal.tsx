import React, { useMemo } from 'react';
import { X, Download, Heart, ChefHat, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, TooltipProps } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InventoryItem } from '../types';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
}

interface AnalyticsData {
  donations: number;
  recipes: number;
  activeUsers: number;
  wasteSaved: number;
  weeklyData: Array<{
    week: string;
    donations: number;
    recipes: number;
    users: number;
  }>;
  foodCategories: Array<{
    category: string;
    amount: number;
  }>;
}

const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  inventoryItems,
}) => {
  const analyticsData = useMemo((): AnalyticsData => {
    // Generate realistic analytics based on inventory and usage patterns
    const totalItems = inventoryItems.length;
    const expiredItems = inventoryItems.filter(item => item.status === 'expired').length;
    
    // Base calculations with some realistic multipliers
    const donations = Math.floor(125 + (totalItems * 5));
    const recipes = Math.floor(225 + (totalItems * 8));
    const activeUsers = Math.floor(350 + (totalItems * 15));
    const wasteSaved = Math.floor(158 + (expiredItems * 12)); // kg
    
    // Weekly growth data
    const weeklyData = [
      { week: 'Week 1', donations: Math.floor(donations * 0.6), recipes: Math.floor(recipes * 0.7), users: Math.floor(activeUsers * 0.8) },
      { week: 'Week 2', donations: Math.floor(donations * 0.75), recipes: Math.floor(recipes * 0.8), users: Math.floor(activeUsers * 0.85) },
      { week: 'Week 3', donations: Math.floor(donations * 0.85), recipes: Math.floor(recipes * 0.9), users: Math.floor(activeUsers * 0.92) },
      { week: 'Week 4', donations, recipes, users: activeUsers },
    ];
    
    // Food categories based on inventory items
    const categoryMap = new Map();
    inventoryItems.forEach(item => {
      const category = categorizeFood(item.name);
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    // Add some realistic donation numbers
    const foodCategories = [
      { category: 'Vegetables', amount: 45 + (categoryMap.get('Vegetables') || 0) * 3 },
      { category: 'Grains', amount: 35 + (categoryMap.get('Grains') || 0) * 4 },
      { category: 'Dairy', amount: 28 + (categoryMap.get('Dairy') || 0) * 2 },
      { category: 'Fruits', amount: 22 + (categoryMap.get('Fruits') || 0) * 2 },
    ];
    
    return {
      donations,
      recipes,
      activeUsers,
      wasteSaved,
      weeklyData,
      foodCategories,
    };
  }, [inventoryItems]);

  const categorizeFood = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (['tomato', 'potato', 'onion', 'carrot', 'spinach', 'lettuce'].some(v => lowerName.includes(v))) return 'Vegetables';
    if (['rice', 'bread', 'wheat', 'pasta', 'oats'].some(v => lowerName.includes(v))) return 'Grains';
    if (['milk', 'cheese', 'yogurt', 'butter'].some(v => lowerName.includes(v))) return 'Dairy';
    if (['apple', 'banana', 'orange', 'mango', 'grape'].some(v => lowerName.includes(v))) return 'Fruits';
    return 'Other';
  };

  const generatePDF = async () => {
    const reportElement = document.getElementById('monthly-report-content');
    if (!reportElement) return;

    try {
      // Create canvas from the report content
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      pdf.save(`RasoiMate-Monthly-Report-${currentDate}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'donations' && 'Donations: '}
              {entry.dataKey === 'recipes' && 'Recipes: '}
              {entry.dataKey === 'users' && 'Users: '}
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const BarTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.category}</p>
          <p className="text-sm text-emerald-600">
            amount: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Monthly Report</h2>
              <p className="text-purple-100 mt-1">{currentMonth} - Your Impact Summary</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="monthly-report-content" className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <Heart className="text-red-500 mr-2" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.donations}</div>
                  <div className="text-gray-600 text-sm">Donations</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <div className="flex items-center">
                <ChefHat className="text-orange-500 mr-2" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.recipes}</div>
                  <div className="text-gray-600 text-sm">Recipes</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="text-blue-500 mr-2" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers}</div>
                  <div className="text-gray-600 text-sm">Active Users</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-2" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.wasteSaved}kg</div>
                  <div className="text-gray-600 text-sm">Waste Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Growth Trend */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Growth Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.weeklyData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="donations" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recipes" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Donations</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Recipes</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Users</span>
              </div>
            </div>
          </div>

          {/* Food Categories Donated */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Food Categories Donated</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.foodCategories}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={<BarTooltip />} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Summary</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">
                  You've helped <span className="font-bold">{analyticsData.activeUsers} families</span> this month
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">
                  Prevented <span className="font-bold">{analyticsData.wasteSaved}kg of food waste</span> from landfills
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">
                  Generated <span className="font-bold">{analyticsData.recipes} creative recipes</span> from leftovers
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700">
                  Your donations served <span className="font-bold">{Math.floor(analyticsData.donations * 7.4)} meals</span> to those in need
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={generatePDF}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
          >
            <Download className="mr-2" size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportModal;