--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    branch_id integer
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
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
    queue_id integer,
    customer_id integer
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    location text,
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    customer_code character varying(20),
    name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    address text,
    status character varying(50) DEFAULT 'active'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    branch_id integer
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    role character varying(50) DEFAULT 'staff'::character varying NOT NULL,
    branch_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password text
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    queue_id integer NOT NULL,
    description text NOT NULL,
    amount numeric(10,2) NOT NULL
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_id_seq OWNER TO postgres;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    queue_id integer,
    total_price numeric(10,2) DEFAULT 0 NOT NULL,
    additional_costs jsonb DEFAULT '[]'::jsonb,
    discount numeric(10,2) DEFAULT 0,
    final_price numeric(10,2) DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: locker_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locker_slots (
    id integer NOT NULL,
    slot_number integer NOT NULL,
    locker_id integer,
    status text DEFAULT 'available'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.locker_slots OWNER TO postgres;

--
-- Name: locker_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locker_slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locker_slots_id_seq OWNER TO postgres;

--
-- Name: locker_slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locker_slots_id_seq OWNED BY public.locker_slots.id;


--
-- Name: lockers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lockers (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    address text,
    latitude double precision,
    longitude double precision,
    branch_id integer,
    sim_number text,
    device_serial text,
    firmware_version text,
    last_online_at timestamp without time zone,
    is_online boolean DEFAULT false,
    note text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lockers OWNER TO postgres;

--
-- Name: lockers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lockers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lockers_id_seq OWNER TO postgres;

--
-- Name: lockers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lockers_id_seq OWNED BY public.lockers.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    queue_id integer NOT NULL,
    discount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    payment_method character varying(50),
    payment_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    payment_status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: payouts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payouts (
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


ALTER TABLE public.payouts OWNER TO postgres;

--
-- Name: payouts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payouts_id_seq OWNER TO postgres;

--
-- Name: payouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payouts_id_seq OWNED BY public.payouts.id;


--
-- Name: queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queue (
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
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    customer_id integer,
    source text DEFAULT 'manual'::text,
    return_slot_id integer,
    locker_id integer,
    slot_id integer
);


ALTER TABLE public.queue OWNER TO postgres;

--
-- Name: queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queue_id_seq OWNER TO postgres;

--
-- Name: queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queue_id_seq OWNED BY public.queue.id;


--
-- Name: queue_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queue_items (
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


ALTER TABLE public.queue_items OWNER TO postgres;

--
-- Name: queue_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queue_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queue_items_id_seq OWNER TO postgres;

--
-- Name: queue_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queue_items_id_seq OWNED BY public.queue_items.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    service_name character varying(255) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    description text,
    branch_id integer
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    phone text NOT NULL,
    branch_id integer,
    locker_id integer,
    slot_id integer,
    return_slot_id integer,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: locker_slots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locker_slots ALTER COLUMN id SET DEFAULT nextval('public.locker_slots_id_seq'::regclass);


--
-- Name: lockers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lockers ALTER COLUMN id SET DEFAULT nextval('public.lockers_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: payouts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts ALTER COLUMN id SET DEFAULT nextval('public.payouts_id_seq'::regclass);


--
-- Name: queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue ALTER COLUMN id SET DEFAULT nextval('public.queue_id_seq'::regclass);


--
-- Name: queue_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_items ALTER COLUMN id SET DEFAULT nextval('public.queue_items_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, password, branch_id) FROM stdin;
3	ying.working99@gmail.com	$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx	\N
1	admin@example.com	$2b$12$9hvN98HvIqL.cksiOHT72uVxm/THUE842IahmBJY3qIGMLrBje7di	\N
12	ying@chiangmai.com	$2b$10$TayCHKTWd1FWxpa6/XWNguNIlatNKFcbByDmWZ20Ckolxs0ZjCUcC	\N
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, customer_name, phone, location, shoe_count, appointment_date, appointment_time, status, created_at, branch_id, queue_id, customer_id) FROM stdin;
43	Kiddy Blue	0946343636	คณะสาสุข มช	5	2025-05-14	16:00:00	สำเร็จ	2025-05-14 10:18:33.377963	2	248	100
66	ลูกค้า	0960121068	ธนาคารจีน หลัง big c extra	1	2025-05-29	17:00:00	สำเร็จ	2025-05-29 11:42:37.889185	2	306	161
42	Warinlada	0947632229	The one condo	2	2025-04-09	17:30:00	สำเร็จ	2025-04-09 12:20:12.511101	2	152	21
54	Line-Aan	0991639262	โลตัส (ร้านสัก ตรงข้ามรร.อโนดาด)	1	2025-05-22	14:00:00	สำเร็จ	2025-05-21 22:18:42.488467	2	274	127
45	Nichagorn Samergun	0882533512	วันพลัสมหิดล6	2	2025-05-14	16:00:00	สำเร็จ	2025-05-14 10:26:31.071457	2	249	101
39	Nooning	0626569597	ชม.ราม	2	2025-04-09	17:30:00	สำเร็จ	2025-04-09 12:17:16.665868	2	153	3
37	line-iy Cha Ya dA	099	ซอยสนามบิน	3	2025-03-28	17:00:00	สำเร็จ	2025-03-27 08:24:11.780821	2	90	\N
53	Wasana Prasit	0892662499	บ้านเลขที่60ซอย3 แถวโกลเด้นทาวน์	2	2025-05-22	17:30:00	สำเร็จ	2025-05-21 22:09:33.653917	2	275	126
58	Sumanee Prakobsuk	0897766320	รพ เชียงใหม่ราม	3	2025-05-26	11:00:00	สำเร็จ	2025-05-25 10:24:16.380819	2	296	135
62	Line-Ds' jubjaNg	0895565545	เลควิว	3	2025-05-26	17:30:00	สำเร็จ	2025-05-26 13:25:49.831977	2	297	153
38	Teerapong	0952415184	รร.บ้านเชิงดอย	2	2025-04-09	15:00:00	สำเร็จ	2025-04-09 12:16:23.761027	2	150	11
56	แจ๊บโป้ เห็นมันไหม	0829262529	D condo ping ตึก D	2	2025-05-23	17:00:00	สำเร็จ	2025-05-23 15:29:54.309086	2	279	129
55	Worachet Inya	0993236151	central airport ชั้น 4	2	2025-05-23	17:00:00	สำเร็จ	2025-05-22 14:43:34.203844	2	280	128
41	Natthapong	0882620461	หมู่บ้านศิริวัฒนา	4	2025-04-09	17:30:00	สำเร็จ	2025-04-09 12:19:07.508507	2	151	19
61	Line-YIM :)	0946286533	ธนาคารออมสิน Big c ดอนจั่น	2	2025-05-26	17:30:00	สำเร็จ	2025-05-26 12:57:38.158243	2	298	151
50	Pennueng	0986297826	อัญชัน2	2	2025-05-25	17:00:00	สำเร็จ	2025-05-20 20:24:18.904387	2	284	54
59	Bantita Boonmati	0858656799	I Hair Studio สันทราย	2	2025-05-25	11:30:00	สำเร็จ	2025-05-25 10:29:34.444364	2	285	137
60	Pawinee Promrak	0801331480	DCondo Rin	4	2025-05-26	10:00:00	สำเร็จ	2025-05-25 10:44:45.559673	2	292	138
72	Line-F🐶	0991431117	ร้านแว่นตามุลเลอร์ ตรงข้ามรพ ลานนา	6	2025-06-03	16:30:00	สำเร็จ	2025-06-03 11:54:26.605619	2	328	181
65	Line	0889747454	The One Condo	1	2025-05-27	16:50:00	สำเร็จ	2025-05-27 14:48:31.626769	2	302	159
64	Wasana Prasit	0892662499	บ้านเลขที่60ซอย3 แถวโกลเด้นทาวน์	3	2025-05-27	17:00:00	สำเร็จ	2025-05-27 14:46:57.535217	2	303	126
73	Line-Bla©ksᗰithz™⁹²⚖️💡	0632429515	ศุนย์สุขภาพพร้อม สวนดอก	1	2025-06-05	10:00:00	รอดำเนินการ	2025-06-04 10:21:11.100807	2	\N	182
63	Sitthi Kan	0992944521	บ้านพัก อยจ.	4	2025-05-28	17:00:00	สำเร็จ	2025-05-27 13:39:42.761667	2	305	158
68	Line-ศักรินทร์ดาวราย	0960024526	117/358 กาดวรุณ	3	2025-05-30	16:30:00	สำเร็จ	2025-05-30 12:52:25.822846	2	312	165
67	Natsuda	0929410393	รร.R1 นิมมาน	2	2025-05-30	16:00:00	สำเร็จ	2025-05-30 12:51:12.513927	2	313	164
71	Line-Naomi_Nanny 965	0946405419	ข้าวหอมอพาร์ทเม้นนท์ ป่าตัน ซ7	2	2025-06-04	10:00:00	สำเร็จ	2025-05-31 22:45:44.296223	2	330	171
48	Wechat-白猫超人@	0943317395	THE BASE Height-Chiangmai	2	2025-05-18	18:00:00	สำเร็จ	2025-05-18 12:53:03.292803	2	265	113
49	Line-Erboon	09144454269	คณะบริการธุรกิจ มช	4	2025-05-19	10:00:00	สำเร็จ	2025-05-18 13:30:21.45882	2	266	118
70	Naritsara Wareepan	0988909370	89พลาซ่า	2	2025-05-31	17:30:00	สำเร็จ	2025-05-31 15:35:48.262853	2	314	170
69	Aum Pts	0661469928	ดิ อิสสระ คอนโด	3	2025-05-31	17:30:00	สำเร็จ	2025-05-31 15:34:35.877134	2	315	169
51	Line-mod	0817641267	รพ.ประสาท เชียงใหม่	3	2025-05-21	16:00:00	สำเร็จ	2025-05-21 10:07:13.620949	2	272	122
52	Wechat-Arthur	0956786658	158/28 The Legend Koolpunville หางดง	2	2025-05-21	18:00:00	สำเร็จ	2025-05-21 14:29:01.709546	2	273	125
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, name, location, phone, created_at) FROM stdin;
2	Chiangmai	Pillow142	0854152495	2025-03-08 08:34:40.921786
4	Payao University	Payao	0995559966	2025-03-17 09:46:43.860657
5	Chiangrai	test	0854152495	2025-04-28 20:38:50.521878
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, customer_code, name, phone, address, status, notes, created_at, branch_id) FROM stdin;
84	C2084	ying	99998	Walk-in	active		2025-05-10 08:56:33.529055	2
88	C2088	Patt Chinnakarn	0962366165	palm garden สันนาเม็ง	active		2025-05-11 15:08:30.445413	2
152	C2152	Line-Apiradee	0897006206	Walk-in	active		2025-05-26 13:22:22.654553	2
96	C2096	Line-Jira_Nim	1111111111	Walk-in	active		2025-05-13 09:12:57.334116	2
156	C2156	Ploy♥	0951389393	Walk-in	active		2025-05-27 13:32:35.806757	2
100	C2100	Kiddy Blue	0946343636	คณะสาสุข มช	active		2025-05-15 10:18:40.970907	2
137	C2137	Bantita Boonmati	0858656799	 SK KAKEN CBP หลังบิ๊กซีเอ็ซตร้า	active		2025-05-25 10:29:18.215611	2
104	C2104	อุมาลัย บุญมี	0914121413	Walk-in	active		2025-05-15 13:34:29.595327	2
160	C2160	No Kia	0000000014	Walk-in	active		2025-05-28 15:25:00.003688	2
112	C2112	Line-JUTHANARIN	0974419949	Walk-in	active		2025-05-16 17:33:03.139533	2
129	C2129	แจ๊บโป้ เห็นมันไหม	0829262529 	D condo ping ตึก D 	active		2025-05-23 15:29:39.875913	2
133	C2133	อ.อู๋	0000000006	Walk-in	active		2025-05-24 11:53:00.247378	2
164	C2164	Natsuda	0929410393	รร.R1 นิมมาน	active		2025-05-30 12:51:02.752838	2
92	C2092	Chana Chayanont	0857079729	Hide Land ช้างม่อย	active		2025-05-13 09:01:35.603055	2
43	C2043	Ying	0854152495	Walk-in	active		2025-05-08 18:49:29.303666	2
21	C2021	Warinlada	0947632229	The one condo	active	\N	2025-05-08 18:49:29.303666	2
117	C2117	Sombut Sutana	0000000001	Walk-in	active		2025-05-18 13:28:15.765753	2
168	C2168	Line-$uguszad	0865564452	477/20 ม.1 ต.แม่เหียะ	active		2025-05-31 14:00:14.170506	2
22	C2022	พี่ตังเมย์	0932987751	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
121	C2121	Line-Namtan	0895522822	star hill คอนโด	active		2025-05-20 12:18:25.149318	2
23	C2023	Pimnara	0826939963	ร้านสังฆทานสันติธรรม	active	\N	2025-05-08 18:49:29.303666	2
24	C2024	Mim Achi	0894312713	ศุลกากร	active	\N	2025-05-08 18:49:29.303666	2
25	C2025	Paphichaya	0848087455	T-TEN หน้า มช	active	\N	2025-05-08 18:49:29.303666	2
26	C2026	Goffcap	0812893901	One+7ยอด6	active	\N	2025-05-08 18:49:29.303666	2
27	C2027	นิษฐ์วรา	0948289946	ร้านลูกโป่ง ดอนจั่น	active	\N	2025-05-08 18:49:29.303666	2
28	C2028	Line-Na's	0612061113	โลตัสคำเที่ยง	active	\N	2025-05-08 18:49:29.303666	2
125	C2125	Wechat-Arthur	0956786658	158/28 The Legend Koolpunville หางดง	active	คนจีน	2025-05-21 14:28:38.721282	2
172	C2172	Ratthakorn Niramitmahapanya	0877270207	Runstock	active		2025-05-31 22:47:30.46283	2
176	C2176	Korakoch Sonthi	0000000012	Walk-in	active		2025-06-02 11:31:16.259932	2
180	C2180	Line-ปุ๊ก  ♡	0828953611	Walk-in	active		2025-06-03 10:19:57.53328	2
29	C2029	Fay Tanasu	0944245564	scene สวนดอก	active	\N	2025-05-08 18:49:29.303666	2
30	C2030	Rutchadaporn	0836246265	Supalai Bliss	active	\N	2025-05-08 18:49:29.303666	2
31	C2031	D mons	0918594253	ขนมจีนนั่งยอง	active	\N	2025-05-08 18:49:29.303666	2
32	C2032	Samon Manokad	0947410971	Escent Ville	active	\N	2025-05-08 18:49:29.303666	2
33	C2033	ร้านรถโปลิ	0832695969	ร้านรถโปลิ	active	\N	2025-05-08 18:49:29.303666	2
34	C2034	Phichsinee Meister	0874249424	วิลลาจจิโอ สันทราย	active	\N	2025-05-08 18:49:29.303666	2
36	C2036	Nichapat	0966939996	Arise condo	active	\N	2025-05-08 18:49:29.303666	2
37	C2037	Line-Noina	0653592490	my hip condo1	active	\N	2025-05-08 18:49:29.303666	2
38	C2038	Milin Viriya	0835198923	กระเพราเนื้อๆช้างม่อย	active	\N	2025-05-08 18:49:29.303666	2
39	C2039	Momo jung	0818855317	ลัดดารมย์ พายัพ	active	\N	2025-05-08 18:49:29.303666	2
40	C2040	Line-บอล ธนัท	0838381888	หอแพทย์14ชั้น	active	\N	2025-05-08 18:49:29.303666	2
41	C2041	Duangjai	0882605677	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
42	C2042	Line-Nozz	0637938222	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
44	C2044	สายป่าน เจ้าชาย	0962682922	grab	active	\N	2025-05-08 18:49:29.303666	2
45	C2045	Beary Beer	0925092690	คุ้มภัยโตเกียวมารีนประกันภัย	active	\N	2025-05-08 18:49:29.303666	2
46	C2046	Nattapatch	0917919351	หอพรีเซียส ฟ้าฮ่าม	active	\N	2025-05-08 18:49:29.303666	2
47	C2047	Ae	0875669516	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
48	C2048	Aod	0858642723	รร.ยาหยี	active	\N	2025-05-08 18:49:29.303666	2
49	C2049	FB-Naphapol Somwang	0827669097	Third place coffee ศิริมังฯ	active	\N	2025-05-08 18:49:29.303666	2
51	C2051	Prakairak Tree	0933137818	Escent park ville	active	\N	2025-05-08 18:49:29.303666	2
50	C2050	Phuwadol	0877272671	panda จริงใจมาร์เก็ต	active	\N	2025-05-08 18:49:29.303666	2
52	C2052	Line-Pim	0822838340	D condo sign B	active	\N	2025-05-08 18:49:29.303666	2
53	C2053	ชินวุธ 	0946020222	My hip2	active	\N	2025-05-08 18:49:29.303666	2
54	C2054	Pennueng	0986297826	อัญชัน2	active	\N	2025-05-08 18:49:29.303666	2
55	C2055	Nok	0895150216	เดอรูม อพาร์ตเมนท์	active	\N	2025-05-08 18:49:29.303666	2
89	C2089	wechat-Fairy	0612704158	d condo nim ตึก c	active		2025-05-11 15:15:43.747601	2
97	C2097	คมสัน ซางสุภาพ	0831542868	พีพีคอนโด	active		2025-05-14 10:27:21.591803	2
141	C2141	Dona Srimahachota	0000000009	Walk-in	active		2025-05-25 21:04:17.568382	2
101	C2101	Nichagorn Samergun	0882533512	วันพลัส6 มหิดล	active		2025-05-15 10:20:17.902114	2
149	C2149	Sarinya Utsp	0000000011	Walk-in	active		2025-05-25 21:49:06.001675	2
109	C2109	ying	0953620244	Walk-in	active		2025-05-16 08:26:53.991634	2
56	C2056	Line-CAT	0954792895	39 ถ.ช้างคลาน 	active	\N	2025-05-08 18:49:29.303666	2
61	C2061	ทดสอบนะ	088	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
1	C2001	P.A.	0889152461	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
2	C2002	Arng	00	grab	active	\N	2025-05-08 18:49:29.303666	2
3	C2003	Nooning	0626569597	ชม.ราม	active	\N	2025-05-08 18:49:29.303666	2
4	C2004	Khing	0804919993	ร้านขายของลานนา	active	\N	2025-05-08 18:49:29.303666	2
5	C2005	Line-VIEWVIEW	0840431871	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
6	C2006	Piyanan Fon	0851526662	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
113	C2113	Wechat-白猫超人@	0943317395	THE BASE Height-Chiangmai	active	แยกเซนเฟส	2025-05-18 12:39:54.892243	2
153	C2153	Line-Ds' jubjaNg	0895565545	Walk-in	active		2025-05-26 13:25:30.594696	2
118	C2118	Line-Erboon	0914454269	คณะบริการธุรกิจ มช	active		2025-05-18 13:30:04.01881	2
157	C2157	Line-BASJARUPONG	0826235778	Walk-in	active		2025-05-27 13:38:00.062965	2
122	C2122	Line-mod	0817641267	รพ.ประสาท เชียงใหม่	active	ห้องทันตกรรมชั้น1 อาคาร8	2025-05-21 10:06:52.115951	2
126	C2126	Wasana Prasit	0892662499	บ้านเลขที่60ซอย3 แถวโกลเด้นทาวน์	active		2025-05-21 22:09:18.762635	2
130	C2130	Alex Dingle	0000000004	Walk-in	active		2025-05-23 15:31:15.319743	2
161	C2161	Ni Sa	0960121068	ธนาคารจีน หลัง big c extra	active		2025-05-29 11:42:30.820628	2
134	C2134	Line-A E Y	0805233176	Walk-in	active		2025-05-24 13:04:22.823557	2
138	C2138	Pawinee Promrak	0801331480	DCondo Rin	active		2025-05-25 10:44:27.325137	2
165	C2165	Line-ศักรินทร์ดาวราย	0960024526	117/358 กาดวรุณ	active		2025-05-30 12:52:14.430197	2
169	C2169	Aum Pts	0661469928	ดิ อิสสระ คอนโด	active		2025-05-31 15:34:26.352849	2
173	C2173	อมรรัตน์ ชมภูศรี	0635351193	Walk-in	active		2025-06-01 10:45:21.341274	2
177	C2177	Watcharawit Sooksai	0924496241	Walk-in	active		2025-06-02 15:03:43.238076	2
181	C2181	Line-F🐶	0991431117	ร้านแว่นตามุลเลอร์ ตรงข้ามรพ ลานนา	active		2025-06-03 11:54:15.783965	2
7	C2007	Line-(รูปยิ้ม)	0962570539	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
8	C2008	Katoon Patsara	0869142487	โลตัสคำเที่ยง	active	\N	2025-05-08 18:49:29.303666	2
9	C2009	Baitongjme	000	d condi sign ตึก C	active	\N	2025-05-08 18:49:29.303666	2
10	C2010	ลูกค้า	0861911439	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
11	C2011	Teerapong	0952415184	รร.บ้านเชิงดอย	active	\N	2025-05-08 18:49:29.303666	2
12	C2012	Oatt Patthara	0882539027	ร้านตือคาโค สันติธรรม	active	\N	2025-05-08 18:49:29.303666	2
13	C2013	ไอ ชามา	0826363565	หมู่บ้านกาญกนกจน์20	active	\N	2025-05-08 18:49:29.303666	2
14	C2014	ลูกค้า	0839465352	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
15	C2015	Phurin	0970217360	บ้านเชียงล้าน	active	\N	2025-05-08 18:49:29.303666	2
16	C2016	Pran Piriya	0612429196	สนามบิน	active	\N	2025-05-08 18:49:29.303666	2
17	C2017	Line-Pro Win	0990018482	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
18	C2018	Line- -NATTHAMON	0913065082	airport business	active	\N	2025-05-08 18:49:29.303666	2
19	C2019	Natthapong	0882620461	หมู่บ้านศิริวัฒนา	active	\N	2025-05-08 18:49:29.303666	2
20	C2020	Saranya	0991541636	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
142	C2142	Line-pw	0828545780	Walk-in	active		2025-05-25 21:04:54.359412	2
90	C2090	Line-MinT-ii*	0829619153	monotown3สันผีเสื้อ	active		2025-05-11 15:21:47.915258	2
150	C2150	Line-Tar Gonlatat	0981019542	Walk-in	active		2025-05-26 12:07:44.340024	2
94	C2094	Line-1012_พ.อ.อ.วัชรพงษ์	0000000000	199/77	active		2025-05-13 09:03:45.900978	2
98	C2098	Bow Kawichai	0820878610	ร้านอาหารสายปิง	active		2025-05-14 10:28:17.993388	2
154	C2154	Praween Piangchompu	0988853369	Walk-in	active		2025-05-26 13:54:37.289098	2
102	C2102	Chayanun Kpp	0896355425	บ้านส้ม หลังวัดเมืองสาตรน้อย	active		2025-05-15 10:27:28.938201	2
110	C2110	Line-🌻シJaae(xiaomei)💖	0851776886	กาดธานินทร์	active		2025-05-16 17:28:49.199976	2
158	C2158	Sitthi Kan	0992944521	บ้านพัก อบจ.	active		2025-05-27 13:39:29.702752	2
35	C2035	Line- ((#WASSER 	099	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
115	C2115	JJ Teeda	0857230966	Walk-in	active		2025-05-18 13:26:46.627076	2
119	C2119	Jaisaii.	0000000002	Walk-in	active		2025-05-19 13:15:51.547528	2
123	C2123	Thunaset Trakulimthong	0949835005	grab	active		2025-05-21 11:22:23.499133	2
166	C2166	Prat Panya	00000000013	Walk-in	active		2025-05-30 14:57:06.191882	2
127	C2127	Line-Aan	0991639262	โลตัส (ร้านสัก ตรงข้ามรร.อโนดาด)	active		2025-05-21 22:18:30.468533	2
131	C2131	Wechat-葉在泰国	0834081240	Wanmai House	active		2025-05-24 11:44:16.01048	2
170	C2170	Naritsara Wareepan	0988909370	89พลาซ่า	active		2025-05-31 15:35:36.122516	2
135	C2135	Sumanee Prakobsuk	0897766320	รพ เชียงใหม่ราม	active		2025-05-25 10:23:59.652549	2
139	C2139	ไอ’แอม มิ้นท์นี่	0828788922	หมู่บ้านกาญจน์กนก2เฟส4 (116/17)	active		2025-05-25 20:09:49.600702	2
174	C2174	Piacher Jularat	0810747564 	Walk-in	active		2025-06-01 13:36:53.081178	2
178	C2178	Line-Wuthipong56	0000000015	Walk-in	active		2025-06-02 15:09:42.796097	2
182	C2182	Line-Bla©ksᗰithz™⁹²⚖️💡	0632429515 	ศุนย์สุขภาพพร้อม สวนดอก	active		2025-06-04 10:20:58.875003	2
143	C2143	Wechat-啊啊啊	0000000010	Walk-in	active		2025-05-25 21:19:59.755796	2
87	C2087	Tum Fisheries	0832099111	Walk-in	active		2025-05-11 15:06:15.639616	2
147	C2147	Line-S@@RUN °4265°	0893544155	Walk-in	active		2025-05-25 21:28:52.793382	2
95	C2095	Line-Panrada	0955622496	three nakhanik	active		2025-05-13 09:05:21.740547	2
99	C2099	Aomaam Bulun	0615469563	Walk-in	active		2025-05-14 10:30:01.73109	2
91	C2091	Line-google	0841708155	Walk-in	active		2025-05-11 15:22:33.427895	2
151	C2151	Line-YIM :)	0946286533	Walk-in	active		2025-05-26 12:56:58.124189	2
103	C2103	Line-🤖ⓣⓐⓡⓝ🤖	09449347778	Walk-in	active		2025-05-15 10:40:19.706848	2
155	C2155	Line-~Achiraya~	0654064095	Walk-in	active		2025-05-27 13:30:45.74059	2
111	C2111	Line-PPP.🌥️🌈	0855514944	ส่งกลับ ปณ.	active		2025-05-16 17:30:58.016011	2
116	C2116	Papanin De La Fleur	0636694053	สกายบรีซคอนโด ห้วยแก้ว	active		2025-05-18 13:27:30.994993	2
75	C2075	มีนาคม	-	Walk-in	active		2025-05-08 18:49:29.303666	2
57	C2057	IG-hundopnn	0805429598	คณะเทคนิคการแพทย์	active	\N	2025-05-08 18:49:29.303666	2
58	C2058	ลูกค้า	0806655465	grab	active	\N	2025-05-08 18:49:29.303666	2
59	C2059	line-! Aonann	0610182199	โลตัสคำเที่ยง	active	\N	2025-05-08 18:49:29.303666	2
60	C2060	มินท์ทาวิน	0997936591	one+ nineteen2	active	\N	2025-05-08 18:49:29.303666	2
62	C2062	Nawarath	0899569037	ออมสิน	active	\N	2025-05-08 18:49:29.303666	2
63	C2063	Pattarakarn	0612744747	หมู่บ้านนักกีฬา700ปี	active	\N	2025-05-08 18:49:29.303666	2
64	C2064	line-Mook Yada	0806624235	ปาล์มสปริง รอยัล นิมมาน	active	\N	2025-05-08 18:49:29.303666	2
65	C2065	Aurora	0861843678	ฺ๊Burapa Boutique	active	\N	2025-05-08 18:49:29.303666	2
66	C2066	line-Vya	0800327914	we run 	active	\N	2025-05-08 18:49:29.303666	2
67	C2067	Katy Kate	0904696499	ม.ศิริวัฒนา	active	\N	2025-05-08 18:49:29.303666	2
68	C2068	Nuntiya	0810701999	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
69	C2069	Witana	0811696564	ร้านเขยเจียงใหม่	active	\N	2025-05-08 18:49:29.303666	2
70	C2070	line-Jiratch Yok	0930945195	escent park ville	active	\N	2025-05-08 18:49:29.303666	2
71	C2071	Aoey	0966596387	Astra sky river	active	\N	2025-05-08 18:49:29.303666	2
72	C2072	Allbig	0949944159	one+7ยอด3	active	\N	2025-05-08 18:49:29.303666	2
73	C2073	Line-Pink	0622976111	เมญ่า	active	\N	2025-05-08 18:49:29.303666	2
74	C2074	ลูกค้า	0818477650	Walk-in	active	\N	2025-05-08 18:49:29.303666	2
159	C2159	Line-Kay	0889747454	The One Condo 	active		2025-05-27 14:48:12.630293	2
120	C2120	Korakod	0918598967	ปณ	active	ห้อง211 เอส.เอส.แมนชั่น 19/1 ซ.อร่ามศรี ถ.พญาไท แขวงทุ่งพญาไท เขตราชเทวี 10400	2025-05-19 13:35:38.203107	2
124	C2124	Wechat-起床气不在	0000000005	โรงแรมรอยัลพรรณราย ช้างม่อย	active		2025-05-21 13:58:27.022574	2
128	C2128	Worachet Inya	0993236151	central airport ชั้น 4	active		2025-05-22 14:43:18.116554	2
163	C2163	Potae Kosin	0818811255	Walk-in	active		2025-05-30 12:49:46.005662	2
136	C2136	Thitikon Panchaiya	0948569225	ส่งกลับ ปณ	active	ฐิติกร ปัญชัยยา\nหมู่บ้านบีเอ็มโฮม 211,ซอย5,หมู่6,ต.ศรีบัวบาน,อ.เมือง,จ.ลำพูน 51000	2025-05-25 10:25:01.824547	2
167	C2167	ฝรั่ง	0633711605	Walk-in	active		2025-05-30 18:04:42.318249	2
171	C2171	Line-Naomi_Nanny 965	0946405419	ข้าวหอมอพาร์ทเม้นนท์ ป่าตัน ซ7	active		2025-05-31 22:45:27.744673	2
175	C2175	0815511999	0815511999	Walk-in	active		2025-06-02 11:24:45.42345	2
179	C2179	Wanida Kosachawieng	0000000016	Walk-in	active		2025-06-02 16:23:19.564869	2
183	C2183	She Aom	0954453297	Walk-in	active		2025-06-04 19:10:46.519204	2
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, name, email, phone, role, branch_id, created_at, password) FROM stdin;
4	Admin	admin@example.com	0888888888	admin	2	2025-03-08 09:43:19.402339	$2b$12$k1Jz2WqE6vJf8FZB.L3nJe7E8pW9rR/lQ4E6n1FgF2ZtQ8W1W5Y/q
47	ying@chiangmai.com	ying@chiangmai.com	9999	admin	2	2025-03-18 09:51:00.223025	$2b$12$z/9dgy2Z7X7EE/8CLQ60GeLQPcUCfFS6X7Jq4..a0BvbV0fs.iPYa
48	ying@payao.com	ying@payao.com	9999	admin	4	2025-03-18 09:51:54.702441	$2b$12$pyUeAWocaWEI5FjMEIZYSOjnGtcE29JZJwutmLA2z4oX3meltd0u6
49	ae@payao.com	ae@payao.com	88888	staff	4	2025-03-18 09:54:34.692413	$2b$12$0WibGxL7QD0Qn3CckForCOxBV7.9yrJd6J4qY/1DdU.Cn5Bsxr/Fe
50	ying@chingmai	ying@chingmai	999	admin	2	2025-03-31 09:10:47.31954	$2b$12$dofhECBi8Q7fwnraiSzpXOa92rbZYDsklNFx2.Xn4sZdmSocpJEoK
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, queue_id, description, amount) FROM stdin;
24	76	เคลือบกันน้ำ	200.00
25	99	ค่าบริการรับส่ง	200.00
26	101	ค่ารองเท้า	2250.00
27	102	ค่ารองเท้า	2650.00
29	103	ค่ารองเท้า	3050.00
30	104	ค่ารองเท้า	1700.00
31	107	-	2600.00
32	108	-	1550.00
33	109	-	3400.00
34	110	-	1650.00
35	111	-	3750.00
36	112	-	2450.00
37	113	-	400.00
38	114	-	4150.00
39	115	-	800.00
40	116	-	1500.00
41	117	-	1700.00
42	118	-	2800.00
43	119	-	2200.00
44	120	-	1850.00
45	121	-	1200.00
46	122	-	1750.00
47	123	-	1750.00
48	124	-	1200.00
49	125	-	2250.00
50	126	-	4400.00
51	127	-	2000.00
52	129	-	3230.00
55	131	ค่าบริการรับส่ง	300.00
56	135	เคลือบกันน้ำ	100.00
57	98	ค่าส่ง	60.00
58	138	ค่าบริการรับส่ง	150.00
59	142	ทำสีขอบรองเท้า	200.00
60	168	ค่าบริการรับส่ง	60.00
61	184	ค่าบริการรับส่ง	60.00
62	187	ค่าบริการซักด่วน	300.00
63	199	ทำสีรองเท้า	300.00
64	221	เคลือบกันน้ำ	100.00
65	210	ค่าบริการรับส่ง	120.00
66	216	แก้ขอบเหลือง รองเท้า nike panda	150.00
67	223	เคลือบกันน้ำ keen หนังกลับ	100.00
69	239	เคลือบกันน้ำ 3 คู่	300.00
70	237	ค่าบริการรับส่ง	150.00
71	252	เพ้นท์สี	150.00
72	245	แก้ขอบเหลือง nike	150.00
73	256	พื้นรองเท้า	80.00
74	262	เคลือบกันน้ำ 2 คู่	200.00
75	268	ค่าบริการรับส่ง	70.00
77	273	ค่าบริการรับส่ง	300.00
80	291	แก้สีตก	100.00
81	286	ค่าบริการรับส่งนอกเขต	200.00
82	302	ค่าบริการรับส่ง	70.00
84	309	ค่าทำสีเขียวแดง	200.00
85	312	ค่าส่ง	160.00
86	322	น้ำยา Success	190.00
87	313	น้ำยาซักรองเท้า	190.00
88	322	น้ำยา Success	190.00
89	309	ทำสีขอบ	300.00
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, queue_id, total_price, additional_costs, discount, final_price, status, created_at) FROM stdin;
\.


