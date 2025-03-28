
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { countries, Country } from '@/data/countries';

interface QuizContextType {
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  currentQuestion: {
    country: Country;
    options: string[];
    questionMode: 'country-to-capital' | 'capital-to-country';
  } | null;
  isCorrect: boolean | null;
  isQuizComplete: boolean;
  generateNewQuestion: () => void;
  checkAnswer: (answer: string) => void;
  goToNextQuestion: () => void;
  restartQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
  questionCount?: number;
}

export const QuizProvider = ({ children, questionCount = 10 }: QuizProviderProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizContextType['currentQuestion']>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [questionCountState] = useState(Math.min(questionCount, countries.length));
  const [usedCountryIds, setUsedCountryIds] = useState<number[]>([]);

  const generateNewQuestion = () => {
    if (usedCountryIds.length >= questionCountState) {
      // All questions have been used
      setIsQuizComplete(true);
      return;
    }

    // Get unused countries
    const availableCountries = countries.filter(c => !usedCountryIds.includes(c.id));
    
    // Select a random country from available ones
    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const selectedCountry = availableCountries[randomIndex];
    
    // Track this country as used
    setUsedCountryIds([...usedCountryIds, selectedCountry.id]);

    // Decide question mode randomly
    const questionMode = Math.random() > 0.5 ? 'country-to-capital' : 'capital-to-country';
    
    // Generate options (1 correct, 3 incorrect)
    let options: string[] = [];
    const correctAnswer = questionMode === 'country-to-capital' 
      ? selectedCountry.capital 
      : selectedCountry.name;
    
    options.push(correctAnswer);
    
    // Add 3 incorrect options
    while (options.length < 4) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const incorrectAnswer = questionMode === 'country-to-capital' 
        ? randomCountry.capital 
        : randomCountry.name;
      
      if (!options.includes(incorrectAnswer) && incorrectAnswer !== correctAnswer) {
        options.push(incorrectAnswer);
      }
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      country: selectedCountry,
      options,
      questionMode
    });
    
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const checkAnswer = (answer: string) => {
    if (!currentQuestion || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    const correctAnswer = currentQuestion.questionMode === 'country-to-capital' 
      ? currentQuestion.country.capital 
      : currentQuestion.country.name;
    
    const answerIsCorrect = answer === correctAnswer;
    setIsCorrect(answerIsCorrect);
    
    if (answerIsCorrect) {
      setScore(score + 1);
    }
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    generateNewQuestion();
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsQuizComplete(false);
    setUsedCountryIds([]);
    generateNewQuestion();
  };

  // Initialize the first question
  React.useEffect(() => {
    generateNewQuestion();
  }, []);

  const value = {
    currentQuestionIndex,
    score,
    totalQuestions: questionCountState,
    selectedAnswer,
    currentQuestion,
    isCorrect,
    isQuizComplete,
    generateNewQuestion,
    checkAnswer,
    goToNextQuestion,
    restartQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
