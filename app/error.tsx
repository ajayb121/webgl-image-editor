'use client' // Error components are Client Components

import { useEffect } from 'react'

const ErrorBoundary = ({ error }: {
  error: Error
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-col h-[500px] justify-center items-center'>
      <h2 className='text-2xl font-bold'>Something went wrong!</h2>
      <h3 className='text-2xl'>Please try again later</h3>
    </div>
  )
}

export default ErrorBoundary;
