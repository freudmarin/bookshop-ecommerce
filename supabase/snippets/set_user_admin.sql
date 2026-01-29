-- ============================================
-- Set User as Admin
-- Run this script to grant admin privileges to a user
-- Replace 'user-email@example.com' with the actual user email
-- ============================================

-- Option 1: Update by email
UPDATE users 
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'duljamarin@gmail.com.com'
);

-- Option 2: Update by user ID (if you know the ID)
-- UPDATE users 
-- SET role = 'admin'
-- WHERE id = 'user-uuid-here';

-- Verify the update
SELECT u.id, au.email, u.full_name, u.role
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE u.role = 'admin';
