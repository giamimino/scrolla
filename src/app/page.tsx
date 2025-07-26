"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.scss'

type Previus = {
  id: string,
  line: number,
} 

export default function Home() {
  const [previus, setPrevius] = useState<Previus[] | null>(null)

  useEffect(() => {
    
  })

  return (
    <div className={styles.page}>
      <main>

      </main>
      <aside>
        <button>up</button>
        <button>down</button>
      </aside>
    </div>
  );
}