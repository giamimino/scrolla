"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { editProfile } from '@/actions/actions'

type User = {
  name: string,
  email: string,
  following: {id: string}[],
  followers: {id: string}[],
  likedPosts: {id: string}[],
  bio: string,
  username: string,
  profileImage: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [error, setError] = useState("")
  const [pfpEdit, setPfpEdit] = useState(false)
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

  async function handleSubmitProfileEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const reslut = await editProfile(formData)

    if(!reslut.succes) {
      setError(reslut.message)
    } else {
      if(reslut.succes) {
        setIsEdit(prev => !prev)
      }
    }
  }
  
  return (
    <div className={styles.page}>
      <div>
        <span onClick={() => setPfpEdit(prev => !prev)}>
          {user?.profileImage === "user-image" ? <Icon icon={"fa6-solid:user"} /> : <Image 
          src={user?.profileImage || "https://raw.githubusercontent.com/giamimino/images/refs/heads/main/scrolla/scrolla-logo.webp"} 
          alt={user?.name || ""} 
          width={128}
          height={128}
          objectFit='cover'/>}
        </span>
        <div>
          <div>
            <h2>{user?.name}</h2>
            <p>@{user?.username}</p>
          </div>
          <div>
            <button data-edit onClick={() => setIsEdit(prev => !prev)}>Edit profile</button>
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
      {isEdit && (
        <main className={styles.edit}>
          <div>
            <div>
              <h1>Edit profile</h1>
              <button onClick={() => setIsEdit(prev => !prev)}><Icon icon="material-symbols:close" /></button>
            </div>
            <form onSubmit={handleSubmitProfileEdit}>
              <div>
                <label htmlFor="username">Username</label>
                <div>
                  <input type="text" id='username' name='username' defaultValue={user?.username} />
                  <p>Usernames can only contain letters, numbers, underscores, and periods. Changing your username will also change your profile link.</p>
                </div>
              </div>
              <div>
                <label htmlFor="name">Name</label>
                <div>
                  <input type="text" id='name' name='name' defaultValue={user?.name} />
                </div>
              </div>
              <div>
                <label htmlFor="bio">Bio</label>
                <div>
                  <textarea className='resize-none' name="bio" id="bio" rows={4} defaultValue={user?.bio}></textarea>
                </div>
              </div>
              <aside>
                <button onClick={() => setIsEdit(prev => !prev)}>cancel</button>
                <button type='submit'>save</button>
              </aside>
            </form>
          </div>
        </main>
      )}
      {pfpEdit &&
      <main className={styles.pfpEdit}>
        <form>
          <div>
            <label htmlFor="image">upload picture</label>
            <div>
              {user?.profileImage === "user-image" ? <Icon icon={"fa6-solid:user"} /> : <Image 
                src={user?.profileImage || "https://raw.githubusercontent.com/giamimino/images/refs/heads/main/scrolla/scrolla-logo.webp"} 
                alt={user?.name || ""} 
                width={128}
                height={128}
                objectFit='cover'/>
              }
              <input type="file" name='profile_image' id='image'  accept='image/*'/>
            </div>
          </div>
          <div>
            <button onClick={() => setPfpEdit(prev => !prev)}>cancel</button>
            <button type='submit'>save</button>
          </div>
        </form>
      </main>
      }
    </div>
  )
}
