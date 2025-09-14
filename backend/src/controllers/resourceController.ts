import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

// Curated wellness resources
const wellnessResources = {
  articles: [
    {
      id: '1',
      title: 'The Science of Sleep: How to Optimize Your Rest',
      description: 'Learn about sleep cycles, REM sleep, and practical tips for better rest.',
      category: 'sleep',
      type: 'article',
      url: 'https://example.com/sleep-science',
      readTime: '8 min read',
      difficulty: 'beginner',
      tags: ['sleep', 'health', 'wellness']
    },
    {
      id: '2',
      title: 'Managing Academic Stress: A Student\'s Guide',
      description: 'Evidence-based strategies for handling exam stress and academic pressure.',
      category: 'stress',
      type: 'article',
      url: 'https://example.com/academic-stress',
      readTime: '12 min read',
      difficulty: 'intermediate',
      tags: ['stress', 'academic', 'mental-health']
    },
    {
      id: '3',
      title: 'Nutrition for Brain Power: Foods That Boost Focus',
      description: 'Discover which foods can enhance your cognitive performance and concentration.',
      category: 'nutrition',
      type: 'article',
      url: 'https://example.com/brain-nutrition',
      readTime: '6 min read',
      difficulty: 'beginner',
      tags: ['nutrition', 'brain', 'focus']
    },
    {
      id: '4',
      title: 'The Pomodoro Technique: Study Smarter, Not Harder',
      description: 'Master the art of focused study sessions with time management techniques.',
      category: 'study',
      type: 'article',
      url: 'https://example.com/pomodoro-technique',
      readTime: '5 min read',
      difficulty: 'beginner',
      tags: ['study', 'productivity', 'time-management']
    },
    {
      id: '5',
      title: 'Building Healthy Habits: The Psychology of Change',
      description: 'Understand how to create lasting positive changes in your daily routine.',
      category: 'habits',
      type: 'article',
      url: 'https://example.com/healthy-habits',
      readTime: '10 min read',
      difficulty: 'intermediate',
      tags: ['habits', 'psychology', 'behavior-change']
    }
  ],
  videos: [
    {
      id: '6',
      title: '10-Minute Morning Yoga for Students',
      description: 'Start your day with energy and focus using this gentle yoga routine.',
      category: 'exercise',
      type: 'video',
      url: 'https://example.com/morning-yoga',
      duration: '10 min',
      difficulty: 'beginner',
      tags: ['yoga', 'morning', 'exercise']
    },
    {
      id: '7',
      title: 'Guided Meditation for Exam Anxiety',
      description: 'Calm your mind and reduce test anxiety with this guided meditation.',
      category: 'meditation',
      type: 'video',
      url: 'https://example.com/exam-meditation',
      duration: '15 min',
      difficulty: 'beginner',
      tags: ['meditation', 'anxiety', 'exams']
    },
    {
      id: '8',
      title: 'Quick Desk Exercises for Long Study Sessions',
      description: 'Stay active and prevent stiffness during marathon study sessions.',
      category: 'exercise',
      type: 'video',
      url: 'https://example.com/desk-exercises',
      duration: '5 min',
      difficulty: 'beginner',
      tags: ['exercise', 'desk', 'study-breaks']
    },
    {
      id: '9',
      title: 'Breathing Techniques for Stress Relief',
      description: 'Learn powerful breathing exercises to manage stress and anxiety.',
      category: 'stress',
      type: 'video',
      url: 'https://example.com/breathing-techniques',
      duration: '8 min',
      difficulty: 'beginner',
      tags: ['breathing', 'stress', 'relaxation']
    }
  ],
  tools: [
    {
      id: '10',
      title: 'Sleep Cycle Calculator',
      description: 'Calculate your optimal bedtime based on your wake-up time and sleep cycles.',
      category: 'sleep',
      type: 'tool',
      url: 'https://example.com/sleep-calculator',
      difficulty: 'beginner',
      tags: ['sleep', 'calculator', 'optimization']
    },
    {
      id: '11',
      title: 'Study Session Timer',
      description: 'Pomodoro timer with customizable work and break intervals.',
      category: 'study',
      type: 'tool',
      url: 'https://example.com/study-timer',
      difficulty: 'beginner',
      tags: ['study', 'timer', 'productivity']
    },
    {
      id: '12',
      title: 'Mood Tracker',
      description: 'Track your daily mood and identify patterns in your emotional wellbeing.',
      category: 'mental-health',
      type: 'tool',
      url: 'https://example.com/mood-tracker',
      difficulty: 'beginner',
      tags: ['mood', 'tracking', 'mental-health']
    }
  ],
  courses: [
    {
      id: '13',
      title: 'Mindfulness for Students',
      description: 'A comprehensive course on incorporating mindfulness into student life.',
      category: 'mindfulness',
      type: 'course',
      url: 'https://example.com/mindfulness-course',
      duration: '4 weeks',
      difficulty: 'beginner',
      tags: ['mindfulness', 'course', 'mental-health']
    },
    {
      id: '14',
      title: 'Time Management Mastery',
      description: 'Learn advanced time management techniques for academic success.',
      category: 'productivity',
      type: 'course',
      url: 'https://example.com/time-management',
      duration: '6 weeks',
      difficulty: 'intermediate',
      tags: ['time-management', 'productivity', 'academic']
    }
  ]
};

