"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { useState } from "react"
import { SignUpForm } from "@/components/sign-up-form"

export default function Auth() {
  const [loginState, setLoginState] = useState(true)
  return (
    <div className="mt-24 min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            FOODIE
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {loginState ? <LoginForm setLoginState={setLoginState} /> :
              <SignUpForm setLoginState={setLoginState} />}
          </div>
        </div>
      </div>
    </div>
  )
}
