'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Home, LogOut } from "lucide-react";
import Link from "next/link";

export default function HeaderUser() {
  // Demo user data
  const demoUser = {
    name: "Demo User",
    email: "demo@example.com",
    image: "",
  };

  const handleSignOut = () => {
    // Demo sign out - just log to console
    console.log("Demo sign out clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="hover:bg-ds-gray-100 flex items-center gap-2 rounded-md p-2 h-full transition-colors cursor-pointer">
          <div className="hidden sm:flex flex-col items-start">
            <span className="max-w-[120px] truncate text-sm font-medium">
              {demoUser.name}
            </span>
          </div>
          <Avatar className="h-6 w-6 border">
            <AvatarImage src={demoUser.image} alt="User" />
            <AvatarFallback className="text-xs">
              {demoUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <p className="text-muted-foreground text-xs">Signed in as</p>
          <p className="truncate text-sm font-medium">{demoUser.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/dashboard">     
          <DropdownMenuItem className="cursor-pointer py-1.5 text-sm">
            <User className="mr-1.5 h-3.5 w-3.5" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/">     
        <DropdownMenuItem className="cursor-pointer py-1.5 text-sm" >
          <Home className="mr-1.5 h-3.5 w-3.5" />
          <span>Home</span>
        </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer py-1.5 text-sm text-red-500 focus:text-red-500"
          onClick={handleSignOut}
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
