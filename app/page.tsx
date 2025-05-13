"use client";

import Head from "next/head";
import { useState } from "react"

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // Normally you'd send email to an API or service like ConvertKit, Mailchimp, etc.
  setSubmitted(true)
  setEmail('')
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-br from-black via-zinc-900 to-neutral-800 text-white">
        <Head>
          <title>duka-liart | Coming Soon</title>
          <meta name="description" content="A new kind of eCommerce experience is coming soon." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 animate-fadeIn">
            duka<span className="text-teal-400">-liart</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 mb-8 animate-fadeIn delay-150">
            We are crafting a beautiful eCommerce experience. Stay tuned for the launch!
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeIn delay-300">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-auto"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-md transition-all"
              >
                Notify Me
              </button>
            </form>
          ) : (
            <p className="text-teal-300 animate-fadeIn delay-300">
              Thanks! We will notify you when we launch.
            </p>
          )}
        </div>

        <footer className="absolute bottom-6 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} duka-liart. All rights reserved.
        </footer>
      </main>
    </>
  );
}
