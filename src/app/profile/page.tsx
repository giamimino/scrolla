"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

type User = {
  name: string,
  email: string,
  following: {id: string}[],
  followers: {id: string}[],
  likedPosts: {id: string}[],
  bio: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/getUser")
      .then(res => res.json())
      .then(data => {
        console.log("data", data)
        if (data.success) {
          setUser(data.user)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [router])

  return (
    <div className={styles.page}>
      <div>
        <Icon icon={"fa6-solid:user"} />
        <div>
          <div>
            <h2>{user?.name}</h2>
            <p>@{user?.name}</p>
          </div>
          <div>
            <button data-edit>Edit profile</button>
            <button data-setshare><Icon icon={"material-symbols:settings-rounded"} /></button>
            <button data-setshare><Icon icon={"majesticons:share"} /></button>
          </div>
          <div>
            <div><span>{user?.following.length ?? 0}</span><button data-socstats>Following</button></div>
            <div><span>{user?.followers.length ?? 0}</span><button data-socstats>Followers</button></div>
            <div><span>{user?.likedPosts.length ?? 0}</span><button data-socstats>Likes</button></div>
          </div>
          <div>
            <p> 
              {user?.bio}
            </p>
          </div>
        </div>
      </div>
      <main>
        <aside>
          <nav>
            <div><Icon icon="gridicons:posts" /> posts</div>
            <div><Icon icon="material-symbols:bookmark-outline" /> saved</div>
            <div><Icon icon="mdi:heart-outline" /> liked</div>
          </nav>
        </aside>
        <main>

        </main>
      </main>
    </div>
  )
}
