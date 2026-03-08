"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CircleUser, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfileAvatar() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent("Random User")}`}
          alt="random user avatar"
          className="rounded-full w-8 h-8 shrink-0 object-cover cursor-pointer"
          width={40}
          height={40}
        />
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2">
          <Link href="/account">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <CircleUser /> Account
            </Button>
          </Link>
          <Button
            variant="ghostDestructive"
            className="justify-start text-destructive cursor-pointer"
          >
            <LogOut /> Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
