import { useCallback, useEffect, useRef } from 'react';

// Google Identity Services Client ID
const GOOGLE_CLIENT_ID = '923500549273-5rveve5jlse74l65qid47qcc82ca0t4a.apps.googleusercontent.com';

// Types for Google Identity Services
interface CredentialResponse {
  credential: string;
  select_by: string;
  clientId?: string;
}

interface GoogleButtonConfig {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string | number;
  locale?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
          revoke: (email: string, callback?: () => void) => void;
        };
      };
    };
  }
}

interface UseGoogleAuthOptions {
  onSuccess: (credential: string) => void;
  onError?: (error: Error) => void;
  buttonConfig?: GoogleButtonConfig;
}

export function useGoogleAuth({ onSuccess, onError, buttonConfig }: UseGoogleAuthOptions) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize Google Sign-In
  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google || initializedRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: CredentialResponse) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.(new Error('No credential received from Google'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      initializedRef.current = true;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to initialize Google Sign-In'));
    }
  }, [onSuccess, onError]);

  // Render Google Sign-In button
  const renderButton = useCallback(() => {
    if (!window.google || !buttonRef.current) return;

    try {
      // Clear any existing button
      buttonRef.current.innerHTML = '';
      
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: '100%',
        ...buttonConfig,
      });
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to render Google button'));
    }
  }, [buttonConfig, onError]);

  // Wait for Google script to load
  useEffect(() => {
    const checkGoogle = () => {
      if (window.google) {
        initializeGoogleSignIn();
        renderButton();
      }
    };

    // Check immediately
    checkGoogle();

    // Also set up a fallback check with interval
    const interval = setInterval(() => {
      if (window.google && !initializedRef.current) {
        checkGoogle();
        clearInterval(interval);
      }
    }, 100);

    // Clean up after 5 seconds max
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [initializeGoogleSignIn, renderButton]);

  // Re-render button when ref changes
  useEffect(() => {
    if (initializedRef.current && buttonRef.current) {
      renderButton();
    }
  }, [renderButton]);

  return {
    buttonRef,
    isGoogleLoaded: !!window.google,
  };
}

export default useGoogleAuth;
