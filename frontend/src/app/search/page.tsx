"use client"
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { Map } from "@/components/search/Map";
import { TopRecommendations } from "@/components/search/TopRecommendation";
import axios from "axios";
import { ProductsType } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ProductList } from "@/components/search/ProductList";

export default function Search() {
  let searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductsType>([]);
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

  const query = typeof searchParams.get("query") === "string" ? searchParams.get("query") : "";

  // Filter products based on search query and other filters
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query?.toLowerCase() as string) ||
      product.vendor.toLowerCase().includes(query?.toLowerCase() as string)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar initialQuery={query as string} />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <div className="mx-auto">
          <TopRecommendations products={filteredProducts.slice(0, 3)} />
        </div>
        <Map products={filteredProducts} />
        <div>
          <ProductList products={filteredProducts} itemsPerPage={14} />
        </div>
      </div>
    </div>
  );
}

