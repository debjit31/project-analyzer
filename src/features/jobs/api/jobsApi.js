import { searchJobs, getAllJobs, getJobById } from '../../../mocks/jobsData';

/**
 * Fetch jobs based on search parameters
 * @param {import('../types/job.types').SearchParams} params
 * @returns {Promise<import('../types/job.types').ApiResponse>}
 */
export const fetchJobs = async (params) => {
  return searchJobs(params);
};

/**
 * Fetch all job listings
 * @returns {Promise<import('../types/job.types').ApiResponse>}
 */
export const fetchAllJobs = async () => {
  return getAllJobs();
};

/**
 * Fetch a single job by ID
 * @param {string} id - Job ID
 * @returns {Promise<Object>}
 */
export const fetchJobById = async (id) => {
  return getJobById(id);
};
