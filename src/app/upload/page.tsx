"use client"
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { uploadPost } from '@/actions/actions'
import { Icon } from '@iconify/react'
import cuid from 'cuid'

type User = {
  name: string,
}

export default function Upload() {
  const [user, setUser] = useState<User | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [curTagField, setCurTagField] = useState("")
  const [error, setError] = useState<string[]>([])

  useEffect(() => {
    setTimeout()
  })

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

  async function handleSubmitPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await uploadPost(formData, tags)

    if(!result.success) {
      setError(prev => [...prev, result.message])
    }
  }
  return (
    <div className={styles.page}>
      <p>hello, {user?.name} there is place where you can upload your posts</p>
      
      <form onSubmit={handleSubmitPost}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" name='title' id='title' />
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          <div>
            <div>
              <input type="text" name='tags' id='tags' autoComplete='off' value={curTagField} onChange={(e) => setCurTagField(e.target.value)} />
              <button onClick={() => setTags(prev => [...prev, curTagField])}><Icon icon={"streamline:send-email-solid"} /></button>
            </div>
            {tags &&
              <main>
                <div>
                  {tags.map((tag) => (
                    <div key={tag}>
                      <p>{tag}</p>
                      <button onClick={() => {
                        let tagsArr = tags
                        tagsArr.splice(tagsArr.indexOf(tag), 1)
                      }}><Icon icon={"mingcute:close-fill"} /></button>
                    </div>
                  ))}
                </div>
              </main>
            }
            <aside>
              
            </aside>
          </div>
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
      <div>
        {error &&
        error.map((err) => (
          <p key={cuid()} className='text-[tomato]'>{err}</p>
        ))}
      </div>
    </div>
  )
}
