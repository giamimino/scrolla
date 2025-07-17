"use client"
import React, { useState } from 'react'
import styles from '../page.module.scss'
import { signin } from '@/actions/actions'
import Link from 'next/link';

export default function SigninPage() {
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const result = await signin(formData)

    if (!result.success) {
      setMessage(result.message || 'Error during registration');
    } else {
      if(result.success) {
        setMessage('Registration successful!');
      }
    }
  }

  return (
    <div className={styles.auth}>
      <div>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type="email"
            name='email'
            id='email'
            required
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type="password"
            name='password'
            id='password'
            required
          />
        </div>

          <button type="submit">Sign In</button>
          <p>Don't have an account? <Link href="/auth/signup">sign up</Link></p>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
