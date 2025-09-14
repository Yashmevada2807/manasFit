import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  Wrench, 
  GraduationCap,
  Heart,
  Moon,
  Activity,
  Brain,
  Droplets,
  Target,
  Clock,
  Star,
  Bookmark,
  ExternalLink,
  Menu
} from 'lucide-react';
import { resourcesAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'tool' | 'course';
  url: string;
  readTime?: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface Category {
  name: string;
  displayName: string;
  count: number;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredResources, setFeaturedResources] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedResources, setSavedResources] = useState<string[]>([]);

  useEffect(() => {
    loadResources();
    loadCategories();
    loadFeaturedResources();
    loadSavedResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourcesAPI.getAll({
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        difficulty: selectedDifficulty || undefined,
        search: searchTerm || undefined,
      });
      setResources(response.data.data.resources.articles.concat(
        response.data.data.resources.videos,
        response.data.data.resources.tools,
        response.data.data.resources.courses
      ));
    } catch (error) {
      console.error('Failed to load resources:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await resourcesAPI.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadFeaturedResources = async () => {
    try {
      const response = await resourcesAPI.getFeatured();
      setFeaturedResources(response.data.data.featuredResources);
    } catch (error) {
      console.error('Failed to load featured resources:', error);
    }
  };

  const loadSavedResources = async () => {
    try {
      const response = await resourcesAPI.getSaved();
      setSavedResources(response.data.data.savedResources.map((r: Resource) => r.id));
    } catch (error) {
      console.error('Failed to load saved resources:', error);
    }
  };

  const handleSaveResource = async (resourceId: string) => {
    try {
      await resourcesAPI.save({ resourceId });
      setSavedResources(prev => [...prev, resourceId]);
      toast.success('Resource saved!');
    } catch (error) {
      toast.error('Failed to save resource');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return BookOpen;
      case 'video':
        return Play;
      case 'tool':
        return Wrench;
      case 'course':
        return GraduationCap;
      default:
        return BookOpen;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep':
        return Moon;
      case 'exercise':
        return Activity;
      case 'stress':
        return Heart;
      case 'nutrition':
        return Droplets;
      case 'study':
        return BookOpen;
      case 'mental-health':
        return Brain;
      default:
        return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadResources();
  }, [searchTerm, selectedCategory, selectedType, selectedDifficulty]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wellness Resources</h1>
                <p className="text-gray-600">
                  Discover articles, videos, tools, and courses to support your wellness journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Content */}
        <div className="p-4 lg:p-8">

        {/* Featured Resources */}
        {Object.keys(featuredResources).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(featuredResources).map(([type, resources]: [string, any]) => {
                if (!resources || resources.length === 0) return null;
                const resource = resources[0];
                const TypeIcon = getTypeIcon(resource.type);
                
                return (
                  <Card key={type} hover>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <TypeIcon className="w-6 h-6 text-primary-600" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {resource.readTime || resource.duration}
                        </span>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.displayName} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="input"
                  >
                    <option value="">All Types</option>
                    <option value="article">Articles</option>
                    <option value="video">Videos</option>
                    <option value="tool">Tools</option>
                    <option value="course">Courses</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="input"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            const CategoryIcon = getCategoryIcon(resource.category);
            const isSaved = savedResources.includes(resource.id);

            return (
              <Card key={resource.id} hover>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-5 h-5 text-primary-600" />
                      <CategoryIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <button
                      onClick={() => handleSaveResource(resource.id)}
                      className={`p-1 rounded-full transition-colors ${
                        isSaved 
                          ? 'text-yellow-500 hover:text-yellow-600' 
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.readTime || resource.duration}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {resource.type === 'article' ? 'Read Article' :
                     resource.type === 'video' ? 'Watch Video' :
                     resource.type === 'tool' ? 'Use Tool' : 'Start Course'}
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Resources;
