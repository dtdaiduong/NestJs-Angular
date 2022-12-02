INSERT INTO public.profiles
        (firstname, lastname, phone, address)
        VALUES($1, $2, $3, $4)
        RETURNING id;