
import React from 'react';
import { QuizProvider } from '@/contexts/QuizContext';
import { QuizCard } from '@/components/QuizCard';
import { QuizProgress } from '@/components/QuizProgress';
import { QuizScore } from '@/components/QuizScore';
import { QuizComplete } from '@/components/QuizComplete';
import { useQuiz } from '@/contexts/QuizContext';

// This component accesses the QuizContext
const QuizContent = () => {
  const { isQuizComplete } = useQuiz();
  
  return (
    <div className="p-4 md:p-8">
      {isQuizComplete ? (
        <QuizComplete />
      ) : (
        <>
          <div className="mb-6">
            <QuizProgress />
            <QuizScore />
          </div>
          <QuizCard />
        </>
      )}
    </div>
  );
};

// This component provides the QuizContext
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl pt-8 pb-16">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-quiz-primary mb-2">
            World Capitals Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your knowledge of countries and their capitals!
          </p>
        </header>

        <QuizProvider questionCount={10}>
          <QuizContent />
        </QuizProvider>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>© 2025 Country Capitals Quizzer | Test Your Geography Knowledge</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
