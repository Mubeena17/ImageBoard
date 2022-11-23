DROP TABLE IF EXISTS comments;
CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INT NOT NULL REFERENCES images(id),
    username VARCHAR NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);


INSERT INTO comments (comment, username, image_id) VALUES (
    'this is my first comment',
    'funkychicken',
    '5'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this my second comment',
    'funkychicken',
    '5'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this is my first comment',
    'funkychicken',
    '4'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this my second comment',
    'funkychicken',
    '4'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this is my first comment',
    'funkychicken',
    '3'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this my second comment',
    'funkychicken',
    '3'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this is my first comment',
    'funkychicken',
    '2'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this my second comment',
    'funkychicken',
    '2'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this is my first comment',
    'funkychicken',
    '12'
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'this my second comment',
    'funkychicken',
    '12'
);