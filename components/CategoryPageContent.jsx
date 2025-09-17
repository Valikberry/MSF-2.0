// components/CategoryPageContent.jsx
import { Suspense } from 'react';

function CategoryPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto max-w-md px-4 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage(props) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}