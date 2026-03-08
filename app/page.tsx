"use client";

// import { ArrowRight } from "lucide-react";
// import { Card, CardDescription, CardHeader } from "@/components/ui/card";
// import Link from "next/link";
// import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/pokedex");
  // <main className="min-h-screen flex flex-col bg-muted">
  //   <Navbar withRegion={false} />

  //   <div className="grid grid-cols-2 gap-5 flex-1 items-start px-6 pt-2 pb-8">
  //     <Link href={`/pokedex`} className="h-full">
  //       <Card
  //         className="group relative rounded-2xl overflow-hidden gap-0 shadow-none cursor-pointer h-full flex flex-row justify-between items-end py-3 lg:py-6 px-3 lg:px-6 bg-cover bg-center"
  //         style={{
  //           backgroundImage:
  //             "url('https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=1600&auto=format&fit=crop')",
  //         }}
  //       >
  //         <div className="absolute inset-0 bg-black/40" />
  //         <div className="relative z-10">
  //           <CardHeader className="px-0 text-background dark:text-foreground absolute -bottom-4 group-hover:bottom-2 transition-all duration-400">
  //             <h2 className="font-bold text-2xl">Pokédex</h2>
  //           </CardHeader>
  //           <CardDescription className="leading-none text-background/90 dark:text-foreground/90 opacity-0 group-hover:opacity-100 transition-all duration-400">
  //             List of all Pokémon
  //           </CardDescription>
  //         </div>
  //         <ArrowRight
  //           className="shrink-0 text-background dark:text-foreground opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
  //           size={24}
  //         />
  //       </Card>
  //     </Link>
  //     <div className="h-full grid grid-rows-2 gap-5 flex-1 items-start">
  //       <Link href={`/trivia`} className="h-full">
  //         <Card
  //           className="group relative rounded-2xl overflow-hidden gap-0 shadow-none cursor-pointer h-full flex flex-row justify-between items-end py-3 lg:py-6 px-3 lg:px-6 bg-cover bg-center"
  //           style={{
  //             backgroundImage:
  //               "url('https://images.unsplash.com/photo-1647892591717-28c7fd63bb3f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  //           }}
  //         >
  //           <div className="absolute inset-0 bg-black/40" />
  //           <div className="relative z-10">
  //             <CardHeader className="px-0 text-background dark:text-foreground absolute -bottom-4 group-hover:bottom-2 transition-all duration-400">
  //               <h2 className="font-bold text-2xl">Trivia</h2>
  //             </CardHeader>
  //             <CardDescription className="leading-none text-background/90 dark:text-foreground/90 opacity-0 group-hover:opacity-100 transition-all duration-400">
  //               Test your knowledge by listing all of the Pokémon
  //             </CardDescription>
  //           </div>
  //           <ArrowRight
  //             className="shrink-0 text-background dark:text-foreground opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
  //             size={24}
  //           />
  //         </Card>
  //       </Link>
  //       <Link href={`/account`} className="h-full">
  //         <Card
  //           className="group relative rounded-2xl overflow-hidden gap-0 shadow-none cursor-pointer h-full flex flex-row justify-between items-end py-3 lg:py-6 px-3 lg:px-6 bg-cover bg-center"
  //           style={{
  //             backgroundImage:
  //               "url('https://images.unsplash.com/photo-1620451912458-b8233cf0a237?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  //           }}
  //         >
  //           <div className="absolute inset-0 bg-black/40" />
  //           <div className="relative z-10">
  //             <CardHeader className="px-0 text-background dark:text-foreground absolute -bottom-4 group-hover:bottom-2 transition-all duration-400">
  //               <h2 className="font-bold text-2xl">Account</h2>
  //             </CardHeader>
  //             <CardDescription className="leading-none text-background/90 dark:text-foreground/90 opacity-0 group-hover:opacity-100 transition-all duration-400">
  //               Your account information
  //             </CardDescription>
  //           </div>
  //           <ArrowRight
  //             className="shrink-0 text-background dark:text-foreground opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
  //             size={24}
  //           />
  //         </Card>
  //       </Link>
  //     </div>
  //   </div>
  // </main>
}