--
-- Data for Name: locker_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locker_slots (id, slot_number, locker_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lockers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lockers (id, code, name, address, latitude, longitude, branch_id, sim_number, device_serial, firmware_version, last_online_at, is_online, note, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, queue_id, discount, total_amount, payment_method, payment_date, created_at, payment_status) FROM stdin;
45	88	0.00	1850.00	เงินสด	2025-03-29 14:39:30.003709	2025-03-29 14:39:30.003709	ชำระเงินแล้ว
46	77	0.00	1600.00	เงินสด	2025-03-29 17:08:26.299994	2025-03-29 17:08:26.299994	ชำระเงินแล้ว
47	91	0.00	200.00	เงินสด	2025-03-30 12:21:24.247606	2025-03-30 12:21:24.247606	ชำระเงินแล้ว
48	84	0.00	400.00	เงินสด	2025-03-30 16:26:26.026204	2025-03-30 16:26:26.026204	ชำระเงินแล้ว
49	82	0.00	400.00	เงินสด	2025-03-30 17:41:38.830879	2025-03-30 17:41:38.830879	ชำระเงินแล้ว
50	78	0.00	400.00	เงินสด	2025-03-30 17:42:01.689537	2025-03-30 17:42:01.689537	ชำระเงินแล้ว
51	100	0.00	600.00	เงินสด	2025-03-30 17:46:28.481085	2025-03-30 17:46:28.481085	ชำระเงินแล้ว
52	93	0.00	200.00	เงินสด	2025-03-31 12:04:51.675805	2025-03-31 12:04:51.675805	ชำระเงินแล้ว
53	83	0.00	600.00	เงินสด	2025-03-31 14:04:50.577693	2025-03-31 14:04:50.577693	ชำระเงินแล้ว
54	86	0.00	400.00	เงินสด	2025-03-31 20:15:56.755544	2025-03-31 20:15:56.755544	ชำระเงินแล้ว
55	101	0.00	2250.00	เงินสด	2025-03-31 20:17:55.232746	2025-03-31 20:17:55.232746	ชำระเงินแล้ว
56	102	0.00	2650.00	เงินสด	2025-03-31 20:19:11.735335	2025-03-31 20:19:11.735335	ชำระเงินแล้ว
57	103	0.00	3050.00	เงินสด	2025-03-31 20:20:33.975135	2025-03-31 20:20:33.975135	ชำระเงินแล้ว
58	104	0.00	1700.00	เงินสด	2025-03-31 20:21:33.543546	2025-03-31 20:21:33.543546	ชำระเงินแล้ว
35	75	0.00	450.00	เงินโอน	2025-03-28 00:40:53.318746	2025-03-28 00:40:53.318746	ชำระเงินแล้ว
36	76	0.00	800.00	เงินสด	2025-03-28 01:24:36.746418	2025-03-28 01:24:36.746418	ชำระเงินแล้ว
37	74	0.00	1100.00	เงินสด	2025-03-28 01:25:01.746926	2025-03-28 01:25:01.746926	ชำระเงินแล้ว
38	81	0.00	600.00	เงินสด	2025-03-28 09:49:49.889441	2025-03-28 09:49:49.889441	ชำระเงินแล้ว
39	80	0.00	200.00	เงินสด	2025-03-28 09:50:55.473284	2025-03-28 09:50:55.473284	ชำระเงินแล้ว
59	107	0.00	2600.00	เงินสด	2025-03-31 20:24:09.199626	2025-03-31 20:24:09.199626	ชำระเงินแล้ว
60	108	0.00	1550.00	เงินสด	2025-03-31 20:25:03.4892	2025-03-31 20:25:03.4892	ชำระเงินแล้ว
61	109	0.00	3400.00	เงินสด	2025-03-31 20:26:03.82413	2025-03-31 20:26:03.82413	ชำระเงินแล้ว
62	110	0.00	1650.00	เงินสด	2025-03-31 20:28:20.10422	2025-03-31 20:28:20.10422	ชำระเงินแล้ว
63	111	0.00	3750.00	เงินสด	2025-03-31 20:29:13.110123	2025-03-31 20:29:13.110123	ชำระเงินแล้ว
64	112	0.00	2450.00	เงินสด	2025-03-31 20:30:32.105353	2025-03-31 20:30:32.105353	ชำระเงินแล้ว
65	113	0.00	400.00	เงินสด	2025-03-31 20:31:35.920431	2025-03-31 20:31:35.920431	ชำระเงินแล้ว
66	114	0.00	4150.00	เงินสด	2025-03-31 20:32:39.324491	2025-03-31 20:32:39.324491	ชำระเงินแล้ว
67	115	0.00	800.00	เงินสด	2025-03-31 20:33:32.835316	2025-03-31 20:33:32.835316	ชำระเงินแล้ว
68	116	0.00	1500.00	เงินสด	2025-03-31 20:34:38.891295	2025-03-31 20:34:38.891295	ชำระเงินแล้ว
69	117	0.00	1700.00	เงินสด	2025-03-31 20:35:20.168101	2025-03-31 20:35:20.168101	ชำระเงินแล้ว
70	118	0.00	2800.00	เงินสด	2025-03-31 20:35:58.611079	2025-03-31 20:35:58.611079	ชำระเงินแล้ว
71	119	0.00	2200.00	เงินสด	2025-03-31 20:36:37.344254	2025-03-31 20:36:37.344254	ชำระเงินแล้ว
72	120	0.00	1850.00	เงินสด	2025-03-31 20:37:14.189616	2025-03-31 20:37:14.189616	ชำระเงินแล้ว
73	121	0.00	1200.00	เงินสด	2025-03-31 20:38:02.751183	2025-03-31 20:38:02.751183	ชำระเงินแล้ว
74	122	0.00	1750.00	เงินสด	2025-03-31 20:38:45.524217	2025-03-31 20:38:45.524217	ชำระเงินแล้ว
75	123	0.00	1750.00	เงินสด	2025-03-31 20:39:24.936277	2025-03-31 20:39:24.936277	ชำระเงินแล้ว
76	124	0.00	1200.00	เงินสด	2025-03-31 20:40:22.15375	2025-03-31 20:40:22.15375	ชำระเงินแล้ว
77	125	0.00	2250.00	เงินสด	2025-03-31 20:41:23.529256	2025-03-31 20:41:23.529256	ชำระเงินแล้ว
78	126	0.00	4400.00	เงินสด	2025-03-31 20:43:15.409028	2025-03-31 20:43:15.409028	ชำระเงินแล้ว
79	127	0.00	2000.00	เงินสด	2025-03-31 20:44:22.832778	2025-03-31 20:44:22.832778	ชำระเงินแล้ว
80	129	0.00	3230.00	เงินสด	2025-03-31 20:46:53.727865	2025-03-31 20:46:53.727865	ชำระเงินแล้ว
81	90	0.00	800.00	เงินสด	2025-03-31 20:48:29.784447	2025-03-31 20:48:29.784447	ชำระเงินแล้ว
82	85	0.00	200.00	เงินสด	2025-04-01 12:52:31.286372	2025-04-01 12:52:31.286372	ชำระเงินแล้ว
83	99	0.00	1000.00	เงินสด	2025-04-02 15:07:16.548636	2025-04-02 15:07:16.548636	ชำระเงินแล้ว
84	79	0.00	850.00	เงินสด	2025-04-02 15:07:48.276826	2025-04-02 15:07:48.276826	ชำระเงินแล้ว
85	94	0.00	250.00	เงินสด	2025-04-02 15:08:15.614274	2025-04-02 15:08:15.614274	ชำระเงินแล้ว
86	95	0.00	800.00	เงินสด	2025-04-03 16:48:45.272612	2025-04-03 16:48:45.272612	ชำระเงินแล้ว
87	131	0.00	900.00	เงินสด	2025-04-03 21:58:38.331373	2025-04-03 21:58:38.331373	ชำระเงินแล้ว
88	98	0.00	710.00	เงินสด	2025-04-04 16:16:41.887455	2025-04-04 16:16:41.887455	ชำระเงินแล้ว
89	132	0.00	450.00	เงินสด	2025-04-04 16:17:39.255771	2025-04-04 16:17:39.255771	ชำระเงินแล้ว
90	136	0.00	800.00	เงินสด	2025-04-04 16:17:53.721388	2025-04-04 16:17:53.721388	ชำระเงินแล้ว
91	135	0.00	300.00	เงินสด	2025-04-04 16:18:16.807112	2025-04-04 16:18:16.807112	ชำระเงินแล้ว
92	137	0.00	400.00	เงินสด	2025-04-09 11:11:23.168644	2025-04-09 11:11:23.168644	ชำระเงินแล้ว
93	138	0.00	750.00	เงินสด	2025-04-09 20:04:12.032355	2025-04-09 20:04:12.032355	ชำระเงินแล้ว
94	141	0.00	250.00	เงินสด	2025-04-10 13:10:05.236005	2025-04-10 13:10:05.236005	ชำระเงินแล้ว
95	140	0.00	200.00	เงินสด	2025-04-10 14:28:16.420475	2025-04-10 14:28:16.420475	ชำระเงินแล้ว
96	146	0.00	550.00	เงินสด	2025-04-10 15:50:44.504277	2025-04-10 15:50:44.504277	ชำระเงินแล้ว
97	148	0.00	400.00	เงินสด	2025-04-11 13:59:46.187093	2025-04-11 13:59:46.187093	ชำระเงินแล้ว
98	143	0.00	400.00	เงินสด	2025-04-11 14:00:47.077389	2025-04-11 14:00:47.077389	ชำระเงินแล้ว
99	150	0.00	400.00	เงินสด	2025-04-11 14:20:49.257984	2025-04-11 14:20:49.257984	ชำระเงินแล้ว
100	139	0.00	200.00	เงินสด	2025-04-11 20:40:19.39713	2025-04-11 20:40:19.39713	ชำระเงินแล้ว
101	154	0.00	300.00	เงินสด	2025-04-11 20:40:38.525789	2025-04-11 20:40:38.525789	ชำระเงินแล้ว
102	142	0.00	600.00	เงินสด	2025-04-12 13:46:26.932797	2025-04-12 13:46:26.932797	ชำระเงินแล้ว
103	149	0.00	800.00	เงินสด	2025-04-12 13:46:46.019004	2025-04-12 13:46:46.019004	ชำระเงินแล้ว
104	145	0.00	1000.00	เงินสด	2025-04-12 13:47:55.051162	2025-04-12 13:47:55.051162	ชำระเงินแล้ว
105	133	50.00	150.00	เงินสด	2025-04-13 13:20:12.405964	2025-04-13 13:20:12.405964	ชำระเงินแล้ว
106	144	0.00	600.00	เงินสด	2025-04-13 13:20:30.517627	2025-04-13 13:20:30.517627	ชำระเงินแล้ว
107	147	0.00	400.00	เงินสด	2025-04-13 13:20:55.933926	2025-04-13 13:20:55.933926	ชำระเงินแล้ว
108	153	0.00	1200.00	เงินสด	2025-04-13 13:21:10.813361	2025-04-13 13:21:10.813361	ชำระเงินแล้ว
109	151	0.00	1250.00	เงินสด	2025-04-13 13:21:33.695451	2025-04-13 13:21:33.695451	ชำระเงินแล้ว
110	152	0.00	750.00	เงินสด	2025-04-18 12:59:06.031532	2025-04-18 12:59:06.031532	ชำระเงินแล้ว
111	157	0.00	200.00	เงินสด	2025-04-18 12:59:28.834374	2025-04-18 12:59:28.834374	ชำระเงินแล้ว
112	155	0.00	200.00	เงินสด	2025-04-18 13:00:01.385038	2025-04-18 13:00:01.385038	ชำระเงินแล้ว
113	158	0.00	400.00	เงินสด	2025-04-18 13:02:22.808799	2025-04-18 13:02:22.808799	ชำระเงินแล้ว
114	156	0.00	800.00	เงินสด	2025-04-18 13:06:25.425281	2025-04-18 13:06:25.425281	ชำระเงินแล้ว
115	159	0.00	200.00	เงินสด	2025-04-18 13:07:04.776686	2025-04-18 13:07:04.776686	ชำระเงินแล้ว
116	160	0.00	800.00	เงินสด	2025-04-18 13:11:47.376006	2025-04-18 13:11:47.376006	ชำระเงินแล้ว
117	162	0.00	400.00	เงินสด	2025-04-18 13:16:47.666365	2025-04-18 13:16:47.666365	ชำระเงินแล้ว
118	166	0.00	400.00	เงินสด	2025-04-18 13:33:38.441459	2025-04-18 13:33:38.441459	ชำระเงินแล้ว
119	161	0.00	250.00	เงินสด	2025-04-18 19:14:44.053239	2025-04-18 19:14:44.053239	ชำระเงินแล้ว
120	164	0.00	650.00	เงินสด	2025-04-19 11:43:18.398826	2025-04-19 11:43:18.398826	ชำระเงินแล้ว
121	163	0.00	1200.00	เงินสด	2025-04-20 12:03:17.233491	2025-04-20 12:03:17.233491	ชำระเงินแล้ว
122	167	0.00	400.00	เงินสด	2025-04-20 15:45:38.081717	2025-04-20 15:45:38.081717	ชำระเงินแล้ว
123	171	0.00	200.00	เงินสด	2025-04-20 15:46:14.357865	2025-04-20 15:46:14.357865	ชำระเงินแล้ว
124	169	0.00	200.00	เงินสด	2025-04-20 15:46:36.360248	2025-04-20 15:46:36.360248	ชำระเงินแล้ว
125	172	0.00	200.00	เงินสด	2025-04-21 10:09:33.386212	2025-04-21 10:09:33.386212	ชำระเงินแล้ว
126	168	0.00	260.00	เงินสด	2025-04-21 10:10:31.85858	2025-04-21 10:10:31.85858	ชำระเงินแล้ว
127	170	0.00	400.00	เงินสด	2025-04-21 11:44:26.775164	2025-04-21 11:44:26.775164	ชำระเงินแล้ว
128	173	0.00	250.00	เงินสด	2025-04-21 15:12:33.514218	2025-04-21 15:12:33.514218	ชำระเงินแล้ว
129	174	0.00	200.00	เงินสด	2025-04-21 15:12:52.683242	2025-04-21 15:12:52.683242	ชำระเงินแล้ว
130	175	0.00	200.00	เงินสด	2025-04-22 12:25:12.533805	2025-04-22 12:25:12.533805	ชำระเงินแล้ว
131	178	0.00	200.00	เงินสด	2025-04-23 11:47:39.690638	2025-04-23 11:47:39.690638	ชำระเงินแล้ว
132	179	0.00	900.00	เงินสด	2025-04-25 13:07:04.852042	2025-04-25 13:07:04.852042	ชำระเงินแล้ว
133	180	0.00	800.00	เงินสด	2025-04-25 13:07:21.198313	2025-04-25 13:07:21.198313	ชำระเงินแล้ว
134	187	0.00	950.00	เงินสด	2025-04-25 13:07:44.763219	2025-04-25 13:07:44.763219	ชำระเงินแล้ว
135	181	0.00	650.00	เงินสด	2025-04-25 13:09:15.291731	2025-04-25 13:09:15.291731	ชำระเงินแล้ว
136	176	0.00	600.00	เงินสด	2025-04-25 13:10:48.435764	2025-04-25 13:10:48.435764	ชำระเงินแล้ว
137	184	0.00	260.00	เงินสด	2025-04-25 13:11:03.773408	2025-04-25 13:11:03.773408	ชำระเงินแล้ว
138	165	0.00	200.00	เงินสด	2025-04-26 15:42:15.900592	2025-04-26 15:42:15.900592	ชำระเงินแล้ว
139	177	0.00	400.00	เงินสด	2025-04-26 15:42:42.245689	2025-04-26 15:42:42.245689	ชำระเงินแล้ว
140	183	200.00	2050.00	เงินสด	2025-04-26 15:43:09.626148	2025-04-26 15:43:09.626148	ชำระเงินแล้ว
141	185	0.00	750.00	เงินสด	2025-04-26 15:43:32.627583	2025-04-26 15:43:32.627583	ชำระเงินแล้ว
142	186	0.00	400.00	เงินสด	2025-04-26 15:43:40.633028	2025-04-26 15:43:40.633028	ชำระเงินแล้ว
143	189	0.00	1200.00	เงินสด	2025-04-27 22:50:05.331515	2025-04-27 22:50:05.331515	ชำระเงินแล้ว
144	192	0.00	400.00	เงินสด	2025-04-28 20:05:43.883428	2025-04-28 20:05:43.883428	ชำระเงินแล้ว
145	191	0.00	200.00	เงินสด	2025-04-28 20:05:55.611864	2025-04-28 20:05:55.611864	ชำระเงินแล้ว
146	188	180.00	3100.00	เงินสด	2025-04-29 13:33:59.178673	2025-04-29 13:33:59.178673	ชำระเงินแล้ว
147	190	0.00	600.00	เงินสด	2025-04-30 15:51:16.875656	2025-04-30 15:51:16.875656	ชำระเงินแล้ว
149	195	0.00	2050.00	เงินสด	2025-05-01 13:41:15.762272	2025-05-01 13:41:15.762272	ชำระเงินแล้ว
150	199	0.00	600.00	เงินสด	2025-05-01 13:43:46.411023	2025-05-01 13:43:46.411023	ชำระเงินแล้ว
151	193	0.00	950.00	เงินสด	2025-05-01 15:56:44.838383	2025-05-01 15:56:44.838383	ชำระเงินแล้ว
152	196	0.00	400.00	เงินสด	2025-05-02 14:22:27.705417	2025-05-02 14:22:27.705417	ชำระเงินแล้ว
153	194	0.00	400.00	เงินสด	2025-05-02 15:41:39.305309	2025-05-02 15:41:39.305309	ชำระเงินแล้ว
154	198	0.00	900.00	เงินสด	2025-05-02 16:31:35.483525	2025-05-02 16:31:35.483525	ชำระเงินแล้ว
155	203	0.00	300.00	เงินสด	2025-05-02 16:31:53.354682	2025-05-02 16:31:53.354682	ชำระเงินแล้ว
156	202	0.00	350.00	เงินสด	2025-05-03 16:03:13.100104	2025-05-03 16:03:13.100104	ชำระเงินแล้ว
157	201	0.00	400.00	เงินสด	2025-05-03 16:16:19.167417	2025-05-03 16:16:19.167417	ชำระเงินแล้ว
158	197	0.00	900.00	เงินสด	2025-05-04 12:53:17.13607	2025-05-04 12:53:17.13607	ชำระเงินแล้ว
159	205	0.00	200.00	เงินสด	2025-05-04 12:53:38.914005	2025-05-04 12:53:38.914005	ชำระเงินแล้ว
160	206	0.00	300.00	เงินสด	2025-05-04 16:44:02.663492	2025-05-04 16:44:02.663492	ชำระเงินแล้ว
161	200	0.00	400.00	เงินสด	2025-05-04 16:44:33.912184	2025-05-04 16:44:33.912184	ชำระเงินแล้ว
162	134	0.00	400.00	เงินสด	2025-05-05 10:37:33.1748	2025-05-05 10:37:33.1748	ชำระเงินแล้ว
163	208	0.00	400.00	เงินสด	2025-05-05 11:40:20.345346	2025-05-05 11:40:20.345346	ชำระเงินแล้ว
164	204	0.00	400.00	เงินสด	2025-05-05 15:34:20.377358	2025-05-05 15:34:20.377358	ชำระเงินแล้ว
165	212	0.00	400.00	เงินสด	2025-05-06 11:47:43.165201	2025-05-06 11:47:43.165201	ชำระเงินแล้ว
166	215	0.00	400.00	เงินสด	2025-05-06 11:47:58.607288	2025-05-06 11:47:58.607288	ชำระเงินแล้ว
167	221	0.00	400.00	เงินสด	2025-05-06 13:04:54.332834	2025-05-06 13:04:54.332834	ชำระเงินแล้ว
168	209	0.00	650.00	เงินสด	2025-05-06 13:56:28.962921	2025-05-06 13:56:28.962921	ชำระเงินแล้ว
169	207	0.00	600.00	เงินสด	2025-05-06 14:40:41.574773	2025-05-06 14:40:41.574773	ชำระเงินแล้ว
170	219	0.00	200.00	เงินสด	2025-05-07 15:41:41.383563	2025-05-07 15:41:41.383563	ชำระเงินแล้ว
171	211	0.00	400.00	เงินสด	2025-05-08 10:12:34.549195	2025-05-08 10:12:34.549195	ชำระเงินแล้ว
172	210	0.00	920.00	เงินสด	2025-05-08 12:29:06.583498	2025-05-08 12:29:06.583498	ชำระเงินแล้ว
173	213	0.00	1150.00	เงินสด	2025-05-08 20:04:10.736414	2025-05-08 20:04:10.736414	ชำระเงินแล้ว
174	217	0.00	800.00	เงินสด	2025-05-09 16:49:46.81183	2025-05-09 16:49:46.81183	ชำระเงินแล้ว
175	225	0.00	200.00	เงินสด	2025-05-09 16:50:15.863031	2025-05-09 16:50:15.863031	ชำระเงินแล้ว
176	220	0.00	650.00	เงินสด	2025-05-10 16:20:08.880095	2025-05-10 16:20:08.880095	ชำระเงินแล้ว
177	223	0.00	750.00	เงินสด	2025-05-10 16:20:42.706287	2025-05-10 16:20:42.706287	ชำระเงินแล้ว
178	216	0.00	550.00	เงินสด	2025-05-11 14:58:08.730407	2025-05-11 14:58:08.730407	ชำระเงินแล้ว
179	229	0.00	200.00	เงินสด	2025-05-11 14:58:27.490307	2025-05-11 14:58:27.490307	ชำระเงินแล้ว
180	228	0.00	800.00	เงินสด	2025-05-11 15:00:48.659406	2025-05-11 15:00:48.659406	ชำระเงินแล้ว
181	182	100.00	500.00	เงินโอน	2025-05-11 15:11:41.560644	2025-05-11 15:11:41.560644	ชำระเงินแล้ว
182	222	0.00	1050.00	เงินสด	2025-05-13 08:57:56.716788	2025-05-13 08:57:56.716788	ชำระเงินแล้ว
183	231	0.00	1250.00	เงินสด	2025-05-13 09:00:08.942056	2025-05-13 09:00:08.942056	ชำระเงินแล้ว
184	227	0.00	600.00	เงินสด	2025-05-13 10:41:15.06788	2025-05-13 10:41:15.06788	ชำระเงินแล้ว
185	224	0.00	400.00	เงินสด	2025-05-13 13:53:07.023312	2025-05-13 13:53:07.023312	ชำระเงินแล้ว
186	226	0.00	700.00	เงินสด	2025-05-13 13:53:58.705261	2025-05-13 13:53:58.705261	ชำระเงินแล้ว
187	238	0.00	1600.00	เงินสด	2025-05-13 16:38:25.923561	2025-05-13 16:38:25.923561	ชำระเงินแล้ว
188	230	0.00	550.00	เงินสด	2025-05-13 16:38:36.245259	2025-05-13 16:38:36.245259	ชำระเงินแล้ว
189	239	0.00	950.00	เงินสด	2025-05-14 13:59:52.189466	2025-05-14 13:59:52.189466	ชำระเงินแล้ว
190	240	0.00	250.00	เงินสด	2025-05-14 18:01:08.768864	2025-05-14 18:01:08.768864	ชำระเงินแล้ว
191	236	0.00	200.00	เงินสด	2025-05-14 18:01:44.043647	2025-05-14 18:01:44.043647	ชำระเงินแล้ว
192	242	0.00	400.00	เงินสด	2025-05-15 12:37:04.088074	2025-05-15 12:37:04.088074	ชำระเงินแล้ว
193	237	0.00	1050.00	เงินสด	2025-05-15 14:17:43.395665	2025-05-15 14:17:43.395665	ชำระเงินแล้ว
194	247	0.00	350.00	เงินสด	2025-05-15 16:46:06.772656	2025-05-15 16:46:06.772656	ชำระเงินแล้ว
195	241	0.00	400.00	เงินสด	2025-05-16 15:11:25.512898	2025-05-16 15:11:25.512898	ชำระเงินแล้ว
196	244	0.00	600.00	เงินสด	2025-05-16 15:11:40.141414	2025-05-16 15:11:40.141414	ชำระเงินแล้ว
197	251	0.00	450.00	เงินสด	2025-05-16 15:51:19.593791	2025-05-16 15:51:19.593791	ชำระเงินแล้ว
198	246	0.00	650.00	เงินสด	2025-05-16 15:53:18.768211	2025-05-16 15:53:18.768211	ชำระเงินแล้ว
199	243	0.00	1050.00	เงินสด	2025-05-17 12:18:06.319017	2025-05-17 12:18:06.319017	ชำระเงินแล้ว
200	250	0.00	750.00	เงินสด	2025-05-17 14:54:43.903073	2025-05-17 14:54:43.903073	ชำระเงินแล้ว
201	249	0.00	400.00	เงินสด	2025-05-18 13:10:29.30786	2025-05-18 13:10:29.30786	ชำระเงินแล้ว
202	245	200.00	2450.00	เงินสด	2025-05-19 13:11:30.776373	2025-05-19 13:11:30.776373	ชำระเงินแล้ว
203	248	0.00	1650.00	เงินสด	2025-05-19 13:11:48.334959	2025-05-19 13:11:48.334959	ชำระเงินแล้ว
204	256	0.00	480.00	เงินสด	2025-05-19 13:12:59.31389	2025-05-19 13:12:59.31389	ชำระเงินแล้ว
205	258	0.00	420.00	เงินสด	2025-05-20 14:54:42.968278	2025-05-20 14:54:42.968278	ชำระเงินแล้ว
206	255	0.00	450.00	เงินสด	2025-05-20 16:41:57.153967	2025-05-20 16:41:57.153967	ชำระเงินแล้ว
207	263	0.00	350.00	เงินสด	2025-05-20 16:42:43.137156	2025-05-20 16:42:43.137156	ชำระเงินแล้ว
208	252	0.00	550.00	เงินสด	2025-05-20 20:18:40.956552	2025-05-20 20:18:40.956552	ชำระเงินแล้ว
209	257	0.00	800.00	เงินสด	2025-05-20 20:19:29.915765	2025-05-20 20:19:29.915765	ชำระเงินแล้ว
210	264	0.00	250.00	เงินสด	2025-05-20 20:34:05.034287	2025-05-20 20:34:05.034287	ชำระเงินแล้ว
211	269	0.00	200.00	เงินสด	2025-05-21 10:42:09.967841	2025-05-21 10:42:09.967841	ชำระเงินแล้ว
212	267	0.00	400.00	เงินสด	2025-05-21 13:53:00.199715	2025-05-21 13:53:00.199715	ชำระเงินแล้ว
213	262	0.00	700.00	เงินสด	2025-05-21 22:02:28.855492	2025-05-21 22:02:28.855492	ชำระเงินแล้ว
214	265	0.00	600.00	เงินสด	2025-05-21 22:03:18.241059	2025-05-21 22:03:18.241059	ชำระเงินแล้ว
215	268	0.00	270.00	เงินสด	2025-05-21 22:05:45.247623	2025-05-21 22:05:45.247623	ชำระเงินแล้ว
216	271	0.00	600.00	เงินสด	2025-05-22 14:47:35.375873	2025-05-22 14:47:35.375873	ชำระเงินแล้ว
217	266	0.00	1950.00	เงินสด	2025-05-23 15:27:28.064799	2025-05-23 15:27:28.064799	ชำระเงินแล้ว
218	273	0.00	900.00	เงินสด	2025-05-23 20:47:14.703007	2025-05-23 20:47:14.703007	ชำระเงินแล้ว
219	261	0.00	1000.00	เงินสด	2025-05-23 20:47:31.731931	2025-05-23 20:47:31.731931	ชำระเงินแล้ว
220	282	0.00	300.00	เงินสด	2025-05-25 10:34:49.444753	2025-05-25 10:34:49.444753	ชำระเงินแล้ว
221	270	0.00	950.00	เงินสด	2025-05-25 20:10:11.347248	2025-05-25 20:10:11.347248	ชำระเงินแล้ว
222	275	0.00	600.00	เงินสด	2025-05-25 20:10:26.44183	2025-05-25 20:10:26.44183	ชำระเงินแล้ว
223	289	0.00	900.00	เงินสด	2025-05-26 16:11:35.418218	2025-05-26 16:11:35.418218	ชำระเงินแล้ว
224	276	0.00	200.00	เงินสด	2025-05-26 19:51:19.885433	2025-05-26 19:51:19.885433	ชำระเงินแล้ว
225	283	0.00	150.00	เงินสด	2025-05-26 19:52:04.671236	2025-05-26 19:52:04.671236	ชำระเงินแล้ว
226	287	0.00	400.00	เงินสด	2025-05-26 22:30:47.94746	2025-05-26 22:30:47.94746	ชำระเงินแล้ว
228	274	0.00	900.00	เงินสด	2025-05-27 14:39:43.471379	2025-05-27 14:39:43.471379	ชำระเงินแล้ว
229	285	0.00	500.00	เงินสด	2025-05-27 14:44:36.383199	2025-05-27 14:44:36.383199	ชำระเงินแล้ว
230	280	0.00	800.00	เงินสด	2025-05-27 15:02:28.290568	2025-05-27 15:02:28.290568	ชำระเงินแล้ว
231	279	0.00	1000.00	เงินสด	2025-05-27 15:42:48.074283	2025-05-27 15:42:48.074283	ชำระเงินแล้ว
232	288	0.00	500.00	เงินสด	2025-05-28 10:52:36.568421	2025-05-28 10:52:36.568421	ชำระเงินแล้ว
233	300	0.00	300.00	เงินสด	2025-05-28 11:49:00.275274	2025-05-28 11:49:00.275274	ชำระเงินแล้ว
234	272	0.00	600.00	เงินสด	2025-05-28 16:05:05.665259	2025-05-28 16:05:05.665259	ชำระเงินแล้ว
235	277	0.00	450.00	เงินสด	2025-05-28 16:49:19.996762	2025-05-28 16:49:19.996762	ชำระเงินแล้ว
236	286	0.00	1900.00	เงินสด	2025-05-28 17:10:54.410747	2025-05-28 17:10:54.410747	ชำระเงินแล้ว
237	293	0.00	200.00	เงินสด	2025-05-29 10:23:50.484492	2025-05-29 10:23:50.484492	ชำระเงินแล้ว
238	304	0.00	300.00	เงินสด	2025-05-29 10:24:06.374992	2025-05-29 10:24:06.374992	ชำระเงินแล้ว
239	290	0.00	200.00	เงินสด	2025-05-29 11:42:52.439126	2025-05-29 11:42:52.439126	ชำระเงินแล้ว
240	295	0.00	600.00	เงินสด	2025-05-29 13:20:25.388074	2025-05-29 13:20:25.388074	ชำระเงินแล้ว
241	296	0.00	600.00	เงินสด	2025-05-29 14:50:49.520684	2025-05-29 14:50:49.520684	ชำระเงินแล้ว
242	302	0.00	270.00	เงินสด	2025-05-29 16:18:12.200837	2025-05-29 16:18:12.200837	ชำระเงินแล้ว
243	284	0.00	400.00	เงินสด	2025-05-30 11:39:56.218229	2025-05-30 11:39:56.218229	ชำระเงินแล้ว
244	301	0.00	200.00	เงินสด	2025-05-30 11:40:15.796062	2025-05-30 11:40:15.796062	ชำระเงินแล้ว
245	294	0.00	250.00	เงินสด	2025-05-30 14:22:01.71821	2025-05-30 14:22:01.71821	ชำระเงินแล้ว
246	298	0.00	400.00	เงินสด	2025-05-31 22:42:05.835606	2025-05-31 22:42:05.835606	ชำระเงินแล้ว
247	214	0.00	600.00	เงินสด	2025-05-06 00:00:00	2025-06-01 13:04:28.99772	ชำระเงินแล้ว
248	297	0.00	800.00	เงินสด	2025-06-01 13:32:56.044559	2025-06-01 13:32:56.044559	ชำระเงินแล้ว
249	303	0.00	1000.00	เงินสด	2025-06-01 14:48:37.467052	2025-06-01 14:48:37.467052	ชำระเงินแล้ว
250	311	0.00	720.00	เงินสด	2025-06-01 15:32:21.619019	2025-06-01 15:32:21.619019	ชำระเงินแล้ว
251	292	0.00	1200.00	เงินสด	2025-06-01 17:01:17.148142	2025-06-01 17:01:17.148142	ชำระเงินแล้ว
252	318	0.00	300.00	เงินสด	2025-06-01 17:07:17.417324	2025-06-01 17:07:17.417324	ชำระเงินแล้ว
253	281	0.00	400.00	เงินสด	2025-06-02 16:55:53.901356	2025-06-02 16:55:53.901356	ชำระเงินแล้ว
254	324	0.00	500.00	เงินสด	2025-06-02 18:32:18.716789	2025-06-02 18:32:18.716789	ชำระเงินแล้ว
255	325	0.00	250.00	เงินสด	2025-06-03 10:28:33.768003	2025-06-03 10:28:33.768003	ชำระเงินแล้ว
256	322	0.00	680.00	เงินสด	2025-06-03 12:49:04.651651	2025-06-03 12:49:04.651651	ชำระเงินแล้ว
257	310	0.00	450.00	เงินสด	2025-06-03 17:40:41.839197	2025-06-03 17:40:41.839197	ชำระเงินแล้ว
258	316	0.00	600.00	เงินสด	2025-06-04 12:09:49.856001	2025-06-04 12:09:49.856001	ชำระเงินแล้ว
259	308	0.00	200.00	เงินสด	2025-06-04 19:11:38.341112	2025-06-04 19:11:38.341112	ชำระเงินแล้ว
260	315	0.00	1150.00	เงินสด	2025-06-04 19:11:57.345593	2025-06-04 19:11:57.345593	ชำระเงินแล้ว
261	313	0.00	590.00	เงินสด	2025-06-04 19:12:30.042769	2025-06-04 19:12:30.042769	ชำระเงินแล้ว
\.


--
-- Data for Name: payouts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payouts (id, payout_type, description, amount, branch_id, employee_id, notes, payout_date, created_at) FROM stdin;
36	อื่นๆ	เติมเงินโทรศัพท์	25.00	2	47		2025-04-28	2025-04-28 22:25:58.501748
37	รายเดือน	เงินเดือนเอ้	15000.00	2	47		2025-04-30	2025-05-01 14:48:10.357554
38	รายเดือน	เงินเดือนหญิง	20000.00	2	47		2025-04-30	2025-05-01 14:48:24.666897
39	อื่นๆ	หนังสือพิมพ์	200.00	2	47		2025-05-01	2025-05-01 15:56:31.21304
40	อื่นๆ	ค่าน้ำมันรถ	100.00	2	47		2025-05-02	2025-05-02 21:33:41.65761
41	รายเดือน	ค่าไฟ	2070.00	2	47		2025-05-03	2025-05-04 16:42:55.139607
42	อื่นๆ	ค่าน้ำมันรถ	100.00	2	47		2025-05-06	2025-05-06 11:52:24.429
43	อื่นๆ	ค่าน้ำมันรถ	300.00	2	47		2025-05-06	2025-05-08 20:07:54.994403
44	อุปกรณ์-น้ำยา	น้ำยาเคลือบกันน้ำ	114.00	2	47		2025-05-09	2025-05-10 15:55:22.66016
19	อื่นๆ	ค่าใช้จ่ายเดือนมีนาคม2568	4685.00	2	47		2025-03-31	2025-03-31 20:53:49.229071
20	รายเดือน	เงินเดือนเอ้	16500.00	2	47		2025-03-31	2025-03-31 20:54:56.771064
21	รายเดือน	เงินเดือน หญิง	16500.00	2	47		2025-03-31	2025-03-31 20:55:17.739621
22	อื่นๆ	ค่าส่งรองเท้า	60.00	2	47		2025-04-04	2025-04-04 16:17:15.424454
23	อื่นๆ	ค่าส่งรองเท้า	200.00	2	47		2025-04-04	2025-04-04 16:20:28.715068
24	อื่นๆ	ค่าส่งรองเท้า	60.00	2	47		2025-04-08	2025-04-09 13:18:43.811931
45	อุปกรณ์-น้ำยา	ซาวล้างผ้า	115.00	2	47		2025-05-10	2025-05-10 15:55:39.010879
25	อื่นๆ	ค่าส่งรองเท้า	194.00	2	47	คนจีน	2025-04-07	2025-04-09 20:12:55.41105
26	อื่นๆ	ค่าส่งรองเท้า	60.00	2	47	โรงบาลกรุงเทพ	2025-04-08	2025-04-09 20:13:49.173186
27	อื่นๆ	ค่าส่งรองเท้า	57.00	2	47	โรงเรียนเชิงดอยสุเทพ	2025-04-08	2025-04-09 20:14:25.285051
28	อื่นๆ	ค่าส่งรองเท้า	85.00	2	47		2025-04-11	2025-04-11 14:08:27.083478
29	อื่นๆ	ค่า grab	60.00	2	47		2568-04-20	2025-04-21 10:11:36.322221
30	อุปกรณ์-น้ำยา	น้ำยาล้างห้องเครื่อง	150.00	2	47		2568-04-26	2025-04-27 23:03:03.86107
31	อุปกรณ์-น้ำยา	ยางลบหนังกลับ	59.00	2	47		2568-04-25	2025-04-27 23:04:35.126358
32	อุปกรณ์-น้ำยา	แผ่นลิปมัส	6.00	2	47		2025-04-26	2025-04-27 23:07:24.99206
34	อุปกรณ์-น้ำยา	ยางลบหนังกลับ	59.00	2	47		2025-04-25	2025-04-27 23:08:40.032221
33	อุปกรณ์-น้ำยา	น้ำยาซักรองเท้า	150.00	2	47		2025-04-25	2025-04-27 23:08:09.959447
35	รายเดือน	ค่าน้ำ	288.00	2	47		2025-04-24	2025-04-28 22:21:34.306267
46	อุปกรณ์-น้ำยา	น้ำยา	350.00	2	47		2025-05-10	2025-05-11 17:05:53.16487
47	อุปกรณ์-น้ำยา	น้ำยาแก้ขอบเหลือง	132.00	2	47		2025-05-11	2025-05-11 17:06:58.246534
48	อื่นๆ	grab	45.00	2	47		2025-05-12	2025-05-13 08:58:20.301534
49	อื่นๆ	ค่าน้ำมันรถ	100.00	2	47		2025-05-13	2025-05-14 14:00:23.325743
50	อื่นๆ	เติมค่าโทรศัพท์	25.00	2	47		2025-05-16	2025-05-16 15:23:03.141324
51	อุปกรณ์-น้ำยา	อุปกรณ์ ถุงมือ	80.00	2	47		2025-05-17	2025-05-18 11:19:58.051423
52	อื่นๆ	เติมน้ำมัน	50.00	2	47		2025-05-17	2025-05-18 11:20:17.181023
53	อุปกรณ์-น้ำยา	ถุงน้ำตาล	398.00	2	47		2025-05-19	2025-05-19 15:48:41.627036
54	อื่นๆ	ค่าน้ำมันรถ	200.00	2	47		2025-05-19	2025-05-19 15:49:05.975697
55	อุปกรณ์-น้ำยา	ปรับผ้านุ่ม	10.00	2	47		2025-05-19	2025-05-20 20:28:32.827875
56	อุปกรณ์-น้ำยา	สีเพ้นท์รองเท้า	292.00	2	47		2025-05-21	2025-05-21 22:19:28.552522
57	อุปกรณ์-น้ำยา	ถุงใส	214.00	2	47		2025-05-21	2025-05-21 22:19:59.577716
58	อื่นๆ	ค่าส่วนกลาง	11250.00	2	47		2025-05-21	2025-05-22 07:35:15.175998
59	รายเดือน	เงินเดือนเอ้	15000.00	2	47		2025-05-30	2025-05-26 09:38:39.99372
60	รายเดือน	เงินเดือนหญิง	20000.00	2	47		2025-05-30	2025-05-26 09:38:55.602138
61	อื่นๆ	กระเป๋าใส่รองเท้า	95.00	2	47	ทำแคมเปญรักษ์โลก	2025-05-25	2025-05-26 09:40:08.56414
62	อื่นๆ	ค่าน้ำมันรถ	100.00	2	47		2025-05-26	2025-05-26 22:31:36.170171
63	อุปกรณ์-น้ำยา	น้ำยาเช็ดรองเท้า	160.00	2	47		2025-05-26	2025-05-26 22:32:29.200479
64	รายเดือน	ค่าน้ำประปา	273.00	2	47		2025-05-27	2025-05-27 15:25:49.172204
65	รายเดือน	ค่าเช่า	6000.00	2	47		2025-05-31	2025-05-28 17:10:31.720607
66	ค่าส่งรองเท้า	ค่า grab	55.00	2	47		2025-05-28	2025-05-28 22:00:23.255166
67	อื่นๆ	เติมน้ำมันรถ	500.00	2	47		2025-05-27	2025-05-29 07:26:05.555729
68	รายเดือน	เน็ตบ้าน	640.00	2	47	เดือนละ 320	2025-05-29	2025-05-29 07:26:29.17632
69	อุปกรณ์-น้ำยา	เสปรย์เคลือบกันน้ำ	362.00	2	47		2025-05-29	2025-05-29 14:55:23.602536
70	อื่นๆ	เติมน้ำมัน	50.00	2	47		2025-05-29	2025-05-31 00:42:55.394961
71	อุปกรณ์-น้ำยา	Diy	227.00	2	47		2025-05-29	2025-05-31 00:44:56.904971
72	อุปกรณ์-น้ำยา	เคลือบกันน้ำ	362.00	2	47		2025-05-30	2025-05-31 00:46:24.597532
73	อื่นๆ	เติมเงินร้าน	25.00	2	47		2025-05-30	2025-05-31 00:46:45.829161
74	อุปกรณ์-น้ำยา	ฟองน้ำ ถุงมือ	40.00	2	47		2025-06-01	2025-06-01 12:17:12.656515
75	อื่นๆ	ถุงใส่รองเท้า	95.00	2	47		2025-06-01	2025-06-01 15:32:59.483061
77	ค่าส่งรองเท้า	เติมน้ำมัน	100.00	2	47		2025-06-01	2025-06-03 12:02:39.56039
78	อื่นๆ	ค่าซ่อมมอเตอร์ไซค์	100.00	2	47		2025-06-02	2025-06-03 12:05:42.973126
\.


--
-- Data for Name: queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queue (id, customer_name, phone, location, total_pairs, total_price, delivery_date, status, received_date, branch_id, payment_status, customer_id, source, return_slot_id, locker_id, slot_id) FROM stdin;
137	Waan	000	Walk-in	2	400.00	2025-04-05	จัดส่งสำเร็จ	2025-04-02	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
298	Line-YIM :)	0946286533	ธนาคารออมสิน Big c ดอนจั่น	2	400.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	151	manual	\N	\N	\N
251	Line-🤖ⓣⓐⓡⓝ🤖	09449347778	Walk-in	2	450.00	2025-05-16	จัดส่งสำเร็จ	2025-05-14	2	ชำระเงินแล้ว	103	manual	\N	\N	\N
230	Tharawarit Itthisakkuldecha	000	Walk-in	3	550.00	2025-05-12	จัดส่งสำเร็จ	2025-05-09	2	ชำระเงินแล้ว	\N	manual	\N	\N	\N
300	Ploy♥	0951389393	Walk-in	1	300.00	2025-05-28	จัดส่งสำเร็จ	2025-05-27	2	ชำระเงินแล้ว	156	manual	\N	\N	\N
246	Bow Kawichai	0820878610	ร้านอาหารสายปิง	3	650.00	2025-05-16	จัดส่งสำเร็จ	2025-05-13	2	ชำระเงินแล้ว	98	manual	\N	\N	\N
264	Jaisaii.	0000000002	Walk-in	1	250.00	2025-05-20	จัดส่งสำเร็จ	2025-05-16	2	ชำระเงินแล้ว	119	manual	\N	\N	\N
240	Line-google	0841708155	Walk-in	1	250.00	2025-05-14	จัดส่งสำเร็จ	2025-05-11	2	ชำระเงินแล้ว	91	manual	\N	\N	\N
267	Korakod	0918598967	ห้อง211 เอส.เอส.แมนชั่น 19/1 ซ.อร่ามศรี ถ.พญาไท แขวงทุ่งพญาไท เขตราชเทวี 10400	2	400.00	2025-05-21	จัดส่งสำเร็จ	2025-05-17	2	ชำระเงินแล้ว	120	manual	\N	\N	\N
269	Baitongjme	000	walk in	1	200.00	2025-05-21	จัดส่งสำเร็จ	2025-05-19	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
322	0815511999	0815511999	Walk-in	1	680.00	2025-06-03	จัดส่งสำเร็จ	2025-06-02	2	ชำระเงินแล้ว	175	manual	\N	\N	\N
318	อมรรัตน์ ชมภูศรี	0635351193	Walk-in	1	300.00	2025-06-02	จัดส่งสำเร็จ	2025-06-01	2	ชำระเงินแล้ว	173	manual	\N	\N	\N
236	Tum Fisheries	0832099111	Walk-in	1	200.00	2025-05-14	จัดส่งสำเร็จ	2025-05-11	2	ชำระเงินแล้ว	87	manual	\N	\N	\N
274	Line-Aan	0991639262	โลตัส (ร้านสัก ตรงข้ามรร.อโนดาด)	4	900.00	2025-05-26	จัดส่งสำเร็จ	2025-05-22	2	ชำระเงินแล้ว	127	manual	\N	\N	\N
279	แจ๊บโป้ เห็นมันไหม	0829262529	D condo ping ตึก D	6	1000.00	2025-05-26	จัดส่งสำเร็จ	2025-05-23	2	ชำระเงินแล้ว	129	manual	\N	\N	\N
295	Praween Piangchompu	0988853369	Walk-in	3	600.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	154	manual	\N	\N	\N
304	No Kia	0000000014	Walk-in	1	300.00	2025-05-29	จัดส่งสำเร็จ	2025-05-28	2	ชำระเงินแล้ว	160	manual	\N	\N	\N
290	S@@RUN °4265°	0893544155	Walk-in	1	200.00	2025-05-28	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	147	manual	\N	\N	\N
326	Wanida Kosachawieng	0000000016	Walk-in	2	450.00	2025-06-05	รับเข้า	2025-06-02	2	pending	179	manual	\N	\N	\N
315	Aum Pts	0661469928	ดิ อิสสระ คอนโด	5	1150.00	2025-06-03	จัดส่งสำเร็จ	2025-05-31	2	ชำระเงินแล้ว	169	manual	\N	\N	\N
284	Pennueng	0986297826	อัญชัน2	2	400.00	2025-05-28	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	54	manual	\N	\N	\N
307	Line-S@@RUN °4265°	0893544155	Walk-in	1	200.00	2025-06-02	กำลังจัดส่ง	2025-05-29	2	pending	147	manual	\N	\N	\N
331	Ying	0854152495	Walk-in	1	200.00	2025-06-20	เตรียมส่ง	2025-06-04	2	pending	43	locker	\N	\N	\N
270	Thunaset Trakulimthong	0949835005	grab	4	950.00	2025-05-24	จัดส่งสำเร็จ	2025-05-21	2	ชำระเงินแล้ว	123	manual	\N	\N	\N
237	Patt Chinnakarn	0962366165	palm garden สันนาเม็ง	4	1050.00	2025-05-14	จัดส่งสำเร็จ	2025-05-11	2	ชำระเงินแล้ว	88	manual	\N	\N	\N
280	Worachet Inya	0993236151	central airport ชั้น 4	4	800.00	2025-05-26	จัดส่งสำเร็จ	2025-05-23	2	ชำระเงินแล้ว	128	manual	\N	\N	\N
285	Bantita Boonmati	0858656799	SK KAKEN CBP หลังบิ๊กซีเอ็ซตร้า	2	500.00	2025-05-27	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	137	manual	\N	\N	\N
275	Wasana Prasit	0892662499	บ้านเลขที่60ซอย3 แถวโกลเด้นทาวน์	3	600.00	2025-05-25	จัดส่งสำเร็จ	2025-05-22	2	ชำระเงินแล้ว	126	manual	\N	\N	\N
257	Line-PPP.🌥️🌈	0855514944	ชัชชญา ชำนาญเอื้อ 3009/56 สุขุมวิท101 บางจาก พระโขนง กทม 10260	4	800.00	2025-05-19	จัดส่งสำเร็จ	2025-05-16	2	ชำระเงินแล้ว	111	manual	\N	\N	\N
247	Aomaam Bulun	0615469563	Walk-in	1	350.00	2025-05-15	จัดส่งสำเร็จ	2025-05-13	2	ชำระเงินแล้ว	99	manual	\N	\N	\N
231	Line-nae	000	Walk-in	6	1250.00	2025-05-12	จัดส่งสำเร็จ	2025-05-09	2	ชำระเงินแล้ว	\N	manual	\N	\N	\N
272	Line-mod	0817641267	รพ.ประสาท เชียงใหม่	3	600.00	2025-05-28	จัดส่งสำเร็จ	2025-05-21	2	ชำระเงินแล้ว	122	manual	\N	\N	\N
308	Potae Kosin	0000000012	Walk-in	1	200.00	2025-06-04	จัดส่งสำเร็จ	2025-05-30	2	ชำระเงินแล้ว	163	manual	\N	\N	\N
241	Chana Chayanont	0857079729	hide land ช้างม่อย	2	400.00	2025-05-15	จัดส่งสำเร็จ	2025-05-12	2	ชำระเงินแล้ว	92	manual	\N	\N	\N
316	Ratthakorn Niramitmahapanya	0877270207	Runstock	3	600.00	2025-06-03	จัดส่งสำเร็จ	2025-05-31	2	ชำระเงินแล้ว	172	manual	\N	\N	\N
319	Piacher Jularat	0810747564 	Walk-in	2	0.00	2025-06-05	รับเข้า	2025-06-01	2	pending	174	manual	\N	\N	\N
296	Sumanee Prakobsuk	0897766320	รพ เชียงใหม่ราม	3	600.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	135	manual	\N	\N	\N
311	Line-$uguszad	0865564452	477/20 ม.1 ต.แม่เหียะ	4	720.00	2025-06-01	จัดส่งสำเร็จ	2025-05-29	2	ชำระเงินแล้ว	168	manual	\N	\N	\N
323	Korakoch Sonthi	0000000012	ส่ง Grab มา	2	0.00	2025-06-05	รับเข้า	2025-06-02	2	pending	176	manual	\N	\N	\N
143	Phuwadol	0877272671	panda จริงใจมาร์เก็ต	2	400.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	50	manual	\N	\N	\N
244	Line-Jira_Nim	1111111111	Walk-in	3	600.00	2025-05-30	จัดส่งสำเร็จ	2025-05-13	2	ชำระเงินแล้ว	96	manual	\N	\N	\N
301	Line-BASJARUPONG	0000000012	Walk-in	1	200.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	157	manual	\N	\N	\N
327	Line-ปุ๊ก  ♡	0828953611	Walk-in	1	200.00	2025-06-07	รับเข้า	2025-06-03	2	pending	180	manual	\N	\N	\N
291	Sarinya Utsp	0000000011	Walk-in	1	300.00	2025-05-30	กำลังจัดส่ง	2025-05-25	2	pending	149	manual	\N	\N	\N
242	Line-1012_พ.อ.อ.วัชรพงษ์	0000000000	199/77	2	400.00	2025-05-15	จัดส่งสำเร็จ	2025-05-11	2	ชำระเงินแล้ว	94	manual	\N	\N	\N
161	Pattaraporn	000	Walk-in	1	250.00	2025-04-18	จัดส่งสำเร็จ	2025-04-15	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
305	Sitthi Kan	0992944521	บ้านพัก อบจ.1	5	1000.00	2025-06-06	อยู่ระหว่างทำความสะอาด	2025-05-28	2	pending	158	manual	\N	\N	\N
271	起床气不在 คนจีน	0000000005	โรงแรมรอยัลพรรณราย ช้างม่อย	2	600.00	2025-05-24	จัดส่งสำเร็จ	2025-05-21	2	ชำระเงินแล้ว	124	manual	\N	\N	\N
252	อุมาลัย บุญมี	0914121413	พิงดอยเพลส	2	550.00	2025-05-18	จัดส่งสำเร็จ	2025-05-15	2	ชำระเงินแล้ว	104	manual	\N	\N	\N
255	Warinlada	0947632229	The base condo	2	450.00	2025-05-19	จัดส่งสำเร็จ	2025-05-16	2	ชำระเงินแล้ว	21	manual	\N	\N	\N
320	Sitthi Kan	0992944521	บ้านพัก อบจ.2	1	0.00	2025-06-06	รับเข้า	2025-05-28	2	pending	158	manual	\N	\N	\N
265	Wechat-白猫超人@	0943317395	THE BASE Height-Chiangmai	2	600.00	2025-05-21	จัดส่งสำเร็จ	2025-05-18	2	ชำระเงินแล้ว	113	manual	\N	\N	\N
324	Watcharawit Sooksai	0924496241	Walk-in	2	500.00	2025-06-05	อยู่ระหว่างทำความสะอาด	2025-06-02	2	ชำระเงินแล้ว	177	manual	\N	\N	\N
248	Kiddy Blue	0946343636	คณะสาสุข มช	8	1650.00	2025-05-19	จัดส่งสำเร็จ	2025-05-14	2	ชำระเงินแล้ว	100	manual	\N	\N	\N
276	Alex Dingle	0000000004	Hillside 3 นิมมาน	1	200.00	2025-05-26	จัดส่งสำเร็จ	2025-05-22	2	ชำระเงินแล้ว	130	manual	\N	\N	\N
286	ไอ’แอม มิ้นท์นี่	0828788922	หมู่บ้านกาญจน์กนก2เฟส4 (116/17)	7	1900.00	2025-05-28	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	139	manual	\N	\N	\N
281	อ.อู๋	0000000006	Walk-in	2	400.00	2025-05-28	จัดส่งสำเร็จ	2025-05-24	2	ชำระเงินแล้ว	133	manual	\N	\N	\N
302	Line	0889747454	The One Condo	1	270.00	2025-05-30	จัดส่งสำเร็จ	2025-05-27	2	ชำระเงินแล้ว	159	manual	\N	\N	\N
297	Line-Ds' jubjaNg	0895565545	เลควิว	3	800.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	153	manual	\N	\N	\N
261	JJ Teeda	0857230966	Walk-in	5	1000.00	2025-05-21	จัดส่งสำเร็จ	2025-05-18	2	ชำระเงินแล้ว	115	manual	\N	\N	\N
328	Line-F🐶	0991431117	ร้านแว่นตามุลเลอร์ ตรงข้ามรพ ลานนา	6	0.00	2025-06-06	รับเข้า	2025-06-03	2	pending	181	manual	\N	\N	\N
312	Line-ศักรินทร์ดาวราย	0960024526	117/358 กาดวรุณ	3	910.00	2025-06-03	กำลังจัดส่ง	2025-05-30	2	pending	165	manual	\N	\N	\N
292	Pawinee Promrak	0801331480	DCondo Rin	6	1200.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	138	manual	\N	\N	\N
309	Prat Panya	00000000013	Walk-in	1	800.00	2025-06-03	อยู่ระหว่างทำความสะอาด	2025-05-30	2	pending	166	manual	\N	\N	\N
181	Line-Gook	000	grab	3	650.00	2025-04-25	จัดส่งสำเร็จ	2025-04-21	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
224	Phuwadol Khummali	0877272671	จริงใจมาร์เก็ต	2	400.00	2025-05-11	จัดส่งสำเร็จ	2025-05-08	2	ชำระเงินแล้ว	50	manual	\N	\N	\N
220	Line-(รูปยิ้ม)	0962570539	Walk-in	3	650.00	2025-05-08	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	7	manual	\N	\N	\N
206	ลูกค้า	0839465352	Walk-in	1	300.00	2025-05-04	จัดส่งสำเร็จ	2025-05-03	2	ชำระเงินแล้ว	14	manual	\N	\N	\N
256	Line-🌻シJaae(xiaomei)💖	0851776886	กาดธานินทร์	2	480.00	2025-05-18	จัดส่งสำเร็จ	2025-05-15	2	ชำระเงินแล้ว	110	manual	\N	\N	\N
262	Papanin De La Fleur	0636694053	สกายบรีซคอนโด ห้วยแก้ว	2	700.00	2025-05-20	จัดส่งสำเร็จ	2025-05-17	2	ชำระเงินแล้ว	116	manual	\N	\N	\N
249	Nichagorn Samergun	0882533512	วันพลัส6 มหิดล	2	400.00	2025-05-17	จัดส่งสำเร็จ	2025-05-14	2	ชำระเงินแล้ว	101	manual	\N	\N	\N
200	Fay Tanasu	0944245564	scene สวนดอก	2	400.00	2025-05-03	จัดส่งสำเร็จ	2025-05-30	2	ชำระเงินแล้ว	29	manual	\N	\N	\N
219	ลูกค้า	0818477650	Walk-in	1	200.00	2025-05-08	จัดส่งสำเร็จ	2025-05-05	2	ชำระเงินแล้ว	74	manual	\N	\N	\N
216	Rinrada Wong	000	Walk-in	2	550.00	2025-05-08	จัดส่งสำเร็จ	2025-05-05	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
229	Line-FILM	000	Walk-in	1	200.00	2025-05-10	จัดส่งสำเร็จ	2025-05-07	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
228	Line- -NATTHAMON	0913065082	airport business	4	800.00	2025-05-10	จัดส่งสำเร็จ	2025-05-07	2	ชำระเงินแล้ว	18	manual	\N	\N	\N
225	Thanachit Sophin	000	Walk-in	1	200.00	2025-05-10	จัดส่งสำเร็จ	2025-05-07	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
226	Line-Pink	0622976111	เมญ่า	3	700.00	2025-05-11	จัดส่งสำเร็จ	2025-05-08	2	ชำระเงินแล้ว	73	manual	\N	\N	\N
243	Line-Panrada	0955622496	three nakhanik	5	1050.00	2025-05-19	จัดส่งสำเร็จ	2025-05-13	2	ชำระเงินแล้ว	95	manual	\N	\N	\N
227	Pran Piriya	0612429196	สนามบิน	3	600.00	2025-05-10	จัดส่งสำเร็จ	2025-05-07	2	ชำระเงินแล้ว	16	manual	\N	\N	\N
217	Piyanan Fon	0851526662	Walk-in	4	800.00	2025-05-08	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	6	manual	\N	\N	\N
80	Line-Universe@จักรวาล	099	เซนเฟส	1	200.00	2025-03-29	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
84	Line-ING	099	ส่ง Grab	2	400.00	2025-03-30	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
223	Beary Beer	0925092690	คุ้มภัยโตเกียวมารีนประกันภัย	3	750.00	2025-05-09	จัดส่งสำเร็จ	2025-05-06	2	ชำระเงินแล้ว	45	manual	\N	\N	\N
238	wechat-Fairy	0612704158	d condo nim ตึก c	8	1600.00	2025-05-13	จัดส่งสำเร็จ	2025-05-10	2	ชำระเงินแล้ว	89	manual	\N	\N	\N
88	Line-North	-	Walk-in	6	1850.00	2025-03-29	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
85	FB-Potae Kosin	-	Walk-in	1	200.00	2025-03-31	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
142	line-Vya	0800327914	we run 	2	600.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	66	manual	\N	\N	\N
266	Line-Erboon	09144454269	คณะบริการธุรกิจ มช	6	1950.00	2025-05-22	จัดส่งสำเร็จ	2025-05-19	2	ชำระเงินแล้ว	118	manual	\N	\N	\N
108	6/3/68	-	Walk-in	0	1550.00	2025-03-06	จัดส่งสำเร็จ	2025-03-06	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
91	Line- ((#WASSER 	099	Walk-in	1	200.00	2025-03-30	จัดส่งสำเร็จ	2025-03-29	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
103	วันที่ 3 มี.ค.68	-	Walk-in	0	3050.00	2025-03-03	จัดส่งสำเร็จ	2025-03-03	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
82	FB-Naphapol Somwang	0827669097	Third place coffee ศิริมังฯ	2	400.00	2025-03-30	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	49	manual	\N	\N	\N
86	Line-CAT	0954792895	39 ถ.ช้างคลาน 	2	400.00	2025-03-31	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	56	manual	\N	\N	\N
78	Katoon Patsara	0869142487	โลตัสคำเที่ยง	2	400.00	2025-03-29	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	8	manual	\N	\N	\N
111	9/3/68	-	Walk-in	0	3750.00	2025-03-09	จัดส่งสำเร็จ	2025-03-09	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
94	Wa Rungtiwa	000	Walk-in	1	250.00	2025-04-01	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
101	วันที่ 1 มี.ค. 68	-	Walk-in	0	2250.00	2025-04-01	จัดส่งสำเร็จ	2025-03-01	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
104	วันที่ 4 มี.ค.68	-	Walk-in	0	1700.00	2025-03-04	จัดส่งสำเร็จ	2025-03-04	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
74	Wa Rungtiwa	099	Walk-in	5	1100.00	2025-03-28	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
76	T289	099	Walk-in	2	800.00	2025-03-28	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
282	Line-A E Y	0805233176	Walk-in	1	300.00	2025-05-24	จัดส่งสำเร็จ	2025-05-23	2	ชำระเงินแล้ว	134	manual	\N	\N	\N
277	Wechat-葉在泰国	0834081240	Wanmai House	2	450.00	2025-05-26	จัดส่งสำเร็จ	2025-05-23	2	ชำระเงินแล้ว	131	manual	\N	\N	\N
287	Line-Dona Srimahachota	0000000007	Walk-in	2	400.00	2025-05-28	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	141	manual	\N	\N	\N
299	Line-~Achiraya~	0654064095	Walk-in	3	520.00	2025-06-03	กำลังจัดส่ง	2025-05-27	2	pending	155	manual	\N	\N	\N
310	ฝรั่ง	0633711605	Walk-in	2	450.00	2025-06-03	จัดส่งสำเร็จ	2025-05-30	2	ชำระเงินแล้ว	167	manual	\N	\N	\N
313	Natsuda	0929410393	รร.R1 นิมมาน	2	590.00	2025-06-03	จัดส่งสำเร็จ	2025-05-30	2	ชำระเงินแล้ว	164	manual	\N	\N	\N
77	Mim Achi	0894312713	ศุลกากร	6	1600.00	2025-03-28	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	24	manual	\N	\N	\N
75	Vya	0800327914	Werun	2	450.00	2025-03-28	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	66	manual	\N	\N	\N
102	วันที่ 2 มี.ค. 68	-	Walk-in	0	2650.00	2025-03-02	จัดส่งสำเร็จ	2025-03-02	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
100	Zinyin	000	Walk-in	3	600.00	2025-04-30	จัดส่งสำเร็จ	2025-03-23	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
81	Aom Nun	-	Walk-in	3	600.00	2025-03-29	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
83	Line-wut nattawut	099	ส่งGrabมา ถุงสีฟ้า	4	600.00	2025-03-30	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
109	7/3/68	-	Walk-in	0	3400.00	2025-03-07	จัดส่งสำเร็จ	2025-03-07	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
79	Line-Na's	0612061113	โลตัสคำเที่ยง	4	850.00	2025-03-29	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	28	manual	\N	\N	\N
93	Sawitree	000	Walk-in	1	200.00	2025-04-01	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
107	5/3/68	-	Walk-in	0	2600.00	2025-03-05	จัดส่งสำเร็จ	2025-03-05	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
115	13/3/68	-	Walk-in	0	800.00	2025-03-13	จัดส่งสำเร็จ	2025-03-13	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
112	10/3/68	-	Walk-in	0	2450.00	2025-03-10	จัดส่งสำเร็จ	2025-03-10	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
110	8/3/68	-	Walk-in	0	1650.00	2025-03-08	จัดส่งสำเร็จ	2025-03-08	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
114	12/3/68	-	Walk-in	0	4150.00	2025-03-12	จัดส่งสำเร็จ	2025-03-12	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
113	11/3/68	-	Walk-in	0	400.00	2025-03-11	จัดส่งสำเร็จ	2025-03-11	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
118	16/3/68	-	Walk-in	0	2800.00	2025-03-16	จัดส่งสำเร็จ	2025-03-16	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
116	14/3/68	-	Walk-in	0	1500.00	2025-03-14	จัดส่งสำเร็จ	2025-03-14	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
117	15/3/68	-	Walk-in	0	1700.00	2025-03-15	จัดส่งสำเร็จ	2025-03-15	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
119	17/3/68	-	Walk-in	0	2200.00	2025-03-17	จัดส่งสำเร็จ	2025-03-17	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
120	18/3/68	-	Walk-in	0	1850.00	2025-03-18	จัดส่งสำเร็จ	2025-03-18	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
121	19/3/68	-	Walk-in	0	1200.00	2025-03-19	จัดส่งสำเร็จ	2025-03-19	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
122	20/3/68	-	Walk-in	0	1750.00	2025-03-20	จัดส่งสำเร็จ	2025-03-20	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
123	21/3/68	-	Walk-in	0	1750.00	2025-03-21	จัดส่งสำเร็จ	2025-03-21	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
124	23/3/68	-	Walk-in	0	1200.00	2025-03-22	จัดส่งสำเร็จ	2025-03-22	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
125	21/3/68	-	Walk-in	0	2250.00	2025-03-24	จัดส่งสำเร็จ	2025-03-24	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
126	25/3/68	-	Walk-in	0	4400.00	2025-03-25	จัดส่งสำเร็จ	2025-03-25	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
127	26/3/68	-	Walk-in	0	2000.00	2025-03-26	จัดส่งสำเร็จ	2025-03-26	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
153	Nooning	0626569597	ชม.ราม	6	1200.00	2025-04-12	จัดส่งสำเร็จ	2025-04-09	2	ชำระเงินแล้ว	3	manual	\N	\N	\N
144	Nok	0895150216	เดอรูม อพาร์ตเมนท์	3	600.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	55	manual	\N	\N	\N
129	27/3/68	-	Walk-in	0	3230.00	2025-03-27	จัดส่งสำเร็จ	2025-03-27	2	ชำระเงินแล้ว	75	manual	\N	\N	\N
140	Oom	000	Walk-in	1	200.00	2025-04-10	จัดส่งสำเร็จ	2025-04-07	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
131	คนจีน	000	กุลพันธ์วิลล์9 หางดง	2	900.00	2025-04-03	จัดส่งสำเร็จ	2025-04-01	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
95	Line-N251	000	Walk-in	4	800.00	2025-04-01	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
99	คุณแพร	000	Grab	4	1000.00	2025-04-01	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
90	line-iy Cha Ya dA	099	ซอยสนามบิน	4	800.00	2025-04-01	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	35	manual	\N	\N	\N
149	ร้านรถโปลิ	0832695969	ร้านรถโปลิ	4	800.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	33	manual	\N	\N	\N
98	Boing	000	ปณ	3	710.00	2025-04-02	จัดส่งสำเร็จ	2025-03-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
138	คนจีน	000	กุลพันธ์วิลล์9 หางดง	2	750.00	2025-04-08	จัดส่งสำเร็จ	2025-04-03	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
132	ชินวุธ 	0946020222	My hip2	2	450.00	2025-04-03	จัดส่งสำเร็จ	2025-04-01	2	ชำระเงินแล้ว	53	manual	\N	\N	\N
146	Khing	0804919993	ร้านขายของลานนา	3	550.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	4	manual	\N	\N	\N
136	Pennueng	0986297826	อัญชัน2	4	800.00	2025-04-04	จัดส่งสำเร็จ	2025-04-02	2	ชำระเงินแล้ว	54	manual	\N	\N	\N
139	Stamp	000	Walk-in	1	200.00	2025-04-10	จัดส่งสำเร็จ	2025-04-07	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
141	Sirinapha	000	Walk-in	1	250.00	2025-04-10	จัดส่งสำเร็จ	2025-04-04	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
135	Pennapa	000	Walk-in	1	300.00	2025-04-04	จัดส่งสำเร็จ	2025-04-02	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
151	Natthapong	0882620461	หมู่บ้านศิริวัฒนา	5	1250.00	2025-04-13	จัดส่งสำเร็จ	2025-04-10	2	ชำระเงินแล้ว	19	manual	\N	\N	\N
148	Witana	0811696564	ร้านเขยเจียงใหม่	2	400.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	69	manual	\N	\N	\N
145	นิษฐ์วรา	0948289946	ร้านลูกโป่ง ดอนจั่น	5	1000.00	2025-04-12	จัดส่งสำเร็จ	2025-04-08	2	ชำระเงินแล้ว	27	manual	\N	\N	\N
147	Saranya	0991541636	Walk-in	2	400.00	2025-04-12	จัดส่งสำเร็จ	2025-04-09	2	ชำระเงินแล้ว	20	manual	\N	\N	\N
156	Line-Pim	0822838340	D condo sign B	4	800.00	2025-04-14	จัดส่งสำเร็จ	2025-04-11	2	ชำระเงินแล้ว	52	manual	\N	\N	\N
150	Teerapong	0952415184	รร.บ้านเชิงดอย	2	400.00	2025-04-13	จัดส่งสำเร็จ	2025-04-10	2	ชำระเงินแล้ว	11	manual	\N	\N	\N
158	Goffcap	0812893901	One+7ยอด6	2	400.00	2025-04-14	จัดส่งสำเร็จ	2025-04-11	2	ชำระเงินแล้ว	26	manual	\N	\N	\N
157	Line-Bytb	000	Walk-in	1	200.00	2025-04-14	จัดส่งสำเร็จ	2025-04-09	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
164	Aurora	0861843678	ฺ๊Burapa Boutique	4	650.00	2025-04-19	จัดส่งสำเร็จ	2025-04-16	2	ชำระเงินแล้ว	65	manual	\N	\N	\N
154	Phattharathida	000	Walk-in	1	300.00	2025-04-11	จัดส่งสำเร็จ	2025-04-10	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
162	LINE-ปภณ	000	Walk-in	2	400.00	2025-04-18	จัดส่งสำเร็จ	2025-04-16	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
155	Nuntiya	0810701999	Walk-in	1	200.00	2025-04-12	จัดส่งสำเร็จ	2025-04-10	2	ชำระเงินแล้ว	68	manual	\N	\N	\N
133	พี่ตังเมย์	0932987751	Walk-in	1	200.00	2025-04-04	จัดส่งสำเร็จ	2025-04-02	2	ชำระเงินแล้ว	22	manual	\N	\N	\N
152	Warinlada	0947632229	The one condo	3	750.00	2025-04-12	จัดส่งสำเร็จ	2025-04-09	2	ชำระเงินแล้ว	21	manual	\N	\N	\N
159	Narin	000	Walk-in	1	200.00	2025-04-14	จัดส่งสำเร็จ	2025-04-11	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
160	line-pw	000	Walk-in	4	800.00	2025-04-16	จัดส่งสำเร็จ	2025-04-13	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
166	Rutchadaporn	0836246265	Supalai Bliss	2	400.00	2025-04-17	จัดส่งสำเร็จ	2025-04-13	2	ชำระเงินแล้ว	30	manual	\N	\N	\N
178	Arng	00	grab	1	200.00	2025-04-23	จัดส่งสำเร็จ	2025-04-20	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
134	Line-Nozz	0637938222	Walk-in	2	400.00	2025-04-02	จัดส่งสำเร็จ	2025-03-29	2	ชำระเงินแล้ว	42	manual	\N	\N	\N
168	Nichapat	0966939996	Arise condo	1	260.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	36	manual	\N	\N	\N
169	Jaturon	00	grab	1	200.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
165	Duangjai	0882605677	Walk-in	1	200.00	2025-04-19	จัดส่งสำเร็จ	2025-04-17	2	ชำระเงินแล้ว	41	manual	\N	\N	\N
177	Line-Pote	00	Walk-in	2	400.00	2025-04-23	จัดส่งสำเร็จ	2025-04-20	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
176	Line-Rean	00	Walk-in	3	600.00	2025-04-23	จัดส่งสำเร็จ	2025-04-20	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
183	line-pu	00	Walk-in	11	2250.00	2025-04-25	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
170	Line-บอล ธนัท	0838381888	หอแพทย์14ชั้น	2	400.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	40	manual	\N	\N	\N
174	Paphichaya	0848087455	T-TEN หน้า มช	1	200.00	2025-04-22	จัดส่งสำเร็จ	2025-04-19	2	ชำระเงินแล้ว	25	manual	\N	\N	\N
173	Line-TONG	000	Walk-in	1	250.00	2025-04-21	จัดส่งสำเร็จ	2025-04-19	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
184	มินท์ทาวิน	0997936591	one+ nineteen2	1	260.00	2025-04-25	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	60	manual	\N	\N	\N
175	ลูกค้า	0806655465	grab	1	200.00	2025-04-22	จัดส่งสำเร็จ	2025-04-20	2	ชำระเงินแล้ว	58	manual	\N	\N	\N
190	Aod	0858642723	รร.ยาหยี	3	600.00	2025-04-30	จัดส่งสำเร็จ	2025-04-26	2	ชำระเงินแล้ว	48	manual	\N	\N	\N
163	P.A.	0889152461	Walk-in	6	1200.00	2025-04-20	จัดส่งสำเร็จ	2025-04-17	2	ชำระเงินแล้ว	1	manual	\N	\N	\N
167	IG-hundopnn	0805429598	คณะเทคนิคการแพทย์	2	400.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	57	manual	\N	\N	\N
171	line-N	00	Walk-in	1	200.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
179	D mons	0918594253	ขนมจีนนั่งยอง	4	900.00	2025-04-23	จัดส่งสำเร็จ	2025-04-20	2	ชำระเงินแล้ว	31	manual	\N	\N	\N
186	Aod	0858642723	รร.ยาหยี นิมมาน	2	400.00	2025-04-25	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	48	manual	\N	\N	\N
172	Line-ceePRInn	00	Walk-in	1	200.00	2025-04-21	จัดส่งสำเร็จ	2025-04-18	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
180	Pimnara	0826939963	ร้านสังฆทานสันติธรรม	4	800.00	2025-04-25	จัดส่งสำเร็จ	2025-04-21	2	ชำระเงินแล้ว	23	manual	\N	\N	\N
185	Allbig	0949944159	one+7ยอด3	3	750.00	2025-04-25	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	72	manual	\N	\N	\N
189	Nawarath	0899569037	ออมสิน	6	1200.00	2025-04-28	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	62	manual	\N	\N	\N
187	ลูกค้า	0861911439	Walk-in	3	950.00	2025-04-23	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	10	manual	\N	\N	\N
196	Aoey	0966596387	Astra sky river	2	400.00	2025-04-30	จัดส่งสำเร็จ	2025-04-27	2	ชำระเงินแล้ว	71	manual	\N	\N	\N
192	line-Mook Yada	0806624235	ปาล์มสปริง รอยัล นิมมาน	2	400.00	2025-04-28	จัดส่งสำเร็จ	2025-04-25	2	ชำระเงินแล้ว	64	manual	\N	\N	\N
198	Samon Manokad	0947410971	Escent Ville	4	900.00	2025-05-03	จัดส่งสำเร็จ	2025-04-29	2	ชำระเงินแล้ว	32	manual	\N	\N	\N
195	Momo jung	0818855317	ลัดดารมย์ พายัพ	8	2050.00	2025-04-30	จัดส่งสำเร็จ	2025-04-25	2	ชำระเงินแล้ว	39	manual	\N	\N	\N
329	She Aom	0954453297	Walk-in	1	200.00	2025-06-07	รับเข้า	2025-06-04	2	pending	183	manual	\N	\N	\N
197	Katy Kate	0904696499	ม.ศิริวัฒนา	4	900.00	2025-05-03	จัดส่งสำเร็จ	2025-04-28	2	ชำระเงินแล้ว	67	manual	\N	\N	\N
193	line-Jiratch Yok	0930945195	escent park ville	5	950.00	2025-04-30	จัดส่งสำเร็จ	2025-04-26	2	ชำระเงินแล้ว	70	manual	\N	\N	\N
203	Line-Pro Win	0990018482	Walk-in	1	300.00	2025-05-02	จัดส่งสำเร็จ	2025-05-01	2	ชำระเงินแล้ว	17	manual	\N	\N	\N
205	Rungtip	000	Walk-in	1	200.00	2025-05-04	จัดส่งสำเร็จ	2025-05-01	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
188	line-! Aonann	0610182199	โลตัสคำเที่ยง	23	3280.00	2025-04-28	จัดส่งสำเร็จ	2025-04-23	2	ชำระเงินแล้ว	59	manual	\N	\N	\N
199	คนจีน	000	Walk-in	1	600.00	2025-05-01	จัดส่งสำเร็จ	2025-05-28	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
204	Phurin	0970217360	บ้านเชียงล้าน	2	400.00	2025-05-05	จัดส่งสำเร็จ	2025-05-01	2	ชำระเงินแล้ว	15	manual	\N	\N	\N
202	Line-Noina	0653592490	my hip condo1	2	350.00	2025-05-04	จัดส่งสำเร็จ	2025-05-01	2	ชำระเงินแล้ว	37	manual	\N	\N	\N
207	Pattarakarn	0612744747	หมู่บ้านนักกีฬา700ปี	3	600.00	2025-05-07	จัดส่งสำเร็จ	2025-05-03	2	ชำระเงินแล้ว	63	manual	\N	\N	\N
201	Nattapatch	0917919351	หอพรีเซียส ฟ้าฮ่าม	2	400.00	2025-05-04	จัดส่งสำเร็จ	2025-05-30	2	ชำระเงินแล้ว	46	manual	\N	\N	\N
210	Phichsinee Meister	0874249424	วิลลาจจิโอ สันทราย	4	920.00	2025-05-08	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	34	manual	\N	\N	\N
194	line-Pote	000	Walk-in	2	400.00	2025-04-30	จัดส่งสำเร็จ	2025-04-27	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
191	Baitongjme	000	Walk-in	1	200.00	2025-04-28	จัดส่งสำเร็จ	2025-04-26	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
212	Sirinnicha Surijun	000	Walk-in	2	400.00	2025-05-06	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
208	Noptha JJ	000	d condi sign ตึก C	2	400.00	2025-05-07	จัดส่งสำเร็จ	2025-05-03	2	ชำระเงินแล้ว	9	manual	\N	\N	\N
213	Prakairak Tree	0933137818	Escent park ville	5	1150.00	2025-05-07	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	51	manual	\N	\N	\N
211	Oatt Patthara	0882539027	ร้านตือคาโค สันติธรรม	2	400.00	2025-05-07	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	12	manual	\N	\N	\N
221	สายป่าน เจ้าชาย	0962682922	grab	1	400.00	2025-05-06	จัดส่งสำเร็จ	2025-05-05	2	ชำระเงินแล้ว	44	manual	\N	\N	\N
209	Milin Viriya	0835198923	กระเพราเนื้อๆช้างม่อย	3	650.00	2025-05-07	จัดส่งสำเร็จ	2025-05-03	2	ชำระเงินแล้ว	38	manual	\N	\N	\N
215	Line-Pink	0622976111	อุษาฟ้าฮ่าม	2	400.00	2025-05-07	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	73	manual	\N	\N	\N
289	Wechat-啊啊啊	0000000010	The Treasure Condo By My Hip, อาคาร C	3	900.00	2025-05-26	จัดส่งสำเร็จ	2025-05-25	2	ชำระเงินแล้ว	143	manual	\N	\N	\N
258	Line-JUTHANARIN	0974419949	Walk-in	2	420.00	2025-05-19	จัดส่งสำเร็จ	2025-05-16	2	ชำระเงินแล้ว	112	manual	\N	\N	\N
245	คมสัน ซางสุภาพ	0831542868	พีพีคอนโด	11	2650.00	2025-05-17	จัดส่งสำเร็จ	2025-05-13	2	ชำระเงินแล้ว	97	manual	\N	\N	\N
239	Line-MinT-ii*	0829619153	monotown3สันผีเสื้อ	3	950.00	2025-05-13	จัดส่งสำเร็จ	2025-05-10	2	ชำระเงินแล้ว	90	manual	\N	\N	\N
182	น้องอิง	00	Walk-in	3	600.00	2025-05-05	จัดส่งสำเร็จ	2025-04-22	2	ชำระเงินแล้ว	2	manual	\N	\N	\N
273	Wechat-Arthur	0956786658	158/28 The Legend Koolpunville หางดง	2	900.00	2025-05-24	จัดส่งสำเร็จ	2025-05-21	2	ชำระเงินแล้ว	125	manual	\N	\N	\N
222	ไอ ชามา	0826363565	หมู่บ้านกาญกนกจน์20	4	1050.00	2025-05-10	จัดส่งสำเร็จ	2025-05-07	2	ชำระเงินแล้ว	13	manual	\N	\N	\N
263	Sombut Sutana	0000000001	Walk-in	1	350.00	2025-05-20	จัดส่งสำเร็จ	2025-05-17	2	ชำระเงินแล้ว	117	manual	\N	\N	\N
250	Chayanun Kpp	0896355425	บ้านส้ม หลังวัดเมืองสาตรน้อย	3	750.00	2025-05-17	จัดส่งสำเร็จ	2025-05-14	2	ชำระเงินแล้ว	102	manual	\N	\N	\N
288	Line-pw	0000000008	Walk-in	2	500.00	2025-05-26	จัดส่งสำเร็จ	2025-05-23	2	ชำระเงินแล้ว	142	manual	\N	\N	\N
268	Line-Namtan	0895522822	star hill คอนโด	1	270.00	2025-05-22	จัดส่งสำเร็จ	2025-05-19	2	ชำระเงินแล้ว	121	manual	\N	\N	\N
293	Line-Tar Gonlatat	0981019542	Walk-in	1	200.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	150	manual	\N	\N	\N
283	Thitikon Panchaiya	0948569225	ส่งกลับ ปณ	1	150.00	2025-05-26	จัดส่งสำเร็จ	2025-05-24	2	ชำระเงินแล้ว	136	manual	\N	\N	\N
294	Line-Apiradee	0897006206	Walk-in	1	250.00	2025-05-29	จัดส่งสำเร็จ	2025-05-26	2	ชำระเงินแล้ว	152	manual	\N	\N	\N
314	Naritsara Wareepan	0988909370	89พลาซ่า	3	0.00	2025-06-07	รับเข้า	2025-05-31	2	pending	170	manual	\N	\N	\N
303	Wasana Prasit	0892662499	บ้านเลขที่60ซอย3 แถวโกลเด้นทาวน์	4	1000.00	2025-05-30	จัดส่งสำเร็จ	2025-05-27	2	ชำระเงินแล้ว	126	manual	\N	\N	\N
214	Line-VIEWVIEW	0840431871	Walk-in	2	600.00	2025-05-06	จัดส่งสำเร็จ	2025-05-04	2	ชำระเงินแล้ว	5	manual	\N	\N	\N
306	ลูกค้า	0960121068	ธนาคารจีน หลัง big c extra	2	400.00	2025-06-04	อยู่ระหว่างทำความสะอาด	2025-05-29	2	pending	161	manual	\N	\N	\N
321	Sitthi Kan	0992944521	บ้านพัก อบจ.3	1	0.00	2025-06-06	รับเข้า	2025-05-28	2	pending	158	manual	\N	\N	\N
325	Line-Wuthipong56	0000000015	Walk-in	1	250.00	2025-06-03	จัดส่งสำเร็จ	2025-05-31	2	ชำระเงินแล้ว	178	manual	\N	\N	\N
330	Line-Naomi_Nanny 965	0946405419	ข้าวหอมอพาร์ทเม้นนท์ ป่าตัน ซ7	2	0.00	2025-06-07	รับเข้า	2025-06-04	2	pending	171	manual	\N	\N	\N
\.


--
-- Data for Name: queue_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queue_items (id, queue_id, service_id, price_per_pair, brand, model, color, notes, image_front, image_back, image_left, image_right, image_top, image_bottom, image_before_front, image_before_back, image_before_left, image_before_right, image_before_top, image_before_bottom, image_after_front, image_after_back, image_after_left, image_after_right, image_after_top, image_after_bottom) FROM stdin;
220	99	7	200.00	converse	converse	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
222	83	14	100.00	nike	nike	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
160	75	7	200.00	Oncloud	Oncloud	ฟ้า		\N	\N	\N	\N	\N	\N	/uploads/1743082977916_486534262_9447000762079404_4331920926823168776_n.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
164	74	17	300.00	NewBalance	530	สีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
166	74	7	200.00	Nike	Nike	สีขาว	รองเท้าวิ่ง	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	74	7	200.00	Adidas	Adios	สีขาว	ไซส์ใหญ่	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
170	76	11	300.00	Dior	B27 Uptown Low-Top	สีเทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
172	77	29	200.00	New Balance	New Balance kid	สีครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
174	77	10	300.00	New Balance	Winter Boots	สีครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
176	77	10	300.00	Moon Boot	Moon Boot	สีเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
224	90	7	200.00	newbalance	newbalance	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
186	88	17	300.00	Hoka	Hoka	สีเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
188	88	17	300.00	NoBrand	ผ้าใบ	สีดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
190	88	17	300.00	Pull&Baer	Pull&Baer หนังเรียบ	\tสีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
192	80	7	200.00	Oni	oni	ครีมเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
194	81	7	200.00	ON	ON	ขาวเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
198	79	7	200.00	converse	เส้นขอบดำ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
200	79	7	200.00	converse	หนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
202	78	7	200.00	adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
204	82	7	200.00	salomon	salomon	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
206	84	7	200.00	vija	vija	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
208	83	7	200.00	Nike	Nike	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
210	93	7	200.00	ON	ON	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212	94	8	250.00	puma	puma	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
214	86	7	200.00	adidas	adidas	ขาว-ลายดำข้าง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
218	99	7	200.00	Hoka	Hoka	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
226	90	7	200.00	NY	NY	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
228	95	7	200.00	Vans	Vans	ครีม-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
230	95	7	200.00	Birken	Birken	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
232	98	7	200.00	Birken	Birken ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
234	98	7	200.00	Newbalance	Newbalance	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
236	131	11	300.00	NY	NY	ขาว-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
238	134	7	200.00	Adidas	Adidas	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
240	132	8	250.00	Newbalance	Newbalance	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
242	135	7	200.00	Newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
244	136	7	200.00	Reebox	Reebox	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
246	136	7	200.00	Nike	Nike	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
248	137	7	200.00	ON	ON	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
250	138	11	300.00	Fila	Fila	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
252	139	7	200.00	Adidas	Adidas	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
254	141	8	250.00	Puma	Puma	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
256	148	7	200.00	ON	ON	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
258	142	7	200.00	ON	ON	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
260	146	7	200.00	ON	ON	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
262	150	7	200.00	Skecher	Skecher	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
264	143	7	200.00	ON	ON	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
266	154	17	300.00	Nike	AF	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
268	149	7	200.00	Asic	ผ้าใบ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
270	149	7	200.00	Lacoste	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
272	145	7	200.00	Nike	ผ้าใบ	ขาว-ลายแดงกรม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
274	145	7	200.00	Adidas	โฟม	ขาว คาดส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
276	144	7	200.00	Vans	ผ้าใบ 	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
278	144	7	200.00	Nike	ผ้าใบตาข่าย	เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
282	151	11	300.00	Balong	หุ้มข้อ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
284	151	7	200.00	Adidas	Yeezy	ส้มเหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
286	147	7	200.00	์Newbalance	ผ้าใบเด็ก	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
288	153	7	200.00	Nike	panda	ขาวดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
290	153	7	200.00	Nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
292	153	7	200.00	ON	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
294	152	8	250.00	Puma	Ortholite	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
296	152	8	250.00	Converse	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
298	157	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
300	158	7	200.00	ืNewbalance	530	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
302	156	7	200.00	Newbalance	530	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
304	156	7	200.00	Playboy	แตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
306	160	7	200.00	nike	nike	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
307	160	7	200.00	nike	nike	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
308	160	7	200.00	Columbia	ผ้าใบ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
309	160	7	200.00	lululemon	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
310	161	9	250.00	timberland	หนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
311	162	7	200.00	adidas	ผ้าใบ	เทา-ดำ-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
229	95	7	200.00	Vans	Vans	ครีม-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	74	7	200.00	Nike	Nike	สีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
167	74	7	200.00	Adidas	Adios	สีขาว	ไซส์เล็ก	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
169	76	11	300.00	Dior 	Slip On	สีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	77	29	200.00	New Balance	New Balance Kid	สีชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
173	77	10	300.00	New Balance	Winter Boots	สีครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
175	77	10	300.00	Moon Boot	Moon Boot	สีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
185	88	17	300.00	Vans	Vans	สีดำคาดขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
187	88	17	300.00	Chuniverse	Chuniverse หนังเรียบ	สีขาว\t		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
189	88	18	350.00	ZARA 	ZARA หนังกลับ	สีครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
191	75	30	250.00	Converse	หุ้มข้อ	สีขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
193	81	7	200.00	vans	vans	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
195	81	7	200.00	skechers	skechers	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
197	79	7	200.00	converse	หัวใจ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
199	79	8	250.00	converse	หนังกลับ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
201	78	7	200.00	adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
203	91	7	200.00	skechers	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
205	82	7	200.00	mizuno	mizuno	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
207	84	7	200.00	salomon	salomon	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
209	83	7	200.00	Nike	Nike	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
211	85	7	200.00	Saucony	Saucony	ขาว-ฟ้า-ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
213	86	7	200.00	on	on	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
215	100	7	200.00	-	-	-		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
216	100	7	200.00	-	-	-	-	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
217	100	7	200.00	-	-	-		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
219	99	7	200.00	Hoka	Hoka	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
221	99	7	200.00	asic	asic	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
223	83	14	100.00	nike	nike	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
225	90	7	200.00	keen	keen	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
227	90	7	200.00	Fila	Fila	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
231	95	7	200.00	Birken	Birken	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
233	98	8	250.00	Birken	Birken	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
237	131	11	300.00	Newbalance	Newbalance	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
239	134	7	200.00	Nike	Nike	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
241	132	7	200.00	Adidas	Adidas	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
243	133	7	200.00	nike	nike	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
245	136	7	200.00	Newbalance	Newbalance	เงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
247	136	7	200.00	Newbalance	Newbalance	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
249	137	7	200.00	Nike	Nike	ดำ-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
251	138	11	300.00	Popmart	Popmart	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
253	140	7	200.00	nike	nike	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
255	148	7	200.00	Newbalance	Newbalance	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
257	142	7	200.00	ecco	ecco	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
259	146	7	200.00	Newbalance 	Newbalance 	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
261	146	31	150.00	ืnike	ืnike	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
263	150	7	200.00	Newbalance	Newbalance	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
265	143	7	200.00	Newbalance	530	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
267	149	7	200.00	Nike	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
269	149	7	200.00	Asic	ผ้าใบ	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
271	145	7	200.00	Newbalance	530	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
273	145	7	200.00	Nike	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
275	145	7	200.00	Adidas	โฟม	ขาว ปลั้กทอง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
277	144	7	200.00	์The North face	ผ้าใบเดินป่า	ขาวชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
281	151	8	250.00	NB	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
283	151	7	200.00	Adidas	Yeezy	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
285	151	11	300.00	DKK Show	ผ้าใบแคนวาส	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
287	147	7	200.00	Skechers	ผ้าใบเด็ก	หุ้มข้อดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
289	153	7	200.00	Newbalance	530	ขาวเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
291	153	7	200.00	Nike	panda	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
293	153	7	200.00	Adidas	zamba	ขาวดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
295	152	8	250.00	Puma	ผ้าใบ	ดำ-ลายเทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
297	155	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
299	159	7	200.00	Adidas	ผ้าใบ	ขาว-ขีดแดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
301	158	7	200.00	Newbalance	ผ้าใบ	ลายเทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
303	156	7	200.00	Converse	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
305	156	7	200.00	Charles&Keith	แตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
312	162	7	200.00	adidas	yeezy	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
313	164	7	200.00	ON	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
314	164	7	200.00	ON	ผ้าใบ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
317	165	7	200.00	ืNewbalance	ผ้าใบ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
318	166	7	200.00	์Newbalance	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
319	166	7	200.00	NIKE	หนัง	เทา-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
320	163	7	200.00	Nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
321	163	7	200.00	ON	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
322	163	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
323	163	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
324	163	7	200.00	ON	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
325	163	7	200.00	Adidas	หนัง	ขาว-ลายดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
326	164	32	150.00	Crocs	แตะ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
327	164	33	100.00	Crocs	แตะ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
328	168	7	200.00	karenji	รองเท้าวิ่ง	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
329	167	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
330	167	7	200.00	skechers	ผ้าใบ	ขาว-ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
331	169	7	200.00	safety jogger	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
332	172	7	200.00	VANS	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
333	170	7	200.00	ASIC	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
334	170	7	200.00	adidas	ultraboost	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
335	171	7	200.00	BAOJI	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
336	173	8	250.00	Newbalance	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
338	174	7	200.00	ืNewbalance	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
339	175	7	200.00	camper	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
340	177	7	200.00	Newbalance	พื้นชมพูเหลือง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
341	177	7	200.00	FILA	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
342	176	7	200.00	NIKE	ผ้าใบ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
343	176	7	200.00	NIKE	ผ้าใบ	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
344	176	7	200.00	Lacoste	ผ้าใบหนัง	ขาว-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
345	178	7	200.00	skechers	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
346	179	7	200.00	skechers	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
347	179	7	200.00	ืnike	ผ้า่ใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
348	179	8	250.00	nike	หนังกลับ	น้ำตาล-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
349	179	8	250.00	nike	หนังกลับ	ขาว-ดำ-เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
354	180	7	200.00	Nike	ผ้าใบ	ขาว-เงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
355	180	7	200.00	NB	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
356	180	7	200.00	NY	หนัง	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
357	180	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
358	184	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
359	187	32	150.00	NB	แตะ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
360	187	30	250.00	converse	หุ้มข้อ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
361	187	30	250.00	converse	หุ้มข้อ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
362	181	8	250.00	tory	หนังกลับ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
363	181	7	200.00	nike	ผ้าใบ	ขาว-ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
364	181	7	200.00	cc	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
365	185	30	250.00	nike	หุ้มข้อ	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
366	185	7	200.00	ืีnike	panda	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
367	185	10	300.00	timberland	บูท	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
368	183	7	200.00	skechers	ผ้าใบ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
369	183	7	200.00	reebok	ผ้าใบ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
370	183	7	200.00	Quechua	ผ้าใบหนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
371	183	7	200.00	Adidas	ผ้าใบ	เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
372	183	8	250.00	nike	ผ้าใบผสมหนังกลับ	เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
373	183	7	200.00	Adidas	yeezy	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
374	183	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
375	183	7	200.00	newbalance	ผ้าใบ	ดำ-ส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
376	183	7	200.00	skechers	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
378	183	7	200.00	on	ผ้าใบ	เทาฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
379	183	7	200.00	on	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
380	186	7	200.00	Adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
381	186	7	200.00	Newbalance	ผ้าใบหนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
382	189	7	200.00	NIKE	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
383	189	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
384	189	7	200.00	NY	ผ้าใบหุ้มข้อ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
385	189	7	200.00	vans	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
386	189	7	200.00	newbalance	ผ้าใบ	ขาว-น้ำเงิน-เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
387	189	7	200.00	NY	ผ้าใบ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
388	191	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
389	192	7	200.00	HOKA	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
390	192	7	200.00	nike	725	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
391	188	35	120.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
392	188	35	120.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
393	188	35	120.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
394	188	34	90.00	รองเท้าแตะ	รองเท้าแตะหมา	เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
395	188	34	90.00	รองเท้าแตะ	รองเท้าบูท	เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
396	188	34	90.00	รองเท้าแตะ	รองเท้าแตะ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
397	188	34	90.00	รองเท้าแตะ	รองเท้าแตะ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
398	188	35	120.00	รองเท้าผ้าใบ	สไปเดอร์แมน	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
399	188	35	120.00	รองเท้าผ้าใบ	รองเท้าผ้าใบ	ขาว-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
400	188	35	120.00	ืnb	รองเท้าผ้าใบ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
401	188	32	150.00	halo pola	รองเท้าแตะ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
402	188	32	150.00	รองเท้าแตะ	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
403	188	32	150.00	รองเท้าแตะ	รองเท้าแตะ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
404	188	32	150.00	gentle woman	รองเท้าแตะ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
405	188	7	200.00	vans	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
406	188	7	200.00	nike	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
407	188	32	150.00	jaspal	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
408	188	32	150.00	dior	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
409	188	32	150.00	crocs	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
410	188	7	200.00	คัทชู	คัทชู	ดำ-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
411	188	32	150.00	รองเท้าแตะ	รองเท้าแตะ	แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
412	188	7	200.00	onisuka	tiger	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
413	188	7	200.00	onisuka	tiger	ขาว-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
414	195	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
415	195	7	200.00	on	ผ้าใบ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
416	195	11	300.00	gucci	รองเท้าแตะ	น้ำตาล-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
417	195	11	300.00	gucci	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
418	195	11	300.00	gucci	รองเท้าหนัง	ขาว-ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
419	195	11	300.00	gucci	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
420	195	7	200.00	newbalance	530	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
422	190	7	200.00	nike	ผ้าใบ	ขาวส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
423	190	7	200.00	asic	ผ้าใบ	น้ำตาลดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
424	190	7	200.00	newbalance	2002R	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
425	193	7	200.00	nike	AF	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
426	193	7	200.00	NB	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
427	193	7	200.00	vans	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
428	193	7	200.00	keen	แตะ	น้ำเงินเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
429	193	32	150.00	chaco	แตะ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
430	195	8	250.00	adidas	หนังกลับ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
431	199	11	300.00	NIKE	หุ้มข้อ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
432	194	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
433	194	7	200.00	adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
434	196	7	200.00	nike	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
435	196	7	200.00	altra	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
436	198	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
437	198	7	200.00	nike	หนัง	ดำ-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
438	198	7	200.00	birken	รองเท้าแตะ	ขาวมุก		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
439	198	11	300.00	dior	แตะ	กรม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
440	203	17	300.00	adidas	superstar	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
441	201	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
442	201	7	200.00	nike	ผ้าใบ	ดำ-ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
445	197	9	250.00	sperry	รองเท้าหนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
446	197	7	200.00	givi	หนัง	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
447	204	7	200.00	vans	ผ้าใบ	ครีม-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
448	204	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
449	205	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
450	202	32	150.00	fitflop	แตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
451	202	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
452	200	7	200.00	newbalance	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
453	200	7	200.00	On	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
454	197	7	200.00	nike	jordan	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
455	197	8	250.00	BlocB	หนังแกะ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
456	206	17	300.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
457	208	7	200.00	keen	ผ้าใบเชือก	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
458	208	7	200.00	keds	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
459	212	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
460	212	7	200.00	adidas	samba	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
461	214	10	300.00	the world under my feet	รองเท้าหนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
462	214	10	300.00	hawkins	บูทหนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
464	209	7	200.00	vans	ผ้าใบ cdg	ขาว-ตัวหนังสือดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
465	209	7	200.00	vans	ผ้าใบผูกเชือก	ขาว-ตัวหนังสือดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
466	216	7	200.00	nike	panda	ดำ-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
468	216	7	200.00	adidas	ผ้าใบ	หลายสี		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
471	207	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
472	207	7	200.00	newbalance	ผ้าใบผสมหนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
473	207	7	200.00	shoes like	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
474	219	7	200.00	adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
475	215	7	200.00	newbalance	530	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
476	215	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
477	182	7	200.00	adidas	samba	ครีม-น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
478	182	7	200.00	puma	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
479	182	7	200.00	adidas	ผ้าใบ	ขาว-แสด		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
480	211	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
481	211	7	200.00	under armour	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
482	221	17	300.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
483	209	9	250.00	carhartt (รองเท้าญี่ปุ่น)	subu	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
484	213	11	300.00	dior	รองเท้าแจะ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
485	213	7	200.00	newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
486	213	7	200.00	nike	รองเท้าหนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
487	213	7	200.00	Jeep	รองเท้าหนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
488	213	8	250.00	adidas	รองเท้าหนังกลับ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
489	210	7	200.00	skechers	รองเท้าผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
490	210	7	200.00	TEVA	รองเท้ารัดส้น	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
491	210	7	200.00	FILA	รองเท้าผ้าใบ	ขาว-เทา-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
492	210	7	200.00	keen	รองเท้าเชือก	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
493	225	7	200.00	converse	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
494	217	7	200.00	keen	รองเท้าเชือก	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
495	217	7	200.00	newbalance	530	ขาว-ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
496	217	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
497	217	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
498	229	7	200.00	converse	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
499	220	30	250.00	converse	ผ้าใบหุ้มข้อ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
500	220	7	200.00	puma	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
501	220	7	200.00	nike	รองเท้าหนัง	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
502	223	8	250.00	keen	รองเท้าแตะหนังกลับ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
503	223	7	200.00	on	ผ้าใบ	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
504	223	7	200.00	keen	รองเท้าเชือก	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
505	227	7	200.00	adidas	samba	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
506	227	7	200.00	asic	รองเท้าผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
507	227	7	200.00	Hoka	รองเท้าผ้าใบ	ส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
508	222	10	300.00	dior	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
509	222	11	300.00	dior	รองเท้าผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
510	222	7	200.00	adidas	samba	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
511	222	8	250.00	adidas	รองเท้าหนังกลับ	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
512	224	7	200.00	nike	รองเท้าผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
513	224	7	200.00	on	รองเท้าผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
514	228	7	200.00	asic	ผ้าใบ 	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
515	228	7	200.00	asic	ผ้าใบ	ขาว ลายน้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
516	228	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
517	228	7	200.00	nuke	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
518	236	7	200.00	on	ผ้าใบ	ขาว-ส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
519	240	8	250.00	birken	รองเท้าหนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
520	231	7	200.00	salomon	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
521	231	8	250.00	puma	รองเท้าหนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
522	231	7	200.00	salomon	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
523	231	7	200.00	nike	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
524	231	7	200.00	HANN	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
525	231	7	200.00	Chuu chop	คัทชูลูกไม้	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
526	226	7	200.00	NB	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
527	226	11	300.00	Dior	B23 Low	ขาว ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
528	226	7	200.00	Nike	Airforce	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
529	230	7	200.00	adidas	superstar	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
530	230	7	200.00	adidas	boost	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
531	230	32	150.00	crocs	รองเท้าหัวโต	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
532	238	7	200.00	skecher	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
533	238	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
534	238	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
535	238	7	200.00	รองเท้าจีน	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
536	238	7	200.00	รองเท้าจีน	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
537	238	7	200.00	รองเท้าจีน	ผ้าใบ	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
538	238	7	200.00	รองเท้าจีน	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
539	238	7	200.00	excellent	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
540	239	7	200.00	keen	รองเท้าเชือก	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
541	239	7	200.00	newbalance	ผ้าใบ	เงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
542	239	8	250.00	nembalance	หนังกลับ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
545	242	7	200.00	nike	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
546	242	7	200.00	nike	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
547	237	7	200.00	lacoste	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
548	237	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
549	237	8	250.00	newbalance	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
550	237	8	250.00	newbalance	หนังกลับ	เทาอ่อน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
551	241	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
552	241	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
553	251	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
554	251	8	250.00	newbalance	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
555	246	7	200.00	lacoste	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
556	246	7	200.00	kim&co	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
557	246	8	250.00	newbalance	หนังกลับ	เทา-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
558	244	7	200.00	on	ผ้าใบ	ขาว ขอบเทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
559	244	7	200.00	cc double o	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
560	244	7	200.00	newbalance	ผ้าใบผสมหนังกลับ	ขาว เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
561	252	7	200.00	NY	ผ้าใบ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
562	252	7	200.00	adidas	boost	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
563	247	36	350.00	Adidas	Stand smith	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
564	245	30	250.00	converse	ผ้าใบหุ้มข้อ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
565	243	7	200.00	newbalance	ผ้าใบ	ขาว-เงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
566	243	7	200.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
567	243	8	250.00	newbalance	ผ้าใบผสมหนังกลับ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
568	243	7	200.00	newbalance	ผ้าใบ	ขาว-เงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
569	243	7	200.00	newbalance	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
570	245	30	250.00	converse	ผ้าใบหุ้มข้อ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
571	245	11	300.00	balenciaga	ผ้าใบ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
572	245	11	300.00	balenciaga	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
573	245	7	200.00	NY	รองเท้าหนัง	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
574	245	7	200.00	yeezy	ผ้าใบ	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
575	245	7	200.00	vanz	ผ้าใบผสมหนัง	ขาว-แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
576	245	7	200.00	NY	รองเท้าหนัง	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
577	245	7	200.00	NY	รองเท้าหนัง	ขาว-ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
578	245	7	200.00	nike	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
579	245	7	200.00	nike	ผ้าใบ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
580	258	35	120.00	NIKE	ผ้าใบ	ขาว-เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
581	258	11	300.00	on	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
583	250	7	200.00	adidas	boost	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
584	250	7	200.00	nike	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
585	250	36	350.00	Nike	Panda	ดำขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
586	249	7	200.00	Adidas	รองเท้าวิ่ง	ขาวคาดดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
588	249	7	200.00	Converse	ผ้าใบผสมหนังกลับ	ครีม น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
589	256	7	200.00	รองเท้าหนัง	หนัง	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
590	256	7	200.00	adidas	ผ้าใบ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
591	248	7	200.00	hoka	ผ้าใบ	ชมพูส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
592	248	7	200.00	keen	รองเท้าเชือก	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
593	248	7	200.00	birken	รองเท้าแตะ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
594	248	7	200.00	adidas	boost	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
595	248	8	250.00	adidas	หนังกลับ	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
596	248	7	200.00	nike	ผ้าใบ	ครีมขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
597	248	7	200.00	hoka	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
598	248	7	200.00	adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
600	264	8	250.00	onisuka	หนังกลับ	น้ำเงิน-น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
602	255	7	200.00	adidas	boost	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
605	267	7	200.00	adidas	หนัง	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
606	267	7	200.00	nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
607	257	7	200.00	hoka	ผ้าใบ	ขาว-ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
608	257	7	200.00	hoka	ผ้าใบ	ขาว-เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
609	257	7	200.00	hoka	ผ้าใบ	ขาว-กรม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
610	257	7	200.00	hoka	ผ้าใบ	ม่วงอ่อน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
621	263	36	350.00	nike	af	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
622	255	8	250.00	newbalance	ผ้าใบผสมหนังกลับ	ขาว-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
623	262	8	250.00	ecco	หนังกลับ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
624	262	9	250.00	Hush Puples	หนัง	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
652	270	8	250.00	water the plant	หนัง คาดหนังกลับ	ขาว-คาดดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
625	265	11	300.00	chanel	ผ้าใบ	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
626	265	11	300.00	adidas	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
627	269	7	200.00	salomon	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
630	261	7	200.00	adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
631	261	7	200.00	keds	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
633	268	7	200.00	nike	ผ้าใบ	ขาว-ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
636	266	37	300.00	onisuka	ผ้าใบ	ขาว คาดขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
637	266	37	300.00	onisuka	ผ้าใบ	ขาว คาดทอง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
638	266	37	300.00	hoka	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
639	266	37	300.00	on	ผ้าใบ	ขาว -เหลือง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
640	266	37	300.00	adidas	ผ้าใบ	ส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
641	266	38	450.00	adidas	ultraboost	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
642	261	7	200.00	newbalance	ผ้าใบ	ฟ้าเขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
643	261	7	200.00	skechers	ผ้าใบ	ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
644	261	7	200.00	skechers	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
645	273	11	300.00	dior	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
646	273	11	300.00	newbalance	ผ้าใบผสมหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
647	271	10	300.00	hein gericke	บูทหนัง	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
648	271	10	300.00	Fuiygan	บูทหนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
649	270	8	250.00	adidas	หนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
650	270	8	250.00	adidas	หนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
651	270	7	200.00	water the plant	ผ้าใบคาดหนัง	ดำ-หนังขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
653	281	7	200.00	Puma	หนังกลับ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
654	281	7	200.00	Clarks	หนังกลับพื้นแยม	เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
656	282	17	300.00	puma\t	หนังผสมหนังกลับ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
659	275	7	200.00	On Clound	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
660	275	7	200.00	Birken Stock	สายหนังคาด	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
661	275	7	200.00	Birken Stock	สายหนังคาด	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
662	276	7	200.00	Brooks	ผ้าใบ	ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
663	272	7	200.00	รองเท้าแฟชั่น	ผ้าถัก	ครีม ม่วงฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
664	272	7	200.00	Nike	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
665	272	7	200.00	Asic	ผ้าใบ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
671	283	12	150.00	Nike	Air	ขาว ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
672	274	7	200.00	converse	รองเท้าหนัง	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
673	274	7	200.00	Newbalance	ผ้าใบผสมหนังกลับ	ขาว-ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
674	274	7	200.00	Newbalance	ผ้าใบผสมหนังกลับ	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
675	274	10	300.00	รองเท้าบูท	หนังกลับ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
676	287	7	200.00	adidas	samba	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
677	287	7	200.00	converse	ผ้าใบหุ้มข้อ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
678	289	17	300.00	Nike	Nike Air	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
679	289	17	300.00	Nike	panda	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
680	289	17	300.00	ECCO	รองเท้าหนัง	ลายฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
681	290	7	200.00	vans	ผ้าใบ	ลายดำ-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
682	291	7	200.00	Adidas	Samba	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
683	288	7	200.00	birkenstock	คาดหนัง2สาย	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
684	288	39	300.00	UGG	หนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
685	277	7	200.00	SHITA	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
686	277	8	250.00	Newbalance	ผ้าใบผสมหนังกลับ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
687	285	11	300.00	GUUCI	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
688	285	7	200.00	Nike	ผ้าใบผสมหนัง	ฟ้า		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
689	280	7	200.00	HOVR	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
690	280	7	200.00	Nike	ผ้าใบ	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
691	280	7	200.00	Nike	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
692	280	7	200.00	Nike	ผ้าใบผสมหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
693	294	8	250.00	Newbalance	รองเท้าหนังกลับ 530	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
694	279	40	100.00	birkenstock	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
695	279	40	100.00	birkenstock	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
696	279	40	100.00	Adidas	รองเท้าแตะ	ครีม-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
697	279	7	200.00	Nike	รองเท้าผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
698	279	7	200.00	converse	ผ้าใบหุ้มข้อ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
699	279	10	300.00	DELTA	บูทหนังกลับ	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
700	300	17	300.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
701	293	7	200.00	SALOMON	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
702	286	7	200.00	Adidas	samba	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
703	286	7	200.00	Adidas	samba	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
706	286	7	200.00	Lacoste	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
707	286	7	200.00	Newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
708	286	7	200.00	Newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
709	302	7	200.00	VANS	ผ้าใบผสมหนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
710	295	7	200.00	Adidas	ADIZERO BOSTON12	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
711	295	7	200.00	Adidas	รองเท้าผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
712	295	7	200.00	Birkenstock	รองเท้าหนัง	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
713	304	17	300.00	asic	รองเท้าผ้าใบบาส	ขาว-คาดส้ม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
714	286	36	350.00	Nike	รองเท้าหนัง	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
715	286	36	350.00	Nike	รองเท้าหนัง	ฟ้า-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
716	301	7	200.00	ASIC	GEL	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
717	296	7	200.00	ON	Running	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
718	296	7	200.00	ON	ผ้าใบ	ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
719	296	7	200.00	ON	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
720	284	7	200.00	Newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
721	284	7	200.00	Newbalance	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
722	297	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
723	297	11	300.00	Dior	คัทชู	น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
724	297	11	300.00	Dior	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
725	299	35	120.00	VANS	ผ้าใบตาราง	ดำ-แดง-น้ำเงิน		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
726	299	7	200.00	VANS	ผ้าใบ	แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
727	299	7	200.00	VANS	ผ้าใบตาราง	ดำ-ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
728	298	7	200.00	Adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
729	298	7	200.00	Asic	ผ้าใบ	ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
730	309	11	300.00	GUUCI	ผ้าใบ	ขาว คาดเขียวแดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
731	292	7	200.00	HOKA	ผ้าใบ	ขาว-ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
732	292	7	200.00	HOKA	ผ้าใบ	ชมพู		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
733	292	7	200.00	Adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
734	292	7	200.00	Keen	ผ้าใบ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
735	292	7	200.00	Columbia	ผ้าใบ	ม่วง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
736	292	7	200.00	Adidas	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
737	311	7	200.00	ON	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
738	311	7	200.00	allbirdy	ผ้าใบ	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
739	311	7	200.00	allbirdy	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
740	311	35	120.00	ASIC	ผ้าใบ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
742	303	7	200.00	Adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
743	303	8	250.00	Adidas	หนังกลับ	แดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
744	303	7	200.00	NIKE	หนังผสมหนนังกลับ	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
745	303	36	350.00	์Nike	หนัง	ขาวแดง		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
746	318	17	300.00	ON	cloud	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
747	307	7	200.00	Vans	ผ้าใบ slip on	ดำ ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
748	308	7	200.00	Nike	ผ้าใบ001	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
749	312	36	350.00	Nike	Airforce	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
750	312	7	200.00	Nike	Panda	ดำขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
751	312	7	200.00	์NewBalance	350	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
752	322	17	300.00	Onclound	ผ้าใบ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
753	324	7	200.00	LA	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
754	324	11	300.00	Balenciaga	ผ้าใบตะข่าย	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
755	325	9	250.00	TODS	รองเท้าหนัง	น้ำตาล		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
756	310	8	250.00	Newbalance	หนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
757	310	7	200.00	Adidas	ผ้าใบ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
758	313	7	200.00	NIKE	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
759	313	7	200.00	NIKE	รองเท้าหนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
760	326	7	200.00	Adidas	samba	ขาว-ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
761	326	8	250.00	Newbalance	หนังกลับ	ดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
762	315	7	200.00	Newbalance	530	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
763	315	8	250.00	PUMA	หนังกลับ	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
764	315	8	250.00	Adidas	samba	เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
765	315	8	250.00	Newbalance	ABZORB	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
766	315	7	200.00	CROCS	รองเท้าแตะ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
767	327	7	200.00	Reebok	ผ้าใบ	ขาว-เขียว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
768	316	7	200.00	NIKE	ผ้าใบผสมหนังกลับ	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
769	316	7	200.00	NIKE	ผ้าใบคาดหนัง	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
770	316	7	200.00	Newbalance	ผ้าใบคาดหนัง	ขาว-เทา		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
771	305	7	200.00	NewBalance	ผ้าใบ 725	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
772	305	7	200.00	Adidas	หนัง	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
773	305	7	200.00	Asic	ผ้าใบ Gel	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
774	305	7	200.00	Nike	หนังผสมหนังกลับ	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
775	305	7	200.00	Nike	Panda	ดำขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
776	329	7	200.00	Adidas	Samba	ครีม		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
777	306	7	200.00	Adidas	Super star	ขาวดำ		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
778	306	7	200.00	Nike	Air Monarch	ขาว		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
779	331	7	200.00	test	1	1		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, service_name, base_price, description, branch_id) FROM stdin;
8	ทำความสะอาดรองเท้าหนังกลับ	250.00	ทำความสะอาดรองเท้าหนังกลับ หนังนูบัค	2
9	ทำความสะอาดรองเท้าหนัง	250.00	ทำความสะอาดรองเท้าหนัง รองเท้าหนังวัว 	2
29	ทำความสะอาดรองเท้าบูทหนังเด็ก	200.00		2
11	ทำความสะอาดรองเท้าแบรนด์เนม	300.00	GUCCI,CHANEL,PRADA	2
13	เพ้นท์สีขอบรองเท้า	200.00	เพ้นท์สีขอบรองเท้าโดยสี Angelus	2
12	แก้ขอบเหลือง	150.00	แก้ขอบเหลืองรองเท้าโดยใช้น้ำยา	2
15	เปลี่ยนเชือกรองเท้า	30.00	เปลี่ยนเชือกรองเท้า	2
16	เปลี่ยนพื้นรองเท้า	80.00	เปลี่ยนพื้นรองเท้า	2
30	ทำความสะอาดรองเท้าผ้าใบหุ้มข้อ	250.00		2
31	ทำความสะอาดรองเท้าเด็ก	150.00		2
32	ทำความสะอาดรองเท้าแตะ	150.00		2
33	บริการซักด่วน	100.00	ซักด่วน 1 วัน	2
34	ทำความสะอาดรองเท้าแตะเด็ก	90.00	ทำความสะอาดรองเท้าแตะเด็ก	2
35	ทำความสะอาดรองเท้าผ้าใบเด็ก	120.00	ทำความสะอาดรองเท้าผ้าใบเด็ก	2
36	ทำความสะอาดรองเท้าผ้าใบ แก้ขอบเหลือง	350.00		2
37	ทำความสะอาดรองเท้าผ้าใบ+เคลือบกันน้ำ	300.00		2
38	ทำความสะอาดผ้าใบ+เคลือบกันน้ำ+เพ้นท์สี	450.00		2
39	ทำความสะอาดรองเท้าหิมะ	300.00		2
40	ทำความสะอาดรองเท้าแตะ	100.00	รองเท้าแตะ	2
20	ทำความสะอาดรองเท้าบูทหนัง ด่วน	600.00	ทำความสะอาดรองเท้าบูทหนัง ด่วน 1 วัน	2
21	ทำความสะอาดรองเท้าแบรนด์เนม ด่วน	600.00	ทำความสะอาดรองเท้าแบรนด์เนม ด่วน 1 วัน	2
7	ทำความสะอาดรองเท้าผ้าใบ	200.00	ทำความสะอาดรองเท้าผ้าใบภายนอก ภายใน	2
14	เคลือบสเปรย์กันน้ำ	100.00	เคลือบสเปรย์กันน้ำ	2
24	ทำความสะอาดรองเท้าผ้าใบ	200.00		4
10	ทำความสะอาดรองเท้าบูทหนัง	300.00	บูทหนัง Redwing Timberland	2
27	ทำความสะอาดรองเท้าหนัง	200.00		4
28	ทำความสะอาดรองเท้าหนังกลับ	500.00	555	4
17	ทำความสะอาดรองเท้าผ้าใบ ด่วน	300.00	ทำความสะอาดรองเท้าผ้าใบ ด่วน 1 วัน	2
18	ทำความสะอาดรองเท้าหนังกลับ ด่วน	350.00	ทำความสะอาดรองเท้าหนังกลับ ด่วน 1 วัน	2
19	ทำความสะอาดรองเท้าหนัง ด่วน	350.00	ทำความสะอาดรองเท้าหนัง ด่วน 1 วัน	2
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, phone, branch_id, locker_id, slot_id, return_slot_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 12, true);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 73, true);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 5, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 183, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 50, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 89, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: locker_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locker_slots_id_seq', 1, false);


