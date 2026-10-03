'use client';

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { formUrlQuery } from '@/lib/utils'

const SearchInput = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('topic') ?? '')

  useEffect(() => {
    setSearchQuery(searchParams?.get('topic') ?? '')
  }, [searchParams])

  const handleSearch = (value: string) => {
    const nextValue = value.trim()
    setSearchQuery(nextValue)

    const params = formUrlQuery({
      params: searchParams.toString(),
      key: 'topic',
      value: nextValue,
    })

    const targetUrl = params ? `${pathname}?${params}` : pathname
    router.push(targetUrl, { scroll: false })
  }

  return (
    <div className='relative border border-black rounded-lg items-center gap-2 px-2 py-3 flex w-full max-w-[400px]'>
      <Image src="/icons/search.svg" alt="Search" width={15} height={15} />
      <input
        type="text"
        placeholder='Search by topic'
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className='outline-none w-full'
      />
    </div>
  )
}

export default SearchInput