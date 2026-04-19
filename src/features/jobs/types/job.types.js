/**
 * @typedef {Object} JobAnalysis
 * @property {string[]} tech_stack - Technologies used in the job
 * @property {string} core_problem - Main problem to solve
 * @property {string} project_idea - Suggested portfolio project idea
 */

/**
 * @typedef {Object} JobListing
 * @property {string} id - Unique job identifier
 * @property {string} job_title - Job title
 * @property {string} company - Company name
 * @property {string} url - Link to job posting
 * @property {string} location - Job location
 * @property {JobAnalysis} analysis - AI analysis of the job
 */

/**
 * @typedef {Object} SearchParams
 * @property {string} jobTitle - Job title to search
 * @property {string} location - Location to search
 * @property {'anytime' | '24h' | '7d'} datePosted - Date filter
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request succeeded
 * @property {JobListing[]} data - Array of job listings
 * @property {number} total - Total number of results
 */

// Export empty object for module
export {};
