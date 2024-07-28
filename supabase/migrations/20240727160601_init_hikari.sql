create type "public"."team_role" as enum ('admin', 'member');

create sequence "public"."user_email_list_id_seq";

create table "public"."team_memberships" (
    "user_id" uuid not null,
    "team_id" uuid not null,
    "role" team_role not null
);


create table "public"."teams" (
    "id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now(),
    "icon" text
);


create table "public"."user_email_list" (
    "id" integer not null default nextval('user_email_list_id_seq'::regclass),
    "email" character varying(255) not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."user_email_list" enable row level security;

alter sequence "public"."user_email_list_id_seq" owned by "public"."user_email_list"."id";

CREATE UNIQUE INDEX team_memberships_pkey ON public.team_memberships USING btree (user_id, team_id);

CREATE UNIQUE INDEX teams_id_key ON public.teams USING btree (id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX user_email_list_email_key ON public.user_email_list USING btree (email);

CREATE UNIQUE INDEX user_email_list_pkey ON public.user_email_list USING btree (id);

alter table "public"."team_memberships" add constraint "team_memberships_pkey" PRIMARY KEY using index "team_memberships_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."user_email_list" add constraint "user_email_list_pkey" PRIMARY KEY using index "user_email_list_pkey";

alter table "public"."team_memberships" add constraint "team_memberships_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."team_memberships" validate constraint "team_memberships_team_id_fkey";

alter table "public"."team_memberships" add constraint "team_memberships_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."team_memberships" validate constraint "team_memberships_user_id_fkey";

alter table "public"."teams" add constraint "teams_id_key" UNIQUE using index "teams_id_key";

alter table "public"."user_email_list" add constraint "user_email_list_email_key" UNIQUE using index "user_email_list_email_key";

grant delete on table "public"."team_memberships" to "anon";

grant insert on table "public"."team_memberships" to "anon";

grant references on table "public"."team_memberships" to "anon";

grant select on table "public"."team_memberships" to "anon";

grant trigger on table "public"."team_memberships" to "anon";

grant truncate on table "public"."team_memberships" to "anon";

grant update on table "public"."team_memberships" to "anon";

grant delete on table "public"."team_memberships" to "authenticated";

grant insert on table "public"."team_memberships" to "authenticated";

grant references on table "public"."team_memberships" to "authenticated";

grant select on table "public"."team_memberships" to "authenticated";

grant trigger on table "public"."team_memberships" to "authenticated";

grant truncate on table "public"."team_memberships" to "authenticated";

grant update on table "public"."team_memberships" to "authenticated";

grant delete on table "public"."team_memberships" to "service_role";

grant insert on table "public"."team_memberships" to "service_role";

grant references on table "public"."team_memberships" to "service_role";

grant select on table "public"."team_memberships" to "service_role";

grant trigger on table "public"."team_memberships" to "service_role";

grant truncate on table "public"."team_memberships" to "service_role";

grant update on table "public"."team_memberships" to "service_role";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

grant delete on table "public"."user_email_list" to "anon";

grant insert on table "public"."user_email_list" to "anon";

grant references on table "public"."user_email_list" to "anon";

grant select on table "public"."user_email_list" to "anon";

grant trigger on table "public"."user_email_list" to "anon";

grant truncate on table "public"."user_email_list" to "anon";

grant update on table "public"."user_email_list" to "anon";

grant delete on table "public"."user_email_list" to "authenticated";

grant insert on table "public"."user_email_list" to "authenticated";

grant references on table "public"."user_email_list" to "authenticated";

grant select on table "public"."user_email_list" to "authenticated";

grant trigger on table "public"."user_email_list" to "authenticated";

grant truncate on table "public"."user_email_list" to "authenticated";

grant update on table "public"."user_email_list" to "authenticated";

grant delete on table "public"."user_email_list" to "service_role";

grant insert on table "public"."user_email_list" to "service_role";

grant references on table "public"."user_email_list" to "service_role";

grant select on table "public"."user_email_list" to "service_role";

grant trigger on table "public"."user_email_list" to "service_role";

grant truncate on table "public"."user_email_list" to "service_role";

grant update on table "public"."user_email_list" to "service_role";

create policy "Allow insert on user_email_list"
on "public"."user_email_list"
as permissive
for insert
to public
with check (true);


create policy "Deny select on user_email_list"
on "public"."user_email_list"
as permissive
for select
to public
using (false);



