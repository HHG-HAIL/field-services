/**
 * Environment configuration
 * Centralized access to environment variables
 */

interface AppConfig {
  apiBaseUrl: string;
  workOrderServiceUrl: string;
  userServiceUrl: string;
  resourceServiceUrl: string;
  appName: string;
  appVersion: string;
  enableAnalytics: boolean;
  enableDebug: boolean;
}

/**
 * Get environment configuration
 * @returns Application configuration object
 */
export const getConfig = (): AppConfig => {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    workOrderServiceUrl:
      import.meta.env.VITE_WORK_ORDER_SERVICE_URL || 'http://localhost:8082/api/v1',
    userServiceUrl: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081/api/v1',
    resourceServiceUrl: import.meta.env.VITE_RESOURCE_SERVICE_URL || 'http://localhost:8083/api/v1',
    appName: import.meta.env.VITE_APP_NAME || 'Field Services Management',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  };
};

export default getConfig();
