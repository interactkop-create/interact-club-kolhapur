import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, ArrowRight, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { tasksAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

export const AdminTasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    assigned_to_name: '',
    due_date: '',
    priority: 'medium'
  });

  const [forwardData, setForwardData] = useState({
    forward_to: '',
    forward_to_name: '',
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, membersRes] = await Promise.all([
        tasksAPI.getAll(),
        tasksAPI.getBoardMembers()
      ]);
      setTasks(tasksRes.data);
      setBoardMembers(membersRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.create(newTask);
      toast({ title: "Success", description: "Task created successfully" });
      setIsCreateOpen(false);
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        assigned_to_name: '',
        due_date: '',
        priority: 'medium'
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const handleMemberSelect = (email) => {
    const member = boardMembers.find(m => m.email === email);
    setNewTask({
      ...newTask,
      assigned_to: email,
      assigned_to_name: member ? `${member.name} (${member.role})` : email
    });
  };

  const handleForwardMemberSelect = (email) => {
    const member = boardMembers.find(m => m.email === email);
    setForwardData({
      ...forwardData,
      forward_to: email,
      forward_to_name: member ? `${member.name} (${member.role})` : email
    });
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await tasksAPI.update(taskId, { status });
      toast({ title: "Success", description: "Task status updated" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const handleForwardTask = async (e) => {
    e.preventDefault();
    try {
      await tasksAPI.forward(selectedTask._id, forwardData);
      toast({ title: "Success", description: "Task forwarded successfully" });
      setIsForwardOpen(false);
      setForwardData({ forward_to: '', forward_to_name: '', comment: '' });
      setSelectedTask(null);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to forward task",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      toast({ title: "Success", description: "Task deleted successfully" });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
      completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle }
    };
    const { color, icon: Icon } = variants[status] || variants.pending;
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700'
    };
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const createdTasks = tasks.filter(t => t.created_by === localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).email : '');
  const assignedTasks = tasks.filter(t => t.assigned_to === (localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).email : ''));

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">Create, assign, and track tasks with your team</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label>Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label>Assign To</Label>
                <Select onValueChange={handleMemberSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board member" />
                  </SelectTrigger>
                  <SelectContent>
                    {boardMembers.map(member => (
                      <SelectItem key={member.email} value={member.email}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(val) => setNewTask({ ...newTask, priority: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assigned">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="assigned">Assigned to Me ({assignedTasks.length})</TabsTrigger>
          <TabsTrigger value="created">Created by Me ({createdTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4 mt-6">
          {assignedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No tasks assigned to you yet
              </CardContent>
            </Card>
          ) : (
            assignedTasks.map(task => (
              <Card key={task._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                      <div className="flex gap-2 items-center flex-wrap">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                        {task.due_date && (
                          <Badge variant="outline">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    From: {task.created_by_name}
                    {task.forwarded_from && (
                      <span className="block">Forwarded from: {task.forwarded_from}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task._id, task.status === 'pending' ? 'in_progress' : 'completed')}
                        >
                          {task.status === 'pending' ? 'Start Task' : 'Mark Complete'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsForwardOpen(true);
                          }}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Forward
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="created" className="space-y-4 mt-6">
          {createdTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                You haven't created any tasks yet
              </CardContent>
            </Card>
          ) : (
            createdTasks.map(task => (
              <Card key={task._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                      <div className="flex gap-2 items-center flex-wrap">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Assigned to: {task.assigned_to_name}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Forward Dialog */}
      <Dialog open={isForwardOpen} onOpenChange={setIsForwardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forward Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForwardTask} className="space-y-4">
            <div>
              <Label>Forward To</Label>
              <Select onValueChange={handleForwardMemberSelect} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {boardMembers.filter(m => m.email !== selectedTask?.created_by).map(member => (
                    <SelectItem key={member.email} value={member.email}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comment (Optional)</Label>
              <Textarea
                value={forwardData.comment}
                onChange={(e) => setForwardData({ ...forwardData, comment: e.target.value })}
                placeholder="Add a note..."
                rows={2}
              />
            </div>
            <Button type="submit" className="w-full">Forward Task</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
