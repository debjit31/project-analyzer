import { searchJobs, getAllJobs, getJobById } from '../../../mocks/jobsData';

/**
 * Base URL for the Python FastAPI backend.
 * Set VITE_API_URL in your .env file to point at the live backend.
 * When undefined the app falls back to the local mock data.
 *
 * @example .env
 *   VITE_API_URL=http://localhost:8000
 */
const API_BASE = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------------------------
// Real backend helpers
// ---------------------------------------------------------------------------

/**
 * POST to the backend generate-projects pipeline.
 * @param {Object} body - Raw JSON body
 * @returns {Promise<Object>} Parsed JSON response
 */
const postToBackend = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Backend error: ${res.status}`);
  }

  return res.json();
};

// ---------------------------------------------------------------------------
// Public API — used by hooks and pages
// ---------------------------------------------------------------------------

/**
 * Fetch jobs based on search parameters.
 * Uses the real backend when VITE_API_URL is set, otherwise falls back to mocks.
 *
 * @param {import('../types/job.types').SearchParams} params
 * @returns {Promise<import('../types/job.types').ApiResponse>}
 */
export const fetchJobs = async ({ jobTitle, location, datePosted }) => {
  if (!API_BASE) {
    return searchJobs({ jobTitle, location, datePosted });
  }

  return postToBackend('/api/v1/generate-projects', {
    job_title: jobTitle,
    location: location || '',
    date_posted: datePosted || 'anytime',
  });
};

/**
 * Fetch all job listings.
 * NOTE: The backend has no "list all" endpoint — this always uses mock data
 * for the AllJobsPage browse experience. Wire up a real endpoint if needed.
 *
 * @returns {Promise<import('../types/job.types').ApiResponse>}
 */
export const fetchAllJobs = async () => {
  return getAllJobs();
};

/**
 * Fetch a single job by ID.
 * Falls back to mock data; extend with a GET /api/v1/jobs/:id backend route if needed.
 *
 * @param {string} id - Job ID
 * @returns {Promise<Object>}
 */
export const fetchJobById = async (id) => {
  return getJobById(id);
};
