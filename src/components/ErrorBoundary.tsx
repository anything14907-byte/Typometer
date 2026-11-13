import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Typometer:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070A] text-slate-100 flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-slate-900/90 border border-red-500/50 rounded-2xl p-6 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3 animate-bounce" />
            <h2 className="text-xl font-bold tracking-wider text-red-400 uppercase mb-2">
              TELEMETRY SUBSYSTEM HALTED
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              An unexpected neural buffer overflow occurred. You can reboot the application or reset telemetry cache.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-black/60 rounded text-[11px] text-red-300 text-left overflow-x-auto mb-4 border border-red-900/40">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> REBOOT
              </button>
              <button
                onClick={this.handleClearStorage}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-red-400" /> RESET CACHE
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
