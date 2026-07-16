create table public.recommended_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text not null,
  created_at timestamptz not null default now()
);

create index recommended_books_user_id_idx on public.recommended_books(user_id);

-- 클라이언트(anon/authenticated 키)의 직접 접근은 막는다.
-- 서버 함수(recommend.js)는 service_role 키를 쓰므로 RLS를 우회해 정상 동작한다.
alter table public.recommended_books enable row level security;
