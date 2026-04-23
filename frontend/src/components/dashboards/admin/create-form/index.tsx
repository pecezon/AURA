import React from "react";
import { useCreateForm } from "./useCreateForm";
import { Step1CourseInfo } from "./steps/Step1CourseInfo";
import { Step2Modules } from "./steps/Step2Modules";
import { Step3ModuleContent } from "./steps/Step3ModuleContent";
import { Step4Review } from "./steps/Step4Review";

export const CreateForm: React.FC = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    currentModule,
    isSubmitting,
    handleCourseInputChange,
    addModule,
    removeModule,
    selectModule,
    updateModule,
    addContentItem,
    removeContentItem,
    updateContentItem,
    addQuizQuestion,
    removeQuizQuestion,
    updateQuizQuestion,
    updateQuizOption,
    addSimulation,
    removeSimulation,
    updateSimulation,
    handleSubmit,
  } = useCreateForm();

  return (
    <div className="w-full space-y-6">
      {/* Step 1: Course Information */}
      {currentStep === "courseInfo" && (
        <Step1CourseInfo
          formData={formData}
          onCourseInputChange={handleCourseInputChange}
          onNext={() => setCurrentStep("modules")}
        />
      )}

      {/* Step 2: Modules */}
      {currentStep === "modules" && (
        <Step2Modules
          modules={formData.modules}
          onAddModule={addModule}
          onSelectModule={selectModule}
          onRemoveModule={removeModule}
          onPrevious={() => setCurrentStep("courseInfo")}
          onNext={() => setCurrentStep("review")}
        />
      )}

      {/* Step 3: Module Content */}
      {currentStep === "moduleContent" && currentModule && (
        <Step3ModuleContent
          currentModule={currentModule}
          onUpdateModule={updateModule}
          onAddContentItem={addContentItem}
          onRemoveContentItem={removeContentItem}
          onUpdateContentItem={updateContentItem}
          onAddQuizQuestion={addQuizQuestion}
          onRemoveQuizQuestion={removeQuizQuestion}
          onUpdateQuizQuestion={updateQuizQuestion}
          onUpdateQuizOption={updateQuizOption}
          onAddSimulation={addSimulation}
          onRemoveSimulation={removeSimulation}
          onUpdateSimulation={updateSimulation}
          onPrevious={() => setCurrentStep("modules")}
          onNext={() => setCurrentStep("modules")}
        />
      )}

      {/* Step 4: Review */}
      {currentStep === "review" && (
        <Step4Review
          formData={formData}
          onPrevious={() => setCurrentStep("modules")}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
