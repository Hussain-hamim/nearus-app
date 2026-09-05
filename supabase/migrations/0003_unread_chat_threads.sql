-- Count unread chat threads (people), not raw message rows.
create or replace function public.unread_counts()
returns table (messages bigint, notifications bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    (
      select count(distinct m.conversation_id)
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
