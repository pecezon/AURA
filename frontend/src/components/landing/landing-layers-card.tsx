// LandingLayersCard.tsx
import type { LucideIcon } from "lucide-react";

interface LandingLayersCardProps {
  layer: number;
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

export default function LandingLayersCard({
  layer,
  icon: Icon,
  title,
  description,
  tags,
}: LandingLayersCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Layer label + line */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase whitespace-nowrap">
          Capa {String(layer).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon size={20} className="text-blue-700" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
