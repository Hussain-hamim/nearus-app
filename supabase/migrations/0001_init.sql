-- NearTask marketplace schema, RLS, triggers, and helper functions.

create extension if not exists "pgcrypto" with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Neighbor',
  avatar_url text,
  bio text,
  area text,
  locality text,
  city text,
  lat double precision,
  lng double precision,
  intent text check (intent in ('need_help', 'want_to_earn', 'skipped')),
  onboarding_completed_at timestamptz,
  average_rating numeric not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  helper_id uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 5 and 120),
  description text not null check (char_length(description) between 10 and 2000),
  category text not null check (category in ('services','rentals','study','fashion','food','tech','errands','other')),
  budget_amount numeric not null check (budget_amount > 0),
  currency text not null default 'AFN',
  visibility_radius_km integer not null check (visibility_radius_km in (2, 5, 10)),
  area text not null,
  locality text not null,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  scheduled_at timestamptz,
  status text not null default 'open' check (status in ('open','offer_received','helper_selected','in_progress','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.task_addresses (
  task_id uuid primary key references public.tasks (id) on delete cascade,
  formatted_address text not null
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  helper_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(message) between 4 and 1000),
  status text not null default 'pending' check (status in ('pending','accepted','declined','withdrawn')),
  created_at timestamptz not null default now(),
  unique (task_id, helper_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null unique references public.tasks (id) on delete cascade,
  requester_id uuid not null references public.profiles (id) on delete cascade,
  helper_id uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz,
  last_message_preview text,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  reviewee_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (task_id, reviewer_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.saved_tasks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, task_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reported_user_id uuid not null references public.profiles (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  reason text not null check (reason in ('spam','harassment','scam','inappropriate','other')),
  details text,
  created_at timestamptz not null default now()
);

create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index tasks_status_idx on public.tasks (status);
create index tasks_requester_idx on public.tasks (requester_id);
create index tasks_helper_idx on public.tasks (helper_id);
create index tasks_category_idx on public.tasks (category);
create index offers_task_idx on public.offers (task_id);
create index offers_helper_idx on public.offers (helper_id);
create index messages_conversation_idx on public.messages (conversation_id, created_at);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index conversations_participants_idx on public.conversations (requester_id, helper_id);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger tasks_touch before update on public.tasks
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Auth → profile
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1),
      'Neighbor'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.haversine_km(
  lat1 double precision,
  lng1 double precision,
  lat2 double precision,
  lng2 double precision
) returns double precision
language sql
immutable
as $$
  select 6371 * acos(
    least(1.0, greatest(-1.0,
      cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng2) - radians(lng1))
      + sin(radians(lat1)) * sin(radians(lat2))
    ))
  );
$$;

