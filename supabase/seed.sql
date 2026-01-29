-- ============================================
-- BookHaven - Seed Data
-- Sample books and test users for the e-commerce bookshop
-- ============================================

-- Clear existing data (for development)
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE wishlists CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE products CASCADE;

-- Note: Test users will be created via Supabase Auth
-- Use these credentials for testing:
-- User 1: test@bookhaven.com / password: TestUser123!
-- User 2: jane@bookhaven.com / password: TestUser123!

-- After users sign up, their profiles will be auto-created by trigger
-- We'll insert sample profile data for testing after user creation

-- ============================================
-- FICTION - CLASSICS
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Pride and Prejudice',
    'Jane Austen',
    '978-0141439518',
    'One of the most universally loved and admired English novels, Pride and Prejudice was penned as a popular entertainment. But the brilliance of the novel lies in the way it transcends its status as a comedy of manners to investigate class, gender, and social expectations.',
    12.99,
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    25,
    'Fiction - Classics',
    'Penguin Classics',
    1813,
    432
),
(
    '1984',
    'George Orwell',
    '978-0451524935',
    'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its dystopian vision becomes more real. Published in 1949, the book offers political satirist George Orwell''s vision of a totalitarian state.',
    14.99,
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
    30,
    'Fiction - Classics',
    'Signet Classic',
    1949,
    328
),
(
    'To Kill a Mockingbird',
    'Harper Lee',
    '978-0060935467',
    'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. A gripping, heart-wrenching tale of racial injustice and childhood innocence.',
    15.99,
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    20,
    'Fiction - Classics',
    'Harper Perennial',
    1960,
    336
),
(
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    '978-0743273565',
    'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan. A portrait of the Jazz Age in all of its decadence and excess, Gatsby captured the spirit of the author''s generation.',
    13.99,
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    35,
    'Fiction - Classics',
    'Scribner',
    1925,
    180
);

-- ============================================
-- FICTION - CONTEMPORARY
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'The Midnight Library',
    'Matt Haig',
    '978-0525559474',
    'Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right. A dazzling novel about all the choices that make up a life.',
    16.99,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    40,
    'Fiction - Contemporary',
    'Viking',
    2020,
    304
),
(
    'Where the Crawdads Sing',
    'Delia Owens',
    '978-0735219090',
    'For years, rumors of the "Marsh Girl" haunted Barkley Cove. Kya Clark is the barefoot girl who survived alone in the wild marsh. A murder mystery, a coming-of-age story, and a love letter to nature.',
    17.99,
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    28,
    'Fiction - Contemporary',
    'G.P. Putnam''s Sons',
    2018,
    384
);

-- ============================================
-- FICTION - MYSTERY & THRILLER
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'The Silent Patient',
    'Alex Michaelides',
    '978-1250301697',
    'Alicia Berenson''s life is seemingly perfect until one night she shoots her husband five times. She never speaks another word. Theo, a forensic psychotherapist, is determined to get her to talk.',
    16.99,
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    32,
    'Fiction - Mystery',
    'Celadon Books',
    2019,
    336
),
(
    'Gone Girl',
    'Gillian Flynn',
    '978-0307588371',
    'On their fifth wedding anniversary, Nick''s wife Amy disappears. Under pressure from the police and media, Nick''s portrait of a blissful union begins to crumble. A masterful thriller.',
    15.99,
    'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400',
    22,
    'Fiction - Mystery',
    'Crown',
    2012,
    432
);

-- ============================================
-- FICTION - SCIENCE FICTION
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Dune',
    'Frank Herbert',
    '978-0441172719',
    'Set on the desert planet Arrakis, Dune is the story of Paul Atreides, heir to a noble family tasked with ruling an inhospitable world. A stunning blend of adventure and mysticism.',
    18.99,
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
    45,
    'Fiction - Science Fiction',
    'Ace',
    1965,
    688
),
(
    'Project Hail Mary',
    'Andy Weir',
    '978-0593135204',
    'Ryland Grace is the sole survivor on a desperate mission. He must conquer an extinction-level threat to our species. From the author of The Martian, a tale of discovery and survival.',
    18.99,
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    38,
    'Fiction - Science Fiction',
    'Ballantine Books',
    2021,
    496
);

