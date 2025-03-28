
import React from 'react';
import { useQuiz } from '@/contexts/QuizContext';

export const QuizScore = () => {
  const { score, totalQuestions } = useQuiz();
  
  return (
    <div className="flex items-center justify-center gap-2 font-medium">
      <span>Score:</span>
      <span className="text-quiz-primary font-bold">{score}</span>
      <span>/</span>
      <span>{totalQuestions}</span>
    </div>
  );
};
