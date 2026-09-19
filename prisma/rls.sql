-- ============================================================
-- IELTS Master — optional PostgreSQL Row-Level Security (RLS)
-- ============================================================
-- Defence in depth: even if an application query forgets its
-- `where: { userId }` filter, Postgres refuses to return another
-- user's rows. Run AFTER `npx prisma db push`:
--
--   psql "$DATABASE_URL" -f prisma/rls.sql
--
-- The app sets the tenant per transaction via src/lib/rls.js
--   SELECT set_config('app.user_id', '<cuid>', true)
-- so policies below evaluate against the signed-in user only.
--
-- NOTE: FORCE ROW LEVEL SECURITY is required because the app
-- connects as the table owner, and owners normally bypass RLS.
-- Apply this only once every query path goes through
-- withUserContext()/withAdminContext() — otherwise unfiltered
-- reads (public exam catalogue etc.) will return nothing.
-- ============================================================

-- Helper: current tenant from the session setting (NULL when unset).
CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS text AS $$
  SELECT nullif(current_setting('app.user_id', true), '')
$$ LANGUAGE sql STABLE;

-- Helper: is the current session an admin/background worker?
CREATE OR REPLACE FUNCTION app_is_service() RETURNS boolean AS $$
  SELECT coalesce(current_setting('app.role', true), '') IN ('admin', 'service')
$$ LANGUAGE sql STABLE;

-- ── Per-table policies ──────────────────────────────────────
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'UserStats', 'Submission', 'StudyPlan', 'Achievement',
    'Bookmark', 'MistakeBank', 'Notification',
    'EmailVerification', 'PasswordReset', 'AuthChallenge'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I '
      'USING ("userId" = app_current_user_id() OR app_is_service()) '
      'WITH CHECK ("userId" = app_current_user_id() OR app_is_service())',
      t
    );
  END LOOP;
END $$;

-- User row: you may read/update only yourself; admins see everything.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_self ON "User";
CREATE POLICY user_self ON "User"
  USING (id = app_current_user_id() OR app_is_service())
  WITH CHECK (id = app_current_user_id() OR app_is_service());

-- Analytics: rows are written by the service role, read by owner.
ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS analytics_owner ON "AnalyticsEvent";
CREATE POLICY analytics_owner ON "AnalyticsEvent"
  USING ("userId" IS NULL OR "userId" = app_current_user_id() OR app_is_service())
  WITH CHECK (true);

-- Login audit trail: write-only for the app, readable by admins.
ALTER TABLE "LoginAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoginAttempt" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS attempts_admin ON "LoginAttempt";
CREATE POLICY attempts_admin ON "LoginAttempt"
  USING (app_is_service())
  WITH CHECK (true);

-- Contact form: insert-only from the public site.
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contact_insert ON "ContactMessage";
CREATE POLICY contact_insert ON "ContactMessage"
  USING (app_is_service())
  WITH CHECK (true);
