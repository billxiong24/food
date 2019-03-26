--
-- PostgreSQL database dump
--

-- Dumped from database version 10.6 (Ubuntu 10.6-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.6 (Ubuntu 10.6-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: weights_t; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.weights_t AS ENUM (
    'oz',
    'lb',
    't',
    'g',
    'kg',
    'fl-oz',
    'pt',
    'qt',
    'gal',
    'ml',
    'l',
    'count'
);


ALTER TYPE public.weights_t OWNER TO postgres;

--
-- Name: unique_ingred_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_ingred_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('ingredients_num_seq'::regclass) val
   WHERE  NOT EXISTS (SELECT 1 FROM ingredients WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_ingred_num_seq(OUT nextfree bigint) OWNER TO postgres;

--
-- Name: unique_sku_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_sku_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('sku_num_seq'::regclass) val 
   WHERE  NOT EXISTS (SELECT 1 FROM sku WHERE num = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_sku_num_seq(OUT nextfree bigint) OWNER TO postgres;

--
-- Name: unique_users_num_seq(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_users_num_seq(OUT nextfree bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
BEGIN
LOOP
   SELECT INTO nextfree val
   FROM   nextval('users_id_seq'::regclass) val
   WHERE  NOT EXISTS (SELECT 1 FROM users WHERE id = val);
   EXIT WHEN FOUND;
END LOOP; 
END
$$;


ALTER FUNCTION public.unique_users_num_seq(OUT nextfree bigint) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    num integer NOT NULL,
    name text NOT NULL
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


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: formula; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    comment text,
    num integer NOT NULL
);


ALTER TABLE public.formula OWNER TO postgres;

--
-- Name: formula_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formula_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formula_id_seq OWNER TO postgres;

--
-- Name: formula_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formula_id_seq OWNED BY public.formula.id;


--
-- Name: formula_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formula_ingredients (
    formula_id integer,
    ingredients_id integer,
    quantity integer NOT NULL,
    unit public.weights_t NOT NULL
);


ALTER TABLE public.formula_ingredients OWNER TO postgres;

--
-- Name: formula_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formula_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formula_num_seq OWNER TO postgres;

--
-- Name: formula_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formula_num_seq OWNED BY public.formula.num;


--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    name text NOT NULL,
    num integer DEFAULT public.unique_ingred_num_seq() NOT NULL,
    vend_info text,
    pkg_cost numeric NOT NULL,
    comments text,
    id integer NOT NULL,
    pkg_size integer NOT NULL,
    unit text NOT NULL,
    CONSTRAINT ingredients_pkg_cost_check CHECK ((pkg_cost > (0)::numeric))
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_id_seq OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- Name: ingredients_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredients_num_seq OWNER TO postgres;

--
-- Name: ingredients_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_num_seq OWNED BY public.ingredients.num;


--
-- Name: manufacturing_goal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_goal (
    id integer NOT NULL,
    name text,
    user_id integer NOT NULL,
    deadline bigint,
    enabled boolean DEFAULT false
);


ALTER TABLE public.manufacturing_goal OWNER TO postgres;

--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_id_seq OWNED BY public.manufacturing_goal.id;


--
-- Name: manufacturing_goal_sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_goal_sku (
    mg_id integer NOT NULL,
    sku_id integer NOT NULL,
    quantity numeric NOT NULL,
    start_time bigint DEFAULT 0,
    end_time bigint DEFAULT 0,
    man_line_id integer DEFAULT 0
);


ALTER TABLE public.manufacturing_goal_sku OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_sku_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_sku_id_seq OWNED BY public.manufacturing_goal_sku.mg_id;


--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_sku_sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_sku_sku_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_sku_sku_id_seq OWNED BY public.manufacturing_goal_sku.sku_id;


--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_goal_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_goal_user_id_seq OWNER TO postgres;

--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_goal_user_id_seq OWNED BY public.manufacturing_goal.user_id;


--
-- Name: manufacturing_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_line (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    shortname character varying(5) NOT NULL,
    comment text
);


ALTER TABLE public.manufacturing_line OWNER TO postgres;

--
-- Name: manufacturing_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manufacturing_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manufacturing_line_id_seq OWNER TO postgres;

--
-- Name: manufacturing_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manufacturing_line_id_seq OWNED BY public.manufacturing_line.id;


--
-- Name: manufacturing_line_sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturing_line_sku (
    sku_id integer NOT NULL,
    manufacturing_line_id integer NOT NULL
);


ALTER TABLE public.manufacturing_line_sku OWNER TO postgres;

--
-- Name: productline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productline (
    name text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.productline OWNER TO postgres;

--
-- Name: productline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productline_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.productline_id_seq OWNER TO postgres;

--
-- Name: productline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productline_id_seq OWNED BY public.productline.id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    sku_num integer NOT NULL,
    week integer NOT NULL,
    year integer NOT NULL,
    customer_num integer NOT NULL,
    customer_name text NOT NULL,
    sales integer NOT NULL,
    price_per_case numeric NOT NULL
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: sku; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku (
    name character varying(32) NOT NULL,
    num integer DEFAULT public.unique_sku_num_seq() NOT NULL,
    case_upc bigint NOT NULL,
    unit_upc bigint NOT NULL,
    unit_size text NOT NULL,
    count_per_case integer NOT NULL,
    prd_line text,
    comments text,
    id integer NOT NULL,
    formula_id integer,
    formula_scale numeric DEFAULT 1.0 NOT NULL,
    man_rate numeric NOT NULL,
    man_setup_cost numeric DEFAULT 1.0 NOT NULL,
    man_run_cost numeric DEFAULT 1.0 NOT NULL,
    CONSTRAINT sku_count_per_case_check CHECK ((count_per_case > 0))
);


ALTER TABLE public.sku OWNER TO postgres;

--
-- Name: sku_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_id_seq OWNER TO postgres;

--
-- Name: sku_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_id_seq OWNED BY public.sku.id;


--
-- Name: sku_ingred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku_ingred (
    sku_num integer NOT NULL,
    ingred_num integer NOT NULL,
    quantity numeric NOT NULL
);


ALTER TABLE public.sku_ingred OWNER TO postgres;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_ingred_ingred_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_ingred_num_seq OWNER TO postgres;

--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_ingred_ingred_num_seq OWNED BY public.sku_ingred.ingred_num;


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_ingred_sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_ingred_sku_num_seq OWNER TO postgres;

--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_ingred_sku_num_seq OWNED BY public.sku_ingred.sku_num;


--
-- Name: sku_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sku_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sku_num_seq OWNER TO postgres;

--
-- Name: sku_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sku_num_seq OWNED BY public.sku.num;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uname character varying(32) NOT NULL,
    id integer DEFAULT public.unique_users_num_seq() NOT NULL,
    password character varying(60) NOT NULL,
    admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: formula id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula ALTER COLUMN id SET DEFAULT nextval('public.formula_id_seq'::regclass);


--
-- Name: formula num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula ALTER COLUMN num SET DEFAULT nextval('public.formula_num_seq'::regclass);


--
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: manufacturing_goal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal ALTER COLUMN id SET DEFAULT nextval('public.manufacturing_goal_id_seq'::regclass);


--
-- Name: manufacturing_goal user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal ALTER COLUMN user_id SET DEFAULT nextval('public.manufacturing_goal_user_id_seq'::regclass);


--
-- Name: manufacturing_goal_sku mg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku ALTER COLUMN mg_id SET DEFAULT nextval('public.manufacturing_goal_sku_id_seq'::regclass);


--
-- Name: manufacturing_goal_sku sku_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku ALTER COLUMN sku_id SET DEFAULT nextval('public.manufacturing_goal_sku_sku_id_seq'::regclass);


--
-- Name: manufacturing_line id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line ALTER COLUMN id SET DEFAULT nextval('public.manufacturing_line_id_seq'::regclass);


--
-- Name: productline id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline ALTER COLUMN id SET DEFAULT nextval('public.productline_id_seq'::regclass);


--
-- Name: sku id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku ALTER COLUMN id SET DEFAULT nextval('public.sku_id_seq'::regclass);


--
-- Name: sku_ingred sku_num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN sku_num SET DEFAULT nextval('public.sku_ingred_sku_num_seq'::regclass);


--
-- Name: sku_ingred ingred_num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred ALTER COLUMN ingred_num SET DEFAULT nextval('public.sku_ingred_ingred_num_seq'::regclass);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, num, name) FROM stdin;
1	0	Weis Markets
2	1	Albertsons LLC
3	2	Food Lion
4	3	Hannaford
5	4	Giant
6	5	Stop & Shop
7	6	Kroger
8	7	SpartanNash
9	8	SuperValu Inc.
10	9	Shop 'n Save
11	10	C-Town
12	11	Sunflower Farmers Market
13	12	Scolari's Food and Drug
14	13	Brookshire Grocery Company
15	14	FoodCity
16	15	Brown & Cole
17	16	K-VA-T Food Stores
18	17	Broulims
19	18	Super Saver
20	19	Raley's
21	20	Walmart
22	21	Village Market Food Center
23	22	Food Town
24	23	Western Beef
25	24	Chappells Hometown Foods
26	25	Hank's Market
27	26	Market Basket
28	27	Nam Dae Mun Farmers Market
29	28	Great Valu Markets
30	29	Felpausch
31	30	SuperTarget
32	31	Compare Foods Supermarket
33	32	Pueblo
34	33	Lauer's Supermarket and Bakery
35	34	Mayfair Markets
36	35	Schnucks
37	36	D&W Food Centers
38	37	Fred Meyer
39	38	Great American Food Stores
40	39	Fareway
41	40	Buehler's Buy-Low
42	41	Arlan's Market
43	42	Sack&Save
44	43	United Grocery Outlet
45	44	Foodland
46	45	Landis Supermarkets
47	46	Macey's Market
48	47	Food Pavilion
49	48	Miller's Fresh Foods
50	49	FoodMaxx
51	50	Sav-A-Lot
52	51	Valley Marketplace
53	52	Beach's Market
54	53	DeCicco Family Market
55	54	Gelson's Markets
56	55	Piggly Wiggly
57	56	Hollywood Super Market
58	57	Lunds & Byerlys
59	58	Red Apple
60	59	Meijer
61	60	Super Dollar Discount Foods
62	61	Breaux Mart Supermarkets
63	62	Westborn Market
64	63	Yoke's Fresh Market
65	64	Big M
66	65	The Fresh Grocer
67	66	McCaffrey's
68	67	Crosby's Marketplace
69	68	Ideal Food Basket
70	69	Western Supermarket
71	70	Zup's
72	71	Remke Markets
73	72	Acme Fresh Market
74	73	Homeland
75	74	Tom Thumb Food & Pharmacy
76	75	Pick 'N Save
77	76	Ingles Markets
78	77	Woodman's Food Market
79	78	Dahl's Foods
80	79	Harding's Friendly Markets
81	80	New Leaf Community Markets
82	81	Hugo's
83	82	Vinckier Foods
84	83	BI-LO
85	84	Mac's Fresh Market
86	85	ShopRite
87	86	Quality Foods
88	87	Sav-Mor Foods
89	88	Lin's Fresh Market
90	89	Plum Market
91	90	H-E-B
92	91	Big Y Foods
93	92	Central Market
94	93	Coborns
95	94	H-E-B Plus
96	95	Cost Cutter
97	96	Key Markets
98	97	Trade Fair
99	98	Sunfresh Market
100	99	Strack & Van Til
101	100	Shaw's and Star Market
102	101	Gristedes
103	102	Matherne's Supermarkets
104	103	Wayne's Hometown Market
\.


--
-- Data for Name: formula; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula (id, name, comment, num) FROM stdin;
3	formula609	\N	2
5	temp	hi	4
6	232332		1870083086
7	hjj		1606971358
8	jijojklk		447225196
9	sdfadfsad		814643368
10	fr		174981705
11	323		1574751442
14	dfd		110189731
16	199999999997		960006855
1	sasa	some	1
18	sas		2063683188
4	formula6209	\N	3
19	asiago		194533447
13	19999999999		1707997933
15	1999999998		845134465
17	1999996		58584803
12	dgf		529439176
\.


--
-- Data for Name: formula_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formula_ingredients (formula_id, ingredients_id, quantity, unit) FROM stdin;
4	18	0	lb
3	11	3	lb
10	18	1	kg
10	19	1	kg
10	21	1	kg
10	22	1	kg
14	1	1	kg
16	1	1	kg
13	1	1	kg
12	1	1	kg
12	6	1	kg
12	7	1	kg
12	9	1	kg
1	16	1	kg
1	19	10	kg
1	13	5	kg
18	1	1	kg
4	21	4	kg
4	19	2	kg
4	22	6	kg
19	1	1	kg
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (name, num, vend_info, pkg_cost, comments, id, pkg_size, unit) FROM stdin;
name	6	vending	45	helloworld	1	2	lb
ing4545	1414	tnoerhr vending	10	a comment	6	2	lb
ing24545	1415	tnoerhr vending	10	a comment	7	2	lb
name6969	12	\N	10	\N	9	2	lb
ing234	47	please	15	a comment	5	2	lb
ing1992	563	waterino	500	\N	11	2	lb
namerino	5633	waterinrterro	5300	\N	12	2	lb
ing6663	3	dalis	10	commenting	13	2	lb
ing1112	4	dalis	10	commenting	14	2	lb
ing11123	2533	dalis	10	commenting	15	2	lb
ing111253	5	dalis	10	commenting	16	2	lb
ing190	7	dalis	10	commenting	18	2	lb
ing19309	2364	dalis	10	commenting	19	2	lb
nameinger	8	dalis	10	commenting	22	2	lb
name223	9	dalis	10	commenting	23	2	lb
name142	10	dalis	10	commenting	24	2	lb
namefii	11	dalis	10	commenting	25	2	lb
name25	13	dalis	10	commenting	27	2	lb
eriuadf	14	tnoerhr vending	10	a comment	28	2	lb
adsoidf	15	\N	10	\N	29	2	lb
ing22812	16	\N	523	\N	30	2	lb
newname	17	\N	10	\N	31	2	lb
adsfiuer	18	tnoerhr vending	10	a comment	32	2	lb
inginginging	19	tnoerhr vending	10	a comment	33	2	lb
skuskus	698	someinfo please	45	newcomment wiht id	2	2	lb
nameinge	20	hi	45	\N	34	2	lb
nameingerr	29	hi	45	\N	35	2	lb
namesepingerr	30	hi	45	\N	36	2	lb
namerring	31	hi	45	\N	38	2	lb
ingeroa	32	hier	451	\N	39	2	lb
roanameing	33	company	451	\N	40	2	lb
name rooro	34	compdsany	451	\N	41	2	lb
name anotering69	35	compdsany	451	\N	42	2	lb
ing and name	36	compdsany	451	\N	43	2	lb
test	101010101	hello	43	hello	44	2	lb
2443	24305740		1232		46	1233	kg
njnjnjnj	1474627209		12345		47	1234	kg
hbhhbb	1139352703		123		48	123	kg
jncjdncj	292495232		123		49	123	kg
ewrewr	159814885		13122		50	12121	kg
123	1430574099		1232		45	1234	kg
4398	889	dalis	10	commenting	20	2	lb
459ff\\c	50	some vending	15	a comment	4	2	lb
113	1105581281		2		51	2	kg
112	891	dalis	10	commenting	21	2	lb
110	1661988573		2		52	2	grams
\.


--
-- Data for Name: manufacturing_goal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal (id, name, user_id, deadline, enabled) FROM stdin;
5	goal2	7	1551157200000	f
7	goal2	6	1551157200000	f
8	newgoal	6	1551157200000	f
12345	Thanksgiving Bundle	12	1550534400000	t
23456	Sports Pack	13	1550534400000	t
34567	Christmas Bag	14	1550707200000	f
56789	Empty Bundle	15	1550534400000	t
67890	Super Pack	16	1550793600000	t
14	Goal to Move	17	1551052800000	f
45678	Lunar New Year	12	1550707200000	f
2	goal1	6	1551157200000	t
10	My Goal	17	1551139200000	f
11	Something	17	1551312000000	f
9	sids goals	9	1551157200000	t
\.


--
-- Data for Name: manufacturing_goal_sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_goal_sku (mg_id, sku_id, quantity, start_time, end_time, man_line_id) FROM stdin;
7	3	0.6	0	0	0
7	5	0.32	0	0	0
7	7	0.88	0	0	0
7	20	0.12	0	0	0
9	1	12	0	0	0
9	9	0.6	0	0	0
8	3	1.33	0	0	0
8	5	1.33	0	0	0
8	6	1.33	0	0	0
8	11	1.33	0	0	0
67890	78111	20	0	0	0
12345	12113457	525	0	0	0
34567	12113457	525	0	0	0
12345	12113458	2000	0	0	0
34567	12113458	2000	0	0	0
23456	12311459	5115	0	0	0
34567	12311459	5115	0	0	0
67890	12311459	5115	0	0	0
45678	12311466	200	1551704400000	1551711600000	1234
12345	12113456	545	1550667600000	1550876400000	1234
23456	12311461	5115	0	0	0
34567	12113456	545	1550667600000	1550876400000	1234
23456	7991138	100	1550494800000	1550581200000	1235
23456	7911918	5115	1550667600000	1550671200000	1236
2	17	10	1551099600000	1551186000000	1236
23456	12113460	515	0	0	0
9	8	0.4	1551272400000	1551272400000	5
14	11	20	1548997200000	1549083600000	5
\.


--
-- Data for Name: manufacturing_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_line (id, name, shortname, comment) FROM stdin;
8	Washington Soups	DC2	\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec augue nec orci ornare fringilla. Fusce venenatis ultrices eros at vehicula. Pellentesque malesuada id felis fringilla ullamcorper. Phasellus tortor risus, blandit eget placerat et, ultrices sed felis. Phasellus sit amet pellentesque felis, id semper enim. Nam vulputate quam eu lectus.
1	hi	HI33	
2	hi	MANLI	
3	hi	MANDI	
5	naa	MAXI	
1234	Boise Manufacturing Plant 1	BMP1	smells bad
1235	Boise Manufacturing Plant 2	BMP2	smells bad
1236	Boise Manufacturing Plant 3	BMP3	smells bad
1237	Dub Manufacturing Factory 1	DMF1	located in Marca, Venuzuela
1238	Dub Manufacturing Factory 2	DMF2	Located in St. George, Alabama
0	empty	empty	empty
10	Test	TT123	
\.


--
-- Data for Name: manufacturing_line_sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manufacturing_line_sku (sku_id, manufacturing_line_id) FROM stdin;
12113456	1234
12113457	1234
12113458	1234
12311459	1234
12113460	1234
12311461	1234
7911918	1234
7991138	1234
12311466	1234
78111	1234
12113456	1235
12113457	1235
12113458	1235
12311459	1235
12113460	1235
12311461	1235
7911918	1235
7991138	1235
12311466	1235
78111	1235
12113456	1236
12113457	1236
12113458	1236
12311459	1236
12113460	1236
12311461	1236
7911918	1236
7991138	1236
12311466	1236
7	1
7	8
78111	1236
12113456	1237
12113457	1237
12113458	1237
12311459	1237
12113460	1237
12311461	1237
7911918	1237
7991138	1237
12311466	1237
78111	1237
12113456	1238
12113457	1238
12113458	1238
12311459	1238
12113460	1238
12311461	1238
7911918	1238
7991138	1238
3	1
3	2
3	3
3	5
3	8
5	1
5	2
5	3
5	5
6	1
6	2
6	3
7	2
8	1
4	1234
4	1235
4	1236
4	1237
4	1238
12311466	1238
78111	1238
\.


--
-- Data for Name: productline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productline (name, id) FROM stdin;
prod4	2
prod69	1
prod51	5
helloprod	6
Jerkin Turkin Meaty Burkins	201
Aunt Jemina Bakery	293
Jell-O	996
Vitamint	649
Gold	624
Cherry Farms	1031
Mama Chous	788
thehehehehe	7
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (sku_num, week, year, customer_num, customer_name, sales, price_per_case) FROM stdin;
11	1	2019	44	Foodland	114	291
11	2	2019	30	SuperTarget	275	251.25
11	3	2019	14	FoodCity	81	291
11	3	2019	24	Chappells Hometown Foods	59	264.5
11	3	2019	43	United Grocery Outlet	117	264.5
11	3	2019	53	DeCicco Family Market	56	291
11	5	2019	30	SuperTarget	278	251.25
11	6	2019	75	Pick 'N Save	31	277.75
11	7	2019	20	Walmart	350	238.25
11	8	2019	23	Western Beef	53	277.75
11	8	2019	30	SuperTarget	259	251.25
11	9	2019	99	Strack & Van Til	63	291
11	11	2019	24	Chappells Hometown Foods	63	264.5
11	11	2019	30	SuperTarget	246	251.25
11	1	2018	44	Foodland	94	291
11	2	2018	30	SuperTarget	273	251.25
11	3	2018	14	FoodCity	71	291
11	3	2018	24	Chappells Hometown Foods	70	264.5
11	3	2018	43	United Grocery Outlet	111	264.5
11	3	2018	53	DeCicco Family Market	50	291
11	5	2018	30	SuperTarget	239	251.25
11	6	2018	75	Pick 'N Save	31	277.75
11	7	2018	20	Walmart	331	238.25
11	8	2018	23	Western Beef	58	277.75
11	8	2018	30	SuperTarget	268	251.25
11	9	2018	99	Strack & Van Til	78	291
11	11	2018	24	Chappells Hometown Foods	58	264.5
11	11	2018	30	SuperTarget	266	251.25
11	12	2018	37	Fred Meyer	94	330.75
11	13	2018	14	FoodCity	79	291
11	13	2018	26	Market Basket	64	264.5
11	13	2018	44	Foodland	100	291
11	13	2018	50	Sav-A-Lot	104	264.5
11	14	2018	30	SuperTarget	274	251.25
11	14	2018	43	United Grocery Outlet	104	264.5
11	17	2018	30	SuperTarget	276	251.25
11	17	2018	53	DeCicco Family Market	62	291
11	18	2018	99	Strack & Van Til	69	291
11	19	2018	24	Chappells Hometown Foods	54	264.5
11	20	2018	30	SuperTarget	266	251.25
11	22	2018	20	Walmart	349	238.25
11	23	2018	14	FoodCity	88	291
11	23	2018	30	SuperTarget	270	251.25
11	23	2018	75	Pick 'N Save	29	277.75
11	25	2018	23	Western Beef	57	277.75
11	25	2018	43	United Grocery Outlet	98	264.5
11	25	2018	44	Foodland	100	291
11	26	2018	30	SuperTarget	253	251.25
11	26	2018	50	Sav-A-Lot	102	264.5
11	27	2018	24	Chappells Hometown Foods	56	264.5
11	27	2018	26	Market Basket	50	264.5
11	27	2018	99	Strack & Van Til	68	291
11	29	2018	30	SuperTarget	241	251.25
11	29	2018	37	Fred Meyer	92	330.75
11	31	2018	53	DeCicco Family Market	65	291
11	32	2018	30	SuperTarget	231	251.25
11	33	2018	14	FoodCity	82	291
11	35	2018	24	Chappells Hometown Foods	63	264.5
11	35	2018	30	SuperTarget	260	251.25
11	36	2018	43	United Grocery Outlet	112	264.5
11	36	2018	99	Strack & Van Til	62	291
11	37	2018	20	Walmart	343	238.25
11	37	2018	44	Foodland	96	291
11	38	2018	30	SuperTarget	254	251.25
11	39	2018	50	Sav-A-Lot	105	264.5
11	40	2018	75	Pick 'N Save	29	277.75
11	41	2018	26	Market Basket	53	264.5
11	41	2018	30	SuperTarget	267	251.25
11	42	2018	23	Western Beef	55	277.75
11	43	2018	14	FoodCity	79	291
11	43	2018	24	Chappells Hometown Foods	70	264.5
11	44	2018	30	SuperTarget	249	251.25
11	45	2018	53	DeCicco Family Market	49	291
11	45	2018	99	Strack & Van Til	74	291
11	46	2018	37	Fred Meyer	103	330.75
11	47	2018	30	SuperTarget	222	251.25
11	47	2018	43	United Grocery Outlet	103	264.5
11	49	2018	44	Foodland	112	291
11	50	2018	30	SuperTarget	230	251.25
11	51	2018	24	Chappells Hometown Foods	56	264.5
11	52	2018	20	Walmart	386	238.25
11	52	2018	50	Sav-A-Lot	98	264.5
11	1	2017	44	Foodland	94	291
11	2	2017	30	SuperTarget	265	251.25
11	3	2017	14	FoodCity	85	291
11	3	2017	24	Chappells Hometown Foods	69	264.5
11	3	2017	43	United Grocery Outlet	104	264.5
11	3	2017	53	DeCicco Family Market	49	291
11	5	2017	30	SuperTarget	247	251.25
11	6	2017	75	Pick 'N Save	29	277.75
11	7	2017	20	Walmart	406	238.25
11	8	2017	23	Western Beef	52	277.75
11	8	2017	30	SuperTarget	271	251.25
11	9	2017	99	Strack & Van Til	74	291
11	11	2017	24	Chappells Hometown Foods	54	264.5
11	11	2017	30	SuperTarget	261	251.25
11	12	2017	37	Fred Meyer	86	330.75
11	13	2017	14	FoodCity	76	291
11	13	2017	26	Market Basket	61	264.5
11	13	2017	44	Foodland	88	291
11	13	2017	50	Sav-A-Lot	109	264.5
11	14	2017	30	SuperTarget	239	251.25
11	14	2017	43	United Grocery Outlet	94	264.5
11	17	2017	30	SuperTarget	262	251.25
11	17	2017	53	DeCicco Family Market	60	291
11	18	2017	99	Strack & Van Til	65	291
11	19	2017	24	Chappells Hometown Foods	53	264.5
11	20	2017	30	SuperTarget	267	251.25
11	22	2017	20	Walmart	367	238.25
11	23	2017	14	FoodCity	86	291
11	23	2017	30	SuperTarget	269	251.25
11	23	2017	75	Pick 'N Save	30	277.75
11	25	2017	23	Western Beef	60	277.75
11	25	2017	43	United Grocery Outlet	96	264.5
11	25	2017	44	Foodland	88	291
11	26	2017	30	SuperTarget	231	251.25
11	26	2017	50	Sav-A-Lot	98	264.5
11	27	2017	24	Chappells Hometown Foods	56	264.5
11	27	2017	26	Market Basket	56	264.5
11	27	2017	99	Strack & Van Til	65	291
11	29	2017	30	SuperTarget	248	251.25
11	29	2017	37	Fred Meyer	89	330.75
11	31	2017	53	DeCicco Family Market	54	291
11	32	2017	30	SuperTarget	264	251.25
11	33	2017	14	FoodCity	79	291
11	35	2017	24	Chappells Hometown Foods	60	264.5
11	35	2017	30	SuperTarget	232	251.25
11	36	2017	43	United Grocery Outlet	120	264.5
11	36	2017	99	Strack & Van Til	75	291
11	37	2017	20	Walmart	397	238.25
11	37	2017	44	Foodland	99	291
11	38	2017	30	SuperTarget	267	251.25
11	39	2017	50	Sav-A-Lot	97	264.5
11	40	2017	75	Pick 'N Save	33	277.75
11	41	2017	26	Market Basket	60	264.5
11	41	2017	30	SuperTarget	249	251.25
11	42	2017	23	Western Beef	59	277.75
11	43	2017	14	FoodCity	74	291
11	43	2017	24	Chappells Hometown Foods	65	264.5
11	44	2017	30	SuperTarget	245	251.25
11	45	2017	53	DeCicco Family Market	51	291
11	45	2017	99	Strack & Van Til	70	291
11	46	2017	37	Fred Meyer	105	330.75
11	47	2017	30	SuperTarget	236	251.25
11	47	2017	43	United Grocery Outlet	115	264.5
11	49	2017	44	Foodland	107	291
11	50	2017	30	SuperTarget	234	251.25
11	51	2017	24	Chappells Hometown Foods	64	264.5
11	52	2017	20	Walmart	405	238.25
11	52	2017	50	Sav-A-Lot	96	264.5
11	1	2016	44	Foodland	116	291
11	2	2016	30	SuperTarget	224	251.25
11	3	2016	14	FoodCity	82	291
11	3	2016	24	Chappells Hometown Foods	67	264.5
11	3	2016	43	United Grocery Outlet	103	264.5
11	3	2016	53	DeCicco Family Market	55	291
11	5	2016	30	SuperTarget	227	251.25
11	6	2016	75	Pick 'N Save	31	277.75
11	7	2016	20	Walmart	382	238.25
11	8	2016	23	Western Beef	56	277.75
11	8	2016	30	SuperTarget	238	251.25
11	9	2016	99	Strack & Van Til	66	291
11	11	2016	24	Chappells Hometown Foods	61	264.5
11	11	2016	30	SuperTarget	225	251.25
11	12	2016	37	Fred Meyer	94	330.75
11	13	2016	14	FoodCity	86	291
11	13	2016	26	Market Basket	54	264.5
11	13	2016	44	Foodland	100	291
11	13	2016	50	Sav-A-Lot	106	264.5
11	14	2016	30	SuperTarget	253	251.25
11	14	2016	43	United Grocery Outlet	101	264.5
11	17	2016	30	SuperTarget	237	251.25
11	17	2016	53	DeCicco Family Market	57	291
11	18	2016	99	Strack & Van Til	75	291
11	19	2016	24	Chappells Hometown Foods	56	264.5
11	20	2016	30	SuperTarget	237	251.25
11	22	2016	20	Walmart	363	238.25
11	23	2016	14	FoodCity	74	291
11	23	2016	30	SuperTarget	236	251.25
11	23	2016	75	Pick 'N Save	26	277.75
11	25	2016	23	Western Beef	49	277.75
11	25	2016	43	United Grocery Outlet	94	264.5
11	25	2016	44	Foodland	103	291
11	26	2016	30	SuperTarget	233	251.25
11	26	2016	50	Sav-A-Lot	92	264.5
11	27	2016	24	Chappells Hometown Foods	58	264.5
11	27	2016	26	Market Basket	54	264.5
11	27	2016	99	Strack & Van Til	73	291
11	29	2016	30	SuperTarget	242	251.25
11	29	2016	37	Fred Meyer	81	330.75
11	31	2016	53	DeCicco Family Market	53	291
11	32	2016	30	SuperTarget	263	251.25
11	33	2016	14	FoodCity	74	291
11	35	2016	24	Chappells Hometown Foods	63	264.5
11	35	2016	30	SuperTarget	236	251.25
11	36	2016	43	United Grocery Outlet	104	264.5
11	36	2016	99	Strack & Van Til	64	291
11	37	2016	20	Walmart	335	238.25
11	37	2016	44	Foodland	104	291
11	38	2016	30	SuperTarget	261	251.25
11	39	2016	50	Sav-A-Lot	108	264.5
11	40	2016	75	Pick 'N Save	32	277.75
11	41	2016	26	Market Basket	51	264.5
11	41	2016	30	SuperTarget	263	251.25
11	42	2016	23	Western Beef	58	277.75
11	43	2016	14	FoodCity	71	291
11	43	2016	24	Chappells Hometown Foods	59	264.5
11	44	2016	30	SuperTarget	246	251.25
11	45	2016	53	DeCicco Family Market	59	291
11	45	2016	99	Strack & Van Til	71	291
11	46	2016	37	Fred Meyer	103	330.75
11	47	2016	30	SuperTarget	245	251.25
11	47	2016	43	United Grocery Outlet	100	264.5
11	49	2016	44	Foodland	102	291
11	50	2016	30	SuperTarget	271	251.25
11	51	2016	24	Chappells Hometown Foods	62	264.5
11	52	2016	20	Walmart	389	238.25
11	52	2016	50	Sav-A-Lot	96	264.5
11	1	2015	44	Foodland	102	291
11	2	2015	30	SuperTarget	256	251.25
11	3	2015	14	FoodCity	74	291
11	3	2015	24	Chappells Hometown Foods	68	264.5
11	3	2015	43	United Grocery Outlet	102	264.5
11	3	2015	53	DeCicco Family Market	53	291
11	5	2015	30	SuperTarget	255	251.25
11	6	2015	75	Pick 'N Save	30	277.75
11	7	2015	20	Walmart	346	238.25
11	8	2015	23	Western Beef	60	277.75
11	8	2015	30	SuperTarget	257	251.25
11	9	2015	99	Strack & Van Til	78	291
11	11	2015	24	Chappells Hometown Foods	58	264.5
11	11	2015	30	SuperTarget	277	251.25
11	12	2015	37	Fred Meyer	103	330.75
11	13	2015	14	FoodCity	80	291
11	13	2015	26	Market Basket	61	264.5
11	13	2015	44	Foodland	103	291
11	13	2015	50	Sav-A-Lot	89	264.5
11	14	2015	30	SuperTarget	230	251.25
11	14	2015	43	United Grocery Outlet	100	264.5
11	17	2015	30	SuperTarget	258	251.25
11	17	2015	53	DeCicco Family Market	62	291
11	18	2015	99	Strack & Van Til	69	291
11	19	2015	24	Chappells Hometown Foods	63	264.5
11	20	2015	30	SuperTarget	224	251.25
11	22	2015	20	Walmart	353	238.25
11	23	2015	14	FoodCity	84	291
11	23	2015	30	SuperTarget	274	251.25
11	23	2015	75	Pick 'N Save	29	277.75
11	25	2015	23	Western Beef	61	277.75
11	25	2015	43	United Grocery Outlet	111	264.5
11	25	2015	44	Foodland	92	291
11	26	2015	30	SuperTarget	231	251.25
11	26	2015	50	Sav-A-Lot	98	264.5
11	27	2015	24	Chappells Hometown Foods	64	264.5
11	27	2015	26	Market Basket	56	264.5
11	27	2015	99	Strack & Van Til	70	291
11	29	2015	30	SuperTarget	257	251.25
11	29	2015	37	Fred Meyer	88	330.75
11	31	2015	53	DeCicco Family Market	59	291
11	32	2015	30	SuperTarget	225	251.25
11	33	2015	14	FoodCity	84	291
11	35	2015	24	Chappells Hometown Foods	65	264.5
11	35	2015	30	SuperTarget	236	251.25
11	36	2015	43	United Grocery Outlet	106	264.5
11	36	2015	99	Strack & Van Til	64	291
11	37	2015	20	Walmart	369	238.25
11	37	2015	44	Foodland	94	291
11	38	2015	30	SuperTarget	266	251.25
11	39	2015	50	Sav-A-Lot	98	264.5
11	40	2015	75	Pick 'N Save	32	277.75
11	41	2015	26	Market Basket	59	264.5
11	41	2015	30	SuperTarget	273	251.25
11	42	2015	23	Western Beef	58	277.75
11	43	2015	14	FoodCity	76	291
11	43	2015	24	Chappells Hometown Foods	67	264.5
11	44	2015	30	SuperTarget	251	251.25
11	45	2015	53	DeCicco Family Market	55	291
11	45	2015	99	Strack & Van Til	63	291
11	46	2015	37	Fred Meyer	105	330.75
11	47	2015	30	SuperTarget	255	251.25
11	47	2015	43	United Grocery Outlet	104	264.5
11	49	2015	44	Foodland	95	291
11	50	2015	30	SuperTarget	236	251.25
11	51	2015	24	Chappells Hometown Foods	57	264.5
11	52	2015	20	Walmart	407	238.25
11	52	2015	50	Sav-A-Lot	106	264.5
11	1	2014	44	Foodland	106	291
11	2	2014	30	SuperTarget	254	251.25
11	3	2014	14	FoodCity	84	291
11	3	2014	24	Chappells Hometown Foods	62	264.5
11	3	2014	43	United Grocery Outlet	122	264.5
11	3	2014	53	DeCicco Family Market	52	291
11	5	2014	30	SuperTarget	263	251.25
11	6	2014	75	Pick 'N Save	26	277.75
11	7	2014	20	Walmart	380	238.25
11	8	2014	23	Western Beef	52	277.75
11	8	2014	30	SuperTarget	261	251.25
11	9	2014	99	Strack & Van Til	63	291
11	11	2014	24	Chappells Hometown Foods	65	264.5
11	11	2014	30	SuperTarget	239	251.25
11	12	2014	37	Fred Meyer	93	330.75
11	13	2014	14	FoodCity	80	291
11	13	2014	26	Market Basket	60	264.5
11	13	2014	44	Foodland	99	291
11	13	2014	50	Sav-A-Lot	96	264.5
11	14	2014	30	SuperTarget	252	251.25
11	14	2014	43	United Grocery Outlet	101	264.5
11	17	2014	30	SuperTarget	264	251.25
11	17	2014	53	DeCicco Family Market	57	291
11	18	2014	99	Strack & Van Til	76	291
11	19	2014	24	Chappells Hometown Foods	62	264.5
11	20	2014	30	SuperTarget	245	251.25
11	22	2014	20	Walmart	323	238.25
11	23	2014	14	FoodCity	83	291
11	23	2014	30	SuperTarget	231	251.25
11	23	2014	75	Pick 'N Save	30	277.75
11	25	2014	23	Western Beef	59	277.75
11	25	2014	43	United Grocery Outlet	111	264.5
11	25	2014	44	Foodland	98	291
11	26	2014	30	SuperTarget	254	251.25
11	26	2014	50	Sav-A-Lot	96	264.5
11	27	2014	24	Chappells Hometown Foods	55	264.5
11	27	2014	26	Market Basket	58	264.5
11	27	2014	99	Strack & Van Til	69	291
11	29	2014	30	SuperTarget	245	251.25
11	29	2014	37	Fred Meyer	92	330.75
11	31	2014	53	DeCicco Family Market	60	291
11	32	2014	30	SuperTarget	222	251.25
11	33	2014	14	FoodCity	86	291
11	35	2014	24	Chappells Hometown Foods	70	264.5
11	35	2014	30	SuperTarget	234	251.25
11	36	2014	43	United Grocery Outlet	111	264.5
11	17	2012	30	SuperTarget	257	251.25
11	36	2014	99	Strack & Van Til	70	291
11	37	2014	20	Walmart	412	238.25
11	37	2014	44	Foodland	104	291
11	38	2014	30	SuperTarget	247	251.25
11	39	2014	50	Sav-A-Lot	90	264.5
11	40	2014	75	Pick 'N Save	29	277.75
11	41	2014	26	Market Basket	57	264.5
11	41	2014	30	SuperTarget	235	251.25
11	42	2014	23	Western Beef	50	277.75
11	43	2014	14	FoodCity	77	291
11	43	2014	24	Chappells Hometown Foods	67	264.5
11	44	2014	30	SuperTarget	222	251.25
11	45	2014	53	DeCicco Family Market	54	291
11	45	2014	99	Strack & Van Til	66	291
11	46	2014	37	Fred Meyer	93	330.75
11	47	2014	30	SuperTarget	271	251.25
11	47	2014	43	United Grocery Outlet	103	264.5
11	49	2014	44	Foodland	113	291
11	50	2014	30	SuperTarget	269	251.25
11	51	2014	24	Chappells Hometown Foods	57	264.5
11	52	2014	20	Walmart	403	238.25
11	52	2014	50	Sav-A-Lot	91	264.5
11	1	2013	44	Foodland	102	291
11	2	2013	30	SuperTarget	236	251.25
11	3	2013	14	FoodCity	82	291
11	3	2013	24	Chappells Hometown Foods	59	264.5
11	3	2013	43	United Grocery Outlet	123	264.5
11	3	2013	53	DeCicco Family Market	53	291
11	5	2013	30	SuperTarget	258	251.25
11	6	2013	75	Pick 'N Save	31	277.75
11	7	2013	20	Walmart	347	238.25
11	8	2013	23	Western Beef	54	277.75
11	8	2013	30	SuperTarget	227	251.25
11	9	2013	99	Strack & Van Til	65	291
11	11	2013	24	Chappells Hometown Foods	64	264.5
11	11	2013	30	SuperTarget	253	251.25
11	12	2013	37	Fred Meyer	97	330.75
11	13	2013	14	FoodCity	89	291
11	13	2013	26	Market Basket	57	264.5
11	13	2013	44	Foodland	101	291
11	13	2013	50	Sav-A-Lot	96	264.5
11	14	2013	30	SuperTarget	273	251.25
11	14	2013	43	United Grocery Outlet	110	264.5
11	17	2013	30	SuperTarget	255	251.25
11	17	2013	53	DeCicco Family Market	58	291
11	18	2013	99	Strack & Van Til	68	291
11	19	2013	24	Chappells Hometown Foods	58	264.5
11	20	2013	30	SuperTarget	236	251.25
11	22	2013	20	Walmart	368	238.25
11	23	2013	14	FoodCity	89	291
11	23	2013	30	SuperTarget	261	251.25
11	23	2013	75	Pick 'N Save	30	277.75
11	25	2013	23	Western Beef	55	277.75
11	25	2013	43	United Grocery Outlet	98	264.5
11	25	2013	44	Foodland	101	291
11	26	2013	30	SuperTarget	243	251.25
11	26	2013	50	Sav-A-Lot	105	264.5
11	27	2013	24	Chappells Hometown Foods	53	264.5
11	27	2013	26	Market Basket	55	264.5
11	27	2013	99	Strack & Van Til	65	291
11	29	2013	30	SuperTarget	226	251.25
11	29	2013	37	Fred Meyer	87	330.75
11	31	2013	53	DeCicco Family Market	62	291
11	32	2013	30	SuperTarget	242	251.25
11	33	2013	14	FoodCity	72	291
11	35	2013	24	Chappells Hometown Foods	58	264.5
11	35	2013	30	SuperTarget	254	251.25
11	36	2013	43	United Grocery Outlet	104	264.5
11	36	2013	99	Strack & Van Til	63	291
11	37	2013	20	Walmart	386	238.25
11	37	2013	44	Foodland	97	291
11	38	2013	30	SuperTarget	236	251.25
11	39	2013	50	Sav-A-Lot	108	264.5
11	40	2013	75	Pick 'N Save	33	277.75
11	41	2013	26	Market Basket	52	264.5
11	41	2013	30	SuperTarget	237	251.25
11	42	2013	23	Western Beef	55	277.75
11	43	2013	14	FoodCity	69	291
11	43	2013	24	Chappells Hometown Foods	61	264.5
11	44	2013	30	SuperTarget	222	251.25
11	45	2013	53	DeCicco Family Market	51	291
11	45	2013	99	Strack & Van Til	73	291
11	46	2013	37	Fred Meyer	97	330.75
11	47	2013	30	SuperTarget	256	251.25
11	47	2013	43	United Grocery Outlet	105	264.5
11	49	2013	44	Foodland	100	291
11	50	2013	30	SuperTarget	219	251.25
11	51	2013	24	Chappells Hometown Foods	62	264.5
11	52	2013	20	Walmart	342	238.25
11	52	2013	50	Sav-A-Lot	91	264.5
11	1	2012	44	Foodland	98	291
11	2	2012	30	SuperTarget	269	251.25
11	3	2012	14	FoodCity	75	291
11	3	2012	24	Chappells Hometown Foods	58	264.5
11	3	2012	43	United Grocery Outlet	111	264.5
11	3	2012	53	DeCicco Family Market	48	291
11	5	2012	30	SuperTarget	251	251.25
11	6	2012	75	Pick 'N Save	31	277.75
11	7	2012	20	Walmart	340	238.25
11	8	2012	23	Western Beef	53	277.75
11	8	2012	30	SuperTarget	229	251.25
11	9	2012	99	Strack & Van Til	64	291
11	11	2012	24	Chappells Hometown Foods	60	264.5
11	11	2012	30	SuperTarget	255	251.25
11	12	2012	37	Fred Meyer	83	330.75
11	13	2012	14	FoodCity	90	291
11	13	2012	26	Market Basket	63	264.5
11	13	2012	44	Foodland	87	291
11	13	2012	50	Sav-A-Lot	101	264.5
11	14	2012	30	SuperTarget	267	251.25
11	14	2012	43	United Grocery Outlet	101	264.5
11	17	2012	53	DeCicco Family Market	61	291
11	18	2012	99	Strack & Van Til	62	291
11	19	2012	24	Chappells Hometown Foods	52	264.5
11	20	2012	30	SuperTarget	244	251.25
11	22	2012	20	Walmart	319	238.25
11	23	2012	14	FoodCity	90	291
11	23	2012	30	SuperTarget	227	251.25
11	23	2012	75	Pick 'N Save	27	277.75
11	25	2012	23	Western Beef	52	277.75
11	25	2012	43	United Grocery Outlet	110	264.5
11	25	2012	44	Foodland	101	291
11	26	2012	30	SuperTarget	238	251.25
11	26	2012	50	Sav-A-Lot	101	264.5
11	27	2012	24	Chappells Hometown Foods	58	264.5
11	27	2012	26	Market Basket	51	264.5
11	27	2012	99	Strack & Van Til	68	291
11	29	2012	30	SuperTarget	231	251.25
11	29	2012	37	Fred Meyer	90	330.75
11	31	2012	53	DeCicco Family Market	56	291
11	32	2012	30	SuperTarget	264	251.25
11	33	2012	14	FoodCity	72	291
11	35	2012	24	Chappells Hometown Foods	69	264.5
11	35	2012	30	SuperTarget	222	251.25
11	36	2012	43	United Grocery Outlet	110	264.5
11	36	2012	99	Strack & Van Til	68	291
11	37	2012	20	Walmart	341	238.25
11	37	2012	44	Foodland	100	291
11	38	2012	30	SuperTarget	239	251.25
11	39	2012	50	Sav-A-Lot	92	264.5
11	40	2012	75	Pick 'N Save	33	277.75
11	41	2012	26	Market Basket	61	264.5
11	41	2012	30	SuperTarget	221	251.25
11	42	2012	23	Western Beef	55	277.75
11	43	2012	14	FoodCity	81	291
11	43	2012	24	Chappells Hometown Foods	70	264.5
11	44	2012	30	SuperTarget	233	251.25
11	45	2012	53	DeCicco Family Market	56	291
11	45	2012	99	Strack & Van Til	70	291
11	46	2012	37	Fred Meyer	94	330.75
11	47	2012	30	SuperTarget	265	251.25
11	47	2012	43	United Grocery Outlet	124	264.5
11	49	2012	44	Foodland	113	291
11	50	2012	30	SuperTarget	268	251.25
11	51	2012	24	Chappells Hometown Foods	55	264.5
11	52	2012	20	Walmart	413	238.25
11	52	2012	50	Sav-A-Lot	91	264.5
11	1	2011	44	Foodland	112	291
11	2	2011	30	SuperTarget	226	251.25
11	3	2011	14	FoodCity	74	291
11	3	2011	24	Chappells Hometown Foods	66	264.5
11	3	2011	43	United Grocery Outlet	116	264.5
11	3	2011	53	DeCicco Family Market	54	291
11	5	2011	30	SuperTarget	270	251.25
11	6	2011	75	Pick 'N Save	26	277.75
11	7	2011	20	Walmart	381	238.25
11	8	2011	23	Western Beef	50	277.75
11	8	2011	30	SuperTarget	257	251.25
11	9	2011	99	Strack & Van Til	67	291
11	11	2011	24	Chappells Hometown Foods	53	264.5
11	11	2011	30	SuperTarget	237	251.25
11	12	2011	37	Fred Meyer	85	330.75
11	13	2011	14	FoodCity	75	291
11	13	2011	26	Market Basket	53	264.5
11	13	2011	44	Foodland	101	291
11	13	2011	50	Sav-A-Lot	110	264.5
11	14	2011	30	SuperTarget	255	251.25
11	14	2011	43	United Grocery Outlet	110	264.5
11	17	2011	30	SuperTarget	263	251.25
11	17	2011	53	DeCicco Family Market	52	291
11	18	2011	99	Strack & Van Til	69	291
11	19	2011	24	Chappells Hometown Foods	59	264.5
11	20	2011	30	SuperTarget	271	251.25
11	22	2011	20	Walmart	372	238.25
11	23	2011	14	FoodCity	86	291
11	23	2011	30	SuperTarget	234	251.25
11	23	2011	75	Pick 'N Save	26	277.75
11	25	2011	23	Western Beef	54	277.75
11	25	2011	43	United Grocery Outlet	105	264.5
11	25	2011	44	Foodland	99	291
11	26	2011	30	SuperTarget	276	251.25
11	26	2011	50	Sav-A-Lot	108	264.5
11	27	2011	24	Chappells Hometown Foods	59	264.5
11	27	2011	26	Market Basket	55	264.5
11	27	2011	99	Strack & Van Til	69	291
11	29	2011	30	SuperTarget	251	251.25
11	29	2011	37	Fred Meyer	82	330.75
11	31	2011	53	DeCicco Family Market	63	291
11	32	2011	30	SuperTarget	267	251.25
11	33	2011	14	FoodCity	87	291
11	35	2011	24	Chappells Hometown Foods	60	264.5
11	35	2011	30	SuperTarget	266	251.25
11	36	2011	43	United Grocery Outlet	98	264.5
11	36	2011	99	Strack & Van Til	62	291
11	37	2011	20	Walmart	413	238.25
11	37	2011	44	Foodland	108	291
11	38	2011	30	SuperTarget	246	251.25
11	39	2011	50	Sav-A-Lot	96	264.5
11	40	2011	75	Pick 'N Save	32	277.75
11	41	2011	26	Market Basket	51	264.5
11	41	2011	30	SuperTarget	262	251.25
11	42	2011	23	Western Beef	55	277.75
11	43	2011	14	FoodCity	68	291
11	43	2011	24	Chappells Hometown Foods	59	264.5
11	44	2011	30	SuperTarget	240	251.25
11	45	2011	53	DeCicco Family Market	53	291
11	45	2011	99	Strack & Van Til	67	291
11	46	2011	37	Fred Meyer	99	330.75
11	47	2011	30	SuperTarget	245	251.25
11	47	2011	43	United Grocery Outlet	101	264.5
11	49	2011	44	Foodland	94	291
11	50	2011	30	SuperTarget	230	251.25
11	51	2011	24	Chappells Hometown Foods	55	264.5
11	52	2011	20	Walmart	346	238.25
11	52	2011	50	Sav-A-Lot	107	264.5
11	1	2010	44	Foodland	116	291
11	2	2010	30	SuperTarget	248	251.25
11	3	2010	14	FoodCity	81	291
11	3	2010	24	Chappells Hometown Foods	68	264.5
11	3	2010	43	United Grocery Outlet	122	264.5
11	3	2010	53	DeCicco Family Market	52	291
11	5	2010	30	SuperTarget	240	251.25
11	6	2010	75	Pick 'N Save	26	277.75
11	7	2010	20	Walmart	409	238.25
11	8	2010	23	Western Beef	55	277.75
11	8	2010	30	SuperTarget	252	251.25
11	9	2010	99	Strack & Van Til	67	291
11	11	2010	24	Chappells Hometown Foods	61	264.5
11	11	2010	30	SuperTarget	226	251.25
11	12	2010	37	Fred Meyer	101	330.75
11	13	2010	14	FoodCity	90	291
11	13	2010	26	Market Basket	58	264.5
11	13	2010	44	Foodland	98	291
11	13	2010	50	Sav-A-Lot	109	264.5
11	14	2010	30	SuperTarget	252	251.25
11	14	2010	43	United Grocery Outlet	102	264.5
11	17	2010	30	SuperTarget	265	251.25
11	17	2010	53	DeCicco Family Market	54	291
11	18	2010	99	Strack & Van Til	76	291
11	19	2010	24	Chappells Hometown Foods	61	264.5
11	20	2010	30	SuperTarget	276	251.25
11	22	2010	20	Walmart	320	238.25
11	23	2010	14	FoodCity	81	291
11	23	2010	30	SuperTarget	277	251.25
11	23	2010	75	Pick 'N Save	30	277.75
11	25	2010	23	Western Beef	53	277.75
11	25	2010	43	United Grocery Outlet	103	264.5
11	25	2010	44	Foodland	85	291
11	26	2010	30	SuperTarget	260	251.25
11	26	2010	50	Sav-A-Lot	107	264.5
11	27	2010	24	Chappells Hometown Foods	54	264.5
11	27	2010	26	Market Basket	57	264.5
11	27	2010	99	Strack & Van Til	76	291
11	29	2010	30	SuperTarget	257	251.25
11	29	2010	37	Fred Meyer	86	330.75
11	31	2010	53	DeCicco Family Market	64	291
11	32	2010	30	SuperTarget	273	251.25
11	33	2010	14	FoodCity	78	291
11	35	2010	24	Chappells Hometown Foods	60	264.5
11	35	2010	30	SuperTarget	222	251.25
11	36	2010	43	United Grocery Outlet	120	264.5
11	36	2010	99	Strack & Van Til	74	291
11	37	2010	20	Walmart	344	238.25
11	37	2010	44	Foodland	91	291
11	38	2010	30	SuperTarget	228	251.25
11	39	2010	50	Sav-A-Lot	109	264.5
11	40	2010	75	Pick 'N Save	28	277.75
11	41	2010	26	Market Basket	54	264.5
11	41	2010	30	SuperTarget	268	251.25
11	42	2010	23	Western Beef	59	277.75
11	43	2010	14	FoodCity	71	291
11	43	2010	24	Chappells Hometown Foods	58	264.5
11	44	2010	30	SuperTarget	244	251.25
11	45	2010	53	DeCicco Family Market	58	291
11	45	2010	99	Strack & Van Til	70	291
11	46	2010	37	Fred Meyer	88	330.75
11	47	2010	30	SuperTarget	228	251.25
11	47	2010	43	United Grocery Outlet	113	264.5
11	49	2010	44	Foodland	97	291
11	50	2010	30	SuperTarget	253	251.25
11	51	2010	24	Chappells Hometown Foods	67	264.5
11	52	2010	20	Walmart	386	238.25
11	52	2010	50	Sav-A-Lot	97	264.5
11	1	2009	44	Foodland	102	291
11	2	2009	30	SuperTarget	263	251.25
11	3	2009	14	FoodCity	73	291
11	3	2009	24	Chappells Hometown Foods	62	264.5
11	3	2009	43	United Grocery Outlet	104	264.5
11	3	2009	53	DeCicco Family Market	53	291
11	5	2009	30	SuperTarget	238	251.25
11	6	2009	75	Pick 'N Save	31	277.75
11	7	2009	20	Walmart	411	238.25
11	8	2009	23	Western Beef	50	277.75
11	8	2009	30	SuperTarget	255	251.25
11	9	2009	99	Strack & Van Til	70	291
11	11	2009	24	Chappells Hometown Foods	64	264.5
11	11	2009	30	SuperTarget	265	251.25
11	12	2009	37	Fred Meyer	90	330.75
11	13	2009	14	FoodCity	81	291
11	13	2009	26	Market Basket	61	264.5
11	13	2009	44	Foodland	89	291
11	13	2009	50	Sav-A-Lot	109	264.5
11	14	2009	30	SuperTarget	268	251.25
11	14	2009	43	United Grocery Outlet	108	264.5
11	17	2009	30	SuperTarget	270	251.25
11	17	2009	53	DeCicco Family Market	65	291
11	18	2009	99	Strack & Van Til	71	291
11	19	2009	24	Chappells Hometown Foods	60	264.5
11	20	2009	30	SuperTarget	241	251.25
11	22	2009	20	Walmart	333	238.25
11	23	2009	14	FoodCity	88	291
11	23	2009	30	SuperTarget	232	251.25
11	23	2009	75	Pick 'N Save	28	277.75
11	25	2009	23	Western Beef	57	277.75
11	25	2009	43	United Grocery Outlet	93	264.5
11	25	2009	44	Foodland	85	291
11	26	2009	30	SuperTarget	253	251.25
11	26	2009	50	Sav-A-Lot	90	264.5
11	27	2009	24	Chappells Hometown Foods	56	264.5
11	27	2009	26	Market Basket	51	264.5
11	27	2009	99	Strack & Van Til	62	291
11	29	2009	30	SuperTarget	229	251.25
11	29	2009	37	Fred Meyer	79	330.75
11	31	2009	53	DeCicco Family Market	62	291
11	32	2009	30	SuperTarget	231	251.25
11	33	2009	14	FoodCity	79	291
11	35	2009	24	Chappells Hometown Foods	66	264.5
11	35	2009	30	SuperTarget	268	251.25
11	36	2009	43	United Grocery Outlet	102	264.5
11	36	2009	99	Strack & Van Til	73	291
11	37	2009	20	Walmart	351	238.25
11	37	2009	44	Foodland	102	291
11	38	2009	30	SuperTarget	241	251.25
11	39	2009	50	Sav-A-Lot	104	264.5
11	40	2009	75	Pick 'N Save	30	277.75
11	41	2009	26	Market Basket	53	264.5
11	41	2009	30	SuperTarget	263	251.25
11	42	2009	23	Western Beef	61	277.75
11	43	2009	14	FoodCity	78	291
11	43	2009	24	Chappells Hometown Foods	60	264.5
11	44	2009	30	SuperTarget	247	251.25
11	45	2009	53	DeCicco Family Market	49	291
11	45	2009	99	Strack & Van Til	61	291
11	46	2009	37	Fred Meyer	88	330.75
11	47	2009	30	SuperTarget	228	251.25
11	47	2009	43	United Grocery Outlet	104	264.5
11	49	2009	44	Foodland	103	291
11	50	2009	30	SuperTarget	234	251.25
11	51	2009	24	Chappells Hometown Foods	68	264.5
11	52	2009	20	Walmart	360	238.25
11	52	2009	50	Sav-A-Lot	98	264.5
11	12	2019	37	Fred Meyer	89	330.75
1234	2	2019	30	SuperTarget	756	192
1234	3	2019	24	Chappells Hometown Foods	77	222.25
1234	3	2019	43	United Grocery Outlet	156	222.25
1234	3	2019	102	Matherne's Supermarkets	104	222.25
1234	4	2019	17	Broulims	87	202
1234	4	2019	72	Acme Fresh Market	266	212
1234	5	2019	30	SuperTarget	747	192
1234	6	2019	19	Raley's	85	202
1234	6	2019	67	Crosby's Marketplace	283	202
1234	6	2019	70	Zup's	40	222.25
1234	7	2019	20	Walmart	1337	181.75
1234	8	2019	23	Western Beef	116	242.5
1234	8	2019	30	SuperTarget	846	192
1234	9	2019	72	Acme Fresh Market	299	212
1234	9	2019	99	Strack & Van Til	277	212
1234	9	2019	102	Matherne's Supermarkets	92	222.25
1234	10	2019	66	McCaffrey's	260	222.25
1234	11	2019	24	Chappells Hometown Foods	88	222.25
1234	11	2019	30	SuperTarget	793	192
1234	12	2019	17	Broulims	98	202
1234	12	2019	37	Fred Meyer	90	252.5
1234	12	2019	70	Zup's	41	222.25
5727	2	2019	13	Brookshire Grocery Company	2	67
5727	2	2019	30	SuperTarget	22	63.5
5727	2	2019	34	Mayfair Markets	6	77
5727	2	2019	61	Breaux Mart Supermarkets	5	67
5727	3	2019	43	United Grocery Outlet	10	80.25
5727	3	2019	53	DeCicco Family Market	5	70.25
5727	3	2019	89	Plum Market	9	67
5727	4	2019	42	Sack&Save	4	70.25
5727	5	2019	30	SuperTarget	23	63.5
5727	5	2019	34	Mayfair Markets	7	77
5727	7	2019	20	Walmart	64	60.25
5727	7	2019	27	Nam Dae Mun Farmers Market	3	70.25
5727	8	2019	30	SuperTarget	20	63.5
5727	8	2019	34	Mayfair Markets	6	77
5727	8	2019	42	Sack&Save	4	70.25
5727	8	2019	56	Hollywood Super Market	9	77
5727	9	2019	71	Remke Markets	13	67
5727	11	2019	30	SuperTarget	24	63.5
5727	11	2019	34	Mayfair Markets	6	77
5727	12	2019	42	Sack&Save	5	70.25
55	1	2019	91	Big Y Foods	55	249.75
55	2	2019	30	SuperTarget	189	189.75
55	3	2019	81	Hugo's	27	219.75
55	3	2019	89	Plum Market	25	209.75
55	4	2019	4	Giant	20	199.75
55	5	2019	30	SuperTarget	186	189.75
55	5	2019	49	FoodMaxx	11	239.75
55	5	2019	91	Big Y Foods	52	249.75
55	6	2019	87	Sav-Mor Foods	18	239.75
55	7	2019	81	Hugo's	28	219.75
55	8	2019	4	Giant	26	199.75
55	8	2019	30	SuperTarget	184	189.75
55	9	2019	91	Big Y Foods	49	249.75
55	10	2019	49	FoodMaxx	14	239.75
55	11	2019	30	SuperTarget	190	189.75
55	11	2019	81	Hugo's	28	219.75
55	12	2019	4	Giant	24	199.75
20	2	2019	13	Brookshire Grocery Company	81	178.75
20	2	2019	30	SuperTarget	1252	154.5
20	2	2019	61	Breaux Mart Supermarkets	124	162.5
20	2	2019	86	Quality Foods	291	170.75
20	3	2019	0	Weis Markets	199	162.5
20	3	2019	53	DeCicco Family Market	52	162.5
20	5	2019	1	Albertsons LLC	198	162.5
20	5	2019	30	SuperTarget	1319	154.5
20	7	2019	20	Walmart	608	146.25
20	7	2019	74	Tom Thumb Food & Pharmacy	75	162.5
20	8	2019	30	SuperTarget	1156	154.5
20	9	2019	8	SuperValu Inc.	118	178.75
20	9	2019	101	Gristedes	222	178.75
20	10	2019	0	Weis Markets	180	162.5
20	10	2019	3	Hannaford	131	162.5
20	11	2019	30	SuperTarget	1211	154.5
20	11	2019	36	D&W Food Centers	261	178.75
20	11	2019	86	Quality Foods	331	170.75
21	1	2019	15	Brown & Cole	48	267.5
21	1	2019	90	H-E-B	27	214
21	2	2019	30	SuperTarget	586	203.25
21	2	2019	34	Mayfair Markets	45	267.5
21	2	2019	61	Breaux Mart Supermarkets	32	214
21	2	2019	84	Mac's Fresh Market	57	224.75
21	3	2019	102	Matherne's Supermarkets	36	214
21	4	2019	15	Brown & Cole	47	267.5
21	5	2019	30	SuperTarget	507	203.25
21	5	2019	34	Mayfair Markets	47	267.5
21	6	2019	70	Zup's	58	256.75
21	7	2019	15	Brown & Cole	47	267.5
21	7	2019	20	Walmart	181	192.5
21	8	2019	30	SuperTarget	525	203.25
21	8	2019	34	Mayfair Markets	51	267.5
21	9	2019	102	Matherne's Supermarkets	33	214
21	10	2019	15	Brown & Cole	42	267.5
21	11	2019	30	SuperTarget	510	203.25
21	11	2019	34	Mayfair Markets	51	267.5
21	11	2019	94	H-E-B Plus	31	278.25
21	12	2019	37	Fred Meyer	120	235.5
21	12	2019	70	Zup's	57	256.75
21	12	2019	84	Mac's Fresh Market	54	224.75
22	2	2019	30	SuperTarget	138	80.25
22	3	2019	41	Arlan's Market	16	84.5
22	3	2019	81	Hugo's	47	84.5
22	4	2019	60	Super Dollar Discount Foods	12	93
22	5	2019	30	SuperTarget	128	80.25
22	5	2019	88	Lin's Fresh Market	50	88.75
22	6	2019	97	Trade Fair	24	84.5
22	7	2019	20	Walmart	243	76.25
22	7	2019	81	Hugo's	44	84.5
22	8	2019	30	SuperTarget	151	80.25
22	8	2019	41	Arlan's Market	17	84.5
22	10	2019	60	Super Dollar Discount Foods	14	93
22	11	2019	30	SuperTarget	133	80.25
22	11	2019	81	Hugo's	42	84.5
22	12	2019	12	Scolari's Food and Drug	38	110
23	1	2019	96	Key Markets	24	31.25
23	2	2019	30	SuperTarget	126	24.75
23	2	2019	32	Pueblo	43	26
23	3	2019	53	DeCicco Family Market	4	26
23	3	2019	76	Ingles Markets	32	27.25
23	4	2019	42	Sack&Save	37	29.75
23	5	2019	1	Albertsons LLC	6	32.5
23	5	2019	30	SuperTarget	134	24.75
23	7	2019	20	Walmart	105	23.25
23	8	2019	30	SuperTarget	130	24.75
23	8	2019	42	Sack&Save	32	29.75
23	8	2019	76	Ingles Markets	32	27.25
23	9	2019	8	SuperValu Inc.	35	26
23	9	2019	71	Remke Markets	39	27.25
23	10	2019	32	Pueblo	42	26
23	10	2019	57	Lunds & Byerlys	12	31.25
23	10	2019	96	Key Markets	20	31.25
23	11	2019	30	SuperTarget	122	24.75
23	12	2019	42	Sack&Save	35	29.75
4	2	2019	30	SuperTarget	70	31.75
4	4	2019	17	Broulims	11	33.5
4	5	2019	30	SuperTarget	75	31.75
4	5	2019	49	FoodMaxx	4	33.5
4	6	2019	67	Crosby's Marketplace	9	38.5
4	6	2019	70	Zup's	8	33.5
4	7	2019	20	Walmart	134	30
4	7	2019	27	Nam Dae Mun Farmers Market	5	33.5
4	8	2019	30	SuperTarget	68	31.75
4	9	2019	51	Valley Marketplace	7	33.5
4	10	2019	16	K-VA-T Food Stores	21	38.5
4	10	2019	49	FoodMaxx	4	33.5
4	11	2019	30	SuperTarget	75	31.75
4	12	2019	17	Broulims	10	33.5
4	12	2019	70	Zup's	9	33.5
24	1	2019	15	Brown & Cole	74	308.75
24	2	2019	30	SuperTarget	864	279.25
24	2	2019	35	Schnucks	135	338.25
24	3	2019	24	Chappells Hometown Foods	112	338.25
24	3	2019	41	Arlan's Market	68	308.75
24	3	2019	81	Hugo's	186	308.75
24	4	2019	15	Brown & Cole	74	308.75
24	5	2019	30	SuperTarget	848	279.25
24	7	2019	15	Brown & Cole	87	308.75
24	7	2019	20	Walmart	830	264.75
24	7	2019	74	Tom Thumb Food & Pharmacy	71	308.75
24	7	2019	81	Hugo's	211	308.75
24	8	2019	30	SuperTarget	1001	279.25
24	8	2019	41	Arlan's Market	66	308.75
24	9	2019	95	Cost Cutter	85	338.25
24	10	2019	15	Brown & Cole	86	308.75
24	11	2019	24	Chappells Hometown Foods	124	338.25
24	11	2019	30	SuperTarget	809	279.25
24	11	2019	81	Hugo's	172	308.75
24	12	2019	29	Felpausch	87	294
25	1	2019	15	Brown & Cole	33	93.25
25	2	2019	30	SuperTarget	121	80.5
25	3	2019	14	FoodCity	15	89
25	3	2019	62	Westborn Market	34	93.25
25	3	2019	76	Ingles Markets	12	84.75
25	3	2019	89	Plum Market	21	101.75
25	4	2019	15	Brown & Cole	32	93.25
25	5	2019	30	SuperTarget	130	80.5
25	6	2019	75	Pick 'N Save	12	110
25	7	2019	15	Brown & Cole	27	93.25
25	7	2019	20	Walmart	158	76.25
25	7	2019	40	Buehler's Buy-Low	17	84.75
25	8	2019	30	SuperTarget	128	80.5
25	8	2019	76	Ingles Markets	12	84.75
25	10	2019	15	Brown & Cole	30	93.25
25	11	2019	30	SuperTarget	107	80.5
26	1	2019	5	Stop & Shop	52	228.25
26	1	2019	15	Brown & Cole	32	228.25
26	2	2019	30	SuperTarget	248	216.75
26	3	2019	53	DeCicco Family Market	46	285.25
26	4	2019	15	Brown & Cole	36	228.25
26	4	2019	38	Great American Food Stores	38	228.25
26	5	2019	30	SuperTarget	256	216.75
26	5	2019	88	Lin's Fresh Market	66	239.75
26	6	2019	5	Stop & Shop	57	228.25
26	6	2019	59	Meijer	80	228.25
26	7	2019	15	Brown & Cole	34	228.25
26	7	2019	20	Walmart	227	205.5
26	7	2019	55	Piggly Wiggly	20	262.5
26	8	2019	30	SuperTarget	217	216.75
26	9	2019	45	Landis Supermarkets	96	239.75
26	10	2019	15	Brown & Cole	34	228.25
26	10	2019	57	Lunds & Byerlys	45	228.25
26	11	2019	5	Stop & Shop	52	228.25
26	11	2019	30	SuperTarget	222	216.75
26	11	2019	94	H-E-B Plus	51	239.75
26	12	2019	12	Scolari's Food and Drug	49	228.25
26	12	2019	37	Fred Meyer	55	228.25
26	12	2019	48	Miller's Fresh Foods	29	262.5
27	1	2019	91	Big Y Foods	71	33.25
27	2	2019	30	SuperTarget	214	31.5
27	3	2019	0	Weis Markets	91	34.75
27	3	2019	46	Macey's Market	22	36.5
27	4	2019	60	Super Dollar Discount Foods	23	34.75
27	5	2019	30	SuperTarget	237	31.5
27	5	2019	91	Big Y Foods	76	33.25
27	6	2019	75	Pick 'N Save	42	36.5
27	7	2019	20	Walmart	273	29.75
27	7	2019	28	Great Valu Markets	25	33.25
27	7	2019	46	Macey's Market	24	36.5
27	7	2019	100	Shaw's and Star Market	66	34.75
27	8	2019	30	SuperTarget	238	31.5
27	9	2019	45	Landis Supermarkets	65	33.25
27	9	2019	91	Big Y Foods	72	33.25
27	9	2019	99	Strack & Van Til	51	33.25
27	10	2019	0	Weis Markets	104	34.75
27	10	2019	3	Hannaford	58	36.5
27	10	2019	60	Super Dollar Discount Foods	21	34.75
27	10	2019	66	McCaffrey's	47	36.5
27	10	2019	69	Western Supermarket	21	39.75
27	10	2019	77	Woodman's Food Market	41	34.75
27	11	2019	30	SuperTarget	203	31.5
27	11	2019	46	Macey's Market	27	36.5
28	3	2019	53	DeCicco Family Market	56	97.75
28	3	2019	68	Ideal Food Basket	262	107
28	6	2019	67	Crosby's Marketplace	177	97.75
28	6	2019	97	Trade Fair	155	93
28	7	2019	20	Walmart	1819	83.75
28	8	2019	9	Shop 'n Save	160	102.25
28	8	2019	23	Western Beef	294	111.75
28	9	2019	21	Village Market Food Center	118	97.75
28	9	2019	45	Landis Supermarkets	255	93
28	10	2019	11	Sunflower Farmers Market	66	93
28	10	2019	68	Ideal Food Basket	274	107
28	10	2019	69	Western Supermarket	325	93
28	11	2019	94	H-E-B Plus	88	102.25
28	12	2019	12	Scolari's Food and Drug	267	107
28	12	2019	29	Felpausch	63	97.75
1	2	2019	30	SuperTarget	282	280.75
1	5	2019	30	SuperTarget	277	280.75
1	6	2019	59	Meijer	79	310.25
1	6	2019	75	Pick 'N Save	27	310.25
1	6	2019	87	Sav-Mor Foods	78	295.5
1	7	2019	20	Walmart	159	266
1	8	2019	30	SuperTarget	322	280.75
1	10	2019	77	Woodman's Food Market	35	325
1	11	2019	30	SuperTarget	320	280.75
2	1	2019	15	Brown & Cole	9	225
2	2	2019	30	SuperTarget	44	213.75
2	3	2019	0	Weis Markets	23	236.25
2	3	2019	24	Chappells Hometown Foods	8	270
2	3	2019	41	Arlan's Market	10	258.75
2	3	2019	62	Westborn Market	6	225
2	4	2019	15	Brown & Cole	10	225
2	4	2019	17	Broulims	2	225
2	5	2019	30	SuperTarget	42	213.75
2	6	2019	87	Sav-Mor Foods	15	225
2	6	2019	97	Trade Fair	9	225
2	7	2019	15	Brown & Cole	9	225
2	7	2019	20	Walmart	30	202.5
2	7	2019	28	Great Valu Markets	18	225
2	8	2019	23	Western Beef	10	236.25
2	8	2019	30	SuperTarget	45	213.75
2	8	2019	41	Arlan's Market	8	258.75
2	9	2019	45	Landis Supermarkets	16	236.25
2	10	2019	0	Weis Markets	25	236.25
2	10	2019	15	Brown & Cole	10	225
2	11	2019	24	Chappells Hometown Foods	8	270
2	11	2019	30	SuperTarget	46	213.75
2	11	2019	31	Compare Foods Supermarket	7	225
2	12	2019	17	Broulims	2	225
3	1	2019	5	Stop & Shop	9	123.25
3	2	2019	13	Brookshire Grocery Company	13	107.25
3	2	2019	30	SuperTarget	143	101.75
3	2	2019	58	Red Apple	16	112.5
3	2	2019	86	Quality Foods	45	107.25
3	3	2019	63	Yoke's Fresh Market	22	118
3	4	2019	47	Food Pavilion	17	112.5
3	5	2019	30	SuperTarget	171	101.75
3	5	2019	82	Vinckier Foods	39	107.25
3	6	2019	5	Stop & Shop	9	123.25
3	7	2019	20	Walmart	168	96.5
3	8	2019	30	SuperTarget	164	101.75
3	9	2019	101	Gristedes	12	107.25
3	11	2019	5	Stop & Shop	9	123.25
3	11	2019	30	SuperTarget	162	101.75
3	11	2019	86	Quality Foods	45	107.25
3	12	2019	12	Scolari's Food and Drug	11	134
3	12	2019	58	Red Apple	18	112.5
3	12	2019	82	Vinckier Foods	45	107.25
5	1	2019	91	Big Y Foods	11	312.75
5	2	2019	30	SuperTarget	63	258.5
5	2	2019	61	Breaux Mart Supermarkets	12	272
5	3	2019	33	Lauer's Supermarket and Bakery	21	272
5	3	2019	76	Ingles Markets	24	299.25
5	3	2019	81	Hugo's	13	272
5	4	2019	4	Giant	17	272
5	5	2019	30	SuperTarget	63	258.5
5	5	2019	91	Big Y Foods	11	312.75
5	7	2019	20	Walmart	91	244.75
5	7	2019	27	Nam Dae Mun Farmers Market	8	272
5	7	2019	74	Tom Thumb Food & Pharmacy	2	272
5	7	2019	81	Hugo's	12	272
5	8	2019	4	Giant	14	272
5	8	2019	23	Western Beef	15	272
5	8	2019	30	SuperTarget	55	258.5
5	8	2019	33	Lauer's Supermarket and Bakery	21	272
5	8	2019	76	Ingles Markets	24	299.25
5	9	2019	45	Landis Supermarkets	17	272
5	9	2019	91	Big Y Foods	9	312.75
5	10	2019	16	K-VA-T Food Stores	14	299.25
5	10	2019	57	Lunds & Byerlys	12	272
5	11	2019	30	SuperTarget	60	258.5
5	11	2019	81	Hugo's	12	272
5	12	2019	4	Giant	15	272
5	12	2019	48	Miller's Fresh Foods	14	272
123	2	2019	7	SpartanNash	269	279.75
123	2	2019	13	Brookshire Grocery Company	134	266.5
123	2	2019	30	SuperTarget	755	253.25
123	5	2019	30	SuperTarget	849	253.25
123	5	2019	82	Vinckier Foods	253	266.5
123	7	2019	20	Walmart	931	239.75
123	7	2019	40	Buehler's Buy-Low	88	293.25
123	7	2019	100	Shaw's and Star Market	362	266.5
123	8	2019	30	SuperTarget	856	253.25
123	11	2019	7	SpartanNash	287	279.75
123	11	2019	30	SuperTarget	808	253.25
123	12	2019	82	Vinckier Foods	257	266.5
7	1	2019	5	Stop & Shop	37	249.5
7	2	2019	30	SuperTarget	129	237
7	2	2019	32	Pueblo	77	274.5
7	3	2019	14	FoodCity	34	262
7	3	2019	81	Hugo's	35	299.5
7	5	2019	30	SuperTarget	126	237
7	6	2019	5	Stop & Shop	38	249.5
7	6	2019	97	Trade Fair	21	262
7	7	2019	20	Walmart	119	224.5
7	7	2019	27	Nam Dae Mun Farmers Market	12	249.5
7	7	2019	74	Tom Thumb Food & Pharmacy	8	249.5
7	7	2019	81	Hugo's	42	299.5
7	8	2019	30	SuperTarget	106	237
7	9	2019	51	Valley Marketplace	21	299.5
7	10	2019	16	K-VA-T Food Stores	27	299.5
7	10	2019	32	Pueblo	72	274.5
7	11	2019	5	Stop & Shop	37	249.5
7	11	2019	30	SuperTarget	113	237
7	11	2019	31	Compare Foods Supermarket	12	249.5
7	11	2019	81	Hugo's	34	299.5
7	11	2019	93	Coborns	34	249.5
8	1	2019	25	Hank's Market	9	248.25
8	2	2019	30	SuperTarget	34	214.5
8	2	2019	34	Mayfair Markets	9	225.75
8	3	2019	53	DeCicco Family Market	4	259.75
8	4	2019	47	Food Pavilion	21	259.75
8	5	2019	30	SuperTarget	40	214.5
8	5	2019	34	Mayfair Markets	8	225.75
8	7	2019	20	Walmart	79	203.25
8	8	2019	9	Shop 'n Save	34	225.75
8	8	2019	30	SuperTarget	38	214.5
8	8	2019	34	Mayfair Markets	10	225.75
8	9	2019	92	Central Market	11	248.25
8	11	2019	30	SuperTarget	34	214.5
8	11	2019	34	Mayfair Markets	10	225.75
8	12	2019	37	Fred Meyer	22	259.75
9	1	2019	44	Foodland	74	116.5
9	1	2019	90	H-E-B	48	106.75
9	1	2019	91	Big Y Foods	83	97
9	2	2019	30	SuperTarget	292	92.25
9	3	2019	89	Plum Market	25	97
9	4	2019	72	Acme Fresh Market	33	121.25
9	5	2019	30	SuperTarget	282	92.25
9	5	2019	91	Big Y Foods	97	97
9	7	2019	20	Walmart	223	87.25
9	7	2019	27	Nam Dae Mun Farmers Market	11	111.5
9	8	2019	30	SuperTarget	246	92.25
9	9	2019	51	Valley Marketplace	13	97
9	9	2019	72	Acme Fresh Market	37	121.25
9	9	2019	91	Big Y Foods	101	97
9	10	2019	16	K-VA-T Food Stores	54	111.5
9	11	2019	30	SuperTarget	284	92.25
12	2	2019	30	SuperTarget	174	50
12	2	2019	84	Mac's Fresh Market	19	60.5
12	3	2019	14	FoodCity	48	58
12	3	2019	43	United Grocery Outlet	23	58
12	3	2019	64	Big M	10	52.75
12	4	2019	4	Giant	26	60.5
12	5	2019	30	SuperTarget	164	50
12	5	2019	82	Vinckier Foods	16	58
12	7	2019	20	Walmart	74	47.5
12	7	2019	27	Nam Dae Mun Farmers Market	6	55.25
12	8	2019	4	Giant	22	60.5
12	8	2019	23	Western Beef	35	55.25
12	8	2019	30	SuperTarget	153	50
12	9	2019	64	Big M	10	52.75
12	10	2019	3	Hannaford	34	52.75
12	10	2019	16	K-VA-T Food Stores	15	65.75
12	11	2019	30	SuperTarget	169	50
12	11	2019	94	H-E-B Plus	18	55.25
12	12	2019	4	Giant	23	60.5
12	12	2019	37	Fred Meyer	19	52.75
12	12	2019	82	Vinckier Foods	17	58
12	12	2019	84	Mac's Fresh Market	22	60.5
13	2	2019	30	SuperTarget	28	216
13	5	2019	30	SuperTarget	27	216
13	5	2019	52	Beach's Market	3	261.5
13	5	2019	88	Lin's Fresh Market	21	238.75
13	7	2019	20	Walmart	50	204.75
13	8	2019	30	SuperTarget	30	216
13	9	2019	92	Central Market	11	238.75
13	10	2019	77	Woodman's Food Market	21	227.5
13	11	2019	30	SuperTarget	26	216
13	11	2019	31	Compare Foods Supermarket	11	227.5
13	12	2019	48	Miller's Fresh Foods	19	227.5
15	1	2019	15	Brown & Cole	3	94
15	1	2019	80	New Leaf Community Markets	1	103.25
15	1	2019	103	Wayne's Hometown Market	1	98.75
15	2	2019	30	SuperTarget	16	89.25
15	2	2019	84	Mac's Fresh Market	1	94
15	4	2019	15	Brown & Cole	3	94
15	4	2019	47	Food Pavilion	5	112.75
15	5	2019	30	SuperTarget	18	89.25
15	5	2019	80	New Leaf Community Markets	1	103.25
15	7	2019	15	Brown & Cole	3	94
15	8	2019	9	Shop 'n Save	1	108
15	8	2019	30	SuperTarget	18	89.25
15	9	2019	8	SuperValu Inc.	2	94
15	9	2019	80	New Leaf Community Markets	1	103.25
15	10	2019	15	Brown & Cole	3	94
15	11	2019	30	SuperTarget	20	89.25
15	12	2019	84	Mac's Fresh Market	1	94
16	1	2019	103	Wayne's Hometown Market	30	33.5
16	2	2019	7	SpartanNash	57	40
16	2	2019	30	SuperTarget	350	31.75
16	2	2019	61	Breaux Mart Supermarkets	25	33.5
16	3	2019	63	Yoke's Fresh Market	99	33.5
16	4	2019	4	Giant	40	35
16	5	2019	30	SuperTarget	336	31.75
16	6	2019	98	Sunfresh Market	16	33.5
16	7	2019	20	Walmart	483	30
16	8	2019	4	Giant	45	35
16	8	2019	23	Western Beef	75	33.5
16	8	2019	30	SuperTarget	317	31.75
16	8	2019	56	Hollywood Super Market	62	33.5
16	9	2019	21	Village Market Food Center	15	38.5
16	11	2019	7	SpartanNash	61	40
16	11	2019	30	SuperTarget	338	31.75
16	11	2019	93	Coborns	46	33.5
16	12	2019	4	Giant	42	35
17	1	2019	5	Stop & Shop	173	282.5
17	1	2019	44	Foodland	88	247
17	1	2019	91	Big Y Foods	402	247
17	2	2019	30	SuperTarget	462	223.5
17	2	2019	86	Quality Foods	246	258.75
17	3	2019	63	Yoke's Fresh Market	278	282.5
17	5	2019	30	SuperTarget	379	223.5
17	5	2019	91	Big Y Foods	370	247
17	6	2019	5	Stop & Shop	162	282.5
17	6	2019	87	Sav-Mor Foods	299	282.5
17	7	2019	20	Walmart	1725	211.75
17	7	2019	55	Piggly Wiggly	46	235.25
17	8	2019	30	SuperTarget	445	223.5
17	9	2019	8	SuperValu Inc.	242	282.5
17	9	2019	91	Big Y Foods	354	247
17	10	2019	3	Hannaford	121	235.25
17	11	2019	5	Stop & Shop	162	282.5
17	11	2019	30	SuperTarget	383	223.5
17	11	2019	86	Quality Foods	236	258.75
17	12	2019	37	Fred Meyer	454	247
18	2	2019	30	SuperTarget	129	215.5
18	3	2019	24	Chappells Hometown Foods	6	226.75
18	3	2019	41	Arlan's Market	7	238.25
18	3	2019	63	Yoke's Fresh Market	9	249.5
18	3	2019	76	Ingles Markets	13	261
18	4	2019	72	Acme Fresh Market	17	261
18	5	2019	30	SuperTarget	124	215.5
18	6	2019	59	Meijer	19	238.25
18	7	2019	20	Walmart	106	204.25
18	8	2019	30	SuperTarget	109	215.5
18	8	2019	41	Arlan's Market	7	238.25
18	8	2019	76	Ingles Markets	12	261
18	9	2019	72	Acme Fresh Market	19	261
18	10	2019	11	Sunflower Farmers Market	6	249.5
18	10	2019	66	McCaffrey's	11	272.25
18	11	2019	24	Chappells Hometown Foods	6	226.75
18	11	2019	30	SuperTarget	109	215.5
18	12	2019	29	Felpausch	5	226.75
14	1	2019	5	Stop & Shop	45	268.25
14	2	2019	30	SuperTarget	336	254.75
14	4	2019	39	Fareway	128	268.25
14	5	2019	30	SuperTarget	308	254.75
14	6	2019	5	Stop & Shop	48	268.25
14	6	2019	67	Crosby's Marketplace	84	268.25
14	6	2019	75	Pick 'N Save	42	281.75
14	7	2019	20	Walmart	197	241.5
14	7	2019	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2019	30	SuperTarget	346	254.75
14	9	2019	21	Village Market Food Center	21	362.25
14	9	2019	92	Central Market	44	268.25
14	11	2019	5	Stop & Shop	52	268.25
14	11	2019	30	SuperTarget	346	254.75
14	12	2019	12	Scolari's Food and Drug	55	281.75
12113456	2	2019	30	SuperTarget	133	136
12113456	2	2019	84	Mac's Fresh Market	34	143.25
12113456	3	2019	33	Lauer's Supermarket and Bakery	31	157.5
12113456	4	2019	17	Broulims	27	164.75
12113456	5	2019	30	SuperTarget	131	136
12113456	7	2019	20	Walmart	355	128.75
12113456	7	2019	27	Nam Dae Mun Farmers Market	28	157.5
12113456	7	2019	40	Buehler's Buy-Low	32	143.25
12113456	8	2019	30	SuperTarget	120	136
12113456	8	2019	33	Lauer's Supermarket and Bakery	28	157.5
12113456	9	2019	95	Cost Cutter	60	143.25
12113456	10	2019	77	Woodman's Food Market	17	164.75
12113456	11	2019	30	SuperTarget	133	136
12113456	11	2019	31	Compare Foods Supermarket	29	143.25
12113456	12	2019	17	Broulims	28	164.75
12113456	12	2019	84	Mac's Fresh Market	35	143.25
12113457	1	2019	15	Brown & Cole	282	111.25
12113457	1	2019	91	Big Y Foods	422	105.75
12113457	2	2019	13	Brookshire Grocery Company	179	105.75
12113457	2	2019	30	SuperTarget	1323	100.5
12113457	2	2019	58	Red Apple	369	105.75
12113457	3	2019	33	Lauer's Supermarket and Bakery	401	105.75
12113457	4	2019	15	Brown & Cole	285	111.25
12113457	5	2019	30	SuperTarget	1485	100.5
12113457	5	2019	91	Big Y Foods	527	105.75
12113457	6	2019	70	Zup's	61	111.25
12113457	6	2019	98	Sunfresh Market	54	111.25
12113457	7	2019	15	Brown & Cole	257	111.25
12113457	7	2019	20	Walmart	891	95.25
12113457	7	2019	27	Nam Dae Mun Farmers Market	135	105.75
12113457	8	2019	30	SuperTarget	1509	100.5
12113457	8	2019	33	Lauer's Supermarket and Bakery	442	105.75
12113457	9	2019	91	Big Y Foods	438	105.75
12113457	10	2019	15	Brown & Cole	272	111.25
12113457	11	2019	30	SuperTarget	1293	100.5
12113457	12	2019	58	Red Apple	407	105.75
12113457	12	2019	70	Zup's	67	111.25
12113458	1	2019	103	Wayne's Hometown Market	93	65.5
12113458	2	2019	30	SuperTarget	373	56.5
12113458	2	2019	61	Breaux Mart Supermarkets	241	65.5
12113458	2	2019	84	Mac's Fresh Market	449	62.5
12113458	3	2019	41	Arlan's Market	117	62.5
12113458	3	2019	53	DeCicco Family Market	160	65.5
12113458	3	2019	64	Big M	100	68.5
12113458	3	2019	76	Ingles Markets	343	74.5
12113458	3	2019	102	Matherne's Supermarkets	165	59.5
12113458	5	2019	30	SuperTarget	359	56.5
12113458	6	2019	75	Pick 'N Save	138	59.5
12113458	6	2019	87	Sav-Mor Foods	240	77.5
12113458	7	2019	20	Walmart	593	53.5
12113458	8	2019	30	SuperTarget	422	56.5
12113458	8	2019	41	Arlan's Market	112	62.5
12113458	8	2019	56	Hollywood Super Market	131	62.5
12113458	8	2019	76	Ingles Markets	355	74.5
12113458	9	2019	64	Big M	99	68.5
12113458	9	2019	71	Remke Markets	416	59.5
12113458	9	2019	102	Matherne's Supermarkets	186	59.5
12113458	10	2019	16	K-VA-T Food Stores	268	65.5
12113458	11	2019	30	SuperTarget	372	56.5
12113458	12	2019	84	Mac's Fresh Market	407	62.5
12311459	2	2019	30	SuperTarget	13	199.25
12311459	2	2019	32	Pueblo	3	209.75
12311459	2	2019	34	Mayfair Markets	1	209.75
12311459	2	2019	85	ShopRite	3	209.75
12311459	3	2019	41	Arlan's Market	1	209.75
12311459	3	2019	76	Ingles Markets	4	230.75
12311459	4	2019	4	Giant	6	241.25
12311459	4	2019	42	Sack&Save	2	209.75
12311459	5	2019	30	SuperTarget	12	199.25
12311459	5	2019	34	Mayfair Markets	1	209.75
12311459	6	2019	87	Sav-Mor Foods	2	230.75
12311459	7	2019	20	Walmart	26	188.75
12311459	8	2019	4	Giant	6	241.25
12311459	8	2019	30	SuperTarget	13	199.25
12311459	8	2019	34	Mayfair Markets	2	209.75
12311459	8	2019	41	Arlan's Market	1	209.75
12311459	8	2019	42	Sack&Save	3	209.75
12311459	8	2019	76	Ingles Markets	3	230.75
12311459	10	2019	32	Pueblo	3	209.75
12311459	11	2019	30	SuperTarget	14	199.25
12311459	11	2019	34	Mayfair Markets	1	209.75
12311459	12	2019	4	Giant	6	241.25
12311459	12	2019	42	Sack&Save	3	209.75
12311459	12	2019	48	Miller's Fresh Foods	5	230.75
12113460	1	2019	25	Hank's Market	18	40.75
12113460	2	2019	30	SuperTarget	309	36.75
12113460	4	2019	60	Super Dollar Discount Foods	13	42.75
12113460	5	2019	30	SuperTarget	369	36.75
12113460	5	2019	78	Dahl's Foods	38	38.75
12113460	6	2019	97	Trade Fair	14	42.75
12113460	7	2019	20	Walmart	103	35
12113460	7	2019	74	Tom Thumb Food & Pharmacy	41	44.5
12113460	7	2019	100	Shaw's and Star Market	58	48.5
12113460	8	2019	30	SuperTarget	361	36.75
12113460	9	2019	92	Central Market	61	46.5
12113460	9	2019	99	Strack & Van Til	75	38.75
12113460	9	2019	101	Gristedes	66	40.75
12113460	10	2019	60	Super Dollar Discount Foods	14	42.75
12113460	11	2019	30	SuperTarget	311	36.75
12113460	12	2019	29	Felpausch	30	38.75
12113460	12	2019	48	Miller's Fresh Foods	59	44.5
12311461	1	2019	15	Brown & Cole	19	174.5
12311461	2	2019	30	SuperTarget	211	165.75
12311461	4	2019	15	Brown & Cole	20	174.5
12311461	5	2019	30	SuperTarget	192	165.75
12311461	5	2019	49	FoodMaxx	22	200.5
12311461	7	2019	15	Brown & Cole	18	174.5
12311461	7	2019	20	Walmart	173	157
12311461	7	2019	27	Nam Dae Mun Farmers Market	19	218
12311461	8	2019	30	SuperTarget	178	165.75
12311461	10	2019	11	Sunflower Farmers Market	8	192
12311461	10	2019	15	Brown & Cole	18	174.5
12311461	10	2019	49	FoodMaxx	20	200.5
12311461	11	2019	30	SuperTarget	185	165.75
7911918	1	2019	91	Big Y Foods	294	340
7911918	2	2019	30	SuperTarget	978	269.25
7911918	2	2019	61	Breaux Mart Supermarkets	143	326
7911918	3	2019	63	Yoke's Fresh Market	233	283.25
7911918	4	2019	60	Super Dollar Discount Foods	74	368.5
7911918	5	2019	30	SuperTarget	849	269.25
7911918	5	2019	91	Big Y Foods	255	340
7911918	6	2019	59	Meijer	250	311.75
7911918	7	2019	20	Walmart	1088	255
7911918	7	2019	100	Shaw's and Star Market	219	340
7911918	8	2019	30	SuperTarget	1015	269.25
7911918	9	2019	21	Village Market Food Center	67	311.75
7911918	9	2019	91	Big Y Foods	279	340
7911918	10	2019	60	Super Dollar Discount Foods	77	368.5
7911918	11	2019	30	SuperTarget	855	269.25
7991138	1	2019	44	Foodland	177	162.75
7991138	2	2019	30	SuperTarget	1087	154.5
7991138	2	2019	61	Breaux Mart Supermarkets	126	162.75
7991138	2	2019	84	Mac's Fresh Market	145	162.75
7991138	2	2019	85	ShopRite	62	195.25
7991138	2	2019	86	Quality Foods	194	170.75
7991138	3	2019	0	Weis Markets	169	162.75
7991138	4	2019	17	Broulims	66	162.75
7991138	5	2019	30	SuperTarget	970	154.5
7991138	6	2019	19	Raley's	153	195.25
7991138	7	2019	20	Walmart	1070	146.5
7991138	7	2019	28	Great Valu Markets	122	162.75
7991138	7	2019	40	Buehler's Buy-Low	30	162.75
7991138	8	2019	30	SuperTarget	1049	154.5
7991138	8	2019	56	Hollywood Super Market	159	195.25
7991138	9	2019	21	Village Market Food Center	61	179
7991138	10	2019	0	Weis Markets	176	162.75
7991138	10	2019	11	Sunflower Farmers Market	117	170.75
7991138	10	2019	66	McCaffrey's	81	162.75
7991138	11	2019	30	SuperTarget	991	154.5
7991138	11	2019	86	Quality Foods	216	170.75
7991138	11	2019	94	H-E-B Plus	153	187.25
7991138	12	2019	17	Broulims	62	162.75
7991138	12	2019	84	Mac's Fresh Market	149	162.75
12311466	1	2019	80	New Leaf Community Markets	30	139.25
12311466	2	2019	13	Brookshire Grocery Company	11	132.5
12311466	2	2019	30	SuperTarget	92	126
12311466	3	2019	64	Big M	13	132.5
12311466	5	2019	30	SuperTarget	110	126
12311466	5	2019	49	FoodMaxx	32	132.5
12311466	5	2019	80	New Leaf Community Markets	28	139.25
12311466	6	2019	70	Zup's	6	146
12311466	6	2019	98	Sunfresh Market	22	139.25
12311466	7	2019	20	Walmart	111	119.25
12311466	7	2019	27	Nam Dae Mun Farmers Market	19	139.25
12311466	8	2019	30	SuperTarget	107	126
12311466	9	2019	64	Big M	11	132.5
12311466	9	2019	80	New Leaf Community Markets	24	139.25
12311466	10	2019	49	FoodMaxx	34	132.5
12311466	11	2019	30	SuperTarget	95	126
12311466	11	2019	31	Compare Foods Supermarket	18	146
12311466	11	2019	93	Coborns	34	146
12311466	12	2019	37	Fred Meyer	51	139.25
12311466	12	2019	70	Zup's	6	146
78111	1	2019	25	Hank's Market	8	109
78111	1	2019	91	Big Y Foods	31	109
78111	2	2019	30	SuperTarget	132	103.5
78111	2	2019	61	Breaux Mart Supermarkets	7	109
78111	3	2019	89	Plum Market	13	119.75
78111	5	2019	30	SuperTarget	127	103.5
78111	5	2019	91	Big Y Foods	29	109
78111	6	2019	87	Sav-Mor Foods	23	109
78111	7	2019	20	Walmart	80	98
78111	8	2019	30	SuperTarget	132	103.5
78111	9	2019	8	SuperValu Inc.	9	130.75
78111	9	2019	91	Big Y Foods	28	109
78111	11	2019	30	SuperTarget	146	103.5
78111	11	2019	31	Compare Foods Supermarket	9	125.25
24222	2	2019	34	Mayfair Markets	8	83
24222	3	2019	14	FoodCity	13	75.75
24222	3	2019	43	United Grocery Outlet	7	90.25
24222	4	2019	72	Acme Fresh Market	8	72.25
24222	5	2019	34	Mayfair Markets	7	83
24222	5	2019	49	FoodMaxx	3	72.25
24222	7	2019	20	Walmart	56	65
24222	7	2019	40	Buehler's Buy-Low	7	72.25
24222	8	2019	34	Mayfair Markets	7	83
24222	9	2019	72	Acme Fresh Market	9	72.25
24222	10	2019	49	FoodMaxx	3	72.25
24222	10	2019	66	McCaffrey's	11	79.5
24222	11	2019	34	Mayfair Markets	7	83
19	1	2019	5	Stop & Shop	26	277.75
19	1	2019	90	H-E-B	93	291.75
19	2	2019	30	SuperTarget	474	264
19	2	2019	32	Pueblo	50	277.75
19	4	2019	38	Great American Food Stores	133	291.75
19	5	2019	30	SuperTarget	460	264
19	6	2019	5	Stop & Shop	24	277.75
19	6	2019	70	Zup's	15	319.5
19	7	2019	20	Walmart	261	250
19	8	2019	9	Shop 'n Save	125	277.75
19	8	2019	30	SuperTarget	405	264
19	10	2019	32	Pueblo	52	277.75
19	11	2019	5	Stop & Shop	24	277.75
19	11	2019	30	SuperTarget	502	264
19	11	2019	31	Compare Foods Supermarket	34	305.5
19	12	2019	70	Zup's	14	319.5
1060444292	1	2019	25	Hank's Market	11	72.75
1060444292	1	2019	91	Big Y Foods	13	76.5
1060444292	2	2019	30	SuperTarget	152	69.25
1060444292	3	2019	24	Chappells Hometown Foods	15	80
1060444292	4	2019	42	Sack&Save	43	72.75
1060444292	5	2019	1	Albertsons LLC	5	80
1060444292	5	2019	30	SuperTarget	163	69.25
1060444292	5	2019	91	Big Y Foods	13	76.5
1060444292	6	2019	70	Zup's	7	94.75
1060444292	7	2019	20	Walmart	202	65.5
1060444292	7	2019	40	Buehler's Buy-Low	7	76.5
1060444292	7	2019	55	Piggly Wiggly	19	80
1060444292	8	2019	30	SuperTarget	143	69.25
1060444292	8	2019	42	Sack&Save	39	72.75
1060444292	9	2019	91	Big Y Foods	13	76.5
1060444292	11	2019	24	Chappells Hometown Foods	16	80
1060444292	11	2019	30	SuperTarget	143	69.25
1060444292	12	2019	42	Sack&Save	45	72.75
1060444292	12	2019	70	Zup's	7	94.75
394595120	1	2019	44	Foodland	15	272.5
394595120	1	2019	80	New Leaf Community Markets	33	313.5
394595120	2	2019	30	SuperTarget	66	259
394595120	2	2019	84	Mac's Fresh Market	19	272.5
394595120	4	2019	17	Broulims	16	272.5
394595120	5	2019	30	SuperTarget	74	259
394595120	5	2019	80	New Leaf Community Markets	34	313.5
394595120	5	2019	82	Vinckier Foods	58	272.5
394595120	6	2019	59	Meijer	39	286.25
394595120	7	2019	20	Walmart	105	245.25
394595120	7	2019	27	Nam Dae Mun Farmers Market	22	299.75
394595120	7	2019	73	Homeland	10	272.5
394595120	8	2019	30	SuperTarget	68	259
394595120	9	2019	80	New Leaf Community Markets	34	313.5
394595120	10	2019	16	K-VA-T Food Stores	44	272.5
394595120	10	2019	66	McCaffrey's	41	286.25
394595120	11	2019	30	SuperTarget	66	259
394595120	12	2019	17	Broulims	17	272.5
394595120	12	2019	29	Felpausch	18	272.5
394595120	12	2019	82	Vinckier Foods	67	272.5
394595120	12	2019	84	Mac's Fresh Market	21	272.5
2096452488	1	2019	15	Brown & Cole	10	111.25
2096452488	2	2019	30	SuperTarget	107	105.75
2096452488	3	2019	41	Arlan's Market	3	116.75
2096452488	4	2019	15	Brown & Cole	10	111.25
2096452488	4	2019	72	Acme Fresh Market	19	133.5
2096452488	5	2019	30	SuperTarget	106	105.75
2096452488	6	2019	97	Trade Fair	2	122.5
2096452488	7	2019	15	Brown & Cole	10	111.25
2096452488	7	2019	20	Walmart	42	100
2096452488	8	2019	30	SuperTarget	105	105.75
2096452488	8	2019	41	Arlan's Market	4	116.75
2096452488	9	2019	72	Acme Fresh Market	15	133.5
2096452488	10	2019	3	Hannaford	12	128
2096452488	10	2019	15	Brown & Cole	8	111.25
2096452488	11	2019	30	SuperTarget	92	105.75
2096452488	11	2019	31	Compare Foods Supermarket	6	111.25
1819152447	1	2019	44	Foodland	13	96.75
1819152447	2	2019	30	SuperTarget	77	79.75
1819152447	5	2019	30	SuperTarget	94	79.75
1819152447	6	2019	67	Crosby's Marketplace	24	92.5
1819152447	6	2019	97	Trade Fair	9	92.5
1819152447	7	2019	20	Walmart	62	75.75
1819152447	7	2019	27	Nam Dae Mun Farmers Market	12	88.25
1819152447	8	2019	30	SuperTarget	90	79.75
1819152447	10	2019	66	McCaffrey's	12	88.25
1819152447	11	2019	30	SuperTarget	85	79.75
205971101	1	2019	5	Stop & Shop	6	134.75
205971101	1	2019	90	H-E-B	10	103.5
205971101	1	2019	103	Wayne's Hometown Market	12	103.5
205971101	2	2019	30	SuperTarget	41	98.5
205971101	2	2019	84	Mac's Fresh Market	16	103.5
205971101	3	2019	62	Westborn Market	13	129.5
205971101	3	2019	64	Big M	2	119.25
205971101	3	2019	102	Matherne's Supermarkets	10	114
205971101	4	2019	60	Super Dollar Discount Foods	4	108.75
205971101	5	2019	30	SuperTarget	40	98.5
205971101	5	2019	88	Lin's Fresh Market	4	129.5
205971101	6	2019	5	Stop & Shop	6	134.75
205971101	7	2019	20	Walmart	69	93.25
205971101	7	2019	55	Piggly Wiggly	11	114
205971101	7	2019	100	Shaw's and Star Market	8	114
205971101	8	2019	30	SuperTarget	42	98.5
205971101	9	2019	51	Valley Marketplace	3	108.75
205971101	9	2019	64	Big M	2	119.25
205971101	9	2019	99	Strack & Van Til	5	114
205971101	9	2019	102	Matherne's Supermarkets	11	114
205971101	10	2019	60	Super Dollar Discount Foods	4	108.75
205971101	11	2019	5	Stop & Shop	7	134.75
205971101	11	2019	30	SuperTarget	43	98.5
205971101	11	2019	93	Coborns	7	103.5
205971101	12	2019	84	Mac's Fresh Market	17	103.5
799895359	2	2019	30	SuperTarget	170	141
799895359	2	2019	34	Mayfair Markets	23	170.5
799895359	2	2019	35	Schnucks	41	155.75
799895359	3	2019	43	United Grocery Outlet	88	155.75
799895359	4	2019	72	Acme Fresh Market	69	155.75
799895359	5	2019	30	SuperTarget	152	141
799895359	5	2019	34	Mayfair Markets	26	170.5
799895359	6	2019	98	Sunfresh Market	28	155.75
799895359	7	2019	28	Great Valu Markets	53	155.75
799895359	8	2019	30	SuperTarget	176	141
799895359	8	2019	34	Mayfair Markets	23	170.5
799895359	9	2019	72	Acme Fresh Market	64	155.75
799895359	9	2019	99	Strack & Van Til	71	185.5
799895359	10	2019	3	Hannaford	31	148.25
799895359	10	2019	77	Woodman's Food Market	45	148.25
799895359	11	2019	30	SuperTarget	145	141
799895359	11	2019	34	Mayfair Markets	22	170.5
1234	2	2018	30	SuperTarget	725	192
1234	3	2018	24	Chappells Hometown Foods	71	222.25
1234	3	2018	43	United Grocery Outlet	159	222.25
1234	3	2018	102	Matherne's Supermarkets	98	222.25
1234	4	2018	17	Broulims	95	202
1234	4	2018	72	Acme Fresh Market	296	212
1234	5	2018	30	SuperTarget	792	192
1234	6	2018	19	Raley's	79	202
1234	6	2018	67	Crosby's Marketplace	294	202
1234	6	2018	70	Zup's	42	222.25
1234	7	2018	20	Walmart	1268	181.75
1234	8	2018	23	Western Beef	99	242.5
1234	8	2018	30	SuperTarget	922	192
1234	9	2018	72	Acme Fresh Market	301	212
1234	9	2018	99	Strack & Van Til	246	212
1234	9	2018	102	Matherne's Supermarkets	103	222.25
1234	10	2018	66	McCaffrey's	212	222.25
1234	11	2018	24	Chappells Hometown Foods	80	222.25
1234	11	2018	30	SuperTarget	813	192
1234	12	2018	17	Broulims	86	202
1234	12	2018	37	Fred Meyer	99	252.5
1234	12	2018	70	Zup's	38	222.25
1234	13	2018	19	Raley's	90	202
1234	14	2018	18	Super Saver	281	232.25
1234	14	2018	30	SuperTarget	929	192
1234	14	2018	43	United Grocery Outlet	180	222.25
1234	14	2018	72	Acme Fresh Market	284	212
1234	15	2018	102	Matherne's Supermarkets	105	222.25
1234	17	2018	30	SuperTarget	969	192
1234	17	2018	67	Crosby's Marketplace	287	202
1234	18	2018	70	Zup's	43	222.25
1234	18	2018	99	Strack & Van Til	245	212
1234	19	2018	24	Chappells Hometown Foods	77	222.25
1234	19	2018	72	Acme Fresh Market	285	212
1234	20	2018	17	Broulims	88	202
1234	20	2018	19	Raley's	82	202
1234	20	2018	30	SuperTarget	967	192
1234	21	2018	102	Matherne's Supermarkets	109	222.25
1234	22	2018	20	Walmart	1317	181.75
1234	23	2018	30	SuperTarget	912	192
1234	24	2018	66	McCaffrey's	244	222.25
1234	24	2018	70	Zup's	48	222.25
1234	24	2018	72	Acme Fresh Market	262	212
1234	25	2018	23	Western Beef	125	242.5
1234	25	2018	43	United Grocery Outlet	191	222.25
1234	26	2018	30	SuperTarget	937	192
1234	27	2018	19	Raley's	83	202
1234	27	2018	24	Chappells Hometown Foods	80	222.25
1234	27	2018	99	Strack & Van Til	225	212
1234	27	2018	102	Matherne's Supermarkets	98	222.25
1234	28	2018	17	Broulims	92	202
1234	28	2018	67	Crosby's Marketplace	254	202
1234	29	2018	18	Super Saver	249	232.25
1234	29	2018	30	SuperTarget	838	192
1234	29	2018	37	Fred Meyer	113	252.5
1234	29	2018	72	Acme Fresh Market	255	212
1234	30	2018	70	Zup's	42	222.25
1234	32	2018	30	SuperTarget	840	192
1234	33	2018	102	Matherne's Supermarkets	100	222.25
1234	34	2018	19	Raley's	81	202
1234	34	2018	72	Acme Fresh Market	286	212
1234	35	2018	24	Chappells Hometown Foods	68	222.25
1234	35	2018	30	SuperTarget	881	192
1234	36	2018	17	Broulims	94	202
1234	36	2018	43	United Grocery Outlet	180	222.25
1234	36	2018	70	Zup's	48	222.25
1234	36	2018	99	Strack & Van Til	250	212
1234	37	2018	20	Walmart	1346	181.75
1234	38	2018	30	SuperTarget	832	192
1234	38	2018	66	McCaffrey's	225	222.25
1234	39	2018	67	Crosby's Marketplace	233	202
1234	39	2018	72	Acme Fresh Market	269	212
1234	39	2018	102	Matherne's Supermarkets	111	222.25
1234	41	2018	19	Raley's	85	202
1234	41	2018	30	SuperTarget	846	192
1234	42	2018	23	Western Beef	113	242.5
1234	42	2018	70	Zup's	52	222.25
1234	43	2018	24	Chappells Hometown Foods	79	222.25
1234	44	2018	17	Broulims	83	202
1234	44	2018	18	Super Saver	267	232.25
1234	44	2018	30	SuperTarget	783	192
1234	44	2018	72	Acme Fresh Market	297	212
1234	45	2018	99	Strack & Van Til	275	212
1234	45	2018	102	Matherne's Supermarkets	102	222.25
1234	46	2018	37	Fred Meyer	84	252.5
1234	47	2018	30	SuperTarget	662	192
1234	47	2018	43	United Grocery Outlet	188	222.25
1234	48	2018	19	Raley's	76	202
1234	48	2018	70	Zup's	44	222.25
1234	49	2018	72	Acme Fresh Market	287	212
1234	50	2018	30	SuperTarget	680	192
1234	50	2018	67	Crosby's Marketplace	252	202
1234	51	2018	24	Chappells Hometown Foods	70	222.25
1234	51	2018	102	Matherne's Supermarkets	106	222.25
1234	52	2018	17	Broulims	91	202
1234	52	2018	20	Walmart	1245	181.75
1234	52	2018	66	McCaffrey's	227	222.25
5727	2	2018	13	Brookshire Grocery Company	2	67
5727	2	2018	30	SuperTarget	23	63.5
5727	2	2018	34	Mayfair Markets	6	77
5727	2	2018	61	Breaux Mart Supermarkets	5	67
5727	3	2018	43	United Grocery Outlet	11	80.25
5727	3	2018	53	DeCicco Family Market	5	70.25
5727	3	2018	89	Plum Market	10	67
5727	4	2018	42	Sack&Save	4	70.25
5727	5	2018	30	SuperTarget	21	63.5
5727	5	2018	34	Mayfair Markets	6	77
5727	7	2018	20	Walmart	65	60.25
5727	7	2018	27	Nam Dae Mun Farmers Market	3	70.25
5727	8	2018	30	SuperTarget	19	63.5
5727	8	2018	34	Mayfair Markets	6	77
5727	8	2018	42	Sack&Save	4	70.25
5727	8	2018	56	Hollywood Super Market	8	77
5727	9	2018	71	Remke Markets	12	67
5727	11	2018	30	SuperTarget	23	63.5
5727	11	2018	34	Mayfair Markets	6	77
5727	12	2018	42	Sack&Save	5	70.25
5727	14	2018	18	Super Saver	12	67
5727	14	2018	30	SuperTarget	21	63.5
5727	14	2018	34	Mayfair Markets	7	77
5727	14	2018	43	United Grocery Outlet	11	80.25
5727	16	2018	13	Brookshire Grocery Company	2	67
5727	16	2018	42	Sack&Save	4	70.25
5727	16	2018	56	Hollywood Super Market	9	77
5727	17	2018	30	SuperTarget	23	63.5
5727	17	2018	34	Mayfair Markets	7	77
5727	17	2018	53	DeCicco Family Market	4	70.25
5727	20	2018	30	SuperTarget	20	63.5
5727	20	2018	34	Mayfair Markets	6	77
5727	20	2018	42	Sack&Save	4	70.25
5727	20	2018	61	Breaux Mart Supermarkets	5	67
5727	21	2018	27	Nam Dae Mun Farmers Market	3	70.25
5727	21	2018	89	Plum Market	10	67
5727	22	2018	20	Walmart	59	60.25
5727	23	2018	30	SuperTarget	21	63.5
5727	23	2018	34	Mayfair Markets	7	77
5727	24	2018	42	Sack&Save	4	70.25
5727	24	2018	56	Hollywood Super Market	8	77
5727	25	2018	43	United Grocery Outlet	11	80.25
5727	26	2018	30	SuperTarget	19	63.5
5727	26	2018	34	Mayfair Markets	7	77
5727	28	2018	42	Sack&Save	4	70.25
5727	28	2018	71	Remke Markets	13	67
5727	29	2018	18	Super Saver	12	67
5727	29	2018	30	SuperTarget	24	63.5
5727	29	2018	34	Mayfair Markets	8	77
5727	30	2018	13	Brookshire Grocery Company	2	67
5727	31	2018	53	DeCicco Family Market	5	70.25
5727	32	2018	30	SuperTarget	21	63.5
5727	32	2018	34	Mayfair Markets	7	77
5727	32	2018	42	Sack&Save	4	70.25
5727	32	2018	56	Hollywood Super Market	10	77
5727	35	2018	27	Nam Dae Mun Farmers Market	3	70.25
5727	35	2018	30	SuperTarget	23	63.5
5727	35	2018	34	Mayfair Markets	8	77
5727	36	2018	42	Sack&Save	4	70.25
5727	36	2018	43	United Grocery Outlet	13	80.25
5727	37	2018	20	Walmart	71	60.25
5727	38	2018	30	SuperTarget	23	63.5
5727	38	2018	34	Mayfair Markets	8	77
5727	38	2018	61	Breaux Mart Supermarkets	5	67
5727	39	2018	89	Plum Market	10	67
5727	40	2018	42	Sack&Save	4	70.25
5727	40	2018	56	Hollywood Super Market	9	77
5727	41	2018	30	SuperTarget	22	63.5
5727	41	2018	34	Mayfair Markets	7	77
5727	44	2018	13	Brookshire Grocery Company	3	67
5727	44	2018	18	Super Saver	12	67
5727	44	2018	30	SuperTarget	23	63.5
5727	44	2018	34	Mayfair Markets	8	77
5727	44	2018	42	Sack&Save	4	70.25
5727	45	2018	53	DeCicco Family Market	5	70.25
5727	47	2018	30	SuperTarget	22	63.5
5727	47	2018	34	Mayfair Markets	6	77
5727	47	2018	43	United Grocery Outlet	11	80.25
5727	47	2018	71	Remke Markets	12	67
5727	48	2018	42	Sack&Save	4	70.25
5727	48	2018	56	Hollywood Super Market	10	77
5727	49	2018	27	Nam Dae Mun Farmers Market	3	70.25
5727	50	2018	30	SuperTarget	22	63.5
5727	50	2018	34	Mayfair Markets	7	77
5727	52	2018	20	Walmart	57	60.25
5727	52	2018	42	Sack&Save	4	70.25
55	1	2018	91	Big Y Foods	50	249.75
55	2	2018	30	SuperTarget	185	189.75
55	3	2018	81	Hugo's	32	219.75
55	3	2018	89	Plum Market	28	209.75
55	4	2018	4	Giant	22	199.75
55	5	2018	30	SuperTarget	207	189.75
55	5	2018	49	FoodMaxx	13	239.75
55	5	2018	91	Big Y Foods	52	249.75
55	6	2018	87	Sav-Mor Foods	19	239.75
55	7	2018	81	Hugo's	32	219.75
55	8	2018	4	Giant	21	199.75
55	8	2018	30	SuperTarget	199	189.75
55	9	2018	91	Big Y Foods	57	249.75
55	10	2018	49	FoodMaxx	14	239.75
55	11	2018	30	SuperTarget	186	189.75
55	11	2018	81	Hugo's	30	219.75
55	12	2018	4	Giant	25	199.75
55	13	2018	91	Big Y Foods	53	249.75
55	14	2018	30	SuperTarget	190	189.75
55	15	2018	49	FoodMaxx	14	239.75
55	15	2018	81	Hugo's	32	219.75
55	16	2018	4	Giant	25	199.75
55	17	2018	30	SuperTarget	213	189.75
55	17	2018	87	Sav-Mor Foods	18	239.75
55	17	2018	91	Big Y Foods	50	249.75
55	19	2018	81	Hugo's	29	219.75
55	20	2018	4	Giant	23	199.75
55	20	2018	30	SuperTarget	195	189.75
55	20	2018	49	FoodMaxx	14	239.75
55	21	2018	89	Plum Market	30	209.75
55	21	2018	91	Big Y Foods	50	249.75
55	23	2018	30	SuperTarget	192	189.75
55	23	2018	81	Hugo's	31	219.75
55	24	2018	4	Giant	25	199.75
55	25	2018	49	FoodMaxx	15	239.75
55	25	2018	91	Big Y Foods	51	249.75
55	26	2018	30	SuperTarget	217	189.75
55	27	2018	81	Hugo's	30	219.75
55	28	2018	4	Giant	23	199.75
55	28	2018	87	Sav-Mor Foods	16	239.75
55	29	2018	30	SuperTarget	196	189.75
55	29	2018	91	Big Y Foods	55	249.75
55	30	2018	49	FoodMaxx	15	239.75
55	31	2018	81	Hugo's	35	219.75
55	32	2018	4	Giant	25	199.75
55	32	2018	30	SuperTarget	205	189.75
55	33	2018	91	Big Y Foods	45	249.75
55	35	2018	30	SuperTarget	203	189.75
55	35	2018	49	FoodMaxx	14	239.75
55	35	2018	81	Hugo's	32	219.75
55	36	2018	4	Giant	24	199.75
55	37	2018	91	Big Y Foods	53	249.75
55	38	2018	30	SuperTarget	188	189.75
55	39	2018	81	Hugo's	34	219.75
55	39	2018	87	Sav-Mor Foods	19	239.75
55	39	2018	89	Plum Market	31	209.75
55	40	2018	4	Giant	21	199.75
55	40	2018	49	FoodMaxx	13	239.75
55	41	2018	30	SuperTarget	210	189.75
55	41	2018	91	Big Y Foods	47	249.75
55	43	2018	81	Hugo's	32	219.75
55	44	2018	4	Giant	25	199.75
55	44	2018	30	SuperTarget	199	189.75
55	45	2018	49	FoodMaxx	15	239.75
55	45	2018	91	Big Y Foods	55	249.75
55	47	2018	30	SuperTarget	208	189.75
55	47	2018	81	Hugo's	29	219.75
55	48	2018	4	Giant	25	199.75
55	49	2018	91	Big Y Foods	44	249.75
55	50	2018	30	SuperTarget	199	189.75
55	50	2018	49	FoodMaxx	13	239.75
55	50	2018	87	Sav-Mor Foods	18	239.75
55	51	2018	81	Hugo's	31	219.75
55	52	2018	4	Giant	22	199.75
20	2	2018	13	Brookshire Grocery Company	76	178.75
20	2	2018	30	SuperTarget	1187	154.5
20	2	2018	61	Breaux Mart Supermarkets	119	162.5
20	2	2018	86	Quality Foods	311	170.75
20	3	2018	0	Weis Markets	191	162.5
20	3	2018	53	DeCicco Family Market	53	162.5
20	5	2018	1	Albertsons LLC	179	162.5
20	5	2018	30	SuperTarget	1310	154.5
20	7	2018	20	Walmart	545	146.25
20	7	2018	74	Tom Thumb Food & Pharmacy	92	162.5
20	8	2018	30	SuperTarget	1282	154.5
20	9	2018	8	SuperValu Inc.	119	178.75
20	9	2018	101	Gristedes	251	178.75
20	10	2018	0	Weis Markets	180	162.5
20	10	2018	3	Hannaford	139	162.5
20	11	2018	30	SuperTarget	1182	154.5
20	11	2018	36	D&W Food Centers	254	178.75
20	11	2018	86	Quality Foods	348	170.75
20	13	2018	1	Albertsons LLC	180	162.5
20	14	2018	30	SuperTarget	1206	154.5
20	14	2018	74	Tom Thumb Food & Pharmacy	94	162.5
20	16	2018	13	Brookshire Grocery Company	76	178.75
20	16	2018	83	BI-LO	107	170.75
20	17	2018	0	Weis Markets	185	162.5
20	17	2018	30	SuperTarget	1180	154.5
20	17	2018	53	DeCicco Family Market	58	162.5
20	19	2018	8	SuperValu Inc.	124	178.75
20	19	2018	101	Gristedes	231	178.75
20	20	2018	30	SuperTarget	1163	154.5
20	20	2018	61	Breaux Mart Supermarkets	124	162.5
20	20	2018	86	Quality Foods	411	170.75
20	21	2018	1	Albertsons LLC	199	162.5
20	21	2018	3	Hannaford	144	162.5
20	21	2018	74	Tom Thumb Food & Pharmacy	80	162.5
20	22	2018	20	Walmart	634	146.25
20	22	2018	36	D&W Food Centers	234	178.75
20	23	2018	30	SuperTarget	1332	154.5
20	24	2018	0	Weis Markets	191	162.5
20	26	2018	30	SuperTarget	1221	154.5
20	28	2018	74	Tom Thumb Food & Pharmacy	98	162.5
20	29	2018	1	Albertsons LLC	209	162.5
20	29	2018	8	SuperValu Inc.	124	178.75
20	29	2018	30	SuperTarget	1337	154.5
20	29	2018	86	Quality Foods	342	170.75
20	29	2018	101	Gristedes	266	178.75
20	30	2018	13	Brookshire Grocery Company	90	178.75
20	31	2018	0	Weis Markets	187	162.5
20	31	2018	53	DeCicco Family Market	52	162.5
20	32	2018	3	Hannaford	145	162.5
20	32	2018	30	SuperTarget	1322	154.5
20	32	2018	83	BI-LO	100	170.75
20	33	2018	36	D&W Food Centers	264	178.75
20	35	2018	30	SuperTarget	1443	154.5
20	35	2018	74	Tom Thumb Food & Pharmacy	96	162.5
20	37	2018	1	Albertsons LLC	188	162.5
20	37	2018	20	Walmart	603	146.25
20	38	2018	0	Weis Markets	201	162.5
20	38	2018	30	SuperTarget	1320	154.5
20	38	2018	61	Breaux Mart Supermarkets	139	162.5
20	38	2018	86	Quality Foods	365	170.75
20	39	2018	8	SuperValu Inc.	129	178.75
20	39	2018	101	Gristedes	277	178.75
20	41	2018	30	SuperTarget	1275	154.5
20	42	2018	74	Tom Thumb Food & Pharmacy	87	162.5
20	43	2018	3	Hannaford	131	162.5
20	44	2018	13	Brookshire Grocery Company	83	178.75
20	44	2018	30	SuperTarget	1373	154.5
20	44	2018	36	D&W Food Centers	208	178.75
20	45	2018	0	Weis Markets	223	162.5
20	45	2018	1	Albertsons LLC	152	162.5
20	45	2018	53	DeCicco Family Market	59	162.5
20	47	2018	30	SuperTarget	1274	154.5
20	47	2018	86	Quality Foods	339	170.75
20	48	2018	83	BI-LO	123	170.75
20	49	2018	8	SuperValu Inc.	136	178.75
20	49	2018	74	Tom Thumb Food & Pharmacy	85	162.5
20	49	2018	101	Gristedes	262	178.75
20	50	2018	30	SuperTarget	1313	154.5
20	52	2018	0	Weis Markets	202	162.5
20	52	2018	20	Walmart	613	146.25
21	1	2018	15	Brown & Cole	46	267.5
21	1	2018	90	H-E-B	24	214
21	2	2018	30	SuperTarget	560	203.25
21	2	2018	34	Mayfair Markets	45	267.5
21	2	2018	61	Breaux Mart Supermarkets	30	214
21	2	2018	84	Mac's Fresh Market	56	224.75
21	3	2018	102	Matherne's Supermarkets	35	214
21	4	2018	15	Brown & Cole	51	267.5
21	5	2018	30	SuperTarget	506	203.25
21	5	2018	34	Mayfair Markets	48	267.5
21	6	2018	70	Zup's	60	256.75
21	7	2018	15	Brown & Cole	46	267.5
21	7	2018	20	Walmart	156	192.5
21	8	2018	30	SuperTarget	479	203.25
21	8	2018	34	Mayfair Markets	51	267.5
21	9	2018	102	Matherne's Supermarkets	32	214
21	10	2018	15	Brown & Cole	49	267.5
21	11	2018	30	SuperTarget	572	203.25
21	11	2018	34	Mayfair Markets	46	267.5
21	11	2018	94	H-E-B Plus	38	278.25
21	12	2018	37	Fred Meyer	135	235.5
21	12	2018	70	Zup's	55	256.75
21	12	2018	84	Mac's Fresh Market	51	224.75
21	13	2018	15	Brown & Cole	43	267.5
21	13	2018	90	H-E-B	26	214
21	14	2018	18	Super Saver	126	214
21	14	2018	30	SuperTarget	558	203.25
21	14	2018	34	Mayfair Markets	54	267.5
21	15	2018	102	Matherne's Supermarkets	33	214
21	16	2018	15	Brown & Cole	44	267.5
21	17	2018	30	SuperTarget	482	203.25
21	17	2018	34	Mayfair Markets	45	267.5
21	18	2018	70	Zup's	62	256.75
21	19	2018	15	Brown & Cole	44	267.5
21	20	2018	30	SuperTarget	499	203.25
21	20	2018	34	Mayfair Markets	50	267.5
21	20	2018	61	Breaux Mart Supermarkets	35	214
21	21	2018	102	Matherne's Supermarkets	34	214
21	22	2018	15	Brown & Cole	53	267.5
21	22	2018	20	Walmart	192	192.5
21	22	2018	84	Mac's Fresh Market	52	224.75
21	23	2018	30	SuperTarget	495	203.25
21	23	2018	34	Mayfair Markets	54	267.5
21	24	2018	70	Zup's	53	256.75
21	25	2018	15	Brown & Cole	54	267.5
21	25	2018	90	H-E-B	28	214
21	26	2018	30	SuperTarget	417	203.25
21	26	2018	34	Mayfair Markets	57	267.5
21	26	2018	94	H-E-B Plus	42	278.25
21	27	2018	102	Matherne's Supermarkets	28	214
21	28	2018	15	Brown & Cole	54	267.5
21	29	2018	18	Super Saver	105	214
21	29	2018	30	SuperTarget	409	203.25
21	29	2018	34	Mayfair Markets	49	267.5
21	29	2018	37	Fred Meyer	105	235.5
21	30	2018	70	Zup's	57	256.75
21	31	2018	15	Brown & Cole	52	267.5
21	32	2018	30	SuperTarget	412	203.25
21	32	2018	34	Mayfair Markets	53	267.5
21	32	2018	84	Mac's Fresh Market	48	224.75
21	33	2018	102	Matherne's Supermarkets	28	214
21	34	2018	15	Brown & Cole	46	267.5
21	35	2018	30	SuperTarget	424	203.25
21	35	2018	34	Mayfair Markets	53	267.5
21	36	2018	70	Zup's	58	256.75
21	37	2018	15	Brown & Cole	47	267.5
21	37	2018	20	Walmart	162	192.5
21	37	2018	90	H-E-B	25	214
21	38	2018	30	SuperTarget	510	203.25
21	38	2018	34	Mayfair Markets	57	267.5
21	38	2018	61	Breaux Mart Supermarkets	30	214
21	39	2018	102	Matherne's Supermarkets	30	214
21	40	2018	15	Brown & Cole	42	267.5
21	41	2018	30	SuperTarget	470	203.25
21	41	2018	34	Mayfair Markets	59	267.5
21	41	2018	94	H-E-B Plus	34	278.25
21	42	2018	70	Zup's	52	256.75
21	42	2018	84	Mac's Fresh Market	54	224.75
21	43	2018	15	Brown & Cole	43	267.5
21	44	2018	18	Super Saver	127	214
21	44	2018	30	SuperTarget	492	203.25
21	44	2018	34	Mayfair Markets	54	267.5
21	45	2018	102	Matherne's Supermarkets	31	214
21	46	2018	15	Brown & Cole	46	267.5
21	46	2018	37	Fred Meyer	107	235.5
21	47	2018	30	SuperTarget	524	203.25
21	47	2018	34	Mayfair Markets	47	267.5
21	48	2018	70	Zup's	60	256.75
21	49	2018	15	Brown & Cole	50	267.5
21	49	2018	90	H-E-B	26	214
21	50	2018	30	SuperTarget	476	203.25
21	50	2018	34	Mayfair Markets	52	267.5
21	51	2018	102	Matherne's Supermarkets	32	214
21	52	2018	15	Brown & Cole	45	267.5
21	52	2018	20	Walmart	158	192.5
21	52	2018	84	Mac's Fresh Market	54	224.75
22	2	2018	30	SuperTarget	153	80.25
22	3	2018	41	Arlan's Market	15	84.5
22	3	2018	81	Hugo's	44	84.5
22	4	2018	60	Super Dollar Discount Foods	13	93
22	5	2018	30	SuperTarget	128	80.25
22	5	2018	88	Lin's Fresh Market	51	88.75
22	6	2018	97	Trade Fair	24	84.5
22	7	2018	20	Walmart	223	76.25
22	7	2018	81	Hugo's	40	84.5
22	8	2018	30	SuperTarget	143	80.25
22	8	2018	41	Arlan's Market	15	84.5
22	10	2018	60	Super Dollar Discount Foods	12	93
22	11	2018	30	SuperTarget	140	80.25
22	11	2018	81	Hugo's	48	84.5
22	12	2018	12	Scolari's Food and Drug	32	110
22	13	2018	41	Arlan's Market	16	84.5
22	13	2018	50	Sav-A-Lot	24	88.75
22	13	2018	88	Lin's Fresh Market	54	88.75
22	14	2018	30	SuperTarget	130	80.25
22	15	2018	6	Kroger	9	84.5
22	15	2018	79	Harding's Friendly Markets	18	84.5
22	15	2018	81	Hugo's	46	84.5
22	16	2018	60	Super Dollar Discount Foods	13	93
22	17	2018	30	SuperTarget	141	80.25
22	18	2018	41	Arlan's Market	15	84.5
22	19	2018	81	Hugo's	45	84.5
22	19	2018	97	Trade Fair	25	84.5
22	20	2018	30	SuperTarget	131	80.25
22	21	2018	88	Lin's Fresh Market	54	88.75
22	22	2018	20	Walmart	264	76.25
22	22	2018	60	Super Dollar Discount Foods	13	93
22	23	2018	30	SuperTarget	124	80.25
22	23	2018	41	Arlan's Market	14	84.5
22	23	2018	81	Hugo's	48	84.5
22	26	2018	30	SuperTarget	125	80.25
22	26	2018	50	Sav-A-Lot	19	88.75
22	27	2018	81	Hugo's	48	84.5
22	28	2018	12	Scolari's Food and Drug	37	110
22	28	2018	41	Arlan's Market	16	84.5
22	28	2018	60	Super Dollar Discount Foods	13	93
22	29	2018	30	SuperTarget	148	80.25
22	29	2018	88	Lin's Fresh Market	46	88.75
22	31	2018	6	Kroger	9	84.5
22	31	2018	79	Harding's Friendly Markets	17	84.5
22	31	2018	81	Hugo's	40	84.5
22	32	2018	30	SuperTarget	122	80.25
22	32	2018	97	Trade Fair	29	84.5
22	33	2018	41	Arlan's Market	15	84.5
22	34	2018	60	Super Dollar Discount Foods	13	93
22	35	2018	30	SuperTarget	135	80.25
22	35	2018	81	Hugo's	46	84.5
22	37	2018	20	Walmart	241	76.25
22	37	2018	88	Lin's Fresh Market	48	88.75
22	38	2018	30	SuperTarget	143	80.25
22	38	2018	41	Arlan's Market	14	84.5
22	39	2018	50	Sav-A-Lot	18	88.75
22	39	2018	81	Hugo's	43	84.5
22	40	2018	60	Super Dollar Discount Foods	14	93
22	41	2018	30	SuperTarget	128	80.25
22	43	2018	41	Arlan's Market	12	84.5
22	43	2018	81	Hugo's	38	84.5
22	44	2018	12	Scolari's Food and Drug	38	110
22	44	2018	30	SuperTarget	140	80.25
22	45	2018	88	Lin's Fresh Market	47	88.75
22	45	2018	97	Trade Fair	30	84.5
22	46	2018	60	Super Dollar Discount Foods	14	93
22	47	2018	6	Kroger	10	84.5
22	47	2018	30	SuperTarget	148	80.25
22	47	2018	79	Harding's Friendly Markets	20	84.5
22	47	2018	81	Hugo's	36	84.5
22	48	2018	41	Arlan's Market	15	84.5
22	50	2018	30	SuperTarget	135	80.25
22	51	2018	81	Hugo's	40	84.5
22	52	2018	20	Walmart	226	76.25
22	52	2018	50	Sav-A-Lot	21	88.75
22	52	2018	60	Super Dollar Discount Foods	12	93
23	1	2018	96	Key Markets	21	31.25
23	2	2018	30	SuperTarget	123	24.75
23	2	2018	32	Pueblo	36	26
23	3	2018	53	DeCicco Family Market	4	26
23	3	2018	76	Ingles Markets	36	27.25
23	4	2018	42	Sack&Save	32	29.75
23	5	2018	1	Albertsons LLC	6	32.5
23	5	2018	30	SuperTarget	113	24.75
23	7	2018	20	Walmart	105	23.25
23	8	2018	30	SuperTarget	125	24.75
23	8	2018	42	Sack&Save	39	29.75
23	8	2018	76	Ingles Markets	34	27.25
23	9	2018	8	SuperValu Inc.	30	26
23	9	2018	71	Remke Markets	45	27.25
23	10	2018	32	Pueblo	42	26
23	10	2018	57	Lunds & Byerlys	14	31.25
23	10	2018	96	Key Markets	21	31.25
23	11	2018	30	SuperTarget	106	24.75
23	12	2018	42	Sack&Save	34	29.75
23	13	2018	1	Albertsons LLC	6	32.5
23	13	2018	76	Ingles Markets	34	27.25
23	14	2018	30	SuperTarget	124	24.75
23	16	2018	42	Sack&Save	41	29.75
23	17	2018	30	SuperTarget	105	24.75
23	17	2018	53	DeCicco Family Market	5	26
23	18	2018	32	Pueblo	41	26
23	18	2018	65	The Fresh Grocer	18	27.25
23	18	2018	76	Ingles Markets	38	27.25
23	19	2018	8	SuperValu Inc.	28	26
23	19	2018	96	Key Markets	22	31.25
23	20	2018	30	SuperTarget	104	24.75
23	20	2018	42	Sack&Save	38	29.75
23	21	2018	1	Albertsons LLC	6	32.5
23	22	2018	20	Walmart	130	23.25
23	23	2018	30	SuperTarget	124	24.75
23	23	2018	76	Ingles Markets	37	27.25
23	24	2018	42	Sack&Save	35	29.75
23	26	2018	30	SuperTarget	115	24.75
23	26	2018	32	Pueblo	41	26
23	28	2018	42	Sack&Save	39	29.75
23	28	2018	71	Remke Markets	52	27.25
23	28	2018	76	Ingles Markets	34	27.25
23	28	2018	96	Key Markets	22	31.25
23	29	2018	1	Albertsons LLC	5	32.5
23	29	2018	8	SuperValu Inc.	28	26
23	29	2018	30	SuperTarget	123	24.75
23	29	2018	57	Lunds & Byerlys	14	31.25
23	31	2018	53	DeCicco Family Market	4	26
23	32	2018	30	SuperTarget	122	24.75
23	32	2018	42	Sack&Save	39	29.75
23	33	2018	76	Ingles Markets	31	27.25
23	34	2018	32	Pueblo	43	26
23	35	2018	30	SuperTarget	130	24.75
23	36	2018	42	Sack&Save	37	29.75
23	37	2018	1	Albertsons LLC	5	32.5
23	37	2018	20	Walmart	128	23.25
23	37	2018	65	The Fresh Grocer	18	27.25
23	37	2018	96	Key Markets	22	31.25
23	38	2018	30	SuperTarget	131	24.75
23	38	2018	76	Ingles Markets	37	27.25
23	39	2018	8	SuperValu Inc.	30	26
23	40	2018	42	Sack&Save	40	29.75
23	41	2018	30	SuperTarget	131	24.75
23	42	2018	32	Pueblo	42	26
23	43	2018	76	Ingles Markets	30	27.25
23	44	2018	30	SuperTarget	131	24.75
23	44	2018	42	Sack&Save	42	29.75
23	45	2018	1	Albertsons LLC	6	32.5
23	45	2018	53	DeCicco Family Market	5	26
23	46	2018	96	Key Markets	23	31.25
23	47	2018	30	SuperTarget	135	24.75
23	47	2018	71	Remke Markets	49	27.25
23	48	2018	42	Sack&Save	35	29.75
23	48	2018	57	Lunds & Byerlys	12	31.25
23	48	2018	76	Ingles Markets	32	27.25
23	49	2018	8	SuperValu Inc.	36	26
23	50	2018	30	SuperTarget	133	24.75
23	50	2018	32	Pueblo	42	26
23	52	2018	20	Walmart	110	23.25
23	52	2018	42	Sack&Save	37	29.75
4	2	2018	30	SuperTarget	66	31.75
4	4	2018	17	Broulims	11	33.5
4	5	2018	30	SuperTarget	74	31.75
4	5	2018	49	FoodMaxx	4	33.5
4	6	2018	67	Crosby's Marketplace	10	38.5
4	6	2018	70	Zup's	9	33.5
4	7	2018	20	Walmart	132	30
4	7	2018	27	Nam Dae Mun Farmers Market	6	33.5
4	8	2018	30	SuperTarget	73	31.75
4	9	2018	51	Valley Marketplace	7	33.5
4	10	2018	16	K-VA-T Food Stores	22	38.5
4	10	2018	49	FoodMaxx	4	33.5
4	11	2018	30	SuperTarget	64	31.75
4	12	2018	17	Broulims	12	33.5
4	12	2018	70	Zup's	9	33.5
4	14	2018	30	SuperTarget	75	31.75
4	15	2018	49	FoodMaxx	4	33.5
4	17	2018	30	SuperTarget	63	31.75
4	17	2018	67	Crosby's Marketplace	10	38.5
4	18	2018	70	Zup's	8	33.5
4	20	2018	17	Broulims	11	33.5
4	20	2018	30	SuperTarget	63	31.75
4	20	2018	49	FoodMaxx	4	33.5
4	21	2018	27	Nam Dae Mun Farmers Market	6	33.5
4	22	2018	20	Walmart	124	30
4	22	2018	51	Valley Marketplace	6	33.5
4	23	2018	16	K-VA-T Food Stores	21	38.5
4	23	2018	30	SuperTarget	74	31.75
4	24	2018	70	Zup's	9	33.5
4	25	2018	49	FoodMaxx	5	33.5
4	26	2018	30	SuperTarget	78	31.75
4	28	2018	17	Broulims	12	33.5
4	28	2018	67	Crosby's Marketplace	12	38.5
4	29	2018	30	SuperTarget	79	31.75
4	30	2018	49	FoodMaxx	5	33.5
4	30	2018	70	Zup's	7	33.5
4	32	2018	30	SuperTarget	65	31.75
4	35	2018	27	Nam Dae Mun Farmers Market	5	33.5
4	35	2018	30	SuperTarget	78	31.75
4	35	2018	49	FoodMaxx	5	33.5
4	35	2018	51	Valley Marketplace	7	33.5
4	36	2018	16	K-VA-T Food Stores	21	38.5
4	36	2018	17	Broulims	11	33.5
4	36	2018	70	Zup's	7	33.5
4	37	2018	20	Walmart	136	30
4	38	2018	30	SuperTarget	75	31.75
4	39	2018	67	Crosby's Marketplace	12	38.5
4	40	2018	49	FoodMaxx	5	33.5
4	41	2018	30	SuperTarget	65	31.75
4	42	2018	70	Zup's	7	33.5
4	44	2018	17	Broulims	12	33.5
4	44	2018	30	SuperTarget	80	31.75
4	45	2018	49	FoodMaxx	4	33.5
4	47	2018	30	SuperTarget	77	31.75
4	48	2018	51	Valley Marketplace	6	33.5
4	48	2018	70	Zup's	9	33.5
4	49	2018	16	K-VA-T Food Stores	21	38.5
4	49	2018	27	Nam Dae Mun Farmers Market	6	33.5
4	50	2018	30	SuperTarget	64	31.75
4	50	2018	49	FoodMaxx	5	33.5
4	50	2018	67	Crosby's Marketplace	9	38.5
4	52	2018	17	Broulims	12	33.5
4	52	2018	20	Walmart	134	30
24	1	2018	15	Brown & Cole	76	308.75
24	2	2018	30	SuperTarget	939	279.25
24	2	2018	35	Schnucks	134	338.25
24	3	2018	24	Chappells Hometown Foods	124	338.25
24	3	2018	41	Arlan's Market	80	308.75
24	3	2018	81	Hugo's	206	308.75
24	4	2018	15	Brown & Cole	86	308.75
24	5	2018	30	SuperTarget	975	279.25
24	7	2018	15	Brown & Cole	80	308.75
24	7	2018	20	Walmart	833	264.75
24	7	2018	74	Tom Thumb Food & Pharmacy	75	308.75
24	7	2018	81	Hugo's	200	308.75
24	8	2018	30	SuperTarget	873	279.25
24	8	2018	41	Arlan's Market	73	308.75
24	9	2018	95	Cost Cutter	74	338.25
24	10	2018	15	Brown & Cole	85	308.75
24	11	2018	24	Chappells Hometown Foods	125	338.25
24	11	2018	30	SuperTarget	797	279.25
24	11	2018	81	Hugo's	204	308.75
24	12	2018	29	Felpausch	99	294
24	13	2018	15	Brown & Cole	71	308.75
24	13	2018	41	Arlan's Market	76	308.75
24	14	2018	22	Food Town	111	308.75
24	14	2018	30	SuperTarget	949	279.25
24	14	2018	74	Tom Thumb Food & Pharmacy	75	308.75
24	15	2018	81	Hugo's	180	308.75
24	16	2018	15	Brown & Cole	79	308.75
24	17	2018	30	SuperTarget	819	279.25
24	17	2018	35	Schnucks	135	338.25
24	18	2018	41	Arlan's Market	76	308.75
24	19	2018	15	Brown & Cole	73	308.75
24	19	2018	24	Chappells Hometown Foods	132	338.25
24	19	2018	81	Hugo's	217	308.75
24	20	2018	30	SuperTarget	847	279.25
24	20	2018	95	Cost Cutter	73	338.25
24	21	2018	74	Tom Thumb Food & Pharmacy	74	308.75
24	22	2018	15	Brown & Cole	71	308.75
24	22	2018	20	Walmart	798	264.75
24	23	2018	30	SuperTarget	907	279.25
24	23	2018	41	Arlan's Market	67	308.75
24	23	2018	81	Hugo's	208	308.75
24	25	2018	15	Brown & Cole	80	308.75
24	26	2018	30	SuperTarget	933	279.25
24	27	2018	24	Chappells Hometown Foods	141	338.25
24	27	2018	81	Hugo's	194	308.75
24	28	2018	15	Brown & Cole	84	308.75
24	28	2018	41	Arlan's Market	75	308.75
24	28	2018	74	Tom Thumb Food & Pharmacy	69	308.75
24	29	2018	22	Food Town	127	308.75
24	29	2018	30	SuperTarget	908	279.25
24	30	2018	29	Felpausch	87	294
24	31	2018	15	Brown & Cole	78	308.75
24	31	2018	81	Hugo's	201	308.75
24	31	2018	95	Cost Cutter	68	338.25
24	32	2018	30	SuperTarget	979	279.25
24	32	2018	35	Schnucks	142	338.25
24	33	2018	41	Arlan's Market	72	308.75
24	34	2018	15	Brown & Cole	87	308.75
24	35	2018	24	Chappells Hometown Foods	136	338.25
24	35	2018	30	SuperTarget	1036	279.25
24	35	2018	74	Tom Thumb Food & Pharmacy	70	308.75
24	35	2018	81	Hugo's	203	308.75
24	37	2018	15	Brown & Cole	70	308.75
24	37	2018	20	Walmart	819	264.75
24	38	2018	30	SuperTarget	937	279.25
24	38	2018	41	Arlan's Market	78	308.75
24	39	2018	81	Hugo's	185	308.75
24	40	2018	15	Brown & Cole	86	308.75
24	41	2018	30	SuperTarget	1128	279.25
24	42	2018	74	Tom Thumb Food & Pharmacy	62	308.75
24	42	2018	95	Cost Cutter	83	338.25
24	43	2018	15	Brown & Cole	76	308.75
24	43	2018	24	Chappells Hometown Foods	124	338.25
24	43	2018	41	Arlan's Market	75	308.75
24	43	2018	81	Hugo's	197	308.75
24	44	2018	22	Food Town	137	308.75
24	44	2018	30	SuperTarget	1093	279.25
24	46	2018	15	Brown & Cole	81	308.75
24	47	2018	30	SuperTarget	982	279.25
24	47	2018	35	Schnucks	142	338.25
24	47	2018	81	Hugo's	227	308.75
24	48	2018	29	Felpausch	92	294
24	48	2018	41	Arlan's Market	73	308.75
24	49	2018	15	Brown & Cole	84	308.75
24	49	2018	74	Tom Thumb Food & Pharmacy	74	308.75
24	50	2018	30	SuperTarget	892	279.25
24	51	2018	24	Chappells Hometown Foods	113	338.25
24	51	2018	81	Hugo's	189	308.75
24	52	2018	15	Brown & Cole	83	308.75
24	52	2018	20	Walmart	881	264.75
25	1	2018	15	Brown & Cole	27	93.25
25	2	2018	30	SuperTarget	127	80.5
25	3	2018	14	FoodCity	15	89
25	3	2018	62	Westborn Market	34	93.25
25	3	2018	76	Ingles Markets	13	84.75
25	3	2018	89	Plum Market	21	101.75
25	4	2018	15	Brown & Cole	33	93.25
25	5	2018	30	SuperTarget	122	80.5
25	6	2018	75	Pick 'N Save	12	110
25	7	2018	15	Brown & Cole	30	93.25
25	7	2018	20	Walmart	153	76.25
25	7	2018	40	Buehler's Buy-Low	17	84.75
25	8	2018	30	SuperTarget	128	80.5
25	8	2018	76	Ingles Markets	11	84.75
25	10	2018	15	Brown & Cole	30	93.25
25	11	2018	30	SuperTarget	118	80.5
25	13	2018	14	FoodCity	14	89
25	13	2018	15	Brown & Cole	33	93.25
25	13	2018	50	Sav-A-Lot	19	84.75
25	13	2018	76	Ingles Markets	11	84.75
25	14	2018	30	SuperTarget	127	80.5
25	14	2018	62	Westborn Market	34	93.25
25	16	2018	15	Brown & Cole	30	93.25
25	16	2018	83	BI-LO	24	84.75
25	17	2018	30	SuperTarget	115	80.5
25	17	2018	40	Buehler's Buy-Low	18	84.75
25	18	2018	76	Ingles Markets	11	84.75
25	19	2018	15	Brown & Cole	31	93.25
25	20	2018	30	SuperTarget	105	80.5
25	21	2018	89	Plum Market	20	101.75
25	22	2018	15	Brown & Cole	29	93.25
25	22	2018	20	Walmart	165	76.25
25	23	2018	14	FoodCity	14	89
25	23	2018	30	SuperTarget	116	80.5
25	23	2018	75	Pick 'N Save	11	110
25	23	2018	76	Ingles Markets	11	84.75
25	25	2018	15	Brown & Cole	27	93.25
25	25	2018	62	Westborn Market	30	93.25
25	26	2018	30	SuperTarget	107	80.5
25	26	2018	50	Sav-A-Lot	19	84.75
25	27	2018	40	Buehler's Buy-Low	17	84.75
25	28	2018	15	Brown & Cole	28	93.25
25	28	2018	76	Ingles Markets	12	84.75
25	29	2018	30	SuperTarget	101	80.5
25	31	2018	15	Brown & Cole	30	93.25
25	32	2018	30	SuperTarget	113	80.5
25	32	2018	83	BI-LO	25	84.75
25	33	2018	14	FoodCity	15	89
25	33	2018	76	Ingles Markets	11	84.75
25	34	2018	15	Brown & Cole	29	93.25
25	35	2018	30	SuperTarget	119	80.5
25	36	2018	62	Westborn Market	35	93.25
25	37	2018	15	Brown & Cole	26	93.25
25	37	2018	20	Walmart	151	76.25
25	37	2018	40	Buehler's Buy-Low	16	84.75
25	38	2018	30	SuperTarget	101	80.5
25	38	2018	76	Ingles Markets	11	84.75
25	39	2018	50	Sav-A-Lot	19	84.75
25	39	2018	89	Plum Market	21	101.75
25	40	2018	15	Brown & Cole	28	93.25
25	40	2018	75	Pick 'N Save	13	110
25	41	2018	30	SuperTarget	101	80.5
25	43	2018	14	FoodCity	15	89
25	43	2018	15	Brown & Cole	30	93.25
25	43	2018	76	Ingles Markets	11	84.75
25	44	2018	30	SuperTarget	103	80.5
25	46	2018	15	Brown & Cole	30	93.25
25	47	2018	30	SuperTarget	103	80.5
25	47	2018	40	Buehler's Buy-Low	16	84.75
25	47	2018	62	Westborn Market	31	93.25
25	48	2018	76	Ingles Markets	11	84.75
25	48	2018	83	BI-LO	26	84.75
25	49	2018	15	Brown & Cole	29	93.25
25	50	2018	30	SuperTarget	111	80.5
25	52	2018	15	Brown & Cole	27	93.25
25	52	2018	20	Walmart	152	76.25
25	52	2018	50	Sav-A-Lot	18	84.75
26	1	2018	5	Stop & Shop	52	228.25
26	1	2018	15	Brown & Cole	35	228.25
26	2	2018	30	SuperTarget	249	216.75
26	3	2018	53	DeCicco Family Market	40	285.25
26	4	2018	15	Brown & Cole	35	228.25
26	4	2018	38	Great American Food Stores	32	228.25
26	5	2018	30	SuperTarget	264	216.75
26	5	2018	88	Lin's Fresh Market	57	239.75
26	6	2018	5	Stop & Shop	59	228.25
26	6	2018	59	Meijer	75	228.25
26	7	2018	15	Brown & Cole	36	228.25
26	7	2018	20	Walmart	187	205.5
26	7	2018	55	Piggly Wiggly	19	262.5
26	8	2018	30	SuperTarget	264	216.75
26	9	2018	45	Landis Supermarkets	105	239.75
26	10	2018	15	Brown & Cole	35	228.25
26	10	2018	57	Lunds & Byerlys	43	228.25
26	11	2018	5	Stop & Shop	58	228.25
26	11	2018	30	SuperTarget	258	216.75
26	11	2018	94	H-E-B Plus	51	239.75
26	12	2018	12	Scolari's Food and Drug	49	228.25
26	12	2018	37	Fred Meyer	58	228.25
26	12	2018	48	Miller's Fresh Foods	33	262.5
26	13	2018	15	Brown & Cole	32	228.25
26	13	2018	88	Lin's Fresh Market	64	239.75
26	14	2018	30	SuperTarget	206	216.75
26	15	2018	38	Great American Food Stores	32	228.25
26	15	2018	55	Piggly Wiggly	18	262.5
26	16	2018	2	Food Lion	38	228.25
26	16	2018	5	Stop & Shop	57	228.25
26	16	2018	15	Brown & Cole	38	228.25
26	17	2018	30	SuperTarget	207	216.75
26	17	2018	53	DeCicco Family Market	38	285.25
26	18	2018	65	The Fresh Grocer	66	239.75
26	19	2018	15	Brown & Cole	33	228.25
26	20	2018	30	SuperTarget	207	216.75
26	20	2018	59	Meijer	73	228.25
26	21	2018	5	Stop & Shop	52	228.25
26	21	2018	88	Lin's Fresh Market	63	239.75
26	22	2018	15	Brown & Cole	34	228.25
26	22	2018	20	Walmart	200	205.5
26	23	2018	30	SuperTarget	239	216.75
26	23	2018	55	Piggly Wiggly	21	262.5
26	25	2018	15	Brown & Cole	36	228.25
26	26	2018	5	Stop & Shop	59	228.25
26	26	2018	30	SuperTarget	219	216.75
26	26	2018	38	Great American Food Stores	37	228.25
26	26	2018	94	H-E-B Plus	45	239.75
26	28	2018	12	Scolari's Food and Drug	50	228.25
26	28	2018	15	Brown & Cole	34	228.25
26	28	2018	45	Landis Supermarkets	107	239.75
26	29	2018	30	SuperTarget	201	216.75
26	29	2018	37	Fred Meyer	58	228.25
26	29	2018	48	Miller's Fresh Foods	34	262.5
26	29	2018	57	Lunds & Byerlys	35	228.25
26	29	2018	88	Lin's Fresh Market	64	239.75
26	31	2018	5	Stop & Shop	54	228.25
26	31	2018	15	Brown & Cole	33	228.25
26	31	2018	53	DeCicco Family Market	44	285.25
26	31	2018	55	Piggly Wiggly	20	262.5
26	32	2018	30	SuperTarget	247	216.75
26	33	2018	2	Food Lion	42	228.25
26	34	2018	15	Brown & Cole	34	228.25
26	34	2018	59	Meijer	64	228.25
26	35	2018	30	SuperTarget	260	216.75
26	36	2018	5	Stop & Shop	60	228.25
26	37	2018	15	Brown & Cole	34	228.25
26	37	2018	20	Walmart	213	205.5
26	37	2018	38	Great American Food Stores	34	228.25
26	37	2018	65	The Fresh Grocer	53	239.75
26	37	2018	88	Lin's Fresh Market	64	239.75
26	38	2018	30	SuperTarget	256	216.75
26	39	2018	55	Piggly Wiggly	18	262.5
26	40	2018	15	Brown & Cole	38	228.25
26	41	2018	5	Stop & Shop	56	228.25
26	41	2018	30	SuperTarget	267	216.75
26	41	2018	94	H-E-B Plus	48	239.75
26	43	2018	15	Brown & Cole	34	228.25
26	44	2018	12	Scolari's Food and Drug	43	228.25
26	44	2018	30	SuperTarget	264	216.75
26	45	2018	53	DeCicco Family Market	42	285.25
26	45	2018	88	Lin's Fresh Market	64	239.75
26	46	2018	5	Stop & Shop	53	228.25
26	46	2018	15	Brown & Cole	31	228.25
26	46	2018	37	Fred Meyer	63	228.25
26	46	2018	48	Miller's Fresh Foods	31	262.5
26	47	2018	30	SuperTarget	260	216.75
26	47	2018	45	Landis Supermarkets	102	239.75
26	47	2018	55	Piggly Wiggly	19	262.5
26	48	2018	38	Great American Food Stores	32	228.25
26	48	2018	57	Lunds & Byerlys	37	228.25
26	48	2018	59	Meijer	78	228.25
26	49	2018	15	Brown & Cole	32	228.25
26	50	2018	2	Food Lion	36	228.25
26	50	2018	30	SuperTarget	271	216.75
26	51	2018	5	Stop & Shop	62	228.25
26	52	2018	15	Brown & Cole	32	228.25
26	52	2018	20	Walmart	208	205.5
27	1	2018	91	Big Y Foods	67	33.25
27	2	2018	30	SuperTarget	238	31.5
27	3	2018	0	Weis Markets	94	34.75
27	3	2018	46	Macey's Market	28	36.5
27	4	2018	60	Super Dollar Discount Foods	21	34.75
27	5	2018	30	SuperTarget	236	31.5
27	5	2018	91	Big Y Foods	72	33.25
27	6	2018	75	Pick 'N Save	37	36.5
27	7	2018	20	Walmart	287	29.75
27	7	2018	28	Great Valu Markets	27	33.25
27	7	2018	46	Macey's Market	27	36.5
27	7	2018	100	Shaw's and Star Market	69	34.75
27	8	2018	30	SuperTarget	205	31.5
27	9	2018	45	Landis Supermarkets	69	33.25
27	9	2018	91	Big Y Foods	65	33.25
27	9	2018	99	Strack & Van Til	55	33.25
27	10	2018	0	Weis Markets	102	34.75
27	10	2018	3	Hannaford	68	36.5
27	10	2018	60	Super Dollar Discount Foods	24	34.75
27	10	2018	66	McCaffrey's	49	36.5
27	10	2018	69	Western Supermarket	23	39.75
27	10	2018	77	Woodman's Food Market	46	34.75
27	11	2018	30	SuperTarget	200	31.5
27	11	2018	46	Macey's Market	25	36.5
27	13	2018	91	Big Y Foods	61	33.25
27	14	2018	30	SuperTarget	204	31.5
27	14	2018	100	Shaw's and Star Market	76	34.75
27	15	2018	46	Macey's Market	23	36.5
27	15	2018	79	Harding's Friendly Markets	27	34.75
27	16	2018	60	Super Dollar Discount Foods	22	34.75
27	17	2018	0	Weis Markets	94	34.75
27	17	2018	30	SuperTarget	238	31.5
27	17	2018	91	Big Y Foods	67	33.25
27	18	2018	99	Strack & Van Til	53	33.25
27	19	2018	46	Macey's Market	23	36.5
27	20	2018	30	SuperTarget	204	31.5
27	21	2018	3	Hannaford	69	36.5
27	21	2018	28	Great Valu Markets	24	33.25
27	21	2018	91	Big Y Foods	60	33.25
27	21	2018	100	Shaw's and Star Market	76	34.75
27	22	2018	20	Walmart	273	29.75
27	22	2018	60	Super Dollar Discount Foods	23	34.75
27	23	2018	30	SuperTarget	236	31.5
27	23	2018	46	Macey's Market	22	36.5
27	23	2018	75	Pick 'N Save	52	36.5
27	23	2018	77	Woodman's Food Market	41	34.75
27	24	2018	0	Weis Markets	112	34.75
27	24	2018	66	McCaffrey's	55	36.5
27	25	2018	91	Big Y Foods	67	33.25
27	26	2018	30	SuperTarget	193	31.5
27	27	2018	46	Macey's Market	24	36.5
27	27	2018	99	Strack & Van Til	62	33.25
27	28	2018	45	Landis Supermarkets	61	33.25
27	28	2018	60	Super Dollar Discount Foods	22	34.75
27	28	2018	69	Western Supermarket	20	39.75
27	28	2018	100	Shaw's and Star Market	68	34.75
27	29	2018	30	SuperTarget	211	31.5
27	29	2018	91	Big Y Foods	76	33.25
27	31	2018	0	Weis Markets	97	34.75
27	31	2018	46	Macey's Market	22	36.5
27	31	2018	79	Harding's Friendly Markets	29	34.75
27	32	2018	3	Hannaford	74	36.5
27	32	2018	30	SuperTarget	233	31.5
27	33	2018	91	Big Y Foods	75	33.25
27	34	2018	60	Super Dollar Discount Foods	23	34.75
27	35	2018	28	Great Valu Markets	25	33.25
27	35	2018	30	SuperTarget	233	31.5
27	35	2018	46	Macey's Market	22	36.5
27	35	2018	100	Shaw's and Star Market	70	34.75
27	36	2018	77	Woodman's Food Market	33	34.75
27	36	2018	99	Strack & Van Til	69	33.25
27	37	2018	20	Walmart	245	29.75
27	37	2018	91	Big Y Foods	82	33.25
27	38	2018	0	Weis Markets	99	34.75
27	38	2018	30	SuperTarget	201	31.5
27	38	2018	66	McCaffrey's	51	36.5
27	39	2018	46	Macey's Market	20	36.5
27	40	2018	60	Super Dollar Discount Foods	19	34.75
27	40	2018	75	Pick 'N Save	42	36.5
27	41	2018	30	SuperTarget	202	31.5
27	41	2018	91	Big Y Foods	78	33.25
27	42	2018	100	Shaw's and Star Market	61	34.75
27	43	2018	3	Hannaford	65	36.5
27	43	2018	46	Macey's Market	23	36.5
27	44	2018	30	SuperTarget	208	31.5
27	45	2018	0	Weis Markets	91	34.75
27	45	2018	91	Big Y Foods	78	33.25
27	45	2018	99	Strack & Van Til	61	33.25
27	46	2018	60	Super Dollar Discount Foods	23	34.75
27	46	2018	69	Western Supermarket	19	39.75
27	47	2018	30	SuperTarget	235	31.5
27	47	2018	45	Landis Supermarkets	64	33.25
27	47	2018	46	Macey's Market	22	36.5
27	47	2018	79	Harding's Friendly Markets	23	34.75
27	49	2018	28	Great Valu Markets	28	33.25
27	49	2018	77	Woodman's Food Market	42	34.75
27	49	2018	91	Big Y Foods	73	33.25
27	49	2018	100	Shaw's and Star Market	63	34.75
27	50	2018	30	SuperTarget	213	31.5
27	51	2018	46	Macey's Market	21	36.5
27	52	2018	0	Weis Markets	93	34.75
27	52	2018	20	Walmart	268	29.75
27	52	2018	60	Super Dollar Discount Foods	21	34.75
27	52	2018	66	McCaffrey's	49	36.5
28	3	2018	53	DeCicco Family Market	58	97.75
28	3	2018	68	Ideal Food Basket	262	107
28	6	2018	67	Crosby's Marketplace	188	97.75
28	6	2018	97	Trade Fair	150	93
28	7	2018	20	Walmart	1650	83.75
28	8	2018	9	Shop 'n Save	139	102.25
28	8	2018	23	Western Beef	297	111.75
28	9	2018	21	Village Market Food Center	113	97.75
28	9	2018	45	Landis Supermarkets	270	93
28	10	2018	11	Sunflower Farmers Market	79	93
28	10	2018	68	Ideal Food Basket	270	107
28	10	2018	69	Western Supermarket	312	93
28	11	2018	94	H-E-B Plus	99	102.25
28	12	2018	12	Scolari's Food and Drug	283	107
28	12	2018	29	Felpausch	72	97.75
28	17	2018	53	DeCicco Family Market	52	97.75
28	17	2018	67	Crosby's Marketplace	171	97.75
28	17	2018	68	Ideal Food Basket	270	107
28	19	2018	9	Shop 'n Save	142	102.25
28	19	2018	97	Trade Fair	123	93
28	22	2018	20	Walmart	1637	83.75
28	23	2018	11	Sunflower Farmers Market	69	93
28	24	2018	68	Ideal Food Basket	282	107
28	25	2018	23	Western Beef	348	111.75
28	26	2018	94	H-E-B Plus	108	102.25
28	27	2018	21	Village Market Food Center	106	97.75
28	28	2018	12	Scolari's Food and Drug	291	107
28	28	2018	45	Landis Supermarkets	234	93
28	28	2018	67	Crosby's Marketplace	202	97.75
28	28	2018	69	Western Supermarket	318	93
28	30	2018	9	Shop 'n Save	149	102.25
28	30	2018	29	Felpausch	79	97.75
28	31	2018	53	DeCicco Family Market	43	97.75
28	31	2018	68	Ideal Food Basket	274	107
28	32	2018	97	Trade Fair	145	93
28	36	2018	11	Sunflower Farmers Market	71	93
28	37	2018	20	Walmart	1662	83.75
28	38	2018	68	Ideal Food Basket	243	107
28	39	2018	67	Crosby's Marketplace	197	97.75
28	41	2018	9	Shop 'n Save	143	102.25
28	41	2018	94	H-E-B Plus	97	102.25
28	42	2018	23	Western Beef	301	111.75
28	44	2018	12	Scolari's Food and Drug	293	107
28	45	2018	21	Village Market Food Center	96	97.75
28	45	2018	53	DeCicco Family Market	55	97.75
28	45	2018	68	Ideal Food Basket	241	107
28	45	2018	97	Trade Fair	149	93
28	46	2018	69	Western Supermarket	274	93
28	47	2018	45	Landis Supermarkets	253	93
28	48	2018	29	Felpausch	71	97.75
28	49	2018	11	Sunflower Farmers Market	79	93
28	50	2018	67	Crosby's Marketplace	188	97.75
28	52	2018	9	Shop 'n Save	135	102.25
28	52	2018	20	Walmart	1712	83.75
28	52	2018	68	Ideal Food Basket	228	107
1	2	2018	30	SuperTarget	294	280.75
1	5	2018	30	SuperTarget	305	280.75
1	6	2018	59	Meijer	87	310.25
1	6	2018	75	Pick 'N Save	23	310.25
1	6	2018	87	Sav-Mor Foods	70	295.5
1	7	2018	20	Walmart	160	266
1	8	2018	30	SuperTarget	314	280.75
1	10	2018	77	Woodman's Food Market	32	325
1	11	2018	30	SuperTarget	277	280.75
1	14	2018	18	Super Saver	41	295.5
1	14	2018	30	SuperTarget	262	280.75
1	17	2018	30	SuperTarget	291	280.75
1	17	2018	87	Sav-Mor Foods	67	295.5
1	20	2018	30	SuperTarget	305	280.75
1	20	2018	59	Meijer	79	310.25
1	22	2018	20	Walmart	157	266
1	23	2018	30	SuperTarget	300	280.75
1	23	2018	75	Pick 'N Save	22	310.25
1	23	2018	77	Woodman's Food Market	41	325
1	26	2018	30	SuperTarget	280	280.75
1	28	2018	87	Sav-Mor Foods	69	295.5
1	29	2018	18	Super Saver	41	295.5
1	29	2018	30	SuperTarget	276	280.75
1	32	2018	30	SuperTarget	293	280.75
1	34	2018	59	Meijer	75	310.25
1	35	2018	30	SuperTarget	319	280.75
1	36	2018	77	Woodman's Food Market	37	325
1	37	2018	20	Walmart	146	266
1	38	2018	30	SuperTarget	308	280.75
1	39	2018	87	Sav-Mor Foods	70	295.5
1	40	2018	75	Pick 'N Save	22	310.25
1	41	2018	30	SuperTarget	289	280.75
1	44	2018	18	Super Saver	41	295.5
1	44	2018	30	SuperTarget	305	280.75
1	47	2018	30	SuperTarget	272	280.75
1	48	2018	59	Meijer	81	310.25
1	49	2018	77	Woodman's Food Market	36	325
1	50	2018	30	SuperTarget	286	280.75
1	50	2018	87	Sav-Mor Foods	77	295.5
1	52	2018	20	Walmart	140	266
2	1	2018	15	Brown & Cole	10	225
2	2	2018	30	SuperTarget	48	213.75
2	3	2018	0	Weis Markets	24	236.25
2	3	2018	24	Chappells Hometown Foods	8	270
2	3	2018	41	Arlan's Market	9	258.75
2	3	2018	62	Westborn Market	6	225
2	4	2018	15	Brown & Cole	10	225
2	4	2018	17	Broulims	2	225
2	5	2018	30	SuperTarget	44	213.75
2	6	2018	87	Sav-Mor Foods	14	225
2	6	2018	97	Trade Fair	9	225
2	7	2018	15	Brown & Cole	11	225
2	7	2018	20	Walmart	26	202.5
2	7	2018	28	Great Valu Markets	17	225
2	8	2018	23	Western Beef	9	236.25
2	8	2018	30	SuperTarget	47	213.75
2	8	2018	41	Arlan's Market	9	258.75
2	9	2018	45	Landis Supermarkets	17	236.25
2	10	2018	0	Weis Markets	20	236.25
2	10	2018	15	Brown & Cole	11	225
2	11	2018	24	Chappells Hometown Foods	8	270
2	11	2018	30	SuperTarget	38	213.75
2	11	2018	31	Compare Foods Supermarket	8	225
2	12	2018	17	Broulims	2	225
2	13	2018	15	Brown & Cole	9	225
2	13	2018	41	Arlan's Market	9	258.75
2	14	2018	30	SuperTarget	41	213.75
2	14	2018	62	Westborn Market	7	225
2	16	2018	15	Brown & Cole	10	225
2	17	2018	0	Weis Markets	23	236.25
2	17	2018	30	SuperTarget	38	213.75
2	17	2018	87	Sav-Mor Foods	15	225
2	18	2018	41	Arlan's Market	8	258.75
2	19	2018	15	Brown & Cole	11	225
2	19	2018	24	Chappells Hometown Foods	8	270
2	19	2018	97	Trade Fair	8	225
2	20	2018	17	Broulims	2	225
2	20	2018	30	SuperTarget	41	213.75
2	21	2018	28	Great Valu Markets	18	225
2	22	2018	15	Brown & Cole	10	225
2	22	2018	20	Walmart	28	202.5
2	23	2018	30	SuperTarget	45	213.75
2	23	2018	41	Arlan's Market	8	258.75
2	24	2018	0	Weis Markets	21	236.25
2	25	2018	15	Brown & Cole	11	225
2	25	2018	23	Western Beef	8	236.25
2	25	2018	62	Westborn Market	6	225
2	26	2018	30	SuperTarget	39	213.75
2	26	2018	31	Compare Foods Supermarket	8	225
2	27	2018	24	Chappells Hometown Foods	9	270
2	28	2018	15	Brown & Cole	12	225
2	28	2018	17	Broulims	3	225
2	28	2018	41	Arlan's Market	8	258.75
2	28	2018	45	Landis Supermarkets	15	236.25
2	28	2018	87	Sav-Mor Foods	16	225
2	29	2018	30	SuperTarget	38	213.75
2	31	2018	0	Weis Markets	21	236.25
2	31	2018	15	Brown & Cole	11	225
2	32	2018	30	SuperTarget	38	213.75
2	32	2018	97	Trade Fair	9	225
2	33	2018	41	Arlan's Market	8	258.75
2	34	2018	15	Brown & Cole	12	225
2	35	2018	24	Chappells Hometown Foods	8	270
2	35	2018	28	Great Valu Markets	19	225
2	35	2018	30	SuperTarget	38	213.75
2	36	2018	17	Broulims	2	225
2	36	2018	62	Westborn Market	7	225
2	37	2018	15	Brown & Cole	10	225
2	37	2018	20	Walmart	26	202.5
2	38	2018	0	Weis Markets	21	236.25
2	38	2018	30	SuperTarget	43	213.75
2	38	2018	41	Arlan's Market	9	258.75
2	39	2018	87	Sav-Mor Foods	15	225
2	40	2018	15	Brown & Cole	11	225
2	41	2018	30	SuperTarget	41	213.75
2	41	2018	31	Compare Foods Supermarket	7	225
2	42	2018	23	Western Beef	9	236.25
2	43	2018	15	Brown & Cole	10	225
2	43	2018	24	Chappells Hometown Foods	8	270
2	43	2018	41	Arlan's Market	8	258.75
2	44	2018	17	Broulims	2	225
2	44	2018	30	SuperTarget	38	213.75
2	45	2018	0	Weis Markets	21	236.25
2	45	2018	97	Trade Fair	9	225
2	46	2018	15	Brown & Cole	9	225
2	47	2018	30	SuperTarget	37	213.75
2	47	2018	45	Landis Supermarkets	15	236.25
2	47	2018	62	Westborn Market	8	225
2	48	2018	41	Arlan's Market	9	258.75
2	49	2018	15	Brown & Cole	10	225
2	49	2018	28	Great Valu Markets	19	225
2	50	2018	30	SuperTarget	38	213.75
2	50	2018	87	Sav-Mor Foods	16	225
2	51	2018	24	Chappells Hometown Foods	7	270
2	52	2018	0	Weis Markets	22	236.25
2	52	2018	15	Brown & Cole	10	225
2	52	2018	17	Broulims	2	225
2	52	2018	20	Walmart	27	202.5
3	1	2018	5	Stop & Shop	10	123.25
3	2	2018	13	Brookshire Grocery Company	12	107.25
3	2	2018	30	SuperTarget	174	101.75
3	2	2018	58	Red Apple	15	112.5
3	2	2018	86	Quality Foods	42	107.25
3	3	2018	63	Yoke's Fresh Market	24	118
3	4	2018	47	Food Pavilion	17	112.5
3	5	2018	30	SuperTarget	149	101.75
3	5	2018	82	Vinckier Foods	38	107.25
3	6	2018	5	Stop & Shop	9	123.25
3	7	2018	20	Walmart	171	96.5
3	8	2018	30	SuperTarget	148	101.75
3	9	2018	101	Gristedes	12	107.25
3	11	2018	5	Stop & Shop	9	123.25
3	11	2018	30	SuperTarget	158	101.75
3	11	2018	86	Quality Foods	51	107.25
3	12	2018	12	Scolari's Food and Drug	12	134
3	12	2018	58	Red Apple	17	112.5
3	12	2018	82	Vinckier Foods	39	107.25
3	13	2018	63	Yoke's Fresh Market	22	118
3	14	2018	30	SuperTarget	150	101.75
3	15	2018	79	Harding's Friendly Markets	9	134
3	16	2018	5	Stop & Shop	10	123.25
3	16	2018	13	Brookshire Grocery Company	13	107.25
3	17	2018	30	SuperTarget	147	101.75
3	19	2018	10	C-Town	8	107.25
3	19	2018	82	Vinckier Foods	35	107.25
3	19	2018	101	Gristedes	13	107.25
3	20	2018	30	SuperTarget	148	101.75
3	20	2018	86	Quality Foods	48	107.25
3	21	2018	5	Stop & Shop	10	123.25
3	22	2018	20	Walmart	162	96.5
3	22	2018	47	Food Pavilion	19	112.5
3	22	2018	58	Red Apple	18	112.5
3	23	2018	30	SuperTarget	154	101.75
3	23	2018	63	Yoke's Fresh Market	22	118
3	26	2018	5	Stop & Shop	9	123.25
3	26	2018	30	SuperTarget	156	101.75
3	26	2018	82	Vinckier Foods	40	107.25
3	28	2018	12	Scolari's Food and Drug	12	134
3	29	2018	30	SuperTarget	145	101.75
3	29	2018	86	Quality Foods	42	107.25
3	29	2018	101	Gristedes	11	107.25
3	30	2018	13	Brookshire Grocery Company	13	107.25
3	31	2018	5	Stop & Shop	9	123.25
3	31	2018	79	Harding's Friendly Markets	8	134
3	32	2018	30	SuperTarget	162	101.75
3	32	2018	58	Red Apple	14	112.5
3	33	2018	63	Yoke's Fresh Market	26	118
3	33	2018	82	Vinckier Foods	43	107.25
3	35	2018	30	SuperTarget	149	101.75
3	36	2018	5	Stop & Shop	8	123.25
3	37	2018	20	Walmart	176	96.5
3	38	2018	10	C-Town	7	107.25
3	38	2018	30	SuperTarget	176	101.75
3	38	2018	86	Quality Foods	49	107.25
3	39	2018	101	Gristedes	13	107.25
3	40	2018	47	Food Pavilion	17	112.5
3	40	2018	82	Vinckier Foods	41	107.25
3	41	2018	5	Stop & Shop	10	123.25
3	41	2018	30	SuperTarget	168	101.75
3	42	2018	58	Red Apple	15	112.5
3	43	2018	63	Yoke's Fresh Market	25	118
3	44	2018	12	Scolari's Food and Drug	12	134
3	44	2018	13	Brookshire Grocery Company	13	107.25
3	44	2018	30	SuperTarget	145	101.75
3	46	2018	5	Stop & Shop	9	123.25
3	47	2018	30	SuperTarget	171	101.75
3	47	2018	79	Harding's Friendly Markets	9	134
3	47	2018	82	Vinckier Foods	44	107.25
3	47	2018	86	Quality Foods	47	107.25
3	49	2018	101	Gristedes	10	107.25
3	50	2018	30	SuperTarget	167	101.75
3	51	2018	5	Stop & Shop	8	123.25
3	52	2018	20	Walmart	158	96.5
3	52	2018	58	Red Apple	18	112.5
5	1	2018	91	Big Y Foods	11	312.75
5	2	2018	30	SuperTarget	65	258.5
5	2	2018	61	Breaux Mart Supermarkets	12	272
5	3	2018	33	Lauer's Supermarket and Bakery	22	272
5	3	2018	76	Ingles Markets	21	299.25
5	3	2018	81	Hugo's	13	272
5	4	2018	4	Giant	17	272
5	5	2018	30	SuperTarget	64	258.5
5	5	2018	91	Big Y Foods	9	312.75
5	7	2018	20	Walmart	81	244.75
5	7	2018	27	Nam Dae Mun Farmers Market	9	272
5	7	2018	74	Tom Thumb Food & Pharmacy	2	272
5	7	2018	81	Hugo's	13	272
5	8	2018	4	Giant	14	272
5	8	2018	23	Western Beef	14	272
5	8	2018	30	SuperTarget	64	258.5
5	8	2018	33	Lauer's Supermarket and Bakery	19	272
5	8	2018	76	Ingles Markets	24	299.25
5	9	2018	45	Landis Supermarkets	19	272
5	9	2018	91	Big Y Foods	9	312.75
5	10	2018	16	K-VA-T Food Stores	13	299.25
5	10	2018	57	Lunds & Byerlys	11	272
5	11	2018	30	SuperTarget	60	258.5
5	11	2018	81	Hugo's	13	272
5	12	2018	4	Giant	15	272
5	12	2018	48	Miller's Fresh Foods	14	272
5	13	2018	33	Lauer's Supermarket and Bakery	24	272
5	13	2018	76	Ingles Markets	22	299.25
5	13	2018	91	Big Y Foods	10	312.75
5	14	2018	30	SuperTarget	62	258.5
5	14	2018	74	Tom Thumb Food & Pharmacy	2	272
5	15	2018	81	Hugo's	14	272
5	16	2018	4	Giant	14	272
5	16	2018	83	BI-LO	17	285.75
5	17	2018	30	SuperTarget	59	258.5
5	17	2018	91	Big Y Foods	9	312.75
5	18	2018	33	Lauer's Supermarket and Bakery	21	272
5	18	2018	76	Ingles Markets	20	299.25
5	19	2018	81	Hugo's	13	272
5	20	2018	4	Giant	17	272
5	20	2018	30	SuperTarget	68	258.5
5	20	2018	61	Breaux Mart Supermarkets	12	272
5	21	2018	27	Nam Dae Mun Farmers Market	10	272
5	21	2018	74	Tom Thumb Food & Pharmacy	2	272
5	21	2018	91	Big Y Foods	9	312.75
5	22	2018	20	Walmart	81	244.75
5	23	2018	16	K-VA-T Food Stores	15	299.25
5	23	2018	30	SuperTarget	70	258.5
5	23	2018	33	Lauer's Supermarket and Bakery	25	272
5	23	2018	76	Ingles Markets	23	299.25
5	23	2018	81	Hugo's	12	272
5	24	2018	4	Giant	15	272
5	25	2018	23	Western Beef	17	272
5	25	2018	91	Big Y Foods	9	312.75
5	26	2018	30	SuperTarget	63	258.5
5	27	2018	81	Hugo's	13	272
5	28	2018	4	Giant	16	272
5	28	2018	33	Lauer's Supermarket and Bakery	25	272
5	28	2018	45	Landis Supermarkets	17	272
5	28	2018	74	Tom Thumb Food & Pharmacy	2	272
5	28	2018	76	Ingles Markets	23	299.25
5	29	2018	30	SuperTarget	74	258.5
5	29	2018	48	Miller's Fresh Foods	15	272
5	29	2018	57	Lunds & Byerlys	12	272
5	29	2018	91	Big Y Foods	8	312.75
5	31	2018	81	Hugo's	15	272
5	32	2018	4	Giant	17	272
5	32	2018	30	SuperTarget	64	258.5
5	32	2018	83	BI-LO	17	285.75
5	33	2018	33	Lauer's Supermarket and Bakery	23	272
5	33	2018	76	Ingles Markets	20	299.25
5	33	2018	91	Big Y Foods	8	312.75
5	35	2018	27	Nam Dae Mun Farmers Market	9	272
5	35	2018	30	SuperTarget	71	258.5
5	35	2018	74	Tom Thumb Food & Pharmacy	2	272
5	35	2018	81	Hugo's	14	272
5	36	2018	4	Giant	18	272
5	36	2018	16	K-VA-T Food Stores	14	299.25
5	37	2018	20	Walmart	81	244.75
5	37	2018	91	Big Y Foods	9	312.75
5	38	2018	30	SuperTarget	74	258.5
5	38	2018	33	Lauer's Supermarket and Bakery	24	272
5	38	2018	61	Breaux Mart Supermarkets	9	272
5	38	2018	76	Ingles Markets	19	299.25
5	39	2018	81	Hugo's	13	272
5	40	2018	4	Giant	15	272
5	41	2018	30	SuperTarget	74	258.5
5	41	2018	91	Big Y Foods	10	312.75
5	42	2018	23	Western Beef	15	272
5	42	2018	74	Tom Thumb Food & Pharmacy	2	272
5	43	2018	33	Lauer's Supermarket and Bakery	21	272
5	43	2018	76	Ingles Markets	23	299.25
5	43	2018	81	Hugo's	14	272
5	44	2018	4	Giant	17	272
5	44	2018	30	SuperTarget	67	258.5
5	45	2018	91	Big Y Foods	10	312.75
5	46	2018	48	Miller's Fresh Foods	16	272
5	47	2018	30	SuperTarget	69	258.5
5	47	2018	45	Landis Supermarkets	16	272
5	47	2018	81	Hugo's	14	272
5	48	2018	4	Giant	17	272
5	48	2018	33	Lauer's Supermarket and Bakery	23	272
5	48	2018	57	Lunds & Byerlys	11	272
5	48	2018	76	Ingles Markets	23	299.25
5	48	2018	83	BI-LO	16	285.75
5	49	2018	16	K-VA-T Food Stores	13	299.25
5	49	2018	27	Nam Dae Mun Farmers Market	9	272
5	49	2018	74	Tom Thumb Food & Pharmacy	2	272
5	49	2018	91	Big Y Foods	10	312.75
5	50	2018	30	SuperTarget	58	258.5
5	51	2018	81	Hugo's	15	272
5	52	2018	4	Giant	15	272
5	52	2018	20	Walmart	78	244.75
123	2	2018	7	SpartanNash	289	279.75
123	2	2018	13	Brookshire Grocery Company	128	266.5
123	2	2018	30	SuperTarget	773	253.25
123	5	2018	30	SuperTarget	854	253.25
123	5	2018	82	Vinckier Foods	260	266.5
123	7	2018	20	Walmart	954	239.75
123	7	2018	40	Buehler's Buy-Low	88	293.25
123	7	2018	100	Shaw's and Star Market	392	266.5
123	8	2018	30	SuperTarget	772	253.25
123	11	2018	7	SpartanNash	267	279.75
123	11	2018	30	SuperTarget	717	253.25
123	12	2018	82	Vinckier Foods	240	266.5
123	14	2018	30	SuperTarget	767	253.25
123	14	2018	100	Shaw's and Star Market	374	266.5
123	16	2018	13	Brookshire Grocery Company	133	266.5
123	17	2018	30	SuperTarget	807	253.25
123	17	2018	40	Buehler's Buy-Low	90	293.25
123	19	2018	82	Vinckier Foods	237	266.5
123	20	2018	7	SpartanNash	282	279.75
123	20	2018	30	SuperTarget	920	253.25
123	21	2018	100	Shaw's and Star Market	365	266.5
123	22	2018	20	Walmart	864	239.75
123	23	2018	30	SuperTarget	786	253.25
123	26	2018	30	SuperTarget	861	253.25
123	26	2018	82	Vinckier Foods	238	266.5
123	27	2018	40	Buehler's Buy-Low	82	293.25
123	28	2018	100	Shaw's and Star Market	426	266.5
123	29	2018	7	SpartanNash	269	279.75
123	29	2018	30	SuperTarget	929	253.25
123	30	2018	13	Brookshire Grocery Company	138	266.5
123	32	2018	30	SuperTarget	888	253.25
123	33	2018	82	Vinckier Foods	220	266.5
123	35	2018	30	SuperTarget	785	253.25
123	35	2018	100	Shaw's and Star Market	352	266.5
123	37	2018	20	Walmart	865	239.75
123	37	2018	40	Buehler's Buy-Low	84	293.25
123	38	2018	7	SpartanNash	299	279.75
123	38	2018	30	SuperTarget	835	253.25
123	40	2018	82	Vinckier Foods	237	266.5
123	41	2018	30	SuperTarget	856	253.25
123	42	2018	100	Shaw's and Star Market	326	266.5
123	44	2018	13	Brookshire Grocery Company	127	266.5
123	44	2018	30	SuperTarget	801	253.25
123	47	2018	7	SpartanNash	294	279.75
123	47	2018	30	SuperTarget	733	253.25
123	47	2018	40	Buehler's Buy-Low	94	293.25
123	47	2018	82	Vinckier Foods	255	266.5
123	49	2018	100	Shaw's and Star Market	361	266.5
123	50	2018	30	SuperTarget	783	253.25
123	52	2018	20	Walmart	982	239.75
7	1	2018	5	Stop & Shop	31	249.5
7	2	2018	30	SuperTarget	125	237
7	2	2018	32	Pueblo	72	274.5
7	3	2018	14	FoodCity	36	262
7	3	2018	81	Hugo's	37	299.5
7	5	2018	30	SuperTarget	125	237
7	6	2018	5	Stop & Shop	32	249.5
7	6	2018	97	Trade Fair	23	262
7	7	2018	20	Walmart	127	224.5
7	7	2018	27	Nam Dae Mun Farmers Market	12	249.5
7	7	2018	74	Tom Thumb Food & Pharmacy	7	249.5
7	7	2018	81	Hugo's	37	299.5
7	8	2018	30	SuperTarget	127	237
7	9	2018	51	Valley Marketplace	23	299.5
7	10	2018	16	K-VA-T Food Stores	27	299.5
7	10	2018	32	Pueblo	85	274.5
7	11	2018	5	Stop & Shop	33	249.5
7	11	2018	30	SuperTarget	108	237
7	11	2018	31	Compare Foods Supermarket	12	249.5
7	11	2018	81	Hugo's	34	299.5
7	11	2018	93	Coborns	34	249.5
7	13	2018	14	FoodCity	38	262
7	14	2018	30	SuperTarget	112	237
7	14	2018	74	Tom Thumb Food & Pharmacy	8	249.5
7	15	2018	81	Hugo's	38	299.5
7	16	2018	5	Stop & Shop	37	249.5
7	17	2018	30	SuperTarget	117	237
7	18	2018	32	Pueblo	85	274.5
7	19	2018	81	Hugo's	36	299.5
7	19	2018	97	Trade Fair	22	262
7	20	2018	30	SuperTarget	102	237
7	21	2018	5	Stop & Shop	39	249.5
7	21	2018	27	Nam Dae Mun Farmers Market	12	249.5
7	21	2018	74	Tom Thumb Food & Pharmacy	9	249.5
7	22	2018	20	Walmart	129	224.5
7	22	2018	51	Valley Marketplace	21	299.5
7	22	2018	93	Coborns	39	249.5
7	23	2018	14	FoodCity	37	262
7	23	2018	16	K-VA-T Food Stores	24	299.5
7	23	2018	30	SuperTarget	97	237
7	23	2018	81	Hugo's	38	299.5
7	26	2018	5	Stop & Shop	38	249.5
7	26	2018	30	SuperTarget	111	237
7	26	2018	31	Compare Foods Supermarket	13	249.5
7	26	2018	32	Pueblo	85	274.5
7	27	2018	81	Hugo's	40	299.5
7	28	2018	74	Tom Thumb Food & Pharmacy	8	249.5
7	29	2018	30	SuperTarget	117	237
7	31	2018	5	Stop & Shop	34	249.5
7	31	2018	81	Hugo's	42	299.5
7	32	2018	30	SuperTarget	108	237
7	32	2018	97	Trade Fair	23	262
7	33	2018	14	FoodCity	43	262
7	33	2018	93	Coborns	44	249.5
7	34	2018	32	Pueblo	78	274.5
7	35	2018	27	Nam Dae Mun Farmers Market	12	249.5
7	35	2018	30	SuperTarget	120	237
7	35	2018	51	Valley Marketplace	22	299.5
7	35	2018	74	Tom Thumb Food & Pharmacy	7	249.5
7	35	2018	81	Hugo's	36	299.5
7	36	2018	5	Stop & Shop	33	249.5
7	36	2018	16	K-VA-T Food Stores	27	299.5
7	37	2018	20	Walmart	147	224.5
7	38	2018	30	SuperTarget	107	237
7	39	2018	81	Hugo's	41	299.5
7	41	2018	5	Stop & Shop	37	249.5
7	41	2018	30	SuperTarget	129	237
7	41	2018	31	Compare Foods Supermarket	13	249.5
7	42	2018	32	Pueblo	77	274.5
7	42	2018	74	Tom Thumb Food & Pharmacy	8	249.5
7	43	2018	14	FoodCity	43	262
7	43	2018	81	Hugo's	40	299.5
7	44	2018	30	SuperTarget	132	237
7	44	2018	93	Coborns	44	249.5
7	45	2018	97	Trade Fair	22	262
7	46	2018	5	Stop & Shop	36	249.5
7	47	2018	30	SuperTarget	117	237
7	47	2018	81	Hugo's	35	299.5
7	48	2018	51	Valley Marketplace	21	299.5
7	49	2018	16	K-VA-T Food Stores	27	299.5
7	49	2018	27	Nam Dae Mun Farmers Market	13	249.5
7	49	2018	74	Tom Thumb Food & Pharmacy	8	249.5
7	50	2018	30	SuperTarget	112	237
7	50	2018	32	Pueblo	74	274.5
7	51	2018	5	Stop & Shop	35	249.5
7	51	2018	81	Hugo's	37	299.5
7	52	2018	20	Walmart	139	224.5
8	1	2018	25	Hank's Market	9	248.25
8	2	2018	30	SuperTarget	35	214.5
8	2	2018	34	Mayfair Markets	10	225.75
8	3	2018	53	DeCicco Family Market	5	259.75
8	4	2018	47	Food Pavilion	23	259.75
8	5	2018	30	SuperTarget	41	214.5
8	5	2018	34	Mayfair Markets	8	225.75
8	7	2018	20	Walmart	90	203.25
8	8	2018	9	Shop 'n Save	31	225.75
8	8	2018	30	SuperTarget	35	214.5
8	8	2018	34	Mayfair Markets	8	225.75
8	9	2018	92	Central Market	10	248.25
8	11	2018	30	SuperTarget	38	214.5
8	11	2018	34	Mayfair Markets	9	225.75
8	12	2018	37	Fred Meyer	25	259.75
8	14	2018	30	SuperTarget	34	214.5
8	14	2018	34	Mayfair Markets	10	225.75
8	16	2018	83	BI-LO	21	225.75
8	17	2018	30	SuperTarget	41	214.5
8	17	2018	34	Mayfair Markets	10	225.75
8	17	2018	53	DeCicco Family Market	5	259.75
8	19	2018	9	Shop 'n Save	30	225.75
8	20	2018	25	Hank's Market	8	248.25
8	20	2018	30	SuperTarget	33	214.5
8	20	2018	34	Mayfair Markets	10	225.75
8	22	2018	20	Walmart	79	203.25
8	22	2018	47	Food Pavilion	24	259.75
8	23	2018	30	SuperTarget	37	214.5
8	23	2018	34	Mayfair Markets	10	225.75
8	26	2018	30	SuperTarget	39	214.5
8	26	2018	34	Mayfair Markets	9	225.75
8	27	2018	92	Central Market	9	248.25
8	29	2018	30	SuperTarget	39	214.5
8	29	2018	34	Mayfair Markets	10	225.75
8	29	2018	37	Fred Meyer	21	259.75
8	30	2018	9	Shop 'n Save	37	225.75
8	31	2018	53	DeCicco Family Market	6	259.75
8	32	2018	30	SuperTarget	34	214.5
8	32	2018	34	Mayfair Markets	11	225.75
8	32	2018	83	BI-LO	17	225.75
8	35	2018	30	SuperTarget	37	214.5
8	35	2018	34	Mayfair Markets	11	225.75
8	37	2018	20	Walmart	75	203.25
8	38	2018	30	SuperTarget	35	214.5
8	38	2018	34	Mayfair Markets	10	225.75
8	39	2018	25	Hank's Market	8	248.25
8	40	2018	47	Food Pavilion	22	259.75
8	41	2018	9	Shop 'n Save	33	225.75
8	41	2018	30	SuperTarget	39	214.5
8	41	2018	34	Mayfair Markets	11	225.75
8	44	2018	30	SuperTarget	37	214.5
8	44	2018	34	Mayfair Markets	9	225.75
8	45	2018	53	DeCicco Family Market	5	259.75
8	45	2018	92	Central Market	10	248.25
8	46	2018	37	Fred Meyer	27	259.75
8	47	2018	30	SuperTarget	34	214.5
8	47	2018	34	Mayfair Markets	10	225.75
8	48	2018	83	BI-LO	22	225.75
8	50	2018	30	SuperTarget	33	214.5
8	50	2018	34	Mayfair Markets	10	225.75
8	52	2018	9	Shop 'n Save	37	225.75
8	52	2018	20	Walmart	83	203.25
9	1	2018	44	Foodland	77	116.5
9	1	2018	90	H-E-B	50	106.75
9	1	2018	91	Big Y Foods	88	97
9	2	2018	30	SuperTarget	287	92.25
9	3	2018	89	Plum Market	27	97
9	4	2018	72	Acme Fresh Market	33	121.25
9	5	2018	30	SuperTarget	236	92.25
9	5	2018	91	Big Y Foods	89	97
9	7	2018	20	Walmart	238	87.25
9	7	2018	27	Nam Dae Mun Farmers Market	12	111.5
9	8	2018	30	SuperTarget	279	92.25
9	9	2018	51	Valley Marketplace	11	97
9	9	2018	72	Acme Fresh Market	32	121.25
9	9	2018	91	Big Y Foods	100	97
9	10	2018	16	K-VA-T Food Stores	58	111.5
9	11	2018	30	SuperTarget	246	92.25
9	13	2018	26	Market Basket	35	106.75
9	13	2018	44	Foodland	81	116.5
9	13	2018	90	H-E-B	41	106.75
9	13	2018	91	Big Y Foods	87	97
9	14	2018	30	SuperTarget	281	92.25
9	14	2018	72	Acme Fresh Market	31	121.25
9	17	2018	30	SuperTarget	267	92.25
9	17	2018	91	Big Y Foods	94	97
9	19	2018	72	Acme Fresh Market	36	121.25
9	20	2018	30	SuperTarget	258	92.25
9	21	2018	27	Nam Dae Mun Farmers Market	11	111.5
9	21	2018	89	Plum Market	24	97
9	21	2018	91	Big Y Foods	89	97
9	22	2018	20	Walmart	210	87.25
9	22	2018	51	Valley Marketplace	10	97
9	23	2018	16	K-VA-T Food Stores	59	111.5
9	23	2018	30	SuperTarget	271	92.25
9	24	2018	72	Acme Fresh Market	29	121.25
9	25	2018	44	Foodland	69	116.5
9	25	2018	90	H-E-B	41	106.75
9	25	2018	91	Big Y Foods	106	97
9	26	2018	30	SuperTarget	261	92.25
9	27	2018	26	Market Basket	40	106.75
9	29	2018	30	SuperTarget	276	92.25
9	29	2018	72	Acme Fresh Market	33	121.25
9	29	2018	91	Big Y Foods	106	97
9	32	2018	30	SuperTarget	242	92.25
9	33	2018	91	Big Y Foods	97	97
9	34	2018	72	Acme Fresh Market	32	121.25
9	35	2018	27	Nam Dae Mun Farmers Market	11	111.5
9	35	2018	30	SuperTarget	267	92.25
9	35	2018	51	Valley Marketplace	10	97
9	36	2018	16	K-VA-T Food Stores	56	111.5
9	37	2018	20	Walmart	210	87.25
9	37	2018	44	Foodland	75	116.5
9	37	2018	90	H-E-B	44	106.75
9	37	2018	91	Big Y Foods	108	97
9	38	2018	30	SuperTarget	255	92.25
9	39	2018	72	Acme Fresh Market	37	121.25
9	39	2018	89	Plum Market	27	97
9	41	2018	26	Market Basket	35	106.75
9	41	2018	30	SuperTarget	241	92.25
9	41	2018	91	Big Y Foods	90	97
9	44	2018	30	SuperTarget	276	92.25
9	44	2018	72	Acme Fresh Market	38	121.25
9	45	2018	91	Big Y Foods	92	97
9	47	2018	30	SuperTarget	302	92.25
9	48	2018	51	Valley Marketplace	13	97
9	49	2018	16	K-VA-T Food Stores	66	111.5
9	49	2018	27	Nam Dae Mun Farmers Market	12	111.5
9	49	2018	44	Foodland	80	116.5
9	49	2018	72	Acme Fresh Market	35	121.25
9	49	2018	90	H-E-B	47	106.75
9	49	2018	91	Big Y Foods	91	97
9	50	2018	30	SuperTarget	288	92.25
9	52	2018	20	Walmart	242	87.25
12	2	2018	30	SuperTarget	157	50
12	2	2018	84	Mac's Fresh Market	19	60.5
12	3	2018	14	FoodCity	51	58
12	3	2018	43	United Grocery Outlet	22	58
12	3	2018	64	Big M	11	52.75
12	4	2018	4	Giant	22	60.5
12	5	2018	30	SuperTarget	157	50
12	5	2018	82	Vinckier Foods	17	58
12	7	2018	20	Walmart	82	47.5
12	7	2018	27	Nam Dae Mun Farmers Market	7	55.25
12	8	2018	4	Giant	25	60.5
12	8	2018	23	Western Beef	36	55.25
12	8	2018	30	SuperTarget	179	50
12	9	2018	64	Big M	11	52.75
12	10	2018	3	Hannaford	35	52.75
12	10	2018	16	K-VA-T Food Stores	15	65.75
12	11	2018	30	SuperTarget	178	50
12	11	2018	94	H-E-B Plus	20	55.25
12	12	2018	4	Giant	23	60.5
12	12	2018	37	Fred Meyer	21	52.75
12	12	2018	82	Vinckier Foods	17	58
12	12	2018	84	Mac's Fresh Market	20	60.5
12	13	2018	14	FoodCity	54	58
12	14	2018	30	SuperTarget	146	50
12	14	2018	43	United Grocery Outlet	20	58
12	15	2018	64	Big M	11	52.75
12	16	2018	4	Giant	22	60.5
12	17	2018	30	SuperTarget	156	50
12	19	2018	82	Vinckier Foods	17	58
12	20	2018	4	Giant	23	60.5
12	20	2018	30	SuperTarget	148	50
12	21	2018	3	Hannaford	32	52.75
12	21	2018	27	Nam Dae Mun Farmers Market	6	55.25
12	21	2018	64	Big M	9	52.75
12	22	2018	20	Walmart	83	47.5
12	22	2018	84	Mac's Fresh Market	21	60.5
12	23	2018	14	FoodCity	54	58
12	23	2018	16	K-VA-T Food Stores	15	65.75
12	23	2018	30	SuperTarget	175	50
12	24	2018	4	Giant	20	60.5
12	25	2018	23	Western Beef	34	55.25
12	25	2018	43	United Grocery Outlet	21	58
12	26	2018	30	SuperTarget	179	50
12	26	2018	82	Vinckier Foods	17	58
12	26	2018	94	H-E-B Plus	20	55.25
12	27	2018	64	Big M	10	52.75
12	28	2018	4	Giant	21	60.5
12	29	2018	30	SuperTarget	150	50
12	29	2018	37	Fred Meyer	20	52.75
12	32	2018	3	Hannaford	31	52.75
12	32	2018	4	Giant	23	60.5
12	32	2018	30	SuperTarget	166	50
12	32	2018	84	Mac's Fresh Market	19	60.5
12	33	2018	14	FoodCity	50	58
12	33	2018	64	Big M	9	52.75
12	33	2018	82	Vinckier Foods	15	58
12	35	2018	27	Nam Dae Mun Farmers Market	6	55.25
12	35	2018	30	SuperTarget	149	50
12	36	2018	4	Giant	23	60.5
12	36	2018	16	K-VA-T Food Stores	14	65.75
12	36	2018	43	United Grocery Outlet	19	58
12	37	2018	20	Walmart	86	47.5
12	38	2018	30	SuperTarget	167	50
12	39	2018	64	Big M	10	52.75
12	40	2018	4	Giant	24	60.5
12	40	2018	82	Vinckier Foods	16	58
12	41	2018	30	SuperTarget	179	50
12	41	2018	94	H-E-B Plus	21	55.25
12	42	2018	23	Western Beef	39	55.25
12	42	2018	84	Mac's Fresh Market	18	60.5
12	43	2018	3	Hannaford	33	52.75
12	43	2018	14	FoodCity	45	58
12	44	2018	4	Giant	25	60.5
12	44	2018	30	SuperTarget	168	50
12	45	2018	64	Big M	11	52.75
12	46	2018	37	Fred Meyer	19	52.75
12	47	2018	30	SuperTarget	164	50
12	47	2018	43	United Grocery Outlet	21	58
12	47	2018	82	Vinckier Foods	17	58
12	48	2018	4	Giant	23	60.5
12	49	2018	16	K-VA-T Food Stores	15	65.75
12	49	2018	27	Nam Dae Mun Farmers Market	7	55.25
12	50	2018	30	SuperTarget	168	50
12	51	2018	64	Big M	11	52.75
12	52	2018	4	Giant	24	60.5
12	52	2018	20	Walmart	84	47.5
12	52	2018	84	Mac's Fresh Market	20	60.5
13	2	2018	30	SuperTarget	31	216
13	5	2018	30	SuperTarget	26	216
13	5	2018	52	Beach's Market	4	261.5
13	5	2018	88	Lin's Fresh Market	20	238.75
13	7	2018	20	Walmart	52	204.75
13	8	2018	30	SuperTarget	31	216
13	9	2018	92	Central Market	11	238.75
13	10	2018	77	Woodman's Food Market	18	227.5
13	11	2018	30	SuperTarget	25	216
13	11	2018	31	Compare Foods Supermarket	10	227.5
13	12	2018	48	Miller's Fresh Foods	18	227.5
13	13	2018	88	Lin's Fresh Market	20	238.75
13	14	2018	30	SuperTarget	30	216
13	17	2018	30	SuperTarget	27	216
13	19	2018	10	C-Town	4	227.5
13	19	2018	52	Beach's Market	4	261.5
13	20	2018	30	SuperTarget	28	216
13	21	2018	88	Lin's Fresh Market	17	238.75
13	22	2018	20	Walmart	62	204.75
13	23	2018	30	SuperTarget	27	216
13	23	2018	77	Woodman's Food Market	19	227.5
13	26	2018	30	SuperTarget	28	216
13	26	2018	31	Compare Foods Supermarket	10	227.5
13	27	2018	92	Central Market	12	238.75
13	29	2018	30	SuperTarget	32	216
13	29	2018	48	Miller's Fresh Foods	18	227.5
13	29	2018	88	Lin's Fresh Market	18	238.75
13	32	2018	30	SuperTarget	31	216
13	33	2018	52	Beach's Market	4	261.5
13	35	2018	30	SuperTarget	28	216
13	36	2018	77	Woodman's Food Market	19	227.5
13	37	2018	20	Walmart	61	204.75
13	37	2018	88	Lin's Fresh Market	18	238.75
13	38	2018	10	C-Town	4	227.5
13	38	2018	30	SuperTarget	27	216
13	41	2018	30	SuperTarget	29	216
13	41	2018	31	Compare Foods Supermarket	13	227.5
13	44	2018	30	SuperTarget	28	216
13	45	2018	88	Lin's Fresh Market	17	238.75
13	45	2018	92	Central Market	11	238.75
13	46	2018	48	Miller's Fresh Foods	22	227.5
13	47	2018	30	SuperTarget	27	216
13	47	2018	52	Beach's Market	4	261.5
13	49	2018	77	Woodman's Food Market	18	227.5
13	50	2018	30	SuperTarget	29	216
13	52	2018	20	Walmart	59	204.75
15	1	2018	15	Brown & Cole	3	94
15	1	2018	80	New Leaf Community Markets	1	103.25
15	1	2018	103	Wayne's Hometown Market	1	98.75
15	2	2018	30	SuperTarget	19	89.25
15	2	2018	84	Mac's Fresh Market	1	94
15	4	2018	15	Brown & Cole	3	94
15	4	2018	47	Food Pavilion	6	112.75
15	5	2018	30	SuperTarget	17	89.25
15	5	2018	80	New Leaf Community Markets	1	103.25
15	7	2018	15	Brown & Cole	3	94
15	8	2018	9	Shop 'n Save	1	108
15	8	2018	30	SuperTarget	17	89.25
15	9	2018	8	SuperValu Inc.	3	94
15	9	2018	80	New Leaf Community Markets	1	103.25
15	10	2018	15	Brown & Cole	3	94
15	11	2018	30	SuperTarget	17	89.25
15	12	2018	84	Mac's Fresh Market	1	94
15	13	2018	15	Brown & Cole	3	94
15	13	2018	80	New Leaf Community Markets	1	103.25
15	14	2018	22	Food Town	2	98.75
15	14	2018	30	SuperTarget	18	89.25
15	14	2018	103	Wayne's Hometown Market	1	98.75
15	15	2018	6	Kroger	1	94
15	16	2018	15	Brown & Cole	3	94
15	17	2018	30	SuperTarget	18	89.25
15	17	2018	80	New Leaf Community Markets	1	103.25
15	19	2018	8	SuperValu Inc.	2	94
15	19	2018	9	Shop 'n Save	1	108
15	19	2018	15	Brown & Cole	4	94
15	20	2018	30	SuperTarget	19	89.25
15	21	2018	80	New Leaf Community Markets	1	103.25
15	22	2018	15	Brown & Cole	3	94
15	22	2018	47	Food Pavilion	6	112.75
15	22	2018	84	Mac's Fresh Market	1	94
15	23	2018	30	SuperTarget	17	89.25
15	25	2018	15	Brown & Cole	3	94
15	25	2018	80	New Leaf Community Markets	1	103.25
15	26	2018	30	SuperTarget	19	89.25
15	27	2018	103	Wayne's Hometown Market	1	98.75
15	28	2018	15	Brown & Cole	3	94
15	29	2018	8	SuperValu Inc.	2	94
15	29	2018	22	Food Town	2	98.75
15	29	2018	30	SuperTarget	17	89.25
15	29	2018	80	New Leaf Community Markets	1	103.25
15	30	2018	9	Shop 'n Save	1	108
15	31	2018	6	Kroger	1	94
15	31	2018	15	Brown & Cole	3	94
15	32	2018	30	SuperTarget	17	89.25
15	32	2018	84	Mac's Fresh Market	1	94
15	33	2018	80	New Leaf Community Markets	1	103.25
15	34	2018	15	Brown & Cole	3	94
15	35	2018	30	SuperTarget	19	89.25
15	37	2018	15	Brown & Cole	4	94
15	37	2018	80	New Leaf Community Markets	1	103.25
15	38	2018	30	SuperTarget	21	89.25
15	39	2018	8	SuperValu Inc.	2	94
15	40	2018	15	Brown & Cole	3	94
15	40	2018	47	Food Pavilion	5	112.75
15	40	2018	103	Wayne's Hometown Market	1	98.75
15	41	2018	9	Shop 'n Save	2	108
15	41	2018	30	SuperTarget	17	89.25
15	41	2018	80	New Leaf Community Markets	1	103.25
15	42	2018	84	Mac's Fresh Market	1	94
15	43	2018	15	Brown & Cole	4	94
15	44	2018	22	Food Town	3	98.75
15	44	2018	30	SuperTarget	19	89.25
15	45	2018	80	New Leaf Community Markets	1	103.25
15	46	2018	15	Brown & Cole	3	94
15	47	2018	6	Kroger	1	94
15	47	2018	30	SuperTarget	21	89.25
15	49	2018	8	SuperValu Inc.	2	94
15	49	2018	15	Brown & Cole	3	94
15	49	2018	80	New Leaf Community Markets	1	103.25
15	50	2018	30	SuperTarget	21	89.25
15	52	2018	9	Shop 'n Save	1	108
15	52	2018	15	Brown & Cole	3	94
15	52	2018	84	Mac's Fresh Market	1	94
16	1	2018	103	Wayne's Hometown Market	31	33.5
16	2	2018	7	SpartanNash	65	40
16	2	2018	30	SuperTarget	333	31.75
16	2	2018	61	Breaux Mart Supermarkets	26	33.5
16	3	2018	63	Yoke's Fresh Market	89	33.5
16	4	2018	4	Giant	41	35
16	5	2018	30	SuperTarget	336	31.75
16	6	2018	98	Sunfresh Market	17	33.5
16	7	2018	20	Walmart	457	30
16	8	2018	4	Giant	40	35
16	8	2018	23	Western Beef	66	33.5
16	8	2018	30	SuperTarget	319	31.75
16	8	2018	56	Hollywood Super Market	64	33.5
16	9	2018	21	Village Market Food Center	12	38.5
16	11	2018	7	SpartanNash	62	40
16	11	2018	30	SuperTarget	349	31.75
16	11	2018	93	Coborns	44	33.5
16	12	2018	4	Giant	43	35
16	13	2018	63	Yoke's Fresh Market	89	33.5
16	13	2018	98	Sunfresh Market	16	33.5
16	14	2018	30	SuperTarget	353	31.75
16	14	2018	103	Wayne's Hometown Market	32	33.5
16	16	2018	4	Giant	45	35
16	16	2018	56	Hollywood Super Market	55	33.5
16	17	2018	30	SuperTarget	337	31.75
16	20	2018	4	Giant	40	35
16	20	2018	7	SpartanNash	58	40
16	20	2018	30	SuperTarget	358	31.75
16	20	2018	61	Breaux Mart Supermarkets	21	33.5
16	20	2018	98	Sunfresh Market	13	33.5
16	22	2018	20	Walmart	446	30
16	22	2018	93	Coborns	44	33.5
16	23	2018	30	SuperTarget	343	31.75
16	23	2018	63	Yoke's Fresh Market	76	33.5
16	24	2018	4	Giant	43	35
16	24	2018	56	Hollywood Super Market	64	33.5
16	25	2018	23	Western Beef	70	33.5
16	26	2018	30	SuperTarget	324	31.75
16	27	2018	21	Village Market Food Center	15	38.5
16	27	2018	98	Sunfresh Market	14	33.5
16	27	2018	103	Wayne's Hometown Market	28	33.5
16	28	2018	4	Giant	45	35
16	29	2018	7	SpartanNash	62	40
16	29	2018	30	SuperTarget	376	31.75
16	32	2018	4	Giant	47	35
16	32	2018	30	SuperTarget	344	31.75
16	32	2018	56	Hollywood Super Market	59	33.5
16	33	2018	63	Yoke's Fresh Market	81	33.5
16	33	2018	93	Coborns	40	33.5
16	34	2018	98	Sunfresh Market	14	33.5
16	35	2018	30	SuperTarget	319	31.75
16	36	2018	4	Giant	41	35
16	37	2018	20	Walmart	392	30
16	38	2018	7	SpartanNash	56	40
16	38	2018	30	SuperTarget	360	31.75
16	38	2018	61	Breaux Mart Supermarkets	27	33.5
16	40	2018	4	Giant	47	35
16	40	2018	56	Hollywood Super Market	59	33.5
16	40	2018	103	Wayne's Hometown Market	28	33.5
16	41	2018	30	SuperTarget	330	31.75
16	41	2018	98	Sunfresh Market	14	33.5
16	42	2018	23	Western Beef	69	33.5
16	43	2018	63	Yoke's Fresh Market	88	33.5
16	44	2018	4	Giant	48	35
16	44	2018	30	SuperTarget	384	31.75
16	44	2018	93	Coborns	41	33.5
16	45	2018	21	Village Market Food Center	15	38.5
16	47	2018	7	SpartanNash	60	40
16	47	2018	30	SuperTarget	330	31.75
16	48	2018	4	Giant	43	35
16	48	2018	56	Hollywood Super Market	53	33.5
16	48	2018	98	Sunfresh Market	15	33.5
16	50	2018	30	SuperTarget	356	31.75
16	52	2018	4	Giant	51	35
16	52	2018	20	Walmart	398	30
17	1	2018	5	Stop & Shop	146	282.5
17	1	2018	44	Foodland	101	247
17	1	2018	91	Big Y Foods	384	247
17	2	2018	30	SuperTarget	420	223.5
17	2	2018	86	Quality Foods	287	258.75
17	3	2018	63	Yoke's Fresh Market	303	282.5
17	5	2018	30	SuperTarget	390	223.5
17	5	2018	91	Big Y Foods	330	247
17	6	2018	5	Stop & Shop	174	282.5
17	6	2018	87	Sav-Mor Foods	266	282.5
17	7	2018	20	Walmart	1477	211.75
17	7	2018	55	Piggly Wiggly	45	235.25
17	8	2018	30	SuperTarget	427	223.5
17	9	2018	8	SuperValu Inc.	208	282.5
17	9	2018	91	Big Y Foods	376	247
17	10	2018	3	Hannaford	121	235.25
17	11	2018	5	Stop & Shop	162	282.5
17	11	2018	30	SuperTarget	454	223.5
17	11	2018	86	Quality Foods	285	258.75
17	12	2018	37	Fred Meyer	397	247
17	13	2018	44	Foodland	105	247
17	13	2018	63	Yoke's Fresh Market	324	282.5
17	13	2018	91	Big Y Foods	358	247
17	14	2018	18	Super Saver	404	341.25
17	14	2018	30	SuperTarget	401	223.5
17	15	2018	55	Piggly Wiggly	46	235.25
17	16	2018	5	Stop & Shop	154	282.5
17	17	2018	30	SuperTarget	369	223.5
17	17	2018	87	Sav-Mor Foods	304	282.5
17	17	2018	91	Big Y Foods	353	247
17	19	2018	8	SuperValu Inc.	218	282.5
17	20	2018	30	SuperTarget	425	223.5
17	20	2018	86	Quality Foods	261	258.75
17	21	2018	3	Hannaford	123	235.25
17	21	2018	5	Stop & Shop	185	282.5
17	21	2018	91	Big Y Foods	356	247
17	22	2018	20	Walmart	1480	211.75
17	23	2018	30	SuperTarget	421	223.5
17	23	2018	55	Piggly Wiggly	53	235.25
17	23	2018	63	Yoke's Fresh Market	298	282.5
17	25	2018	44	Foodland	88	247
17	25	2018	91	Big Y Foods	343	247
17	26	2018	5	Stop & Shop	165	282.5
17	26	2018	30	SuperTarget	364	223.5
17	28	2018	87	Sav-Mor Foods	313	282.5
17	29	2018	8	SuperValu Inc.	261	282.5
17	29	2018	18	Super Saver	431	341.25
17	29	2018	30	SuperTarget	435	223.5
17	29	2018	37	Fred Meyer	391	247
17	29	2018	86	Quality Foods	277	258.75
17	29	2018	91	Big Y Foods	343	247
17	31	2018	5	Stop & Shop	186	282.5
17	31	2018	55	Piggly Wiggly	51	235.25
17	32	2018	3	Hannaford	124	235.25
17	32	2018	30	SuperTarget	364	223.5
17	33	2018	63	Yoke's Fresh Market	353	282.5
17	33	2018	91	Big Y Foods	303	247
17	35	2018	30	SuperTarget	432	223.5
17	36	2018	5	Stop & Shop	178	282.5
17	37	2018	20	Walmart	1597	211.75
17	37	2018	44	Foodland	95	247
17	37	2018	91	Big Y Foods	337	247
17	38	2018	30	SuperTarget	422	223.5
17	38	2018	86	Quality Foods	255	258.75
17	39	2018	8	SuperValu Inc.	245	282.5
17	39	2018	55	Piggly Wiggly	46	235.25
17	39	2018	87	Sav-Mor Foods	294	282.5
17	41	2018	5	Stop & Shop	172	282.5
17	41	2018	30	SuperTarget	440	223.5
17	41	2018	91	Big Y Foods	375	247
17	43	2018	3	Hannaford	132	235.25
17	43	2018	63	Yoke's Fresh Market	371	282.5
17	44	2018	18	Super Saver	444	341.25
17	44	2018	30	SuperTarget	412	223.5
17	45	2018	91	Big Y Foods	332	247
17	46	2018	5	Stop & Shop	165	282.5
17	46	2018	37	Fred Meyer	430	247
17	47	2018	30	SuperTarget	385	223.5
17	47	2018	55	Piggly Wiggly	52	235.25
17	47	2018	86	Quality Foods	251	258.75
17	49	2018	8	SuperValu Inc.	221	282.5
17	49	2018	44	Foodland	91	247
17	49	2018	91	Big Y Foods	341	247
17	50	2018	30	SuperTarget	436	223.5
17	50	2018	87	Sav-Mor Foods	253	282.5
17	51	2018	5	Stop & Shop	178	282.5
17	52	2018	20	Walmart	1391	211.75
18	2	2018	30	SuperTarget	123	215.5
18	3	2018	24	Chappells Hometown Foods	6	226.75
18	3	2018	41	Arlan's Market	7	238.25
18	3	2018	63	Yoke's Fresh Market	7	249.5
18	3	2018	76	Ingles Markets	13	261
18	4	2018	72	Acme Fresh Market	16	261
18	5	2018	30	SuperTarget	120	215.5
18	6	2018	59	Meijer	21	238.25
18	7	2018	20	Walmart	116	204.25
18	8	2018	30	SuperTarget	108	215.5
18	8	2018	41	Arlan's Market	7	238.25
18	8	2018	76	Ingles Markets	15	261
18	9	2018	72	Acme Fresh Market	15	261
18	10	2018	11	Sunflower Farmers Market	5	249.5
18	10	2018	66	McCaffrey's	13	272.25
18	11	2018	24	Chappells Hometown Foods	5	226.75
18	11	2018	30	SuperTarget	115	215.5
18	12	2018	29	Felpausch	5	226.75
18	13	2018	41	Arlan's Market	6	238.25
18	13	2018	63	Yoke's Fresh Market	8	249.5
18	13	2018	76	Ingles Markets	16	261
18	14	2018	30	SuperTarget	125	215.5
18	14	2018	72	Acme Fresh Market	17	261
18	17	2018	30	SuperTarget	114	215.5
18	18	2018	41	Arlan's Market	6	238.25
18	18	2018	65	The Fresh Grocer	9	226.75
18	18	2018	76	Ingles Markets	14	261
18	19	2018	24	Chappells Hometown Foods	6	226.75
18	19	2018	72	Acme Fresh Market	18	261
18	20	2018	30	SuperTarget	110	215.5
18	20	2018	59	Meijer	21	238.25
18	22	2018	20	Walmart	105	204.25
18	23	2018	11	Sunflower Farmers Market	4	249.5
18	23	2018	30	SuperTarget	110	215.5
18	23	2018	41	Arlan's Market	7	238.25
18	23	2018	63	Yoke's Fresh Market	9	249.5
18	23	2018	76	Ingles Markets	14	261
18	24	2018	66	McCaffrey's	13	272.25
18	24	2018	72	Acme Fresh Market	16	261
18	26	2018	30	SuperTarget	115	215.5
18	27	2018	24	Chappells Hometown Foods	6	226.75
18	28	2018	41	Arlan's Market	7	238.25
18	28	2018	76	Ingles Markets	14	261
18	29	2018	30	SuperTarget	136	215.5
18	29	2018	72	Acme Fresh Market	19	261
18	30	2018	29	Felpausch	5	226.75
18	32	2018	30	SuperTarget	116	215.5
18	33	2018	41	Arlan's Market	8	238.25
18	33	2018	63	Yoke's Fresh Market	8	249.5
18	33	2018	76	Ingles Markets	15	261
18	34	2018	59	Meijer	20	238.25
18	34	2018	72	Acme Fresh Market	18	261
18	35	2018	24	Chappells Hometown Foods	6	226.75
18	35	2018	30	SuperTarget	129	215.5
18	36	2018	11	Sunflower Farmers Market	5	249.5
18	37	2018	20	Walmart	119	204.25
18	37	2018	65	The Fresh Grocer	9	226.75
18	38	2018	30	SuperTarget	129	215.5
18	38	2018	41	Arlan's Market	7	238.25
18	38	2018	66	McCaffrey's	12	272.25
18	38	2018	76	Ingles Markets	16	261
18	39	2018	72	Acme Fresh Market	16	261
18	41	2018	30	SuperTarget	128	215.5
18	43	2018	24	Chappells Hometown Foods	7	226.75
18	43	2018	41	Arlan's Market	8	238.25
18	43	2018	63	Yoke's Fresh Market	9	249.5
18	43	2018	76	Ingles Markets	15	261
18	44	2018	30	SuperTarget	139	215.5
18	44	2018	72	Acme Fresh Market	15	261
18	47	2018	30	SuperTarget	114	215.5
18	48	2018	29	Felpausch	5	226.75
18	48	2018	41	Arlan's Market	7	238.25
18	48	2018	59	Meijer	22	238.25
18	48	2018	76	Ingles Markets	15	261
18	49	2018	11	Sunflower Farmers Market	6	249.5
18	49	2018	72	Acme Fresh Market	15	261
18	50	2018	30	SuperTarget	112	215.5
18	51	2018	24	Chappells Hometown Foods	6	226.75
18	52	2018	20	Walmart	123	204.25
18	52	2018	66	McCaffrey's	13	272.25
14	1	2018	5	Stop & Shop	51	268.25
14	2	2018	30	SuperTarget	326	254.75
14	4	2018	39	Fareway	149	268.25
14	5	2018	30	SuperTarget	347	254.75
14	6	2018	5	Stop & Shop	51	268.25
14	6	2018	67	Crosby's Marketplace	75	268.25
14	6	2018	75	Pick 'N Save	34	281.75
14	7	2018	20	Walmart	204	241.5
14	7	2018	74	Tom Thumb Food & Pharmacy	19	268.25
14	8	2018	30	SuperTarget	360	254.75
14	9	2018	21	Village Market Food Center	18	362.25
14	9	2018	92	Central Market	40	268.25
14	11	2018	5	Stop & Shop	54	268.25
14	11	2018	30	SuperTarget	348	254.75
14	12	2018	12	Scolari's Food and Drug	63	281.75
14	14	2018	30	SuperTarget	382	254.75
14	14	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	16	2018	5	Stop & Shop	55	268.25
14	17	2018	30	SuperTarget	332	254.75
14	17	2018	67	Crosby's Marketplace	78	268.25
14	18	2018	39	Fareway	132	268.25
14	20	2018	30	SuperTarget	371	254.75
14	21	2018	5	Stop & Shop	47	268.25
14	21	2018	74	Tom Thumb Food & Pharmacy	15	268.25
14	22	2018	20	Walmart	214	241.5
14	23	2018	30	SuperTarget	378	254.75
14	23	2018	75	Pick 'N Save	39	281.75
14	26	2018	5	Stop & Shop	49	268.25
14	26	2018	30	SuperTarget	326	254.75
14	27	2018	21	Village Market Food Center	20	362.25
14	27	2018	92	Central Market	41	268.25
14	28	2018	12	Scolari's Food and Drug	63	281.75
14	28	2018	67	Crosby's Marketplace	77	268.25
14	28	2018	74	Tom Thumb Food & Pharmacy	16	268.25
14	29	2018	30	SuperTarget	370	254.75
14	31	2018	5	Stop & Shop	49	268.25
14	32	2018	30	SuperTarget	356	254.75
14	32	2018	39	Fareway	148	268.25
14	35	2018	30	SuperTarget	344	254.75
14	35	2018	74	Tom Thumb Food & Pharmacy	16	268.25
14	36	2018	5	Stop & Shop	53	268.25
14	37	2018	20	Walmart	220	241.5
14	38	2018	30	SuperTarget	330	254.75
14	39	2018	67	Crosby's Marketplace	74	268.25
14	40	2018	75	Pick 'N Save	39	281.75
14	41	2018	5	Stop & Shop	48	268.25
14	41	2018	30	SuperTarget	282	254.75
14	42	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	44	2018	12	Scolari's Food and Drug	59	281.75
14	44	2018	30	SuperTarget	328	254.75
14	45	2018	21	Village Market Food Center	17	362.25
14	45	2018	92	Central Market	41	268.25
14	46	2018	5	Stop & Shop	48	268.25
14	46	2018	39	Fareway	122	268.25
14	47	2018	30	SuperTarget	296	254.75
14	49	2018	74	Tom Thumb Food & Pharmacy	17	268.25
14	50	2018	30	SuperTarget	296	254.75
14	50	2018	67	Crosby's Marketplace	87	268.25
14	51	2018	5	Stop & Shop	46	268.25
14	52	2018	20	Walmart	208	241.5
12113456	2	2018	30	SuperTarget	138	136
12113456	2	2018	84	Mac's Fresh Market	31	143.25
12113456	3	2018	33	Lauer's Supermarket and Bakery	28	157.5
12113456	4	2018	17	Broulims	31	164.75
12113456	5	2018	30	SuperTarget	113	136
12113456	7	2018	20	Walmart	355	128.75
12113456	7	2018	27	Nam Dae Mun Farmers Market	25	157.5
12113456	7	2018	40	Buehler's Buy-Low	33	143.25
12113456	8	2018	30	SuperTarget	118	136
12113456	8	2018	33	Lauer's Supermarket and Bakery	30	157.5
12113456	9	2018	95	Cost Cutter	68	143.25
12113456	10	2018	77	Woodman's Food Market	18	164.75
12113456	11	2018	30	SuperTarget	110	136
12113456	11	2018	31	Compare Foods Supermarket	26	143.25
12113456	12	2018	17	Broulims	27	164.75
12113456	12	2018	84	Mac's Fresh Market	31	143.25
12113456	13	2018	33	Lauer's Supermarket and Bakery	32	157.5
12113456	14	2018	30	SuperTarget	108	136
12113456	17	2018	30	SuperTarget	130	136
12113456	17	2018	40	Buehler's Buy-Low	28	143.25
12113456	18	2018	33	Lauer's Supermarket and Bakery	35	157.5
12113456	20	2018	17	Broulims	31	164.75
12113456	20	2018	30	SuperTarget	118	136
12113456	20	2018	95	Cost Cutter	55	143.25
12113456	21	2018	27	Nam Dae Mun Farmers Market	26	157.5
12113456	22	2018	20	Walmart	400	128.75
12113456	22	2018	84	Mac's Fresh Market	33	143.25
12113456	23	2018	30	SuperTarget	106	136
12113456	23	2018	33	Lauer's Supermarket and Bakery	35	157.5
12113456	23	2018	77	Woodman's Food Market	20	164.75
12113456	26	2018	30	SuperTarget	114	136
12113456	26	2018	31	Compare Foods Supermarket	35	143.25
12113456	27	2018	40	Buehler's Buy-Low	31	143.25
12113456	28	2018	17	Broulims	32	164.75
12113456	28	2018	33	Lauer's Supermarket and Bakery	31	157.5
12113456	29	2018	30	SuperTarget	114	136
12113456	31	2018	95	Cost Cutter	58	143.25
12113456	32	2018	30	SuperTarget	118	136
12113456	32	2018	84	Mac's Fresh Market	29	143.25
12113456	33	2018	33	Lauer's Supermarket and Bakery	31	157.5
12113456	35	2018	27	Nam Dae Mun Farmers Market	26	157.5
12113456	35	2018	30	SuperTarget	112	136
12113456	36	2018	17	Broulims	36	164.75
12113456	36	2018	77	Woodman's Food Market	19	164.75
12113456	37	2018	20	Walmart	337	128.75
12113456	37	2018	40	Buehler's Buy-Low	28	143.25
12113456	38	2018	30	SuperTarget	114	136
12113456	38	2018	33	Lauer's Supermarket and Bakery	30	157.5
12113456	41	2018	30	SuperTarget	125	136
12113456	41	2018	31	Compare Foods Supermarket	31	143.25
12113456	42	2018	84	Mac's Fresh Market	28	143.25
12113456	42	2018	95	Cost Cutter	57	143.25
12113456	43	2018	33	Lauer's Supermarket and Bakery	31	157.5
12113456	44	2018	17	Broulims	31	164.75
12113456	44	2018	30	SuperTarget	141	136
12113456	47	2018	30	SuperTarget	142	136
12113456	47	2018	40	Buehler's Buy-Low	34	143.25
12113456	48	2018	33	Lauer's Supermarket and Bakery	27	157.5
12113456	49	2018	27	Nam Dae Mun Farmers Market	25	157.5
12113456	49	2018	77	Woodman's Food Market	19	164.75
12113456	50	2018	30	SuperTarget	119	136
12113456	52	2018	17	Broulims	35	164.75
12113456	52	2018	20	Walmart	351	128.75
12113456	52	2018	84	Mac's Fresh Market	30	143.25
12113457	1	2018	15	Brown & Cole	304	111.25
12113457	1	2018	91	Big Y Foods	484	105.75
12113457	2	2018	13	Brookshire Grocery Company	177	105.75
12113457	2	2018	30	SuperTarget	1498	100.5
12113457	2	2018	58	Red Apple	401	105.75
12113457	3	2018	33	Lauer's Supermarket and Bakery	468	105.75
12113457	4	2018	15	Brown & Cole	286	111.25
12113457	5	2018	30	SuperTarget	1481	100.5
12113457	5	2018	91	Big Y Foods	467	105.75
12113457	6	2018	70	Zup's	67	111.25
12113457	6	2018	98	Sunfresh Market	54	111.25
12113457	7	2018	15	Brown & Cole	294	111.25
12113457	7	2018	20	Walmart	872	95.25
12113457	7	2018	27	Nam Dae Mun Farmers Market	134	105.75
12113457	8	2018	30	SuperTarget	1310	100.5
12113457	8	2018	33	Lauer's Supermarket and Bakery	407	105.75
12113457	9	2018	91	Big Y Foods	505	105.75
12113457	10	2018	15	Brown & Cole	274	111.25
12113457	11	2018	30	SuperTarget	1571	100.5
12113457	12	2018	58	Red Apple	350	105.75
12113457	12	2018	70	Zup's	69	111.25
12113457	13	2018	15	Brown & Cole	298	111.25
12113457	13	2018	26	Market Basket	424	111.25
12113457	13	2018	33	Lauer's Supermarket and Bakery	488	105.75
12113457	13	2018	91	Big Y Foods	492	105.75
12113457	13	2018	98	Sunfresh Market	49	111.25
12113457	14	2018	30	SuperTarget	1473	100.5
12113457	16	2018	13	Brookshire Grocery Company	174	105.75
12113457	16	2018	15	Brown & Cole	269	111.25
12113457	17	2018	30	SuperTarget	1477	100.5
12113457	17	2018	91	Big Y Foods	441	105.75
12113457	18	2018	33	Lauer's Supermarket and Bakery	513	105.75
12113457	18	2018	70	Zup's	65	111.25
12113457	19	2018	10	C-Town	285	111.25
12113457	19	2018	15	Brown & Cole	292	111.25
12113457	20	2018	30	SuperTarget	1645	100.5
12113457	20	2018	98	Sunfresh Market	47	111.25
12113457	21	2018	27	Nam Dae Mun Farmers Market	127	105.75
12113457	21	2018	91	Big Y Foods	513	105.75
12113457	22	2018	15	Brown & Cole	262	111.25
12113457	22	2018	20	Walmart	692	95.25
12113457	22	2018	58	Red Apple	379	105.75
12113457	23	2018	30	SuperTarget	1359	100.5
12113457	23	2018	33	Lauer's Supermarket and Bakery	508	105.75
12113457	24	2018	70	Zup's	79	111.25
12113457	25	2018	15	Brown & Cole	299	111.25
12113457	25	2018	91	Big Y Foods	503	105.75
12113457	26	2018	30	SuperTarget	1603	100.5
12113457	27	2018	26	Market Basket	423	111.25
12113457	27	2018	98	Sunfresh Market	46	111.25
12113457	28	2018	15	Brown & Cole	330	111.25
12113457	28	2018	33	Lauer's Supermarket and Bakery	401	105.75
12113457	29	2018	30	SuperTarget	1467	100.5
12113457	29	2018	91	Big Y Foods	417	105.75
12113457	30	2018	13	Brookshire Grocery Company	194	105.75
12113457	30	2018	70	Zup's	74	111.25
12113457	31	2018	15	Brown & Cole	296	111.25
12113457	32	2018	30	SuperTarget	1540	100.5
12113457	32	2018	58	Red Apple	395	105.75
12113457	33	2018	33	Lauer's Supermarket and Bakery	456	105.75
12113457	33	2018	91	Big Y Foods	465	105.75
12113457	34	2018	15	Brown & Cole	288	111.25
12113457	34	2018	98	Sunfresh Market	54	111.25
12113457	35	2018	27	Nam Dae Mun Farmers Market	136	105.75
12113457	35	2018	30	SuperTarget	1321	100.5
12113457	36	2018	70	Zup's	74	111.25
12113457	37	2018	15	Brown & Cole	330	111.25
12113457	37	2018	20	Walmart	721	95.25
12113457	37	2018	91	Big Y Foods	422	105.75
12113457	38	2018	10	C-Town	254	111.25
12113457	38	2018	30	SuperTarget	1444	100.5
12113457	38	2018	33	Lauer's Supermarket and Bakery	449	105.75
12113457	40	2018	15	Brown & Cole	330	111.25
12113457	41	2018	26	Market Basket	434	111.25
12113457	41	2018	30	SuperTarget	1330	100.5
12113457	41	2018	91	Big Y Foods	454	105.75
12113457	41	2018	98	Sunfresh Market	54	111.25
12113457	42	2018	58	Red Apple	374	105.75
12113457	42	2018	70	Zup's	75	111.25
12113457	43	2018	15	Brown & Cole	275	111.25
12113457	43	2018	33	Lauer's Supermarket and Bakery	437	105.75
12113457	44	2018	13	Brookshire Grocery Company	176	105.75
12113457	44	2018	30	SuperTarget	1454	100.5
12113457	45	2018	91	Big Y Foods	460	105.75
12113457	46	2018	15	Brown & Cole	320	111.25
12113457	47	2018	30	SuperTarget	1462	100.5
12113457	48	2018	33	Lauer's Supermarket and Bakery	394	105.75
12113457	48	2018	70	Zup's	66	111.25
12113457	48	2018	98	Sunfresh Market	59	111.25
12113457	49	2018	15	Brown & Cole	288	111.25
12113457	49	2018	27	Nam Dae Mun Farmers Market	126	105.75
12113457	49	2018	91	Big Y Foods	401	105.75
12113457	50	2018	30	SuperTarget	1297	100.5
12113457	52	2018	15	Brown & Cole	267	111.25
12113457	52	2018	20	Walmart	968	95.25
12113457	52	2018	58	Red Apple	437	105.75
12113458	1	2018	103	Wayne's Hometown Market	101	65.5
12113458	2	2018	30	SuperTarget	442	56.5
12113458	2	2018	61	Breaux Mart Supermarkets	259	65.5
12113458	2	2018	84	Mac's Fresh Market	398	62.5
12113458	3	2018	41	Arlan's Market	113	62.5
12113458	3	2018	53	DeCicco Family Market	175	65.5
12113458	3	2018	64	Big M	85	68.5
12113458	3	2018	76	Ingles Markets	360	74.5
12113458	3	2018	102	Matherne's Supermarkets	184	59.5
12113458	5	2018	30	SuperTarget	374	56.5
12113458	6	2018	75	Pick 'N Save	135	59.5
12113458	6	2018	87	Sav-Mor Foods	202	77.5
12113458	7	2018	20	Walmart	523	53.5
12113458	8	2018	30	SuperTarget	387	56.5
12113458	8	2018	41	Arlan's Market	121	62.5
12113458	8	2018	56	Hollywood Super Market	142	62.5
12113458	8	2018	76	Ingles Markets	334	74.5
12113458	9	2018	64	Big M	98	68.5
12113458	9	2018	71	Remke Markets	417	59.5
12113458	9	2018	102	Matherne's Supermarkets	181	59.5
12113458	10	2018	16	K-VA-T Food Stores	264	65.5
12113458	11	2018	30	SuperTarget	387	56.5
12113458	12	2018	84	Mac's Fresh Market	443	62.5
12113458	13	2018	41	Arlan's Market	118	62.5
12113458	13	2018	76	Ingles Markets	322	74.5
12113458	14	2018	30	SuperTarget	414	56.5
12113458	14	2018	103	Wayne's Hometown Market	105	65.5
12113458	15	2018	64	Big M	95	68.5
12113458	15	2018	102	Matherne's Supermarkets	158	59.5
12113458	16	2018	56	Hollywood Super Market	165	62.5
12113458	17	2018	30	SuperTarget	410	56.5
12113458	17	2018	53	DeCicco Family Market	157	65.5
12113458	17	2018	87	Sav-Mor Foods	206	77.5
12113458	18	2018	41	Arlan's Market	102	62.5
12113458	18	2018	54	Gelson's Markets	427	59.5
12113458	18	2018	76	Ingles Markets	364	74.5
12113458	20	2018	30	SuperTarget	376	56.5
12113458	20	2018	61	Breaux Mart Supermarkets	242	65.5
12113458	21	2018	64	Big M	105	68.5
12113458	21	2018	102	Matherne's Supermarkets	176	59.5
12113458	22	2018	20	Walmart	535	53.5
12113458	22	2018	84	Mac's Fresh Market	439	62.5
12113458	23	2018	16	K-VA-T Food Stores	291	65.5
12113458	23	2018	30	SuperTarget	379	56.5
12113458	23	2018	41	Arlan's Market	116	62.5
12113458	23	2018	75	Pick 'N Save	133	59.5
12113458	23	2018	76	Ingles Markets	309	74.5
12113458	24	2018	56	Hollywood Super Market	163	62.5
12113458	26	2018	30	SuperTarget	417	56.5
12113458	27	2018	64	Big M	113	68.5
12113458	27	2018	102	Matherne's Supermarkets	177	59.5
12113458	27	2018	103	Wayne's Hometown Market	102	65.5
12113458	28	2018	41	Arlan's Market	120	62.5
12113458	28	2018	71	Remke Markets	465	59.5
12113458	28	2018	76	Ingles Markets	340	74.5
12113458	28	2018	87	Sav-Mor Foods	241	77.5
12113458	29	2018	30	SuperTarget	405	56.5
12113458	31	2018	53	DeCicco Family Market	135	65.5
12113458	32	2018	30	SuperTarget	357	56.5
12113458	32	2018	56	Hollywood Super Market	154	62.5
12113458	32	2018	84	Mac's Fresh Market	432	62.5
12113458	33	2018	41	Arlan's Market	129	62.5
12113458	33	2018	64	Big M	95	68.5
12113458	33	2018	76	Ingles Markets	324	74.5
12113458	33	2018	102	Matherne's Supermarkets	149	59.5
12113458	35	2018	30	SuperTarget	420	56.5
12113458	36	2018	16	K-VA-T Food Stores	267	65.5
12113458	36	2018	54	Gelson's Markets	398	59.5
12113458	37	2018	20	Walmart	486	53.5
12113458	38	2018	30	SuperTarget	420	56.5
12113458	38	2018	41	Arlan's Market	117	62.5
12113458	38	2018	61	Breaux Mart Supermarkets	257	65.5
12113458	38	2018	76	Ingles Markets	303	74.5
12113458	39	2018	64	Big M	100	68.5
12113458	39	2018	87	Sav-Mor Foods	235	77.5
12113458	39	2018	102	Matherne's Supermarkets	156	59.5
12113458	40	2018	56	Hollywood Super Market	130	62.5
12113458	40	2018	75	Pick 'N Save	159	59.5
12113458	40	2018	103	Wayne's Hometown Market	106	65.5
12113458	41	2018	30	SuperTarget	361	56.5
12113458	42	2018	84	Mac's Fresh Market	479	62.5
12113458	43	2018	41	Arlan's Market	137	62.5
12113458	43	2018	76	Ingles Markets	351	74.5
12113458	44	2018	30	SuperTarget	363	56.5
12113458	45	2018	53	DeCicco Family Market	156	65.5
12113458	45	2018	64	Big M	94	68.5
12113458	45	2018	102	Matherne's Supermarkets	193	59.5
12113458	47	2018	30	SuperTarget	395	56.5
12113458	47	2018	71	Remke Markets	389	59.5
12113458	48	2018	41	Arlan's Market	116	62.5
12113458	48	2018	56	Hollywood Super Market	124	62.5
12113458	48	2018	76	Ingles Markets	343	74.5
12113458	49	2018	16	K-VA-T Food Stores	267	65.5
12113458	50	2018	30	SuperTarget	444	56.5
12113458	50	2018	87	Sav-Mor Foods	223	77.5
12113458	51	2018	64	Big M	106	68.5
12113458	51	2018	102	Matherne's Supermarkets	182	59.5
12113458	52	2018	20	Walmart	548	53.5
12113458	52	2018	84	Mac's Fresh Market	463	62.5
12311459	2	2018	30	SuperTarget	12	199.25
12311459	2	2018	32	Pueblo	3	209.75
12311459	2	2018	34	Mayfair Markets	1	209.75
12311459	2	2018	85	ShopRite	3	209.75
12311459	3	2018	41	Arlan's Market	1	209.75
12311459	3	2018	76	Ingles Markets	3	230.75
12311459	4	2018	4	Giant	7	241.25
12311459	4	2018	42	Sack&Save	2	209.75
12311459	5	2018	30	SuperTarget	12	199.25
12311459	5	2018	34	Mayfair Markets	1	209.75
12311459	6	2018	87	Sav-Mor Foods	2	230.75
12311459	7	2018	20	Walmart	24	188.75
12311459	8	2018	4	Giant	6	241.25
12311459	8	2018	30	SuperTarget	12	199.25
12311459	8	2018	34	Mayfair Markets	1	209.75
12311459	8	2018	41	Arlan's Market	1	209.75
12311459	8	2018	42	Sack&Save	3	209.75
12311459	8	2018	76	Ingles Markets	4	230.75
12311459	10	2018	32	Pueblo	3	209.75
12311459	11	2018	30	SuperTarget	11	199.25
12311459	11	2018	34	Mayfair Markets	2	209.75
12311459	12	2018	4	Giant	7	241.25
12311459	12	2018	42	Sack&Save	3	209.75
12311459	12	2018	48	Miller's Fresh Foods	5	230.75
12311459	13	2018	26	Market Basket	5	209.75
12311459	13	2018	41	Arlan's Market	1	209.75
12311459	13	2018	76	Ingles Markets	4	230.75
12311459	14	2018	30	SuperTarget	14	199.25
12311459	14	2018	34	Mayfair Markets	1	209.75
12311459	16	2018	4	Giant	6	241.25
12311459	16	2018	42	Sack&Save	3	209.75
12311459	17	2018	30	SuperTarget	14	199.25
12311459	17	2018	34	Mayfair Markets	2	209.75
12311459	17	2018	87	Sav-Mor Foods	1	230.75
12311459	18	2018	32	Pueblo	3	209.75
12311459	18	2018	41	Arlan's Market	1	209.75
12311459	18	2018	76	Ingles Markets	4	230.75
12311459	20	2018	4	Giant	6	241.25
12311459	20	2018	30	SuperTarget	13	199.25
12311459	20	2018	34	Mayfair Markets	2	209.75
12311459	20	2018	42	Sack&Save	2	209.75
12311459	20	2018	85	ShopRite	3	209.75
12311459	22	2018	20	Walmart	28	188.75
12311459	23	2018	30	SuperTarget	13	199.25
12311459	23	2018	34	Mayfair Markets	2	209.75
12311459	23	2018	41	Arlan's Market	1	209.75
12311459	23	2018	76	Ingles Markets	3	230.75
12311459	24	2018	4	Giant	6	241.25
12311459	24	2018	42	Sack&Save	3	209.75
12311459	26	2018	30	SuperTarget	12	199.25
12311459	26	2018	32	Pueblo	3	209.75
12311459	26	2018	34	Mayfair Markets	2	209.75
12311459	27	2018	26	Market Basket	5	209.75
12311459	28	2018	4	Giant	6	241.25
12311459	28	2018	41	Arlan's Market	1	209.75
12311459	28	2018	42	Sack&Save	3	209.75
12311459	28	2018	76	Ingles Markets	4	230.75
12311459	28	2018	87	Sav-Mor Foods	1	230.75
12311459	29	2018	30	SuperTarget	14	199.25
12311459	29	2018	34	Mayfair Markets	2	209.75
12311459	29	2018	48	Miller's Fresh Foods	5	230.75
12311459	32	2018	4	Giant	5	241.25
12311459	32	2018	30	SuperTarget	13	199.25
12311459	32	2018	34	Mayfair Markets	2	209.75
12311459	32	2018	42	Sack&Save	2	209.75
12311459	33	2018	41	Arlan's Market	1	209.75
12311459	33	2018	76	Ingles Markets	4	230.75
12311459	34	2018	32	Pueblo	3	209.75
12311459	35	2018	30	SuperTarget	13	199.25
12311459	35	2018	34	Mayfair Markets	2	209.75
12311459	36	2018	4	Giant	5	241.25
12311459	36	2018	42	Sack&Save	2	209.75
12311459	37	2018	20	Walmart	31	188.75
12311459	38	2018	30	SuperTarget	16	199.25
12311459	38	2018	34	Mayfair Markets	2	209.75
12311459	38	2018	41	Arlan's Market	1	209.75
12311459	38	2018	76	Ingles Markets	4	230.75
12311459	38	2018	85	ShopRite	3	209.75
12311459	39	2018	87	Sav-Mor Foods	2	230.75
12311459	40	2018	4	Giant	5	241.25
12311459	40	2018	42	Sack&Save	3	209.75
12311459	41	2018	26	Market Basket	5	209.75
12311459	41	2018	30	SuperTarget	13	199.25
12311459	41	2018	34	Mayfair Markets	2	209.75
12311459	42	2018	32	Pueblo	3	209.75
12311459	43	2018	41	Arlan's Market	1	209.75
12311459	43	2018	76	Ingles Markets	3	230.75
12311459	44	2018	4	Giant	5	241.25
12311459	44	2018	30	SuperTarget	15	199.25
12311459	44	2018	34	Mayfair Markets	2	209.75
12311459	44	2018	42	Sack&Save	2	209.75
12311459	46	2018	48	Miller's Fresh Foods	5	230.75
12311459	47	2018	30	SuperTarget	15	199.25
12311459	47	2018	34	Mayfair Markets	1	209.75
12311459	48	2018	4	Giant	5	241.25
12311459	48	2018	41	Arlan's Market	1	209.75
12311459	48	2018	42	Sack&Save	2	209.75
12311459	48	2018	76	Ingles Markets	4	230.75
12311459	50	2018	30	SuperTarget	15	199.25
12311459	50	2018	32	Pueblo	3	209.75
12311459	50	2018	34	Mayfair Markets	1	209.75
12311459	50	2018	87	Sav-Mor Foods	2	230.75
12311459	52	2018	4	Giant	6	241.25
12311459	52	2018	20	Walmart	30	188.75
12311459	52	2018	42	Sack&Save	2	209.75
12113460	1	2018	25	Hank's Market	15	40.75
12113460	2	2018	30	SuperTarget	319	36.75
12113460	4	2018	60	Super Dollar Discount Foods	12	42.75
12113460	5	2018	30	SuperTarget	345	36.75
12113460	5	2018	78	Dahl's Foods	39	38.75
12113460	6	2018	97	Trade Fair	14	42.75
12113460	7	2018	20	Walmart	103	35
12113460	7	2018	74	Tom Thumb Food & Pharmacy	41	44.5
12113460	7	2018	100	Shaw's and Star Market	57	48.5
12113460	8	2018	30	SuperTarget	313	36.75
12113460	9	2018	92	Central Market	50	46.5
12113460	9	2018	99	Strack & Van Til	61	38.75
12113460	9	2018	101	Gristedes	60	40.75
12113460	10	2018	60	Super Dollar Discount Foods	13	42.75
12113460	11	2018	30	SuperTarget	340	36.75
12113460	12	2018	29	Felpausch	28	38.75
12113460	12	2018	48	Miller's Fresh Foods	66	44.5
12113460	13	2018	50	Sav-A-Lot	41	42.75
12113460	14	2018	18	Super Saver	74	46.5
12113460	14	2018	30	SuperTarget	300	36.75
12113460	14	2018	74	Tom Thumb Food & Pharmacy	37	44.5
12113460	14	2018	100	Shaw's and Star Market	49	48.5
12113460	16	2018	60	Super Dollar Discount Foods	14	42.75
12113460	17	2018	30	SuperTarget	360	36.75
12113460	18	2018	54	Gelson's Markets	30	42.75
12113460	18	2018	99	Strack & Van Til	71	38.75
12113460	19	2018	10	C-Town	34	38.75
12113460	19	2018	78	Dahl's Foods	37	38.75
12113460	19	2018	97	Trade Fair	14	42.75
12113460	19	2018	101	Gristedes	64	40.75
12113460	20	2018	25	Hank's Market	17	40.75
12113460	20	2018	30	SuperTarget	344	36.75
12113460	21	2018	74	Tom Thumb Food & Pharmacy	37	44.5
12113460	21	2018	100	Shaw's and Star Market	48	48.5
12113460	22	2018	20	Walmart	117	35
12113460	22	2018	60	Super Dollar Discount Foods	14	42.75
12113460	23	2018	30	SuperTarget	369	36.75
12113460	26	2018	30	SuperTarget	347	36.75
12113460	26	2018	50	Sav-A-Lot	40	42.75
12113460	27	2018	92	Central Market	68	46.5
12113460	27	2018	99	Strack & Van Til	71	38.75
12113460	28	2018	60	Super Dollar Discount Foods	16	42.75
12113460	28	2018	74	Tom Thumb Food & Pharmacy	38	44.5
12113460	28	2018	100	Shaw's and Star Market	52	48.5
12113460	29	2018	18	Super Saver	71	46.5
12113460	29	2018	30	SuperTarget	335	36.75
12113460	29	2018	48	Miller's Fresh Foods	69	44.5
12113460	29	2018	101	Gristedes	62	40.75
12113460	30	2018	29	Felpausch	27	38.75
12113460	32	2018	30	SuperTarget	342	36.75
12113460	32	2018	97	Trade Fair	16	42.75
12113460	33	2018	78	Dahl's Foods	32	38.75
12113460	34	2018	60	Super Dollar Discount Foods	15	42.75
12113460	35	2018	30	SuperTarget	312	36.75
12113460	35	2018	74	Tom Thumb Food & Pharmacy	38	44.5
12113460	35	2018	100	Shaw's and Star Market	46	48.5
12113460	36	2018	54	Gelson's Markets	32	42.75
12113460	36	2018	99	Strack & Van Til	67	38.75
12113460	37	2018	20	Walmart	112	35
12113460	38	2018	10	C-Town	37	38.75
12113460	38	2018	30	SuperTarget	385	36.75
12113460	39	2018	25	Hank's Market	18	40.75
12113460	39	2018	50	Sav-A-Lot	40	42.75
12113460	39	2018	101	Gristedes	56	40.75
12113460	40	2018	60	Super Dollar Discount Foods	16	42.75
12113460	41	2018	30	SuperTarget	373	36.75
12113460	42	2018	74	Tom Thumb Food & Pharmacy	42	44.5
12113460	42	2018	100	Shaw's and Star Market	56	48.5
12113460	44	2018	18	Super Saver	68	46.5
12113460	44	2018	30	SuperTarget	385	36.75
12113460	45	2018	92	Central Market	70	46.5
12113460	45	2018	97	Trade Fair	13	42.75
12113460	45	2018	99	Strack & Van Til	70	38.75
12113460	46	2018	48	Miller's Fresh Foods	66	44.5
12113460	46	2018	60	Super Dollar Discount Foods	13	42.75
12113460	47	2018	30	SuperTarget	349	36.75
12113460	47	2018	78	Dahl's Foods	37	38.75
12113460	48	2018	29	Felpausch	30	38.75
12113460	49	2018	74	Tom Thumb Food & Pharmacy	42	44.5
12113460	49	2018	100	Shaw's and Star Market	48	48.5
12113460	49	2018	101	Gristedes	67	40.75
12113460	50	2018	30	SuperTarget	335	36.75
12113460	52	2018	20	Walmart	105	35
12113460	52	2018	50	Sav-A-Lot	39	42.75
12113460	52	2018	60	Super Dollar Discount Foods	15	42.75
12311461	1	2018	15	Brown & Cole	19	174.5
12311461	2	2018	30	SuperTarget	182	165.75
12311461	4	2018	15	Brown & Cole	17	174.5
12311461	5	2018	30	SuperTarget	208	165.75
12311461	5	2018	49	FoodMaxx	23	200.5
12311461	7	2018	15	Brown & Cole	19	174.5
12311461	7	2018	20	Walmart	156	157
12311461	7	2018	27	Nam Dae Mun Farmers Market	17	218
12311461	8	2018	30	SuperTarget	180	165.75
12311461	10	2018	11	Sunflower Farmers Market	7	192
12311461	10	2018	15	Brown & Cole	19	174.5
12311461	10	2018	49	FoodMaxx	21	200.5
12311461	11	2018	30	SuperTarget	189	165.75
12311461	13	2018	15	Brown & Cole	20	174.5
12311461	14	2018	30	SuperTarget	210	165.75
12311461	15	2018	49	FoodMaxx	22	200.5
12311461	16	2018	15	Brown & Cole	19	174.5
12311461	17	2018	30	SuperTarget	216	165.75
12311461	19	2018	15	Brown & Cole	21	174.5
12311461	20	2018	30	SuperTarget	186	165.75
12311461	20	2018	49	FoodMaxx	20	200.5
12311461	21	2018	27	Nam Dae Mun Farmers Market	20	218
12311461	22	2018	15	Brown & Cole	20	174.5
12311461	22	2018	20	Walmart	150	157
12311461	23	2018	11	Sunflower Farmers Market	9	192
12311461	23	2018	30	SuperTarget	201	165.75
12311461	25	2018	15	Brown & Cole	17	174.5
12311461	25	2018	49	FoodMaxx	19	200.5
12311461	26	2018	30	SuperTarget	200	165.75
12311461	28	2018	15	Brown & Cole	20	174.5
12311461	29	2018	30	SuperTarget	216	165.75
12311461	30	2018	49	FoodMaxx	20	200.5
12311461	31	2018	15	Brown & Cole	18	174.5
12311461	32	2018	30	SuperTarget	242	165.75
12311461	34	2018	15	Brown & Cole	17	174.5
12311461	35	2018	27	Nam Dae Mun Farmers Market	21	218
12311461	35	2018	30	SuperTarget	231	165.75
12311461	35	2018	49	FoodMaxx	19	200.5
12311461	36	2018	11	Sunflower Farmers Market	8	192
12311461	37	2018	15	Brown & Cole	20	174.5
12311461	37	2018	20	Walmart	156	157
12311461	38	2018	30	SuperTarget	210	165.75
12311461	40	2018	15	Brown & Cole	18	174.5
12311461	40	2018	49	FoodMaxx	19	200.5
12311461	41	2018	30	SuperTarget	242	165.75
12311461	43	2018	15	Brown & Cole	19	174.5
12311461	44	2018	30	SuperTarget	254	165.75
12311461	45	2018	49	FoodMaxx	20	200.5
12311461	46	2018	15	Brown & Cole	16	174.5
12311461	47	2018	30	SuperTarget	224	165.75
12311461	49	2018	11	Sunflower Farmers Market	8	192
12311461	49	2018	15	Brown & Cole	17	174.5
12311461	49	2018	27	Nam Dae Mun Farmers Market	18	218
12311461	50	2018	30	SuperTarget	204	165.75
12311461	50	2018	49	FoodMaxx	22	200.5
12311461	52	2018	15	Brown & Cole	16	174.5
12311461	52	2018	20	Walmart	168	157
7911918	1	2018	91	Big Y Foods	251	340
7911918	2	2018	30	SuperTarget	948	269.25
7911918	2	2018	61	Breaux Mart Supermarkets	141	326
7911918	3	2018	63	Yoke's Fresh Market	200	283.25
7911918	4	2018	60	Super Dollar Discount Foods	69	368.5
7911918	5	2018	30	SuperTarget	944	269.25
7911918	5	2018	91	Big Y Foods	291	340
7911918	6	2018	59	Meijer	216	311.75
7911918	7	2018	20	Walmart	1021	255
7911918	7	2018	100	Shaw's and Star Market	214	340
7911918	8	2018	30	SuperTarget	913	269.25
7911918	9	2018	21	Village Market Food Center	66	311.75
7911918	9	2018	91	Big Y Foods	285	340
7911918	10	2018	60	Super Dollar Discount Foods	74	368.5
7911918	11	2018	30	SuperTarget	895	269.25
7911918	13	2018	63	Yoke's Fresh Market	203	283.25
7911918	13	2018	91	Big Y Foods	290	340
7911918	14	2018	30	SuperTarget	849	269.25
7911918	14	2018	100	Shaw's and Star Market	235	340
7911918	16	2018	60	Super Dollar Discount Foods	67	368.5
7911918	17	2018	30	SuperTarget	878	269.25
7911918	17	2018	91	Big Y Foods	305	340
7911918	18	2018	54	Gelson's Markets	83	283.25
7911918	20	2018	30	SuperTarget	942	269.25
7911918	20	2018	59	Meijer	250	311.75
7911918	20	2018	61	Breaux Mart Supermarkets	122	326
7911918	21	2018	91	Big Y Foods	341	340
7911918	21	2018	100	Shaw's and Star Market	201	340
7911918	22	2018	20	Walmart	994	255
7911918	22	2018	60	Super Dollar Discount Foods	79	368.5
7911918	23	2018	30	SuperTarget	1007	269.25
7911918	23	2018	63	Yoke's Fresh Market	264	283.25
7911918	25	2018	91	Big Y Foods	298	340
7911918	26	2018	30	SuperTarget	972	269.25
7911918	27	2018	21	Village Market Food Center	63	311.75
7911918	28	2018	60	Super Dollar Discount Foods	80	368.5
7911918	28	2018	100	Shaw's and Star Market	208	340
7911918	29	2018	30	SuperTarget	895	269.25
7911918	29	2018	91	Big Y Foods	318	340
7911918	32	2018	30	SuperTarget	853	269.25
7911918	33	2018	63	Yoke's Fresh Market	284	283.25
7911918	33	2018	91	Big Y Foods	345	340
7911918	34	2018	59	Meijer	226	311.75
7911918	34	2018	60	Super Dollar Discount Foods	84	368.5
7911918	35	2018	30	SuperTarget	863	269.25
7911918	35	2018	100	Shaw's and Star Market	215	340
7911918	36	2018	54	Gelson's Markets	97	283.25
7911918	37	2018	20	Walmart	1148	255
7911918	37	2018	91	Big Y Foods	328	340
7911918	38	2018	30	SuperTarget	876	269.25
7911918	38	2018	61	Breaux Mart Supermarkets	153	326
7911918	40	2018	60	Super Dollar Discount Foods	82	368.5
7911918	41	2018	30	SuperTarget	1019	269.25
7911918	41	2018	91	Big Y Foods	263	340
7911918	42	2018	100	Shaw's and Star Market	220	340
7911918	43	2018	63	Yoke's Fresh Market	238	283.25
7911918	44	2018	30	SuperTarget	855	269.25
7911918	45	2018	21	Village Market Food Center	62	311.75
7911918	45	2018	91	Big Y Foods	278	340
7911918	46	2018	60	Super Dollar Discount Foods	76	368.5
7911918	47	2018	30	SuperTarget	917	269.25
7911918	48	2018	59	Meijer	231	311.75
7911918	49	2018	91	Big Y Foods	293	340
7911918	49	2018	100	Shaw's and Star Market	211	340
7911918	50	2018	30	SuperTarget	910	269.25
7911918	52	2018	20	Walmart	1210	255
7911918	52	2018	60	Super Dollar Discount Foods	79	368.5
7991138	1	2018	44	Foodland	183	162.75
7991138	2	2018	30	SuperTarget	1046	154.5
7991138	2	2018	61	Breaux Mart Supermarkets	131	162.75
7991138	2	2018	84	Mac's Fresh Market	162	162.75
7991138	2	2018	85	ShopRite	52	195.25
7991138	2	2018	86	Quality Foods	226	170.75
7991138	3	2018	0	Weis Markets	172	162.75
7991138	4	2018	17	Broulims	76	162.75
7991138	5	2018	30	SuperTarget	1076	154.5
7991138	6	2018	19	Raley's	170	195.25
7991138	7	2018	20	Walmart	1196	146.5
7991138	7	2018	28	Great Valu Markets	127	162.75
7991138	7	2018	40	Buehler's Buy-Low	34	162.75
7991138	8	2018	30	SuperTarget	956	154.5
7991138	8	2018	56	Hollywood Super Market	152	195.25
7991138	9	2018	21	Village Market Food Center	54	179
7991138	10	2018	0	Weis Markets	185	162.75
7991138	10	2018	11	Sunflower Farmers Market	100	170.75
7991138	10	2018	66	McCaffrey's	74	162.75
7991138	11	2018	30	SuperTarget	894	154.5
7991138	11	2018	86	Quality Foods	192	170.75
7991138	11	2018	94	H-E-B Plus	162	187.25
7991138	12	2018	17	Broulims	66	162.75
7991138	12	2018	84	Mac's Fresh Market	133	162.75
7991138	13	2018	19	Raley's	158	195.25
7991138	13	2018	44	Foodland	180	162.75
7991138	14	2018	30	SuperTarget	877	154.5
7991138	16	2018	56	Hollywood Super Market	147	195.25
7991138	17	2018	0	Weis Markets	195	162.75
7991138	17	2018	30	SuperTarget	875	154.5
7991138	17	2018	40	Buehler's Buy-Low	33	162.75
7991138	18	2018	54	Gelson's Markets	261	162.75
7991138	20	2018	17	Broulims	66	162.75
7991138	20	2018	19	Raley's	141	195.25
7991138	20	2018	30	SuperTarget	908	154.5
7991138	20	2018	61	Breaux Mart Supermarkets	113	162.75
7991138	20	2018	85	ShopRite	59	195.25
7991138	20	2018	86	Quality Foods	200	170.75
7991138	21	2018	28	Great Valu Markets	148	162.75
7991138	22	2018	20	Walmart	1153	146.5
7991138	22	2018	84	Mac's Fresh Market	131	162.75
7991138	23	2018	11	Sunflower Farmers Market	118	170.75
7991138	23	2018	30	SuperTarget	990	154.5
7991138	24	2018	0	Weis Markets	193	162.75
7991138	24	2018	56	Hollywood Super Market	148	195.25
7991138	24	2018	66	McCaffrey's	63	162.75
7991138	25	2018	44	Foodland	189	162.75
7991138	26	2018	30	SuperTarget	994	154.5
7991138	26	2018	94	H-E-B Plus	148	187.25
7991138	27	2018	19	Raley's	150	195.25
7991138	27	2018	21	Village Market Food Center	57	179
7991138	27	2018	40	Buehler's Buy-Low	33	162.75
7991138	28	2018	17	Broulims	62	162.75
7991138	29	2018	30	SuperTarget	1058	154.5
7991138	29	2018	86	Quality Foods	226	170.75
7991138	31	2018	0	Weis Markets	187	162.75
7991138	32	2018	30	SuperTarget	1069	154.5
7991138	32	2018	56	Hollywood Super Market	170	195.25
7991138	32	2018	84	Mac's Fresh Market	157	162.75
7991138	34	2018	19	Raley's	174	195.25
7991138	35	2018	28	Great Valu Markets	123	162.75
7991138	35	2018	30	SuperTarget	1050	154.5
7991138	36	2018	11	Sunflower Farmers Market	122	170.75
7991138	36	2018	17	Broulims	71	162.75
7991138	36	2018	54	Gelson's Markets	250	162.75
7991138	37	2018	20	Walmart	1156	146.5
7991138	37	2018	40	Buehler's Buy-Low	36	162.75
7991138	37	2018	44	Foodland	204	162.75
7991138	38	2018	0	Weis Markets	185	162.75
7991138	38	2018	30	SuperTarget	936	154.5
7991138	38	2018	61	Breaux Mart Supermarkets	133	162.75
7991138	38	2018	66	McCaffrey's	66	162.75
7991138	38	2018	85	ShopRite	60	195.25
7991138	38	2018	86	Quality Foods	192	170.75
7991138	40	2018	56	Hollywood Super Market	162	195.25
7991138	41	2018	19	Raley's	151	195.25
7991138	41	2018	30	SuperTarget	1014	154.5
7991138	41	2018	94	H-E-B Plus	165	187.25
7991138	42	2018	84	Mac's Fresh Market	144	162.75
7991138	44	2018	17	Broulims	73	162.75
7991138	44	2018	30	SuperTarget	1025	154.5
7991138	45	2018	0	Weis Markets	211	162.75
7991138	45	2018	21	Village Market Food Center	55	179
7991138	47	2018	30	SuperTarget	984	154.5
7991138	47	2018	40	Buehler's Buy-Low	32	162.75
7991138	47	2018	86	Quality Foods	238	170.75
7991138	48	2018	19	Raley's	174	195.25
7991138	48	2018	56	Hollywood Super Market	134	195.25
7991138	49	2018	11	Sunflower Farmers Market	100	170.75
7991138	49	2018	28	Great Valu Markets	134	162.75
7991138	49	2018	44	Foodland	192	162.75
7991138	50	2018	30	SuperTarget	1031	154.5
7991138	52	2018	0	Weis Markets	195	162.75
7991138	52	2018	17	Broulims	71	162.75
7991138	52	2018	20	Walmart	1206	146.5
7991138	52	2018	66	McCaffrey's	82	162.75
7991138	52	2018	84	Mac's Fresh Market	138	162.75
12311466	1	2018	80	New Leaf Community Markets	28	139.25
12311466	2	2018	13	Brookshire Grocery Company	11	132.5
12311466	2	2018	30	SuperTarget	112	126
12311466	3	2018	64	Big M	14	132.5
12311466	5	2018	30	SuperTarget	95	126
12311466	5	2018	49	FoodMaxx	31	132.5
12311466	5	2018	80	New Leaf Community Markets	25	139.25
12311466	6	2018	70	Zup's	6	146
12311466	6	2018	98	Sunfresh Market	20	139.25
12311466	7	2018	20	Walmart	123	119.25
12311466	7	2018	27	Nam Dae Mun Farmers Market	21	139.25
12311466	8	2018	30	SuperTarget	105	126
12311466	9	2018	64	Big M	14	132.5
12311466	9	2018	80	New Leaf Community Markets	29	139.25
12311466	10	2018	49	FoodMaxx	32	132.5
12311466	11	2018	30	SuperTarget	87	126
12311466	11	2018	31	Compare Foods Supermarket	18	146
12311466	11	2018	93	Coborns	38	146
12311466	12	2018	37	Fred Meyer	52	139.25
12311466	12	2018	70	Zup's	6	146
12311466	13	2018	80	New Leaf Community Markets	26	139.25
12311466	13	2018	98	Sunfresh Market	20	139.25
12311466	14	2018	30	SuperTarget	104	126
12311466	15	2018	49	FoodMaxx	27	132.5
12311466	15	2018	64	Big M	14	132.5
12311466	15	2018	79	Harding's Friendly Markets	27	165.75
12311466	16	2018	13	Brookshire Grocery Company	11	132.5
12311466	17	2018	30	SuperTarget	95	126
12311466	17	2018	80	New Leaf Community Markets	25	139.25
12311466	18	2018	54	Gelson's Markets	52	146
12311466	18	2018	70	Zup's	6	146
12311466	20	2018	30	SuperTarget	86	126
12311466	20	2018	49	FoodMaxx	28	132.5
12311466	20	2018	98	Sunfresh Market	24	139.25
12311466	21	2018	27	Nam Dae Mun Farmers Market	21	139.25
12311466	21	2018	64	Big M	12	132.5
12311466	21	2018	80	New Leaf Community Markets	28	139.25
12311466	22	2018	20	Walmart	107	119.25
12311466	22	2018	93	Coborns	40	146
12311466	23	2018	30	SuperTarget	82	126
12311466	24	2018	70	Zup's	7	146
12311466	25	2018	49	FoodMaxx	32	132.5
12311466	25	2018	80	New Leaf Community Markets	28	139.25
12311466	26	2018	30	SuperTarget	97	126
12311466	26	2018	31	Compare Foods Supermarket	16	146
12311466	27	2018	64	Big M	13	132.5
12311466	27	2018	98	Sunfresh Market	23	139.25
12311466	29	2018	30	SuperTarget	83	126
12311466	29	2018	37	Fred Meyer	48	139.25
12311466	29	2018	80	New Leaf Community Markets	23	139.25
12311466	30	2018	13	Brookshire Grocery Company	9	132.5
12311466	30	2018	49	FoodMaxx	25	132.5
12311466	30	2018	70	Zup's	7	146
12311466	31	2018	79	Harding's Friendly Markets	32	165.75
12311466	32	2018	30	SuperTarget	87	126
12311466	33	2018	64	Big M	11	132.5
12311466	33	2018	80	New Leaf Community Markets	26	139.25
12311466	33	2018	93	Coborns	37	146
12311466	34	2018	98	Sunfresh Market	20	139.25
12311466	35	2018	27	Nam Dae Mun Farmers Market	21	139.25
12311466	35	2018	30	SuperTarget	89	126
12311466	35	2018	49	FoodMaxx	30	132.5
12311466	36	2018	54	Gelson's Markets	60	146
12311466	36	2018	70	Zup's	6	146
12311466	37	2018	20	Walmart	112	119.25
12311466	37	2018	80	New Leaf Community Markets	25	139.25
12311466	38	2018	30	SuperTarget	95	126
12311466	39	2018	64	Big M	13	132.5
12311466	40	2018	49	FoodMaxx	27	132.5
12311466	41	2018	30	SuperTarget	102	126
12311466	41	2018	31	Compare Foods Supermarket	15	146
12311466	41	2018	80	New Leaf Community Markets	28	139.25
12311466	41	2018	98	Sunfresh Market	20	139.25
12311466	42	2018	70	Zup's	6	146
12311466	44	2018	13	Brookshire Grocery Company	12	132.5
12311466	44	2018	30	SuperTarget	92	126
12311466	44	2018	93	Coborns	34	146
12311466	45	2018	49	FoodMaxx	28	132.5
12311466	45	2018	64	Big M	13	132.5
12311466	45	2018	80	New Leaf Community Markets	26	139.25
12311466	46	2018	37	Fred Meyer	51	139.25
12311466	47	2018	30	SuperTarget	109	126
12311466	47	2018	79	Harding's Friendly Markets	30	165.75
12311466	48	2018	70	Zup's	6	146
12311466	48	2018	98	Sunfresh Market	22	139.25
12311466	49	2018	27	Nam Dae Mun Farmers Market	19	139.25
12311466	49	2018	80	New Leaf Community Markets	30	139.25
12311466	50	2018	30	SuperTarget	97	126
12311466	50	2018	49	FoodMaxx	33	132.5
12311466	51	2018	64	Big M	13	132.5
12311466	52	2018	20	Walmart	121	119.25
78111	1	2018	25	Hank's Market	8	109
78111	1	2018	91	Big Y Foods	29	109
78111	2	2018	30	SuperTarget	151	103.5
78111	2	2018	61	Breaux Mart Supermarkets	7	109
78111	3	2018	89	Plum Market	12	119.75
78111	5	2018	30	SuperTarget	144	103.5
78111	5	2018	91	Big Y Foods	31	109
78111	6	2018	87	Sav-Mor Foods	26	109
78111	7	2018	20	Walmart	81	98
78111	8	2018	30	SuperTarget	146	103.5
78111	9	2018	8	SuperValu Inc.	9	130.75
78111	9	2018	91	Big Y Foods	28	109
78111	11	2018	30	SuperTarget	151	103.5
78111	11	2018	31	Compare Foods Supermarket	10	125.25
78111	13	2018	91	Big Y Foods	27	109
78111	14	2018	22	Food Town	11	109
78111	14	2018	30	SuperTarget	151	103.5
78111	15	2018	79	Harding's Friendly Markets	17	125.25
78111	17	2018	30	SuperTarget	133	103.5
78111	17	2018	87	Sav-Mor Foods	27	109
78111	17	2018	91	Big Y Foods	22	109
78111	18	2018	54	Gelson's Markets	26	114.25
78111	19	2018	8	SuperValu Inc.	11	130.75
78111	20	2018	25	Hank's Market	7	109
78111	20	2018	30	SuperTarget	137	103.5
78111	20	2018	61	Breaux Mart Supermarkets	8	109
78111	21	2018	89	Plum Market	13	119.75
78111	21	2018	91	Big Y Foods	24	109
78111	22	2018	20	Walmart	100	98
78111	23	2018	30	SuperTarget	146	103.5
78111	25	2018	91	Big Y Foods	25	109
78111	26	2018	30	SuperTarget	137	103.5
78111	26	2018	31	Compare Foods Supermarket	10	125.25
78111	28	2018	87	Sav-Mor Foods	26	109
78111	29	2018	8	SuperValu Inc.	11	130.75
78111	29	2018	22	Food Town	12	109
78111	29	2018	30	SuperTarget	154	103.5
78111	29	2018	91	Big Y Foods	22	109
78111	31	2018	79	Harding's Friendly Markets	18	125.25
78111	32	2018	30	SuperTarget	136	103.5
78111	33	2018	91	Big Y Foods	26	109
78111	35	2018	30	SuperTarget	159	103.5
78111	36	2018	54	Gelson's Markets	28	114.25
78111	37	2018	20	Walmart	94	98
78111	37	2018	91	Big Y Foods	28	109
78111	38	2018	30	SuperTarget	155	103.5
78111	38	2018	61	Breaux Mart Supermarkets	7	109
78111	39	2018	8	SuperValu Inc.	10	130.75
78111	39	2018	25	Hank's Market	8	109
78111	39	2018	87	Sav-Mor Foods	23	109
78111	39	2018	89	Plum Market	11	119.75
78111	41	2018	30	SuperTarget	136	103.5
78111	41	2018	31	Compare Foods Supermarket	10	125.25
78111	41	2018	91	Big Y Foods	29	109
78111	44	2018	22	Food Town	12	109
78111	44	2018	30	SuperTarget	150	103.5
78111	45	2018	91	Big Y Foods	30	109
78111	47	2018	30	SuperTarget	134	103.5
78111	47	2018	79	Harding's Friendly Markets	18	125.25
78111	49	2018	8	SuperValu Inc.	9	130.75
78111	49	2018	91	Big Y Foods	26	109
78111	50	2018	30	SuperTarget	143	103.5
78111	50	2018	87	Sav-Mor Foods	22	109
78111	52	2018	20	Walmart	78	98
24222	2	2018	34	Mayfair Markets	8	83
24222	3	2018	14	FoodCity	11	75.75
24222	3	2018	43	United Grocery Outlet	8	90.25
24222	4	2018	72	Acme Fresh Market	8	72.25
24222	5	2018	34	Mayfair Markets	8	83
24222	5	2018	49	FoodMaxx	4	72.25
24222	7	2018	20	Walmart	54	65
24222	7	2018	40	Buehler's Buy-Low	7	72.25
24222	8	2018	34	Mayfair Markets	7	83
24222	9	2018	72	Acme Fresh Market	9	72.25
24222	10	2018	49	FoodMaxx	3	72.25
24222	10	2018	66	McCaffrey's	11	79.5
24222	11	2018	34	Mayfair Markets	8	83
24222	13	2018	14	FoodCity	11	75.75
24222	14	2018	34	Mayfair Markets	6	83
24222	14	2018	43	United Grocery Outlet	8	90.25
24222	14	2018	72	Acme Fresh Market	8	72.25
24222	15	2018	49	FoodMaxx	3	72.25
24222	17	2018	34	Mayfair Markets	7	83
24222	17	2018	40	Buehler's Buy-Low	7	72.25
24222	19	2018	72	Acme Fresh Market	9	72.25
24222	20	2018	34	Mayfair Markets	7	83
24222	20	2018	49	FoodMaxx	4	72.25
24222	22	2018	20	Walmart	49	65
24222	23	2018	14	FoodCity	13	75.75
24222	23	2018	34	Mayfair Markets	7	83
24222	24	2018	66	McCaffrey's	12	79.5
24222	24	2018	72	Acme Fresh Market	8	72.25
24222	25	2018	43	United Grocery Outlet	7	90.25
24222	25	2018	49	FoodMaxx	4	72.25
24222	26	2018	34	Mayfair Markets	6	83
24222	27	2018	40	Buehler's Buy-Low	7	72.25
24222	29	2018	34	Mayfair Markets	7	83
24222	29	2018	72	Acme Fresh Market	8	72.25
24222	30	2018	49	FoodMaxx	3	72.25
24222	32	2018	34	Mayfair Markets	6	83
24222	33	2018	14	FoodCity	11	75.75
24222	34	2018	72	Acme Fresh Market	9	72.25
24222	35	2018	34	Mayfair Markets	7	83
24222	35	2018	49	FoodMaxx	3	72.25
24222	36	2018	43	United Grocery Outlet	8	90.25
24222	37	2018	20	Walmart	47	65
24222	37	2018	40	Buehler's Buy-Low	7	72.25
24222	38	2018	34	Mayfair Markets	6	83
24222	38	2018	66	McCaffrey's	10	79.5
24222	39	2018	72	Acme Fresh Market	10	72.25
24222	40	2018	49	FoodMaxx	3	72.25
24222	41	2018	34	Mayfair Markets	6	83
24222	43	2018	14	FoodCity	12	75.75
24222	44	2018	34	Mayfair Markets	8	83
24222	44	2018	72	Acme Fresh Market	10	72.25
24222	45	2018	49	FoodMaxx	3	72.25
24222	47	2018	34	Mayfair Markets	6	83
24222	47	2018	40	Buehler's Buy-Low	7	72.25
24222	47	2018	43	United Grocery Outlet	8	90.25
24222	49	2018	72	Acme Fresh Market	9	72.25
24222	50	2018	34	Mayfair Markets	8	83
24222	50	2018	49	FoodMaxx	3	72.25
24222	52	2018	20	Walmart	43	65
24222	52	2018	66	McCaffrey's	11	79.5
19	1	2018	5	Stop & Shop	24	277.75
19	1	2018	90	H-E-B	91	291.75
19	2	2018	30	SuperTarget	440	264
19	2	2018	32	Pueblo	47	277.75
19	4	2018	38	Great American Food Stores	122	291.75
19	5	2018	30	SuperTarget	394	264
19	6	2018	5	Stop & Shop	24	277.75
19	6	2018	70	Zup's	17	319.5
19	7	2018	20	Walmart	220	250
19	8	2018	9	Shop 'n Save	117	277.75
19	8	2018	30	SuperTarget	483	264
19	10	2018	32	Pueblo	46	277.75
19	11	2018	5	Stop & Shop	24	277.75
19	11	2018	30	SuperTarget	436	264
19	11	2018	31	Compare Foods Supermarket	34	305.5
19	12	2018	70	Zup's	15	319.5
19	13	2018	90	H-E-B	92	291.75
19	14	2018	30	SuperTarget	442	264
19	15	2018	38	Great American Food Stores	108	291.75
19	16	2018	5	Stop & Shop	22	277.75
19	17	2018	30	SuperTarget	454	264
19	18	2018	32	Pueblo	45	277.75
19	18	2018	65	The Fresh Grocer	91	333.5
19	18	2018	70	Zup's	17	319.5
19	19	2018	9	Shop 'n Save	140	277.75
19	20	2018	30	SuperTarget	526	264
19	21	2018	5	Stop & Shop	21	277.75
19	22	2018	20	Walmart	210	250
19	23	2018	30	SuperTarget	546	264
19	24	2018	70	Zup's	16	319.5
19	25	2018	90	H-E-B	79	291.75
19	26	2018	5	Stop & Shop	26	277.75
19	26	2018	30	SuperTarget	532	264
19	26	2018	31	Compare Foods Supermarket	36	305.5
19	26	2018	32	Pueblo	46	277.75
19	26	2018	38	Great American Food Stores	113	291.75
19	29	2018	30	SuperTarget	493	264
19	30	2018	9	Shop 'n Save	142	277.75
19	30	2018	70	Zup's	17	319.5
19	31	2018	5	Stop & Shop	22	277.75
19	32	2018	30	SuperTarget	489	264
19	34	2018	32	Pueblo	44	277.75
19	35	2018	30	SuperTarget	457	264
19	36	2018	5	Stop & Shop	25	277.75
19	36	2018	70	Zup's	18	319.5
19	37	2018	20	Walmart	253	250
19	37	2018	38	Great American Food Stores	131	291.75
19	37	2018	65	The Fresh Grocer	95	333.5
19	37	2018	90	H-E-B	78	291.75
19	38	2018	30	SuperTarget	527	264
19	41	2018	5	Stop & Shop	24	277.75
19	41	2018	9	Shop 'n Save	128	277.75
19	41	2018	30	SuperTarget	449	264
19	41	2018	31	Compare Foods Supermarket	30	305.5
19	42	2018	32	Pueblo	52	277.75
19	42	2018	70	Zup's	17	319.5
19	44	2018	30	SuperTarget	423	264
19	46	2018	5	Stop & Shop	22	277.75
19	47	2018	30	SuperTarget	408	264
19	48	2018	38	Great American Food Stores	146	291.75
19	48	2018	70	Zup's	17	319.5
19	49	2018	90	H-E-B	75	291.75
19	50	2018	30	SuperTarget	406	264
19	50	2018	32	Pueblo	53	277.75
19	51	2018	5	Stop & Shop	22	277.75
19	52	2018	9	Shop 'n Save	117	277.75
19	52	2018	20	Walmart	280	250
1060444292	1	2018	25	Hank's Market	11	72.75
1060444292	1	2018	91	Big Y Foods	14	76.5
1060444292	2	2018	30	SuperTarget	140	69.25
1060444292	3	2018	24	Chappells Hometown Foods	14	80
1060444292	4	2018	42	Sack&Save	45	72.75
1060444292	5	2018	1	Albertsons LLC	6	80
1060444292	5	2018	30	SuperTarget	157	69.25
1060444292	5	2018	91	Big Y Foods	13	76.5
1060444292	6	2018	70	Zup's	7	94.75
1060444292	7	2018	20	Walmart	214	65.5
1060444292	7	2018	40	Buehler's Buy-Low	8	76.5
1060444292	7	2018	55	Piggly Wiggly	22	80
1060444292	8	2018	30	SuperTarget	162	69.25
1060444292	8	2018	42	Sack&Save	39	72.75
1060444292	9	2018	91	Big Y Foods	14	76.5
1060444292	11	2018	24	Chappells Hometown Foods	13	80
1060444292	11	2018	30	SuperTarget	169	69.25
1060444292	12	2018	42	Sack&Save	41	72.75
1060444292	12	2018	70	Zup's	7	94.75
1060444292	13	2018	1	Albertsons LLC	6	80
1060444292	13	2018	91	Big Y Foods	12	76.5
1060444292	14	2018	30	SuperTarget	155	69.25
1060444292	15	2018	55	Piggly Wiggly	20	80
1060444292	15	2018	79	Harding's Friendly Markets	14	76.5
1060444292	16	2018	42	Sack&Save	45	72.75
1060444292	17	2018	30	SuperTarget	153	69.25
1060444292	17	2018	40	Buehler's Buy-Low	8	76.5
1060444292	17	2018	91	Big Y Foods	12	76.5
1060444292	18	2018	70	Zup's	7	94.75
1060444292	19	2018	10	C-Town	24	80
1060444292	19	2018	24	Chappells Hometown Foods	13	80
1060444292	20	2018	25	Hank's Market	12	72.75
1060444292	20	2018	30	SuperTarget	153	69.25
1060444292	20	2018	42	Sack&Save	39	72.75
1060444292	21	2018	1	Albertsons LLC	6	80
1060444292	21	2018	91	Big Y Foods	12	76.5
1060444292	22	2018	20	Walmart	167	65.5
1060444292	23	2018	30	SuperTarget	141	69.25
1060444292	23	2018	55	Piggly Wiggly	21	80
1060444292	24	2018	42	Sack&Save	39	72.75
1060444292	24	2018	70	Zup's	7	94.75
1060444292	25	2018	91	Big Y Foods	13	76.5
1060444292	26	2018	30	SuperTarget	138	69.25
1060444292	27	2018	24	Chappells Hometown Foods	12	80
1060444292	27	2018	40	Buehler's Buy-Low	8	76.5
1060444292	28	2018	42	Sack&Save	47	72.75
1060444292	29	2018	1	Albertsons LLC	6	80
1060444292	29	2018	30	SuperTarget	127	69.25
1060444292	29	2018	91	Big Y Foods	14	76.5
1060444292	30	2018	70	Zup's	7	94.75
1060444292	31	2018	55	Piggly Wiggly	21	80
1060444292	31	2018	79	Harding's Friendly Markets	15	76.5
1060444292	32	2018	30	SuperTarget	137	69.25
1060444292	32	2018	42	Sack&Save	47	72.75
1060444292	33	2018	91	Big Y Foods	13	76.5
1060444292	35	2018	24	Chappells Hometown Foods	16	80
1060444292	35	2018	30	SuperTarget	131	69.25
1060444292	36	2018	42	Sack&Save	43	72.75
1060444292	36	2018	70	Zup's	7	94.75
1060444292	37	2018	1	Albertsons LLC	7	80
1060444292	37	2018	20	Walmart	201	65.5
1060444292	37	2018	40	Buehler's Buy-Low	8	76.5
1060444292	37	2018	91	Big Y Foods	12	76.5
1060444292	38	2018	10	C-Town	24	80
1060444292	38	2018	30	SuperTarget	124	69.25
1060444292	39	2018	25	Hank's Market	10	72.75
1060444292	39	2018	55	Piggly Wiggly	24	80
1060444292	40	2018	42	Sack&Save	49	72.75
1060444292	41	2018	30	SuperTarget	120	69.25
1060444292	41	2018	91	Big Y Foods	12	76.5
1060444292	42	2018	70	Zup's	7	94.75
1060444292	43	2018	24	Chappells Hometown Foods	15	80
1060444292	44	2018	30	SuperTarget	131	69.25
1060444292	44	2018	42	Sack&Save	43	72.75
1060444292	45	2018	1	Albertsons LLC	6	80
1060444292	45	2018	91	Big Y Foods	12	76.5
1060444292	47	2018	30	SuperTarget	132	69.25
1060444292	47	2018	40	Buehler's Buy-Low	7	76.5
1060444292	47	2018	55	Piggly Wiggly	20	80
1060444292	47	2018	79	Harding's Friendly Markets	15	76.5
1060444292	48	2018	42	Sack&Save	42	72.75
1060444292	48	2018	70	Zup's	7	94.75
1060444292	49	2018	91	Big Y Foods	12	76.5
1060444292	50	2018	30	SuperTarget	129	69.25
1060444292	51	2018	24	Chappells Hometown Foods	17	80
1060444292	52	2018	20	Walmart	188	65.5
1060444292	52	2018	42	Sack&Save	41	72.75
394595120	1	2018	44	Foodland	14	272.5
394595120	1	2018	80	New Leaf Community Markets	39	313.5
394595120	2	2018	30	SuperTarget	76	259
394595120	2	2018	84	Mac's Fresh Market	18	272.5
394595120	4	2018	17	Broulims	19	272.5
394595120	5	2018	30	SuperTarget	79	259
394595120	5	2018	80	New Leaf Community Markets	37	313.5
394595120	5	2018	82	Vinckier Foods	60	272.5
394595120	6	2018	59	Meijer	39	286.25
394595120	7	2018	20	Walmart	95	245.25
394595120	7	2018	27	Nam Dae Mun Farmers Market	24	299.75
394595120	7	2018	73	Homeland	10	272.5
394595120	8	2018	30	SuperTarget	77	259
394595120	9	2018	80	New Leaf Community Markets	37	313.5
394595120	10	2018	16	K-VA-T Food Stores	38	272.5
394595120	10	2018	66	McCaffrey's	41	286.25
394595120	11	2018	30	SuperTarget	70	259
394595120	12	2018	17	Broulims	17	272.5
394595120	12	2018	29	Felpausch	20	272.5
394595120	12	2018	82	Vinckier Foods	58	272.5
394595120	12	2018	84	Mac's Fresh Market	19	272.5
394595120	13	2018	44	Foodland	15	272.5
394595120	13	2018	80	New Leaf Community Markets	38	313.5
394595120	14	2018	30	SuperTarget	63	259
394595120	14	2018	73	Homeland	11	272.5
394595120	16	2018	83	BI-LO	36	272.5
394595120	17	2018	30	SuperTarget	69	259
394595120	17	2018	80	New Leaf Community Markets	35	313.5
394595120	18	2018	54	Gelson's Markets	23	286.25
394595120	19	2018	82	Vinckier Foods	62	272.5
394595120	20	2018	17	Broulims	16	272.5
394595120	20	2018	30	SuperTarget	65	259
394595120	20	2018	59	Meijer	36	286.25
394595120	21	2018	27	Nam Dae Mun Farmers Market	24	299.75
394595120	21	2018	73	Homeland	10	272.5
394595120	21	2018	80	New Leaf Community Markets	42	313.5
394595120	22	2018	20	Walmart	109	245.25
394595120	22	2018	84	Mac's Fresh Market	18	272.5
394595120	23	2018	16	K-VA-T Food Stores	38	272.5
394595120	23	2018	30	SuperTarget	70	259
394595120	24	2018	66	McCaffrey's	46	286.25
394595120	25	2018	44	Foodland	14	272.5
394595120	25	2018	80	New Leaf Community Markets	37	313.5
394595120	26	2018	30	SuperTarget	68	259
394595120	26	2018	82	Vinckier Foods	61	272.5
394595120	28	2018	17	Broulims	16	272.5
394595120	28	2018	73	Homeland	10	272.5
394595120	29	2018	30	SuperTarget	65	259
394595120	29	2018	80	New Leaf Community Markets	42	313.5
394595120	30	2018	29	Felpausch	17	272.5
394595120	32	2018	30	SuperTarget	57	259
394595120	32	2018	83	BI-LO	42	272.5
394595120	32	2018	84	Mac's Fresh Market	18	272.5
394595120	33	2018	80	New Leaf Community Markets	37	313.5
394595120	33	2018	82	Vinckier Foods	72	272.5
394595120	34	2018	59	Meijer	38	286.25
394595120	35	2018	27	Nam Dae Mun Farmers Market	24	299.75
394595120	35	2018	30	SuperTarget	67	259
394595120	35	2018	73	Homeland	10	272.5
394595120	36	2018	16	K-VA-T Food Stores	42	272.5
394595120	36	2018	17	Broulims	16	272.5
394595120	36	2018	54	Gelson's Markets	22	286.25
394595120	37	2018	20	Walmart	103	245.25
394595120	37	2018	44	Foodland	16	272.5
394595120	37	2018	80	New Leaf Community Markets	44	313.5
394595120	38	2018	30	SuperTarget	65	259
394595120	38	2018	66	McCaffrey's	44	286.25
394595120	40	2018	82	Vinckier Foods	74	272.5
394595120	41	2018	30	SuperTarget	76	259
394595120	41	2018	80	New Leaf Community Markets	40	313.5
394595120	42	2018	73	Homeland	11	272.5
394595120	42	2018	84	Mac's Fresh Market	18	272.5
394595120	44	2018	17	Broulims	18	272.5
394595120	44	2018	30	SuperTarget	77	259
394595120	45	2018	80	New Leaf Community Markets	42	313.5
394595120	47	2018	30	SuperTarget	77	259
394595120	47	2018	82	Vinckier Foods	72	272.5
394595120	48	2018	29	Felpausch	16	272.5
394595120	48	2018	59	Meijer	35	286.25
394595120	48	2018	83	BI-LO	37	272.5
394595120	49	2018	16	K-VA-T Food Stores	46	272.5
394595120	49	2018	27	Nam Dae Mun Farmers Market	21	299.75
394595120	49	2018	44	Foodland	15	272.5
394595120	49	2018	73	Homeland	10	272.5
394595120	49	2018	80	New Leaf Community Markets	35	313.5
394595120	50	2018	30	SuperTarget	66	259
394595120	52	2018	17	Broulims	19	272.5
394595120	52	2018	20	Walmart	98	245.25
394595120	52	2018	66	McCaffrey's	44	286.25
394595120	52	2018	84	Mac's Fresh Market	21	272.5
2096452488	1	2018	15	Brown & Cole	9	111.25
2096452488	2	2018	30	SuperTarget	98	105.75
2096452488	3	2018	41	Arlan's Market	3	116.75
2096452488	4	2018	15	Brown & Cole	10	111.25
2096452488	4	2018	72	Acme Fresh Market	17	133.5
2096452488	5	2018	30	SuperTarget	98	105.75
2096452488	6	2018	97	Trade Fair	3	122.5
2096452488	7	2018	15	Brown & Cole	9	111.25
2096452488	7	2018	20	Walmart	38	100
2096452488	8	2018	30	SuperTarget	92	105.75
2096452488	8	2018	41	Arlan's Market	3	116.75
2096452488	9	2018	72	Acme Fresh Market	15	133.5
2096452488	10	2018	3	Hannaford	12	128
2096452488	10	2018	15	Brown & Cole	8	111.25
2096452488	11	2018	30	SuperTarget	99	105.75
2096452488	11	2018	31	Compare Foods Supermarket	6	111.25
2096452488	13	2018	15	Brown & Cole	8	111.25
2096452488	13	2018	41	Arlan's Market	4	116.75
2096452488	14	2018	30	SuperTarget	101	105.75
2096452488	14	2018	72	Acme Fresh Market	16	133.5
2096452488	16	2018	2	Food Lion	10	111.25
2096452488	16	2018	15	Brown & Cole	8	111.25
2096452488	17	2018	30	SuperTarget	107	105.75
2096452488	18	2018	41	Arlan's Market	4	116.75
2096452488	18	2018	65	The Fresh Grocer	10	111.25
2096452488	19	2018	15	Brown & Cole	8	111.25
2096452488	19	2018	72	Acme Fresh Market	18	133.5
2096452488	19	2018	97	Trade Fair	2	122.5
2096452488	20	2018	30	SuperTarget	90	105.75
2096452488	21	2018	3	Hannaford	11	128
2096452488	22	2018	15	Brown & Cole	8	111.25
2096452488	22	2018	20	Walmart	37	100
2096452488	23	2018	30	SuperTarget	97	105.75
2096452488	23	2018	41	Arlan's Market	4	116.75
2096452488	24	2018	72	Acme Fresh Market	19	133.5
2096452488	25	2018	15	Brown & Cole	9	111.25
2096452488	26	2018	30	SuperTarget	101	105.75
2096452488	26	2018	31	Compare Foods Supermarket	5	111.25
2096452488	28	2018	15	Brown & Cole	8	111.25
2096452488	28	2018	41	Arlan's Market	3	116.75
2096452488	29	2018	30	SuperTarget	89	105.75
2096452488	29	2018	72	Acme Fresh Market	17	133.5
2096452488	31	2018	15	Brown & Cole	9	111.25
2096452488	32	2018	3	Hannaford	10	128
2096452488	32	2018	30	SuperTarget	91	105.75
2096452488	32	2018	97	Trade Fair	3	122.5
2096452488	33	2018	2	Food Lion	10	111.25
2096452488	33	2018	41	Arlan's Market	3	116.75
2096452488	34	2018	15	Brown & Cole	10	111.25
2096452488	34	2018	72	Acme Fresh Market	18	133.5
2096452488	35	2018	30	SuperTarget	85	105.75
2096452488	37	2018	15	Brown & Cole	9	111.25
2096452488	37	2018	20	Walmart	37	100
2096452488	37	2018	65	The Fresh Grocer	11	111.25
2096452488	38	2018	30	SuperTarget	104	105.75
2096452488	38	2018	41	Arlan's Market	4	116.75
2096452488	39	2018	72	Acme Fresh Market	17	133.5
2096452488	40	2018	15	Brown & Cole	9	111.25
2096452488	41	2018	30	SuperTarget	103	105.75
2096452488	41	2018	31	Compare Foods Supermarket	6	111.25
2096452488	43	2018	3	Hannaford	10	128
2096452488	43	2018	15	Brown & Cole	11	111.25
2096452488	43	2018	41	Arlan's Market	3	116.75
2096452488	44	2018	30	SuperTarget	111	105.75
2096452488	44	2018	72	Acme Fresh Market	18	133.5
2096452488	45	2018	97	Trade Fair	3	122.5
2096452488	46	2018	15	Brown & Cole	11	111.25
2096452488	47	2018	30	SuperTarget	97	105.75
2096452488	48	2018	41	Arlan's Market	3	116.75
2096452488	49	2018	15	Brown & Cole	9	111.25
2096452488	49	2018	72	Acme Fresh Market	15	133.5
2096452488	50	2018	2	Food Lion	8	111.25
2096452488	50	2018	30	SuperTarget	105	105.75
2096452488	52	2018	15	Brown & Cole	10	111.25
2096452488	52	2018	20	Walmart	40	100
1819152447	1	2018	44	Foodland	13	96.75
1819152447	2	2018	30	SuperTarget	82	79.75
1819152447	5	2018	30	SuperTarget	82	79.75
1819152447	6	2018	67	Crosby's Marketplace	24	92.5
1819152447	6	2018	97	Trade Fair	9	92.5
1819152447	7	2018	20	Walmart	61	75.75
1819152447	7	2018	27	Nam Dae Mun Farmers Market	12	88.25
1819152447	8	2018	30	SuperTarget	78	79.75
1819152447	10	2018	66	McCaffrey's	11	88.25
1819152447	11	2018	30	SuperTarget	79	79.75
1819152447	13	2018	26	Market Basket	24	84
1819152447	13	2018	44	Foodland	14	96.75
1819152447	14	2018	30	SuperTarget	85	79.75
1819152447	17	2018	30	SuperTarget	82	79.75
1819152447	17	2018	67	Crosby's Marketplace	21	92.5
1819152447	19	2018	10	C-Town	14	84
1819152447	19	2018	97	Trade Fair	10	92.5
1819152447	20	2018	30	SuperTarget	82	79.75
1819152447	21	2018	27	Nam Dae Mun Farmers Market	12	88.25
1819152447	22	2018	20	Walmart	57	75.75
1819152447	23	2018	30	SuperTarget	87	79.75
1819152447	24	2018	66	McCaffrey's	11	88.25
1819152447	25	2018	44	Foodland	15	96.75
1819152447	26	2018	30	SuperTarget	76	79.75
1819152447	27	2018	26	Market Basket	27	84
1819152447	28	2018	67	Crosby's Marketplace	22	92.5
1819152447	29	2018	30	SuperTarget	92	79.75
1819152447	32	2018	30	SuperTarget	75	79.75
1819152447	32	2018	97	Trade Fair	10	92.5
1819152447	35	2018	27	Nam Dae Mun Farmers Market	14	88.25
1819152447	35	2018	30	SuperTarget	85	79.75
1819152447	37	2018	20	Walmart	63	75.75
1819152447	37	2018	44	Foodland	15	96.75
1819152447	38	2018	10	C-Town	15	84
1819152447	38	2018	30	SuperTarget	81	79.75
1819152447	38	2018	66	McCaffrey's	12	88.25
1819152447	39	2018	67	Crosby's Marketplace	23	92.5
1819152447	41	2018	26	Market Basket	33	84
1819152447	41	2018	30	SuperTarget	86	79.75
1819152447	44	2018	30	SuperTarget	84	79.75
1819152447	45	2018	97	Trade Fair	9	92.5
1819152447	47	2018	30	SuperTarget	75	79.75
1819152447	49	2018	27	Nam Dae Mun Farmers Market	14	88.25
1819152447	49	2018	44	Foodland	15	96.75
1819152447	50	2018	30	SuperTarget	91	79.75
1819152447	50	2018	67	Crosby's Marketplace	21	92.5
1819152447	52	2018	20	Walmart	59	75.75
1819152447	52	2018	66	McCaffrey's	13	88.25
205971101	1	2018	5	Stop & Shop	7	134.75
205971101	1	2018	90	H-E-B	11	103.5
205971101	1	2018	103	Wayne's Hometown Market	11	103.5
205971101	2	2018	30	SuperTarget	42	98.5
205971101	2	2018	84	Mac's Fresh Market	18	103.5
205971101	3	2018	62	Westborn Market	16	129.5
205971101	3	2018	64	Big M	2	119.25
205971101	3	2018	102	Matherne's Supermarkets	11	114
205971101	4	2018	60	Super Dollar Discount Foods	5	108.75
205971101	5	2018	30	SuperTarget	45	98.5
205971101	5	2018	88	Lin's Fresh Market	5	129.5
205971101	6	2018	5	Stop & Shop	7	134.75
205971101	7	2018	20	Walmart	68	93.25
205971101	7	2018	55	Piggly Wiggly	10	114
205971101	7	2018	100	Shaw's and Star Market	7	114
205971101	8	2018	30	SuperTarget	44	98.5
205971101	9	2018	51	Valley Marketplace	4	108.75
205971101	9	2018	64	Big M	2	119.25
205971101	9	2018	99	Strack & Van Til	5	114
205971101	9	2018	102	Matherne's Supermarkets	10	114
205971101	10	2018	60	Super Dollar Discount Foods	4	108.75
205971101	11	2018	5	Stop & Shop	7	134.75
205971101	11	2018	30	SuperTarget	39	98.5
205971101	11	2018	93	Coborns	7	103.5
205971101	12	2018	84	Mac's Fresh Market	17	103.5
205971101	13	2018	88	Lin's Fresh Market	5	129.5
205971101	13	2018	90	H-E-B	10	103.5
205971101	14	2018	30	SuperTarget	43	98.5
205971101	14	2018	62	Westborn Market	14	129.5
205971101	14	2018	100	Shaw's and Star Market	8	114
205971101	14	2018	103	Wayne's Hometown Market	11	103.5
205971101	15	2018	55	Piggly Wiggly	10	114
205971101	15	2018	64	Big M	2	119.25
205971101	15	2018	102	Matherne's Supermarkets	10	114
205971101	16	2018	5	Stop & Shop	6	134.75
205971101	16	2018	60	Super Dollar Discount Foods	4	108.75
205971101	17	2018	30	SuperTarget	37	98.5
205971101	18	2018	99	Strack & Van Til	6	114
205971101	20	2018	30	SuperTarget	42	98.5
205971101	21	2018	5	Stop & Shop	8	134.75
205971101	21	2018	64	Big M	2	119.25
205971101	21	2018	88	Lin's Fresh Market	5	129.5
205971101	21	2018	100	Shaw's and Star Market	8	114
205971101	21	2018	102	Matherne's Supermarkets	10	114
205971101	22	2018	20	Walmart	62	93.25
205971101	22	2018	51	Valley Marketplace	3	108.75
205971101	22	2018	60	Super Dollar Discount Foods	5	108.75
205971101	22	2018	84	Mac's Fresh Market	18	103.5
205971101	22	2018	93	Coborns	7	103.5
205971101	23	2018	30	SuperTarget	38	98.5
205971101	23	2018	55	Piggly Wiggly	11	114
205971101	25	2018	62	Westborn Market	15	129.5
205971101	25	2018	90	H-E-B	11	103.5
205971101	26	2018	5	Stop & Shop	6	134.75
205971101	26	2018	30	SuperTarget	41	98.5
205971101	27	2018	64	Big M	2	119.25
205971101	27	2018	99	Strack & Van Til	6	114
205971101	27	2018	102	Matherne's Supermarkets	11	114
205971101	27	2018	103	Wayne's Hometown Market	10	103.5
205971101	28	2018	60	Super Dollar Discount Foods	5	108.75
205971101	28	2018	100	Shaw's and Star Market	7	114
205971101	29	2018	30	SuperTarget	36	98.5
205971101	29	2018	88	Lin's Fresh Market	4	129.5
205971101	31	2018	5	Stop & Shop	7	134.75
205971101	31	2018	55	Piggly Wiggly	12	114
205971101	32	2018	30	SuperTarget	40	98.5
205971101	32	2018	84	Mac's Fresh Market	15	103.5
205971101	33	2018	64	Big M	2	119.25
205971101	33	2018	93	Coborns	6	103.5
205971101	33	2018	102	Matherne's Supermarkets	9	114
205971101	34	2018	60	Super Dollar Discount Foods	4	108.75
205971101	35	2018	30	SuperTarget	38	98.5
205971101	35	2018	51	Valley Marketplace	4	108.75
205971101	35	2018	100	Shaw's and Star Market	8	114
205971101	36	2018	5	Stop & Shop	6	134.75
205971101	36	2018	62	Westborn Market	14	129.5
205971101	36	2018	99	Strack & Van Til	6	114
205971101	37	2018	20	Walmart	66	93.25
205971101	37	2018	88	Lin's Fresh Market	5	129.5
205971101	37	2018	90	H-E-B	10	103.5
205971101	38	2018	30	SuperTarget	36	98.5
205971101	39	2018	55	Piggly Wiggly	11	114
205971101	39	2018	64	Big M	2	119.25
205971101	39	2018	102	Matherne's Supermarkets	10	114
205971101	40	2018	60	Super Dollar Discount Foods	5	108.75
205971101	40	2018	103	Wayne's Hometown Market	13	103.5
205971101	41	2018	5	Stop & Shop	6	134.75
205971101	41	2018	30	SuperTarget	38	98.5
205971101	42	2018	84	Mac's Fresh Market	15	103.5
205971101	42	2018	100	Shaw's and Star Market	8	114
205971101	44	2018	30	SuperTarget	44	98.5
205971101	44	2018	93	Coborns	6	103.5
205971101	45	2018	64	Big M	2	119.25
205971101	45	2018	88	Lin's Fresh Market	4	129.5
205971101	45	2018	99	Strack & Van Til	6	114
205971101	45	2018	102	Matherne's Supermarkets	10	114
205971101	46	2018	5	Stop & Shop	6	134.75
205971101	46	2018	60	Super Dollar Discount Foods	4	108.75
205971101	47	2018	30	SuperTarget	45	98.5
205971101	47	2018	55	Piggly Wiggly	9	114
205971101	47	2018	62	Westborn Market	15	129.5
205971101	48	2018	51	Valley Marketplace	4	108.75
205971101	49	2018	90	H-E-B	11	103.5
205971101	49	2018	100	Shaw's and Star Market	7	114
205971101	50	2018	30	SuperTarget	47	98.5
205971101	51	2018	5	Stop & Shop	6	134.75
205971101	51	2018	64	Big M	2	119.25
205971101	51	2018	102	Matherne's Supermarkets	10	114
205971101	52	2018	20	Walmart	77	93.25
205971101	52	2018	60	Super Dollar Discount Foods	5	108.75
205971101	52	2018	84	Mac's Fresh Market	15	103.5
799895359	2	2018	30	SuperTarget	163	141
799895359	2	2018	34	Mayfair Markets	24	170.5
799895359	2	2018	35	Schnucks	41	155.75
799895359	3	2018	43	United Grocery Outlet	79	155.75
799895359	4	2018	72	Acme Fresh Market	67	155.75
799895359	5	2018	30	SuperTarget	149	141
799895359	5	2018	34	Mayfair Markets	27	170.5
799895359	6	2018	98	Sunfresh Market	31	155.75
799895359	7	2018	28	Great Valu Markets	50	155.75
799895359	8	2018	30	SuperTarget	150	141
799895359	8	2018	34	Mayfair Markets	23	170.5
799895359	9	2018	72	Acme Fresh Market	69	155.75
799895359	9	2018	99	Strack & Van Til	63	185.5
799895359	10	2018	3	Hannaford	30	148.25
799895359	10	2018	77	Woodman's Food Market	48	148.25
799895359	11	2018	30	SuperTarget	169	141
799895359	11	2018	34	Mayfair Markets	24	170.5
799895359	13	2018	98	Sunfresh Market	31	155.75
799895359	14	2018	30	SuperTarget	167	141
799895359	14	2018	34	Mayfair Markets	22	170.5
799895359	14	2018	43	United Grocery Outlet	81	155.75
799895359	14	2018	72	Acme Fresh Market	68	155.75
799895359	17	2018	30	SuperTarget	168	141
799895359	17	2018	34	Mayfair Markets	22	170.5
799895359	17	2018	35	Schnucks	35	155.75
799895359	18	2018	99	Strack & Van Til	63	185.5
799895359	19	2018	72	Acme Fresh Market	68	155.75
799895359	20	2018	30	SuperTarget	177	141
799895359	20	2018	34	Mayfair Markets	25	170.5
799895359	20	2018	98	Sunfresh Market	32	155.75
799895359	21	2018	3	Hannaford	34	148.25
799895359	21	2018	28	Great Valu Markets	54	155.75
799895359	23	2018	30	SuperTarget	173	141
799895359	23	2018	34	Mayfair Markets	21	170.5
799895359	23	2018	77	Woodman's Food Market	47	148.25
799895359	24	2018	72	Acme Fresh Market	75	155.75
799895359	25	2018	43	United Grocery Outlet	75	155.75
799895359	26	2018	30	SuperTarget	180	141
799895359	26	2018	34	Mayfair Markets	21	170.5
799895359	27	2018	98	Sunfresh Market	33	155.75
799895359	27	2018	99	Strack & Van Til	73	185.5
799895359	29	2018	30	SuperTarget	172	141
799895359	29	2018	34	Mayfair Markets	24	170.5
799895359	29	2018	72	Acme Fresh Market	80	155.75
799895359	32	2018	3	Hannaford	32	148.25
799895359	32	2018	30	SuperTarget	191	141
799895359	32	2018	34	Mayfair Markets	25	170.5
799895359	32	2018	35	Schnucks	35	155.75
799895359	34	2018	72	Acme Fresh Market	77	155.75
799895359	34	2018	98	Sunfresh Market	28	155.75
799895359	35	2018	28	Great Valu Markets	56	155.75
799895359	35	2018	30	SuperTarget	176	141
799895359	35	2018	34	Mayfair Markets	25	170.5
799895359	36	2018	43	United Grocery Outlet	71	155.75
799895359	36	2018	77	Woodman's Food Market	38	148.25
799895359	36	2018	99	Strack & Van Til	69	185.5
799895359	38	2018	30	SuperTarget	175	141
799895359	38	2018	34	Mayfair Markets	26	170.5
799895359	39	2018	72	Acme Fresh Market	75	155.75
799895359	41	2018	30	SuperTarget	180	141
799895359	41	2018	34	Mayfair Markets	25	170.5
799895359	41	2018	98	Sunfresh Market	27	155.75
799895359	43	2018	3	Hannaford	34	148.25
799895359	44	2018	30	SuperTarget	189	141
799895359	44	2018	34	Mayfair Markets	23	170.5
799895359	44	2018	72	Acme Fresh Market	62	155.75
799895359	45	2018	99	Strack & Van Til	67	185.5
799895359	47	2018	30	SuperTarget	174	141
799895359	47	2018	34	Mayfair Markets	24	170.5
799895359	47	2018	35	Schnucks	42	155.75
799895359	47	2018	43	United Grocery Outlet	78	155.75
799895359	48	2018	98	Sunfresh Market	27	155.75
799895359	49	2018	28	Great Valu Markets	54	155.75
799895359	49	2018	72	Acme Fresh Market	65	155.75
799895359	49	2018	77	Woodman's Food Market	45	148.25
799895359	50	2018	30	SuperTarget	198	141
799895359	50	2018	34	Mayfair Markets	27	170.5
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
ZyrTJvamRUzDMnvWFWAw2wZ1a5MpfS__	{"cookie":{"originalMaxAge":86400000,"expires":"2019-03-27T14:58:43.398Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7}	2019-03-27 19:55:05
eOg5zeqmzBphf_pGRvQmk9fXXps9vCSe	{"cookie":{"originalMaxAge":86400000,"expires":"2019-03-26T06:09:39.613Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7}	2019-03-27 01:25:40
pMTmSLI34oz1gj22yXgiJRfR63G9hwl0	{"cookie":{"originalMaxAge":86400000,"expires":"2019-03-26T21:47:31.393Z","secure":"true","httpOnly":true,"path":"/"},"user":"netid_ghh6","admin":true,"user_id":17}	2019-03-27 17:22:55
g3SQjFccwHd3fdyY4ag6yzOARQfXsCSv	{"cookie":{"originalMaxAge":86400000,"expires":"2019-03-27T03:05:28.513Z","secure":"true","httpOnly":true,"path":"/"},"user":"admin","admin":true,"user_id":7}	2019-03-27 19:55:54
\.


--
-- Data for Name: sku; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku (name, num, case_upc, unit_upc, unit_size, count_per_case, prd_line, comments, id, formula_id, formula_scale, man_rate, man_setup_cost, man_run_cost) FROM stdin;
sku69	1234	23116	11222	6 lbs sskusku	6	prod69	another comment	11	3	1.5	1.0	1.0	1.0
sku6543	5727	5555	696	22	3	prod51	\N	22	4	3.3	1.0	1.0	1.0
sku1245872	55	2477	1123	5 lbs	4	prod69	a comment	1	4	1.5	1.0	1.0	1.0
namesku3	20	69283413	3649823	ten gallons	6	prod51	\N	28	4	3.3	1.0	1.0	1.0
namesku3	21	6934483413	364986623	ten gallons	6	prod51	\N	29	4	3.3	1.0	1.0	1.0
namesku3	22	9823471385	11123984	ten gallons	6	prod51	\N	30	4	3.3	1.0	1.0	1.0
namesku328	23	132874684753	34523466444	4 pounds	12	prod51	\N	31	4	3.3	1.0	1.0	1.0
sku2154	4	1023	11222	6 lbs sskusku	4	prod69	another comment	7	1	2.5	1.0	1.0	1.0
namesku328	24	34578237487	354444444	4 pounds	12	prod69	\N	32	4	1.5	1.0	1.0	1.0
nameaeriusku328	25	2853729348	354444444	4 pounds	12	prod69	\N	33	4	1.5	1.0	1.0	1.0
skueename	26	888888384	456456345	4 pounds	12	prod69	\N	34	4	1.5	1.0	1.0	1.0
skueename	27	34343434	456456345	4 pounds	12	prod69	\N	35	4	1.5	1.0	1.0	1.0
skueename	28	100000001	456456345	4 pounds	12	prod69	\N	36	4	1.5	1.0	1.0	1.0
sku2355	1	5048	1128	5 lbs	4	prod69	a comment	3	1	1.5	1.0	1.0	1.0
sku2356	2	5049	1122	5 lbs	4	prod69	a comment	5	1	1.5	1.0	1.0	1.0
sku210	3	102	1122	5 lbs sku23	4	prod69	a comment with sku210	6	1	1.5	1.0	1.0	1.0
sku215423	5	102355	11222	6 lbs sskusku	6	prod69	another comment	8	1	1.5	1.0	1.0	1.0
sku215423	123	1023553	11222	6 lbs sskusku	6	prod69	another comment	9	1	1.5	1.0	1.0	1.0
sku690	7	1001	65345	12 lbs sy98vv	98	prod4	commentingg	13	3	2.4	1.0	1.0	1.0
sku690	8	43434	65345	12 lbs sy98vv	98	prod4	commentingg	14	3	2.4	1.0	1.0	1.0
sku720	9	12345	65653	12 lbs	998	prod4	commentingg	15	4	2.4	1.0	1.0	1.0
sku1	12	2449	112553	10 lbs	4	prod4	a comment	4	4	2.4	1.0	1.0	1.0
sku723	11	123345	65653	12 lbs	998	prod4	commentingg	17	4	2.4	1.0	1.0	1.0
sku723	13	233	65653	12 lbs	998	prod4	commentingg	19	4	2.4	1.0	1.0	1.0
skusku	15	3213	65653	12 lbs	998	prod4	\N	21	4	2.4	1.0	1.0	1.0
namesku	16	413445546	14235	59 lbs	12	prod4	\N	23	4	2.4	1.0	1.0	1.0
hryname	17	23874	14235	59 lbs	12	prod4	\N	24	4	2.4	1.0	1.0	1.0
hrynamesku	18	2387334	134235	59 lb14dds	124	prod4	\N	26	4	2.4	1.0	1.0	1.0
sku13462	14	3549	65653	12 lbs	998	prod4	\N	20	5	2.4	1.0	1.0	1.0
Homestyle Turkey Meal	12113456	12311345	6561153	12 lbs	998	Jerkin Turkin Meaty Burkins	keep at 45 deg. storage temperature	12113456	3	2.5	782.1	1.0	1.0
Hearty Apple Pie	12113457	12311245	6561113	2 lbs	12	Aunt Jemina Bakery	smells wierd on Tuesdays	12113457	3	1.5	21.4	1.0	1.0
Chocolate Pudding	12113458	12111245	6561133	4 lbs	100	Jell-O	Contains Gellatine	12113458	1	2.5	100	1.0	1.0
Vitamin Water	12311459	12113345	6511253	50 fl. oz	98	Vitamint	never expires	12311459	3	1.5	782.1	1.0	1.0
Isohydrolzed Whey Protein	12113460	11311345	6125113	2 kilograms	8998	Gold	keep dry- this one is partially past the line	12113460	3	1.5	78	1.0	1.0
Bananna Protein Bar	12311461	12331141	65112153	5 packets	918	Vitamint	never expires	12311461	1	2.5	5115	1.0	1.0
Orange Boost	7911918	123311211	6511253	5 sachets	98	Vitamint	never expires	7911918	3	1.5	5115	1.0	1.0
Rainbow Powder	7991138	123113111	65252113	10 bags	918	Cherry Farms	never expires	7991138	1	1.5	10	1.0	1.0
Schezuan Chicken	12311466	12111345	6511613	12 lbs	998	Mama Chous	keep at 45 deg. storage temperature	12311466	1	1.5	100	1.0	1.0
Monster Boost	78111	123111145	653211153	50 fl. oz	98	Vitamint	never expires	78111	1	1.5	10	1.0	1.0
potatoes	24222	123456788101	123456788101	533	2	prod4	comemtns 	37	5	53	2.1	1.0	1.0
asku4	19	123456786101	123456786101	1 gallons	2	prod51	\N	27	4	3.3	1.0	1.0	1.0
ritwik	1060444292	110959670305	199317822808	234	2345	prod4		40	1	45	3	2	2
qwedsd	394595120	137438657183	121478009347	23	124	prod4		42	1	3	2	3	2
qwqwq	2096452488	143573411962	189702822582	23	232	prod4		43	1	121	1212	1212	1212
Amys Hearty Chicken Noodle Poop	1819152447	198988466663	147048599025	234	123	prod4		41	1	234	234	234	2234
abc451	205971101	151954598454	162952881509	45	12	prod4		39	1	2	3	3	3
abc4444	799895359	119325143771	172848705949	2	2	prod4		44	18	2	2	2	2
\.


--
-- Data for Name: sku_ingred; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku_ingred (sku_num, ingred_num, quantity) FROM stdin;
1	47	1
2	47	1
12	47	1
1	6	1
2	6	1
55	6	1
7	47	1
1	698	1
2	698	1
12	698	1
7	8	2
7	10	4
12	8	2
12	10	4
4	8	2
4	10	4
1	10	12
1	7	1.5
7	9	3
7	11	15
14	1414	5
14	1415	4
14	11	13
55	8	4
55	9	6
55	698	5.2
12	50	1
1	50	1.4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uname, id, password, admin) FROM stdin;
hello	8	dd	f
siddarth	9	$2b$10$Pwp3lW15hTFzklMarcAqTuxpe3yHvlXRRKf.xSeuyxzXXTXBU5jlG	f
111	11	$2b$10$Q9gVDGojNiyrgw63qxpOlOUuaX3mVTSBURhFhMt/l8VxVrfN3X9om	f
faa	10	$2b$10$6OEuptPXlXXHNCGK22Y2huBOaWixkxXaZgLlKfdEz0K2bUcwoCXGu	f
admin	7	$2b$10$6OEuptPXlXXHNCGK22Y2huBOaWixkxXaZgLlKfdEz0K2bUcwoCXGu	t
gordon	18	$2b$10$tH6f0/.Xyua9VUrfEpVrSuxzf/6S4EW84byCuNilGv7DG2LoIsm2G	f
user1	19	$2b$10$6N4S24FvrkYMuV5uOr9Ip.I0voths0ukjYN6/JOfg.1xasolLNUJq	f
gordon5	6	$2b$10$nXnMFKFaqLj00/a1Vs7fJ.EWLVdthJqxGa70b9.Y4lKzFeO5FwHo2	t
test	20	$2b$10$5f.J.wTCm.GmYMu4srL79eWVzlcrAR.jEj3R0wMJjA2utltl5fAxG	t
netid_ghh6	17	$2b$10$cAvdQ0XxPoI3a/wxu3p4j.6vpWYpsAa1rST.Wm/wNydAmZoKSmz2.	t
Yami	12	$2b$10$RFPqDSB88HRdOFvjnr/.Z.eSpwdobjVsY6YswCOcWHlJMA3d6keAO	f
Zion	13	$2b$10$WkOtBpwBtOMizbrPDRQgxOL1ceOHlbgJegw2CV1P78YIUhU.tjFvS	f
Santa	14	$2b$10$1SSj7lT9GhZUVdq9l057/e3XDm1VHs6TeqP7CBfiqAOROhwbdvYxm	f
Ulqiorra	15	$2b$10$HsFnr6AkgDdhIxW6DZKrRepMI9iGhslMxI9OVXIkHz3EbANFi4pne	f
Robert	16	$2b$10$Jn3i/RDS2pmo4nTdQ4Fvl.PCaGbSq2I8gWf8ErAIciGpMdMWUeXS2	f
netid_sk437	21	$2b$10$Cc6F9ucB7SQVi2Oyxl1sp.hiCZPYRzU5IfZmI7Qm1UOKmtrby6qIG	f
\.


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 416, true);


--
-- Name: formula_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_id_seq', 19, true);


--
-- Name: formula_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formula_num_seq', 4, true);


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 52, true);


--
-- Name: ingredients_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_num_seq', 36, true);


--
-- Name: manufacturing_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_id_seq', 9, true);


--
-- Name: manufacturing_goal_sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_sku_id_seq', 1, false);


--
-- Name: manufacturing_goal_sku_sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_sku_sku_id_seq', 1, false);


--
-- Name: manufacturing_goal_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_goal_user_id_seq', 1, false);


--
-- Name: manufacturing_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.manufacturing_line_id_seq', 10, true);


--
-- Name: productline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productline_id_seq', 7, true);


--
-- Name: sku_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_id_seq', 44, true);


--
-- Name: sku_ingred_ingred_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_ingred_ingred_num_seq', 1, false);


--
-- Name: sku_ingred_sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_ingred_sku_num_seq', 1, false);


--
-- Name: sku_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sku_num_seq', 28, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


--
-- Name: customers customers_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_name_key UNIQUE (name);


--
-- Name: customers customers_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_num_key UNIQUE (num);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: formula_ingredients formula_ingredients_formula_id_ingredients_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_formula_id_ingredients_id_key UNIQUE (formula_id, ingredients_id);


--
-- Name: formula formula_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula
    ADD CONSTRAINT formula_num_key UNIQUE (num);


--
-- Name: formula formula_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula
    ADD CONSTRAINT formula_pkey PRIMARY KEY (id);


--
-- Name: ingredients ignredients_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ignredients_name_key UNIQUE (name);


--
-- Name: ingredients ingredients_num_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_num_key UNIQUE (num);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_goal manufacturing_goal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_pkey PRIMARY KEY (mg_id, sku_id);


--
-- Name: manufacturing_goal manufacturing_goal_user_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_user_id_name_key UNIQUE (user_id, name);


--
-- Name: manufacturing_line manufacturing_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line
    ADD CONSTRAINT manufacturing_line_pkey PRIMARY KEY (id);


--
-- Name: manufacturing_line manufacturing_line_shortname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line
    ADD CONSTRAINT manufacturing_line_shortname_key UNIQUE (shortname);


--
-- Name: manufacturing_line_sku manufacturing_line_sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_pkey PRIMARY KEY (sku_id, manufacturing_line_id);


--
-- Name: productline productline_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_name_key UNIQUE (name);


--
-- Name: productline productline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productline
    ADD CONSTRAINT productline_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sku_num, week, year, customer_num);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sku sku_case_upc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_case_upc_key UNIQUE (case_upc);


--
-- Name: sku_ingred sku_ingred_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_pkey PRIMARY KEY (sku_num, ingred_num);


--
-- Name: sku sku_num; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_num UNIQUE (num);


--
-- Name: sku sku_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_uname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uname UNIQUE (uname);


--
-- Name: formula_ingredients formula_ingredients_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formula(id) ON DELETE CASCADE;


--
-- Name: formula_ingredients formula_ingredients_ingredients_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formula_ingredients
    ADD CONSTRAINT formula_ingredients_ingredients_id_fkey FOREIGN KEY (ingredients_id) REFERENCES public.ingredients(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_fkey FOREIGN KEY (mg_id) REFERENCES public.manufacturing_goal(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_man_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_man_line_id_fkey FOREIGN KEY (man_line_id) REFERENCES public.manufacturing_line(id);


--
-- Name: manufacturing_goal_sku manufacturing_goal_sku_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal_sku
    ADD CONSTRAINT manufacturing_goal_sku_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.sku(id) ON DELETE CASCADE;


--
-- Name: manufacturing_goal manufacturing_goal_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_goal
    ADD CONSTRAINT manufacturing_goal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: manufacturing_line_sku manufacturing_line_sku_manufacturing_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_manufacturing_line_id_fkey FOREIGN KEY (manufacturing_line_id) REFERENCES public.manufacturing_line(id);


--
-- Name: manufacturing_line_sku manufacturing_line_sku_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturing_line_sku
    ADD CONSTRAINT manufacturing_line_sku_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.sku(id) ON DELETE CASCADE;


--
-- Name: sales sales_customer_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_name_fkey FOREIGN KEY (customer_name) REFERENCES public.customers(name);


--
-- Name: sales sales_customer_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_num_fkey FOREIGN KEY (customer_num) REFERENCES public.customers(num);


--
-- Name: sales sales_sku_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_sku_num_fkey FOREIGN KEY (sku_num) REFERENCES public.sku(num);


--
-- Name: sku sku_formula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_formula_id_fkey FOREIGN KEY (formula_id) REFERENCES public.formula(id) ON DELETE CASCADE;


--
-- Name: sku_ingred sku_ingred_ingred_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_ingred_num_fkey FOREIGN KEY (ingred_num) REFERENCES public.ingredients(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku_ingred sku_ingred_sku_num_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_ingred
    ADD CONSTRAINT sku_ingred_sku_num_fkey FOREIGN KEY (sku_num) REFERENCES public.sku(num) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sku sku_prd_line_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku
    ADD CONSTRAINT sku_prd_line_fkey FOREIGN KEY (prd_line) REFERENCES public.productline(name) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

