export const EventSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border flex h-32 animate-pulse">
    <div className="w-32 bg-gray-200 shrink-0"></div>
    <div className="p-3 flex flex-col justify-between flex-1">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
)

export const FeaturedSkeleton = () => (
  <div className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
    <div className="h-40 bg-gray-200"></div>
    <div className="p-3 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
)
