// src/components/TaskFilters.jsx
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Flag, 
  Tag, 
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function TaskFilters({ 
  filters, 
  onFiltersChange, 
  stats,
  className = '' 
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      isImportant: false,
      search: '',
      dateRange: null,
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.isImportant ||
    filters.search ||
    filters.dateRange;

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filters */}
        <motion.button
          onClick={() => updateFilter('status', filters.status === 'all' ? 'Pending' : 'all')}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            filters.status === 'Pending'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Clock size={14} />
          Pending ({stats.pending})
        </motion.button>

        <motion.button
          onClick={() => updateFilter('status', filters.status === 'all' ? 'In Progress' : 'all')}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            filters.status === 'In Progress'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlertCircle size={14} />
          In Progress ({stats.inProgress})
        </motion.button>

        <motion.button
          onClick={() => updateFilter('status', filters.status === 'all' ? 'Completed' : 'all')}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            filters.status === 'Completed'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={14} />
          Completed ({stats.completed})
        </motion.button>

        {/* Important Filter */}
        <motion.button
          onClick={() => updateFilter('isImportant', !filters.isImportant)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            filters.isImportant
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star size={14} fill={filters.isImportant ? 'currentColor' : 'none'} />
          Important ({stats.important})
        </motion.button>

        {/* Advanced Filters Toggle */}
        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            showAdvanced
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={14} />
          Filters
        </motion.button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            Clear
          </motion.button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card-glass p-4 space-y-4"
        >
          <h3 className="text-white font-medium flex items-center gap-2">
            <Filter size={16} />
            Advanced Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Filter */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Flag size={14} className="inline mr-1" />
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => updateFilter('priority', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Tag size={14} className="inline mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Calendar size={14} className="inline mr-1" />
                Due Date
              </label>
              <select
                value={filters.dateRange ? 'custom' : 'all'}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    updateFilter('dateRange', null);
                  } else if (e.target.value === 'today') {
                    const today = new Date();
                    updateFilter('dateRange', {
                      start: new Date(today.setHours(0, 0, 0, 0)),
                      end: new Date(today.setHours(23, 59, 59, 999))
                    });
                  } else if (e.target.value === 'week') {
                    const today = new Date();
                    const weekEnd = new Date(today);
                    weekEnd.setDate(today.getDate() + 7);
                    updateFilter('dateRange', {
                      start: today,
                      end: weekEnd
                    });
                  } else if (e.target.value === 'month') {
                    const today = new Date();
                    const monthEnd = new Date(today);
                    monthEnd.setMonth(today.getMonth() + 1);
                    updateFilter('dateRange', {
                      start: today,
                      end: monthEnd
                    });
                  }
                }}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Next 7 Days</option>
                <option value="month">Next 30 Days</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-white/70"
        >
          <Filter size={14} />
          <span>
            Showing filtered results
            {filters.search && ` for "${filters.search}"`}
          </span>
        </motion.div>
      )}
    </div>
  );
}
