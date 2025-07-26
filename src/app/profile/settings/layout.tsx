import React from 'react'
import styles from './page.module.scss'

const navLinks = [
  {name: ""}
]

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside>
        <h1>Settings</h1>
        <nav>

        </nav>
      </aside>
      <main>
        {children}
      </main>
    </div>
  )
}
