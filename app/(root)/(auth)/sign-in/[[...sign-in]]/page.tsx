"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { login, logout } from "@/lib/features/authSlice";
import { AppDispatch, useAppSelector } from "@/lib/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Chrome } from "lucide-react"; // Replaced FaGoogle with Chrome

const SignInPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useAppSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      dispatch(
        login({
          $id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName || undefined,
        })
      );
    } else {
      dispatch(logout());
    }
    setLoading(false);
  }, [isSignedIn, user, isLoaded, dispatch]);

  return (
    <AuthLayout authentication={true}>
      {loading || !isLoaded ? (
        <div className="flex py-16 items-center justify-center px-4">
          <p>Loading...</p>
        </div>
      ) : isSignedIn && authStatus ? (
        <div className="flex py-16 items-center justify-center px-4">
          <div className="mx-auto text-gray-700 w-full max-w-[500px]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-normal font-geist tracking-tighter">
                Welcome back
              </h1>
              <p className="text-gray-800/90">
                You're signed in successfully
              </p>
              <Link href="/products">
                <button className="mt-6 relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex py-16 relative items-center justify-center px-4">
          <div className="mx-auto z-10 text-gray-700 w-full max-w-[500px]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-normal font-geist tracking-tighter">
                Welcome back
              </h1>
              <p className="text-gray-800/90 font-geist font-normal">
                Sign in to your account to continue
              </p>
            </div>

            <SignIn.Root>
              {/* Email/Username Input */}
              <SignIn.Step name="start">
                <Clerk.Field name="identifier" className="space-y-5">
                  <div>
                    <Label htmlFor="identifier">Email</Label>
                    <Clerk.Input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                      placeholder="Enter your email"
                    />
                    <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                  </div>
                  <SignIn.Action
                    submit
                    className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                  >
                    Sign in
                  </SignIn.Action>
                </Clerk.Field>
              </SignIn.Step>

              {/* Password Input */}
              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <Clerk.Field name="password" className="space-y-5">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Clerk.Input
                        className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                        placeholder="Enter your password"
                      />
                      <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="space-y-4">
                      <SignIn.Action
                        submit
                        className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                      >
                        Continue
                      </SignIn.Action>
                      <SignIn.Action
                        navigate="forgot-password"
                        className="block text-center text-sm text-gray-600 hover:underline"
                      >
                        Forgot Password?
                      </SignIn.Action>
                    </div>
                  </Clerk.Field>
                </SignIn.Strategy>

                {/* Password Reset Code */}
                <SignIn.Strategy name="reset_password_email_code">
                  <div className="space-y-5">
                    <p className="text-sm text-gray-600">
                      We sent a code to <SignIn.SafeIdentifier />.
                    </p>
                    <Clerk.Field name="code">
                      <Clerk.Input
                        className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                        placeholder="Verification Code"
                      />
                      <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                    </Clerk.Field>
                    <SignIn.Action
                      submit
                      className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                    >
                      Continue
                    </SignIn.Action>
                  </div>
                </SignIn.Strategy>
              </SignIn.Step>

              {/* Forgot Password */}
              <SignIn.Step name="forgot-password">
                <SignIn.SupportedStrategy name="reset_password_email_code">
                  <SignIn.Action
                    submit
                    className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                  >
                    Reset Password
                  </SignIn.Action>
                </SignIn.SupportedStrategy>
                <SignIn.Action
                  navigate="previous"
                  className="block text-center text-sm text-gray-600 hover:underline mt-4"
                >
                  Go back
                </SignIn.Action>
              </SignIn.Step>

              {/* Reset Password */}
              <SignIn.Step name="reset-password" className="space-y-5">
                <h1 className="text-2xl font-normal font-geist tracking-tighter">
                  Reset your password
                </h1>
                <Clerk.Field name="password">
                  <Label>New password</Label>
                  <Clerk.Input className="w-full rounded border border-gray-300 px-3 py-2 text-black" />
                  <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                </Clerk.Field>
                <Clerk.Field name="confirmPassword">
                  <Label>Confirm password</Label>
                  <Clerk.Input className="w-full rounded border border-gray-300 px-3 py-2 text-black" />
                  <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                </Clerk.Field>
                <SignIn.Action
                  submit
                  className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                >
                  Reset Password
                </SignIn.Action>
              </SignIn.Step>
            </SignIn.Root>

            {/* Google Sign-in and Sign-up Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Don't have an account?
                <Link
                  className="font-medium text-gray-900 underline-offset-4 hover:underline ml-2"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </p>
            </div>
            <div className="mt-6 border-t pt-6">
              <Clerk.Connection
                name="google"
                className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
              >
                <Chrome className="text-white mr-2 h-4 w-4" /> {/* Replaced FaGoogle with Chrome */}
                Sign in with Google
              </Clerk.Connection>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignInPage;