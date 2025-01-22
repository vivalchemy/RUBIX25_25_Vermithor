import { SearchBar } from '@/components/search/SearchBar'
import { ProductFilters } from '@/components/search/ProductFilters'
import { Map } from '@/components/search/Map'
import { ProductList } from '@/components/search/ProductList'
import { Pagination } from '@/components/search/Pagination'
import { TopRecommendations } from '@/components/search/TopRecommendation'

const products = [
  { id: 1, name: "Organic Apples", vendor: "Green Farms", price: 5.99, rating: 4.5, timeToArrive: "30 mins", peopleRequired: 1, image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Fresh Bread", vendor: "Local Bakery", price: 3.99, rating: 4.8, timeToArrive: "20 mins", peopleRequired: 1, image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Vegetable Box", vendor: "Community Garden", price: 15.99, rating: 4.7, timeToArrive: "45 mins", peopleRequired: 2, image: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Free-range Eggs", vendor: "Happy Hens Farm", price: 4.99, rating: 4.6, timeToArrive: "35 mins", peopleRequired: 1, image: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Organic Milk", vendor: "Dairy Delight", price: 3.49, rating: 4.9, timeToArrive: "25 mins", peopleRequired: 1, image: "/placeholder.svg?height=200&width=200" },
  { id: 6, name: "Artisan Cheese", vendor: "Cheese Crafters", price: 7.99, rating: 4.7, timeToArrive: "40 mins", peopleRequired: 1, image: "/placeholder.svg?height=200&width=200" },
]

export default function Search({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
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
      <ProductFilters />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div>
          <TopRecommendations products={filteredProducts.slice(0, 3)} />
          <Map products={filteredProducts} />
        </div>
        <div>
          <ProductList products={paginatedProducts} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}

