// ============================================
// DrunkedIn — Type Definitions
// ============================================

export interface Beverage {
  name: string;
  percentage: number;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  banner?: string;
  bio: string;
  toleranceLevel: number; // 0-100
  xp: number;
  level: number;
  cheersReceived: number;
  drinkingBuddies: number;
  drinksReviewed: number;
  badges: Badge[];
  topBeverages: Beverage[];
  openToDrink: boolean;
  joinedDate: string;
  location: string;
  experience: ExperienceEntry[];
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  icon?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  hashtags: string[];
  reactions: Reactions;
  commentCount: number;
  comments: Comment[];
  timestamp: string;
  bookmarked: boolean;
}

export interface Reactions {
  cheers: number;
  smooth: number;
  strong: number;
  legendary: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  reactions: Reactions;
}

export interface Room {
  id: string;
  name: string;
  theme: string;
  description: string;
  host: User;
  participants: User[];
  maxParticipants: number;
  isLive: boolean;
  tags: string[];
  music?: string;
  scheduledTime?: string;
}

export interface Drink {
  id: string;
  name: string;
  category: DrinkCategory;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
  abv: number;
  image?: string;
  trending: boolean;
  origin: string;
}

export type DrinkCategory =
  | "Whiskey"
  | "Beer"
  | "Wine"
  | "Cocktail"
  | "Vodka"
  | "Rum"
  | "Tequila"
  | "Gin"
  | "Sake"
  | "Other";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earnedDate?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  level: number;
  change: "up" | "down" | "same";
}

export interface ConnectionSuggestion {
  user: User;
  mutualBuddies: number;
  compatibility: number;
  reason: string;
}

export interface DrinkingGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  icon: string;
  isJoined: boolean;
}

export interface BartenderMessage {
  id: string;
  role: "user" | "bartender";
  content: string;
  timestamp: string;
  drinkSuggestion?: Drink;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: User;
  quote: string;
  rating: number;
}

export type ReactionType = "cheers" | "smooth" | "strong" | "legendary";

export const REACTION_EMOJI: Record<ReactionType, string> = {
  cheers: "🍻",
  smooth: "🥃",
  strong: "💀",
  legendary: "🍷",
};
