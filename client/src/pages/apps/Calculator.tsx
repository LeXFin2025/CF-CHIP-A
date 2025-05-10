import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { Calculator as CalculatorIcon, Clock, Percent, Divide, X, Minus, Plus, Equal, Delete, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Calculator() {
  const { setCurrentApp } = useAppState();
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('standard');
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('calculator');
  }, [setCurrentApp]);
  
  const clearDisplay = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };
  
  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };
  
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(result));
      setFirstOperand(result);
      setHistory([...history, `${firstOperand} ${operator} ${inputValue} = ${result}`]);
    }
    
    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const performCalculation = () => {
    const inputValue = parseFloat(displayValue);
    
    if (operator === '+') {
      return (firstOperand || 0) + inputValue;
    } else if (operator === '-') {
      return (firstOperand || 0) - inputValue;
    } else if (operator === '*') {
      return (firstOperand || 0) * inputValue;
    } else if (operator === '/') {
      return (firstOperand || 0) / inputValue;
    } else if (operator === '%') {
      return (firstOperand || 0) % inputValue;
    }
    
    return inputValue;
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;
    
    const inputValue = parseFloat(displayValue);
    const result = performCalculation();
    
    setHistory([...history, `${firstOperand} ${operator} ${inputValue} = ${result}`]);
    setDisplayValue(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const toggleSign = () => {
    const newValue = parseFloat(displayValue) * -1;
    setDisplayValue(String(newValue));
  };
  
  const handlePercent = () => {
    const currentValue = parseFloat(displayValue);
    const percentValue = currentValue / 100;
    setDisplayValue(String(percentValue));
  };
  
  const handleBackspace = () => {
    if (displayValue.length === 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };
  
  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(displayValue));
  };
  
  const memorySubtract = () => {
    setMemory(memory - parseFloat(displayValue));
  };
  
  const memoryRecall = () => {
    setDisplayValue(String(memory));
  };
  
  const memoryClear = () => {
    setMemory(0);
  };
  
  // Scientific calculator functions
  const calculateSquare = () => {
    const value = parseFloat(displayValue);
    const result = value * value;
    setDisplayValue(String(result));
  };
  
  const calculateSquareRoot = () => {
    const value = parseFloat(displayValue);
    const result = Math.sqrt(value);
    setDisplayValue(String(result));
  };
  
  const calculateReciprocal = () => {
    const value = parseFloat(displayValue);
    const result = 1 / value;
    setDisplayValue(String(result));
  };
  
  const calculateSin = () => {
    const value = parseFloat(displayValue);
    const result = Math.sin(value * (Math.PI / 180)); // Convert degrees to radians
    setDisplayValue(String(result));
  };
  
  const calculateCos = () => {
    const value = parseFloat(displayValue);
    const result = Math.cos(value * (Math.PI / 180)); // Convert degrees to radians
    setDisplayValue(String(result));
  };
  
  const calculateTan = () => {
    const value = parseFloat(displayValue);
    const result = Math.tan(value * (Math.PI / 180)); // Convert degrees to radians
    setDisplayValue(String(result));
  };
  
  const calculateLog = () => {
    const value = parseFloat(displayValue);
    const result = Math.log10(value);
    setDisplayValue(String(result));
  };
  
  const calculateLn = () => {
    const value = parseFloat(displayValue);
    const result = Math.log(value);
    setDisplayValue(String(result));
  };
  
  const calculatePower = () => {
    setFirstOperand(parseFloat(displayValue));
    setOperator('^');
    setWaitingForSecondOperand(true);
  };
  
  const clearHistory = () => {
    setHistory([]);
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Calculator */}
      <div className="flex-1 bg-white flex flex-col max-w-md mx-auto">
        <div className="p-4 border-b border-neutral-light">
          <h2 className="font-semibold flex items-center">
            <CalculatorIcon className="h-5 w-5 mr-2" />
            Calculator
          </h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full py-2 px-4">
            <TabsTrigger value="standard" className="flex-1">Standard</TabsTrigger>
            <TabsTrigger value="scientific" className="flex-1">Scientific</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="flex-1 flex flex-col p-4">
            <div className="text-right p-4 text-4xl font-light bg-neutral-light rounded-md mb-4 h-20 flex items-center justify-end">
              {displayValue}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memoryAdd()}
              >
                M+
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memorySubtract()}
              >
                M-
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memoryRecall()}
              >
                MR
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memoryClear()}
              >
                MC
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => clearDisplay()}
              >
                C
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => toggleSign()}
              >
                +/-
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handlePercent()}
              >
                <Percent className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('/')}
              >
                <Divide className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('7')}
              >
                7
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('8')}
              >
                8
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('9')}
              >
                9
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('*')}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('4')}
              >
                4
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('5')}
              >
                5
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('6')}
              >
                6
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('-')}
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('1')}
              >
                1
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('2')}
              >
                2
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('3')}
              >
                3
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('+')}
              >
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleBackspace()}
              >
                <Delete className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('0')}
              >
                0
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDecimal()}
              >
                .
              </Button>
              <Button 
                variant="default" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleEquals()}
              >
                <Equal className="h-5 w-5" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="scientific" className="flex-1 flex flex-col p-4">
            <div className="text-right p-4 text-4xl font-light bg-neutral-light rounded-md mb-4 h-20 flex items-center justify-end">
              {displayValue}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => Math.PI.toString()}
              >
                π
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => Math.E.toString()}
              >
                e
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateLog()}
              >
                log
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateLn()}
              >
                ln
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => handleOperator('%')}
              >
                mod
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateSquare()}
              >
                x²
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculatePower()}
              >
                xʸ
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateSin()}
              >
                sin
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateCos()}
              >
                cos
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateTan()}
              >
                tan
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateSquareRoot()}
              >
                √
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => calculateReciprocal()}
              >
                1/x
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => clearDisplay()}
              >
                C
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => toggleSign()}
              >
                +/-
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-sm font-medium"
                onClick={() => handleOperator('/')}
              >
                <Divide className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('7')}
              >
                7
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('8')}
              >
                8
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('9')}
              >
                9
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('*')}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleBackspace()}
              >
                <Delete className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('4')}
              >
                4
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('5')}
              >
                5
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('6')}
              >
                6
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('-')}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memoryRecall()}
              >
                MR
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('1')}
              >
                1
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('2')}
              >
                2
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('3')}
              >
                3
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleOperator('+')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memoryAdd()}
              >
                M+
              </Button>
              
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDigit('0')}
              >
                0
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => inputDecimal()}
              >
                .
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => handlePercent()}
              >
                <Percent className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                className="aspect-square text-lg font-medium"
                onClick={() => handleEquals()}
              >
                <Equal className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="aspect-square text-lg font-medium"
                onClick={() => memorySubtract()}
              >
                M-
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Calculation History</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => clearHistory()}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Clear History
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              {history.length === 0 ? (
                <div className="text-center py-8 text-neutral-medium">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
                  <p>No calculation history yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((calculation, index) => (
                    <div 
                      key={index} 
                      className="p-3 border border-neutral-light rounded-md hover:bg-neutral-light"
                    >
                      {calculation}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}