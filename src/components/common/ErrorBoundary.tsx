import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  onRetry?: () => void;
  fallbackMessage?: string;
  fallbackMobileMessage?: string;
  isMobile?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#fff',
          background: '#111',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>{this.props.isMobile && this.props.fallbackMobileMessage ? '⚠️' : 'Something went wrong.'}</h1>
          <p>{
            this.props.isMobile && this.props.fallbackMobileMessage 
              ? this.props.fallbackMobileMessage 
              : (this.props.fallbackMessage || 'We apologize for the inconvenience. Please try refreshing the page.')
          }</p>
          <button
            onClick={this.handleRetry}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {this.props.onRetry ? 'Try Again' : 'Refresh Page'}
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ marginTop: '2rem', textAlign: 'left', background: '#333', padding: '1rem', borderRadius: '4px', overflow: 'auto', maxWidth: '80%' }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
