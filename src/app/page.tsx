"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.scss'
import { Icon } from '@iconify/react';

export default function Home() {

  return (
    <div className={styles.page}>
      <main>
        <div className={styles.post}>
          <div>
            <div className={styles.image}></div>
            <h1>{"title"}</h1>
            <p>{"descritpion"}</p>
          </div>
          <aside>
            <button data-user><Icon icon={"mdi:account"} /></button>
            <button data-heart><Icon icon={"mdi:heart-outline"} /></button>
            <button><Icon icon={"material-symbols:bookmark-outline"} /></button>
            <button><Icon icon={"fa-solid:comment-dots"} /></button>
          </aside>
        </div>
      </main>
      <aside>
        <button><Icon icon={"lsicon:up-filled"} /></button>
        <button><Icon icon={"lsicon:down-filled"} /></button>
      </aside>
    </div>
  );
}