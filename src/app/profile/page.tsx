"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

type User = {
  name: string,
  email: string,
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
            <p>{user?.email}</p>
          </div>
          <div>
            <button data-edit>Edit profile</button>
            <button data-setshare><Icon icon={"material-symbols:settings-rounded"} /></button>
            <button data-setshare><Icon icon={"majesticons:share"} /></button>
          </div>
          <div>
            <div><span></span><button data-socstats>Following</button></div>
            <div><span></span><button data-socstats>Followers</button></div>
            <div><span></span><button data-socstats>Likes</button></div>
          </div>
        </div>
      </div>
    </div>
  )
}
