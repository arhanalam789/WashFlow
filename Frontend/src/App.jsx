function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          WashFlow + Tailwind
        </h1>
        <p className="text-neutral-400 leading-relaxed text-sm">
          React is set up with Tailwind CSS v4. Your project is ready for building premium experiences.
        </p>
        <div className="pt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95 cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
