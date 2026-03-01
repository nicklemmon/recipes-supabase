CREATE TABLE IF NOT EXISTS dietary_preferences (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug        TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT
);

-- Seed initial dietary preferences
INSERT INTO dietary_preferences (slug, label, category, description) VALUES
  ('gluten-free',   'Gluten Free',   'allergen',  'Safe for those with celiac disease or gluten sensitivity'),
  ('dairy-free',    'Dairy Free',    'allergen',  'Contains no milk, cheese, butter, or other dairy products'),
  ('nut-free',      'Nut Free',      'allergen',  'Contains no tree nuts or peanuts'),
  ('egg-free',      'Egg Free',      'allergen',  'Contains no eggs'),
  ('soy-free',      'Soy Free',      'allergen',  'Contains no soy or soy-derived ingredients'),
  ('vegan',         'Vegan',         'lifestyle', 'Contains no animal products'),
  ('vegetarian',    'Vegetarian',    'lifestyle', 'Contains no meat or fish'),
  ('pescatarian',   'Pescatarian',   'lifestyle', 'Contains no meat but may contain fish'),
  ('low-sodium',    'Low Sodium',    'medical',   'Suitable for low-sodium diets')
ON CONFLICT (slug) DO NOTHING;

-- Add a comment documenting the intended dietary_pref format on recipes
COMMENT ON TABLE dietary_preferences IS 'Lookup table of valid dietary preference slugs. The recipes.dietary_pref JSONB column stores an array of slugs from this table, e.g. ["gluten-free", "dairy-free"].';

-- RLS (mirrors categories and subcategories: public read, no direct writes)
ALTER TABLE "public"."dietary_preferences" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."dietary_preferences"
  FOR SELECT USING (true);

GRANT ALL ON TABLE "public"."dietary_preferences" TO "anon";
GRANT ALL ON TABLE "public"."dietary_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."dietary_preferences" TO "service_role";

GRANT ALL ON SEQUENCE "public"."dietary_preferences_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dietary_preferences_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dietary_preferences_id_seq" TO "service_role";
