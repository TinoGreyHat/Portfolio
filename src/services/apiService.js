const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- Projects (Public) ---
export async function loadProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
}

// --- Projects (Admin) ---
export async function loadProjectsAdmin(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.publicationStatus) params.append('publicationStatus', filters.publicationStatus);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/projects/admin${query}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
}

export async function saveProjectAdmin(project) {
    const isUpdate = project.id && typeof project.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/projects/admin/${project.id}` : `${API_BASE_URL}/projects/admin`;
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
    return res.json();
}

export async function deleteProjectAdmin(id) {
    const res = await fetch(`${API_BASE_URL}/projects/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
}

export async function reorderProjectsAdmin(projectIdsInOrder) {
    const res = await fetch(`${API_BASE_URL}/projects/admin/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(projectIdsInOrder)
    });
    if (!res.ok) throw new Error('Failed to reorder projects');
    return res.json();
}

export async function updateProjectPublicationStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/projects/admin/${id}/publication-status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to update publication status');
    return res.json();
}

// --- Project Sections (Admin) ---
export async function loadProjectSections(projectId) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load project sections');
    return res.json();
}

export async function createProjectSection(projectId, section) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(section)
    });
    if (!res.ok) throw new Error('Failed to create section');
    return res.json();
}

export async function updateProjectSection(projectId, sectionId, section) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(section)
    });
    if (!res.ok) throw new Error('Failed to update section');
    return res.json();
}

export async function deleteProjectSection(projectId, sectionId) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete section');
    return res.json();
}

export async function reorderProjectSections(projectId, sectionIdsInOrder) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(sectionIdsInOrder)
    });
    if (!res.ok) throw new Error('Failed to reorder sections');
    return res.json();
}

export async function duplicateProjectSection(projectId, sectionId) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}/sections/${sectionId}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to duplicate section');
    return res.json();
}

// --- Certifications (Public) ---
export async function loadCerts() {
    const res = await fetch(`${API_BASE_URL}/certifications`);
    if (!res.ok) throw new Error('Failed to load certifications');
    return res.json();
}

export async function loadCert(id) {
    const res = await fetch(`${API_BASE_URL}/certifications/${id}/details`);
    if (!res.ok) throw new Error('Failed to load certification');
    return res.json();
}

// --- Certifications (Admin) ---
export async function loadCertsAdmin(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.publicationStatus) params.append('publicationStatus', filters.publicationStatus);
    // Only append isVisible if it's a boolean (true/false), not empty string
    if (filters.isVisible === true || filters.isVisible === false) {
        params.append('isVisible', filters.isVisible);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/certifications/admin${query}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load certifications');
    return res.json();
}

export async function saveCertAdmin(cert) {
    const isUpdate = cert.id && typeof cert.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/certifications/admin/${cert.id}` : `${API_BASE_URL}/certifications/admin`;
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
    return res.json();
}

export async function deleteCertAdmin(id) {
    const res = await fetch(`${API_BASE_URL}/certifications/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete certification');
    return res.json();
}

export async function reorderCertsAdmin(certificationIdsInOrder) {
    const res = await fetch(`${API_BASE_URL}/certifications/admin/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(certificationIdsInOrder)
    });
    if (!res.ok) throw new Error('Failed to reorder certifications');
    return res.json();
}

export async function updateCertPublicationStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/certifications/admin/${id}/publication-status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to update publication status');
    return res.json();
}

