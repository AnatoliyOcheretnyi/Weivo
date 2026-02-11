# Weivo Master Plan (Gap-Based)

This plan contains only pending work.

## Priority Backlog

## P1 - Core Product Upgrades (Highest User Value)

1. Move full segment chain to Home (not only circular progress):
   - Inline milestones like `114.9 -> 110 -> 105 -> 99`
   - Horizontal progress bar with milestone dots
2. Rebuild Add Entry flow:
   - Wheel picker style input
   - `+0.1 / -0.1` controls
   - Auto-fill previous value
   - Haptic feedback on value change and save
3. Entries list upgrade:
   - Group by month
   - Monthly average weight
   - Swipe-to-edit (delete already exists)
   - Highlight biggest monthly/weekly drops

## P2 - Pro Analytics Layer

1. New "Analytics" tab (separate from entries list).
2. Trend weight (moving average) with toggle:
   - `Weight`
   - `Trend`
3. Advanced metrics:
   - Avg 7d / 30d
   - Biggest weekly drop
   - Biggest rollback
   - Average rate
   - Stable weeks count
4. Forecast:
   - Calendar date prediction (for example: "Reach 99 kg on Sep 12, 2026")

## P3 - Motivation and Psychology

1. Streak engine:
   - Current streak
   - Longest streak
2. Smart insight cards:
   - Progress to next milestone
   - "Rollback is normal" style messaging
   - Consistency and pace messages
3. Weekly summary generation:
   - Last 7 days result
   - Pace vs personal average

## P4 - WOW Features

1. Milestone celebration moment:
   - Minimal celebration animation on segment completion
   - Optional light confetti mode
2. Body equivalence messages (for lost weight).
3. Comparison mode:
   - Month to month
   - Year over year

## P5 - Store Readiness

1. App icon variants (2-3 options).
2. In-app privacy screen (human-readable summary + links).
3. Data export (CSV).
4. Backup/sync strategy (iCloud/alternative).
5. Widget implementation completion (current iOS widget target is not implemented yet).

## Architecture Workstream (parallel)

1. Add domain services:
   - `trend-service`
   - `stats-engine`
   - `forecast-service`
2. Add derived selectors layer for computed metrics.
3. Keep feature boundaries strict (`domain` vs `ui` vs `storage`).
4. Add tests for analytics math and trend/forecast logic.

## Recommended Execution Order

1. P1 (core UX impact)
2. P2 (pro analytics)
3. P3 (motivation)
4. P4/P5 (wow + store polish)

## Next Build Start (first ticket)

1. Implement P1.1 (segment chain on Home).
2. Then implement P1.2 (premium Add Entry flow).
