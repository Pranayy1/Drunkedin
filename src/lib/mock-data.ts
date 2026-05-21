import type { User, Post, Room, Drink, Badge, LeaderboardEntry, ConnectionSuggestion, DrinkingGroup, BartenderMessage, Testimonial } from "@/types";

// ============================================
// Users
// ============================================
export const currentUser: User = {
  id: "u1",
  name: "Alex Barrel",
  title: "Senior Whiskey Architect",
  avatar: "",
  banner: "",
  bio: "Crafting bourbon experiences since 2015. Specialist in single-malt infrastructure and cocktail microservices. Open to drink.",
  toleranceLevel: 78,
  xp: 12450,
  level: 24,
  cheersReceived: 3842,
  drinkingBuddies: 512,
  drinksReviewed: 187,
  badges: [],
  topBeverages: [],
  openToDrink: true,
  joinedDate: "2021-03-15",
  location: "Manhattan, NY",
  experience: [
    { id: "e1", title: "Senior Whiskey Architect", company: "BourbonTech Inc.", period: "2023 - Present", description: "Leading the single-malt division. Architected a 12-year aged solution.", icon: "🥃" },
    { id: "e2", title: "Cocktail Engineer", company: "MixologyLabs", period: "2021 - 2023", description: "Built scalable cocktail delivery pipelines. Reduced hangover latency by 40%.", icon: "🍸" },
    { id: "e3", title: "Junior Beer Tester", company: "HopStack Studios", period: "2019 - 2021", description: "Quality assurance across 200+ craft beer deployments.", icon: "🍺" },
  ],
};

export const users: User[] = [
  currentUser,
  { id: "u2", name: "Maya Hops", title: "Beer Stack Developer", avatar: "", bio: "Full-stack beer enthusiast. IPA specialist.", toleranceLevel: 65, xp: 9800, level: 19, cheersReceived: 2150, drinkingBuddies: 340, drinksReviewed: 142, badges: [], topBeverages: [], openToDrink: true, joinedDate: "2022-01-10", location: "Portland, OR", experience: [], banner: "" },
  { id: "u3", name: "Viktor Stoli", title: "Certified Vodka Engineer", avatar: "", bio: "Precision-engineered vodka solutions. Clean code, clean spirits.", toleranceLevel: 92, xp: 15200, level: 28, cheersReceived: 4500, drinkingBuddies: 620, drinksReviewed: 230, badges: [], topBeverages: [], openToDrink: false, joinedDate: "2020-06-20", location: "Moscow, Russia", experience: [], banner: "" },
  { id: "u4", name: "Rosé Martinez", title: "RumOps Specialist", avatar: "", bio: "Deploying rum-based solutions at scale. Caribbean infrastructure expert.", toleranceLevel: 71, xp: 8700, level: 17, cheersReceived: 1890, drinkingBuddies: 280, drinksReviewed: 98, badges: [], topBeverages: [], openToDrink: true, joinedDate: "2022-07-05", location: "Havana, Cuba", experience: [], banner: "" },
  { id: "u5", name: "James Neat", title: "Cocktail Product Manager", avatar: "", bio: "Managing the cocktail roadmap. Q4 target: 500 new recipes.", toleranceLevel: 55, xp: 7200, level: 14, cheersReceived: 1200, drinkingBuddies: 195, drinksReviewed: 76, badges: [], topBeverages: [], openToDrink: true, joinedDate: "2023-02-14", location: "London, UK", experience: [], banner: "" },
  { id: "u6", name: "Sakura Sake", title: "Sake DevOps Lead", avatar: "", bio: "Automating sake brewing pipelines. CI/CD for fermentation.", toleranceLevel: 60, xp: 11000, level: 22, cheersReceived: 3100, drinkingBuddies: 410, drinksReviewed: 165, badges: [], topBeverages: [], openToDrink: true, joinedDate: "2021-09-01", location: "Kyoto, Japan", experience: [], banner: "" },
  { id: "u7", name: "Barley McFoam", title: "Chief Brewing Officer", avatar: "", bio: "From garage brewer to CBO. 15 years of hop engineering.", toleranceLevel: 88, xp: 18500, level: 32, cheersReceived: 5200, drinkingBuddies: 780, drinksReviewed: 312, badges: [], topBeverages: [], openToDrink: false, joinedDate: "2019-01-01", location: "Munich, Germany", experience: [], banner: "" },
  { id: "u8", name: "Tequila Sunrise", title: "Agave Solutions Architect", avatar: "", bio: "Building tequila microservices. Worm-driven development advocate.", toleranceLevel: 74, xp: 10200, level: 20, cheersReceived: 2800, drinkingBuddies: 350, drinksReviewed: 145, badges: [], topBeverages: [], openToDrink: true, joinedDate: "2021-05-20", location: "Jalisco, Mexico", experience: [], banner: "" },
];

