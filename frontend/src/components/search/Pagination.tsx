"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const router = useRouter()

  const goToPage = (page: number) => {
    router.push(`/search?page=${page}`)
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span>
        {currentPage} of {totalPages}
      </span>
      <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

