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

type Tag = {
  name: string
}

export default function Upload() {
  const [user, setUser] = useState<User | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [curTagField, setCurTagField] = useState<string>("")
  const [error, setError] = useState<string[]>([])
  const [tagField, setTagField] = useState(false)
  const [suggest, setSuggest] = useState<Tag | null>(null)

  useEffect(() => {
    setInterval(() => {
      setError([])
    }, 2000)
  }, [error])

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

  useEffect(() => {
    fetch('api/getTags', {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({ curTagField })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setSuggest(data.tags)
      }
    })
  }, [tagField])
  
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
              <input type="text" name='tags' id='tags' onFocus={() => setTagField(prev => !prev)} autoComplete='off' value={curTagField} onChange={(e) => setCurTagField(e.target.value)} />
              <button onClick={() => {
                  setTags(prev => [...prev, curTagField])
                  setCurTagField("")
                }}><Icon icon={"streamline:send-email-solid"} /></button>
              <aside>
                  {tagField && 
                    <p>{suggest?.name}</p>
                  }
              </aside>
            </div>
            {tags &&
              <main>
                <div>
                  {tags.map((tag, index) => (
                    <div key={`${tag}-${index}`}>
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
