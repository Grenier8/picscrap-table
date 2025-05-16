export const dynamic = "force-dynamic"; // This disables SSG and ISR

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 px-8">
      <h1 className="text-5xl font-extrabold mb-12 text-[#333333]">
        Recent Posts
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mb-8"></div>
    </div>
  );
}
