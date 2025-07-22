"use server"
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"
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