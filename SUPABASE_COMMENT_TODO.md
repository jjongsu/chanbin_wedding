# Supabase 댓글 기능 TODO

이 문서는 `CommentSection`에 댓글 기능을 붙이기 위한 작업 순서입니다. 각 단계는 독립적으로 지시할 수 있도록 나눴습니다.

## 1. Supabase 프로젝트 준비

- [x] Supabase에서 새 프로젝트를 생성한다.
- [x] Project Settings > API에서 아래 값을 확인한다.
    - `Project URL`
    - `anon public key`
    - `service_role key`
- [x] 프로젝트 루트의 `.env.local` 또는 `.env`에 환경 변수를 추가한다.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
COMMENT_ADMIN_PASSWORD=
```

주의: `SUPABASE_SERVICE_ROLE_KEY`와 `COMMENT_ADMIN_PASSWORD`는 클라이언트 컴포넌트에서 직접 사용하지 않는다.

## 2. 패키지 설치

- [x] Supabase 클라이언트를 설치한다.

```bash
npm install @supabase/supabase-js
```

- [x] 설치 후 `package.json`과 `package-lock.json` 변경을 확인한다.

## 3. 댓글 테이블 생성

- [x] Supabase SQL Editor에서 `comments` 테이블을 만든다.

```sql
create table public.comments (
    id uuid primary key default gen_random_uuid(),
    author text not null check (char_length(author) between 1 and 40),
    message text not null check (char_length(message) between 1 and 500),
    password_hash text,
    is_hidden boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index comments_created_at_idx on public.comments (created_at desc);
```

- [x] 댓글 작성자 본인 수정/삭제를 허용할지, 관리자만 수정/삭제할지 정책을 결정한다.
    - 댓글 작성자는 본인 댓글만 수정/삭제할 수 있다.
    - 관리자는 모든 댓글을 수정/삭제할 수 있다.
- [x] 비밀번호 기반 본인 수정/삭제가 필요하면 `password_hash`를 사용한다.
    - 댓글 작성 시 비밀번호를 입력받고, 서버에서 해시로 저장한다.
    - 본인 수정/삭제 요청 시 입력한 비밀번호를 서버에서 검증한다.
- [x] 관리자 전용 수정/삭제만 필요하면 `password_hash` 없이 진행해도 된다.
    - 이 프로젝트는 작성자 본인 수정/삭제를 허용하므로 `password_hash`를 사용한다.

## 4. RLS 정책 설정

- [x] `comments` 테이블에 Row Level Security를 켠다.

```sql
alter table public.comments enable row level security;
```

- [x] 공개 댓글 조회 정책을 추가한다.

```sql
create policy "Public can read visible comments"
on public.comments
for select
using (is_hidden = false);
```

- [x] 클라이언트에서 직접 insert할지, Next.js API Route를 통해 insert할지 결정한다.
    - Next.js API Route를 통해 insert/update/delete를 처리한다.
- [x] 추천: insert/update/delete는 Next.js API Route에서 처리하고, API Route 내부에서 `service_role key`를 사용한다.
- [x] 위 추천 방식을 쓰면 공개 insert/update/delete RLS 정책은 만들지 않는다.
    - 공개 RLS 정책은 `select`만 만든다.

## 5. Supabase 클라이언트 파일 추가

- [x] 서버 전용 Supabase 클라이언트를 만든다.

예상 파일:

```text
src/lib/supabase/server.ts
```

- [x] 브라우저 조회를 Supabase에서 직접 할 경우 클라이언트용 파일도 만든다.
    - 이 프로젝트는 Next.js API Route를 통해 조회/작성/수정/삭제를 처리하므로 브라우저용 Supabase 클라이언트는 만들지 않는다.

예상 파일:

```text
src/lib/supabase/client.ts
```

- [x] `service_role key`는 `server.ts`에서만 읽도록 구성한다.

## 6. 댓글 API Route 추가

- [x] 댓글 목록 조회 API를 만든다.

예상 파일:

```text
app/api/comments/route.ts
```

예상 기능:

- [x] `GET /api/comments`: 공개 댓글 목록 조회
- [x] `POST /api/comments`: 댓글 작성
    - 작성자 이름, 댓글 내용, 댓글 비밀번호를 받는다.
    - 댓글 비밀번호는 서버에서 해시 처리 후 `password_hash`에 저장한다.

- [x] 관리자 수정/삭제 API를 만든다.

예상 파일:

```text
app/api/comments/[id]/route.ts
```

예상 기능:

- [x] `PATCH /api/comments/[id]`: 작성자 본인 또는 관리자 댓글 수정
    - 작성자 요청은 댓글 비밀번호로 검증한다.
    - 관리자 요청은 `COMMENT_ADMIN_PASSWORD`로 검증한다.
- [x] `DELETE /api/comments/[id]`: 작성자 본인 또는 관리자 댓글 삭제/숨김 처리
    - 작성자 요청은 댓글 비밀번호로 검증한다.
    - 관리자 요청은 `COMMENT_ADMIN_PASSWORD`로 검증한다.

## 7. 관리자 인증 방식 결정

- [ ] 1차 구현은 `/admin` 페이지에서 관리자 ID/PW를 입력받고 Supabase에 저장된 관리자 계정과 검증하는 방식으로 진행한다.
    - `/admin` 페이지에 로그인 화면을 둔다.
    - 관리자 인증 성공 시 댓글 삭제, 숨김, 보임 처리를 할 수 있는 관리 화면을 보여준다.
- [ ] 관리자 요청은 API Route에서만 검증한다.
- [ ] 클라이언트에는 관리자 비밀번호 원문을 저장하지 않는다.
- [ ] 운영 안정성이 더 필요하면 Supabase Auth 또는 별도 관리자 로그인으로 확장한다.

## 8. CommentSection UI 구현

- [ ] 댓글 목록 상태를 추가한다.
- [ ] 작성자 이름 입력을 추가한다.
- [ ] 댓글 내용 입력을 추가한다.
- [ ] 댓글 비밀번호 입력을 추가한다.
- [ ] 댓글 등록 버튼을 추가한다.
- [ ] 로딩, 빈 목록, 에러 상태를 추가한다.
- [ ] 등록 성공 시 입력값을 초기화하고 목록을 갱신한다.
- [ ] 각 댓글에 작성자 본인 수정/삭제 UI를 추가한다.
- [ ] 본인 수정/삭제 시 댓글 비밀번호를 입력받는다.
- [ ] 모바일 화면에서 입력창과 댓글 카드가 깨지지 않도록 스타일을 맞춘다.

## 9. 관리자 UI 구현

- [ ] 관리자 모드 진입 버튼 또는 토글을 추가한다.
- [ ] 관리자 비밀번호 입력 UI를 추가한다.
- [ ] 관리자 모드에서 댓글별 수정 버튼을 노출한다.
- [ ] 관리자 모드에서 댓글별 삭제 또는 숨김 버튼을 노출한다.
- [ ] 수정/삭제 성공 시 목록을 갱신한다.
- [ ] 삭제는 실제 delete와 soft delete 중 하나로 결정한다.

추천: 처음에는 `is_hidden = true`로 숨김 처리하고, 필요할 때만 실제 삭제한다.

## 10. 보안 및 검증

- [ ] 댓글 작성 API에서 author/message 길이를 서버에서 검증한다.
- [ ] 빈 댓글, 너무 긴 댓글, 스팸성 반복 요청을 막는다.
- [ ] 관리자 API에서 `COMMENT_ADMIN_PASSWORD`를 검증한다.
- [ ] 브라우저 번들에 `SUPABASE_SERVICE_ROLE_KEY`가 포함되지 않는지 확인한다.
- [ ] `npm run lint`를 실행한다.
- [ ] `npm run build`를 실행한다.
- [ ] 실제 브라우저에서 댓글 작성, 조회, 관리자 수정/삭제 플로우를 확인한다.

## 11. 작업 지시 추천 순서

1. `@supabase/supabase-js` 설치와 Supabase 클라이언트 파일을 만들어줘.
2. `comments` 테이블 SQL과 RLS 정책을 최종 형태로 다듬어줘.
3. `app/api/comments` API Route를 만들어줘.
4. `CommentSection`에 댓글 목록 조회와 작성 UI를 붙여줘.
5. 관리자 비밀번호 기반 수정/삭제 기능을 추가해줘.
6. lint/build와 브라우저 동작 확인까지 해줘.
