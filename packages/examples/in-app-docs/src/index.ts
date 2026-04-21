// In-App Documentation Example
// Exports the example metadata and registers documentation.

// Export example spec
export { default as example } from './example';
export * from './in-app-docs.feature';
// Export UI components
export * from './ui';

// Import docs to register doc blocks on load
import './docs';

export * from './example';
