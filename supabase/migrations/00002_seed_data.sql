-- ============================================
-- DrunkedIn — Seed Data
-- ============================================
-- NOTE: Profiles are auto-created by the trigger on auth.users insert.
-- This seed inserts only non-profile data for demo purposes.
-- After setting up, run: SELECT seed_demo_data();
-- ============================================

-- Helper to generate deterministic UUIDs from short IDs
create extension if not exists "pgcrypto";

-- ============================================
-- Function: seed_demo_data()
-- Inserts all demo content using fixed UUIDs derived from mock IDs.
-- Call this once after creating auth users or for a fresh demo database.
-- ============================================
create or replace function public.seed_demo_data()
returns void
language plpgsql
security definer
as $$
declare
  uid1 uuid := '00000000-0000-0000-0000-000000000001';
  uid2 uuid := '00000000-0000-0000-0000-000000000002';
  uid3 uuid := '00000000-0000-0000-0000-000000000003';
  uid4 uuid := '00000000-0000-0000-0000-000000000004';
  uid5 uuid := '00000000-0000-0000-0000-000000000005';
  uid6 uuid := '00000000-0000-0000-0000-000000000006';
  uid7 uuid := '00000000-0000-0000-0000-000000000007';
  uid8 uuid := '00000000-0000-0000-0000-000000000008';
