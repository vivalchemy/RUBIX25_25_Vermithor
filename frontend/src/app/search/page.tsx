import Map from '@/components/search/Map'
import ProductList from '@/components/search/ProductList'
import SearchBar from '@/components/search/SearchBar'
import React from 'react'

export default function SearchPage() {
  return (
    <div>
      <SearchBar />
      <ProductList />
      <Map />
    </div >
  )
}

