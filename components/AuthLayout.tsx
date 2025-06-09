"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook for user state
import { useAuthStore } from "@/lib/auth.store";

interface AuthLayoutProps {
  children: ReactNode;
  authentication?: boolean;
}

// Utility component to sync Clerk with Zustand store
const AuthSync: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { setAuthState, clearAuthState } = useAuthStore();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        setAuthState(user.id);
      } else {
        clearAuthState();
      }
    }
  }, [user, isLoaded, setAuthState, clearAuthState]);

  return null;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authentication = true }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const { isSignedIn } = useUser(); // Clerk auth status
  const { isAuthenticated, isLoading } = useAuthStore(); // Zustand auth status

  useEffect(() => {
    // Wait for both Clerk and Zustand store to finish loading
    if (!isLoading) {
      // Ensure Clerk and Zustand auth status are in sync
      const authStatus = isSignedIn && isAuthenticated;

      if (authentication) {
        // If page requires login and user isn’t signed in, redirect to /sign-in
        if (!authStatus) {
          router.push("/sign-in");
        }
      } else {
        if (authStatus) {
          router.replace("/home");
        }
      }

      setLoader(false);
    }
  }, [isSignedIn, isAuthenticated, isLoading, router, authentication]);

  return (
    <>
      <AuthSync />
      {loader ? <h1>Loading...</h1> : <>{children}</>}
    </>
  );
};

export default AuthLayout;