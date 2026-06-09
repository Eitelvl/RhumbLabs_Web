import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary p-4">
          <div className="bg-card-element border border-card-border p-8 rounded-2xl max-w-lg w-full shadow-2xl">
            <h1 className="text-3xl font-bold mb-4 text-red-500">Something went wrong</h1>
            <p className="text-text-secondary mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>
            <div className="bg-bg-secondary p-4 rounded-xl overflow-x-auto text-sm font-mono text-text-secondary">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-8 px-6 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:bg-opacity-90 w-full transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
