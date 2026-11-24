const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function loadRoadmap() {
    const res = await fetch(`${API_BASE_URL}/roadmap`);
    if (!res.ok) throw new Error('Failed to load roadmap');
    return res.json();
}

export async function loadRoadmapLevel(levelNumber) {
    const res = await fetch(`${API_BASE_URL}/roadmap/${levelNumber}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to load roadmap level');
    return res.json();
}

// Admin functions
export async function updateRoadmapLevel(levelNumber, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update roadmap level');
    return res.json();
}

export async function createRoadmapExperience(levelNumber, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}/experiences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
}

export async function updateRoadmapExperience(id, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/experiences/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
}

export async function deleteRoadmapExperience(id) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete experience');
}

export async function reorderRoadmapExperiences(levelNumber, orderedIds) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}/experiences/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(orderedIds)
    });
    if (!res.ok) throw new Error('Failed to reorder experiences');
}

export async function createRoadmapCertification(levelNumber, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}/certifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create certification');
    return res.json();
}

export async function updateRoadmapCertification(id, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/certifications/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update certification');
    return res.json();
}

export async function deleteRoadmapCertification(id) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/certifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete certification');
}

export async function createRoadmapTool(levelNumber, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}/tools`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create tool');
    return res.json();
}

export async function updateRoadmapTool(id, data) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/tools/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update tool');
    return res.json();
}

export async function deleteRoadmapTool(id) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/tools/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete tool');
}

export async function reorderRoadmapTools(levelNumber, orderedIds) {
    const res = await fetch(`${API_BASE_URL}/admin/roadmap/${levelNumber}/tools/reorder`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(orderedIds)
    });
    if (!res.ok) throw new Error('Failed to reorder tools');
}