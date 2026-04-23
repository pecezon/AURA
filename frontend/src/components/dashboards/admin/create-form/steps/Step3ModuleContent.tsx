import React from "react";
import { Button } from "../../../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ModuleData } from "../types";
import { ModuleInfoCard } from "../components/ModuleInfoCard";
import { ContentItemsCard } from "../components/ContentItemsCard";
import { QuizCard } from "../components/QuizCard";
import { SimulationCard } from "../components/SimulationCard";

interface Step3Props {
  currentModule: ModuleData;
  onUpdateModule: (moduleId: string, updates: Partial<ModuleData>) => void;
  onAddContentItem: (moduleId: string, type: "lectura" | "video" | "imagen") => void;
  onRemoveContentItem: (moduleId: string, itemId: string) => void;
  onUpdateContentItem: (moduleId: string, itemId: string, updates: any) => void;
  onAddQuizQuestion: (moduleId: string) => void;
  onRemoveQuizQuestion: (moduleId: string, questionId: string) => void;
  onUpdateQuizQuestion: (moduleId: string, questionId: string, updates: any) => void;
  onUpdateQuizOption: (moduleId: string, questionId: string, optionIndex: number, value: string) => void;
  onAddSimulation: (moduleId: string) => void;
  onRemoveSimulation: (moduleId: string) => void;
  onUpdateSimulation: (moduleId: string, updates: any) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Step3ModuleContent: React.FC<Step3Props> = ({
  currentModule,
  onUpdateModule,
  onAddContentItem,
  onRemoveContentItem,
  onUpdateContentItem,
  onAddQuizQuestion,
  onRemoveQuizQuestion,
  onUpdateQuizQuestion,
  onUpdateQuizOption,
  onAddSimulation,
  onRemoveSimulation,
  onUpdateSimulation,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <ModuleInfoCard
        title={currentModule.title}
        onTitleChange={(title) => onUpdateModule(currentModule.id, { title })}
      />

      <ContentItemsCard
        contentItems={currentModule.contentItems}
        moduleId={currentModule.id}
        onAddContentItem={onAddContentItem}
        onRemoveContentItem={onRemoveContentItem}
        onUpdateContentItem={onUpdateContentItem}
      />

      <QuizCard
        quizzes={currentModule.quizzes}
        moduleId={currentModule.id}
        onAddQuestion={onAddQuizQuestion}
        onRemoveQuestion={onRemoveQuizQuestion}
        onUpdateQuestion={onUpdateQuizQuestion}
        onUpdateOption={onUpdateQuizOption}
      />

      <SimulationCard
        simulation={currentModule.simulation}
        moduleId={currentModule.id}
        onAddSimulation={onAddSimulation}
        onRemoveSimulation={onRemoveSimulation}
        onUpdateSimulation={onUpdateSimulation}
      />

      <div className="flex justify-between gap-3">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </Button>
        <Button
          onClick={onNext}
          className="gap-2"
        >
          Listo
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
