"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 xl:px-8">
      <div className="w-full max-w-4xl text-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold md:text-5xl md:font-extrabold">
            Oops! Page Not Found
          </h1>
          <p className="mb-8 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <Button asChild size="lg" className="font-semibold">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
