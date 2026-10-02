export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  duration: string;
  groupSize: string;
  timeOfDay: string[];
  activityLevel: string;
  tags: string[];
  location: "dubai" | "abu_dhabi";
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswer[];
  score: number;
}
