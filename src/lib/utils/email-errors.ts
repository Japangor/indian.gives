export const EMAIL_ERROR_MESSAGES = {
    MEMBER_EXISTS_WITH_EMAIL_ADDRESS: 'You are already part of our spiritual community! 🙏',
    INVALID_EMAIL_ADDRESS: 'Please provide a valid email address for divine updates',
    EMAIL_ADDRESS_BLOCKED: 'This email cannot receive our updates. Please try another',
    NETWORK_ERROR: 'Unable to connect. Please check your connection and try again',
    DEFAULT: 'Something went wrong. Please try again later'
  };
  
  export function getErrorMessage(error: any): string {
    if (error?.code && EMAIL_ERROR_MESSAGES[error.code]) {
      return EMAIL_ERROR_MESSAGES[error.code];
    }
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return EMAIL_ERROR_MESSAGES.NETWORK_ERROR;
      }
      return error.message;
    }
    
    return EMAIL_ERROR_MESSAGES.DEFAULT;
  }