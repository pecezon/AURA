import { useState } from "react";
import type {
  CreateFormData,
  ModuleData,
  ContentItem,
  QuizQuestion,
  SimulationData,
  Step,
} from "./types";

export const useCreateForm = () => {
  const [formData, setFormData] = useState<CreateFormData>({
    courseTitle: "",
    courseDescription: "",
    modules: [],
  });

  const [currentStep, setCurrentStep] = useState<Step>("courseInfo");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Course handlers
  const handleCourseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Module handlers
  const addModule = () => {
    const newModule: ModuleData = {
      id: Date.now().toString(),
      title: "",
      contentItems: [],
      quizzes: [],
    };
    setFormData((prev) => ({ ...prev, modules: [...prev.modules, newModule] }));
    setActiveModule(newModule.id);
    setCurrentStep("moduleContent");
  };

  const removeModule = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
    if (activeModule === moduleId) {
      setActiveModule(null);
    }
  };

  const updateModule = (moduleId: string, updates: Partial<ModuleData>) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, ...updates } : m
      ),
    }));
  };

  const selectModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setCurrentStep("moduleContent");
  };

  // Content handlers
  const addContentItem = (
    moduleId: string,
    type: "lectura" | "video" | "imagen"
  ) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type,
      title: "",
      content: "",
      order: 0,
    };
    updateModule(moduleId, {
      contentItems: [
        ...(formData.modules.find((m) => m.id === moduleId)?.contentItems || []),
        newItem,
      ],
    });
  };

  const removeContentItem = (moduleId: string, itemId: string) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        contentItems: module.contentItems.filter((item) => item.id !== itemId),
      });
    }
  };

  const updateContentItem = (
    moduleId: string,
    itemId: string,
    updates: Partial<ContentItem>
  ) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        contentItems: module.contentItems.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      });
    }
  };

  // Quiz handlers
  const addQuizQuestion = (moduleId: string) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", ""],
      correctAnswer: 0,
    };
    updateModule(moduleId, {
      quizzes: [
        ...(formData.modules.find((m) => m.id === moduleId)?.quizzes || []),
        newQuestion,
      ],
    });
  };

  const removeQuizQuestion = (moduleId: string, questionId: string) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        quizzes: module.quizzes.filter((q) => q.id !== questionId),
      });
    }
  };

  const updateQuizQuestion = (
    moduleId: string,
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        quizzes: module.quizzes.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      });
    }
  };

  const updateQuizOption = (
    moduleId: string,
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module) {
      const question = module.quizzes.find((q) => q.id === questionId);
      if (question) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        updateQuizQuestion(moduleId, questionId, { options: newOptions });
      }
    }
  };

  // Simulation handlers
  const addSimulation = (moduleId: string) => {
    updateModule(moduleId, {
      simulation: {
        title: "",
        instructions: "",
        minScore: 70,
      },
    });
  };

  const removeSimulation = (moduleId: string) => {
    updateModule(moduleId, { simulation: undefined });
  };

  const updateSimulation = (
    moduleId: string,
    updates: Partial<SimulationData>
  ) => {
    const module = formData.modules.find((m) => m.id === moduleId);
    if (module?.simulation) {
      updateModule(moduleId, {
        simulation: { ...module.simulation, ...updates },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { //ADD THE TANSTACK LOGIC HERE
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("Datos del curso:", formData);
      alert("Curso creado exitosamente");
      setFormData({
        courseTitle: "",
        courseDescription: "",
        modules: [],
      });
      setCurrentStep("courseInfo");
      setActiveModule(null);
    } catch (error) {
      console.error("Error al crear curso:", error);
      alert("Error al crear el curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      courseTitle: "",
      courseDescription: "",
      modules: [],
    });
    setCurrentStep("courseInfo");
    setActiveModule(null);
  };

  const currentModule = formData.modules.find((m) => m.id === activeModule);

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    activeModule,
    setActiveModule,
    isSubmitting,
    setIsSubmitting,
    currentModule,
    // Course
    handleCourseInputChange,
    // Modules
    addModule,
    removeModule,
    updateModule,
    selectModule,
    // Content
    addContentItem,
    removeContentItem,
    updateContentItem,
    // Quiz
    addQuizQuestion,
    removeQuizQuestion,
    updateQuizQuestion,
    updateQuizOption,
    // Simulation
    addSimulation,
    removeSimulation,
    updateSimulation,
    // Submit
    handleSubmit,
    resetForm,
  };
};
