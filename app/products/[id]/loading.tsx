export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-24 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div>
            <div className="bg-gray-800 rounded-xl h-96 mb-4"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
          {/* Content skeleton */}
          <div>
            <div className="h-6 bg-gray-800 rounded w-32 mb-4"></div>
            <div className="h-8 bg-gray-800 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-8"></div>
            {/* Price section */}
            <div className="h-48 bg-gray-800 rounded-xl mb-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
