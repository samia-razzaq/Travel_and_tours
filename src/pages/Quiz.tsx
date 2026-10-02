import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "@/components/QuizProgress";
import { QuestionCard } from "@/components/QuestionCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QuizAnswer } from "@/types/quiz";

const questions = [
  {
    id: "experience",
    question: "What type of experience are you looking for?",
    options: [
      {
        value: "adventure",
        label: "Adventure & Thrill",
        icon: "🏜️",
        description: "Dune bashing, buggy rides, extreme activities",
      },
      {
        value: "culture",
        label: "Culture & Sightseeing",
        icon: "🕌",
        description: "City tours, historical sites, local experiences",
      },
      {
        value: "relaxation",
        label: "Relaxation & Leisure",
        icon: "🌅",
        description: "Cruises, sunset views, peaceful activities",
      },
      {
        value: "family",
        label: "Family Fun",
        icon: "👨‍👩‍👧‍👦",
        description: "Kid-friendly activities, theme parks, safe adventures",
      },
    ],
  },
  {
    id: "time",
    question: "When would you prefer to explore?",
    options: [
      {
        value: "morning",
        label: "Morning",
        icon: "🌄",
        description: "Start your day with adventure (6 AM - 12 PM)",
      },
      {
        value: "afternoon",
        label: "Afternoon",
        icon: "☀️",
        description: "Mid-day exploration (12 PM - 5 PM)",
      },
      {
        value: "evening",
        label: "Evening",
        icon: "🌆",
        description: "Sunset experiences (5 PM - 11 PM)",
      },
      {
        value: "full-day",
        label: "Full Day",
        icon: "🌞",
        description: "All-day immersive experience",
      },
    ],
  },
  {
    id: "group",
    question: "Who will be joining you?",
    options: [
      {
        value: "solo",
        label: "Solo Traveler",
        icon: "🧳",
        description: "Just me, exploring independently",
      },
      {
        value: "couple",
        label: "Couple",
        icon: "💑",
        description: "Romantic experience for two",
      },
      {
        value: "small",
        label: "Small Group",
        icon: "👥",
        description: "3-5 people - friends or family",
      },
      {
        value: "large",
        label: "Large Group",
        icon: "👨‍👩‍👧‍👦",
        description: "6+ people - big celebration",
      },
      {
        value: "private",
        label: "Private Experience",
        icon: "⭐",
        description: "Exclusive tour just for us",
      },
    ],
  },
  {
    id: "budget",
    question: "What's your budget per person?",
    options: [
      {
        value: "budget",
        label: "Budget-Friendly",
        icon: "💰",
        description: "100-200 AED - Great value options",
      },
      {
        value: "mid-range",
        label: "Mid-Range",
        icon: "💵",
        description: "200-500 AED - Quality experiences",
      },
      {
        value: "premium",
        label: "Premium",
        icon: "💎",
        description: "500-1000 AED - Enhanced experiences",
      },
      {
        value: "luxury",
        label: "Luxury",
        icon: "👑",
        description: "1000+ AED - Ultimate VIP treatment",
      },
    ],
  },
  {
    id: "interests",
    question: "What specific activities interest you?",
    multiSelect: true,
    options: [
      { value: "dune-bashing", label: "Dune Bashing", icon: "🚙" },
      { value: "quad-biking", label: "Quad Biking", icon: "🏍️" },
      { value: "camel-ride", label: "Camel Riding", icon: "🐪" },
      { value: "sandboarding", label: "Sandboarding", icon: "🏂" },
      { value: "cruise", label: "Boat Cruise", icon: "⛵" },
      { value: "cultural", label: "Cultural Shows", icon: "🎭" },
      { value: "dinner", label: "Traditional Dinner", icon: "🍽️" },
      { value: "city-tour", label: "City Landmarks", icon: "🏛️" },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentStep - 1];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const handleAnswer = (value: string) => {
    if (currentQuestion.multiSelect) {
      const currentValues = (currentAnswer?.answer as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
        return [...filtered, { questionId: currentQuestion.id, answer: newValues }];
      });
    } else {
      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
        return [...filtered, { questionId: currentQuestion.id, answer: value }];
      });
      
      // Auto-advance for single-select questions
      if (currentStep < questions.length) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setScore(prev => prev + 1);
        }, 300);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
      if (currentAnswer) {
        setScore(prev => prev + 1);
      }
    } else {
      // Quiz complete - navigate to results
      navigate("/results", { state: { answers, score } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/");
    }
  };

  const canProceed = currentQuestion.multiSelect
    ? (currentAnswer?.answer as string[])?.length > 0
    : !!currentAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <QuizProgress
          currentStep={currentStep}
          totalSteps={questions.length}
          score={score}
        />

        <QuestionCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedAnswer={currentAnswer?.answer}
          onSelect={handleAnswer}
          multiSelect={currentQuestion.multiSelect}
        />

        <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="xl"
            onClick={handleBack}
            className="glass backdrop-blur-xl hover-lift"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          {currentQuestion.multiSelect && (
            <Button
              variant="hero"
              size="xl"
              onClick={handleNext}
              disabled={!canProceed}
              className="shadow-glow hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length ? "See Results ✨" : "Next"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
