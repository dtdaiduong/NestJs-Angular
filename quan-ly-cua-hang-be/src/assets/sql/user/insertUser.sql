INSERT INTO public.users
( email, password, profile_id)
VALUES($1, $2, $3) RETURNING id; 