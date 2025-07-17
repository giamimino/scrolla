'use client'

import { signup } from '@/actions/actions';
import React, { useState } from 'react';
import styles from '../page.module.scss'
import Link from 'next/link';

export default function Signup() {
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)

    if (result.success) {
      setMessage('Registration successful!');
    } else {
      setMessage(result.message || 'Error during registration');
    }
  }

  return (
    <div className={styles.auth}>
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            type="name"
            name='name'
            id='name'
            required
          />
        </div>

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

          <button type="submit">Sign Up</button>
          <p>Already have an account? <Link href="/auth/signin">sign in</Link></p>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