-- ============================================
-- NON-FICTION - BIOGRAPHY
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Steve Jobs',
    'Walter Isaacson',
    '978-1451648539',
    'Based on more than forty interviews with Steve Jobs, as well as interviews with family members and colleagues, this is the definitive biography of the Apple co-founder.',
    21.99,
    'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=400',
    18,
    'Non-Fiction - Biography',
    'Simon & Schuster',
    2011,
    656
);

-- ============================================
-- NON-FICTION - HISTORY
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Sapiens: A Brief History of Humankind',
    'Yuval Noah Harari',
    '978-0062316097',
    'From examining the role of myths in mass cooperation to agriculture, science, and the cognitive revolution, Sapiens challenges everything we thought we knew about being human.',
    22.99,
    'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400',
    55,
    'Non-Fiction - History',
    'Harper',
    2015,
    464
);

-- ============================================
-- NON-FICTION - SCIENCE
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'A Brief History of Time',
    'Stephen Hawking',
    '978-0553380163',
    'A landmark volume in science writing, Stephen Hawking''s worldwide bestseller explores such profound questions as: How did the universe begin? What made its start possible?',
    18.99,
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    33,
    'Non-Fiction - Science',
    'Bantam',
    1998,
    212
);

-- ============================================
-- NON-FICTION - SELF-HELP
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Atomic Habits',
    'James Clear',
    '978-0735211292',
    'No matter your goals, Atomic Habits offers a proven framework for improving every day. Learn how tiny changes in behavior can lead to remarkable results.',
    17.99,
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    60,
    'Non-Fiction - Self-Help',
    'Avery',
    2018,
    320
),
(
    'The 7 Habits of Highly Effective People',
    'Stephen R. Covey',
    '978-1982137274',
    'One of the most inspiring and impactful books ever written. This timeless classic presents a principle-centered approach for solving personal and professional problems.',
    18.99,
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    42,
    'Non-Fiction - Self-Help',
    'Simon & Schuster',
    1989,
    464
);

-- ============================================
-- CHILDREN'S BOOKS
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'Charlotte''s Web',
    'E.B. White',
    '978-0061124952',
    'This beloved book is a classic of children''s literature. The tale of Wilbur the pig and Charlotte the spider who saves his life is a story of friendship, loyalty, and love.',
    9.99,
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    48,
    'Children',
    'Harper Collins',
    1952,
    192
),
(
    'The Very Hungry Caterpillar',
    'Eric Carle',
    '978-0399226908',
    'The all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! A beautifully illustrated tale of transformation and growth.',
    8.99,
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    75,
    'Children',
    'Philomel Books',
    1969,
    26
);

-- ============================================
-- YOUNG ADULT
-- ============================================
INSERT INTO products (title, author, isbn, description, price, cover_image_url, stock_quantity, category, publisher, publication_year, page_count) VALUES
(
    'The Hunger Games',
    'Suzanne Collins',
    '978-0439023481',
    'In the ruins of a place once known as North America lies the nation of Panem. Each year, the Capitol forces each district to send a boy and girl to compete in the Hunger Games.',
    14.99,
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
    52,
    'Young Adult',
    'Scholastic Press',
    2008,
    384
),
(
    'Percy Jackson and the Lightning Thief',
    'Rick Riordan',
    '978-0786838653',
    'Percy Jackson is about to be kicked out of boarding school...again. But the gods of Mount Olympus have other plans for him. A thrilling fantasy adventure for young readers.',
    11.99,
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    65,
    'Young Adult',
    'Disney Hyperion',
    2005,
    377
);

-- ============================================
-- Verify seed data
-- ============================================
DO $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products;
    RAISE NOTICE 'Seeded % products successfully!', product_count;
END $$;
