/**
 * Centralized Logger Utility
 * 
 * Replace raw console.log / console.error with this utility.
 * In a production environment, this can be hooked up to Sentry, Crashlytics, or Datadog.
 */

const IS_DEV = __DEV__;

export const Logger = {
  log: (message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.log(`[LOG] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, error?: any, ...args: any[]) => {
    if (IS_DEV) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
    
    // TODO: Send to remote crash reporting service (e.g. Sentry.captureException(error))
  },
  
  info: (message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
};

export default Logger;