--
-- Name: lockers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lockers_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 261, true);


--
-- Name: payouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payouts_id_seq', 78, true);


--
-- Name: queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_id_seq', 331, true);


--
-- Name: queue_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_items_id_seq', 779, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 40, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: customers customers_customer_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_code_key UNIQUE (customer_code);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: locker_slots locker_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locker_slots
    ADD CONSTRAINT locker_slots_pkey PRIMARY KEY (id);


--
-- Name: lockers lockers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lockers
    ADD CONSTRAINT lockers_code_key UNIQUE (code);


--
-- Name: lockers lockers_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lockers
    ADD CONSTRAINT lockers_code_unique UNIQUE (code);


--
-- Name: lockers lockers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lockers
    ADD CONSTRAINT lockers_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_pkey PRIMARY KEY (id);


--
-- Name: queue_items queue_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_pkey PRIMARY KEY (id);


--
-- Name: queue queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: customers unique_phone_per_branch; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT unique_phone_per_branch UNIQUE (branch_id, phone);


--
-- Name: admins admins_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: appointments appointments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: expenses expenses_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: appointments fk_appointments_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_customer FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: appointments fk_appointments_queue; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_queue FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE SET NULL;


--
-- Name: invoices invoices_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: locker_slots locker_slots_locker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locker_slots
    ADD CONSTRAINT locker_slots_locker_id_fkey FOREIGN KEY (locker_id) REFERENCES public.lockers(id);


