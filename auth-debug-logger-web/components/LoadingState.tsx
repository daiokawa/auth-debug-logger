export default function LoadingState() {
  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto bg-white">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900">🔐 Auth Debug Logger (Claude Code Auto-Monitor)</h1>
        <div className="flex items-center gap-4">
          <span className="status-indicator disconnected">
            ● Loading...
          </span>
        </div>
      </header>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <div className="text-center py-16 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading logs...</p>
        </div>
      </div>
    </div>
  );
}