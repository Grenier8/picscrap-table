"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md py-4 px-8">
      <nav className="flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Picscrap
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session && (
            <>
              <Link
                href="/products"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Products
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">{session.user.name}</div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
