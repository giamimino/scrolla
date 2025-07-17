import React from 'react'
import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  {name: "Home", href: "/"},
  {name: "Upload", href: "/upload"},
  {name: "Contact", href: "/contact"},
]

export default function Header() {
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
          <Link key={nav.name.toLowerCase().replace(" ", "-")} href={nav.href}>
            {nav.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
