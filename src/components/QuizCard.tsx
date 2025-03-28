
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/contexts/QuizContext';
import { Check, X } from 'lucide-react';

export const QuizCard = () => {
  const { 
    currentQuestionIndex, 
    totalQuestions, 
    currentQuestion, 
    selectedAnswer, 
    isCorrect, 
    checkAnswer, 
    goToNextQuestion 
  } = useQuiz();

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Loading question...</div>
        </CardContent>
      </Card>
    );
  }

  const { country, options, questionMode } = currentQuestion;
  const questionText = questionMode === 'country-to-capital' 
    ? `What is the capital of ${country.name}?` 
    : `Which country has ${country.capital} as its capital?`;

  const correctAnswer = questionMode === 'country-to-capital' 
    ? country.capital 
    : country.name;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-2xl font-bold">Country Capitals Quiz</CardTitle>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <CardDescription className="text-lg mt-2">{questionText}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid gap-2">
          {options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === null ? "outline" : 
                selectedAnswer === option ? 
                  (option === correctAnswer ? "default" : "destructive") : 
                  option === correctAnswer && selectedAnswer !== null ? "default" : "outline"
              }
              className={`justify-start h-auto py-4 px-4 text-left ${
                selectedAnswer === option && option === correctAnswer ? "bg-quiz-correct text-white" : 
                selectedAnswer === option && option !== correctAnswer ? "bg-quiz-incorrect text-white" : ""
              } ${selectedAnswer === null ? "hover:bg-gray-100 dark:hover:bg-gray-800" : ""}`}
              disabled={selectedAnswer !== null}
              onClick={() => checkAnswer(option)}
            >
              <div className="flex items-center w-full">
                <span className="flex-grow">{option}</span>
                {selectedAnswer === option && option === correctAnswer && (
                  <Check className="ml-2 h-5 w-5" />
                )}
                {selectedAnswer === option && option !== correctAnswer && (
                  <X className="ml-2 h-5 w-5" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
      
      {selectedAnswer && (
        <CardFooter className="flex-col items-start pt-0">
          <div className={`w-full p-3 rounded-md mt-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? (
              <div className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Correct! Well done!</span>
              </div>
            ) : (
              <div className="flex items-center">
                <X className="mr-2 h-5 w-5" />
                <span>Sorry, the correct answer is {correctAnswer}.</span>
              </div>
            )}
          </div>
          <Button className="w-full mt-4" onClick={goToNextQuestion}>
            Next Question
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
