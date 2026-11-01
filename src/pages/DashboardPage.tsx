import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { formatINR, getDaysRemaining, calculateBudgetMetrics } from '../lib/formatters';
import { Sparkles, Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight, IndianRupee, Users, PlusCircle, CheckSquare } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { event, toggleTask } = useEvent();
  const navigate = useNavigate();

  const daysLeft = getDaysRemaining(event.date);
  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter(t => t.done).length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const budgetMetrics = calculateBudgetMetrics(event.budget, event.expenses);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Private Host Atelier • {event.location.split(',')[0]}</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Welcome to {event.name}
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant">
            Your celebration is <span className="text-primary font-semibold">{daysLeft} days away</span> ({event.date}).
            Atmospheric arrangements, culinary curation, and artisan schedules are gracefully taking shape.
          </p>
        </div>

        {/* Quick Action Pill Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/timeline')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-primary text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => navigate('/budget')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-primary text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Log Expense</span>
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Consult AI</span>
          </button>
        </div>
      </div>

      {/* Top Countdown & Readiness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Countdown Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#f6f3f2] p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-secondary">Milestone Countdown</span>
              <span className="text-xs text-on-surface-variant font-medium">{event.date}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center my-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-headline text-3xl sm:text-4xl text-primary font-bold block">{daysLeft}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mt-1 block">Days Remaining</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-headline text-3xl sm:text-4xl text-primary font-bold block">{event.guestCount}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mt-1 block">Confirmed Patrons</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-headline text-3xl sm:text-4xl text-primary font-bold block">{event.vendors.filter(v => v.status === 'booked').length}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mt-1 block">Locked Vendors</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/30">
            <span className="font-semibold text-primary">{event.theme}</span>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Readiness Score Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#f6f3f2] p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-widest text-secondary">Readiness Score</span>
            <span className="text-[11px] uppercase font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
              {taskProgress >= 70 ? 'High Momentum' : 'In Progress'}
            </span>
          </div>

          <div className="my-6 flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-primary transition-all duration-700 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * taskProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-2xl font-bold text-primary leading-none">{taskProgress}%</span>
                <span className="text-[9px] uppercase tracking-widest text-secondary mt-0.5 font-bold">Done</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-headline text-lg font-bold text-primary">
                {completedTasks} of {totalTasks} Tasks Finished
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Key foundational contracts, banquet tastings, and guest logistics are underway.
              </p>
              <Link to="/timeline" className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline pt-1">
                <span>View Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${taskProgress}%` }}></div>
          </div>
        </div>

      </div>

      {/* AI Concierge Intelligence Spotlight */}
      <div className="rounded-2xl bg-[#3f0417] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fed798]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5b1a2b] text-[#fed798] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#fed798]" />
              <span>AI Concierge Intelligence Spotlight</span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-medium text-white">
              Photographer rates in Udaipur peak during October. Confirm Prism Lens Co. contract now.
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#ffd9de]/80 leading-relaxed">
              Our automated trend analysis indicates high demand for sunset cinematic film reels. Locking your photojournalism slot guarantees twilight aperture coverage without surge pricing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/vendors"
              className="px-5 py-2.5 rounded-full bg-[#fed798] text-[#3d0316] font-semibold text-xs uppercase tracking-wider hover:bg-[#ffdea9] transition-all shadow-sm"
            >
              Review Vendors
            </Link>
            <Link
              to="/assistant"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/20 transition-all border border-white/20"
            >
              Ask AI Details
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Priority Tasks & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-secondary" />
                <h3 className="font-headline text-xl text-primary font-semibold">Immediate Planning Action Items</h3>
              </div>
              <Link to="/timeline" className="text-xs font-semibold text-secondary hover:underline">
                Manage All ({totalTasks})
              </Link>
            </div>

            <div className="divide-y divide-outline-variant/30">
              {event.tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="py-3.5 flex items-start justify-between gap-4 group">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        task.done
                          ? 'bg-primary border-primary text-white'
                          : 'border-outline hover:border-primary'
                      }`}
                      aria-label="Toggle task status"
                    >
                      {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${task.done ? 'line-through text-on-surface-variant/60' : 'text-on-surface'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">{task.category}</span>
                        <span>Due: {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">{completedTasks} completed</span>
              <button
                onClick={() => navigate('/timeline')}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Add New Milestone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant/40 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-secondary" />
                <h3 className="font-headline text-xl text-primary font-semibold">Budget Allocations</h3>
              </div>
              <Link to="/budget" className="text-xs font-semibold text-secondary hover:underline">
                Open Planner
              </Link>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-on-surface-variant font-medium">Total Event Budget</span>
                <span className="font-headline text-2xl font-bold text-primary">{formatINR(budgetMetrics.totalBudget)}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/30">
                <span>Committed: <strong className="text-on-surface">{formatINR(budgetMetrics.totalCommitted)}</strong></span>
                <span>Remaining: <strong className={budgetMetrics.isOverBudget ? 'text-error' : 'text-secondary'}>{formatINR(budgetMetrics.remainingBudget)}</strong></span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${budgetMetrics.isOverBudget ? 'bg-error' : 'bg-secondary'}`}
                  style={{ width: `${Math.min(100, budgetMetrics.percentageUsed)}%` }}
                ></div>
              </div>
            </div>

            {/* Top Expenses breakdown */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase font-bold tracking-wider text-on-surface-variant block">Primary Cost Drivers</span>
              {event.expenses.slice(0, 4).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-medium text-on-surface">{exp.category}</span>
                  </div>
                  <span className="font-semibold text-primary">{formatINR(exp.actual || exp.estimated)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/budget')}
                className="w-full py-2.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-primary text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                Adjust & Rebalance Expenses
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

