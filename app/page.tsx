"use client";
export const dynamic = "force-dynamic"; // This disables SSG and ISR

import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-16 px-8">
      <Image
        src="/logo.png"
        alt="Picscrap Logo"
        width={300}
        height={300}
        className="mb-20 drop-shadow-lg"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#333333] dark:text-gray-100 text-center">
        Picscrap Table
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center max-w-xl">
        Panel centralizado para gestionar y comparar productos, precios y stock
        entre múltiples páginas web y marcas. Por favor, inicia sesión para
        acceder a las funciones de administración.
      </p>
      {!session && (
        <div className="flex flex-col items-center">
          <span className="mb-3 text-gray-600 dark:text-gray-400">
            Por favor, inicia sesión para continuar
          </span>
          <button
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow"
            onClick={() => (window.location.href = "/login")}
          >
            Iniciar sesión
          </button>
        </div>
      )}
    </div>
  );
}
