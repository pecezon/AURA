import { useState, useEffect } from "react";

export default function LandingStats() {
  const STATS = [
    { label: "Cursos en el MVP", value: "4" },
    { label: "Roles de usuario", value: "3" },
    { label: "Fases de desarrollo", value: "5" },
    { label: "Retos Sempra atacados", value: "2" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % STATS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [STATS.length]);

  return (
    <div id="stats" className="bg-gray-100/10 w-full">
      {/* Mobile only: Carousel */}
      <div className="md:hidden flex flex-col items-center py-8 gap-4">
        <div className="flex flex-col items-center gap-1 w-48 text-center">
          <span className="text-5xl font-black text-blue-900 transition-all duration-300">
            {STATS[current].value}
          </span>
          <span className="text-xs text-gray-500">{STATS[current].label}</span>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {STATS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-blue-900 w-4" : "bg-gray-300 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* md and up: Full row */}
      <div className="hidden md:grid md:grid-cols-4 divide-x divide-gray-200">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1 py-10 px-6"
          >
            <span className="text-4xl font-black text-blue-900">
              {stat.value}
            </span>
            <span className="text-xs text-gray-500 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
