PGDMP                      }            cm_shoes_care    17.4    17.4 �    \           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ]           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            ^           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            _           1262    16388    cm_shoes_care    DATABASE     s   CREATE DATABASE cm_shoes_care WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE cm_shoes_care;
                     postgres    false            `           0    0    DATABASE cm_shoes_care    ACL     .   GRANT ALL ON DATABASE cm_shoes_care TO admin;
                        postgres    false    4959            �            1259    16444    admins    TABLE     �   CREATE TABLE public.admins (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    branch_id integer
);
    DROP TABLE public.admins;
       public         heap r       postgres    false            a           0    0    TABLE admins    ACL     +   GRANT ALL ON TABLE public.admins TO admin;
          public               postgres    false    222            �            1259    16443    admins_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.admins_id_seq;
       public               postgres    false    222            b           0    0    admins_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;
          public               postgres    false    221            c           0    0    SEQUENCE admins_id_seq    ACL     5   GRANT ALL ON SEQUENCE public.admins_id_seq TO admin;
          public               postgres    false    221            �            1259    16456    appointments    TABLE       CREATE TABLE public.appointments (
    id integer NOT NULL,
    customer_name character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    location text NOT NULL,
    shoe_count integer NOT NULL,
    appointment_date date NOT NULL,
    appointment_time time without time zone NOT NULL,
    status character varying(100) DEFAULT 'รอดำเนินการ'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer,
    queue_id integer
);
     DROP TABLE public.appointments;
       public         heap r       postgres    false            d           0    0    TABLE appointments    ACL     1   GRANT ALL ON TABLE public.appointments TO admin;
          public               postgres    false    224            �            1259    16455    appointments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.appointments_id_seq;
       public               postgres    false    224            e           0    0    appointments_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;
          public               postgres    false    223            f           0    0    SEQUENCE appointments_id_seq    ACL     ;   GRANT ALL ON SEQUENCE public.appointments_id_seq TO admin;
          public               postgres    false    223            �            1259    49157    branches    TABLE     �   CREATE TABLE public.branches (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    location text,
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.branches;
       public         heap r       postgres    false            g           0    0    TABLE branches    ACL     E   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.branches TO admin;
          public               postgres    false    236            �            1259    49156    branches_id_seq    SEQUENCE     �   CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.branches_id_seq;
       public               postgres    false    236            h           0    0    branches_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;
          public               postgres    false    235            i           0    0    SEQUENCE branches_id_seq    ACL     7   GRANT ALL ON SEQUENCE public.branches_id_seq TO admin;
          public               postgres    false    235            �            1259    16391 	   customers    TABLE     �   CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    location text,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.customers;
       public         heap r       postgres    false            j           0    0    TABLE customers    ACL     .   GRANT ALL ON TABLE public.customers TO admin;
          public               postgres    false    218            �            1259    16390    customers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.customers_id_seq;
       public               postgres    false    218            k           0    0    customers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;
          public               postgres    false    217            l           0    0    SEQUENCE customers_id_seq    ACL     8   GRANT ALL ON SEQUENCE public.customers_id_seq TO admin;
          public               postgres    false    217            �            1259    49192 	   employees    TABLE     v  CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    role character varying(50) DEFAULT 'staff'::character varying NOT NULL,
    branch_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password text
);
    DROP TABLE public.employees;
       public         heap r       postgres    false            m           0    0    TABLE employees    ACL     F   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.employees TO admin;
          public               postgres    false    238            �            1259    49191    employees_id_seq    SEQUENCE     �   CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.employees_id_seq;
       public               postgres    false    238            n           0    0    employees_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;
          public               postgres    false    237            o           0    0    SEQUENCE employees_id_seq    ACL     8   GRANT ALL ON SEQUENCE public.employees_id_seq TO admin;
          public               postgres    false    237            �            1259    57350    expenses    TABLE     �   CREATE TABLE public.expenses (
    id integer NOT NULL,
    queue_id integer NOT NULL,
    description text NOT NULL,
    amount numeric(10,2) NOT NULL
);
    DROP TABLE public.expenses;
       public         heap r       postgres    false            p           0    0    TABLE expenses    ACL     E   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.expenses TO admin;
          public               postgres    false    240            �            1259    57349    expenses_id_seq    SEQUENCE     �   CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.expenses_id_seq;
       public               postgres    false    240            q           0    0    expenses_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;
          public               postgres    false    239            r           0    0    SEQUENCE expenses_id_seq    ACL     7   GRANT ALL ON SEQUENCE public.expenses_id_seq TO admin;
          public               postgres    false    239            �            1259    32773    invoices    TABLE     �  CREATE TABLE public.invoices (
    id integer NOT NULL,
    queue_id integer,
    total_price numeric(10,2) DEFAULT 0 NOT NULL,
    additional_costs jsonb DEFAULT '[]'::jsonb,
    discount numeric(10,2) DEFAULT 0,
    final_price numeric(10,2) DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.invoices;
       public         heap r       postgres    false            �            1259    32772    invoices_id_seq    SEQUENCE     �   CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.invoices_id_seq;
       public               postgres    false    232            s           0    0    invoices_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;
          public               postgres    false    231            �            1259    41009    payments    TABLE     �  CREATE TABLE public.payments (
    id integer NOT NULL,
    queue_id integer NOT NULL,
    discount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    payment_method character varying(50),
    payment_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    payment_status character varying(20) DEFAULT 'pending'::character varying
);
    DROP TABLE public.payments;
       public         heap r       postgres    false            t           0    0    TABLE payments    ACL     E   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payments TO admin;
          public               postgres    false    234            �            1259    41008    payments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.payments_id_seq;
       public               postgres    false    234            u           0    0    payments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;
          public               postgres    false    233            v           0    0    SEQUENCE payments_id_seq    ACL     7   GRANT ALL ON SEQUENCE public.payments_id_seq TO admin;
          public               postgres    false    233            �            1259    73738    payouts    TABLE     b  CREATE TABLE public.payouts (
    id integer NOT NULL,
    payout_type character varying(50) NOT NULL,
    description text NOT NULL,
    amount numeric(10,2) NOT NULL,
    branch_id integer NOT NULL,
    employee_id integer NOT NULL,
    notes text,
    payout_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.payouts;
       public         heap r       postgres    false            w           0    0    TABLE payouts    ACL     ,   GRANT ALL ON TABLE public.payouts TO admin;
          public               postgres    false    242            �            1259    73737    payouts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.payouts_id_seq;
       public               postgres    false    242            x           0    0    payouts_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.payouts_id_seq OWNED BY public.payouts.id;
          public               postgres    false    241            y           0    0    SEQUENCE payouts_id_seq    ACL     ?   GRANT SELECT,USAGE ON SEQUENCE public.payouts_id_seq TO admin;
          public               postgres    false    241            �            1259    16483    queue    TABLE     7  CREATE TABLE public.queue (
    id integer NOT NULL,
    customer_name character varying(255) NOT NULL,
    phone character varying(20),
    location character varying(255) DEFAULT 'Walk-in'::character varying,
    total_pairs integer NOT NULL,
    total_price numeric(10,2) DEFAULT NULL::numeric,
    delivery_date date NOT NULL,
    status character varying(50) DEFAULT 'รับเข้า'::character varying NOT NULL,
    received_date date DEFAULT now(),
    branch_id integer,
    payment_status character varying(20) DEFAULT 'pending'::character varying
);
    DROP TABLE public.queue;
       public         heap r       postgres    false            z           0    0    TABLE queue    ACL     B   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.queue TO admin;
          public               postgres    false    228            �            1259    16482    queue_id_seq    SEQUENCE     �   CREATE SEQUENCE public.queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.queue_id_seq;
       public               postgres    false    228            {           0    0    queue_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.queue_id_seq OWNED BY public.queue.id;
          public               postgres    false    227            |           0    0    SEQUENCE queue_id_seq    ACL     =   GRANT SELECT,USAGE ON SEQUENCE public.queue_id_seq TO admin;
          public               postgres    false    227            �            1259    16495    queue_items    TABLE     �  CREATE TABLE public.queue_items (
    id integer NOT NULL,
    queue_id integer,
    service_id integer,
    price_per_pair numeric(10,2) NOT NULL,
    brand character varying(255),
    model character varying(255),
    color character varying(100),
    notes text,
    image_front text,
    image_back text,
    image_left text,
    image_right text,
    image_top text,
    image_bottom text,
    image_before_front text,
    image_before_back text,
    image_before_left text,
    image_before_right text,
    image_before_top text,
    image_before_bottom text,
    image_after_front text,
    image_after_back text,
    image_after_left text,
    image_after_right text,
    image_after_top text,
    image_after_bottom text
);
    DROP TABLE public.queue_items;
       public         heap r       postgres    false            }           0    0    TABLE queue_items    ACL     H   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.queue_items TO admin;
          public               postgres    false    230            �            1259    16494    queue_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.queue_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.queue_items_id_seq;
       public               postgres    false    230            ~           0    0    queue_items_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.queue_items_id_seq OWNED BY public.queue_items.id;
          public               postgres    false    229                       0    0    SEQUENCE queue_items_id_seq    ACL     C   GRANT SELECT,USAGE ON SEQUENCE public.queue_items_id_seq TO admin;
          public               postgres    false    229            �            1259    16476    services    TABLE     �   CREATE TABLE public.services (
    id integer NOT NULL,
    service_name character varying(255) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    description text,
    branch_id integer
);
    DROP TABLE public.services;
       public         heap r       postgres    false            �           0    0    TABLE services    ACL     E   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.services TO admin;
          public               postgres    false    226            �            1259    16475    services_id_seq    SEQUENCE     �   CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.services_id_seq;
       public               postgres    false    226            �           0    0    services_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;
          public               postgres    false    225            �           0    0    SEQUENCE services_id_seq    ACL     @   GRANT SELECT,USAGE ON SEQUENCE public.services_id_seq TO admin;
          public               postgres    false    225            �            1259    16433    transactions    TABLE     �  CREATE TABLE public.transactions (
    id integer NOT NULL,
    type character varying(10) NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    branch_id integer,
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);
     DROP TABLE public.transactions;
       public         heap r       postgres    false            �           0    0    TABLE transactions    ACL     1   GRANT ALL ON TABLE public.transactions TO admin;
          public               postgres    false    220            �            1259    16432    transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transactions_id_seq;
       public               postgres    false    220            �           0    0    transactions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
          public               postgres    false    219            �           0    0    SEQUENCE transactions_id_seq    ACL     ;   GRANT ALL ON SEQUENCE public.transactions_id_seq TO admin;
          public               postgres    false    219            a           2604    16447 	   admins id    DEFAULT     f   ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);
 8   ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            b           2604    16459    appointments id    DEFAULT     r   ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);
 >   ALTER TABLE public.appointments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            y           2604    49160    branches id    DEFAULT     j   ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);
 :   ALTER TABLE public.branches ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    236    236            ]           2604    16394    customers id    DEFAULT     l   ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);
 ;   ALTER TABLE public.customers ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            {           2604    49195    employees id    DEFAULT     l   ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);
 ;   ALTER TABLE public.employees ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    238    238            ~           2604    57353    expenses id    DEFAULT     j   ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);
 :   ALTER TABLE public.expenses ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    240    239    240            m           2604    32776    invoices id    DEFAULT     j   ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);
 :   ALTER TABLE public.invoices ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231    232            t           2604    41012    payments id    DEFAULT     j   ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
 :   ALTER TABLE public.payments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    234    234                       2604    73741 
   payouts id    DEFAULT     h   ALTER TABLE ONLY public.payouts ALTER COLUMN id SET DEFAULT nextval('public.payouts_id_seq'::regclass);
 9   ALTER TABLE public.payouts ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    242    241    242            f           2604    16486    queue id    DEFAULT     d   ALTER TABLE ONLY public.queue ALTER COLUMN id SET DEFAULT nextval('public.queue_id_seq'::regclass);
 7   ALTER TABLE public.queue ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            l           2604    16498    queue_items id    DEFAULT     p   ALTER TABLE ONLY public.queue_items ALTER COLUMN id SET DEFAULT nextval('public.queue_items_id_seq'::regclass);
 =   ALTER TABLE public.queue_items ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            e           2604    16479    services id    DEFAULT     j   ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);
 :   ALTER TABLE public.services ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            _           2604    16436    transactions id    DEFAULT     r   ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);
 >   ALTER TABLE public.transactions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            E          0    16444    admins 
   TABLE DATA           @   COPY public.admins (id, email, password, branch_id) FROM stdin;
    public               postgres    false    222   /�       G          0    16456    appointments 
   TABLE DATA           �   COPY public.appointments (id, customer_name, phone, location, shoe_count, appointment_date, appointment_time, status, created_at, branch_id, queue_id) FROM stdin;
    public               postgres    false    224   ��       S          0    49157    branches 
   TABLE DATA           I   COPY public.branches (id, name, location, phone, created_at) FROM stdin;
    public               postgres    false    236   O�       A          0    16391 	   customers 
   TABLE DATA           J   COPY public.customers (id, name, phone, location, created_at) FROM stdin;
    public               postgres    false    218   ԣ       U          0    49192 	   employees 
   TABLE DATA           b   COPY public.employees (id, name, email, phone, role, branch_id, created_at, password) FROM stdin;
    public               postgres    false    238   7�       W          0    57350    expenses 
   TABLE DATA           E   COPY public.expenses (id, queue_id, description, amount) FROM stdin;
    public               postgres    false    240   ��       O          0    32773    invoices 
   TABLE DATA           z   COPY public.invoices (id, queue_id, total_price, additional_costs, discount, final_price, status, created_at) FROM stdin;
    public               postgres    false    232   c�       Q          0    41009    payments 
   TABLE DATA           �   COPY public.payments (id, queue_id, discount, total_amount, payment_method, payment_date, created_at, payment_status) FROM stdin;
    public               postgres    false    234   ��       Y          0    73738    payouts 
   TABLE DATA              COPY public.payouts (id, payout_type, description, amount, branch_id, employee_id, notes, payout_date, created_at) FROM stdin;
    public               postgres    false    242   :�       K          0    16483    queue 
   TABLE DATA           �   COPY public.queue (id, customer_name, phone, location, total_pairs, total_price, delivery_date, status, received_date, branch_id, payment_status) FROM stdin;
    public               postgres    false    228   u�       M          0    16495    queue_items 
   TABLE DATA           �  COPY public.queue_items (id, queue_id, service_id, price_per_pair, brand, model, color, notes, image_front, image_back, image_left, image_right, image_top, image_bottom, image_before_front, image_before_back, image_before_left, image_before_right, image_before_top, image_before_bottom, image_after_front, image_after_back, image_after_left, image_after_right, image_after_top, image_after_bottom) FROM stdin;
    public               postgres    false    230   ��       I          0    16476    services 
   TABLE DATA           X   COPY public.services (id, service_name, base_price, description, branch_id) FROM stdin;
    public               postgres    false    226   �       C          0    16433    transactions 
   TABLE DATA           \   COPY public.transactions (id, type, amount, description, created_at, branch_id) FROM stdin;
    public               postgres    false    220   �       �           0    0    admins_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.admins_id_seq', 11, true);
          public               postgres    false    221            �           0    0    appointments_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.appointments_id_seq', 34, true);
          public               postgres    false    223            �           0    0    branches_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.branches_id_seq', 4, true);
          public               postgres    false    235            �           0    0    customers_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.customers_id_seq', 1, true);
          public               postgres    false    217            �           0    0    employees_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.employees_id_seq', 49, true);
          public               postgres    false    237            �           0    0    expenses_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.expenses_id_seq', 21, true);
          public               postgres    false    239            �           0    0    invoices_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);
          public               postgres    false    231            �           0    0    payments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.payments_id_seq', 32, true);
          public               postgres    false    233            �           0    0    payouts_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.payouts_id_seq', 16, true);
          public               postgres    false    241            �           0    0    queue_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.queue_id_seq', 72, true);
          public               postgres    false    227            �           0    0    queue_items_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.queue_items_id_seq', 154, true);
          public               postgres    false    229            �           0    0    services_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.services_id_seq', 28, true);
          public               postgres    false    225            �           0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);
          public               postgres    false    219            �           2606    16453    admins admins_email_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);
 A   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_email_key;
       public                 postgres    false    222            �           2606    16451    admins admins_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
       public                 postgres    false    222            �           2606    16465    appointments appointments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_pkey;
       public                 postgres    false    224            �           2606    49165    branches branches_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.branches DROP CONSTRAINT branches_pkey;
       public                 postgres    false    236            �           2606    16401    customers customers_phone_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_phone_key;
       public                 postgres    false    218            �           2606    16399    customers customers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public                 postgres    false    218            �           2606    49203    employees employees_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_email_key;
       public                 postgres    false    238            �           2606    49201    employees employees_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_pkey;
       public                 postgres    false    238            �           2606    57358    expenses expenses_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.expenses DROP CONSTRAINT expenses_pkey;
       public                 postgres    false    240            �           2606    32786    invoices invoices_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_pkey;
       public                 postgres    false    232            �           2606    41019    payments payments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public                 postgres    false    234            �           2606    73746    payouts payouts_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.payouts DROP CONSTRAINT payouts_pkey;
       public                 postgres    false    242            �           2606    16500    queue_items queue_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.queue_items DROP CONSTRAINT queue_items_pkey;
       public                 postgres    false    230            �           2606    16493    queue queue_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.queue DROP CONSTRAINT queue_pkey;
       public                 postgres    false    228            �           2606    16481    services services_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.services DROP CONSTRAINT services_pkey;
       public                 postgres    false    226            �           2606    16442    transactions transactions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public                 postgres    false    220            �           2606    49186    admins admins_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);
 F   ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_branch_id_fkey;
       public               postgres    false    222    236    4761            �           2606    49166 (   appointments appointments_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);
 R   ALTER TABLE ONLY public.appointments DROP CONSTRAINT appointments_branch_id_fkey;
       public               postgres    false    236    4761    224            �           2606    49204 "   employees employees_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.employees DROP CONSTRAINT employees_branch_id_fkey;
       public               postgres    false    236    238    4761            �           2606    57364    expenses expenses_queue_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.expenses DROP CONSTRAINT expenses_queue_id_fkey;
       public               postgres    false    4753    228    240            �           2606    65541 "   appointments fk_appointments_queue    FK CONSTRAINT     �   ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_queue FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.appointments DROP CONSTRAINT fk_appointments_queue;
       public               postgres    false    224    228    4753            �           2606    32787    invoices invoices_queue_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_queue_id_fkey;
       public               postgres    false    228    4753    232            �           2606    41020    payments payments_queue_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_queue_id_fkey;
       public               postgres    false    228    234    4753            �           2606    73747    payouts payouts_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.payouts DROP CONSTRAINT payouts_branch_id_fkey;
       public               postgres    false    4761    236    242            �           2606    49171    queue queue_branch_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);
 D   ALTER TABLE ONLY public.queue DROP CONSTRAINT queue_branch_id_fkey;
       public               postgres    false    236    4761    228            �           2606    16501 %   queue_items queue_items_queue_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.queue_items DROP CONSTRAINT queue_items_queue_id_fkey;
       public               postgres    false    4753    230    228            �           2606    16506 '   queue_items queue_items_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);
 Q   ALTER TABLE ONLY public.queue_items DROP CONSTRAINT queue_items_service_id_fkey;
       public               postgres    false    226    4751    230            �           2606    73732     services services_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.services DROP CONSTRAINT services_branch_id_fkey;
       public               postgres    false    236    4761    226            �           2606    49176 (   transactions transactions_branch_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);
 R   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_branch_id_fkey;
       public               postgres    false    4761    236    220            E   Z  x�}�=s�@�~5�@g ** 0"cs�	��rp��Dc�L&�f�}fw_��e��]�?���s��՘�$ȉ��[��eE�pY�Q���^�)'J�^W�,2��|v��++T�6�� ��DS�9,���ȗ�̱��]�0�B���i+���ÕH���(S��a<
L�,�"��]�"@��ү-�"4�9�[]�s�T<�q�N�t�y�Z�ɮi�]!UA���-�5��E��@٫�"9%g�X}� ��9`�����;PdO�9��do�zGD�*t�5�/�7!5���g,���<J��!bŬԀj1OZ7Ť]z�n�W��a������; >�-ϲ�矸      G   �  x����jA��5O�/�CUwWOw?���I ��.�d�Y�j@���- z4��1*��M=�5����L��)���������tz0}�{�<<\,_�#�o%������Kw,���X0hx�v�($D��u��L�������Ę��m��2;���G
gGl\d�����kr��I�n��a�D��pe	ڶ�����^f@W���Jə��O7����H��n��cB��jj����Ǖ��D]�d:����0���JwM~�I���ҝH�r�dL�G�$��r�]|�8����R?��j�`�u4d�F��2 ��Vm�Q�e��C��l-5�/�m�M�R��̼�O�C��4�8W!��|04׿s��;�MU�M����{`�W[��]�6$�����Yd��UU�W�U�      S   u   x�=�1�0 ��yE>��ql'�����d@`��T������#8�}���p�}Y�Ofl�Y�M��d�2a��z�Θ�rm�q�-�W_�/ߏ �������:k璚�J�B�?��      A   S   x�3�����Sp�O�4��4426153�t��L�KW�M��Q�H��I�K�4202�50�52V00�22�2�Գ03766����� �=�      U   �  x�u�Ks�@ �3��=x�0���LX���A���0�>����hL��n��{�uu��J�\i����GQ��%e�a��O�jS~���`�	�I�2�h:k�X����5�����6
���ګ���2�!��"�ܣ�.�#���Ҫ\�\�y!�3�%�7r�p��Q�Nի�6�t^�ؚX�k؝ 4qO�0w2odN,	�~�=�l���T�`_Z�D%�/�W�M�
���\�j,[Q���}��k�}��������:~���"h��	+�r�⽩é�����䲖�Nd�-���P �J�Q>�+��P�N���Mgpl?[ȩ6~j������QG����1<��y��2������p
��*4��8ǜ~
в���Y�8tۅU�ȡLe����4/�P�����[:Svx`�U9�#]�� $��W      W   ^   x�}˱�0D���v�]X&0%���G�m�;��g��m����nW(MD�
*#N����V�n��	+�e�r�� ӟ�K�2!�n0X�      O      x������ � �      Q   �   x���;�@k�\ ��ޏ�{���!$*$(���((IE�l�b$��q�����c���d�5���L����#�^v(�QY�0��Ӌ���n��{9M6�M�] �_�	����Ԅ��E������Tf��ƀ\�T�Q�j`b�ex�\�1��\\�<丆������Ӊ      Y   +  x���IJA��է�$T�MvQ�n�V.��A�a#&�(b"!��
�u��(�{���"�i^W��W�sC� n�⑸���7���1$ʠ:'��(���I��]L�>�Z=]blĀx&��^{���}K`irkm�Z��li���A�TP�A�^Y5�M�Mk6����F+�[��g�-7��a���4��I��a���Ru}��`�k[;���n���3i��ē.���{Y��4�kf���/��S��-��a���
":���6e��.��w��X~���콌]<_�?��zE߂,Qx      K   y  x��S�J1=�~�?Вd�l��]�7zY�himE+^U�V�[�؛-RP��*d�f>�ɴڭ�TPq	K2;��˛Y�Gt7�^�u@�&�J(�a;i��&HPF� 
����t�=��{����q/���aF��<_���k��>���:�x��9�{̮Ѝ�HR^��@���F���� Hy�0��M>dzE֫Dkc#m���k�6^j�1Sz���Ư�[�#)I
Ͳ�o4�*8�6wkͽ \�~�Gf����W��!������2c>NXA�=��A�c���؛�I�l�
B�?��}��zk`�<)o�ǯ\k4Z�R+rA������b5���zr���C��j��1״�D��J�~����_�� x2GK�      M   �  x�՘�n1��'����v���@bQ�cSi4��@hi�&U��d�����Qp�z�v*�#��&�4�g���� R@BL��U�\�.�u=���\^����o�u�<C�H:5�U圛|�}�.���a��ٱYď�e���(�����w/w�޾���'�sd�I�g�&���ㄍNX�3%�����W�P,@G�;Ȃ�;/���^��I��6�/�������";��P5��q{�r����wnf��2�U�#�*H:�*���N|�uN+����)�=�'[��1�c�b���h��lu^1AJ2�T�K��7�*�Ӷ!��8u�XuH㺶�؉�%�iՒJ�JFV�W����%ZlÞC��Z���D�3��	�'�zI��u4�u���>������@�F��F�,���'�뀽�p�#_��6m�_�����s�!r��sҗd�� ]�X�qK�)7�=M���u55�K5�:����7���m�l*[���kn�\��#Q<{��f��u|/˃��0�}���:�ǋ׏���.]�!�QD�:�KO��X�*��|�Nj,�E[���M����X��>�}��u�����MO�)�(�]QS��ekR/[�&-[����l[4�q��[]װ�Z�`���36�����!`�����}�W�#�GlrgZ�E }�8���p�.:y�Q��Id'Y�-�p�Z#[v��e�?E���d4�$`t�      I   �  x��V�JQ�>�� "��kv)D��]7�"�yQD���x)�ZD&!$A*���̣t��n�궞n������7���4C� L�1B����}:ߣ}'��G�,���C��]f�Z\�$���_��ͭ��`��-�N^�ji:T���G崫T�>��n�[~Fb�N�كXv?s�{;�ev2�0���`,�k��F<�@Bf8�ѢѮ��7�Y�T���͵H�`��J��R|;`Lw���k2��MW���PZc����{"�)���"c�ï�'1/O�xN�Z���cݒŦWp���[�;�٫nݙ�6s�%��fj9����Y"�����an&#Ţ�4��ۈNХ��Y. ���u��J�a+���eA��!�]2�^��l*�չIx�@$����-�� s�]��[4_#r;�}w�ߣy#$�֌%]j{w}p��
��R����./
W��J^h����� C�����i��,�(�t}      C      x������ � �     