// ============================================
// Posts
// ============================================
export const posts: Post[] = [
  { id: "p1", author: users[1], content: "Just deployed a new IPA to production. Zero downtime. Zero sobriety. The hops-to-malt ratio is perfectly optimized for maximum flavor throughput. 🍺 #BeerEngineering #CraftBeer", image: "", hashtags: ["BeerEngineering", "CraftBeer"], reactions: { cheers: 142, smooth: 38, strong: 12, legendary: 5 }, commentCount: 23, comments: [], timestamp: "2h ago", bookmarked: false },
  { id: "p2", author: users[2], content: "Thrilled to announce I've been promoted to Principal Vodka Engineer! After 3 years of distilling clean, efficient spirits, the board finally recognized my contributions. Special thanks to my mentor who taught me that the best code — like the best vodka — should be crystal clear. 🥂", hashtags: ["Promotion", "VodkaEngineering"], reactions: { cheers: 523, smooth: 89, strong: 45, legendary: 67 }, commentCount: 87, comments: [], timestamp: "5h ago", bookmarked: true },
  { id: "p3", author: users[3], content: "Hot take: Dark rum > Light rum for production environments. The complexity and depth provide better long-term stability. Fight me. 🥃 #RumOps #HotTake", hashtags: ["RumOps", "HotTake"], reactions: { cheers: 89, smooth: 156, strong: 78, legendary: 23 }, commentCount: 156, comments: [], timestamp: "8h ago", bookmarked: false },
  { id: "p4", author: users[4], content: "Just wrapped up our quarterly cocktail review. Key metrics:\n\n📊 Drinks shipped: 1,247\n🍹 Customer satisfaction: 94%\n🎯 Hangover rate: Down 23% QoQ\n\nProud of the team! Next quarter we're scaling our Margarita pipeline.", hashtags: ["QuarterlyReview", "CocktailManagement"], reactions: { cheers: 234, smooth: 67, strong: 12, legendary: 34 }, commentCount: 45, comments: [], timestamp: "12h ago", bookmarked: false },
  { id: "p5", author: users[6], content: "15 years ago I brewed my first beer in a garage. Today, I'm leading a team of 50 brewing engineers. The secret? Never stop fermenting. Never stop learning. And always — ALWAYS — trust the yeast. 🍺✨ #BrewingJourney", hashtags: ["BrewingJourney", "Leadership"], reactions: { cheers: 892, smooth: 234, strong: 89, legendary: 156 }, commentCount: 203, comments: [], timestamp: "1d ago", bookmarked: true },
];

// ============================================
// Rooms
// ============================================
export const rooms: Room[] = [
  { id: "r1", name: "Whiskey Wednesday", theme: "🥃 Weekly Tasting", description: "Our legendary weekly whiskey tasting session. This week: Japanese single malts.", host: users[0], participants: users.slice(0, 5), maxParticipants: 12, isLive: true, tags: ["Whiskey", "Tasting", "Weekly"], music: "Lo-fi Jazz" },
  { id: "r2", name: "Beer Code Review", theme: "🍺 Craft & Code", description: "Review code while reviewing craft beers. Two birds, one pint.", host: users[1], participants: users.slice(1, 4), maxParticipants: 8, isLive: true, tags: ["Beer", "Coding", "Social"], music: "Indie Rock" },
  { id: "r3", name: "Cocktail Innovation Lab", theme: "🍸 Experimental", description: "Pushing the boundaries of mixology. Tonight: molecular cocktails.", host: users[4], participants: users.slice(3, 6), maxParticipants: 10, isLive: false, tags: ["Cocktails", "Innovation"], scheduledTime: "Tomorrow 8PM" },
  { id: "r4", name: "Wine & Unwind", theme: "🍷 Relaxation", description: "End-of-week wine session. No shop talk, just grape therapy.", host: users[5], participants: users.slice(2, 7), maxParticipants: 15, isLive: true, tags: ["Wine", "Chill", "Friday"], music: "Classical" },
  { id: "r5", name: "Sake Ceremony", theme: "🍶 Traditional", description: "Learn the art of traditional sake service. Cultural deep dive.", host: users[5], participants: users.slice(0, 3), maxParticipants: 6, isLive: false, tags: ["Sake", "Culture", "Learning"], scheduledTime: "Saturday 6PM" },
  { id: "r6", name: "Tequila Sunrise Club", theme: "🌅 Morning Vibes", description: "Because it's 5 o'clock somewhere. Brunch cocktails and networking.", host: users[7], participants: users.slice(4, 8), maxParticipants: 10, isLive: false, tags: ["Tequila", "Brunch", "Networking"], scheduledTime: "Sunday 11AM" },
];

