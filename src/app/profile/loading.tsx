'use client'
import React from 'react'

export default function Loading() {
  return (
    <div className='absolute w-[100%] h-[100vh] top-0 left-0 flex justify-center items-center z-1000'>
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
        <div
          className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"
        ></div>
      </div>
    </div>
  )
}
