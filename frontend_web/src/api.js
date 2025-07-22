/**
 * All task management functions that interface with Supabase.
 * Tasks table schema:
 *   - id: uuid (primary key)
 *   - title: string
 *   - description: string
 *   - due_date: date or null
 *   - category: string or null
 *   - completed: boolean
 *   - created_at: timestamp
 */

import { supabase } from './supabaseClient';

// PUBLIC_INTERFACE
export async function getTasks({ search = '', category = '', completed = null, orderBy = 'due_date' } = {}) {
  /**
   * Fetches all tasks from Supabase, with optional search, category filtering, completion status, and ordering.
   */
  let query = supabase
    .from('tasks')
    .select('*', { count: 'exact' });

  if (category) {
    query = query.eq('category', category);
  }
  if (completed !== null) {
    query = query.eq('completed', completed);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (orderBy) {
    query = query.order(orderBy, { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function addTask(task) {
  /**
   * Adds a new task to Supabase.
   * "task" must be an object with required fields: title, description, due_date, category, completed.
   */
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select();
  if (error) throw error;
  return data[0];
}

// PUBLIC_INTERFACE
export async function updateTask(id, patch) {
  /**
   * Updates the task with specified "id" using properties from "patch".
   */
  const { data, error } = await supabase
    .from('tasks')
    .update(patch)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /**
   * Deletes the task with specified "id".
   */
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// PUBLIC_INTERFACE
export async function getCategories() {
  /**
   * Fetch unique categories from tasks for sidebar listing.
   */
  const { data, error } = await supabase
    .from('tasks')
    .select('category')
    .neq('category', null);
  if (error) throw error;
  const categories = Array.from(new Set(data.map(t => t.category).filter(Boolean)));
  return categories;
}
