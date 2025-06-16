// src/components/TaskForm.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Flag, 
  Tag, 
  Clock, 
  Repeat, 
  Star,
  Save,
  Plus
} from 'lucide-react';
import clsx from 'clsx';

export default function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'General',
    dueDate: '',
    estimatedTime: 30,
    isImportant: false,
    tags: [],
    recurrence: {
      type: 'none',
      interval: 1,
      endDate: '',
    },
  });

  const [tagInput, setTagInput] = useState('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        category: task.category || 'General',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedTime: task.estimatedTime || 30,
        isImportant: task.isImportant || false,
        tags: task.tags || [],
        recurrence: task.recurrence || {
          type: 'none',
          interval: 1,
          endDate: '',
        },
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'General',
        dueDate: '',
        estimatedTime: 30,
        isImportant: false,
        tags: [],
        recurrence: {
          type: 'none',
          interval: 1,
          endDate: '',
        },
      });
    }
    setTagInput('');
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      recurrence: formData.recurrence.type === 'none' ? undefined : formData.recurrence,
    };

    onSubmit(submitData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tagInput') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="card-glass p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
                <motion.button
                  onClick={onClose}
                  className="text-white/60 hover:text-white/80 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-modern text-white placeholder-white/50"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-modern text-white placeholder-white/50 h-24 resize-none"
                    placeholder="Add task description..."
                  />
                </div>

                {/* Row 1: Priority, Category, Important */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <Flag size={16} className="inline mr-1" />
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-modern text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="input-modern text-white placeholder-white/50"
                      placeholder="General"
                    />
                  </div>

                  {/* Important Toggle */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Mark as Important
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isImportant: !prev.isImportant }))}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200',
                        formData.isImportant
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                          : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star size={16} fill={formData.isImportant ? 'currentColor' : 'none'} />
                      {formData.isImportant ? 'Important' : 'Normal'}
                    </motion.button>
                  </div>
                </div>

                {/* Row 2: Due Date, Estimated Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input-modern text-white"
                    />
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <Clock size={16} className="inline mr-1" />
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      step="5"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                      className="input-modern text-white"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      name="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="input-modern text-white placeholder-white/50 flex-1"
                      placeholder="Add a tag..."
                    />
                    <motion.button
                      type="button"
                      onClick={addTag}
                      className="btn-glass px-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-primary-200 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Repeat size={16} className="inline mr-1" />
                    Recurrence
                  </label>
                  <select
                    value={formData.recurrence.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      recurrence: { ...prev.recurrence, type: e.target.value }
                    }))}
                    className="input-modern text-white"
                  >
                    <option value="none">No Repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="btn-glass px-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
