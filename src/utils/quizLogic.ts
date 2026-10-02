import { Package } from "@/types/quiz";
import { packages } from "@/data/packages";

interface ScoreMap {
  [key: string]: number;
}

export const calculateRecommendations = (answers: any[]): Package[] => {
  const scores: ScoreMap = {};

  // Initialize scores
  packages.forEach(pkg => {
    scores[pkg.id] = 0;
  });

  // Find answers
  const experienceType = answers.find(a => a.questionId === "experience")?.answer;
  const timePreference = answers.find(a => a.questionId === "time")?.answer;
  const groupSize = answers.find(a => a.questionId === "group")?.answer;
  const budget = answers.find(a => a.questionId === "budget")?.answer;
  const interests = answers.find(a => a.questionId === "interests")?.answer || [];

  packages.forEach(pkg => {
    // Match category with experience type - EXACT MATCH gets more points
    if (experienceType === "adventure" && pkg.category === "adventure") {
      scores[pkg.id] += 40;
    } else if (experienceType === "adventure" && pkg.activityLevel === "high") {
      scores[pkg.id] += 15; // Partial match for high activity
    }
    
    if (experienceType === "culture" && pkg.category === "sightseeing") {
      scores[pkg.id] += 40;
    } else if (experienceType === "culture" && pkg.tags.includes("cultural")) {
      scores[pkg.id] += 25;
    }
    
    if (experienceType === "relaxation" && pkg.category === "relaxation") {
      scores[pkg.id] += 40;
    } else if (experienceType === "relaxation" && pkg.activityLevel === "low") {
      scores[pkg.id] += 15;
    }
    
    if (experienceType === "family" && pkg.category === "family") {
      scores[pkg.id] += 40;
    } else if (experienceType === "family" && pkg.tags.includes("kids-friendly")) {
      scores[pkg.id] += 25;
    }

    // Match time preference - EXACT MATCH for specific times
    if (timePreference === "full-day" && pkg.timeOfDay.includes("full-day")) {
      scores[pkg.id] += 30;
    } else if (timePreference && timePreference !== "full-day" && pkg.timeOfDay.includes(timePreference)) {
      scores[pkg.id] += 30;
    } else if (timePreference && pkg.timeOfDay.includes("any")) {
      scores[pkg.id] += 10; // Small bonus for flexible packages
    }

    // Match group size - PRIORITIZE exact matches, penalize mismatches
    if (groupSize === "solo" && pkg.groupSize === "any") {
      scores[pkg.id] += 15;
    } else if (groupSize === "solo" && pkg.groupSize !== "any") {
      scores[pkg.id] -= 5; // Small penalty for group-specific packages
    }
    
    if (groupSize === "couple" && pkg.groupSize === "couple") {
      scores[pkg.id] += 25; // Strong preference for romantic packages
    } else if (groupSize === "couple" && pkg.tags.includes("romantic")) {
      scores[pkg.id] += 20;
    } else if (groupSize === "couple" && pkg.groupSize === "any") {
      scores[pkg.id] += 12;
    }
    
    if (groupSize === "small" && (pkg.groupSize === "small" || pkg.groupSize === "any")) {
      scores[pkg.id] += 18;
    }
    
    if (groupSize === "large" && pkg.groupSize === "any") {
      scores[pkg.id] += 15;
    }
    
    if (groupSize === "private" && pkg.groupSize === "private") {
      scores[pkg.id] += 35; // Strong preference for private experiences
    } else if (groupSize === "private" && pkg.tags.includes("luxury")) {
      scores[pkg.id] += 15;
    }

    // Match budget - REWARD exact matches, PENALIZE wrong budget ranges
    const priceDiff = Math.abs(pkg.price - (
      budget === "budget" ? 150 :
      budget === "mid-range" ? 350 :
      budget === "premium" ? 750 :
      1500
    ));
    
    if (budget === "budget" && pkg.price <= 200) {
      scores[pkg.id] += 30;
    } else if (budget === "budget" && pkg.price > 500) {
      scores[pkg.id] -= 15; // Penalize expensive packages for budget users
    }
    
    if (budget === "mid-range" && pkg.price > 200 && pkg.price <= 500) {
      scores[pkg.id] += 30;
    } else if (budget === "mid-range" && (pkg.price <= 150 || pkg.price > 1000)) {
      scores[pkg.id] -= 10;
    }
    
    if (budget === "premium" && pkg.price > 500 && pkg.price <= 1000) {
      scores[pkg.id] += 30;
    } else if (budget === "premium" && pkg.price < 300) {
      scores[pkg.id] -= 10;
    }
    
    if (budget === "luxury" && pkg.price > 1000) {
      scores[pkg.id] += 30;
    } else if (budget === "luxury" && pkg.category === "luxury") {
      scores[pkg.id] += 20;
    } else if (budget === "luxury" && pkg.price < 500) {
      scores[pkg.id] -= 15; // Strong penalty for budget packages when seeking luxury
    }

    // Match interests/tags - STRONG BONUS for matching specific interests
    if (Array.isArray(interests)) {
      let interestMatches = 0;
      interests.forEach((interest: string) => {
        if (pkg.tags.includes(interest)) {
          interestMatches++;
          scores[pkg.id] += 15; // Increased from 10 to 15
        }
      });
      
      // Bonus for packages matching multiple interests
      if (interestMatches >= 2) {
        scores[pkg.id] += 10;
      }
      if (interestMatches >= 3) {
        scores[pkg.id] += 15;
      }
    }
  });

  // Sort packages by score and return top 6
  const sortedPackages = packages
    .map(pkg => ({ ...pkg, score: scores[pkg.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return sortedPackages;
};

export const getBadge = (score: number): { title: string; icon: string; color: string } => {
  if (score >= 5) {
    return {
      title: "Adventure Seeker",
      icon: "🏆",
      color: "text-accent",
    };
  } else if (score >= 4) {
    return {
      title: "Desert Explorer",
      icon: "⭐",
      color: "text-primary",
    };
  } else if (score >= 3) {
    return {
      title: "Culture Enthusiast",
      icon: "🎭",
      color: "text-primary",
    };
  } else {
    return {
      title: "Travel Dreamer",
      icon: "✨",
      color: "text-primary",
    };
  }
};
