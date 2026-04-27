import { useState, useEffect } from 'react';

export function useCourseProgress(profileId: string, courseId: string) {
  const key = `aura_completed_modules_${profileId}_${courseId}`;

  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Cargar estado inicial
  useEffect(() => {
    if (!profileId || !courseId) return;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setCompletedModules(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, [key, profileId, courseId]);

  const markModuleAsCompleted = (moduleId: string) => {
    setCompletedModules(prev => {
      if (prev.includes(moduleId)) return prev; // Ya estaba completado
      const newCompleted = [...prev, moduleId];
      localStorage.setItem(key, JSON.stringify(newCompleted));
      return newCompleted;
    });
  };

  const isModuleCompleted = (moduleId: string) => {
    return completedModules.includes(moduleId);
  };

  const getProgressPercentage = (totalModules: number) => {
    if (totalModules === 0) return 0;
    return Math.round((completedModules.length / totalModules) * 100);
  };

  return {
    completedModules,
    markModuleAsCompleted,
    isModuleCompleted,
    getProgressPercentage
  };
}
