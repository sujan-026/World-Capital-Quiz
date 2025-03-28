
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { useQuiz } from '@/contexts/QuizContext';

export const QuizProgress = () => {
  const { currentQuestionIndex, totalQuestions } = useQuiz();
  
  // Calculate progress percentage
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Progress</span>
        <span>{currentQuestionIndex} of {totalQuestions} Questions</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};
