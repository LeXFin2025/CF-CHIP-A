import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Languages, ArrowDown, Copy, Volume2, Repeat, Star, History, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Translate() {
  const { setCurrentApp } = useAppState();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [activeTab, setActiveTab] = useState('translate');
  const [isTranslating, setIsTranslating] = useState(false);

  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('translate');
  }, [setCurrentApp]);

  // List of languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];

  // Sample translation history (in a real app, this would come from an API)
  const translationHistory = [
    { id: 1, source: 'Hello world', target: 'Hola mundo', sourceLang: 'en', targetLang: 'es', timestamp: '2023-09-15T10:30:00Z' },
    { id: 2, source: 'Good morning', target: 'Bonjour', sourceLang: 'en', targetLang: 'fr', timestamp: '2023-09-14T08:45:00Z' },
    { id: 3, source: 'How are you?', target: 'Wie geht es dir?', sourceLang: 'en', targetLang: 'de', timestamp: '2023-09-12T14:20:00Z' },
  ];

  // Sample saved translations
  const savedTranslations = [
    { id: 1, source: 'Thank you very much', target: 'Muchas gracias', sourceLang: 'en', targetLang: 'es' },
    { id: 2, source: 'I love learning languages', target: 'J\'adore apprendre les langues', sourceLang: 'en', targetLang: 'fr' },
  ];

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);

    // In a real app, this would be an API call to a translation service
    setTimeout(() => {
      // Mock translation for demonstration
      const translations: Record<string, Record<string, string>> = {
        en: {
          es: 'Texto traducido al español.',
          fr: 'Texte traduit en français.',
          de: 'Text ins Deutsche übersetzt.',
        },
        es: {
          en: 'Text translated to English.',
          fr: 'Texte traduit en français.',
          de: 'Text ins Deutsche übersetzt.',
        },
        fr: {
          en: 'Text translated to English.',
          es: 'Texto traducido al español.',
          de: 'Text ins Deutsche übersetzt.',
        },
        de: {
          en: 'Text translated to English.',
          es: 'Texto traducido al español.',
          fr: 'Texte traduit en français.',
        },
      };

      const fromLang = sourceLanguage as keyof typeof translations;
      const toLang = targetLanguage as keyof typeof translations[typeof fromLang];
      
      if (translations[fromLang] && translations[fromLang][toLang]) {
        setTranslatedText(translations[fromLang][toLang]);
      } else {
        setTranslatedText('Translation not available for this language pair.');
      }
      
      setIsTranslating(false);
    }, 1000);
  };

  useEffect(() => {
    if (sourceText.trim()) {
      const debounce = setTimeout(() => {
        handleTranslate();
      }, 500);
      
      return () => clearTimeout(debounce);
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a notification here
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 bg-white p-6 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="translate" className="flex-1">Translate</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="translate" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSwapLanguages}
                  className="rounded-full"
                >
                  <Repeat className="h-5 w-5" />
                </Button>
                
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {languages.find(l => l.code === sourceLanguage)?.name}
                    </span>
                    <div className="flex space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSourceText('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Listen</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <Textarea 
                    placeholder="Enter text to translate"
                    className="min-h-[200px] resize-none text-lg"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {languages.find(l => l.code === targetLanguage)?.name}
                    </span>
                    <div className="flex space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(translatedText)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Listen</TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="min-h-[200px] border rounded-md p-3 text-lg">
                    {isTranslating ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-neutral-light rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-light rounded w-1/2"></div>
                        <div className="h-4 bg-neutral-light rounded w-5/6"></div>
                      </div>
                    ) : translatedText ? (
                      translatedText
                    ) : (
                      <span className="text-neutral-medium">Translation will appear here</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Alternative Translations</h3>
                <div className="bg-neutral-light p-4 rounded-md text-sm">
                  <p className="mb-2">Try our advanced translation options:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">Formal</Button>
                    <Button size="sm" variant="outline">Informal</Button>
                    <Button size="sm" variant="outline">Technical</Button>
                    <Button size="sm" variant="outline">Literary</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Saved Translations</h2>
              
              {savedTranslations.length === 0 ? (
                <div className="text-center py-10">
                  <Star className="h-16 w-16 text-neutral-light mx-auto mb-4" />
                  <p className="text-neutral-medium">You haven't saved any translations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTranslations.map(item => (
                    <div key={item.id} className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center text-sm">
                          <span className="font-medium">
                            {languages.find(l => l.code === item.sourceLang)?.name}
                          </span>
                          <ArrowDown className="h-4 w-4 mx-2 rotate-90" />
                          <span className="font-medium">
                            {languages.find(l => l.code === item.targetLang)?.name}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-light rounded-md p-3">
                          {item.source}
                        </div>
                        <div className="bg-neutral-light rounded-md p-3">
                          {item.target}
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Repeat className="h-4 w-4 mr-1" /> Re-translate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Translation History</h2>
              
              {translationHistory.length === 0 ? (
                <div className="text-center py-10">
                  <History className="h-16 w-16 text-neutral-light mx-auto mb-4" />
                  <p className="text-neutral-medium">Your translation history is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {translationHistory.map(item => (
                    <div key={item.id} className="border rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center text-sm">
                          <span className="font-medium">
                            {languages.find(l => l.code === item.sourceLang)?.name}
                          </span>
                          <ArrowDown className="h-4 w-4 mx-2 rotate-90" />
                          <span className="font-medium">
                            {languages.find(l => l.code === item.targetLang)?.name}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-medium">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-light rounded-md p-3">
                          {item.source}
                        </div>
                        <div className="bg-neutral-light rounded-md p-3">
                          {item.target}
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 space-x-2">
                        <Button size="sm" variant="ghost">
                          <Star className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Repeat className="h-4 w-4 mr-1" /> Re-translate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Button variant="outline">
                  <Trash className="h-4 w-4 mr-2" /> Clear History
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
