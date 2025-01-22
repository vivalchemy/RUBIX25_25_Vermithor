import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-green-50 py-32 text-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/hero_bg.webp')",
          filter: "brightness(0.7)",
        }}
      ></div>
      {/* Content Container */}
      <div className="relative z-10 bg-black bg-opacity-40 backdrop-blur-md p-8 rounded-lg max-w-3xl mx-auto shadow-lg">
        {/* Heading */}
        <h1 className="text-6xl font-extrabold mb-4 text-white leading-tight">
          Discover <span className="text-green-400">Local Delights</span>
        </h1>
        {/* Tagline */}
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Your favorite fresh and local food, delivered with care.
        </p>
        {/* Search Bar */}
        <div className="flex justify-center items-center">
          <Input
            type="text"
            placeholder="Search for local food..."
            className="w-2/3 md:w-1/2 px-4 py-3 mr-3 text-gray-700 placeholder-gray-400 focus:placeholder-gray-600 rounded-lg shadow-sm"
          />
          <Button className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md">
            <Search className="mr-2 w-5 h-5" /> Search
          </Button>
        </div>
      </div>
    </section>
  );
}

