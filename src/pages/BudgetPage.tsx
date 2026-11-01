import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { formatINR, calculateBudgetMetrics } from '../lib/formatters';
import { Expense, ExpenseCategory } from '../types';
import { IndianRupee, Plus, Trash2, Edit3, Sparkles, AlertTriangle, CheckCircle, ShieldAlert, Check } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { event, addExpense, updateExpense, deleteExpense, updateEvent } = useEvent();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form State for new expense
  const [category, setCategory] = useState<ExpenseCategory>('Catering');
  const [description, setDescription] = useState('');
  const [estimated, setEstimated] = useState<number>(50000);
  const [actual, setActual] = useState<number | ''>('');
  const [status, setStatus] = useState<Expense['status']>('pending');
  const [formError, setFormError] = useState('');

  // AI Savings Alert state
  const [savingsAlertVisible, setSavingsAlertVisible] = useState(true);
  const [savingsApplied, setSavingsApplied] = useState(false);

  // Inline edit state
  const [editEstimated, setEditEstimated] = useState<number>(0);
  const [editActual, setEditActual] = useState<number | ''>('');

  const metrics = calculateBudgetMetrics(event.budget, event.expenses);

  const categories: ExpenseCategory[] = [
    'Venue',
    'Catering',
    'Florals',
    'Photography',
    'Entertainment',
    'Decor',
    'Stationery',
    'Contingency',
    'Miscellaneous'
  ];

  const filteredExpenses = selectedCategory === 'All'
    ? event.expenses
    : event.expenses.filter(e => e.category === selectedCategory);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setFormError('Please enter an expense description');
      return;
    }
    if (estimated <= 0) {
      setFormError('Estimated amount must be greater than ₹ 0');
      return;
    }

    addExpense({
      category,
      description: description.trim(),
      estimated: Number(estimated),
      actual: actual !== '' ? Number(actual) : null,
      status
    });

    // Reset form
    setDescription('');
    setEstimated(50000);
    setActual('');
    setStatus('pending');
    setFormError('');
    setShowAddModal(false);
  };

  const startInlineEdit = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setEditEstimated(exp.estimated);
    setEditActual(exp.actual !== null ? exp.actual : '');
  };

  const saveInlineEdit = (expId: string) => {
    if (editEstimated <= 0) return;
    updateExpense(expId, {
      estimated: Number(editEstimated),
      actual: editActual !== '' ? Number(editActual) : null
    });
    setEditingExpenseId(null);
  };

  const applyFloralSavings = () => {
    const floralExp = event.expenses.find(e => e.category === 'Florals');
    if (floralExp) {
      updateExpense(floralExp.id, {
        estimated: Math.max(10000, floralExp.estimated - 45000)
      });
      setSavingsApplied(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      
      {/* Page Title & Luxury Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
            <IndianRupee className="w-3.5 h-3.5 text-secondary" />
            <span>Treasury & Financial Architecture</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            INR Budget Allocator
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-1">
            Real-time expenditure tracking, liquidity thresholds, and automated contract reserves for {event.name}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Financial Health Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/50 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">Total Target Budget</span>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-primary block mt-1">
            {formatINR(metrics.totalBudget)}
          </span>
          <span className="text-[11px] text-secondary mt-1 block font-medium">Defined in Event Brief</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/50 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">Total Estimated</span>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-on-surface block mt-1">
            {formatINR(metrics.totalEstimated)}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-1 block">Across {event.expenses.length} budgeted lines</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/50 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">Actual Committed / Paid</span>
          <span className="font-headline text-2xl sm:text-3xl font-bold text-primary block mt-1">
            {formatINR(metrics.totalCommitted)}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-1 block">{metrics.percentageUsed}% of budget committed</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${
          metrics.isOverBudget
            ? 'bg-[#ffdad6]/40 border-[#ba1a1a]/30 text-error'
            : 'bg-white border-outline-variant/50 text-secondary'
        }`}>
          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">
            {metrics.isOverBudget ? 'Budget Overspending' : 'Remaining Liquidity'}
          </span>
          <span className={`font-headline text-2xl sm:text-3xl font-bold block mt-1 ${metrics.isOverBudget ? 'text-error' : 'text-primary'}`}>
            {metrics.isOverBudget ? `+${formatINR(metrics.overAmount)}` : formatINR(metrics.remainingBudget)}
          </span>
          <span className="text-[11px] mt-1 block font-medium">
            {metrics.isOverBudget ? 'Requires rebalancing' : 'Available for contingencies'}
          </span>
        </div>

      </div>

      {/* Spending Velocity Bar & AI Savings Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Spending Velocity Bar (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                Spending Velocity & Liquidity Runway
              </span>
              <span className={`font-semibold ${metrics.isOverBudget ? 'text-error' : 'text-secondary'}`}>
                {metrics.isOverBudget ? 'Over Budget' : `${100 - metrics.percentageUsed}% Safe Runway`}
              </span>
            </div>

            {/* Velocity Bar */}
            <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden flex">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(100, (metrics.totalActual / metrics.totalBudget) * 100)}%` }}
                title={`Paid / Invoiced: ${formatINR(metrics.totalActual)}`}
              ></div>
              <div
                className="h-full bg-secondary-container transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100 - (metrics.totalActual / metrics.totalBudget) * 100, ((metrics.totalCommitted - metrics.totalActual) / metrics.totalBudget) * 100))}%` }}
                title={`Pending / Contracted`}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-on-surface-variant pt-1">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Paid Actuals</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span> Contracted Estimates</span>
              </div>
              <span className="font-medium text-primary">Target: {formatINR(metrics.totalBudget)}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant italic mt-4 pt-3 border-t border-outline-variant/30">
            “Autonomous financial scans confirm 94/100 contract protection rating across Udaipur suppliers.”
          </p>
        </div>

        {/* AI Savings Alert (4 cols) */}
        <div className="lg:col-span-4">
          {savingsAlertVisible && (
            <div className="h-full p-6 rounded-2xl bg-white border border-[#d8c1c3] shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <AlertTriangle className="w-4 h-4 text-secondary" />
                    <span>AI Savings Advisory</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-[10px] font-bold text-secondary uppercase">
                    Opportunity
                  </span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed mt-2">
                  Floral quote with Garden & Bloom Studio can be optimized by adjusting imported hydrangeas to Rajasthan heirloom garden roses, saving <strong className="text-primary font-bold">₹ 45,000</strong>.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-outline-variant/30 flex items-center justify-between gap-3">
                {savingsApplied ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold">
                    <CheckCircle className="w-4 h-4" /> Reallocation Applied!
                  </span>
                ) : (
                  <button
                    onClick={applyFloralSavings}
                    className="px-4 py-1.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Apply ₹ 45,000 Saving
                  </button>
                )}
                <button
                  onClick={() => setSavingsAlertVisible(false)}
                  className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-wider font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
          }`}
        >
          All Items ({event.expenses.length})
        </button>
        {categories.map((cat) => {
          const count = event.expenses.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Interactive Expense Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-surface-container-low/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30">
          <div>
            <h3 className="font-headline text-lg sm:text-xl text-primary font-semibold">
              Expenditure Breakdown & Invoices
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Editable line items with immediate prototype calculation updates in INR.
            </p>
          </div>
          <span className="text-xs font-semibold text-secondary px-3 py-1 bg-white rounded-full border border-outline-variant/40">
            {filteredExpenses.length} Lines Displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/30">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Estimated</th>
                <th className="py-3.5 px-4 text-right">Actual Paid</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-on-surface-variant">
                    No expense records found for this category. Click "Add Expense Item" above to create one.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                    
                    <td className="py-3.5 px-4 font-semibold text-primary">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-medium">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-on-surface font-medium max-w-xs">
                      {exp.description}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        exp.status === 'paid' ? 'bg-green-100 text-green-800' :
                        exp.status === 'contracted' ? 'bg-blue-100 text-blue-800' :
                        exp.status === 'reserved' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {exp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-on-surface">
                      {editingExpenseId === exp.id ? (
                        <input
                          type="number"
                          value={editEstimated}
                          onChange={(e) => setEditEstimated(Number(e.target.value))}
                          className="w-28 px-2 py-1 text-right border border-primary rounded bg-white text-xs"
                        />
                      ) : (
                        formatINR(exp.estimated)
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-primary">
                      {editingExpenseId === exp.id ? (
                        <input
                          type="number"
                          placeholder="Optional"
                          value={editActual}
                          onChange={(e) => setEditActual(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-28 px-2 py-1 text-right border border-primary rounded bg-white text-xs"
                        />
                      ) : (
                        exp.actual !== null ? formatINR(exp.actual) : <span className="text-outline-variant">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {editingExpenseId === exp.id ? (
                          <button
                            type="button"
                            onClick={() => saveInlineEdit(exp.id)}
                            className="p-1 rounded bg-green-600 text-white hover:bg-green-700"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startInlineEdit(exp)}
                            className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit Amounts"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1 text-on-surface-variant hover:text-error transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-headline text-lg font-bold text-primary">Add Expense Record</h3>
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
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Vintage Champagne Bar & Mixologist"
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Estimated (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={estimated}
                    onChange={(e) => setEstimated(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Actual Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={actual}
                    onChange={(e) => setActual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Payment Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Expense['status'])}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                >
                  <option value="pending">Pending</option>
                  <option value="contracted">Contracted</option>
                  <option value="paid">Paid</option>
                  <option value="reserved">Reserved</option>
                </select>
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

