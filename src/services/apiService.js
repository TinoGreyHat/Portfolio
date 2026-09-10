const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- Projects ---
export async function loadProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
}

export async function saveProject(project) {
    const isUpdate = project.id && typeof project.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/projects/${project.id}` : `${API_BASE_URL}/projects`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to save project');
    return loadProjects();
}

export async function deleteProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return loadProjects();
}

// --- Certifications ---
export async function loadCerts() {
    const res = await fetch(`${API_BASE_URL}/certifications`);
    if (!res.ok) throw new Error('Failed to load certifications');
    return res.json();
}

export async function saveCert(cert) {
    const isUpdate = cert.id && typeof cert.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/certifications/${cert.id}` : `${API_BASE_URL}/certifications`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(cert)
    });
    if (!res.ok) throw new Error('Failed to save certification');
    return loadCerts();
}

export async function deleteCert(id) {
    const res = await fetch(`${API_BASE_URL}/certifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete certification');
    return loadCerts();
}

// --- Auth ---
export async function loginAdmin(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Identifiants invalides');
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('admin_token', data.token);
    }
    return data;
}

export function logoutAdmin() {
    localStorage.removeItem('admin_token');
}

export function isAdminAuthenticated() {
    return !!localStorage.getItem('admin_token');
}

// --- Contact ---
export async function sendContactMessage(contactData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });
    
    if (!res.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
    }
    
    return res.json();
}
