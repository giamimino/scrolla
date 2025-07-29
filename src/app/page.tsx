"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.scss'
import { Icon } from '@iconify/react';
import { userCheck } from '@/actions/actions';
import Image from 'next/image';

type Tag = {
  name: string
}

type Post = {
  title: string,
  description: string,
  id: string,
  image: string,
  likes: {id: string},
  savedBy: {id: string}
}

export default function Home() {
  const [post, setPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/getPost')
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setPost(data.post)
          setError("")
        } else {
          setError(data.message)
        }
      })
      .finally(() => setLoading(false))
  }, [newPost])


  return (
    <div className={styles.page}>
      <main>
        {post && !loading ? 
        <div className={styles.post}>
          <div>
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title || 'post-image'}
                width={350}
                height={500}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-[350px] h-[500px] bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </div>
          <aside>
            <button data-user><Icon icon={"mdi:account"} /></button>
            <button data-heart><Icon icon={"mdi:heart-outline"} /></button>
            <button><Icon icon={"material-symbols:bookmark-outline"} /></button>
            <button><Icon icon={"fa-solid:comment-dots"} /></button>
          </aside>
        </div> :
        <p className='text-[#fff]'>loading...</p>
        }
      </main>
      <aside>
        <button><Icon icon={"lsicon:up-filled"} /></button>
        <button onClick={() => setNewPost(prev => !prev)}><Icon icon={"lsicon:down-filled"} /></button>
      </aside>
    </div>
  );
}