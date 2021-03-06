PGDMP         3                z         	   bookstore    14.2    14.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16470 	   bookstore    DATABASE     T   CREATE DATABASE bookstore WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE bookstore;
                postgres    false            ?            1259    16487    author_id_seq    SEQUENCE     |   CREATE SEQUENCE public.author_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999
    CACHE 1;
 $   DROP SEQUENCE public.author_id_seq;
       public          postgres    false            ?            1259    16482    Author    TABLE     h  CREATE TABLE public."Author" (
    "Author_ID" integer DEFAULT nextval('public.author_id_seq'::regclass) NOT NULL,
    "Name" text NOT NULL,
    "Pen_Name" text NOT NULL,
    "Email" text NOT NULL,
    "Is_Disabled" boolean DEFAULT false NOT NULL,
    "Created_Time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Password" text NOT NULL
);
    DROP TABLE public."Author";
       public         heap    postgres    false    210            ?            1259    16506    book_id_seq    SEQUENCE     }   CREATE SEQUENCE public.book_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
 "   DROP SEQUENCE public.book_id_seq;
       public          postgres    false            ?            1259    16492    Book    TABLE     t  CREATE TABLE public."Book" (
    "Book_ID" integer DEFAULT nextval('public.book_id_seq'::regclass) NOT NULL,
    "Title" text NOT NULL,
    "Author_ID" integer NOT NULL,
    "Summary" text NOT NULL,
    "Stock" integer NOT NULL,
    "Price" integer NOT NULL,
    "Cover_URL" text NOT NULL,
    "Created_Time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."Book";
       public         heap    postgres    false    213            ?            1259    16507    sales_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
 #   DROP SEQUENCE public.sales_id_seq;
       public          postgres    false            ?            1259    16499    Sales    TABLE     ?  CREATE TABLE public."Sales" (
    "Sales_ID" integer DEFAULT nextval('public.sales_id_seq'::regclass) NOT NULL,
    "Recipient_Name" text NOT NULL,
    "Recipient_Email" text NOT NULL,
    "Book_Title" text NOT NULL,
    "Author_ID" integer NOT NULL,
    "Quantity" integer NOT NULL,
    "Price_Per_Unit" integer NOT NULL,
    "Price_Total" integer NOT NULL,
    "Created_Time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."Sales";
       public         heap    postgres    false    214            ?            1259    16527    token_id_seq    SEQUENCE     }   CREATE SEQUENCE public.token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999
    CACHE 1;
 #   DROP SEQUENCE public.token_id_seq;
       public          postgres    false            ?            1259    16520    Token    TABLE     ?   CREATE TABLE public."Token" (
    "Token_ID" integer DEFAULT nextval('public.token_id_seq'::regclass) NOT NULL,
    "Refresh_Token" text NOT NULL
);
    DROP TABLE public."Token";
       public         heap    postgres    false    216                      0    16482    Author 
   TABLE DATA           w   COPY public."Author" ("Author_ID", "Name", "Pen_Name", "Email", "Is_Disabled", "Created_Time", "Password") FROM stdin;
    public          postgres    false    209   6                 0    16492    Book 
   TABLE DATA           {   COPY public."Book" ("Book_ID", "Title", "Author_ID", "Summary", "Stock", "Price", "Cover_URL", "Created_Time") FROM stdin;
    public          postgres    false    211   S                 0    16499    Sales 
   TABLE DATA           ?   COPY public."Sales" ("Sales_ID", "Recipient_Name", "Recipient_Email", "Book_Title", "Author_ID", "Quantity", "Price_Per_Unit", "Price_Total", "Created_Time") FROM stdin;
    public          postgres    false    212   p                 0    16520    Token 
   TABLE DATA           >   COPY public."Token" ("Token_ID", "Refresh_Token") FROM stdin;
    public          postgres    false    215   ?                   0    0    author_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.author_id_seq', 1, true);
          public          postgres    false    210            !           0    0    book_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.book_id_seq', 1, true);
          public          postgres    false    213            "           0    0    sales_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.sales_id_seq', 1, true);
          public          postgres    false    214            #           0    0    token_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.token_id_seq', 1, true);
          public          postgres    false    216            ~           2606    16486    Author Author_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public."Author"
    ADD CONSTRAINT "Author_pkey" PRIMARY KEY ("Author_ID");
 @   ALTER TABLE ONLY public."Author" DROP CONSTRAINT "Author_pkey";
       public            postgres    false    209            ?           2606    16498    Book Book_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("Book_ID");
 <   ALTER TABLE ONLY public."Book" DROP CONSTRAINT "Book_pkey";
       public            postgres    false    211            ?           2606    16505    Sales Sales_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_pkey" PRIMARY KEY ("Sales_ID");
 >   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT "Sales_pkey";
       public            postgres    false    212            ?           2606    16526    Token Token_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Token"
    ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("Token_ID");
 >   ALTER TABLE ONLY public."Token" DROP CONSTRAINT "Token_pkey";
       public            postgres    false    215            ?           2606    16510    Book fk_author    FK CONSTRAINT     ?   ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT fk_author FOREIGN KEY ("Author_ID") REFERENCES public."Author"("Author_ID") NOT VALID;
 :   ALTER TABLE ONLY public."Book" DROP CONSTRAINT fk_author;
       public          postgres    false    209    211    3454            ?           2606    16515    Sales fk_author    FK CONSTRAINT     ?   ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT fk_author FOREIGN KEY ("Author_ID") REFERENCES public."Author"("Author_ID") NOT VALID;
 ;   ALTER TABLE ONLY public."Sales" DROP CONSTRAINT fk_author;
       public          postgres    false    212    209    3454                  x?????? ? ?            x?????? ? ?            x?????? ? ?            x?????? ? ?     