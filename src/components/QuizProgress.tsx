import { Trophy } from "lucide-react";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  score: number;
}

export const QuizProgress = ({ currentStep, totalSteps, score }: QuizProgressProps) => {
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentStep} of {totalSteps}
        </span>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">
            {score} points
          </span>
        </div>
      </div>
      
      <div className="h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full gradient-hero transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
