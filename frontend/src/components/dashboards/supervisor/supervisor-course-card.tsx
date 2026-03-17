import React from "react";
import { Badge } from "../../ui/badge";
import { StatProgressBar } from "../stat-progress-bar";

interface SupervisorCourseCardProps {
  title: string;
  regulations?: Array<string>;
  type: string;
  progress: number;
}

export const SupervisorCourseCard: React.FC<SupervisorCourseCardProps> = ({
  title,
  regulations,
  type,
  progress,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 border border-gray-300 bg-white rounded-lg overflow-hidden w-full hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 md:gap-0">
          <h4 className="font-medium text-black md:text-lg">{title}</h4>
        </div>
        <div className="flex gap-1 flex-wrap">
          <Badge variant={type === "Técnico" ? "default" : "secondary"}>
            {type}
          </Badge>
          {regulations &&
            regulations.map((reg) => (
              <Badge key={reg} variant="outline">
                {reg}
              </Badge>
            ))}
        </div>
      </div>

      {/* Progress & Buttons */}
      <StatProgressBar
        label="Progreso Promedio"
        value={progress}
        max={100}
        percentage={true}
      />
    </div>
  );
};

export default SupervisorCourseCard;
