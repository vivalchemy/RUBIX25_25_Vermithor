"use client"
import { useEffect, useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { Map } from '@/components/search/Map'
import { ProductList } from '@/components/search/ProductList'
import { TopRecommendations } from '@/components/search/TopRecommendation'
import axios from 'axios'
import { Products } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { EnhancedPagination } from '@/components/search/EnhancedPagination'

export default function Search({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [products, setProducts] = useState<Products>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/data/products.json")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load recent products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 font-semibold text-lg">{error}</div>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  const query = typeof searchParams.query === 'string' ? searchParams.query : ''
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const itemsPerPage = 15

  // Filter products based on search query and other filters
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.vendor.toLowerCase().includes(query.toLowerCase())
  )

  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar initialQuery={query} />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div>
          <TopRecommendations products={filteredProducts.slice(0, 3)} />
          <Map products={filteredProducts} />
        </div>
        <div>
          <ProductList products={paginatedProducts} />
          <EnhancedPagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}

