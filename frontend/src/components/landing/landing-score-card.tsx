import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

interface LandingScoreCardProps {
  label: string;
  value: number;
  max?: number;
  description: string;
  color?: "blue" | "green" | "red";
}

export default function LandingScoreCard({
  label,
  value,
  max = 100,
  description,
  color = "blue",
}: LandingScoreCardProps) {
  const colorMap = {
    blue: {
      value: "text-blue-900",
      indicator: "*:data-[slot=progress-indicator]:bg-blue-700",
    },
    green: {
      value: "text-green-500",
      indicator: "*:data-[slot=progress-indicator]:bg-green-500",
    },
    red: {
      value: "text-red-500",
      indicator: "*:data-[slot=progress-indicator]:bg-red-500",
    },
  };

  return (
    <div className="flex flex-col gap-3 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className={cn("text-sm font-black", colorMap[color].value)}>
          {value}/{max}
        </span>
      </div>

      <Progress
        value={(value / max) * 100}
        className={cn("bg-gray-100 h-1.5", colorMap[color].indicator)}
      />

      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