export async function updateCertVisibility(id, isVisible) {
    const res = await fetch(`${API_BASE_URL}/certifications/admin/${id}/visibility?isVisible=${isVisible}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to update visibility');
    return res.json();
}

// --- Certification Issuers (Admin) ---
export async function loadIssuers() {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/issuers`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load issuers');
    return res.json();
}

export async function saveIssuer(issuer) {
    const isUpdate = issuer.id && typeof issuer.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/admin/certifications/issuers/${issuer.id}` : `${API_BASE_URL}/admin/certifications/issuers`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(issuer)
    });
    if (!res.ok) throw new Error('Failed to save issuer');
    return res.json();
}

export async function deleteIssuer(id) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/issuers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete issuer');
    return res.json();
}

// --- Certification Skills (Admin) ---
export async function loadCertSkills(certificationId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/skills`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load skills');
    return res.json();
}

export async function saveCertSkill(certificationId, skill) {
    const isUpdate = skill.id && typeof skill.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/admin/certifications/${certificationId}/skills/${skill.id}` : `${API_BASE_URL}/admin/certifications/${certificationId}/skills`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(skill)
    });
    if (!res.ok) throw new Error('Failed to save skill');
    return res.json();
}

export async function deleteCertSkill(certificationId, skillId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/skills/${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
}

export async function reorderCertSkills(certificationId, skillIdsInOrder) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/skills/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(skillIdsInOrder)
    });
    if (!res.ok) throw new Error('Failed to reorder skills');
    return res.json();
}

// --- Certification Details (Admin) ---
export async function loadCertDetails(certificationId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/details`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load details');
    return res.json();
}

export async function saveCertDetail(certificationId, detail) {
    const isUpdate = detail.id && typeof detail.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/admin/certifications/${certificationId}/details/${detail.id}` : `${API_BASE_URL}/admin/certifications/${certificationId}/details`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(detail)
    });
    if (!res.ok) throw new Error('Failed to save detail');
    return res.json();
}

export async function deleteCertDetail(certificationId, detailId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/details/${detailId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete detail');
    return res.json();
}

export async function reorderCertDetails(certificationId, detailIdsInOrder) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/details/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(detailIdsInOrder)
    });
    if (!res.ok) throw new Error('Failed to reorder details');
    return res.json();
}

export async function duplicateCertDetail(certificationId, detailId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/details/${detailId}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to duplicate detail');
    return res.json();
}

// --- Certification Documents (Admin) ---
export async function loadCertDocuments(certificationId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/documents`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load documents');
    return res.json();
}

export async function uploadCertDocument(certificationId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/documents/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
}

export async function deleteCertDocument(certificationId, documentId) {
    const res = await fetch(`${API_BASE_URL}/admin/certifications/${certificationId}/documents/${documentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
}

// --- Certification Documents (Public) ---
export async function viewCertDocument(certificationId, documentId) {
    const res = await fetch(`${API_BASE_URL}/certifications/${certificationId}/documents/${documentId}/view`);
    if (!res.ok) throw new Error('Failed to view document');
    return res.blob();
}

export async function downloadCertDocument(certificationId, documentId) {
    const res = await fetch(`${API_BASE_URL}/certifications/${certificationId}/documents/${documentId}/download`);
    if (!res.ok) throw new Error('Failed to download document');
    return res.blob();
}

// --- Page Settings (Public) ---
export async function loadPageSettings(pageKey) {
    const res = await fetch(`${API_BASE_URL}/page-settings/${pageKey}`);
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to load page settings');
    }
    return res.json();
}

// --- Page Settings (Admin) ---
export async function loadPageSettingsAdmin() {
    const res = await fetch(`${API_BASE_URL}/page-settings/admin`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load page settings');
    return res.json();
}

export async function savePageSettingsAdmin(settings) {
    const isUpdate = settings.id && typeof settings.id === 'number';
    const url = isUpdate ? `${API_BASE_URL}/page-settings/admin/${settings.id}` : `${API_BASE_URL}/page-settings/admin`;
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to save page settings');
    return res.json();
}

export async function deletePageSettingsAdmin(id) {
    const res = await fetch(`${API_BASE_URL}/page-settings/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete page settings');
    return res.json();
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

// Aliases for backward compatibility
export const saveCert = saveCertAdmin;
export const deleteCert = deleteCertAdmin;
export const createCertDetail = saveCertDetail;
export const updateCertDetail = saveCertDetail;
