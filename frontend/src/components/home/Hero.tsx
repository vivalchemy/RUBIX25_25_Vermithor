import Search from "./SearchBar";

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
          <span className="text-green-400">FOODIE</span>
        </h1>
        {/* Tagline */}
        <p className="text-lg md:text-xl mb-8 text-gray-200">Optimizing local produce, Minimizing global waste</p>
        {/* Search Bar */}
        <Search />
      </div>
    </section>
  );
}

