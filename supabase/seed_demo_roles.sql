-- Seed file: Only Platform Admin is seeded as requested.
-- Tourists register via /signup
-- Place Owners register via /register-partner

DO $$
DECLARE
  v_admin_id   UUID := '33333333-3333-4333-8333-333333333333';
  v_pw_hash    TEXT := crypt('Password123!', gen_salt('bf', 10));
BEGIN
  -- Platform Admin User (Fixed system administrator account)
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    phone_change_token,
    reauthentication_token,
    email_change,
    phone_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@goa.app',
    v_pw_hash,
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Goa Tourism Administrator","role":"platform_admin"}'::jsonb,
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = v_pw_hash,
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change_token_current = '',
    phone_change_token = '',
    reauthentication_token = '',
    email_change = '',
    phone_change = '';

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id
  ) VALUES (
    v_admin_id, v_admin_id, format('{"sub":"%s","email":"admin@goa.app"}', v_admin_id)::jsonb,
    'email', now(), now(), now(), v_admin_id::text
  ) ON CONFLICT (provider, provider_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_admin_id, 'platform_admin')
  ON CONFLICT (user_id, role) DO UPDATE SET role = 'platform_admin';
END $$;
