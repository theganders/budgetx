"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className={cn(`transition-all duration-300 ease-in-out`)}>
        <div className="arc-wrapper mt-4">
          <div
            className={cn(
              `flex h-12 items-center justify-between gap-4 px-2 py-4 transition-all duration-300 ease-in-out md:h-14 md:gap-10`,
              isScrolled
                ? "border-ds-gray-alpha-400 bg-ds-gray-alpha-100 supports-[backdrop-filter]:bg-ds-gray-alpha-100 mx-2 rounded-lg border backdrop-blur-md sm:mx-4 sm:rounded-full"
                : "border border-transparent px-4"
            )}
          >
            <div className="flex w-full items-center gap-4 md:gap-10">
              <Link
                href="/"
                className={cn(
                  "text-ds-gray-1000 text-xl font-bold tracking-tighter sm:ml-2 flex items-center gap-2"
                )}
              >
                <span className="text-xl">💰</span>
                <span className="text-ds-gray-1000 text-xl font-semibold tracking-tighter font-mono">
                  BudgetX
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                size="sm"
                className="bg-ds-gray-1000 text-ds-background-100 hover:bg-ds-gray-900 flex items-center gap-0.5 rounded-full px-4! py-4 text-sm md:gap-1 md:px-4"
                asChild
              >
                <Link href="/dashboard">
                  <span>Dashboard</span>
                  <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                </Link>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-ds-gray-1000 hover:bg-ds-gray-alpha-200 rounded-full p-2 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="border-ds-gray-alpha-400 bg-ds-background-100 w-[280px] sm:w-[320px]"
                >
                  <SheetHeader className="border-ds-gray-alpha-400 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-ds-gray-1000 text-xl font-bold tracking-tighter flex items-center gap-2">
                        <span>💰</span> BudgetX
                      </SheetTitle>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-ds-gray-1000 hover:bg-ds-gray-alpha-200 rounded-full p-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col py-6">
                    {/* CTA Button */}
                    <div className="mx-4 pt-2">
                      <SheetClose asChild>
                        <Button
                          size="lg"
                          className="bg-ds-gray-1000 text-ds-background-100 hover:bg-ds-gray-900 flex w-full items-center justify-center gap-2 rounded-full py-4"
                          asChild
                        >
                          <Link href="/dashboard">
                            <span>Dashboard</span>
                            <ArrowRight
                              className="h-4 w-4"
                              strokeWidth={2.5}
                            />
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
