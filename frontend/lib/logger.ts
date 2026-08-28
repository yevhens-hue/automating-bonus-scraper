/**
 * Simple frontend logger. 
 * Can be easily extended to send logs to Sentry, LogRocket, or a custom API.
 */
const logger = {
    info: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[INFO] ${message}`, ...args);
        }
    },
    warn: (message: string, ...args: any[]) => {
        console.warn(`[WARN] ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
        // Here you would typically send the error to an external service
        console.error(`[ERROR] ${message}`, ...args);
    }
};

export default logger;
