"use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";
import { Chrome, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useState } from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors";
  
  const buttonClassName = "relative flex justify-center items-center h-12 w-full text-sm font-medium tracking-tight overflow-hidden rounded-md bg-neutral-900 px-4 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const linkButtonClassName = "text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded";

  return (
    <AuthLayout authentication={false}>
      <div className="flex min-h-screen py-16 relative items-center justify-center px-4">
        <div className="mx-auto z-10 w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          <SignIn />

          {/* <SignIn.Root> */}
          
            {/* <SignIn.Step name="start">
             
              <Clerk.Connection
                name="google"
                className="relative flex justify-center items-center h-12 w-full text-sm font-medium tracking-tight overflow-hidden rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                <Clerk.Icon  className="p-4"/>
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
               
                <Clerk.Field name="identifier" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Email or username
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    autoComplete="username"
                    className={inputClassName}
                    placeholder="Enter your email or username"
                  />
                  <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                </Clerk.Field>

               
                <SignIn.Action submit className={buttonClassName}>
                  Continue
                </SignIn.Action>
              </div>
            </SignIn.Step> */}

            {/* Verification Steps */}
            {/* <SignIn.Step name="verifications">
              
            
              <SignIn.Strategy name="email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Check your email
                    </h2>
                    <p className="text-sm text-gray-600">
                      We sent a verification code to <SignIn.SafeIdentifier />. Please enter it below.
                    </p>
                  </div>
                  
                  <Clerk.Field name="code" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-gray-700">
                      Email code
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
                  
                  <SignIn.Action submit className={buttonClassName}>
                    Continue
                  </SignIn.Action>
                  
                  <div className="text-center">
                    <SignIn.Action resend className={linkButtonClassName}>
                      Didn't receive the code? Resend
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>

             
              <SignIn.Strategy name="password">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Enter your password
                    </h2>
                    <p className="text-sm text-gray-600">
                      Welcome back! Please enter your password for <SignIn.SafeIdentifier />.
                    </p>
                  </div>

                  <Clerk.Field name="password" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-gray-700">
                      Password
                    </Clerk.Label>
                    <div className="relative">
                      <Clerk.Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className={`${inputClassName} pr-10`}
                        placeholder="Enter your password"
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

                  <SignIn.Action submit className={buttonClassName}>
                    Sign in
                  </SignIn.Action>

                  
                  <div className="text-center">
                    <SignIn.Action navigate="forgot-password" className={linkButtonClassName}>
                      Forgot password?
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>

             
              <SignIn.Strategy name="reset_password_email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Check your email
                    </h2>
                    <p className="text-sm text-gray-600">
                      We sent a password reset code to <SignIn.SafeIdentifier />. Please enter it below.
                    </p>
                  </div>
                  
                  <Clerk.Field name="code" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-gray-700">
                      Reset code
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
                  
                  <SignIn.Action submit className={buttonClassName}>
                    Continue
                  </SignIn.Action>

                
                  <div className="text-center">
                    <SignIn.Action resend className={linkButtonClassName}>
                      Didn't receive the code? Resend
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>
            </SignIn.Step> */}

            {/* Forgot Password Step */}
            {/* <SignIn.Step name="forgot-password">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Forgot your password?
                  </h2>
                  <p className="text-sm text-gray-600">
                    No worries! We'll send you a reset link.
                  </p>
                </div>

                <SignIn.SupportedStrategy name="reset_password_email_code">
                  Reset password
                </SignIn.SupportedStrategy>

                <div className="text-center">
                  <SignIn.Action navigate="previous" className={linkButtonClassName}>
                    Go back
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Step> */}

            {/* Reset Password Step */}
            {/* <SignIn.Step name="reset-password">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Reset your password
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please enter your new password below.
                  </p>
                </div>

                <Clerk.Field name="password" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    New password
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputClassName} pr-10`}
                      placeholder="Enter your new password"
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

                <Clerk.Field name="confirmPassword" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Confirm password
                  </Clerk.Label>
                  <Clerk.Input
                    type="password"
                    autoComplete="new-password"
                    className={inputClassName}
                    placeholder="Confirm your new password"
                  />
                  <Clerk.FieldError className="text-red-600 text-xs mt-1 block" />
                </Clerk.Field>

                <SignIn.Action submit className={buttonClassName}>
                  Reset password
                </SignIn.Action>
              </div>
            </SignIn.Step> */}

            {/* Sign-up link */}
            {/* <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-medium text-neutral-900 hover:underline">
                Sign up
              </Link>
            </div> */}
          {/* </SignIn.Root> */}
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;