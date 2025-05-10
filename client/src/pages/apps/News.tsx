import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Newspaper, Search, Bookmark, Clock, Globe, Share2, Tag, RefreshCw, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type NewsArticle = {
  id: number;
  title: string;
  description: string;
  content?: string;
  source: string;
  author: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  bookmarked: boolean;
};

export default function News() {
  const { setCurrentApp } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('news');
  }, [setCurrentApp]);
  
  // Fetch news articles (mock data for demonstration)
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample news articles (in a real app, this would come from a news API)
      const sampleArticles: NewsArticle[] = [
        {
          id: 1,
          title: "New Breakthrough in Renewable Energy Technology",
          description: "Scientists discover a new method for efficient solar power generation that could revolutionize the industry.",
          content: "A team of researchers at the National Renewable Energy Laboratory (NREL) has developed a new method for generating solar power that significantly increases efficiency while reducing costs. The breakthrough involves a novel approach to constructing solar panels using perovskite materials, which could potentially double the energy conversion rates of traditional silicon-based solar cells.\n\nThe team's lead researcher, Dr. Sarah Johnson, stated that this technology could be commercially viable within the next five years. 'Our goal is to make renewable energy more accessible and affordable for everyone,' she said during a press conference on Tuesday.\n\nIndustry experts are already taking notice of this development, with many predicting it could accelerate the global transition to clean energy. Market analysts suggest that investment in renewable energy companies could surge as a result of this breakthrough.\n\nThe research, which was funded by a combination of government grants and private investments, represents years of work by the NREL team. The findings have been published in the latest issue of the journal Nature Energy.",
          source: "Science Daily",
          author: "Dr. Jane Smith",
          publishedAt: "2023-09-23T10:30:00Z",
          url: "https://example.com/renewable-energy-breakthrough",
          imageUrl: "https://images.unsplash.com/photo-1509390144018-4c7b85882c0a?auto=format&fit=crop&w=600&h=400",
          category: "technology",
          bookmarked: false
        },
        {
          id: 2,
          title: "Global Stock Markets Hit New Record High",
          description: "Markets surge as inflation concerns ease and central banks signal a pause in interest rate hikes.",
          content: "Global stock markets reached unprecedented heights on Thursday as investors reacted positively to new economic data suggesting inflation pressures may be easing. The S&P 500 climbed 1.2% to close at a record high, while European and Asian markets also posted significant gains.\n\nThe rally was fueled by statements from major central banks indicating a potential pause in interest rate hikes, which have been implemented aggressively over the past year to combat rising inflation. Federal Reserve Chair Jerome Powell hinted at this shift during a speech to economic policy makers on Wednesday.\n\n'We're seeing signs that inflation is moderating, which gives us room to be more patient with further policy adjustments,' Powell stated.\n\nMarket analysts are cautiously optimistic about the outlook. 'This rally could have legs if the inflation data continues to improve,' said Marcus Rodriguez, chief investment strategist at Global Investments Inc. 'However, geopolitical risks and potential supply chain disruptions remain concerns that could reverse these gains.'\n\nTrading volume was particularly high in technology and consumer discretionary sectors, which have been especially sensitive to interest rate expectations.",
          source: "Financial Times",
          author: "Michael Johnson",
          publishedAt: "2023-09-22T16:45:00Z",
          url: "https://example.com/stock-markets-record",
          imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&h=400",
          category: "business",
          bookmarked: true
        },
        {
          id: 3,
          title: "Major Breakthrough in Cancer Treatment Announced",
          description: "New immunotherapy approach shows promising results in clinical trials for treating advanced stages of lung cancer.",
          source: "Health News Network",
          author: "Dr. Robert Chen",
          publishedAt: "2023-09-21T14:15:00Z",
          url: "https://example.com/cancer-treatment-breakthrough",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&h=400",
          category: "health",
          bookmarked: false
        },
        {
          id: 4,
          title: "New Smart Home Technology Unveiled at Tech Expo",
          description: "Leading tech companies showcase next-generation smart home devices with advanced AI capabilities.",
          source: "Tech Today",
          author: "Lisa Wong",
          publishedAt: "2023-09-20T09:30:00Z",
          url: "https://example.com/smart-home-tech-expo",
          imageUrl: "https://images.unsplash.com/photo-1558002038-1055e2e89a97?auto=format&fit=crop&w=600&h=400",
          category: "technology",
          bookmarked: false
        },
        {
          id: 5,
          title: "Olympic Committee Announces Host City for 2036 Games",
          description: "After a competitive bidding process, the International Olympic Committee has selected the host city for the 2036 Summer Olympics.",
          source: "Sports Global",
          author: "James Peterson",
          publishedAt: "2023-09-19T18:20:00Z",
          url: "https://example.com/olympic-host-2036",
          imageUrl: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=600&h=400",
          category: "sports",
          bookmarked: false
        },
        {
          id: 6,
          title: "New Study Links Coffee Consumption to Increased Longevity",
          description: "Research suggests moderate coffee drinkers may have a lower risk of certain diseases and increased lifespan.",
          source: "Health Journal",
          author: "Emily Roberts",
          publishedAt: "2023-09-18T12:10:00Z",
          url: "https://example.com/coffee-longevity-study",
          imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=400",
          category: "health",
          bookmarked: true
        },
        {
          id: 7,
          title: "Major Film Studio Announces New Superhero Franchise",
          description: "A new series of superhero films is set to begin production next year with an all-star cast.",
          source: "Entertainment Weekly",
          author: "David Thompson",
          publishedAt: "2023-09-17T15:45:00Z",
          url: "https://example.com/superhero-franchise-announcement",
          imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&h=400",
          category: "entertainment",
          bookmarked: false
        },
        {
          id: 8,
          title: "Climate Summit Concludes with New Global Commitments",
          description: "Nations agree to more ambitious carbon reduction targets in response to accelerating climate change.",
          source: "Environmental Report",
          author: "Sarah Matthews",
          publishedAt: "2023-09-16T17:30:00Z",
          url: "https://example.com/climate-summit-commitments",
          imageUrl: "https://images.unsplash.com/photo-1569253583584-9470d4c262d5?auto=format&fit=crop&w=600&h=400",
          category: "world",
          bookmarked: false
        }
      ];
      
      setArticles(sampleArticles);
      if (sampleArticles.length > 0) {
        setSelectedArticle(sampleArticles[0]);
      }
      setLoading(false);
    };
    
    fetchArticles();
  }, []);
  
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'health', name: 'Health' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'world', name: 'World' },
  ];
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for articles
    console.log('Searching for:', searchQuery);
  };
  
  const handleToggleBookmark = (id: number) => {
    setArticles(prev => prev.map(article => 
      article.id === id 
        ? { ...article, bookmarked: !article.bookmarked } 
        : article
    ));
    
    if (selectedArticle?.id === id) {
      setSelectedArticle(prev => prev ? { ...prev, bookmarked: !prev.bookmarked } : null);
    }
  };
  
  const filteredArticles = articles.filter(article => {
    // Filter by category
    if (activeCategory !== 'all' && article.category !== activeCategory) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'bookmarked' && !article.bookmarked) {
      return false;
    }
    
    // Filter by search
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-neutral-light flex flex-col">
        <div className="p-4 border-b border-neutral-light">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
              <Input 
                placeholder="Search news" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="p-4 border-b border-neutral-light">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="top" className="flex-1">Top</TabsTrigger>
              <TabsTrigger value="latest" className="flex-1">Latest</TabsTrigger>
              <TabsTrigger value="bookmarked" className="flex-1">Saved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="overflow-x-auto p-4 border-b border-neutral-light">
          <div className="flex space-x-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-neutral-light rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-light rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-light rounded w-1/4"></div>
                </div>
              ))
            ) : filteredArticles.length === 0 ? (
              <div className="p-6 text-center text-neutral-medium">
                <Newspaper className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                <p>No articles found</p>
                {searchQuery && (
                  <p className="mt-2">
                    Try adjusting your search or category filters
                  </p>
                )}
              </div>
            ) : (
              filteredArticles.map(article => (
                <div
                  key={article.id}
                  className={`p-4 cursor-pointer hover:bg-neutral-light ${
                    selectedArticle?.id === article.id ? 'bg-neutral-light' : ''
                  }`}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-medium text-neutral-medium">{article.source}</div>
                    <div className="flex items-center text-xs text-neutral-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-neutral-medium line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {article.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(article.id);
                      }}
                    >
                      <Bookmark className={`h-4 w-4 ${article.bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Article Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-neutral-light animate-pulse" />
              <p className="text-neutral-medium">Loading news content...</p>
            </div>
          </div>
        ) : selectedArticle ? (
          <article className="max-w-3xl mx-auto p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="capitalize mb-2">
                  {selectedArticle.category}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleBookmark(selectedArticle.id)}
                  >
                    <Bookmark className={`h-5 w-5 ${selectedArticle.bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => window.open(selectedArticle.url, '_blank')}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{selectedArticle.title}</h1>
              <div className="flex items-center text-neutral-medium mb-4">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{selectedArticle.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="mr-2">{selectedArticle.author}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDate(selectedArticle.publishedAt)}</span>
                <span className="mx-2">•</span>
                <Globe className="h-4 w-4 mr-1" />
                <span>{selectedArticle.source}</span>
              </div>
            </div>
            
            {selectedArticle.imageUrl && (
              <div className="mb-6">
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title} 
                  className="w-full rounded-lg object-cover max-h-[400px]"
                />
              </div>
            )}
            
            <div className="prose max-w-none">
              <p className="text-lg font-medium mb-4">{selectedArticle.description}</p>
              <div className="space-y-4">
                {selectedArticle.content ? (
                  selectedArticle.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <div className="p-6 bg-neutral-light rounded-lg text-center">
                    <p>Full article content not available in preview.</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => window.open(selectedArticle.url, '_blank')}
                    >
                      Read full article <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-light">
              <h3 className="font-semibold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles
                  .filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)
                  .slice(0, 2)
                  .map(article => (
                    <Card 
                      key={article.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{article.source}</CardDescription>
                      </CardHeader>
                      {article.imageUrl && (
                        <div className="px-4">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <CardFooter className="p-4 pt-2 flex justify-between">
                        <div className="text-xs text-neutral-medium">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-medium" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </article>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p className="text-neutral-medium">Select an article to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
