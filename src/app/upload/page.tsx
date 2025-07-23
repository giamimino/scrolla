"use client"
import { editProfile } from '@/actions/actions'
import React from 'react'

export default function Upload() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await editProfile(formData)

    if (!result?.success) {
      console.log(result?.message)
    } else {
      console.log(result?.message)
      console.log(result.url);
      
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" accept="image/*" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
