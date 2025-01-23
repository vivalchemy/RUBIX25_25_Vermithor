"use client"
import { KeyboardEvent, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SearchBar() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const handleSearch = () => {
    if (input.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(input)}`)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Input
        type="text"
        placeholder="Search for local food..."
        className="w-2/3 md:w-1/2 px-4 py-3 mr-3 text-gray-100 placeholder:text-gray-400 rounded-lg shadow-sm"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown} // Added this line
      />
      <Button className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md"
        onClick={handleSearch}
      >
        <Search className="mr-2 w-5 h-5" /> Search
      </Button>
    </div>
  )
}

export default SearchBar

