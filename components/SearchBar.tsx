'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  action?: string
  paramName?: string
  large?: boolean
}

export default function SearchBar({
  placeholder = 'Search contracts, companies, councils…',
  defaultValue = '',
  action = '/search',
  paramName = 'q',
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`${action}?${paramName}=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 border-2 border-lfg-black border-r-0 font-dm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lfg-orange focus:ring-inset ${
            large ? 'px-6 py-4 text-lg' : 'px-4 py-3 text-sm'
          }`}
        />
        <button
          type="submit"
          className={`btn-primary shrink-0 ${large ? 'px-8 text-lg' : ''}`}
        >
          search
        </button>
      </div>
    </form>
  )
}
