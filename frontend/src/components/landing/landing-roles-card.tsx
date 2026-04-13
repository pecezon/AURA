import type { LucideIcon } from "lucide-react";

interface LandingRolesCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export default function LandingRolesCard({
  icon: Icon,
  title,
  description,
  features,
}: LandingRolesCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-800 rounded-2xl border border-blue-700">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center">
        <Icon size={20} className="text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white">{title}</h3>

      {/* Description */}
      <p className="text-sm text-blue-200 leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-blue-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
