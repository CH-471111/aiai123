export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
} 