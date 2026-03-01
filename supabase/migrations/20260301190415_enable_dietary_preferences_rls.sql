ALTER TABLE "public"."dietary_preferences" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."dietary_preferences";

CREATE POLICY "Enable read access for all users" ON "public"."dietary_preferences"
  FOR SELECT USING (true);
