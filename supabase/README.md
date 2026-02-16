# Supabase Migrations

## First-time setup
1. Install Supabase CLI.
2. Authenticate CLI:
   - `npx supabase login`
3. Link this repo to your Supabase project:
   - `yarn db:link`

## Apply migrations to linked project
- `yarn db:migrate`

## Reset local database (when using local Supabase)
- `yarn db:reset`

## Generate TypeScript types from linked project schema
- `yarn db:types`
