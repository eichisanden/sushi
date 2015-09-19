CREATE TABLE users (
    id serial PRIMARY KEY,
    login_cd text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    email text
);

CREATE TABLE groups (
    id serial PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE user_groups (
    user_id integer PRIMARY KEY,
    group_id integer PRIMARY KEY
);

DROP TABLE IF EXISTS shops;
CREATE TABLE shops (
    id serial PRIMARY KEY,
    name text NOT NULL,
    name_kana text,
    zip text,
    prerecture text,
    address1 text,
    address2 text,
    tel text,
    fax text,
    email text,
    lat text,
    lng text,
    regist_group_id integer
);

CREATE TABLE shop_reports (
    id serial PRIMARY KEY,
    shop_id integer NOT NULL,
    report_time timestamp without time zone NOT NULL,
    comment text,
    stars real
);