// ============================================
// Drinks
// ============================================
export const drinks: Drink[] = [
  { id: "d1", name: "Yamazaki 18", category: "Whiskey", rating: 4.9, reviews: 2340, description: "An exquisite Japanese single malt with notes of dried fruit and mizunara oak.", ingredients: ["Malted Barley", "Water", "Yeast"], abv: 43, trending: true, origin: "Japan" },
  { id: "d2", name: "Hazy IPA Nebula", category: "Beer", rating: 4.5, reviews: 1876, description: "A juicy, hazy IPA bursting with tropical fruit aromas.", ingredients: ["Hops", "Malt", "Yeast", "Water"], abv: 6.8, trending: true, origin: "USA" },
  { id: "d3", name: "Espresso Martini", category: "Cocktail", rating: 4.7, reviews: 3210, description: "The perfect marriage of coffee and vodka. Shaken, not stirred.", ingredients: ["Vodka", "Coffee Liqueur", "Espresso", "Simple Syrup"], abv: 15, trending: true, origin: "UK" },
  { id: "d4", name: "Châteauneuf-du-Pape", category: "Wine", rating: 4.8, reviews: 1543, description: "A prestigious Rhône Valley red with complex spice and fruit.", ingredients: ["Grenache", "Syrah", "Mourvèdre"], abv: 14.5, trending: false, origin: "France" },
  { id: "d5", name: "Belvedere 10", category: "Vodka", rating: 4.6, reviews: 987, description: "Ultra-premium Polish vodka distilled from Dankowskie rye.", ingredients: ["Rye", "Artesian Water"], abv: 40, trending: true, origin: "Poland" },
  { id: "d6", name: "Diplomático Reserva", category: "Rum", rating: 4.7, reviews: 2100, description: "Venezuelan dark rum aged 12 years. Rich, sweet, complex.", ingredients: ["Sugarcane", "Molasses"], abv: 40, trending: false, origin: "Venezuela" },
  { id: "d7", name: "Clase Azul Reposado", category: "Tequila", rating: 4.8, reviews: 1670, description: "Handcrafted tequila in iconic ceramic bottle. Smooth vanilla finish.", ingredients: ["Blue Weber Agave"], abv: 40, trending: true, origin: "Mexico" },
  { id: "d8", name: "Roku Gin", category: "Gin", rating: 4.4, reviews: 1320, description: "Japanese craft gin with six unique botanicals.", ingredients: ["Juniper", "Sakura Flower", "Yuzu Peel", "Sencha Tea", "Gyokuro Tea", "Sansho Pepper"], abv: 43, trending: false, origin: "Japan" },
];

// ============================================
// Badges
// ============================================
export const badges: Badge[] = [
  { id: "b1", name: "First Sip", description: "Reviewed your first drink", icon: "🥤", rarity: "common", earned: true, earnedDate: "2021-03-15" },
  { id: "b2", name: "Social Butterfly", description: "Connected with 100 drinking buddies", icon: "🦋", rarity: "common", earned: true, earnedDate: "2021-08-20" },
  { id: "b3", name: "Connoisseur", description: "Reviewed 50 different drinks", icon: "🎩", rarity: "rare", earned: true, earnedDate: "2022-02-14" },
  { id: "b4", name: "Room Host", description: "Hosted 10 drinking rooms", icon: "🏠", rarity: "rare", earned: true, earnedDate: "2022-06-30" },
  { id: "b5", name: "Legendary Palate", description: "Received 1000 Cheers on reviews", icon: "👑", rarity: "epic", earned: true, earnedDate: "2023-01-15" },
  { id: "b6", name: "Master Mixologist", description: "Created 25 original cocktail recipes", icon: "🧪", rarity: "epic", earned: false },
  { id: "b7", name: "The Conqueror", description: "Tried drinks from 50 countries", icon: "🌍", rarity: "legendary", earned: false },
  { id: "b8", name: "Hall of Fame", description: "Reached #1 on the leaderboard", icon: "🏆", rarity: "legendary", earned: false },
];

