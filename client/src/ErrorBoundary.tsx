import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  // Update state to trigger fallback UI
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  // Log the error (optional)
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error occurred:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children; // Render child components if no error
  }
}

export default ErrorBoundary;