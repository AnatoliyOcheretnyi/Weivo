# Friends System Vision (Weivo)

## Goal
Build a social support system around weight progress that is:
- motivational (support + accountability),
- lightweight (no noisy social feed),
- useful daily (check-ins, nudges, streaks),
- safe (privacy controls, consent, limits).

This feature should become a signature Weivo differentiator.

## Core Value Proposition
- You track weight for yourself.
- A buddy helps you stay consistent.
- Progress becomes shared momentum, not pressure.

## Main User Roles
- `owner`: person whose progress is tracked (default app use-case).
- `supporter`: friend who follows and supports owner progress.
- `peer`: both users support each other (mutual owner+supporter relation).

App-level goal modes remain:
- `lose`
- `gain`
- `maintain`

Friendship role is separate from goal mode.

## Core Features (MVP -> Next)

### 1) Add friend + invite to app
MVP:
- Search existing users by username (internal discovery first).
- Send request.
- Accept/decline request.
- Remove friend.

Next:
- Share invite link for non-users (external invite).
- Deep links with invite token.
- Optional contacts import.

### 2) Buddy visibility + support actions
MVP:
- See buddy status card:
  - last weigh-in time,
  - trend (up/down/stable),
  - streak,
  - progress to goal/range.
- Quick reactions:
  - “You got this”
  - “Great job”
  - “Need help?”
- Short message (1-2 lines).

Next:
- Scheduled reminders to buddy.
- “Nudge templates” based on inactivity.

### 3) Friendship streak
MVP:
- Shared streak grows when both are active (or when supporter engages and owner logs).
- Freeze rule (1 grace day/week).

Next:
- Streak milestones with visual rewards.

### 4) Levels + titles
MVP:
- XP sources:
  - daily app open,
  - logging weight,
  - supporting buddy,
  - completing weekly check-in.
- Level ladder per social profile (not per goal mode).
- Titles unlocked by level.

Example title ladder:
- L1 `Starter`
- L3 `Consistent`
- L5 `Supporter`
- L8 `Momentum Builder`
- L12 `Anchor`
- L16 `Coach Energy`
- L20 `Legend Buddy`

### 5) Privacy + boundaries
MVP:
- Toggle profile visibility:
  - full progress,
  - summary only,
  - hidden.
- Toggle who can message.
- Block/remove buddy.

## Navigation / Placement Strategy

## Recommended
Use a dedicated tab for social:
- Replace current `Analytics` tab with `Buddies` for now (analytics can move inside Home/Profile as section).
- Rationale: social loop needs frequent access, tab-level visibility, and notification badge.

Alternative (not recommended for killer feature):
- Put buddies under Profile settings.
- Downsides: feature gets buried, lower engagement.

Do not add drawer now:
- Adds complexity and weakens current simple IA.

## Empty State UX (No Friends Yet)
First Buddies screen should be strong even without data:
- Hero message: “Your progress is easier with a buddy.”
- 2 primary actions:
  - `Invite friend`
  - `Find by username`
- “How it works” 3-step explainer.
- Teaser card for rewards:
  - “Support actions give XP and titles.”

Make empty state visually premium (not plain placeholder).

## High-Level Screen Map
- `BuddiesHomeScreen`
  - list of friends / friend cards / pending requests.
- `AddBuddyScreen`
  - search + invite link.
- `BuddyProfileScreen`
  - buddy progress, streak, quick actions, message composer.
- `BuddyRequestsScreen`
  - incoming/outgoing requests.
- `SocialProgressScreen`
  - levels, titles, XP history.

## Data Model (Supabase Draft)

### `profiles` (existing)
Add optional social fields:
- `social_level int default 1`
- `social_xp int default 0`
- `social_title text`

### `friend_requests`
- `id uuid pk`
- `from_user_id uuid`
- `to_user_id uuid`
- `status text check (pending|accepted|declined|cancelled)`
- `message text`
- `created_at timestamptz`
- `updated_at timestamptz`

