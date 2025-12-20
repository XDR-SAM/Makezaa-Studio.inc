export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 mb-4">
                <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">{message || 'An unexpected error occurred'}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn btn-primary"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
