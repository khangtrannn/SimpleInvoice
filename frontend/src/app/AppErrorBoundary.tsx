import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F0F4FB] px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-950">
            Something went wrong.
          </h1>
          <p className="max-w-md text-sm text-slate-500">
            An unexpected error occurred. Try reloading the page; if the
            problem persists, contact support.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