### `friendships`
- `id uuid pk`
- `user_a_id uuid`
- `user_b_id uuid`
- `state text check (active|blocked|removed)`
- `a_role text check (owner|supporter|peer)`
- `b_role text check (owner|supporter|peer)`
- `shared_streak int default 0`
- `last_interaction_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Unique pair constraint:
- canonical ordering (`least/greatest`) to avoid duplicates.

### `buddy_messages`
- `id uuid pk`
- `friendship_id uuid`
- `from_user_id uuid`
- `to_user_id uuid`
- `kind text check (quick_reaction|text_nudge|milestone_note)`
- `template_key text nullable`
- `text_body text nullable`
- `created_at timestamptz`

### `social_events` (XP engine source)
- `id uuid pk`
- `user_id uuid`
- `event_type text`
- `xp_delta int`
- `meta jsonb`
- `created_at timestamptz`

### `invite_tokens`
- `id uuid pk`
- `created_by uuid`
- `token text unique`
- `expires_at timestamptz`
- `max_uses int`
- `used_count int`

## Sync / Backend Logic
- Keep device as interaction layer, Supabase as source of truth.
- Use DB functions/edge functions for:
  - accepting requests -> creating friendship,
  - XP calculation,
  - streak updates,
  - anti-spam checks.

Avoid putting streak/XP business logic only in client.

## Notifications
Phase 1:
- In-app badges + unread counters.

Phase 2:
- Push notifications:
  - received friend request,
  - buddy sent support,
  - streak at risk.

## Animation Direction (Lottie / Motion)
- Use Lottie for:
  - friend request accepted,
  - streak milestone,
  - level-up/title unlock,
  - “nudge sent”.

Where to get animations:
- LottieFiles marketplace/community
- Custom export from Rive/After Effects if needed later.

Motion principles:
- quick, celebratory, not childish,
- max 1 hero animation per action,
- respect reduced motion setting.

## Phased Implementation Plan

### Phase 0 (Foundation)
- Define schema + RLS for social tables.
- Add feature flags.
- Add Buddies tab shell + empty state.

### Phase 1 (Core Social MVP)
- Internal user search (existing app users only).
- Friend requests.
- Accept/decline.
- Basic buddy card with progress summary.
- Quick reactions + short message.

### Phase 2 (Engagement)
- External invite flow (invite non-users into app).
- Shared streak.
- XP + levels + titles.
- Social progress screen.

### Phase 3 (Polish)
- Push notifications.
- Better invite flow + deep links.
- Lottie celebrations + A/B tuning.

## UX Notes for Killer Quality
- Avoid guilt-heavy wording.
- Use supportive tone templates.
- Keep actions fast (1 tap for encouragement).
- Always show “what to do next” state.
- Minimize empty/blank screens.

## Risks and Mitigations
- Risk: social pressure fatigue.
  - Mitigation: privacy modes + mute + gentle reminders.
- Risk: abuse/spam.
  - Mitigation: block/report, request throttling, message limits.
- Risk: complexity explosion.
  - Mitigation: phased rollout + strict MVP scope.

## Recommended Immediate Next Step
Implement `Phase 0` first:
1. Add `Buddies` tab shell.
2. Build premium empty state.
3. Prepare Supabase migration for social tables + RLS.
4. Enable friend request flow behind feature flag.

## Adjacent Product Backlog (Keep in Mind)

### A) Fullscreen chart from Home
- Add tap action on chart card -> open `ChartFullscreenScreen`.
- Include:
  - bigger time ranges (7d / 30d / 90d / 1y / all),
  - pinch/drag inspect mode,
  - trend overlays and goal range shading.
- This improves “daily use” and gives better context for buddy discussions.

### B) Analytics tab quality upgrade
- Strengthen analytics as a “progress intelligence” area:
  - adherence score,
  - volatility score,
  - expected milestone date confidence,
  - period-to-period compare.
- Keep this compatible with future Buddies feed (social proof + coaching prompts).

### C) Integrations strategy
- `Tier 1 (build now)`:
  - Apple HealthKit (iOS),
  - Health Connect (Android).
- `Tier 2 (later / partnership dependent)`:
  - Garmin Connect APIs (partner approval required),
  - YAZIO direct integration (no clear public developer API; treat as uncertain/partner path).

### C.1) Integration feasibility snapshot (as of 2026-02-17)
- Apple HealthKit:
  - feasible for iOS apps with user permissions and HealthKit capability.
- Android Health Connect:
  - feasible and preferred Android path for health data sharing.
  - Google Fit ecosystem is moving toward Health Connect migration.
- Garmin:
  - possible via Garmin Connect Developer Program, but requires approval and commercial terms for production usage.
- YAZIO:
  - no official public developer API found for third-party app builders.
  - practical path is indirect sync through Apple Health / Health Connect.

### C.2) Source links
- Apple HealthKit:
  - https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data
- Android Health Connect:
  - https://developer.android.com/health-and-fitness/guides/health-connect/overview
  - https://developer.android.com/health-and-fitness/guides/health-connect/plan/availability
- Google Fit migration notes:
  - https://developer.android.com/health-and-fitness/health-connect/migration/fit/faq
- Garmin Connect Developer Program:
  - https://developer.garmin.com/gc-developer-program/overview/
  - https://developer.garmin.com/gc-developer-program/program-faq/
- YAZIO supported integrations:
  - https://help.yazio.com/hc/en-us/articles/360004140898-Which-apps-devices-can-connect-with-YAZIO

### D) Suggested placement with Buddies
- If Buddies becomes the killer feature tab:
  - Tab set option:
    - `Home` | `Entries` | `Add` | `Buddies` | `Profile`
  - Move deep analytics into:
    - Home -> “See full analytics”
    - Profile -> “Insights”
- If Analytics stays as tab:
  - Put Buddies as a top-level CTA in Home hero + badge, but this is weaker than dedicated tab.
