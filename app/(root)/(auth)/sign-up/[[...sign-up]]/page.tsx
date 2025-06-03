"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import { login, logout } from "@/lib/features/authSlice";
import { AppDispatch, useAppSelector } from "@/lib/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";

const SignUpPage = () => {
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
      router.push("/products");
    } else {
      dispatch(logout());
    }
    setLoading(false);
  }, [isSignedIn, user, isLoaded, dispatch, router]);

  return (
    <AuthLayout authentication={false}>
      {loading || !isLoaded ? (
        <div className="flex py-16 items-center justify-center px-4">
          <p>Loading...</p>
        </div>
      ) : isSignedIn && authStatus ? (
        <div className="flex py-16 items-center justify-center px-4">
          <div className="mx-auto text-gray-700 w-full max-w-[500px]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-normal font-geist tracking-tighter">
                Welcome aboard
              </h1>
              <p className="text-gray-800/90">
                Your account has been created successfully
              </p>
              <Link href="/products">
                <button className="mt-6 relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2">
                  Start Shopping
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
                Create an account
              </h1>
              <p className="text-gray-800/90 font-geist font-normal">
                Sign up to start shopping
              </p>
            </div>

            <SignUp.Root>
              {/* Sign-up Form */}
              <SignUp.Step name="start">
                <div className="space-y-5">
                  <Clerk.Field name="emailAddress">
                    <Label htmlFor="emailAddress">Email</Label>
                    <Clerk.Input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                      placeholder="Enter your email"
                    />
                    <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                  </Clerk.Field>

                  <Clerk.Field name="username">
                    <Label htmlFor="firstName">Username</Label>
                    <Clerk.Input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                      placeholder="Enter your username"
                    />
                    <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                  </Clerk.Field>

                  <Clerk.Field name="password">
                    <Label htmlFor="password">Password</Label>
                    <Clerk.Input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                      placeholder="Create a password"
                    />
                    <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                  </Clerk.Field>

                  <SignUp.Captcha />

                  <SignUp.Action
                    submit
                    className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                  >
                    Sign up
                  </SignUp.Action>
                </div>
              </SignUp.Step>

              {/* Verification Step */}
              <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                  <div className="space-y-5">
                    <p className="text-sm text-gray-600">
                      We sent a code to your email.
                    </p>
                    <Clerk.Field name="code">
                      <Label htmlFor="code">Verification Code</Label>
                      <Clerk.Input
                        className="w-full rounded border border-gray-300 px-3 py-2 text-black placeholder:text-gray-400"
                        placeholder="Enter verification code"
                      />
                      <Clerk.FieldError className="text-red-500 text-sm mt-1" />
                    </Clerk.Field>
                    <SignUp.Action
                      submit
                      className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
                    >
                      Verify
                    </SignUp.Action>
                  </div>
                </SignUp.Strategy>
              </SignUp.Step>
            </SignUp.Root>

            {/* Google Sign-up and Sign-in Link */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Already have an account?
                <Link
                  className="font-medium text-gray-900 underline-offset-4 hover:underline ml-2"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <div className="mt-6 border-t pt-6">
              <Clerk.Connection
                name="google"
                className="relative flex justify-center items-center h-12 w-full mx-auto text-center font-geist tracking-tighter overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
              >
                <Chrome className="text-white mr-2 h-4 w-4" />
                Sign up with Google
              </Clerk.Connection>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;