
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/contexts/QuizContext';
import { Trophy } from 'lucide-react';

export const QuizComplete = () => {
  const { score, totalQuestions, restartQuiz } = useQuiz();
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = '';
  if (percentage >= 90) {
    message = "Excellent! You're a geography expert!";
  } else if (percentage >= 70) {
    message = "Great job! Your knowledge of world capitals is impressive!";
  } else if (percentage >= 50) {
    message = "Good effort! You know your capitals pretty well!";
  } else {
    message = "Keep learning! You'll get better with practice!";
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-pulse-once">
      <CardHeader className="text-center">
        <div className="mx-auto bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="text-4xl font-bold mb-2 text-quiz-primary">
          {score} / {totalQuestions}
        </div>
        <div className="text-lg mb-4">
          You scored {percentage}%
        </div>
        <div className="text-gray-600">
          {message}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={restartQuiz}>
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
};
