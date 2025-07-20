"use client"
import React, { useEffect, useState } from 'react'
import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  {name: "Home", href: "/"},
  {name: "Upload", href: "/upload"},
  {name: "Contact", href: "/contact"},
]

type User = {
  name: string,
  profileImage: string,
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/getUser')
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setUser(data.user)
      }
    })
    .catch(err => {
      console.log("fetch error:", err);
    })
  }, [router])

  return (
    <header className={styles.header}>
      <Image
        src="https://raw.githubusercontent.com/giamimino/images/refs/heads/main/scrolla/scrolla-logo.webp"
        alt='scrolla-logo'
        width={875}
        height={875}
      />
      <nav>
        {navLinks.map((nav) => (
          <Link className={pathname === nav.href ? styles.active : ""} key={nav.name.toLowerCase().replace(" ", "-")} href={nav.href}>
            {nav.name}
          </Link>
        ))}
        <div>
          {user?.profileImage === "user-image" ? (
            <Icon icon="fa6-solid:user" />
          ) : (
            <Image 
              src={user?.profileImage || "/default-profile.png"} 
              alt="profile" 
              width={32} 
              height={32} 
            />
          )}

          {user?.name ? (
            <Link href="/profile">{user.name}</Link>
          ) : (
            <Link href="/auth/signup">Sign Up</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