// ============================================
// Leaderboard
// ============================================
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[6], xp: 18500, level: 32, change: "same" },
  { rank: 2, user: users[2], xp: 15200, level: 28, change: "up" },
  { rank: 3, user: users[0], xp: 12450, level: 24, change: "down" },
  { rank: 4, user: users[5], xp: 11000, level: 22, change: "up" },
  { rank: 5, user: users[7], xp: 10200, level: 20, change: "same" },
  { rank: 6, user: users[1], xp: 9800, level: 19, change: "up" },
  { rank: 7, user: users[3], xp: 8700, level: 17, change: "down" },
  { rank: 8, user: users[4], xp: 7200, level: 14, change: "same" },
];

// ============================================
// Connection Suggestions
// ============================================
export const connectionSuggestions: ConnectionSuggestion[] = [
  { user: users[2], mutualBuddies: 24, compatibility: 87, reason: "Both love whiskey architecture" },
  { user: users[5], mutualBuddies: 18, compatibility: 79, reason: "Shared interest in Japanese spirits" },
  { user: users[7], mutualBuddies: 12, compatibility: 72, reason: "Complementary tequila expertise" },
  { user: users[6], mutualBuddies: 31, compatibility: 91, reason: "Fellow brewing enthusiast" },
  { user: users[3], mutualBuddies: 8, compatibility: 65, reason: "RumOps meets Whiskey Architecture" },
];

// ============================================
// Groups
// ============================================
export const groups: DrinkingGroup[] = [
  { id: "g1", name: "Whiskey Architects Guild", description: "For serious whiskey professionals. Single malts only.", memberCount: 1240, category: "Whiskey", icon: "🥃", isJoined: true },
  { id: "g2", name: "Craft Beer Engineers", description: "Building better beer through science and code.", memberCount: 3400, category: "Beer", icon: "🍺", isJoined: true },
  { id: "g3", name: "Cocktail Innovation Lab", description: "Pushing boundaries in molecular mixology.", memberCount: 890, category: "Cocktails", icon: "🍸", isJoined: false },
  { id: "g4", name: "Wine & Dine Club", description: "Pairing great wines with great conversations.", memberCount: 2100, category: "Wine", icon: "🍷", isJoined: false },
  { id: "g5", name: "Spirits of the World", description: "Exploring global drinking cultures.", memberCount: 1560, category: "Global", icon: "🌍", isJoined: true },
];

// ============================================
// Bartender Messages (pre-built)
// ============================================
export const bartenderResponses: BartenderMessage[] = [
  { id: "bm1", role: "bartender", content: "Welcome to BarGPT, your AI-powered bartender. I've been trained on millions of drink recipes and thousands of hangovers. What can I pour for you today?", timestamp: "now" },
  { id: "bm2", role: "bartender", content: "Based on your profile, you're a whiskey architect. Bold choice. Might I recommend a Yamazaki 18 neat? It's like sipping liquid gold that actually appreciates your refined taste — unlike your last manager.", timestamp: "now" },
  { id: "bm3", role: "bartender", content: "Ah, you want something for a Monday morning meeting? Try the 'Corporate Courage' — it's a double espresso martini disguised in a coffee mug. Your secret is safe with me.", timestamp: "now" },
  { id: "bm4", role: "bartender", content: "Looking for a drink to pair with your mood? Let me analyze... You're stressed, slightly caffeinated, and questioning your career choices. I prescribe: an Old Fashioned with extra bitters. Just like your outlook. 😏", timestamp: "now" },
];

// ============================================
// Testimonials
// ============================================
export const testimonials: Testimonial[] = [
  { id: "t1", author: users[6], quote: "DrunkedIn helped me find my CBO role. Within a week I had 5 breweries reaching out. The networking here is stronger than a triple IPA.", rating: 5 },
  { id: "t2", author: users[2], quote: "I've never felt so professionally validated for my vodka expertise. My endorsements went from 0 to 500 overnight. Truly the LinkedIn of liquor.", rating: 5 },
  { id: "t3", author: users[4], quote: "The AI Bartender roasted my drink choices so hard I actually improved my palate. 10/10 would get cyberbullied by a bot again.", rating: 5 },
];

// ============================================
// Trending Hashtags
// ============================================
export const trendingHashtags = [
  { tag: "#WhiskeyWednesday", posts: 12400 },
  { tag: "#CraftBeerLife", posts: 8900 },
  { tag: "#MixologyMonday", posts: 7600 },
  { tag: "#OpenToDrink", posts: 15200 },
  { tag: "#BarGPT", posts: 5400 },
  { tag: "#HangoverFree", posts: 3200 },
  { tag: "#CocktailEngineering", posts: 4100 },
  { tag: "#SakeNotSorry", posts: 2800 },
];
