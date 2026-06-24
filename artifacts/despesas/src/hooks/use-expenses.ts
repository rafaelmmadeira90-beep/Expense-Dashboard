import { useState, useEffect } from 'react';
import { Expense } from '../lib/types';
import { INITIAL_EXPENSES } from '../lib/constants';

const STORAGE_KEY = 'despesas-data-v3';
const LEGACY_KEYS = ['despesas-data-v2', 'despesas-data'];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      for (const key of LEGACY_KEYS) {
        const legacy = localStorage.getItem(key);
        if (legacy) {
          const parsed: Expense[] = JSON.parse(legacy);
          const migrated = parsed.filter((e) => !e.date.startsWith('2023'));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
          return migrated;
        }
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
    return INITIAL_EXPENSES;
  });

  useEffect(() => {
    setExpenses((prev) => prev.filter((e) => !e.date.startsWith('2023')));
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updated: Omit<Expense, 'id'>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...updated, id } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
