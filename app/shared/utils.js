/**
 * utils.js — Soiree AI shared utility functions
 * Formatting, budget calculations, date utilities, and validation helpers.
 */

/**
 * Format a number as Indian Rupees.
 * e.g. 2500000 -> "₹25,00,000"
 */
function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format a number as a compact label (e.g. 2500000 -> "₹25L")
 */
function formatINRCompact(amount) {
  if (!amount) return '₹0';
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(1) + 'Cr';
  if (amount >= 100000)   return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000)     return '₹' + (amount / 1000).toFixed(0) + 'K';
  return '₹' + amount;
}

/**
 * Calculate total estimated budget from an expenses array.
 */
function calcTotalEstimated(expenses) {
  return expenses.reduce((sum, e) => sum + (e.estimated || 0), 0);
}

/**
 * Calculate total actual/spent from expenses where actual is set.
 */
function calcTotalSpent(expenses) {
  return expenses.reduce((sum, e) => sum + (e.actual || 0), 0);
}

/**
 * Calculate total committed (contracted but not yet paid) expenses.
 */
function calcTotalCommitted(expenses) {
  return expenses
    .filter(e => e.status === 'contracted' && e.actual === null)
    .reduce((sum, e) => sum + (e.estimated || 0), 0);
}

/**
 * Calculate remaining budget.
 */
function calcRemaining(budget, expenses) {
  const spent = calcTotalSpent(expenses);
  const committed = calcTotalCommitted(expenses);
  return budget - spent - committed;
}

/**
 * Calculate task completion percentage.
 */
function calcTaskCompletion(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter(t => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

/**
 * Count tasks that are overdue (past dueDate and not done).
 */
function calcOverdueTasks(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tasks.filter(t => !t.done && new Date(t.dueDate) < today).length;
}

/**
 * Get the number of days until a date string (YYYY-MM-DD).
 * Returns negative number if the date is in the past.
 */
function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format a date string as a human-readable label.
 * e.g. '2025-10-18' -> 'October 18, 2025'
 */
function formatDateLong(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Format a date string as short.
 * e.g. '2025-10-18' -> 'Oct 18'
 */
function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/**
 * Basic input validation helpers.
 */
function isValidDate(str) {
  if (!str) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

function isPositiveNumber(val) {
  return typeof val === 'number' && val > 0 && isFinite(val);
}

function isNonEmptyString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// Expose globally
window.SoireeUtils = {
  formatINR,
  formatINRCompact,
  calcTotalEstimated,
  calcTotalSpent,
  calcTotalCommitted,
  calcRemaining,
  calcTaskCompletion,
  calcOverdueTasks,
  daysUntil,
  formatDateLong,
  formatDateShort,
  isValidDate,
  isPositiveNumber,
  isNonEmptyString,
};
