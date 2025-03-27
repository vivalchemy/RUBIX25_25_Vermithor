import { Suspense } from 'react';
import { Loader2 } from "lucide-react";
import Search from './SearchPage';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading search results...</p>
        </div>
      </div>
    }>
      <Search />
    </Suspense>
  );
}