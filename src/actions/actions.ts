"use server"
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"
import { randomUUID } from "crypto";
import ImageKit from "imagekit";
import { cookies } from "next/headers";

export async function signup(formData: FormData) {
  try {
    const username = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookiestore = await cookies();

    if (!username || !email || !password) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    const existName = await prisma.user.findMany({
      where: { username },
    })

    if(existName.length > 0) {
      return {
        success: false,
        message: "This username is already in use."
      }
    }

    const existEmail = await prisma.user.findMany({
      where: { email },
    });

    if (existEmail.length > 0) {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        name: username,
        email,
        hashedPassword,
      },
    });
    
    if (!user) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    const session = await prisma.session.create({
      data: {
        user_id: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });


    if (!session) {
      return {
        success: false,
        message: "Session could not be created.",
      };
    }

    cookiestore.set("sessionId", session.id, {
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });


    return {
      success: true,
      message: "Signup successful.",
    };
  } catch (err) {
    console.log("Signup error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function signin(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = await cookies();

    if (!email || !password) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: "No user found with this email.",
      };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordCorrect) {
      return {
        success: false,
        message: "Email or password is incorrect.",
      };
    }

    const session = await prisma.session.create({
      data: {
        user_id: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    cookieStore.set("sessionId", session.id, {
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (err) {
    console.log("Signin error:", err);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function userCheck() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    const session = await prisma.session.findFirst({
      where: { id: sessionId},
      select: {
        expiresAt: true,
        user_id: true
      }
    })

    if(!session) {
      return {
        success: false
      }
    }

    if(session?.expiresAt < new Date(Date.now())) {
      await prisma.session.delete({
        where: { id: sessionId},
      })
      cookieStore.delete("sessionId")
      return {
        success: false
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user_id}
    })

    if(!user) return { success: false }

    return {
      success: true
    }
  } catch(err) {
    console.log("checking error", err);
    return {
      success: false
    }
  }
}

export async function editProfile(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    
    if(!name.trim() || !username.trim() || !bio.trim()) {
      return {
        success: false,
        message: "All fields are required."
      }
    }
    
    const cookiesStore = await cookies()
    const sessionId = cookiesStore.get("sessionId")?.value
    if(!sessionId) {
      return {
        success: false,
        message: "user have to login before edit."
      }
    }

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId
      },
      select: {
        user: {
          select: { id: true }
        },
        expiresAt: true
      }
    })
    if(!session || session.expiresAt < new Date()) {
      return {
        success: false,
        message: "User not found or session has expired."
      }
    }

    const exitsUsername = await prisma.user.findFirst({
      where: {  username, NOT: {
        id: session.user.id
      } },
      select: {
        username: true
      }
    })

    if(exitsUsername) {
      return {
        success: false,
        message: "username already exist."
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username: username.toLowerCase(),
        bio
      }
    })

    if(!user) {
      return {
        success: false,
        message: "Somthing went wrong."
      }
    }

    return {
      succes: true,
      message: "Successfully updated profile.",
      user
    }
  } catch (err) {
    console.error("Profile edit error:", err);
    return {
      success: false,
      message: "Unexpected error: " + (err instanceof Error ? err.message : JSON.stringify(err)),
    };
  }
}

export async function uploadpfp(formData: FormData) {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });

  try {
    const image = formData.get("profile_image") as File

    if(!image || !image.type.startsWith("image/")) {
      return {
        success: false,
        message: "you have to upload image"
      }
    }

    const sessionId = (await cookies()).get("sessionId")?.value
    if(!sessionId) {
      return {
        success: false,
        message: "user have to login before edit."
      }
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        expiresAt: true,
        user: {
          select: { id: true }
        }
      }
    })

    if(!session || session.expiresAt < new Date()) {
      return {
        success: false,
        message: "User not found or session has expired."
      }
    }

    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await imagekit.upload({
      file: buffer,
      fileName: `${randomUUID()}-image.name`,
      folder: "/posts"
    })

    if(!uploaded) {
      return {
        success: false,
        message: "Failed to upload image"
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profileImage: uploaded.url
      }
    })

    if(!user) {
      return {
        success: false,
        message: "Failed to upload image"
      }
    }

    return {
      success: true,
      message: "Successfully uploaded image"
    }
  } catch(err) {
    console.log("profile picture upload error", err);
    return {
      success: false,
      message: "Something went wrong. pls try again"
    }
  }
}

export async function uploadPost(formData: FormData, tags: string[]) {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });
  
  try {
    const image = formData.get("image") as File
    const title = formData.get("image") as string
    const desciption = formData.get("desciption") as string

    if(!image || !title || !desciption || !tags) {
      return {
        success: false,
        message: "All fiels are required."
      }
    }

    if(!image.type.startsWith("image/")) {
      return {
        success: false,
        message: "Uploaded image most have to be image"
      }
    }

    // here is upload system
    // and upload post system
  } catch(err) {
    console.log("error uploading image", err);
    return {
      success: false,
      message: "Something went wrong."
    }
  }
}