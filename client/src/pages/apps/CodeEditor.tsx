import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { 
  Code, FileCode, FolderOpen, Save, RefreshCw, 
  Download, Copy, XCircle, Play, Settings, PlusCircle, 
  Trash, FolderPlus, FileText, ChevronRight, FolderClosed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Represents the CF Chip A Supercomputer integration
// This object will communicate with our virtual supercomputer backend
const CFChipA = {
  compileAndRun: (code: string, language: string): Promise<{ result: string, performance: number }> => {
    // In a real implementation, this would send code to the supercomputer backend
    // For demo purposes, we're just simulating a response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different outputs based on language and code
        let result = '';
        if (language === 'javascript') {
          if (code.includes('console.log')) {
            const match = code.match(/console\.log\(['"](.+)['"]\)/);
            result = match ? `> ${match[1]}\n` : '> Hello, CF Chip A Supercomputer!';
          } else {
            result = '> Code executed successfully with no output';
          }
        } else if (language === 'python') {
          if (code.includes('print')) {
            const match = code.match(/print\(['"](.+)['"]\)/);
            result = match ? `> ${match[1]}\n` : '> Hello, CF Chip A Supercomputer!';
          } else {
            result = '> Code executed successfully with no output';
          }
        } else {
          result = `> Code compiled and executed in ${language}`;
        }
        
        // Add some supercomputer performance metrics
        result += `\n> Execution completed in 0.0021s\n`;
        result += `> Memory usage: 12.4MB\n`;
        result += `> CF Chip A Supercomputer processing units: 128/1024\n`;
        result += `> Quantum acceleration: Enabled\n`;
        
        resolve({ 
          result, 
          performance: Math.random() * 100
        });
      }, 800);
    });
  }
};

type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  language?: string;
  path: string;
  expanded?: boolean;
};

export default function CodeEditor() {
  const { setCurrentApp } = useAppState();
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [fileStructure, setFileStructure] = useState<FileNode[]>([
    {
      id: '1',
      name: 'Project',
      type: 'folder',
      path: '/Project',
      expanded: true,
      children: [
        {
          id: '2',
          name: 'index.html',
          type: 'file',
          path: '/Project/index.html',
          language: 'html',
          content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Project</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello, Centrifugal Browser!</h1>\n  <p>Edit this file to get started.</p>\n  \n  <script src="main.js"></script>\n</body>\n</html>'
        },
        {
          id: '3',
          name: 'styles.css',
          type: 'file',
          path: '/Project/styles.css',
          language: 'css',
          content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: linear-gradient(135deg, #1e1e2e, #2d2d3f);\n  color: #ffffff;\n}\n\nh1 {\n  color: #5d5dff;\n}\n\np {\n  line-height: 1.6;\n}'
        },
        {
          id: '4',
          name: 'main.js',
          type: 'file',
          path: '/Project/main.js',
          language: 'javascript',
          content: '// This is the main JavaScript file\n\n// CF Chip A - Supercomputer Integration\nconsole.log("Connected to CF Chip A Supercomputer");\n\n// Sample function that uses the supercomputer\'s processing power\nfunction calculateComplexData() {\n  // This would actually use the CF Chip A in a real implementation\n  return "Data processed by CF Chip A Supercomputer";\n}\n\n// Initialize application\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Application started");\n});\n'
        },
        {
          id: '5',
          name: 'src',
          type: 'folder',
          path: '/Project/src',
          children: [
            {
              id: '6',
              name: 'utils.js',
              type: 'file',
              path: '/Project/src/utils.js',
              language: 'javascript',
              content: '// Utility functions\n\n/**\n * Formats a date in a user-friendly way\n * @param {Date} date - The date to format\n * @return {string} Formatted date string\n */\nexport function formatDate(date) {\n  return new Date(date).toLocaleDateString();\n}\n\n/**\n * Generates a unique ID\n * @return {string} A unique identifier\n */\nexport function generateId() {\n  return Math.random().toString(36).substring(2, 15);\n}\n'
            },
            {
              id: '7',
              name: 'api.js',
              type: 'file',
              path: '/Project/src/api.js',
              language: 'javascript',
              content: '// API related functions\n\n/**\n * Fetches data from an API endpoint\n * @param {string} url - The API endpoint\n * @return {Promise} Promise resolving to the API response\n */\nexport async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error("API Error:", error);\n    return null;\n  }\n}\n'
            }
          ]
        },
        {
          id: '8',
          name: 'python',
          type: 'folder',
          path: '/Project/python',
          children: [
            {
              id: '9',
              name: 'script.py',
              type: 'file',
              path: '/Project/python/script.py',
              language: 'python',
              content: '# Example Python script\n\ndef greet(name):\n    """Returns a greeting message\n    \n    Args:\n        name (str): The name to greet\n        \n    Returns:\n        str: The greeting message\n    """\n    return f"Hello, {name}!"\n\n# Using CF Chip A for high-performance computing\nprint("Running on CF Chip A Supercomputer")\n\n# This would be a computationally intensive task in a real application\ndef analyze_big_data():\n    print("Analyzing large dataset with quantum acceleration...")\n    # Simulating a complex calculation\n    return "Analysis complete!"\n\nif __name__ == "__main__":\n    print(greet("User"))\n    result = analyze_big_data()\n    print(result)\n'
            }
          ]
        }
      ]
    }
  ]);
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('code-editor');
  }, [setCurrentApp]);
  
  // Open the main.js file by default
  useEffect(() => {
    const defaultFile = findFileById('4', fileStructure);
    if (defaultFile) {
      openFile(defaultFile);
    }
  }, []);
  
  const findFileById = (id: string, nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = findFileById(id, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  
  const openFile = (file: FileNode) => {
    if (file.type === 'file') {
      setActiveFile(file);
      setFileContent(file.content || '');
      setUnsavedChanges(false);
      
      // Set the language based on file extension
      if (file.name.endsWith('.js')) {
        setSelectedLanguage('javascript');
      } else if (file.name.endsWith('.py')) {
        setSelectedLanguage('python');
      } else if (file.name.endsWith('.html')) {
        setSelectedLanguage('html');
      } else if (file.name.endsWith('.css')) {
        setSelectedLanguage('css');
      } else {
        setSelectedLanguage('plaintext');
      }
    }
  };
  
  const saveFile = () => {
    if (!activeFile) return;
    
    // Update the file content in our file structure
    const updatedStructure = [...fileStructure];
    const updateFileContent = (nodes: FileNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === activeFile.id) {
          nodes[i].content = fileContent;
          return true;
        }
        if (nodes[i].children) {
          if (updateFileContent(nodes[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };
    
    updateFileContent(updatedStructure);
    setFileStructure(updatedStructure);
    setUnsavedChanges(false);
    
    // Update our active file reference
    setActiveFile({
      ...activeFile,
      content: fileContent
    });
    
    // Show success in console
    setConsoleOutput(`File saved: ${activeFile.name}\n${consoleOutput}`);
  };
  
  const runCode = async () => {
    if (!activeFile || !fileContent) return;
    
    setIsRunning(true);
    setConsoleOutput('Running code...\n');
    
    try {
      // Use our supercomputer simulation to run the code
      const { result } = await CFChipA.compileAndRun(fileContent, selectedLanguage);
      setConsoleOutput(`${result}\n${consoleOutput}`);
    } catch (error) {
      setConsoleOutput(`Error: ${error}\n${consoleOutput}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  const createNewFile = () => {
    if (!newFileName) return;
    
    const newFile: FileNode = {
      id: String(Date.now()),
      name: newFileName.includes('.') ? newFileName : `${newFileName}.js`,
      type: 'file',
      path: `/Project/${newFileName}`,
      content: '// New file',
      language: 'javascript'
    };
    
    // Add file to root of the project
    const updatedStructure = [...fileStructure];
    updatedStructure[0].children = [...(updatedStructure[0].children || []), newFile];
    setFileStructure(updatedStructure);
    setNewFileName('');
    setCreateFileDialogOpen(false);
    
    // Open the new file
    openFile(newFile);
  };
  
  const createNewFolder = () => {
    if (!newFolderName) return;
    
    const newFolder: FileNode = {
      id: String(Date.now()),
      name: newFolderName,
      type: 'folder',
      path: `/Project/${newFolderName}`,
      children: []
    };
    
    // Add folder to root of the project
    const updatedStructure = [...fileStructure];
    updatedStructure[0].children = [...(updatedStructure[0].children || []), newFolder];
    setFileStructure(updatedStructure);
    setNewFolderName('');
    setCreateFolderDialogOpen(false);
  };
  
  const toggleFolder = (id: string) => {
    const updatedStructure = [...fileStructure];
    
    const toggleFolderExpanded = (nodes: FileNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          nodes[i].expanded = !nodes[i].expanded;
          return true;
        }
        if (nodes[i].children) {
          if (toggleFolderExpanded(nodes[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };
    
    toggleFolderExpanded(updatedStructure);
    setFileStructure(updatedStructure);
  };
  
  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map(node => (
      <div key={node.id} className="ml-2">
        {node.type === 'folder' ? (
          <div>
            <div 
              className="flex items-center py-1 px-2 rounded hover:bg-neutral-light cursor-pointer"
              onClick={() => toggleFolder(node.id)}
            >
              <ChevronRight 
                className={`h-4 w-4 mr-1 transform transition-transform ${node.expanded ? 'rotate-90' : ''}`} 
              />
              {node.expanded ? (
                <FolderOpen className="h-4 w-4 mr-2 text-yellow-500" />
              ) : (
                <FolderClosed className="h-4 w-4 mr-2 text-yellow-500" />
              )}
              <span>{node.name}</span>
            </div>
            {node.expanded && node.children && (
              <div className="border-l border-neutral-light ml-3 pl-2">
                {renderFileTree(node.children)}
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`flex items-center py-1 px-2 ml-4 rounded hover:bg-neutral-light cursor-pointer ${
              activeFile?.id === node.id ? 'bg-neutral-light' : ''
            }`}
            onClick={() => openFile(node)}
          >
            <FileCode className="h-4 w-4 mr-2 text-blue-500" />
            <span>{node.name}</span>
            {unsavedChanges && activeFile?.id === node.id && (
              <div className="ml-2 h-2 w-2 rounded-full bg-red-500"></div>
            )}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* File Explorer */}
      <div className="w-64 bg-[#1e1e2e] border-r border-[#363646] text-white flex flex-col">
        <div className="p-3 border-b border-[#363646] flex justify-between items-center">
          <h2 className="font-semibold text-sm flex items-center">
            <Code className="h-5 w-5 mr-2" /> EXPLORER
          </h2>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white"
              onClick={() => setCreateFileDialogOpen(true)}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white"
              onClick={() => setCreateFolderDialogOpen(true)}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {renderFileTree(fileStructure)}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-[#363646] text-xs text-[#666]">
          CF Chip A Supercomputer
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 bg-[#282a36] text-white flex flex-col">
        <div className="p-3 border-b border-[#363646] flex justify-between items-center">
          <div className="flex items-center overflow-hidden">
            {activeFile && (
              <>
                <div className="text-sm flex items-center">
                  <span className="text-[#666] mr-2">{activeFile.path}</span>
                  <span className={unsavedChanges ? 'text-red-400' : ''}>
                    {unsavedChanges ? '●' : ''}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              className="bg-[#1e1e2e] border border-[#363646] rounded text-sm px-2 py-1"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
            
            <Button 
              variant="ghost" 
              size="sm"
              disabled={!activeFile || isRunning}
              onClick={saveFile}
              className="text-white"
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            
            <Button 
              variant={isRunning ? 'outline' : 'default'} 
              size="sm"
              disabled={!activeFile || !fileContent}
              onClick={runCode}
              className={isRunning ? 'animate-pulse' : ''}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" /> Run
                </>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1e1e2e] text-white border-[#363646]">
                <DropdownMenuItem className="focus:bg-[#363646]">
                  <Download className="h-4 w-4 mr-2" /> Download File
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-[#363646]">
                  <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#363646]" />
                <DropdownMenuItem className="focus:bg-[#363646]">
                  <Settings className="h-4 w-4 mr-2" /> Editor Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <textarea 
              className="flex-1 bg-[#282a36] text-white p-4 font-mono outline-none resize-none"
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                if (!unsavedChanges) {
                  setUnsavedChanges(true);
                }
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
              <div className="text-center">
                <Code className="h-16 w-16 mx-auto mb-4" />
                <p>Select a file to edit</p>
              </div>
            </div>
          )}
          
          <div className="h-40 bg-[#1e1e2e] border-t border-[#363646] p-3 font-mono text-sm overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold text-neutral-400">CONSOLE</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-neutral-400"
                onClick={() => setConsoleOutput('')}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <pre className="text-green-400 whitespace-pre-wrap">
              {consoleOutput || '> CF Chip A Supercomputer ready\n> Run code to see output...'}
            </pre>
          </div>
        </div>
      </div>
      
      {/* Create File Dialog */}
      <Dialog open={createFileDialogOpen} onOpenChange={setCreateFileDialogOpen}>
        <DialogContent className="bg-[#1e1e2e] text-white border-[#363646]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              placeholder="file-name.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-[#282a36] border-[#363646] text-white"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateFileDialogOpen(false)}
              className="border-[#363646] text-white"
            >
              Cancel
            </Button>
            <Button onClick={createNewFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Folder Dialog */}
      <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
        <DialogContent className="bg-[#1e1e2e] text-white border-[#363646]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              placeholder="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-[#282a36] border-[#363646] text-white"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateFolderDialogOpen(false)}
              className="border-[#363646] text-white"
            >
              Cancel
            </Button>
            <Button onClick={createNewFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}