import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Plus, Edit, Trash2, MessageSquare, Calendar, User, Clock } from 'lucide-react';
import { tasksAPI, usersAPI } from '../../services/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export const AdminTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assigned_to_id: '',
    due_date: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        assigned_to_id: formData.assigned_to_id === 'unassigned' ? null : (formData.assigned_to_id || null),
};

      if (selectedTask) {
        await tasksAPI.update(selectedTask._id, payload);
        toast.success('Task updated successfully');
      } else {
        await tasksAPI.create(payload);
        toast.success('Task created successfully');
      }
      fetchTasks();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assigned_to_id: task.assigned_to_id || '',
      due_date: task.due_date || '',
    });
    setIsDialogOpen(true);
  };

  const handleViewComments = async (task) => {
    setSelectedTask(task);
    try {
      const response = await tasksAPI.getComments(task._id);
      setComments(response.data);
      setIsCommentDialogOpen(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await tasksAPI.addComment(selectedTask._id, newComment);
      const response = await tasksAPI.getComments(selectedTask._id);
      setComments(response.data);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assigned_to_id: '',
      due_date: '',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'my') return task.assigned_to_id === user?.id;
    return task.status === filter;
  });

  if (loading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>;
  }

  return (
    <div data-testid="admin-tasks-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">Assign and manage tasks for board members</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="create-task-btn">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  data-testid="task-title-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  data-testid="task-description-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger data-testid="task-priority-select">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger data-testid="task-status-select">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <Select
                  value={formData.assigned_to_id}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to_id: value })}
                >
                  <SelectTrigger data-testid="task-assignee-select">
                    <SelectValue placeholder="Select a board member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  data-testid="task-due-date-input"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="save-task-btn">
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          data-testid="filter-all-btn"
        >
          All Tasks ({tasks.length})
        </Button>
        <Button
          variant={filter === 'my' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('my')}
          data-testid="filter-my-btn"
        >
          My Tasks ({tasks.filter(t => t.assigned_to_id === user?.id).length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
          data-testid="filter-pending-btn"
        >
          Pending ({tasks.filter(t => t.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('in_progress')}
          data-testid="filter-inprogress-btn"
        >
          In Progress ({tasks.filter(t => t.status === 'in_progress').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          data-testid="filter-completed-btn"
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </Button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tasks found. Create your first task to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task._id} data-testid={`task-card-${task._id}`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Assigned to: {task.assigned_to_name || 'Unassigned'}</span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {task.due_date}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created by: {task.created_by_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Quick Status Change */}
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task._id, value)}
                    >
                      <SelectTrigger className="w-[140px]" data-testid={`status-change-${task._id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewComments(task)}
                        data-testid={`comments-btn-${task._id}`}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                        data-testid={`edit-task-${task._id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-task-${task._id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comments Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments - {selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto space-y-3">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea
                data-testid="comment-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                data-testid="add-comment-btn"
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
