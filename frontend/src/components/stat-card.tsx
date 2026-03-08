import React from "react";

interface StatCardProps {
  label: string;
  stat: React.ReactNode;
  icon?: React.ReactNode;
  gradientColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  stat,
  icon,
  gradientColor,
}) => {
  return (
    <div
      className={`group rounded-lg p-[1px] bg-gray-200 hover:bg-gradient-to-r ${gradientColor} bg-[length:200%_200%] transition-all duration-500 hover:bg-right`}
    >
      <div className="w-full min-h-[100px] md:min-h-[150px] bg-white rounded-lg shadow p-4 flex flex-col items-start justify-between gap-4 md:p-6 cursor-pointer transition-shadow hover:shadow-md">
        <p className="text-gray-600 text-md md:text-lg">{label}</p>

        <div className="flex gap-3 text-2xl font-semibold items-center md:text-4xl">
          {icon && <div>{icon}</div>}
          {stat && <div>{stat}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
