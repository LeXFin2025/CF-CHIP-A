import { useEffect, useState } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { ListTodo, Calendar, Plus, CheckCircle, Circle, ChevronRight, Clock, MoreVertical, Trash, Edit, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  list: string;
  priority: 'low' | 'medium' | 'high';
};

export default function Tasks() {
  const { setCurrentApp } = useAppState();
  const [activeList, setActiveList] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    list: 'inbox',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('tasks');
  }, [setCurrentApp]);
  
  // Sample tasks data (in a real app this would come from an API)
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: 'Complete project proposal', 
      description: 'Finalize the proposal document and send it to the client for review',
      completed: false, 
      dueDate: addDays(new Date(), 1).toISOString(),
      list: 'work',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Buy groceries', 
      description: 'Milk, eggs, bread, fruits, and vegetables',
      completed: false, 
      dueDate: new Date().toISOString(),
      list: 'personal',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Call dentist', 
      description: 'Schedule appointment for next week',
      completed: true, 
      dueDate: addDays(new Date(), -1).toISOString(),
      list: 'personal',
      priority: 'medium'
    },
    { 
      id: 4, 
      title: 'Review team progress', 
      description: 'Check on the development team progress and address any blockers',
      completed: false, 
      dueDate: addDays(new Date(), 2).toISOString(),
      list: 'work',
      priority: 'high'
    },
    { 
      id: 5, 
      title: 'Update portfolio website', 
      description: 'Add recent projects and update skills section',
      completed: false, 
      dueDate: null,
      list: 'personal',
      priority: 'low'
    }
  ]);
  
  const lists = [
    { id: 'all', name: 'All Tasks', icon: <ListTodo className="h-5 w-5" /> },
    { id: 'today', name: 'Today', icon: <Calendar className="h-5 w-5" /> },
    { id: 'inbox', name: 'Inbox', icon: <ListTodo className="h-5 w-5" /> },
    { id: 'work', name: 'Work', icon: <ListTodo className="h-5 w-5" /> },
    { id: 'personal', name: 'Personal', icon: <ListTodo className="h-5 w-5" /> },
    { id: 'completed', name: 'Completed', icon: <CheckCircle className="h-5 w-5" /> },
  ];
  
  const filteredTasks = tasks.filter(task => {
    if (activeList === 'all') {
      return true;
    } else if (activeList === 'today') {
      return task.dueDate && isToday(new Date(task.dueDate));
    } else if (activeList === 'completed') {
      return task.completed;
    } else {
      return task.list === activeList;
    }
  });
  
  const handleCreateTask = () => {
    // In a real app this would be an API call
    const newTaskObj: Task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      completed: false,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
      list: newTask.list,
      priority: newTask.priority
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      list: 'inbox',
      priority: 'medium',
    });
    setCreateTaskOpen(false);
    setSelectedTask(newTaskObj);
  };
  
  const handleToggleComplete = (id: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    if (selectedTask?.id === id) {
      setSelectedTask({ ...selectedTask, completed: !selectedTask.completed });
    }
  };
  
  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        return selectedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setEditMode(false);
  };
  
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };
  
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-neutral-medium';
    }
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="description" 
                  rows={3} 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="list" className="text-sm font-medium">List</label>
                  <select
                    id="list"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.list}
                    onChange={(e) => setNewTask({ ...newTask, list: e.target.value })}
                  >
                    <option value="inbox">Inbox</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={newTask.dueDate} 
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateTaskOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="space-y-1">
          {lists.map((list) => (
            <button
              key={list.id}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-light ${
                activeList === list.id ? 'bg-primary text-white hover:bg-primary' : ''
              }`}
              onClick={() => setActiveList(list.id)}
            >
              <span className="mr-3">{list.icon}</span>
              {list.name}
              {list.id !== 'all' && list.id !== 'completed' && list.id !== 'today' && (
                <span className="ml-auto">
                  {tasks.filter(task => task.list === list.id && !task.completed).length}
                </span>
              )}
              {list.id === 'today' && (
                <span className="ml-auto">
                  {tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)) && !task.completed).length}
                </span>
              )}
              {list.id === 'completed' && (
                <span className="ml-auto">
                  {tasks.filter(task => task.completed).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-light text-sm text-neutral-medium">
          <div className="flex justify-between items-center">
            <span>Total Tasks:</span>
            <span>{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Completed:</span>
            <span>{tasks.filter(task => task.completed).length}</span>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="w-80 border-r border-neutral-light bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <h2 className="font-semibold">{lists.find(l => l.id === activeList)?.name}</h2>
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-4 text-center text-neutral-medium">
              No tasks found
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 border-b border-neutral-light hover:bg-neutral-light cursor-pointer ${
                  selectedTask?.id === task.id ? 'bg-neutral-light' : ''
                } ${task.completed ? 'opacity-60' : ''}`}
                onClick={() => {
                  setSelectedTask(task);
                  setEditMode(false);
                }}
              >
                <div className="flex items-start mb-2">
                  <div 
                    className="mt-1 mr-3" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(task.id);
                    }}
                  >
                    <Checkbox checked={task.completed} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</div>
                    <div className="text-xs text-neutral-medium flex items-center mt-1">
                      {task.dueDate && (
                        <div className="flex items-center mr-3">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDueDate(task.dueDate)}
                        </div>
                      )}
                      <div className={`capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-medium" />
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-light">
          <Button 
            variant="outline" 
            className="w-full text-neutral-medium"
            onClick={() => setCreateTaskOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Task Details */}
      <div className="flex-1 bg-white overflow-auto">
        {selectedTask ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-neutral-light flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="mr-4"
                  onClick={() => handleToggleComplete(selectedTask.id)}
                >
                  <Checkbox checked={selectedTask.completed} />
                </div>
                
                {editMode ? (
                  <Input 
                    value={selectedTask.title} 
                    onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})} 
                    className="text-xl font-bold"
                  />
                ) : (
                  <h1 className={`text-xl font-bold ${selectedTask.completed ? 'line-through' : ''}`}>
                    {selectedTask.title}
                  </h1>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleUpdateTask}>Save</Button>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEditMode(true)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTask(selectedTask.id)} className="text-red-500">
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <div className="p-4 border-b border-neutral-light grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-neutral-medium mb-1">List</div>
                {editMode ? (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedTask.list}
                    onChange={(e) => setSelectedTask({...selectedTask, list: e.target.value})}
                  >
                    <option value="inbox">Inbox</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                ) : (
                  <div className="capitalize">{selectedTask.list}</div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-neutral-medium mb-1">Priority</div>
                {editMode ? (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <div className={`capitalize ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-neutral-medium mb-1">Due Date</div>
                {editMode ? (
                  <Input 
                    type="date" 
                    value={selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'yyyy-MM-dd') : ''} 
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null})} 
                  />
                ) : (
                  <div>{formatDueDate(selectedTask.dueDate)}</div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-neutral-medium mb-1">Status</div>
                <div>{selectedTask.completed ? 'Completed' : 'Active'}</div>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className="text-sm text-neutral-medium mb-2">Description</div>
              {editMode ? (
                <Textarea 
                  value={selectedTask.description} 
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})} 
                  className="w-full" 
                  rows={10}
                />
              ) : (
                <div className="whitespace-pre-wrap">{selectedTask.description || 'No description provided.'}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-medium">
            <div className="text-center">
              <ListTodo className="h-16 w-16 mx-auto mb-4 text-neutral-light" />
              <p>Select a task or create a new one</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setCreateTaskOpen(true)}
              >
                Create a new task
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
