/**
 * Service de Gestionnaire de Données Hybride (Cloud DB Supabase REST + LocalStorage Fallback)
 */

import { projectsData } from '../data/projects';
import { certsData } from '../data/certs';

const LS_PROJECTS_KEY = 'tinogreyhat_projects';
const LS_CERTS_KEY = 'tinogreyhat_certs';

// Clés Supabase (Configurables via variables d'environnement Vite ou localStorage)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isCloudEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// --- LocalStorage Helpers ---
const loadLocal = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn(`[cloudDb] Lecture LocalStorage échouée pour ${key}:`, e);
  }
  return fallback;
};

const saveLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[cloudDb] Écriture LocalStorage échouée pour ${key}:`, e);
  }
};

// --- Cloud REST Requests (Supabase) ---
async function fetchSupabase(table) {
  if (!isCloudEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn(`[cloudDb] Erreur lors de la récupération Cloud (${table}):`, e);
    return null;
  }
}

async function insertSupabase(table, record) {
  if (!isCloudEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data[0];
  } catch (e) {
    console.warn(`[cloudDb] Erreur d'insertion Cloud (${table}):`, e);
    return null;
  }
}

async function deleteSupabase(table, id) {
  if (!isCloudEnabled) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    console.warn(`[cloudDb] Erreur de suppression Cloud (${table}):`, e);
  }
}

// --- High-Level API Exported Methods ---

export async function loadProjects() {
  if (isCloudEnabled) {
    const cloudProjects = await fetchSupabase('projects');
    if (cloudProjects && cloudProjects.length > 0) {
      return cloudProjects;
    }
  }
  return loadLocal(LS_PROJECTS_KEY, projectsData);
}

export async function saveProject(newProject) {
  const withId = {
    ...newProject,
    id: Date.now(),
  };

  // Local Save
  const current = loadLocal(LS_PROJECTS_KEY, projectsData);
  const updated = [...current, withId];
  saveLocal(LS_PROJECTS_KEY, updated);

  // Cloud Save
  if (isCloudEnabled) {
    await insertSupabase('projects', withId);
  }

  return updated;
}

export async function deleteProject(id) {
  const current = loadLocal(LS_PROJECTS_KEY, projectsData);
  const updated = current.filter(p => p.id !== id);
  saveLocal(LS_PROJECTS_KEY, updated);

  if (isCloudEnabled) {
    await deleteSupabase('projects', id);
  }

  return updated;
}

export async function loadCerts() {
  if (isCloudEnabled) {
    const cloudCerts = await fetchSupabase('certs');
    if (cloudCerts && cloudCerts.length > 0) {
      return cloudCerts;
    }
  }
  return loadLocal(LS_CERTS_KEY, certsData);
}

export async function saveCert(newCert) {
  const withId = {
    ...newCert,
    id: Date.now(),
  };

  // Local Save
  const current = loadLocal(LS_CERTS_KEY, certsData);
  const updated = [...current, withId];
  saveLocal(LS_CERTS_KEY, updated);

  // Cloud Save
  if (isCloudEnabled) {
    await insertSupabase('certs', withId);
  }

  return updated;
}

export async function deleteCert(id) {
  const current = loadLocal(LS_CERTS_KEY, certsData);
  const updated = current.filter(c => c.id !== id);
  saveLocal(LS_CERTS_KEY, updated);

  if (isCloudEnabled) {
    await deleteSupabase('certs', id);
  }

  return updated;
}
