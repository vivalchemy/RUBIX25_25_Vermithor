"use client"

import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function EnhancedPagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()

  const goToPage = (page: number) => {
    router.push(`/search?page=${page}`)
  }

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // If near start, show first 4 pages + ellipsis + last page
        pages.push(2, 3, 4)
        pages.push('ellipsis')
      } else if (currentPage >= totalPages - 2) {
        // If near end, show first page + ellipsis + last 4 pages
        pages.push('ellipsis')
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1)
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push('ellipsis')
        pages.push(currentPage - 1, currentPage, currentPage + 1)
        pages.push('ellipsis')
      }
      // Always show last page
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) goToPage(currentPage - 1)
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  goToPage(page as number)
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) goToPage(currentPage + 1)
            }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
