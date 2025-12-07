import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Determine backend base URL depending on platform
 */
const getApiBase = () => {
  if (Platform.OS === 'web') return 'http://192.168.1.5:5000';
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
  if (Platform.OS === 'ios') return 'http://localhost:5000';
  return 'http://localhost:5000';
};

export const API_BASE = getApiBase();

/**
 * ===== Project APIs =====
 */

// Create a new project
const createProject = async (token, payload) => {
  if (!token) throw new Error("Token is required to create a project");
  const url = `${API_BASE}/api/projects`;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const res = await axios.post(url, payload, { headers });
  return res.data;
};

// Fetch projects for a specific user
const getProjects = async (token, userId) => {
  if (!token) throw new Error("Token is required");
  if (!userId) throw new Error("userId is required");

  const url = `${API_BASE}/api/projects?owner=${userId}`;
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.projects ?? [];
};

// Fetch all projects (admin view)
const getAllProjects = async (token) => {
  if (!token) throw new Error("Token is required");
  const url = `${API_BASE}/api/projects`;
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.projects ?? [];
};

/**
 * ===== Image Upload API =====
 */
const uploadImage = async (projectId, token, file, metadata = {}) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!token) throw new Error("Token is required to upload image");
  if (!file?.uri) throw new Error("File URI is required");

  const form = new FormData();
  const uriParts = file.uri.split('/');
  const name = file.name || uriParts[uriParts.length - 1];

  // Detect file type
  let type = file.type;
  if (!type) {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg') type = 'image/jpeg';
    else if (ext === 'png') type = 'image/png';
    else if (ext === 'heic') type = 'image/heic';
    else type = 'application/octet-stream';
  }

  form.append('image', { uri: file.uri, name, type });

  // Optional metadata
  if (metadata.latitude) form.append("latitude", metadata.latitude);
  if (metadata.longitude) form.append("longitude", metadata.longitude);
  if (metadata.timestamp) form.append("timestamp", metadata.timestamp);

  const headers = { Authorization: `Bearer ${token}` };
  const res = await axios.post(`${API_BASE}/api/projects/${projectId}/images`, form, { headers });
  return res.data;
};

/* ===== Farmer APIs =====*/

// Fetch all farmers (admin)
const getAllFarmers = async (token) => {
  if (!token) throw new Error("Token is required to fetch farmers");
  const res = await axios.get(`${API_BASE}/api/farmers`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.farmers ?? [];
};

export default {
  createProject,
  getProjects,
  getAllProjects,
  uploadImage,
  getAllFarmers,
};
