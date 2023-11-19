# Site Generator

export NODE_OPTIONS=--openssl-legacy-provider
ng serve


## PostgreSQL

docker run --name postgres -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres

docker run -it --rm --network host postgres psql -h localhost -p 5432 -U postgres


chcp 1252

psql -h localhost -p 5432 -U postgres -W root

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    data JSONB
);