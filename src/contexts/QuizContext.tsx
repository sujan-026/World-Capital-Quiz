import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.ts"; // Adjust the import path as needed

export interface Country {
  id: string;
  name: string;
  capital: string;
}

interface QuizContextType {
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  currentQuestion: {
    country: Country;
    options: string[];
    questionMode: "country-to-capital" | "capital-to-country";
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
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
  questionCount?: number;
}

export const QuizProvider = ({
  children,
  questionCount = 10,
}: QuizProviderProps) => {
  const [countriesData, setCountriesData] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuizContextType["currentQuestion"]>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [usedCountryIds, setUsedCountryIds] = useState<string[]>([]);
  const totalQuestions = Math.min(questionCount, countriesData.length);

  // Fetch data from Firestore on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "countries"));
        const countriesArray: Country[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Country, "id">),
        }));
        setCountriesData(countriesArray);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const generateNewQuestion = () => {
    // Ensure we have loaded data
    if (!countriesData.length) return;

    if (usedCountryIds.length >= totalQuestions) {
      setIsQuizComplete(true);
      return;
    }

    // Filter out used countries
    const availableCountries = countriesData.filter(
      (c) => !usedCountryIds.includes(c.id)
    );

    // Select a random country from the available ones
    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const selectedCountry = availableCountries[randomIndex];

    // Track this country as used
    setUsedCountryIds([...usedCountryIds, selectedCountry.id]);

    // Randomly determine the question mode
    const questionMode =
      Math.random() > 0.5 ? "country-to-capital" : "capital-to-country";

    // Prepare the correct answer based on the mode
    const correctAnswer =
      questionMode === "country-to-capital"
        ? selectedCountry.capital
        : selectedCountry.name;

    // Generate options: 1 correct and 3 incorrect
    let options: string[] = [correctAnswer];
    while (options.length < 4) {
      const randomCountry =
        countriesData[Math.floor(Math.random() * countriesData.length)];
      const incorrectAnswer =
        questionMode === "country-to-capital"
          ? randomCountry.capital
          : randomCountry.name;
      if (
        !options.includes(incorrectAnswer) &&
        incorrectAnswer !== correctAnswer
      ) {
        options.push(incorrectAnswer);
      }
    }

    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      country: selectedCountry,
      options,
      questionMode,
    });

    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const checkAnswer = (answer: string) => {
    if (!currentQuestion || selectedAnswer) return;

    setSelectedAnswer(answer);

    const correctAnswer =
      currentQuestion.questionMode === "country-to-capital"
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

  // Initialize the first question when countries data is loaded
  useEffect(() => {
    if (countriesData.length && !currentQuestion) {
      generateNewQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countriesData]);

  const value = {
    currentQuestionIndex,
    score,
    totalQuestions,
    selectedAnswer,
    currentQuestion,
    isCorrect,
    isQuizComplete,
    generateNewQuestion,
    checkAnswer,
    goToNextQuestion,
    restartQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
