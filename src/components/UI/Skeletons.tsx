export function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-[#151c2c] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 animate-pulse mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/5"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-5/6"></div>
      </div>
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1120] animate-pulse">
      <div className="bg-white dark:bg-[#151c2c] shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-48 sm:h-80 w-full rounded-b-xl bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between px-4 pb-4 -mt-16 sm:-mt-20 gap-4 mb-2">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-[#151c2c]"></div>
              <div className="mb-2 space-y-2 flex flex-col items-center md:items-start">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-40"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StoriesSkeleton() {
  return (
    <div className="flex gap-4 p-4 overflow-x-hidden animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm w-12"></div>
        </div>
      ))}
    </div>
  );
}
