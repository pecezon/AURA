import React from "react";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Trash2, CheckCircle2 } from "lucide-react";
import type { QuizQuestion } from "../types";

interface QuizCardProps {
  quizzes: QuizQuestion[];
  moduleId: string;
  onAddQuestion: (moduleId: string) => void;
  onRemoveQuestion: (moduleId: string, questionId: string) => void;
  onUpdateQuestion: (moduleId: string, questionId: string, updates: Partial<QuizQuestion>) => void;
  onUpdateOption: (moduleId: string, questionId: string, optionIndex: number, value: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quizzes,
  moduleId,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onUpdateOption,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Quiz
        </CardTitle>
        <Button
          onClick={() => onAddQuestion(moduleId)}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          + Pregunta
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {quizzes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Sin preguntas.
          </p>
        ) : (
          quizzes.map((question, qIndex) => (
            <div key={question.id} className="p-3 border border-gray-200 rounded-md space-y-3 bg-gray-50">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-600">
                  Pregunta {qIndex + 1}
                </span>
                <button
                  onClick={() => onRemoveQuestion(moduleId, question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Pregunta</Label>
                <Input
                  value={question.question}
                  onChange={(e) =>
                    onUpdateQuestion(moduleId, question.id, {
                      question: e.target.value,
                    })
                  }
                  placeholder="¿Cuál es tu pregunta?"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Opciones de Respuesta</Label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === oIndex}
                      onChange={() =>
                        onUpdateQuestion(moduleId, question.id, {
                          correctAnswer: oIndex,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) =>
                        onUpdateOption(
                          moduleId,
                          question.id,
                          oIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Opción ${String.fromCharCode(65 + oIndex)}`}
                      className="text-sm flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