create or replace function public.is_blocked(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

create or replace function public.nearby_tasks(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision default 10,
  p_category text default null,
  p_search text default null
)
returns table (
  id uuid,
  requester_id uuid,
  helper_id uuid,
  title text,
  description text,
  category text,
  budget_amount numeric,
  currency text,
  visibility_radius_km integer,
  area text,
  locality text,
  city text,
  lat double precision,
  lng double precision,
  scheduled_at timestamptz,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  completed_at timestamptz,
  distance_km double precision,
  offer_count bigint,
  requester_display_name text,
  requester_avatar_url text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    t.id,
    t.requester_id,
    t.helper_id,
    t.title,
    t.description,
    t.category,
    t.budget_amount,
    t.currency,
    t.visibility_radius_km,
    t.area,
    t.locality,
    t.city,
    t.lat,
    t.lng,
    t.scheduled_at,
    t.status,
    t.created_at,
    t.updated_at,
    t.completed_at,
    public.haversine_km(p_lat, p_lng, t.lat, t.lng) as distance_km,
    (select count(*) from public.offers o where o.task_id = t.id) as offer_count,
    p.display_name as requester_display_name,
    p.avatar_url as requester_avatar_url
  from public.tasks t
  join public.profiles p on p.id = t.requester_id
  where t.status in ('open', 'offer_received')
    and t.requester_id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000')
    and not public.is_blocked(auth.uid(), t.requester_id)
    and public.haversine_km(p_lat, p_lng, t.lat, t.lng) <= t.visibility_radius_km
    and public.haversine_km(p_lat, p_lng, t.lat, t.lng) <= p_radius_km
    and (p_category is null or p_category = 'all' or t.category = p_category)
    and (
      p_search is null
      or p_search = ''
      or t.title ilike '%' || p_search || '%'
      or t.description ilike '%' || p_search || '%'
    )
  order by distance_km asc, t.created_at desc;
$$;

create or replace function public.get_task_address(p_task_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select a.formatted_address
  from public.task_addresses a
  join public.tasks t on t.id = a.task_id
  where a.task_id = p_task_id
    and (t.requester_id = auth.uid() or t.helper_id = auth.uid());
$$;

create or replace function public.unread_counts()
returns table (messages bigint, notifications bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    (
      select count(*)
      from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.read_at is null
        and m.sender_id <> auth.uid()
        and (c.requester_id = auth.uid() or c.helper_id = auth.uid())
    ) as messages,
    (
      select count(*)
      from public.notifications n
      where n.user_id = auth.uid() and n.read_at is null
    ) as notifications;
$$;

create or replace function public.notify_user(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_data jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, data)
  values (p_user_id, p_type, p_title, p_body, p_data);
end;
$$;

-- Keep offer_count status in sync
create or replace function public.on_offer_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pending_count integer;
  task_row public.tasks%rowtype;
begin
  select * into task_row from public.tasks where id = coalesce(new.task_id, old.task_id);
  select count(*) into pending_count from public.offers
    where task_id = task_row.id and status = 'pending';

  if task_row.status in ('open', 'offer_received') then
    update public.tasks
      set status = case when pending_count > 0 then 'offer_received' else 'open' end
      where id = task_row.id;
  end if;

  if tg_op = 'INSERT' then
    perform public.notify_user(
      task_row.requester_id,
      'offer_received',
      'New offer',
      'Someone offered to help with "' || task_row.title || '".',
      jsonb_build_object('task_id', task_row.id, 'offer_id', new.id)
    );
  end if;

  return coalesce(new, old);
end;
$$;

create trigger offers_after_change
  after insert or update or delete on public.offers
  for each row execute function public.on_offer_change();

create or replace function public.on_message_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  conv public.conversations%rowtype;
  recipient uuid;
begin
  select * into conv from public.conversations where id = new.conversation_id;
  update public.conversations
    set last_message_at = new.created_at,
        last_message_preview = left(new.body, 140)
    where id = new.conversation_id;

  recipient := case when conv.requester_id = new.sender_id then conv.helper_id else conv.requester_id end;
  perform public.notify_user(
    recipient,
    'new_message',
    'New message',
    left(new.body, 80),
    jsonb_build_object('conversation_id', conv.id, 'task_id', conv.task_id)
  );
  return new;
end;
$$;

create trigger messages_after_insert
  after insert on public.messages
  for each row execute function public.on_message_insert();

create or replace function public.on_review_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
    set review_count = review_count + 1,
        average_rating = (
          (average_rating * review_count + new.rating)::numeric / (review_count + 1)
        )
    where id = new.reviewee_id;

  perform public.notify_user(
    new.reviewee_id,
    'new_review',
    'New review',
    'You received a ' || new.rating || '-star review.',
    jsonb_build_object('task_id', new.task_id, 'review_id', new.id)
  );
  return new;
end;
$$;

create trigger reviews_after_insert
  after insert on public.reviews
  for each row execute function public.on_review_insert();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_addresses enable row level security;
alter table public.offers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.saved_tasks enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "tasks_select" on public.tasks
  for select to authenticated
  using (
    not public.is_blocked(auth.uid(), requester_id)
    and (
      status in ('open', 'offer_received')
      or requester_id = auth.uid()
      or helper_id = auth.uid()
    )
  );

create policy "tasks_insert_own" on public.tasks
  for insert to authenticated
  with check (requester_id = auth.uid());

create policy "tasks_update_parties" on public.tasks
  for update to authenticated
  using (requester_id = auth.uid() or helper_id = auth.uid())
  with check (requester_id = auth.uid() or helper_id = auth.uid());

create policy "tasks_delete_own" on public.tasks
  for delete to authenticated
  using (requester_id = auth.uid() and status in ('open', 'cancelled'));

create policy "addresses_select_parties" on public.task_addresses
  for select to authenticated
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id
        and (t.requester_id = auth.uid() or t.helper_id = auth.uid())
    )
  );

create policy "addresses_insert_requester" on public.task_addresses
  for insert to authenticated
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.requester_id = auth.uid()
    )
  );

create policy "offers_select_parties" on public.offers
  for select to authenticated
  using (
    helper_id = auth.uid()
    or exists (select 1 from public.tasks t where t.id = task_id and t.requester_id = auth.uid())
  );

create policy "offers_insert_helper" on public.offers
  for insert to authenticated
  with check (
    helper_id = auth.uid()
    and exists (
      select 1 from public.tasks t
      where t.id = task_id
        and t.requester_id <> auth.uid()
        and t.status in ('open', 'offer_received')
        and not public.is_blocked(auth.uid(), t.requester_id)
    )
  );

create policy "offers_update_parties" on public.offers
  for update to authenticated
  using (
    helper_id = auth.uid()
    or exists (select 1 from public.tasks t where t.id = task_id and t.requester_id = auth.uid())
  );

create policy "conversations_select_participants" on public.conversations
  for select to authenticated
  using (requester_id = auth.uid() or helper_id = auth.uid());

create policy "conversations_insert_requester" on public.conversations
  for insert to authenticated
  with check (requester_id = auth.uid());

create policy "messages_select_participants" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.requester_id = auth.uid() or c.helper_id = auth.uid())
    )
  );

create policy "messages_insert_participants" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.requester_id = auth.uid() or c.helper_id = auth.uid())
    )
  );

create policy "messages_update_participants" on public.messages
  for update to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.requester_id = auth.uid() or c.helper_id = auth.uid())
    )
  );

create policy "reviews_select" on public.reviews
  for select to authenticated using (true);

create policy "reviews_insert_parties" on public.reviews
  for insert to authenticated
  with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.tasks t
      where t.id = task_id
        and t.status = 'completed'
        and (t.requester_id = auth.uid() or t.helper_id = auth.uid())
        and (reviewee_id = t.requester_id or reviewee_id = t.helper_id)
        and reviewee_id <> auth.uid()
    )
  );

create policy "notifications_select_own" on public.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "saved_select_own" on public.saved_tasks
  for select to authenticated using (user_id = auth.uid());

create policy "saved_insert_own" on public.saved_tasks
  for insert to authenticated with check (user_id = auth.uid());

create policy "saved_delete_own" on public.saved_tasks
  for delete to authenticated using (user_id = auth.uid());

create policy "reports_insert_own" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());

create policy "reports_select_own" on public.reports
  for select to authenticated using (reporter_id = auth.uid());

create policy "blocks_all_own" on public.blocks
  for all to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

alter table public.messages replica identity full;
alter table public.offers replica identity full;
alter table public.notifications replica identity full;
alter table public.tasks replica identity full;
alter table public.conversations replica identity full;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.offers;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.conversations;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatar_upload_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
