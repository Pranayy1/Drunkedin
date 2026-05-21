-- ============================================
-- DrunkedIn — Initial Schema
-- ============================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default '',
  title         text not null default 'Connoisseur',
  avatar        text not null default '',
  banner        text not null default '',
  bio           text not null default '',
  tolerance_level integer not null default 50 check (tolerance_level between 0 and 100),
  xp            integer not null default 0 check (xp >= 0),
  level         integer not null default 1 check (level >= 1),
  cheers_received integer not null default 0 check (cheers_received >= 0),
  drinking_buddies integer not null default 0 check (drinking_buddies >= 0),
  drinks_reviewed integer not null default 0 check (drinks_reviewed >= 0),
  open_to_drink boolean not null default true,
  joined_date   timestamptz not null default now(),
  location      text not null default '',
  updated_at    timestamptz not null default now()
);

-- 2. Experience entries (career timeline)
create table public.experience_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  company       text not null default '',
  period        text not null default '',
  description   text not null default '',
  icon          text not null default '🍸',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- 3. Beverages (top beverages per user)
create table public.beverages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  percentage    integer not null default 50 check (percentage between 0 and 100),
  icon          text not null default '🥃',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- 4. Posts
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  image         text not null default '',
  hashtags      text[] not null default '{}',
  reactions     jsonb not null default '{"cheers":0,"smooth":0,"strong":0,"legendary":0}'::jsonb,
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 5. Comments
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  reactions     jsonb not null default '{"cheers":0,"smooth":0,"strong":0,"legendary":0}'::jsonb,
  created_at    timestamptz not null default now()
);

-- 6. Reactions (per-user, per-post)
create table public.reactions (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  type          text not null check (type in ('cheers','smooth','strong','legendary')),
  created_at    timestamptz not null default now(),
  unique(post_id, user_id, type)
);

-- 7. Bookmarks
create table public.bookmarks (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique(post_id, user_id)
);

-- 8. Rooms
create table public.rooms (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  theme           text not null default '',
  description     text not null default '',
  host_id         uuid not null references public.profiles(id) on delete cascade,
  max_participants integer not null default 10 check (max_participants > 0),
  is_live         boolean not null default false,
  tags            text[] not null default '{}',
  music           text not null default '',
  scheduled_time  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 9. Room participants
create table public.room_participants (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  joined_at     timestamptz not null default now(),
  unique(room_id, user_id)
);

-- 10. Drinks catalog
create table public.drinks (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in ('Whiskey','Beer','Wine','Cocktail','Vodka','Rum','Tequila','Gin','Sake','Other')),
  rating        numeric(3,1) not null default 0 check (rating between 0 and 5),
  reviews       integer not null default 0 check (reviews >= 0),
  description   text not null default '',
  ingredients   text[] not null default '{}',
  abv           numeric(4,1) not null default 0 check (abv >= 0),
  image         text not null default '',
  trending      boolean not null default false,
  origin        text not null default '',
  created_at    timestamptz not null default now()
);

