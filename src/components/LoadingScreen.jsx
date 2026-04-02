export default function LoadingScreen({ message }) {
  return (
    <div className="screen-container">
      <div className="screen-content text-center animate-fade-in">
        {/* Spinner */}
        <div className="mb-8">
          <div className="inline-block w-10 h-10 border-2 border-surface-700 border-t-accent rounded-full animate-spin" />
        </div>

        <p className="text-lg text-zinc-300 font-medium">
          {message || 'Thinking...'}
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          This usually takes a few seconds
        </p>
      </div>
    </div>
  );
}