--
-- Name: lockers lockers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lockers
    ADD CONSTRAINT lockers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: payments payments_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: payouts payouts_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payouts
    ADD CONSTRAINT payouts_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: queue queue_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: queue queue_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: queue_items queue_items_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: queue_items queue_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_items
    ADD CONSTRAINT queue_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: queue queue_locker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_locker_id_fkey FOREIGN KEY (locker_id) REFERENCES public.lockers(id);


--
-- Name: queue queue_return_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_return_slot_id_fkey FOREIGN KEY (return_slot_id) REFERENCES public.locker_slots(id);


--
-- Name: queue queue_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.locker_slots(id);


--
-- Name: services services_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: transactions transactions_locker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_locker_id_fkey FOREIGN KEY (locker_id) REFERENCES public.lockers(id);


--
-- Name: transactions transactions_return_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_return_slot_id_fkey FOREIGN KEY (return_slot_id) REFERENCES public.locker_slots(id);


--
-- Name: transactions transactions_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.locker_slots(id);


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admins TO admin;


--
-- Name: SEQUENCE admins_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.admins_id_seq TO admin;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.appointments TO admin;


--
-- Name: SEQUENCE appointments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.appointments_id_seq TO admin;


--
-- Name: TABLE branches; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.branches TO admin;


--
-- Name: SEQUENCE branches_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.branches_id_seq TO admin;


