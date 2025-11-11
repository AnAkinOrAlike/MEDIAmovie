-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.CATEGORIA (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  categoria text NOT NULL,
  duracion text,
  corto text,
  visto text,
  CONSTRAINT CATEGORIA_pkey PRIMARY KEY (id)
);

CREATE TABLE public.COMPAÑIA (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  hogar text NOT NULL,
  CONSTRAINT COMPAÑIA_pkey PRIMARY KEY (id)
);

CREATE TABLE public.COUNTRY (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  country text NOT NULL,
  lenguaje text,
  CONSTRAINT COUNTRY_pkey PRIMARY KEY (id)
);

CREATE TABLE public.DIRECTORES (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  artist text NOT NULL,
  CONSTRAINT DIRECTORES_pkey PRIMARY KEY (id)
);

CREATE TABLE public.MEDIA (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text DEFAULT 'NULL'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  year numeric DEFAULT '2000'::numeric,
  duracion numeric DEFAULT '1'::numeric,
  imagen text,
  colorhex text DEFAULT '#070707'::text,
  visto boolean DEFAULT false,
  id_director bigint DEFAULT '1'::bigint,
  id_compania bigint DEFAULT '1'::bigint,
  id_categoria bigint DEFAULT '1'::bigint,
  id_country bigint DEFAULT '1'::bigint,
  CONSTRAINT MEDIA_pkey PRIMARY KEY (id),
  CONSTRAINT MEDIA_id_director_fkey FOREIGN KEY (id_director) REFERENCES public.DIRECTORES(id),
  CONSTRAINT MEDIA_id_compania_fkey FOREIGN KEY (id_compania) REFERENCES public.COMPAÑIA(id),
  CONSTRAINT MEDIA_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.CATEGORIA(id),
  CONSTRAINT MEDIA_id_country_fkey FOREIGN KEY (id_country) REFERENCES public.COUNTRY(id)
);

CREATE TABLE public.VISTOS (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  stars numeric DEFAULT '0'::numeric,
  ultimo_visto date DEFAULT '2011-01-11'::date,
  id_media bigint,
  CONSTRAINT VISTOS_pkey PRIMARY KEY (id),
  CONSTRAINT VISTOS_id_media_fkey FOREIGN KEY (id_media) REFERENCES public.MEDIA(id)
);

CREATE TABLE public.MARCHA (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  avance numeric NOT NULL DEFAULT '0'::numeric,
  id_media bigint,
  created_at timestamp with time zone,
  ultimo_visto date,
  CONSTRAINT MARCHA_pkey PRIMARY KEY (id),
  CONSTRAINT marcha_id_media_fkey FOREIGN KEY (id_media) REFERENCES public.MEDIA(id)
);

-- Views to create...

create view public.mediamarcha as
select
  m.nombre,
  m.year,
  m.duracion,
  m.imagen,
  m.colorhex,
  c.duracion as typedur,
  c.categoria,
  c.corto,
  c.visto as catvisto,
  d.artist as director,
  h.hogar as compania,
  p.country,
  p.lenguaje,
  v.avance,
  v.ultimo_visto
from
  "MEDIA" m
  left join "CATEGORIA" c on m.id_categoria = c.id
  left join "DIRECTORES" d on m.id_director = d.id
  left join "COMPAÑIA" h on m.id_compania = h.id
  left join "MARCHA" v on m.id = v.id_media
  left join "COUNTRY" p on m.id_country = p.id
where
  m.visto = false;

create view public.mediavistos as
select
  m.nombre,
  m.year,
  m.duracion,
  m.imagen,
  m.colorhex,
  c.duracion as typedur,
  c.categoria,
  c.corto,
  c.visto as catvisto,
  d.artist as director,
  h.hogar as compania,
  p.country,
  p.lenguaje,
  v.stars,
  v.ultimo_visto
from
  "MEDIA" m
  left join "CATEGORIA" c on m.id_categoria = c.id
  left join "DIRECTORES" d on m.id_director = d.id
  left join "COMPAÑIA" h on m.id_compania = h.id
  left join "VISTOS" v on m.id = v.id_media
  left join "COUNTRY" p on m.id_country = p.id
where
  m.visto = true;
