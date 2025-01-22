export function Map({ products }: { products: any[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Nearby Vendors</h2>
      <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
        <p>Map showing {products.length} nearby vendors</p>
      </div>
    </div>
  )
}


