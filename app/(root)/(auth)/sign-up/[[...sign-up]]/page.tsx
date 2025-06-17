"use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import { Chrome, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors";
  
  const buttonClassName = "relative flex justify-center items-center h-12 w-full text-sm font-medium tracking-tight overflow-hidden rounded-md bg-neutral-900 px-4 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <AuthLayout authentication={false}>
      <div className="flex min-h-screen py-16 relative items-center justify-center px-4">
        <div className="mx-auto z-10 w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to start your shopping journey
            </p>
          </div>
          {/* <SignUp /> */}
{/* 
          <SignUp.Root>
            <SignUp.Step name="start">
              <Clerk.Connection
                name="google"
                className="relative flex justify-center items-center h-12 w-full text-sm font-medium tracking-tight overflow-hidden rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Clerk.Connection>

             
              <div className="mt-8 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
             
                <Clerk.Field name="emailAddress" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Email address
                  </Clerk.Label>
                  <Clerk.Input
                    type="email"
                    autoComplete="email"
                    className={inputClassName}
                    placeholder="Enter your email address"
                  />
                  <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                </Clerk.Field>

             
                <Clerk.Field name="username" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Username
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    autoComplete="username"
                    className={inputClassName}
                    placeholder="Choose a username"
                  />
                  <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                </Clerk.Field>

            
                <Clerk.Field name="password" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Password
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputClassName} pr-10`}
                      placeholder="Create a secure password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                </Clerk.Field>

             
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password must contain:</p>
                  <ul className="ml-4 space-y-0.5">
                    <li>• At least 8 characters</li>
                    <li>• One uppercase and lowercase letter</li>
                    <li>• One number or special character</li>
                  </ul>
                </div>

              
                <SignUp.Captcha className="flex justify-center" />

            
                <SignUp.Action submit className={buttonClassName}>
                  Create account
                </SignUp.Action>
              </div>
            </SignUp.Step>

           
            <SignUp.Step name="verifications">
              <SignUp.Strategy name="email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Verify your email
                    </h2>
                    <p className="text-sm text-gray-600">
                      We've sent a verification code to your email address. Please enter it below to complete your registration.
                    </p>
                  </div>
                  
                  <Clerk.Field name="code" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-gray-700">
                      Verification code
                    </Clerk.Label>
                    <Clerk.Input
                      type="text"
                      autoComplete="one-time-code"
                      className={inputClassName}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                    <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                  </Clerk.Field>
                  
                  <SignUp.Action submit className={buttonClassName}>
                    Verify email
                  </SignUp.Action>

                
                  <div className="text-center">
                    <SignUp.Action
                      resend
                      className="text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded"
                    >
                      Didn't receive the code? Resend
                    </SignUp.Action>
                  </div>
                </div>
              </SignUp.Strategy>
            </SignUp.Step>

          
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-neutral-900 hover:underline">
                Sign in
              </Link>
            </div>
          </SignUp.Root> */}
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;