import React from "react";
import { Badge } from "./ui/badge";
import { Clock, BadgeCheck, Play } from "lucide-react";
import { StatProgressBar } from "./stat-progress-bar";
import { Button } from "./ui/button";

interface CourseCardProps {
  title: string;
  description: string;
  regulations?: Array<string>;
  type: string;
  duration: string;
  progress: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  regulations,
  type,
  duration,
  progress,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 border border-gray-300 bg-white rounded-lg overflow-hidden w-full hover:shadow-lg transition-shadow duration-300 min-h-[200px]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 md:gap-0">
          <div className="flex items-center gap-3">
            <h4 className="font-medium md:text-lg">{title}</h4>
            {progress === 100 && <BadgeCheck className="text-green-500" />}
          </div>

          <p className="text-sm md:text-base text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          <Badge variant={type === "Técnico" ? "default" : "secondary"}>
            {type}
          </Badge>
          <Badge variant="outline">
            <Clock data-icon="inline-start" />
            {duration}
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
      <div className="flex flex-col gap-4">
        <StatProgressBar
          label="Progreso"
          value={progress}
          max={100}
          percentage={true}
        />
        <div className="flex w-full gap-4 justify-between flex-wrap">
          <Button className="w-full md:flex-1 cursor-pointer">
            {(() => {
              switch (progress) {
                case 100:
                  return "Revisar Curso";
                case 0:
                  return "Iniciar Curso";
                default:
                  return "Continuar Curso";
              }
            })()}
          </Button>
          <Button variant="outline" className="w-full md:w-auto cursor-pointer">
            <Play className="w-4 h-4" />
            Iniciar Simulación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
