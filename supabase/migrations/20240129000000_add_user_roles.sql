-- ============================================
-- Add User Roles
-- Migration to add role system for admin access control
-- ============================================

-- Create user_role enum
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Add role column to users table
ALTER TABLE users 
ADD COLUMN role user_role DEFAULT 'customer' NOT NULL;

-- Create index for role lookups
CREATE INDEX idx_users_role ON users(role);

-- Update RLS policy for orders to allow admins to view all orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (
        auth.uid() = user_id OR
        -- Allow admins to view all orders
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        ) OR
        -- Allow viewing by order number for tracking (guest users)
        true
    );

-- Update RLS policy for orders to allow admins to update any order
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (
        auth.uid() = user_id OR
        -- Allow admins to update any order
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment for documentation
COMMENT ON TYPE user_role IS 'User role enum: customer (default) or admin';
COMMENT ON COLUMN users.role IS 'User role for access control - default is customer';
COMMENT ON FUNCTION is_admin() IS 'Check if the current authenticated user is an admin';
