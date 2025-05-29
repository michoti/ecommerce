"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function LayoutPage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="scroll-smooth">
        {children}  
        <Footer />
      </main>
    </div>
)}