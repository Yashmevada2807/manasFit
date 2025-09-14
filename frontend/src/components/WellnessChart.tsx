import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Activity, Moon, BookOpen, Droplets, TrendingUp } from 'lucide-react';
import { WellnessEntry } from '../store/wellnessStore';

interface WellnessChartProps {
  data: WellnessEntry[];
}

const WellnessChart = ({ data }: WellnessChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'sleep' | 'study' | 'water'>('steps');

  // Process data for charts
  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: format(parseISO(entry.date), 'MMM dd'),
      fullDate: entry.date,
      steps: entry.steps || 0,
      sleep: entry.sleepHours || 0,
      study: entry.studyHours || 0,
      water: entry.diet?.waterIntake || 0,
      stress: entry.stressLevel || 0,
      mood: entry.mood,
    }));

  const metrics = [
    { key: 'steps', label: 'Steps', icon: Activity, color: '#3B82F6' },
    { key: 'sleep', label: 'Sleep (h)', icon: Moon, color: '#8B5CF6' },
    { key: 'study', label: 'Study (h)', icon: BookOpen, color: '#10B981' },
    { key: 'water', label: 'Water (L)', icon: Droplets, color: '#06B6D4' },
  ];

  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {metrics.map((metric) => (
            <p key={metric.key} className="text-sm" style={{ color: metric.color }}>
              {metric.label}: {data[metric.key]}
            </p>
          ))}
          {data.stress > 0 && (
            <p className="text-sm text-orange-600">
              Stress Level: {data.stress}/10
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No data available yet</p>
          <p className="text-sm">Start tracking your wellness to see charts here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{metric.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={selectedMetricData?.color}
              strokeWidth={2}
              dot={{ fill: selectedMetricData?.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: selectedMetricData?.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        {metrics.map((metric) => {
          const values = chartData.map(d => d[metric.key as keyof typeof d] as number);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);
          
          return (
            <div key={metric.key} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <metric.icon className="w-4 h-4 mr-1" style={{ color: metric.color }} />
                <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {metric.key === 'steps' ? Math.round(avg).toLocaleString() : avg.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">
                Max: {metric.key === 'steps' ? max.toLocaleString() : max.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessChart;
