"use client"

import { Suspense } from "react"

// interface Product {
//     name: string;
//     link: string;
//     price: string;
//     outOfStock: boolean;
//     image: string;
//     brand: string;
//     sku: string;
// }

// Disable static generation
export const dynamic = "force-dynamic"

function PostsList() {
  return (
    <>
      <h1>Aqui va la tabla hijueputa</h1>
    </>
  )
}

export default function PostsPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-screen'>
            <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            <p className='ml-3 text-gray-600'>Loading page...</p>
          </div>
        }
      >
        <PostsList />
      </Suspense>
    </div>
  )
}
