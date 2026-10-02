import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedAnswer?: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
}

export const QuestionCard = ({
  question,
  options,
  selectedAnswer,
  onSelect,
  multiSelect = false,
}: QuestionCardProps) => {
  const isSelected = (value: string) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(value);
    }
    return selectedAnswer === value;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {question}
        </h2>
        {multiSelect && (
          <p className="text-lg text-muted-foreground glass inline-block px-6 py-3 rounded-full backdrop-blur-xl">
            ✨ Select all that apply
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left animate-scale-in hover-lift preserve-3d",
              isSelected(option.value)
                ? "border-primary glass-dark bg-primary/20 shadow-glow backdrop-blur-xl"
                : "glass border-white/10 backdrop-blur-xl hover:border-primary/50"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {isSelected(option.value) && (
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full gradient-hero flex items-center justify-center shadow-lg animate-scale-in">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="flex items-start gap-5">
              {option.icon && (
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {option.icon}
                </div>
              )}
              <div className="flex-1">
                <div className={cn(
                  "font-bold text-xl mb-2 transition-all",
                  isSelected(option.value) && "gradient-text"
                )}>
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </div>
                )}
              </div>
            </div>

            {/* Hover glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
              "bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
};
