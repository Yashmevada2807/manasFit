import { Response } from 'express';
import Groq from 'groq-sdk';
import { AuthRequest } from '../middleware/authMiddleware';
import { WellnessEntry } from '../models/Wellness';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Chat with AI agent
export const chatWithAI = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;
    const userId = req.user._id;

    if (!message) {
      res.status(400).json({
        success: false,
        message: 'Message is required'
      });
      return;
    }

    // Get user's recent wellness data for context
    const recentEntries = await WellnessEntry.find({
      userId,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).sort({ date: -1 }).limit(5);

    // Prepare context for AI
    const wellnessContext = recentEntries.map(entry => ({
      date: entry.date,
      steps: entry.steps,
      sleepHours: entry.sleepHours,
      studyHours: entry.studyHours,
      stressLevel: entry.stressLevel,
      mood: entry.mood,
      exercise: entry.activity?.exercise,
      waterIntake: entry.diet?.waterIntake
    }));

    // Create system prompt
    const systemPrompt = `You are ManasFit AI, a friendly and supportive wellness assistant for students. Your role is to:

1. Provide personalized wellness advice based on the user's data
2. Offer motivation and encouragement
3. Suggest activities, study tips, and wellness practices
4. Help with stress management and mental health
5. Give practical tips for better sleep, nutrition, and exercise
6. Be empathetic, non-judgmental, and supportive

User's recent wellness data: ${JSON.stringify(wellnessContext)}
User's preferences: ${JSON.stringify(req.user.preferences)}

Guidelines:
- Keep responses concise but helpful (2-3 sentences max)
- Use a warm, encouraging tone
- Provide actionable advice
- If user seems stressed or down, offer emotional support
- Suggest specific activities or techniques
- Reference their data when relevant
- Always end with a positive note or encouragement`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama3-8b-8192",
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm here to help! How can I support your wellness journey today?";

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date(),
        context: context || 'general'
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Fallback response if Groq API fails
    const fallbackResponses = [
      "I'm here to support your wellness journey! How are you feeling today?",
      "Let's work together to improve your mental and physical health. What's on your mind?",
      "I'm ready to help with tips, motivation, or just listen. What would you like to talk about?",
      "Your wellness matters to me. How can I support you today?",
      "Let's make today a great day for your health and wellbeing. What do you need help with?"
    ];
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    res.status(200).json({
      success: true,
      data: {
        message: fallbackResponse,
        timestamp: new Date(),
        context: 'fallback'
      }
    });
  }
};