-- 11. Drink reviews
create table public.drink_reviews (
  id            uuid primary key default gen_random_uuid(),
  drink_id      uuid not null references public.drinks(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  rating        integer not null check (rating between 1 and 5),
  review        text not null default '',
  created_at    timestamptz not null default now(),
  unique(drink_id, user_id)
);

-- 12. Badges catalog
create table public.badges (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text not null,
  icon          text not null default '🏆',
  rarity        text not null check (rarity in ('common','rare','epic','legendary')),
  created_at    timestamptz not null default now()
);

-- 13. User badges
create table public.user_badges (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  badge_id      uuid not null references public.badges(id) on delete cascade,
  earned_date   timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- 14. Connections
create table public.connections (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references public.profiles(id) on delete cascade,
  addressee_id  uuid not null references public.profiles(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending','accepted','blocked')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

-- 15. Drinking groups
create table public.drinking_groups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text not null default '',
  category        text not null default 'Other',
  icon            text not null default '🍻',
  member_count    integer not null default 0 check (member_count >= 0),
  created_at      timestamptz not null default now()
);

-- 16. Group members
create table public.group_members (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid not null references public.drinking_groups(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  joined_at     timestamptz not null default now(),
  unique(group_id, user_id)
);

-- 17. Bartender messages
create table public.bartender_messages (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  role            text not null check (role in ('user','bartender')),
  content         text not null,
  drink_suggestion_id uuid references public.drinks(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- ============================================
-- Indexes
-- ============================================
create index idx_profiles_xp on public.profiles(xp desc);
create index idx_posts_author on public.posts(author_id);
create index idx_posts_created on public.posts(created_at desc);
create index idx_comments_post on public.comments(post_id);
create index idx_reactions_post on public.reactions(post_id);
create index idx_reactions_user on public.reactions(user_id);
create index idx_bookmarks_user on public.bookmarks(user_id);
create index idx_rooms_live on public.rooms(is_live) where is_live = true;
create index idx_rooms_scheduled on public.rooms(scheduled_time) where scheduled_time is not null;
create index idx_room_participants_room on public.room_participants(room_id);
create index idx_drinks_category on public.drinks(category);
create index idx_drinks_trending on public.drinks(trending) where trending = true;
create index idx_drink_reviews_drink on public.drink_reviews(drink_id);
create index idx_connections_user on public.connections(requester_id);
create index idx_connections_status on public.connections(status);
create index idx_group_members_user on public.group_members(user_id);
create index idx_bartender_messages_user on public.bartender_messages(user_id, created_at desc);
create index idx_user_badges_user on public.user_badges(user_id);
create index idx_experience_user on public.experience_entries(user_id, sort_order);
create index idx_beverages_user on public.beverages(user_id, sort_order);

-- ============================================
-- Auto-create profile on auth signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, title, tolerance_level, open_to_drink)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'drink_title', 'Connoisseur'),
    coalesce((new.raw_user_meta_data ->> 'tolerance_level')::integer, 50),
    true
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Update timestamps trigger
-- ============================================
create or replace function public.update_timestamp()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_timestamp
  before update on public.profiles
  for each row execute function public.update_timestamp();

create trigger update_posts_timestamp
  before update on public.posts
  for each row execute function public.update_timestamp();

create trigger update_rooms_timestamp
  before update on public.rooms
  for each row execute function public.update_timestamp();

-- ============================================
-- Row Level Security
-- ============================================
alter table public.profiles enable row level security;
alter table public.experience_entries enable row level security;
alter table public.beverages enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.drinks enable row level security;
alter table public.drink_reviews enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.connections enable row level security;
alter table public.drinking_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.bartender_messages enable row level security;

-- Profiles: everyone can read, only self can update
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Experience: read if profile readable, manage own
create policy "Experience entries are readable"
  on public.experience_entries for select
  using (true);

create policy "Users can manage own experience"
  on public.experience_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own experience"
  on public.experience_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own experience"
  on public.experience_entries for delete
  using (auth.uid() = user_id);

-- Beverages: same pattern
create policy "Beverages are readable"
  on public.beverages for select
  using (true);

create policy "Users can manage own beverages"
  on public.beverages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own beverages"
  on public.beverages for update
  using (auth.uid() = user_id);

create policy "Users can delete own beverages"
  on public.beverages for delete
  using (auth.uid() = user_id);

-- Posts: everyone can read, authenticated can create
create policy "Posts are publicly readable"
  on public.posts for select
  using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert
  with check (auth.role() = 'authenticated');

create policy "Authors can update own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- Comments
create policy "Comments are publicly readable"
  on public.comments for select
  using (true);

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.role() = 'authenticated');

create policy "Authors can update own comments"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "Authors can delete own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- Reactions
create policy "Reactions are publicly readable"
  on public.reactions for select
  using (true);

create policy "Users can manage own reactions"
  on public.reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own reactions"
  on public.reactions for delete
  using (auth.uid() = user_id);

-- Bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can manage own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Rooms
create policy "Rooms are publicly readable"
  on public.rooms for select
  using (true);

create policy "Authenticated users can create rooms"
  on public.rooms for insert
  with check (auth.role() = 'authenticated');

create policy "Hosts can update own rooms"
  on public.rooms for update
  using (auth.uid() = host_id);

create policy "Hosts can delete own rooms"
  on public.rooms for delete
  using (auth.uid() = host_id);

-- Room participants
create policy "Room participants are readable"
  on public.room_participants for select
  using (true);

create policy "Users can join rooms"
  on public.room_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can leave rooms"
  on public.room_participants for delete
  using (auth.uid() = user_id);

-- Drinks
create policy "Drinks are publicly readable"
  on public.drinks for select
  using (true);

create policy "Authenticated users can add drinks"
  on public.drinks for insert
  with check (auth.role() = 'authenticated');

-- Drink reviews
create policy "Drink reviews are publicly readable"
  on public.drink_reviews for select
  using (true);

create policy "Authenticated users can review"
  on public.drink_reviews for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own reviews"
  on public.drink_reviews for update
  using (auth.uid() = user_id);

-- Badges
create policy "Badges are publicly readable"
  on public.badges for select
  using (true);

-- User badges
create policy "User badges are publicly readable"
  on public.user_badges for select
  using (true);

-- Connections
create policy "Users can read own connections"
  on public.connections for select
  using (auth.uid() in (requester_id, addressee_id));

create policy "Users can create connections"
  on public.connections for insert
  with check (auth.uid() = requester_id);

create policy "Users can update connections they're involved in"
  on public.connections for update
  using (auth.uid() in (requester_id, addressee_id));

-- Drinking groups
create policy "Groups are publicly readable"
  on public.drinking_groups for select
  using (true);

-- Group members
create policy "Group members are readable"
  on public.group_members for select
  using (true);

create policy "Users can join groups"
  on public.group_members for insert
  with check (auth.uid() = user_id);

create policy "Users can leave groups"
  on public.group_members for delete
  using (auth.uid() = user_id);

-- Bartender messages
create policy "Users can read own bartender messages"
  on public.bartender_messages for select
  using (auth.uid() = user_id);

create policy "Users can create bartender messages"
  on public.bartender_messages for insert
  with check (auth.uid() = user_id);
