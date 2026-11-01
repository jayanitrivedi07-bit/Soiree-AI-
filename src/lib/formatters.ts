/**
 * Utility functions for currency, dates, and budget calculations in Soirée AI
 */

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹ 0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace('INR', '₹').trim();
}

export function formatINRShort(amount: number): string {
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹ ${(amount / 1000).toFixed(0)}k`;
  }
  return formatINR(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export interface BudgetMetrics {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalCommitted: number; // actuals when present, else estimated
  remainingBudget: number;
  isOverBudget: boolean;
  overAmount: number;
  percentageUsed: number;
}

export function calculateBudgetMetrics(budget: number, expenses: { estimated: number; actual: number | null }[]): BudgetMetrics {
  const totalBudget = Number(budget) || 0;
  let totalEstimated = 0;
  let totalActual = 0;
  let totalCommitted = 0;

  expenses.forEach(e => {
    const est = Number(e.estimated) || 0;
    const act = e.actual !== null && e.actual !== undefined ? Number(e.actual) : null;
    totalEstimated += est;
    if (act !== null) {
      totalActual += act;
      totalCommitted += act;
    } else {
      totalCommitted += est;
    }
  });

  const remainingBudget = totalBudget - totalCommitted;
  const isOverBudget = remainingBudget < 0;
  const overAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
  const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((totalCommitted / totalBudget) * 100)) : 0;

  return {
    totalBudget,
    totalEstimated,
    totalActual,
    totalCommitted,
    remainingBudget,
    isOverBudget,
    overAmount,
    percentageUsed,
  };
}

