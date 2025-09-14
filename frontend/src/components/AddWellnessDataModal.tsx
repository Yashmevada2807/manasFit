import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Activity, Moon, BookOpen, Droplets, Heart, Smile } from 'lucide-react';
import { useWellnessStore } from '../store/wellnessStore';
import { WellnessData } from '../services/api';
import { format } from 'date-fns';

interface AddWellnessDataModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddWellnessDataModal = ({ onClose, onSuccess }: AddWellnessDataModalProps) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'detailed'>('basic');
  const { addWellnessData, isLoading } = useWellnessStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WellnessData & { meals: number; waterIntake: number; junkFood: boolean; exercise: boolean; exerciseType: string; exerciseDuration: number }>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      steps: 0,
      sleepHours: 0,
      studyHours: 0,
      stressLevel: 5,
      mood: 'okay',
      meals: 3,
      waterIntake: 2,
      junkFood: false,
      exercise: false,
      exerciseType: '',
      exerciseDuration: 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const wellnessData: WellnessData = {
        date: data.date,
        steps: data.steps || 0,
        heartRate: data.heartRate,
        sleepHours: data.sleepHours || 0,
        studyHours: data.studyHours || 0,
        stressLevel: data.stressLevel || 5,
        mood: data.mood || 'okay',
        diet: {
          meals: data.meals || 3,
          waterIntake: data.waterIntake || 2,
          junkFood: data.junkFood || false,
        },
        activity: {
          exercise: data.exercise || false,
          exerciseType: data.exerciseType || undefined,
          exerciseDuration: data.exerciseDuration || undefined,
        },
        notes: data.notes,
        source: 'manual',
      };

      await addWellnessData(wellnessData);
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Activity },
    { id: 'detailed', label: 'Detailed', icon: Heart },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Wellness Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="input"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-error-600">{errors.date.message}</p>
            )}
          </div>

          {activeTab === 'basic' ? (
            <>
              {/* Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Activity className="w-4 h-4 inline mr-1" />
                  Steps
                </label>
                <input
                  {...register('steps', { min: 0 })}
                  type="number"
                  placeholder="Enter steps taken"
                  className="input"
                />
              </div>

              {/* Sleep Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Moon className="w-4 h-4 inline mr-1" />
                  Sleep Hours
                </label>
                <input
                  {...register('sleepHours', { min: 0, max: 24 })}
                  type="number"
                  step="0.5"
                  placeholder="Hours of sleep"
                  className="input"
                />
              </div>

              {/* Study Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Study Hours
                </label>
                <input
                  {...register('studyHours', { min: 0, max: 24 })}
                  type="number"
                  step="0.5"
                  placeholder="Hours studied"
                  className="input"
                />
              </div>

              {/* Water Intake */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Water Intake (Liters)
                </label>
                <input
                  {...register('waterIntake', { min: 0, max: 10 })}
                  type="number"
                  step="0.1"
                  placeholder="Liters of water"
                  className="input"
                />
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Smile className="w-4 h-4 inline mr-1" />
                  Mood
                </label>
                <select {...register('mood')} className="input">
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="poor">Poor</option>
                  <option value="terrible">Terrible</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Heart Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Heart className="w-4 h-4 inline mr-1" />
                  Heart Rate (BPM)
                </label>
                <input
                  {...register('heartRate', { min: 30, max: 220 })}
                  type="number"
                  placeholder="Resting heart rate"
                  className="input"
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stress Level (1-10)
                </label>
                <input
                  {...register('stressLevel', { min: 1, max: 10 })}
                  type="range"
                  min="1"
                  max="10"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Low)</span>
                  <span>10 (High)</span>
                </div>
              </div>

              {/* Meals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Meals
                </label>
                <input
                  {...register('meals', { min: 0, max: 10 })}
                  type="number"
                  placeholder="Meals eaten"
                  className="input"
                />
              </div>

              {/* Junk Food */}
              <div className="flex items-center">
                <input
                  {...register('junkFood')}
                  type="checkbox"
                  id="junkFood"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="junkFood" className="ml-2 block text-sm text-gray-900">
                  Ate junk food today
                </label>
              </div>

              {/* Exercise */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    {...register('exercise')}
                    type="checkbox"
                    id="exercise"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="exercise" className="ml-2 block text-sm text-gray-900">
                    Exercised today
                  </label>
                </div>

                {watch('exercise') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exercise Type
                      </label>
                      <input
                        {...register('exerciseType')}
                        type="text"
                        placeholder="e.g., Running, Yoga, Gym"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        {...register('exerciseDuration', { min: 0 })}
                        type="number"
                        placeholder="Exercise duration"
                        className="input"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Any additional notes about your day..."
                  className="input resize-none"
                />
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-md"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="loading-spinner mr-2" />
                  Adding...
                </div>
              ) : (
                'Add Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWellnessDataModal;
