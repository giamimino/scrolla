"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { editProfile, uploadpfp } from '@/actions/actions'

type User = {
  id: string,
  name: string,
  email: string,
  following: {id: string}[],
  followers: {id: string}[],
  likedPosts: {id: string}[],
  bio: string,
  username: string,
  profileImage: string
}

type Post = {
  image: string;
  _count: {
    likes: number;
  };
  id: string;
}

function PostContainer(props: { image: string; id: string; likes: number }) {
  return (
    <div className={styles.post}>
      <Image
        src={props.image}
        alt={props.id}
        width={150}
        height={100}
      />
      <span>
        <Icon icon={'mdi:heart'} />
        {props.likes}
      </span>
    </div>
  )
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [error, setError] = useState("")
  const [pfpEdit, setPfpEdit] = useState(false)
  const [isShare, setIsShare] = useState(false)
  const [post, setPost] = useState<Post[] | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

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

  useEffect(() => {
    const param = searchParams.get("p");
    if (!user?.id || !param) return;

    fetch('/api/getProfilePosts', {
      method: 'POST',
      headers: { "content-type": 'application/json' },
      body: JSON.stringify({ curParam: param, user_id: user.id })
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.posts?.posts)) {
          setPost(data.posts.posts);
        } else {
          setError(data.message || "Failed to load posts");
          setPost([]);
        }
      })
      .catch(err => {
        console.log("fetch error:", err)
        setError("Network error");
      });
  }, [searchParams, user?.id]);


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

  async function handleSubmitProfileImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await uploadpfp(formData)

    if(!result.success) {
      setError(result.message)
    } else {
      setPfpEdit(prev => !prev)
      setError("")
    }
  }

  function handleParam(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('p', value)
    router.push(`/profile?${params.toString()}`)
  }
  
  return (
    <div className={styles.page}>
      <div>
        <span onClick={() => setPfpEdit(prev => !prev)}>
          {user?.profileImage === "user-image" ? <Icon icon={"fa6-solid:user"} /> : <Image 
          src={user?.profileImage || "https://raw.githubusercontent.com/giamimino/images/refs/heads/main/scrolla/scrolla-logo.webp"} 
          alt={user?.name || "profile-pfp"} 
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
            <button data-setshare onClick={() => redirect("/profile/settings")}><Icon icon={"material-symbols:settings-rounded"} /></button>
            <button data-setshare onClick={() => setIsShare(prev => !prev)}><Icon icon={"majesticons:share"} /></button>
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
            <div onClick={() => handleParam("posts")} 
            className={searchParams.get('p') === "posts" ? styles.active : ""}>
              <Icon icon="gridicons:posts" /> posts</div>
            <div onClick={() => handleParam("saved")} 
            className={searchParams.get('p') === "saved" ? styles.active : ""}>
              <Icon icon="material-symbols:bookmark-outline" /> saved</div>
            <div onClick={() => handleParam("liked")} 
            className={searchParams.get('p') === "liked" ? styles.active : ""}>
              <Icon icon="mdi:heart-outline" /> liked</div>
          </nav>
        </aside>
        <main>
          {post &&
            post.map((p) => (
              <PostContainer
                image={p.image}
                likes={p._count?.likes ?? 0}
                id={p.id}
                key={p.id}
              />
            ))
          }
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
              {error && <p className='text-[tomato]'>{error}</p>}
            </form>
          </div>
        </main>
      )}
      
      {pfpEdit &&
      <main className={styles.pfpEdit}>
        <form onSubmit={handleSubmitProfileImage}>
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
          {error && <p className='text-[tomato]'>{error}</p>}
        </form>
      </main>
      }

      {isShare &&
        <main className={styles.share}>
          <div>
            <p onClick={async () => {
                const userPath = `/profile/${user?.username}`;
                navigator.clipboard.writeText(userPath)
                setIsShare(prev => !prev)
              }} data-clipboard-text={"copy!"}>{`${user?.username}`}</p>
          </div>
        </main>
      }
    </div>
  )
}