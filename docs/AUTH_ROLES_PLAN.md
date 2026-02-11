# Auth and Social Roles Plan

## Goal

Add user authorization and a social layer so users can invite friends, receive support, and optionally grant mentor/patron roles.

## Product Direction

- Keep tone supportive and non-toxic.
- Roles must unlock clear value: guidance, accountability, motivation.
- Social features should never expose private data without explicit consent.

## Recommended Stack

1. Firebase Auth
2. Cloud Firestore
3. Cloud Functions
4. Firebase Cloud Messaging (FCM)

## Why This Stack

- Firebase is already integrated in the app.
- Reduces integration complexity.
- Gives strong primitives for auth, access control, and notifications.

## Roles Model (v1)

- `member`: default app user.
- `mentor`: can support and monitor invited/accepted users.
- `patron`: supporter role (social encouragement, optional perks).

Important rule:
- Role elevation must happen only on backend (Cloud Functions), never from client-only logic.

## Authorization Scope

### Login methods (v1)

1. Email + password (quickest baseline)
2. Apple Sign-In (iOS priority)
3. Google Sign-In

### Session strategy

- Firebase Auth session as source of truth.
- Local cached user profile for fast launch UX.

## Data Model (Firestore)

### `users/{uid}`

- profile basics
- preferences
- privacy flags
- current role
- role metadata (grantedBy, grantedAt, reason)

### `weights/{uid}/entries/{entryId}`

- weight entries (existing domain data synced to cloud)

### `relationships/{relationshipId}`

- `fromUid`
- `toUid`
- `type` (`mentor`, `patron`, `friend`)
- `status` (`pending`, `accepted`, `rejected`, `revoked`)
- timestamps

### `invites/{code}`

- invite code
- creator uid
- role/type requested
- expiresAt
- usage limits

### `points_ledger/{uid}/events/{eventId}`

- immutable score events
- source/action
- points delta
- createdAt

### `nudges/{nudgeId}`

- sender uid
- recipient uid
- message template
- status/read state
- createdAt

## Security Model

1. Firestore Security Rules:
   - users can read/write only own private profile fields
   - relationships visible only to participants
   - role-protected collections guarded by role claims/doc checks
2. Cloud Functions:
   - role assignment
   - invite validation
   - points calculation
3. No direct client writes for privileged role transitions.

## Feature Roadmap

## Phase A - Auth Foundation

1. Auth screens and flow
2. Firebase Auth integration
3. User bootstrap document in `users/{uid}`
4. Migrate local profile/entries to user-scoped cloud path

## Phase B - Data Sync

1. Sync profile + weight entries with Firestore
2. Offline-first strategy with conflict policy
3. Basic backup/restore on reinstall/login

## Phase C - Invites and Relationships

1. Invite generation + redemption
2. Relationship lifecycle (`pending -> accepted/rejected`)
3. Mentor/patron visibility rules

## Phase D - Motivation Layer

1. Support nudges/messages
2. Push notifications via FCM
3. Weekly social summaries

## Phase E - Points and Dynamic Roles (optional)

1. Points ledger model
2. Backend score aggregation
3. Role upgrade rules based on score/milestones

## Technical Constraints and Rules

- Keep domain and UI separated:
  - `features/auth`
  - `features/social`
  - `features/points`
- Add backend contract tests for role logic.
- Add client integration tests for login + invite acceptance flow.

## Risks

1. Privacy leakage via incorrect rules
2. Role abuse if role writes are not server-controlled
3. Data conflicts during local-to-cloud migration

## Mitigations

1. Start with strict-deny rules and open minimally.
2. Put all privileged transitions behind Cloud Functions.
3. Ship migration with telemetry and rollback plan.

## Definition of Done (MVP)

1. User can sign in and restore personal data.
2. User can send and accept an invite.
3. At least one support role flow works end-to-end.
4. Security rules block unauthorized reads/writes.
5. Analytics events track auth and social funnel.
