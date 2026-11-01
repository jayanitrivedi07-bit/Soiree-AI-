import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { Task } from '../types';
import { getDaysRemaining } from '../lib/formatters';
import { Calendar, Plus, CheckCircle2, Clock, Trash2, Edit3, Sparkles, Filter, AlertCircle, Check } from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { event, addTask, toggleTask, deleteTask, updateTask } = useEvent();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Venue');
  const [dueDate, setDueDate] = useState(event.date);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formError, setFormError] = useState('');

  // Inline edit state
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const daysLeft = getDaysRemaining(event.date);
  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter(t => t.done).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = event.tasks.filter(task => {
    if (filterStatus === 'pending' && task.done) return false;
    if (filterStatus === 'completed' && !task.done) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a milestone description');
      return;
    }

    addTask({
      title: title.trim(),
      category,
      dueDate: dueDate || event.date,
      priority,
      done: false
    });

    setTitle('');
    setCategory('Venue');
    setPriority('medium');
    setFormError('');
    setShowAddModal(false);
  };

  const startEdit = (t: Task) => {
    setEditingTaskId(t.id);
    setEditTitle(t.title);
    setEditDueDate(t.dueDate);
  };

  const saveEdit = (taskId: string) => {
    if (!editTitle.trim()) return;
    updateTask(taskId, {
      title: editTitle.trim(),
      dueDate: editDueDate
    });
    setEditingTaskId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            <span>Master Run-of-Show & Milestones</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Timeline & Calendar
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-1">
            Hour-by-hour run of show, vendor contract deadlines, and sensory tasting milestones for {event.name}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Progress & Countdown Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-white border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">Countdown</span>
            <span className="font-headline text-2xl font-bold text-primary block mt-0.5">{daysLeft} Days to Event</span>
            <span className="text-xs text-on-surface-variant">{event.date}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">Milestone Progress</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="font-headline text-2xl font-bold text-primary">{completionPercentage}%</span>
              <span className="text-xs text-on-surface-variant font-medium">{completedTasks} of {totalTasks} done</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-secondary block">AI Advisory</span>
            <p className="text-xs text-on-surface font-medium mt-1 leading-snug">
              Floral & tasting walkthroughs prioritized for 60-day buffer before guest invitations dispatch.
            </p>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filterStatus === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
            }`}
          >
            All Milestones ({totalTasks})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filterStatus === 'pending'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
            }`}
          >
            Pending ({totalTasks - completedTasks})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filterStatus === 'completed'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant font-medium">Priority:</span>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
                filterPriority === p
                  ? 'bg-secondary text-white'
                  : 'bg-white text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-outline-variant/40">
            <Calendar className="w-10 h-10 text-secondary mx-auto mb-2" />
            <h3 className="font-headline text-lg font-bold text-primary">No Milestones Match Your Filter</h3>
            <p className="text-xs text-on-surface-variant mt-1">Try resetting filters or click "Add Milestone" above.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                task.done ? 'border-outline-variant/40 bg-surface-container-low/30' : 'border-outline-variant/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    task.done
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'border-outline hover:border-primary bg-white'
                  }`}
                  aria-label="Toggle complete"
                >
                  {task.done && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1 space-y-1">
                  {editingTaskId === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-sm font-semibold p-2 border border-primary rounded-lg text-primary"
                      />
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="text-xs p-1.5 border border-outline-variant rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className={`text-base font-semibold leading-snug ${
                        task.done ? 'line-through text-on-surface-variant/60' : 'text-on-surface'
                      }`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-semibold text-[11px]">
                          {task.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-secondary" />
                          Target: {task.dueDate}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                  task.priority === 'medium' ? 'bg-secondary-container text-secondary' :
                  'bg-surface-container text-on-surface-variant'
                }`}>
                  {task.priority} Priority
                </span>

                <div className="flex items-center gap-1">
                  {editingTaskId === task.id ? (
                    <button
                      type="button"
                      onClick={() => saveEdit(task.id)}
                      className="p-1.5 rounded-full bg-green-600 text-white hover:bg-green-700"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      title="Edit Milestone"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-headline text-lg font-bold text-primary">Add Celebration Milestone</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <p className="text-xs text-error bg-error-container p-2 rounded-lg">{formError}</p>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Milestone Description</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm acoustic sitar soundcheck & stage lighting"
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Florals">Florals</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Decor">Decor</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Coordination">Coordination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-white font-semibold uppercase tracking-wider shadow-md"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

