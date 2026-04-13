import type { ReactNode } from "react";

export default function LoginCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg flex flex-row items-center gap-4">
      <div className="shrink-0">{icon}</div>

      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}