begin

  -- ============================================
  -- Profiles (only if not already existing)
  -- ============================================
  insert into public.profiles (id, name, title, bio, tolerance_level, xp, level, cheers_received, drinking_buddies, drinks_reviewed, open_to_drink, joined_date, location)
  values
    (uid1, 'Alex Barrel', 'Senior Whiskey Architect', 'Crafting bourbon experiences since 2015. Specialist in single-malt infrastructure and cocktail microservices. Open to drink.', 78, 12450, 24, 3842, 512, 187, true, '2021-03-15', 'Manhattan, NY'),
    (uid2, 'Maya Hops', 'Beer Stack Developer', 'Full-stack beer enthusiast. IPA specialist.', 65, 9800, 19, 2150, 340, 142, true, '2022-01-10', 'Portland, OR'),
    (uid3, 'Viktor Stoli', 'Certified Vodka Engineer', 'Precision-engineered vodka solutions. Clean code, clean spirits.', 92, 15200, 28, 4500, 620, 230, false, '2020-06-20', 'Moscow, Russia'),
    (uid4, 'Rosé Martinez', 'RumOps Specialist', 'Deploying rum-based solutions at scale. Caribbean infrastructure expert.', 71, 8700, 17, 1890, 280, 98, true, '2022-07-05', 'Havana, Cuba'),
    (uid5, 'James Neat', 'Cocktail Product Manager', 'Managing the cocktail roadmap. Q4 target: 500 new recipes.', 55, 7200, 14, 1200, 195, 76, true, '2023-02-14', 'London, UK'),
    (uid6, 'Sakura Sake', 'Sake DevOps Lead', 'Automating sake brewing pipelines. CI/CD for fermentation.', 60, 11000, 22, 3100, 410, 165, true, '2021-09-01', 'Kyoto, Japan'),
    (uid7, 'Barley McFoam', 'Chief Brewing Officer', 'From garage brewer to CBO. 15 years of hop engineering.', 88, 18500, 32, 5200, 780, 312, false, '2019-01-01', 'Munich, Germany'),
    (uid8, 'Tequila Sunrise', 'Agave Solutions Architect', 'Building tequila microservices. Worm-driven development advocate.', 74, 10200, 20, 2800, 350, 145, true, '2021-05-20', 'Jalisco, Mexico')
  on conflict (id) do nothing;

  -- ============================================
  -- Experience entries
  -- ============================================
  insert into public.experience_entries (id, user_id, title, company, period, description, icon, sort_order) values
    ('e1000000-0000-0000-0000-000000000001', uid1, 'Senior Whiskey Architect', 'BourbonTech Inc.', '2023 - Present', 'Leading the single-malt division. Architected a 12-year aged solution.', '🥃', 0),
    ('e1000000-0000-0000-0000-000000000002', uid1, 'Cocktail Engineer', 'MixologyLabs', '2021 - 2023', 'Built scalable cocktail delivery pipelines. Reduced hangover latency by 40%.', '🍸', 1),
    ('e1000000-0000-0000-0000-000000000003', uid1, 'Junior Beer Tester', 'HopStack Studios', '2019 - 2021', 'Quality assurance across 200+ craft beer deployments.', '🍺', 2)
  on conflict (id) do nothing;

  -- ============================================
  -- Drinks catalog
  -- ============================================
  insert into public.drinks (id, name, category, rating, reviews, description, ingredients, abv, trending, origin) values
    ('d1000000-0000-0000-0000-000000000001', 'Yamazaki 18', 'Whiskey', 4.9, 2340, 'An exquisite Japanese single malt with notes of dried fruit and mizunara oak.', '{"Malted Barley","Water","Yeast"}', 43, true, 'Japan'),
    ('d1000000-0000-0000-0000-000000000002', 'Hazy IPA Nebula', 'Beer', 4.5, 1876, 'A juicy, hazy IPA bursting with tropical fruit aromas.', '{"Hops","Malt","Yeast","Water"}', 6.8, true, 'USA'),
    ('d1000000-0000-0000-0000-000000000003', 'Espresso Martini', 'Cocktail', 4.7, 3210, 'The perfect marriage of coffee and vodka. Shaken, not stirred.', '{"Vodka","Coffee Liqueur","Espresso","Simple Syrup"}', 15, true, 'UK'),
    ('d1000000-0000-0000-0000-000000000004', 'Châteauneuf-du-Pape', 'Wine', 4.8, 1543, 'A prestigious Rhône Valley red with complex spice and fruit.', '{"Grenache","Syrah","Mourvèdre"}', 14.5, false, 'France'),
    ('d1000000-0000-0000-0000-000000000005', 'Belvedere 10', 'Vodka', 4.6, 987, 'Ultra-premium Polish vodka distilled from Dankowskie rye.', '{"Rye","Artesian Water"}', 40, true, 'Poland'),
    ('d1000000-0000-0000-0000-000000000006', 'Diplomático Reserva', 'Rum', 4.7, 2100, 'Venezuelan dark rum aged 12 years. Rich, sweet, complex.', '{"Sugarcane","Molasses"}', 40, false, 'Venezuela'),
    ('d1000000-0000-0000-0000-000000000007', 'Clase Azul Reposado', 'Tequila', 4.8, 1670, 'Handcrafted tequila in iconic ceramic bottle. Smooth vanilla finish.', '{"Blue Weber Agave"}', 40, true, 'Mexico'),
    ('d1000000-0000-0000-0000-000000000008', 'Roku Gin', 'Gin', 4.4, 1320, 'Japanese craft gin with six unique botanicals.', '{"Juniper","Sakura Flower","Yuzu Peel","Sencha Tea","Gyokuro Tea","Sansho Pepper"}', 43, false, 'Japan')
  on conflict (id) do nothing;

  -- ============================================
  -- Badges
  -- ============================================
  insert into public.badges (id, name, description, icon, rarity) values
    ('b1000000-0000-0000-0000-000000000001', 'First Sip', 'Reviewed your first drink', '🥤', 'common'),
    ('b1000000-0000-0000-0000-000000000002', 'Social Butterfly', 'Connected with 100 drinking buddies', '🦋', 'common'),
    ('b1000000-0000-0000-0000-000000000003', 'Connoisseur', 'Reviewed 50 different drinks', '🎩', 'rare'),
    ('b1000000-0000-0000-0000-000000000004', 'Room Host', 'Hosted 10 drinking rooms', '🏠', 'rare'),
    ('b1000000-0000-0000-0000-000000000005', 'Legendary Palate', 'Received 1000 Cheers on reviews', '👑', 'epic'),
    ('b1000000-0000-0000-0000-000000000006', 'Master Mixologist', 'Created 25 original cocktail recipes', '🧪', 'epic'),
    ('b1000000-0000-0000-0000-000000000007', 'The Conqueror', 'Tried drinks from 50 countries', '🌍', 'legendary'),
    ('b1000000-0000-0000-0000-000000000008', 'Hall of Fame', 'Reached #1 on the leaderboard', '🏆', 'legendary')
  on conflict (id) do nothing;

  -- ============================================
  -- User badges (for Alex Barrel)
  -- ============================================
  insert into public.user_badges (user_id, badge_id, earned_date) values
    (uid1, 'b1000000-0000-0000-0000-000000000001', '2021-03-15'),
    (uid1, 'b1000000-0000-0000-0000-000000000002', '2021-08-20'),
    (uid1, 'b1000000-0000-0000-0000-000000000003', '2022-02-14'),
    (uid1, 'b1000000-0000-0000-0000-000000000004', '2022-06-30'),
    (uid1, 'b1000000-0000-0000-0000-000000000005', '2023-01-15')
  on conflict (user_id, badge_id) do nothing;

  -- ============================================
  -- Posts
  -- ============================================
  insert into public.posts (id, author_id, content, hashtags, reactions, comment_count, created_at) values
    ('p1000000-0000-0000-0000-000000000001', uid2,
     'Just deployed a new IPA to production. Zero downtime. Zero sobriety. The hops-to-malt ratio is perfectly optimized for maximum flavor throughput. 🍺',
     '{BeerEngineering,CraftBeer}',
     '{"cheers":142,"smooth":38,"strong":12,"legendary":5}'::jsonb,
     23, now() - interval '2 hours'),
    ('p1000000-0000-0000-0000-000000000002', uid3,
     E'Thrilled to announce I''ve been promoted to Principal Vodka Engineer! After 3 years of distilling clean, efficient spirits, the board finally recognized my contributions. Special thanks to my mentor who taught me that the best code — like the best vodka — should be crystal clear. 🥂',
     '{Promotion,VodkaEngineering}',
     '{"cheers":523,"smooth":89,"strong":45,"legendary":67}'::jsonb,
     87, now() - interval '5 hours'),
    ('p1000000-0000-0000-0000-000000000003', uid4,
     'Hot take: Dark rum > Light rum for production environments. The complexity and depth provide better long-term stability. Fight me. 🥃',
     '{RumOps,HotTake}',
     '{"cheers":89,"smooth":156,"strong":78,"legendary":23}'::jsonb,
     156, now() - interval '8 hours'),
    ('p1000000-0000-0000-0000-000000000004', uid5,
     E'Just wrapped up our quarterly cocktail review. Key metrics:\n\n📊 Drinks shipped: 1,247\n🍹 Customer satisfaction: 94%\n🎯 Hangover rate: Down 23% QoQ\n\nProud of the team! Next quarter we''re scaling our Margarita pipeline.',
     '{QuarterlyReview,CocktailManagement}',
     '{"cheers":234,"smooth":67,"strong":12,"legendary":34}'::jsonb,
     45, now() - interval '12 hours'),
    ('p1000000-0000-0000-0000-000000000005', uid7,
     E'15 years ago I brewed my first beer in a garage. Today, I''m leading a team of 50 brewing engineers. The secret? Never stop fermenting. Never stop learning. And always — ALWAYS — trust the yeast. 🍺✨',
     '{BrewingJourney,Leadership}',
     '{"cheers":892,"smooth":234,"strong":89,"legendary":156}'::jsonb,
     203, now() - interval '1 day')
  on conflict (id) do nothing;

  -- ============================================
  -- Rooms
  -- ============================================
  insert into public.rooms (id, name, theme, description, host_id, max_participants, is_live, tags, music, scheduled_time) values
    ('r1000000-0000-0000-0000-000000000001', 'Whiskey Wednesday', '🥃 Weekly Tasting', 'Our legendary weekly whiskey tasting session. This week: Japanese single malts.', uid1, 12, true, '{Whiskey,Tasting,Weekly}', 'Lo-fi Jazz', null),
    ('r1000000-0000-0000-0000-000000000002', 'Beer Code Review', '🍺 Craft & Code', 'Review code while reviewing craft beers. Two birds, one pint.', uid2, 8, true, '{Beer,Coding,Social}', 'Indie Rock', null),
    ('r1000000-0000-0000-0000-000000000003', 'Cocktail Innovation Lab', '🍸 Experimental', 'Pushing the boundaries of mixology. Tonight: molecular cocktails.', uid5, 10, false, '{Cocktails,Innovation}', '', now() + interval '1 day'),
    ('r1000000-0000-0000-0000-000000000004', 'Wine & Unwind', '🍷 Relaxation', 'End-of-week wine session. No shop talk, just grape therapy.', uid6, 15, true, '{Wine,Chill,Friday}', 'Classical', null),
    ('r1000000-0000-0000-0000-000000000005', 'Sake Ceremony', '🍶 Traditional', 'Learn the art of traditional sake service. Cultural deep dive.', uid6, 6, false, '{Sake,Culture,Learning}', '', now() + interval '2 days'),
    ('r1000000-0000-0000-0000-000000000006', 'Tequila Sunrise Club', '🌅 Morning Vibes', 'Because it''s 5 o''clock somewhere. Brunch cocktails and networking.', uid8, 10, false, '{Tequila,Brunch,Networking}', '', now() + interval '3 days')
  on conflict (id) do nothing;

  -- ============================================
  -- Room participants
  -- ============================================
  insert into public.room_participants (room_id, user_id) values
    ('r1000000-0000-0000-0000-000000000001', uid1),
    ('r1000000-0000-0000-0000-000000000001', uid2),
    ('r1000000-0000-0000-0000-000000000001', uid3),
    ('r1000000-0000-0000-0000-000000000001', uid4),
    ('r1000000-0000-0000-0000-000000000001', uid5),
    ('r1000000-0000-0000-0000-000000000002', uid2),
    ('r1000000-0000-0000-0000-000000000002', uid3),
    ('r1000000-0000-0000-0000-000000000002', uid4),
    ('r1000000-0000-0000-0000-000000000003', uid4),
    ('r1000000-0000-0000-0000-000000000003', uid5),
    ('r1000000-0000-0000-0000-000000000003', uid6),
    ('r1000000-0000-0000-0000-000000000004', uid3),
    ('r1000000-0000-0000-0000-000000000004', uid4),
    ('r1000000-0000-0000-0000-000000000004', uid5),
    ('r1000000-0000-0000-0000-000000000004', uid6),
    ('r1000000-0000-0000-0000-000000000004', uid7),
    ('r1000000-0000-0000-0000-000000000005', uid1),
    ('r1000000-0000-0000-0000-000000000005', uid2),
    ('r1000000-0000-0000-0000-000000000005', uid3),
    ('r1000000-0000-0000-0000-000000000006', uid5),
    ('r1000000-0000-0000-0000-000000000006', uid6),
    ('r1000000-0000-0000-0000-000000000006', uid7),
    ('r1000000-0000-0000-0000-000000000006', uid8)
  on conflict (room_id, user_id) do nothing;

  -- ============================================
  -- Drinking groups
  -- ============================================
  insert into public.drinking_groups (id, name, description, member_count, category, icon) values
    ('g1000000-0000-0000-0000-000000000001', 'Whiskey Architects Guild', 'For serious whiskey professionals. Single malts only.', 1240, 'Whiskey', '🥃'),
    ('g1000000-0000-0000-0000-000000000002', 'Craft Beer Engineers', 'Building better beer through science and code.', 3400, 'Beer', '🍺'),
    ('g1000000-0000-0000-0000-000000000003', 'Cocktail Innovation Lab', 'Pushing boundaries in molecular mixology.', 890, 'Cocktails', '🍸'),
    ('g1000000-0000-0000-0000-000000000004', 'Wine & Dine Club', 'Pairing great wines with great conversations.', 2100, 'Wine', '🍷'),
    ('g1000000-0000-0000-0000-000000000005', 'Spirits of the World', 'Exploring global drinking cultures.', 1560, 'Global', '🌍')
  on conflict (id) do nothing;

  -- ============================================
  -- Group members (Alex Barrel is in guilds 1, 2, 5)
  -- ============================================
  insert into public.group_members (group_id, user_id) values
    ('g1000000-0000-0000-0000-000000000001', uid1),
    ('g1000000-0000-0000-0000-000000000002', uid1),
    ('g1000000-0000-0000-0000-000000000005', uid1)
  on conflict (group_id, user_id) do nothing;

  -- ============================================
  -- Bartender welcome message
  -- ============================================
  insert into public.bartender_messages (id, user_id, role, content) values
    ('bm000000-0000-0000-0000-000000000000', uid1, 'bartender',
     'Welcome to BarGPT, your AI-powered bartender. I''ve been trained on millions of drink recipes and thousands of hangovers. What can I pour for you today?')
  on conflict (id) do nothing;

end;
$$;