--
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.customers TO admin;


--
-- Name: SEQUENCE customers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.customers_id_seq TO admin;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.employees TO admin;


--
-- Name: SEQUENCE employees_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.employees_id_seq TO admin;


--
-- Name: TABLE expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.expenses TO admin;


--
-- Name: SEQUENCE expenses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.expenses_id_seq TO admin;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.invoices TO admin;


--
-- Name: SEQUENCE invoices_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.invoices_id_seq TO admin;


--
-- Name: TABLE locker_slots; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.locker_slots TO admin;


--
-- Name: SEQUENCE locker_slots_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.locker_slots_id_seq TO admin;


--
-- Name: TABLE lockers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.lockers TO admin;


--
-- Name: SEQUENCE lockers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.lockers_id_seq TO admin;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payments TO admin;


--
-- Name: SEQUENCE payments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payments_id_seq TO admin;


--
-- Name: TABLE payouts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payouts TO admin;


--
-- Name: SEQUENCE payouts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.payouts_id_seq TO admin;


--
-- Name: TABLE queue; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.queue TO admin;


--
-- Name: SEQUENCE queue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.queue_id_seq TO admin;


--
-- Name: TABLE queue_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.queue_items TO admin;


--
-- Name: SEQUENCE queue_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.queue_items_id_seq TO admin;


--
-- Name: TABLE services; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.services TO admin;


--
-- Name: SEQUENCE services_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.services_id_seq TO admin;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.transactions TO admin;


--
-- Name: SEQUENCE transactions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.transactions_id_seq TO admin;


--
-- PostgreSQL database dump complete
--

