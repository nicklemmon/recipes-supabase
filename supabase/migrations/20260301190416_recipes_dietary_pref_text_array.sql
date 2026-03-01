-- Change dietary_pref from jsonb[] to text[] to store plain slugs
-- e.g. '{"gluten-free","dairy-free"}' referencing dietary_preferences.slug
--
-- All current values are empty arrays so ARRAY[]::text[] is a safe conversion.
ALTER TABLE "public"."recipes"
  ALTER COLUMN "dietary_pref" TYPE text[]
  USING ARRAY[]::text[];

ALTER TABLE "public"."recipes"
  ALTER COLUMN "dietary_pref" SET DEFAULT '{}'::text[];
