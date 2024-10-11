create table "public"."game_states" (
    "game_id" uuid not null,
    "player_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "active_row" smallint not null default '0'::smallint,
    "id" text not null,
    "board_state" text[] not null default '{}'::text[],
    "hints" text[] not null default '{}'::text[]
);


create table "public"."players" (
    "created_at" timestamp with time zone not null default now(),
    "game_id" bigint,
    "connected" boolean default false,
    "last_active" timestamp with time zone,
    "id" uuid not null,
    "name" text
);


alter table "public"."players" enable row level security;

CREATE UNIQUE INDEX game_states_pkey ON public.game_states USING btree (id);

CREATE UNIQUE INDEX players_pkey ON public.players USING btree (id);

alter table "public"."game_states" add constraint "game_states_pkey" PRIMARY KEY using index "game_states_pkey";

alter table "public"."players" add constraint "players_pkey" PRIMARY KEY using index "players_pkey";

alter table "public"."players" add constraint "players_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."players" validate constraint "players_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_secret_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    letters text[] := ARRAY['r', 'b', 'g', 'y', 'p', 'i'];
    secret_code text := '';
    i integer;
BEGIN
    -- Generate a random combination of 4 letters
    FOR i IN 1..4 LOOP
        secret_code := secret_code || letters[1 + floor(random() * array_length(letters, 1))];
    END LOOP;

    -- Insert the generated secret code into the game_secret_codes table
    INSERT INTO public.game_secret_codes (game_id, secret_code)
    VALUES (NEW.id, secret_code);

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.scan_rows(integer[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  x int[];
BEGIN
  FOREACH x SLICE 1 IN ARRAY $1
  LOOP
    RAISE NOTICE 'row = %', x;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.signup_copy_to_users_table()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  BEGIN
    INSERT INTO public.players (id)
    VALUES(new.id);
  
    RETURN NEW;
  END;
$function$
;

CREATE OR REPLACE FUNCTION public."start-game"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Only update the status if the new game is not already 'started' and both players exist
    IF NEW.status != 'started' 
       AND NEW.creator_id IS NOT NULL 
       AND NEW.joiner_id IS NOT NULL THEN
       
        -- Update the game status to 'started'
        UPDATE games
        SET status = 'started'
        WHERE id = NEW.id;
        
        -- Insert an initial game state for the creator
        INSERT INTO game_states (id, game_id, player_id, board_state, hints)
        VALUES (CONCAT(NEW.id::text, '_', NEW.creator_id::text), NEW.id, NEW.creator_id, '{}'::text[], '{}'::smallint[]);
        
        -- Insert an initial game state for the joiner
        INSERT INTO game_states (id, game_id, player_id, board_state, hints)
        VALUES (CONCAT(NEW.id::text, '_', NEW.joiner_id::text), NEW.id, NEW.joiner_id, '{}'::text[],'{}'::smallint[]);

          -- Insert an initial game state for the creator
        INSERT INTO game_states_obfuscated (id, game_id, player_id, board_state, hints)
        VALUES (CONCAT(NEW.id::text, '_', NEW.creator_id::text), NEW.id, NEW.creator_id, '{}'::text[],'{}'::smallint[]);
        
        -- Insert an initial game state for the joiner
        INSERT INTO game_states_obfuscated (id, game_id, player_id, board_state, hints)
        VALUES (CONCAT(NEW.id::text, '_', NEW.joiner_id::text), NEW.id, NEW.joiner_id, '{}'::text[], '{}'::smallint[]);
        
    END IF;

    RETURN NEW;
END;$function$
;

grant delete on table "public"."game_states" to "anon";

grant insert on table "public"."game_states" to "anon";

grant references on table "public"."game_states" to "anon";

grant select on table "public"."game_states" to "anon";

grant trigger on table "public"."game_states" to "anon";

grant truncate on table "public"."game_states" to "anon";

grant update on table "public"."game_states" to "anon";

grant delete on table "public"."game_states" to "authenticated";

grant insert on table "public"."game_states" to "authenticated";

grant references on table "public"."game_states" to "authenticated";

grant select on table "public"."game_states" to "authenticated";

grant trigger on table "public"."game_states" to "authenticated";

grant truncate on table "public"."game_states" to "authenticated";

grant update on table "public"."game_states" to "authenticated";

grant delete on table "public"."game_states" to "service_role";

grant insert on table "public"."game_states" to "service_role";

grant references on table "public"."game_states" to "service_role";

grant select on table "public"."game_states" to "service_role";

grant trigger on table "public"."game_states" to "service_role";

grant truncate on table "public"."game_states" to "service_role";

grant update on table "public"."game_states" to "service_role";

grant delete on table "public"."players" to "anon";

grant insert on table "public"."players" to "anon";

grant references on table "public"."players" to "anon";

grant select on table "public"."players" to "anon";

grant trigger on table "public"."players" to "anon";

grant truncate on table "public"."players" to "anon";

grant update on table "public"."players" to "anon";

grant delete on table "public"."players" to "authenticated";

grant insert on table "public"."players" to "authenticated";

grant references on table "public"."players" to "authenticated";

grant select on table "public"."players" to "authenticated";

grant trigger on table "public"."players" to "authenticated";

grant truncate on table "public"."players" to "authenticated";

grant update on table "public"."players" to "authenticated";

grant delete on table "public"."players" to "service_role";

grant insert on table "public"."players" to "service_role";

grant references on table "public"."players" to "service_role";

grant select on table "public"."players" to "service_role";

grant trigger on table "public"."players" to "service_role";

grant truncate on table "public"."players" to "service_role";

grant update on table "public"."players" to "service_role";

create policy "Enable users to view their own data only"
on "public"."players"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));



