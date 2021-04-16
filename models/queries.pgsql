CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  
DROP TABLE If exists conversation;
DROP TABLE If exists Messages;
DROP TABLE If exists participants;
DROP TABLE If exists users;

Create table if NOT EXISTS users(
	Id uuid default uuid_generate_v4() Primary key,
	username varchar(255) Not null,
	password varchar(255) not null,
	email varchar(255) not null unique,
	avatar_url varchar(255) ,
    state bool DEFAULT FALSE not null,
    Created_At TIMESTAMPTZ DEFAULT now()
);
-- CREATE INDEX users(username);

CREATE TABLE if NOT EXISTS Messages(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text NOT NULL,
    user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
    conversation_id uuid NOT NULL  ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE if NOT EXISTS conversation(
    conversation_id uuid default uuid_generate_v4() PRIMARY KEY
);
CREATE TABLE participants (
    user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
    conversation_id uuid NOT NULL REFERENCES conversation ON DELETE CASCADE,
    messages_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, conversation_id)
);

ALTER TABLE Messages
Add CONSTRAINT fk_coversation_id FOREIGN KEY (conversation_id) REFERENCES conversation ON DELETE CASCADE;

-- SELECT pg_size_pretty( pg_total_relation_size('messages') );