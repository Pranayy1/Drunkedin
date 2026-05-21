-- ============================================
-- DrunkedIn — Fix policies and add triggers
-- ============================================

-- 1. Add missing DELETE policy for drink_reviews
create policy "Users can delete own reviews"
  on public.drink_reviews for delete
  using (auth.uid() = user_id);

-- 2. Function to recalculate drink rating
create or replace function public.recalc_drink_rating()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  avg_rating numeric;
  review_count int;
begin
  if tg_op = 'DELETE' then
    select coalesce(avg(rating), 0), count(*) into avg_rating, review_count
    from public.drink_reviews
    where drink_id = old.drink_id;

    update public.drinks
    set rating = round(avg_rating::numeric, 1),
        reviews = review_count
    where id = old.drink_id;
    return old;
  else
    select coalesce(avg(rating), 0), count(*) into avg_rating, review_count
    from public.drink_reviews
    where drink_id = new.drink_id;

    update public.drinks
    set rating = round(avg_rating::numeric, 1),
        reviews = review_count
    where id = new.drink_id;
    return new;
  end if;
end;
$$;

create trigger trg_drink_reviews_rating
  after insert or delete on public.drink_reviews
  for each row execute function public.recalc_drink_rating();

-- 3. Remove manual rating fields from service — the trigger handles it now

-- 4. Grant necessary privileges (adjust as needed)
grant execute on function public.recalc_drink_rating() to authenticated, service_role;