// Get wellness insights
export const getWellnessInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { period = '7d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get wellness data for the period
    const entries = await WellnessEntry.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    if (entries.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          insights: ["Start tracking your wellness data to get personalized insights!"],
          recommendations: ["Begin by logging your daily activities, sleep, and mood."]
        }
      });
      return;
    }

    // Analyze data and generate insights
    const insights = generateInsights(entries);
    const recommendations = generateRecommendations(entries, req.user.preferences);

    res.status(200).json({
      success: true,
      data: {
        period,
        insights,
        recommendations,
        dataSummary: {
          totalEntries: entries.length,
          averageSteps: Math.round(entries.reduce((sum, e) => sum + (e.steps || 0), 0) / entries.length),
          averageSleep: Math.round((entries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) / entries.length) * 10) / 10,
          averageStress: Math.round((entries.reduce((sum, e) => sum + (e.stressLevel || 5), 0) / entries.length) * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Get wellness insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wellness insights',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Generate personalized recommendations
export const getPersonalizedRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { category } = req.query;

    // Get recent wellness data
    const recentEntries = await WellnessEntry.find({
      userId,
      date: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } // Last 14 days
    }).sort({ date: -1 }).limit(10);

    let recommendations = [];

    if (category === 'sleep' || !category) {
      recommendations.push(...getSleepRecommendations(recentEntries));
    }
    
    if (category === 'exercise' || !category) {
      recommendations.push(...getExerciseRecommendations(recentEntries));
    }
    
    if (category === 'study' || !category) {
      recommendations.push(...getStudyRecommendations(recentEntries));
    }
    
    if (category === 'stress' || !category) {
      recommendations.push(...getStressRecommendations(recentEntries));
    }

    // Shuffle and limit recommendations
    recommendations = recommendations.sort(() => Math.random() - 0.5).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        category: category || 'all',
        recommendations
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Helper functions
const generateInsights = (entries: any[]): string[] => {
  const insights = [];
  
  const avgSteps = entries.reduce((sum, e) => sum + (e.steps || 0), 0) / entries.length;
  const avgSleep = entries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) / entries.length;
  const avgStress = entries.reduce((sum, e) => sum + (e.stressLevel || 5), 0) / entries.length;
  const exerciseDays = entries.filter(e => e.activity?.exercise).length;

  if (avgSteps < 5000) {
    insights.push("You're averaging fewer than 5,000 steps daily. Consider taking short walks between study sessions.");
  } else if (avgSteps > 10000) {
    insights.push("Great job maintaining high activity levels! You're consistently hitting your step goals.");
  }

  if (avgSleep < 7) {
    insights.push("Your sleep duration is below the recommended 7-9 hours. Try establishing a consistent bedtime routine.");
  } else if (avgSleep >= 7) {
    insights.push("Excellent sleep habits! You're getting adequate rest for optimal performance.");
  }

  if (avgStress > 7) {
    insights.push("Your stress levels have been elevated. Consider incorporating relaxation techniques into your daily routine.");
  } else if (avgStress < 5) {
    insights.push("You're managing stress well! Keep up the great work with your wellness practices.");
  }

  if (exerciseDays < entries.length * 0.3) {
    insights.push("You could benefit from more regular exercise. Even 15-20 minutes daily can make a difference.");
  } else if (exerciseDays >= entries.length * 0.5) {
    insights.push("Fantastic exercise consistency! You're building healthy habits that will serve you well.");
  }

  return insights;
};

const generateRecommendations = (entries: any[], preferences: any): string[] => {
  const recommendations = [];
  
  const avgSteps = entries.reduce((sum, e) => sum + (e.steps || 0), 0) / entries.length;
  const avgSleep = entries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) / entries.length;
  const avgStress = entries.reduce((sum, e) => sum + (e.stressLevel || 5), 0) / entries.length;

  if (avgSteps < preferences.goals.dailySteps * 0.8) {
    recommendations.push("Try the 20-20-20 rule: every 20 minutes, take a 20-second break and walk 20 steps.");
    recommendations.push("Consider studying while walking on a treadmill or taking walking study breaks.");
  }

  if (avgSleep < preferences.goals.sleepHours) {
    recommendations.push("Create a wind-down routine 1 hour before bed: dim lights, avoid screens, try reading or meditation.");
    recommendations.push("Keep your bedroom cool (65-68°F) and completely dark for optimal sleep.");
  }

  if (avgStress > 6) {
    recommendations.push("Practice the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8 seconds.");
    recommendations.push("Try progressive muscle relaxation before bed to reduce stress and improve sleep.");
  }

  return recommendations;
};

const getSleepRecommendations = (entries: any[]): string[] => {
  return [
    "Establish a consistent sleep schedule, even on weekends",
    "Avoid caffeine 6 hours before bedtime",
    "Create a relaxing bedtime routine with dim lighting",
    "Keep your bedroom cool and dark for optimal sleep",
    "Try meditation or deep breathing before bed"
  ];
};

const getExerciseRecommendations = (entries: any[]): string[] => {
  return [
    "Take a 10-minute walk every 2 hours during study sessions",
    "Try desk exercises like shoulder rolls and leg lifts",
    "Join a campus fitness class or sports club",
    "Use the stairs instead of elevators when possible",
    "Try a 15-minute morning yoga routine to start your day"
  ];
};

const getStudyRecommendations = (entries: any[]): string[] => {
  return [
    "Use the Pomodoro Technique: 25 minutes focused study, 5-minute break",
    "Create a dedicated study space free from distractions",
    "Take notes by hand to improve retention",
    "Review material within 24 hours of learning",
    "Form study groups to discuss and reinforce concepts"
  ];
};

const getStressRecommendations = (entries: any[]): string[] => {
  return [
    "Practice mindfulness meditation for 10 minutes daily",
    "Try journaling to process thoughts and emotions",
    "Connect with friends and family regularly",
    "Engage in hobbies that bring you joy",
    "Learn to say no to avoid overcommitting"
  ];
};
