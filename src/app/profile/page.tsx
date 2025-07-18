"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'

type User = {
  name: string,
  email: string,
}

export default function page() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/getUser")
    .then(res => res.json())
    .then(data => {
      console.log("data",data);
      
      if(data.success) {
        setUser(data.user)
      }
    })
    .catch(err => {
      console.log(err);
    })
  }, [router])

  return (
    <div className={styles.page}>
      <div>
        <h1>
        Profile
        </h1>
        {user?.name && <p>{user?.name}</p>}
        {user?.email && <p>{user?.email}</p>}
      </div>
    </div>
  )
}
