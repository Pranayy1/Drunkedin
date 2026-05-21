// ============================================
// DrunkedIn — Supabase Database Types
// Auto-generated to match the SQL schema.
// ============================================

export interface ProfileRow {
  id: string;
  name: string;
  title: string;
  avatar: string;
  banner: string;
  bio: string;
  tolerance_level: number;
  xp: number;
  level: number;
  cheers_received: number;
  drinking_buddies: number;
  drinks_reviewed: number;
  open_to_drink: boolean;
  joined_date: string;
  location: string;
  updated_at: string;
}

export interface ExperienceEntryRow {
  id: string;
  user_id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface BeverageRow {
  id: string;
  user_id: string;
  name: string;
  percentage: number;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface PostRow {
  id: string;
  author_id: string;
  content: string;
  image: string;
  hashtags: string[];
  reactions: {
    cheers: number;
    smooth: number;
    strong: number;
    legendary: number;
  };
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  reactions: {
    cheers: number;
    smooth: number;
    strong: number;
    legendary: number;
  };
  created_at: string;
}

export interface ReactionRow {
  id: string;
  post_id: string;
  user_id: string;
  type: "cheers" | "smooth" | "strong" | "legendary";
  created_at: string;
}

export interface BookmarkRow {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface RoomRow {
  id: string;
  name: string;
  theme: string;
  description: string;
  host_id: string;
  max_participants: number;
  is_live: boolean;
  tags: string[];
  music: string;
  scheduled_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoomParticipantRow {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface DrinkRow {
  id: string;
  name: string;
  category: DrinkCategoryDB;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
  abv: number;
  image: string;
  trending: boolean;
  origin: string;
  created_at: string;
}

export type DrinkCategoryDB =
  | "Whiskey" | "Beer" | "Wine" | "Cocktail"
  | "Vodka" | "Rum" | "Tequila" | "Gin" | "Sake" | "Other";

export interface DrinkReviewRow {
  id: string;
  drink_id: string;
  user_id: string;
  rating: number;
  review: string;
  created_at: string;
}

export interface BadgeRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  created_at: string;
}

export interface UserBadgeRow {
  id: string;
  user_id: string;
  badge_id: string;
  earned_date: string;
}

export interface ConnectionRow {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "blocked";
  created_at: string;
  updated_at: string;
}

export interface DrinkingGroupRow {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  member_count: number;
  created_at: string;
}

export interface GroupMemberRow {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface BartenderMessageRow {
  id: string;
  user_id: string;
  role: "user" | "bartender";
  content: string;
  drink_suggestion_id: string | null;
  created_at: string;
}

// Joined types (for service layer responses)
export interface PostWithAuthor extends PostRow {
  profiles: Pick<ProfileRow, "id" | "name" | "title" | "avatar">;
  bookmarked?: boolean;
  user_reaction?: string | null;
}

export interface CommentWithAuthor extends CommentRow {
  profiles: Pick<ProfileRow, "id" | "name" | "title" | "avatar">;
}

export interface RoomWithParticipants extends RoomRow {
  host: Pick<ProfileRow, "id" | "name" | "title" | "avatar">;
  participants: Pick<ProfileRow, "id" | "name" | "title" | "avatar">[];
  participant_count: number;
}

export interface DrinkReviewWithAuthor extends DrinkReviewRow {
  profiles: Pick<ProfileRow, "id" | "name" | "avatar">;
}

export interface ProfileWithBadges extends ProfileRow {
  badges: (BadgeRow & { earned_date: string })[];
  experience: ExperienceEntryRow[];
  top_beverages: BeverageRow[];
}
