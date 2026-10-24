import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '#/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbfbf9] flex items-center justify-center p-6 text-stone-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8 text-amber-700" />
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                कृष्णा देवघर (Krushna Devghar)
              </h2>
              <p className="text-sm font-semibold text-stone-700 mt-2">
                पेज लोड करने में कोई त्रुटि हुई
              </p>
              <p className="text-xs text-stone-500 mt-1">
                कृपया नीचे दिए गए बटन पर क्लिक करके होमपेज या स्टोर पर वापस जाएँ।
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 gold-btn text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>स्टोर होमपेज पर जाएँ (Back to Store)</span>
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>पेज रीलोड करें (Reload)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
