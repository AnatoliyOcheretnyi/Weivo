# Friends Feature Development Phases

## Scope
This roadmap defines practical implementation phases for the Weivo friends system:
- internal friend discovery,
- support interactions,
- streak/levels,
- scalable social architecture.

## Phase 0: Product + Tech Foundation
Goal: prepare architecture without exposing unfinished social UX.

Deliverables:
- Feature flag: `friends_enabled`.
- Supabase schema + RLS for:
  - `friend_requests`
  - `friendships`
  - `buddy_messages`
  - `social_events`
- Basic social fields in `profiles`:
  - `social_level`
  - `social_xp`
  - `social_title`
- Seed constants for XP and titles in app config.
- Empty Buddies screen shell (hidden behind flag if needed).

Exit criteria:
- Migrations apply cleanly.
- RLS blocks cross-user reads/writes correctly.
- App builds and runs with feature flag off/on.

## Phase 1: Internal Discovery + Friend Requests (MVP Core)
Goal: allow users to find existing Weivo users and connect.

Deliverables:
- Search existing users by username (internal only).
- Send friend request.
- Incoming/outgoing requests list.
- Accept/decline/cancel request actions.
- Friendship record creation on accept.
- Basic Buddies tab with:
  - no-friends premium empty state,
  - pending requests section,
  - connected buddies list.

Exit criteria:
- User can complete full request flow end-to-end.
- Duplicate/self requests are blocked.
- Search obeys privacy and rate limits.

## Phase 2: Buddy Progress + Support Actions
Goal: make buddy relationship useful day-to-day.

Deliverables:
- Buddy card data:
  - last weigh-in timestamp,
  - trend status,
  - goal progress summary,
  - inactivity indicator.
- Buddy detail screen.
- Quick support actions:
  - “You got this”
  - “Great job”
  - “Need help?”
- Short custom nudge message.
- Activity log in buddy thread.

Exit criteria:
- Support actions are persisted and visible on both devices.
- Buddy sees messages/reactions in near real time or on refresh.

## Phase 3: Streak Engine + XP + Levels
Goal: establish retention loop and gamified progression.

Deliverables:
- Shared streak rules and updater.
- XP engine events:
  - app open,
  - weigh-in logged,
  - buddy support sent,
  - weekly consistency checks.
- Level progression logic + title unlocks.
- Social progress screen (XP bar, level, next milestone).
- First celebratory animations (level-up, streak milestone).

Exit criteria:
- XP is deterministic and server-validated.
- Level/title updates are consistent across devices.

## Phase 4: Social Notifications + Re-engagement
Goal: increase habit continuity with respectful reminders.

Deliverables:
- In-app notification center for buddy events.
- Push notifications:
  - new friend request,
  - support message,
  - streak risk alert.
- Notification preferences:
  - mute buddy,
  - quiet hours,
  - event type toggles.

Exit criteria:
- Notification delivery is reliable.
- Opt-out controls work correctly.

## Phase 5: External Invites + Growth Loops
Goal: let users invite non-Weivo contacts into the app.

Deliverables:
- Invite links with token lifecycle.
- Deep-link acceptance flow.
- Invite status tracking (sent/opened/accepted).
- Conversion analytics.

Exit criteria:
- New user can install and join inviter path with attribution.

## Phase 6: Integrations + Advanced Insights
Goal: enrich social context using connected health sources.

Deliverables:
- HealthKit (iOS) sync.
- Health Connect (Android) sync.
- Social insights based on richer activity/weight signals.
- Partner-path investigation for Garmin.

Exit criteria:
- Data ingestion is stable and permission-safe.
- Social summaries remain clear and non-noisy.

## UI Placement Decision
Recommended primary navigation:
- `Home` | `Entries` | `Add` | `Buddies` | `Profile`

Rationale:
- Buddies should be first-class, not hidden in settings.
- Social loop needs fast frequent access and badges.

## Technical Principles
- Supabase is source of truth for social entities.
- Critical rules (XP/streak/friendship transitions) live server-side.
- Client sync is resilient:
  - optimistic updates where safe,
  - idempotent writes,
  - conflict-safe merges.

## Risks and Controls
- Abuse/spam:
  - request throttling,
  - block/report,
  - message limits.
- Social pressure:
  - privacy modes,
  - summary-only view,
  - supportive tone templates.
- Complexity creep:
  - strict phase gates,
  - ship small, measure, iterate.

## Immediate Next Build Order
1. Phase 0 migrations + RLS + flag.
2. Phase 1 internal search and request flow.
3. Buddies empty state polish.
4. Buddy detail with quick support actions.