// Get all resources
export const getAllResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, type, difficulty, search } = req.query;

    let filteredResources = { ...wellnessResources };

    // Filter by category
    if (category) {
      Object.keys(filteredResources).forEach(key => {
        filteredResources[key] = filteredResources[key].filter(
          (resource: any) => resource.category === category
        );
      });
    }

    // Filter by type
    if (type) {
      Object.keys(filteredResources).forEach(key => {
        filteredResources[key] = filteredResources[key].filter(
          (resource: any) => resource.type === type
        );
      });
    }

    // Filter by difficulty
    if (difficulty) {
      Object.keys(filteredResources).forEach(key => {
        filteredResources[key] = filteredResources[key].filter(
          (resource: any) => resource.difficulty === difficulty
        );
      });
    }

    // Search functionality
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      Object.keys(filteredResources).forEach(key => {
        filteredResources[key] = filteredResources[key].filter(
          (resource: any) => 
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.description.toLowerCase().includes(searchTerm) ||
            resource.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resources: filteredResources,
        totalCount: Object.values(filteredResources).reduce(
          (total: number, resources: any) => total + resources.length, 0
        )
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resources',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get resource by ID
export const getResourceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Search through all resource types
    let resource = null;
    Object.values(wellnessResources).forEach((resources: any) => {
      const found = resources.find((r: any) => r.id === id);
      if (found) resource = found;
    });

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { resource }
    });
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get resources by category
export const getResourcesByCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { type, difficulty } = req.query;

    let resources: any[] = [];

    // Collect resources from all types that match the category
    Object.values(wellnessResources).forEach((resourceList: any) => {
      resources = resources.concat(
        resourceList.filter((resource: any) => resource.category === category)
      );
    });

    // Additional filtering
    if (type) {
      resources = resources.filter((resource: any) => resource.type === type);
    }

    if (difficulty) {
      resources = resources.filter((resource: any) => resource.difficulty === difficulty);
    }

    res.status(200).json({
      success: true,
      data: {
        category,
        resources,
        count: resources.length
      }
    });
  } catch (error) {
    console.error('Get resources by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resources by category',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get featured resources
export const getFeaturedResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const featuredResources = {
      articles: wellnessResources.articles.slice(0, 3),
      videos: wellnessResources.videos.slice(0, 2),
      tools: wellnessResources.tools.slice(0, 2),
      courses: wellnessResources.courses.slice(0, 1)
    };

    res.status(200).json({
      success: true,
      data: { featuredResources }
    });
  } catch (error) {
    console.error('Get featured resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured resources',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get resource categories
export const getResourceCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = [
      { name: 'sleep', displayName: 'Sleep & Rest', count: 0 },
      { name: 'stress', displayName: 'Stress Management', count: 0 },
      { name: 'exercise', displayName: 'Physical Activity', count: 0 },
      { name: 'nutrition', displayName: 'Nutrition', count: 0 },
      { name: 'study', displayName: 'Study Skills', count: 0 },
      { name: 'mental-health', displayName: 'Mental Health', count: 0 },
      { name: 'meditation', displayName: 'Meditation', count: 0 },
      { name: 'habits', displayName: 'Healthy Habits', count: 0 },
      { name: 'mindfulness', displayName: 'Mindfulness', count: 0 },
      { name: 'productivity', displayName: 'Productivity', count: 0 }
    ];

    // Count resources in each category
    categories.forEach(category => {
      let count = 0;
      Object.values(wellnessResources).forEach((resources: any) => {
        count += resources.filter((resource: any) => resource.category === category.name).length;
      });
      category.count = count;
    });

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get resource categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource categories',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Add resource to user's saved list
export const saveResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.body;
    const userId = req.user._id;

    // Find the resource
    let resource = null;
    Object.values(wellnessResources).forEach((resources: any) => {
      const found = resources.find((r: any) => r.id === resourceId);
      if (found) resource = found;
    });

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
      return;
    }

    // Add to user's saved resources
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (!user.resources.includes(resourceId)) {
      user.resources.push(resourceId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Resource saved successfully',
      data: { resourceId }
    });
  } catch (error) {
    console.error('Save resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resource',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get user's saved resources
export const getSavedResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get full resource details for saved resources
    const savedResources: any[] = [];
    user.resources.forEach(resourceId => {
      Object.values(wellnessResources).forEach((resources: any) => {
        const resource = resources.find((r: any) => r.id === resourceId);
        if (resource) savedResources.push(resource);
      });
    });

    res.status(200).json({
      success: true,
      data: { savedResources }
    });
  } catch (error) {
    console.error('Get saved resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved resources',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
