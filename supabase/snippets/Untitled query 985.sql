UPDATE users 
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'duljamarin@gmail.com'
);