// Placeholder API service for MoneyMontor
// Replace with real API calls to Django backend when available

export const api = {
  async login(email, password) {
    // Replace with real API call
    if (email === 'user@example.com' && password === 'password') {
      return { email, role: 'individual' };
    }
    throw new Error('Invalid credentials');
  },
  async register(data) {
    // Replace with real API call
    if (data.email === 'user@example.com') {
      throw new Error('Email already registered');
    }
    return { ...data };
  },
  async getExpenses() {
    return JSON.parse(localStorage.getItem('mm_expenses') || '[]');
  },
  async addExpense(expense) {
    const expenses = JSON.parse(localStorage.getItem('mm_expenses') || '[]');
    const newExpense = { ...expense, id: Date.now() };
    localStorage.setItem('mm_expenses', JSON.stringify([newExpense, ...expenses]));
    return newExpense;
  },
  async deleteExpense(id) {
    const expenses = JSON.parse(localStorage.getItem('mm_expenses') || '[]');
    const updated = expenses.filter((e) => e.id !== id);
    localStorage.setItem('mm_expenses', JSON.stringify(updated));
    return true;
  },
}; 