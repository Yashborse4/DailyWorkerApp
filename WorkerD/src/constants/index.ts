/**
 * App Constants for WorkerD
 */

export const APP_CONFIG = {
  NAME: 'WorkerD',
  VERSION: '1.0.0',
  API_BASE_URL: 'https://api.workerd.com/v1',
  ENV: 'development',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@workerd_auth_token',
  USER_ROLE: '@workerd_user_role',
  THEME_MODE: '@workerd_theme_mode',
  LANGUAGE: '@workerd_language',
};

export const USER_ROLES = {
  WORKER: 'worker',
  HIRER: 'hirer',
};

export const SCREEN_NAMES = {
  AUTH: {
    LOGIN: 'Login',
    SIGNUP: 'Signup',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  WORKER: {
    DASHBOARD: 'WorkerDashboard',
    FIND_JOBS: 'FindJobs',
    MY_APPLICATIONS: 'MyApplications',
    PROFILE: 'WorkerProfile',
  },
  HIRER: {
    DASHBOARD: 'HirerDashboard',
    POST_JOB: 'PostJob',
    MANAGE_JOBS: 'ManageJobs',
    PROFILES_SEARCH: 'ProfileSearch',
  },
  COMMON: {
    SETTINGS: 'Settings',
    NOTIFICATIONS: 'Notifications',
    CHAT: 'Chat',
  }
};
