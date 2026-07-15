-- Change dietary_pref from jsonb[] to text[] to store plain slugs
-- e.g. '{"gluten-free","dairy-free"}' referencing dietary_preferences.slug
ALTER TABLE "public"."recipes"
  ALTER COLUMN "dietary_pref" TYPE text[]
  USING ARRAY(SELECT elem #>> '{}' FROM unnest(dietary_pref) AS elem);

ALTER TABLE "public"."recipes"
  ALTER COLUMN "dietary_pref" SET DEFAULT '{}'::text[];
