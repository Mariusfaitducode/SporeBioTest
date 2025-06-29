/**
 * Formats a date string to a localized date format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Shows a confirmation dialog for deleting a biosample
 */
export const confirmDeleteSample = (location: string, includeComments: boolean = false): boolean => {
  const baseMessage = `Are you sure you want to delete the sample from "${location}"? This action cannot be undone`;
  const message = includeComments 
    ? `${baseMessage} and will also delete all associated comments.`
    : `${baseMessage}.`;
  
  return window.confirm(message);
};

/**
 * Shows a confirmation dialog for deleting a comment
 */
export const confirmDeleteComment = (): boolean => {
  return window.confirm('Are you sure you want to delete this comment?');
};

/**
 * Extracts error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

/**
 * Gets today's date in YYYY-MM-DD format for input fields
 */
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]!;
}; 