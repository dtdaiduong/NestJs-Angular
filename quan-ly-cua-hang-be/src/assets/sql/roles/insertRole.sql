INSERT INTO public.roles
        ("name")
        VALUES($1)
        RETURNING id;