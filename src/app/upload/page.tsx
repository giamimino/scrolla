"use client"
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'

type User = {
  name: string,
}

export default function Upload() {
  const [user, setUser] = useState<User | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[] | null>([])

  useEffect(() => {
    fetch('api/getUser')
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setUser(data)
      } else {
        if(!data.success) {
          redirect('/auth/signup')
        }
      }
    })
  }, [])
  
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if(file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    } else {
      setPreview(null)
    }
  }
  return (
    <div className={styles.page}>
      <p>hello, {user?.name} there is place where you can upload your posts</p>
      
      <form>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" name='title' id='title' />
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
        </div>
        
        <div>
          <label htmlFor="descripton">Descripton:</label>
          <textarea rows={4} name='descripton'  ></textarea>
        </div>

        <div>
          <label htmlFor="image">upload image:</label>
          <input type="file" name="image" id="image" accept='image/*' onChange={handleImageChange} />
        </div>
        {preview &&
          <img src={preview || ""} alt='Upload preview' width={300} />
        }
        <button type='submit'>upload</button>
      </form>
    </div>
  )
}
