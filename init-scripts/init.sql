--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2025-01-28 07:43:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4989 (class 1262 OID 25208)
-- Name: TeleAd; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "TeleAd" WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE "TeleAd" OWNER TO postgres;

\connect "TeleAd"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 240 (class 1255 OID 25506)
-- Name: add_to_cart(bigint, bigint, integer, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_to_cart(p_user_id bigint, p_product_id bigint, p_quantity integer, p_post_time jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_cart_id BIGINT;
BEGIN
    -- Проверка, существует ли корзина для данного пользователя
    SELECT cart_id INTO user_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    -- Если корзина не существует, создать новую корзину
    IF user_cart_id IS NULL THEN
        INSERT INTO cart (user_id, created_at)
        VALUES (p_user_id, NOW())
        RETURNING cart_id INTO user_cart_id;
    END IF;

    -- Добавление товара в корзину с использованием JSONB для post_time
    INSERT INTO cartitems (cart_id, product_id, quantity, post_time)
    VALUES (user_cart_id, p_product_id, p_quantity, p_post_time);

    -- Подтверждаем успешное выполнение функции
    RAISE NOTICE 'Product added to cart: user_id=%, product_id=%, quantity=%', p_user_id, p_product_id, p_quantity;

END;
$$;


ALTER FUNCTION public.add_to_cart(p_user_id bigint, p_product_id bigint, p_quantity integer, p_post_time jsonb) OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 25507)
-- Name: delete_from_cart(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_from_cart(p_user_id integer, p_product_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_cart_id INT;
BEGIN
    -- Проверка, существует ли корзина для данного пользователя
    SELECT cart_id INTO user_cart_id
    FROM cart
    WHERE user_id = p_user_id
    LIMIT 1;

    -- Если корзина существует, удаляем товар из корзины
    IF user_cart_id IS NOT NULL THEN
        DELETE FROM cartitems
        WHERE cart_id = user_cart_id AND product_id = p_product_id;

        -- Проверка, был ли удален хотя бы один элемент
        IF NOT FOUND THEN
            RAISE NOTICE 'Product with ID % not found in user cart %', p_product_id, user_cart_id;
        ELSE
            RAISE NOTICE 'Product with ID % removed from user cart %', p_product_id, user_cart_id;
        END IF;
    ELSE
        RAISE NOTICE 'Cart not found for user ID %', p_user_id;
    END IF;
END;
$$;


ALTER FUNCTION public.delete_from_cart(p_user_id integer, p_product_id integer) OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 25508)
-- Name: remove_product_from_cart(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.remove_product_from_cart(p_user_id integer, p_product_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_cart_id INT;
BEGIN
    -- Проверка, существует ли корзина для данного пользователя
    SELECT cart_id INTO user_cart_id
    FROM cart
    WHERE user_id = p_user_id;

    -- Если корзина существует, удаляем товар из корзины
    IF user_cart_id IS NOT NULL THEN
        DELETE FROM cartitems
        WHERE cart_id = user_cart_id AND product_id = p_product_id;
    END IF;
END;
$$;


ALTER FUNCTION public.remove_product_from_cart(p_user_id integer, p_product_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 25509)
-- Name: cartitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartitems (
    cart_item_id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer,
    post_time timestamp without time zone NOT NULL,
    format integer NOT NULL
);


ALTER TABLE public.cartitems OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 25514)
-- Name: CartItems_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cartitems ALTER COLUMN cart_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."CartItems_cart_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 25515)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id bigint NOT NULL,
    user_id bigint,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25519)
-- Name: Cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cart ALTER COLUMN cart_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Cart_cart_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 25520)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    category_name character varying(100)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25523)
-- Name: Categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN category_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Categories_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 25524)
-- Name: orderitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderitems (
    order_item_id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    quantity integer,
    price numeric,
    message_id bigint,
    post_time timestamp without time zone,
    format integer,
    chat_id numeric
);


ALTER TABLE public.orderitems OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25529)
-- Name: OrderItems_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orderitems ALTER COLUMN order_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."OrderItems_order_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 25530)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    user_id bigint,
    total_price numeric,
    status character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25536)
-- Name: Orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ALTER COLUMN order_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Orders_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 25537)
-- Name: productImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."productImages" (
    image_id bigint NOT NULL,
    product_id bigint,
    image_url character varying(255)
);


ALTER TABLE public."productImages" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25540)
-- Name: ProductImages_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."productImages" ALTER COLUMN image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ProductImages_image_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 25541)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    category_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status character varying,
    updated_at timestamp without time zone DEFAULT now(),
    channel_id bigint NOT NULL,
    post_time time with time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25548)
-- Name: Products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.products ALTER COLUMN product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Products_product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 25549)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    review_id bigint NOT NULL,
    seller_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    order_id bigint NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25555)
-- Name: Reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Reviews_review_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 25714)
-- Name: product_publication_formats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_publication_formats (
    product_id integer NOT NULL,
    format_id integer NOT NULL
);


ALTER TABLE public.product_publication_formats OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 25746)
-- Name: products_post_time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_post_time (
    post_time_id bigint NOT NULL,
    product_id bigint,
    post_time time with time zone
);


ALTER TABLE public.products_post_time OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25745)
-- Name: products_post_time_post_time_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.products_post_time ALTER COLUMN post_time_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.products_post_time_post_time_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 25706)
-- Name: publication_formats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publication_formats (
    format_id integer NOT NULL,
    format_name character varying(50) NOT NULL
);


ALTER TABLE public.publication_formats OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25705)
-- Name: publication_formats_format_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publication_formats_format_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_formats_format_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 235
-- Name: publication_formats_format_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publication_formats_format_id_seq OWNED BY public.publication_formats.format_id;


--
-- TOC entry 234 (class 1259 OID 25683)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id bigint NOT NULL,
    buyer_id bigint NOT NULL,
    "seller_id " bigint NOT NULL,
    rating integer,
    review_text character varying(255),
    created_at time without time zone DEFAULT now()
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25556)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying,
    rating numeric DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    user_uuid uuid,
    chat_id numeric
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25563)
-- Name: verifiedchannels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verifiedchannels (
    channel_id bigint NOT NULL,
    user_id bigint NOT NULL,
    channel_name character varying(255) NOT NULL,
    channel_url character varying(255) NOT NULL,
    is_verified boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    subscribers_count bigint NOT NULL,
    channel_title character varying(255),
    channel_tg_id bigint NOT NULL,
    views real DEFAULT 0
);


ALTER TABLE public.verifiedchannels OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25572)
-- Name: verifiedchannels_channel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verifiedchannels_channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verifiedchannels_channel_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 233
-- Name: verifiedchannels_channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verifiedchannels_channel_id_seq OWNED BY public.verifiedchannels.channel_id;


--
-- TOC entry 4767 (class 2604 OID 25709)
-- Name: publication_formats format_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication_formats ALTER COLUMN format_id SET DEFAULT nextval('public.publication_formats_format_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 25573)
-- Name: verifiedchannels channel_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifiedchannels ALTER COLUMN channel_id SET DEFAULT nextval('public.verifiedchannels_channel_id_seq'::regclass);


--
-- TOC entry 4961 (class 0 OID 25515)
-- Dependencies: 217
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart (cart_id, user_id, created_at) OVERRIDING SYSTEM VALUE VALUES (1, 801541001, '2024-08-07 20:47:59.823681');
INSERT INTO public.cart (cart_id, user_id, created_at) OVERRIDING SYSTEM VALUE VALUES (4, 5680927718, '2024-08-22 19:54:23.763052');


--
-- TOC entry 4959 (class 0 OID 25509)
-- Dependencies: 215
-- Data for Name: cartitems; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4963 (class 0 OID 25520)
-- Dependencies: 219
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (category_id, category_name) OVERRIDING SYSTEM VALUE VALUES (2, 'Toy');
INSERT INTO public.categories (category_id, category_name) OVERRIDING SYSTEM VALUE VALUES (3, 'Game');
INSERT INTO public.categories (category_id, category_name) OVERRIDING SYSTEM VALUE VALUES (60344, 'News');
INSERT INTO public.categories (category_id, category_name) OVERRIDING SYSTEM VALUE VALUES (60347, 'Anime');
INSERT INTO public.categories (category_id, category_name) OVERRIDING SYSTEM VALUE VALUES (60349, 'Nature');


--
-- TOC entry 4965 (class 0 OID 25524)
-- Dependencies: 221
-- Data for Name: orderitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (107, 87, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (108, 88, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (109, 89, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (110, 90, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (111, 91, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (112, 92, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (113, 93, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (114, 94, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (115, 95, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (116, 96, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (117, 97, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (119, 99, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (120, 100, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (121, 101, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (122, 102, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (123, 103, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (124, 104, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (118, 98, 43, 1, 80000, 812, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (129, 109, 43, 1, 80000, 855, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (126, 106, 43, 1, 80000, 867, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (130, 110, 24, 1, 4444, 882, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (132, 112, 41, 1, 19000, 920, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (92, 72, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (133, 112, 43, 1, 80000, 920, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (93, 73, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (94, 74, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (95, 75, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (53, 36, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (54, 36, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (55, 37, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (56, 38, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (58, 41, 40, 3, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (59, 42, 42, 2, 3000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (60, 43, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (61, 44, 40, 1, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (62, 45, 40, 1, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (63, 46, 40, 1, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (64, 47, 40, 1, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (65, 48, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (66, 49, 10, 50, 345, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (67, 50, 44, 3, 3400, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (68, 51, 40, 2, 5555, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (69, 51, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (70, 51, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (71, 51, 44, 1, 3400, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (72, 52, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (73, 53, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (74, 54, 41, 2, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (75, 55, 42, 1, 3000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (76, 56, 43, 2, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (77, 57, 43, 2, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (78, 58, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (79, 59, 45, 1, 8000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (80, 60, 41, 4, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (81, 61, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (82, 62, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (83, 63, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (84, 64, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (85, 65, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (86, 66, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (87, 67, 3, 1, 10000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (88, 68, 3, 1, 10000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (89, 69, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (90, 70, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (91, 71, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (96, 76, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (97, 77, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (100, 80, 43, 1, 80000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (101, 81, 41, 1, 19000, NULL, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (131, 111, 43, 1, 80000, 1029, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (125, 105, 43, 1, 80000, 1041, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (136, 119, 48, 3, 99999, 1058, '2024-08-01 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (137, 119, 48, 3, 99999, 1058, '2024-08-28 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (138, 120, 43, 1, 80000, 1123, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (140, 121, 48, 1, 99999, 1072, '2024-08-28 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (141, 121, 48, 3, 99999, 1072, '2024-07-31 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (142, 122, 48, 1, 99999, 1110, '2024-08-30 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (143, 122, 48, 1, 99999, 1110, '2024-08-29 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (199, 147, 48, 2, 99999, NULL, '2024-09-19 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (200, 147, 48, 2, 99999, NULL, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (139, 120, 43, 1, 80000, 1123, NULL, NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (144, 123, 48, 2, 99999, 1130, '2024-09-12 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (145, 123, 48, 2, 99999, 1130, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (146, 124, 8, 2, 10000, 1141, '2024-09-20 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (147, 124, 8, 2, 10000, 1141, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (148, 125, 48, 2, 99999, 1157, '2024-07-29 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (149, 125, 48, 2, 99999, 1157, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (201, 147, 48, 2, 99999, NULL, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (202, 147, 48, 2, 99999, NULL, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (150, 126, 48, 2, 99999, 1176, '2024-09-04 15:55:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (183, 142, 8, 2, 10000, 1369, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (184, 142, 8, 2, 10000, 1369, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (185, 142, 8, 2, 10000, 1369, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (186, 142, 8, 2, 10000, 1369, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (234, 159, 53, 1, 111111, NULL, '2024-08-28 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (207, 149, 48, 2, 99999, 1381, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (208, 149, 48, 2, 99999, 1381, '2024-09-19 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (209, 149, 48, 1, 99999, 1381, '2024-09-09 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (151, 126, 48, 2, 99999, 1176, '2024-09-03 21:41:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (210, 149, 48, 1, 99999, 1381, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (211, 149, 48, 1, 99999, 1381, '2024-09-09 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (152, 127, 43, 2, 80000, 1283, '2024-09-03 21:45:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (153, 127, 43, 2, 80000, 1283, '2024-09-04 21:50:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (160, 132, 48, 2, 99999, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (161, 132, 48, 2, 99999, NULL, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (162, 133, 48, 2, 99999, NULL, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (163, 133, 48, 2, 99999, NULL, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (164, 134, 41, 2, 19000, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (165, 135, 48, 2, 99999, NULL, '2024-09-19 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (166, 136, 48, 2, 99999, NULL, '2024-09-26 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (167, 136, 48, 2, 99999, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (168, 136, 48, 2, 99999, NULL, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (169, 137, 46, 3, 60000, NULL, '2024-09-10 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (170, 137, 46, 3, 60000, NULL, '2024-09-12 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (171, 137, 46, 3, 60000, NULL, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (172, 138, 48, 2, 99999, NULL, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (173, 138, 48, 2, 99999, NULL, '2024-09-23 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (174, 139, 41, 2, 19000, NULL, '2024-09-10 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (175, 139, 41, 2, 19000, NULL, '2024-09-03 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (176, 139, 41, 2, 19000, NULL, '2024-09-26 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (177, 139, 48, 2, 99999, NULL, '2024-09-26 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (178, 139, 48, 2, 99999, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (179, 139, 48, 2, 99999, NULL, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (180, 139, 48, 2, 99999, NULL, '2024-09-23 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (181, 140, 48, 1, 99999, NULL, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (182, 141, 48, 1, 99999, NULL, '2024-09-09 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (187, 143, 46, 2, 60000, NULL, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (188, 143, 46, 2, 60000, NULL, '2024-09-10 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (189, 144, 48, 2, 99999, NULL, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (190, 144, 48, 2, 99999, NULL, '2024-09-16 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (191, 145, 48, 2, 99999, NULL, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (192, 145, 48, 2, 99999, NULL, '2024-09-23 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (212, 149, 48, 1, 99999, 1381, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (213, 149, 48, 1, 99999, 1381, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (214, 149, 48, 1, 99999, 1381, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (215, 149, 48, 1, 99999, 1381, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (203, 148, 41, 2, 19000, 1425, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (204, 148, 41, 2, 19000, 1425, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (205, 148, 41, 2, 19000, 1425, '2024-09-26 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (216, 149, 48, 1, 99999, 1381, '2024-09-08 14:07:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (206, 148, 41, 2, 19000, 1425, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (218, 150, 50, 1, 10000, 1450, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (225, 154, 53, 1, 111111, 1497, '2024-09-20 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (219, 151, 53, 1, 111111, 1461, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (220, 151, 53, 2, 111111, 1461, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (221, 151, 53, 2, 111111, 1461, '2024-09-10 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (222, 152, 53, 1, 111111, 1472, '2024-08-27 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (223, 153, 52, 2, 33333, 1484, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (224, 153, 52, 2, 33333, 1484, '2024-09-12 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (226, 154, 53, 1, 111111, 1497, '2024-09-19 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (193, 146, 48, 2, 99999, 1511, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (194, 146, 48, 2, 99999, 1511, '2024-09-16 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (195, 146, 48, 1, 99999, 1511, '2024-09-16 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (196, 146, 48, 1, 99999, 1511, '2024-09-16 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (197, 146, 48, 2, 99999, 1511, '2024-09-18 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (198, 146, 48, 2, 99999, 1511, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (158, 131, 48, 2, 99999, 1524, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (159, 131, 48, 2, 99999, 1524, '2024-09-24 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (235, 159, 53, 1, 111111, NULL, '2024-08-28 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (217, 149, 48, 1, 99999, 1381, '2024-09-08 20:41:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (227, 155, 54, 1, 1200, 1546, '2024-09-09 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (232, 158, 53, 1, 111111, NULL, '2024-09-12 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (233, 158, 53, 1, 111111, NULL, '2024-09-04 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (236, 159, 53, 1, 111111, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (237, 159, 48, 1, 99999, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (238, 159, 53, 1, 111111, NULL, '2024-09-25 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (239, 159, 46, 1, 60000, NULL, '2024-10-02 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (240, 159, 53, 1, 111111, NULL, '2024-09-26 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (241, 159, 52, 1, 33333, NULL, '2024-09-17 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (242, 159, 53, 1, 111111, NULL, '2024-09-04 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (243, 160, 53, 1, 111111, NULL, '2024-09-11 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (244, 161, 53, 1, 111111, NULL, '2024-09-12 00:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (245, 161, 53, 1, 111111, NULL, '2024-09-04 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (246, 162, 53, 1, 111111, NULL, '2024-12-09 00:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (247, 163, 48, 1, 99999, NULL, '2024-09-05 21:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (252, 165, 8, 1, 10000, 1567, '2024-09-25 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (255, 168, 25, 1, 555, NULL, '2024-09-11 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (256, 169, 43, 1, 80000, NULL, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (257, 171, 65, 1, 4444, NULL, '2024-09-11 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (259, 173, 67, 1, 333, 1584, '2024-09-05 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (258, 172, 67, 1, 333, 1593, '2024-09-12 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (260, 174, 65, 1, 4444, 1603, '2024-09-19 12:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (261, 175, 65, 1, 4444, 1613, '2024-09-04 12:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (262, 176, 65, 1, 4444, 1626, '2024-09-19 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (263, 177, 65, 1, 4444, 1637, '2024-09-19 17:56:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (265, 179, 68, 1, 4445, NULL, '2024-09-11 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (266, 180, 53, 1, 111111, 1753, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (267, 180, 53, 1, 111111, 1753, '2024-08-28 14:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (268, 180, 53, 1, 111111, 1753, '2024-08-27 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (269, 180, 53, 1, 111111, 1753, '2024-08-28 14:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (270, 180, 53, 1, 111111, 1753, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (271, 180, 53, 1, 111111, 1753, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (272, 180, 53, 1, 111111, 1753, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (273, 180, 53, 1, 111111, 1753, '2024-08-28 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (274, 181, 68, 2, 4445, 1763, '2024-10-02 12:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (275, 181, 68, 2, 4445, 1763, '2024-10-01 12:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (276, 181, 68, 1, 4445, 1763, '2024-09-26 12:00:00', NULL, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (277, 182, 65, 1, 4444, 1784, '2024-10-02 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (339, 225, 84, 1, 4501, 1998, '2024-12-11 18:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (340, 226, 84, 1, 4501, 2011, '2024-12-19 21:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (318, 214, 84, 1, 4501, NULL, '2024-12-10 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (322, 218, 86, 1, 4500, 1918, '2024-12-22 20:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (360, 244, 77, 1, 444444, 2182, '2025-01-02 16:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (321, 217, 51, 1, 4500, 1940, '2024-12-20 12:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (329, 223, 63, 1, 4501, 1964, '2024-12-18 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (330, 223, 63, 1, 4501, 1964, '2024-12-18 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (331, 224, 51, 2, 4500, 1977, '2024-12-20 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (332, 224, 51, 2, 4500, 1977, '2024-12-19 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (333, 224, 51, 2, 4500, 1977, '2024-12-20 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (334, 224, 51, 2, 4500, 1977, '2024-12-19 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (335, 224, 51, 2, 4500, 1977, '2024-12-20 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (336, 224, 51, 2, 4500, 1977, '2024-12-19 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (337, 224, 51, 2, 4500, 1977, '2024-12-20 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (338, 224, 51, 2, 4500, 1977, '2024-12-19 20:00:00', 5, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (341, 227, 77, 3, 444444, 2024, '2024-12-12 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (342, 227, 77, 3, 444444, 2024, '2024-12-14 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (343, 227, 77, 3, 444444, 2024, '2024-12-13 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (344, 228, 77, 2, 444444, 2095, '2024-12-14 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (345, 228, 77, 2, 444444, 2095, '2024-12-13 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (346, 229, 77, 1, 444444, 2123, '2024-12-25 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (347, 230, 77, 1, 444444, 2139, '2024-12-25 16:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (351, 234, 77, 1, 444444, 2156, '2024-12-30 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (352, 235, 63, 1, 4501, 2168, '2024-12-31 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (353, 236, 87, 2, 67890, NULL, '2024-12-30 16:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (354, 236, 87, 2, 67890, NULL, '2024-12-31 16:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (356, 240, 87, 2, 666777, NULL, '2024-12-29 16:00:00', 1, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (361, 245, 77, 1, 444444, 2237, '2025-01-01 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (363, 246, 77, 2, 444444, 2248, '2025-01-02 20:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (362, 246, 77, 2, 444444, 2248, '2025-01-01 20:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (364, 247, 77, 2, 444444, 2264, '2025-01-08 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (365, 247, 77, 2, 444444, 2264, '2025-01-09 16:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (366, 248, 87, 1, 5100000000000, 2274, '2025-01-10 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (372, 254, 77, 2, 44444, 2305, '2025-01-10 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (371, 253, 63, 1, 4501, 2463, '2025-01-10 12:00:00', 3, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (383, 265, 51, 1, 50000000000, 2305, '2025-01-15 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (387, 269, 86, 1, 5000000000000, 2608, '2025-01-15 12:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (388, 270, 86, 1, 5000000000000, 2627, '2025-01-23 20:00:00', 5, 5680927718);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (389, 271, 86, 1, 5000000000000, 2701, '2025-01-16 12:00:00', 5, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (390, 272, 86, 1, 5000000000000, 2735, '2025-01-16 12:00:00', 3, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (391, 272, 86, 1, 5000000000000, 2735, '2025-01-25 20:00:00', 3, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (395, 276, 86, 1, 5000000000000, NULL, '2025-01-23 20:00:00', 2, NULL);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (396, 277, 86, 1, 5000000000000, 2899, '2025-01-24 12:00:00', 2, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (397, 278, 86, 1, 5000000000000, 2911, '2025-01-17 20:00:00', 3, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (400, 281, 77, 1, 444444, 2967, '2025-01-24 16:00:00', 2, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (401, 282, 51, 1, 50000000000, 2982, '2025-01-24 12:00:00', 2, 801541001);
INSERT INTO public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format, chat_id) OVERRIDING SYSTEM VALUE VALUES (402, 283, 51, 1, 50000000000, 2997, '2025-01-23 12:00:00', 1, 801541001);


--
-- TOC entry 4967 (class 0 OID 25530)
-- Dependencies: 223
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (52, 801541001, 80000, 'rejected', '2024-08-25 08:15:20.24188');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (54, 801541001, 38000, 'waiting', '2024-08-25 08:32:11.360568');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (55, 801541001, 3000, 'waiting', '2024-08-25 09:18:24.702353');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (56, 801541001, 160000, 'awaiting payment', '2024-08-25 17:59:58.14697');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (94, 5680927718, 80000, 'completed', '2024-08-28 20:17:02.948276');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (53, 801541001, 80000, 'awaiting payment', '2024-08-25 08:19:17.214671');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (68, 801541001, 10000, 'completed', '2024-08-28 00:52:28.802669');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (47, 5680927718, 5555, 'awaiting payment', '2024-08-22 20:14:56.089624');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (45, 5680927718, 5555, 'awaiting payment', '2024-08-22 20:09:11.325588');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (57, 5680927718, 160000, 'waiting', '2024-08-25 18:08:10.265357');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (58, 5680927718, 19000, 'ожидает оплаты', '2024-08-25 18:11:44.762594');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (59, 801541001, 8000, 'waiting', '2024-08-25 23:01:13.367169');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (95, 801541001, 80000, 'ожидает оплаты', '2024-08-28 20:19:17.166588');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (69, 801541001, 80000, 'completed', '2024-08-28 00:54:21.916908');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (26, 801541001, 857250, 'completed', '2024-08-08 12:14:15.3794');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (61, 801541001, 80000, 'ожидает оплаты', '2024-08-27 15:50:18.98732');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (106, 801541001, 80000, 'completed', '2024-08-28 21:27:33.75875');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (70, 801541001, 80000, 'completed', '2024-08-28 01:03:22.238341');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (60, 801541001, 76000, 'completed', '2024-08-27 15:50:11.900007');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (96, 801541001, 19000, 'completed', '2024-08-28 20:22:41.004636');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (42, 801541001, 6000, 'rejected', '2024-08-21 19:02:11.966674');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (36, 801541001, 22220, 'completed', '2024-08-21 18:33:15.669814');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (38, 801541001, 11110, 'completed', '2024-08-21 18:35:15.134713');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (41, 801541001, 16665, 'completed', '2024-08-21 18:42:20.277468');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (43, 801541001, 11110, 'completed', '2024-08-21 23:09:23.09902');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (44, 5680927718, 5555, 'completed', '2024-08-22 20:04:10.687966');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (46, 5680927718, 5555, 'completed', '2024-08-22 20:11:06.782822');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (48, 801541001, 80000, 'completed', '2024-08-22 20:18:07.788433');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (50, 801541001, 10200, 'completed', '2024-08-23 18:25:00.563569');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (51, 801541001, 174510, 'completed', '2024-08-23 19:44:57.860914');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (49, 801541001, 17250, 'rejected', '2024-08-22 21:15:23.138804');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (37, 801541001, 11110, 'rejected', '2024-08-21 18:34:26.232264');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (63, 801541001, 80000, 'ожидает оплаты', '2024-08-27 20:50:33.729882');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (71, 801541001, 80000, 'completed', '2024-08-28 01:06:00.926016');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (73, 801541001, 80000, 'completed', '2024-08-28 01:09:48.479773');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (72, 801541001, 19000, 'completed', '2024-08-28 01:09:18.136105');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (74, 801541001, 80000, 'completed', '2024-08-28 01:10:59.604067');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (62, 801541001, 80000, 'completed', '2024-08-27 20:50:31.467456');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (75, 801541001, 80000, 'completed', '2024-08-28 17:38:02.068548');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (64, 801541001, 80000, 'completed', '2024-08-27 21:04:59.313958');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (102, 801541001, 80000, 'completed', '2024-08-28 20:36:22.037836');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (65, 801541001, 80000, 'completed', '2024-08-28 00:31:11.578472');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (76, 801541001, 80000, 'completed', '2024-08-28 18:05:00.624704');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (66, 801541001, 80000, 'completed', '2024-08-28 00:31:54.049908');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (110, 801541001, 4444, 'completed', '2024-08-28 23:10:12.85615');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (67, 801541001, 10000, 'completed', '2024-08-28 00:50:30.735369');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (103, 801541001, 80000, 'completed', '2024-08-28 20:50:14.778003');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (77, 801541001, 80000, 'waiting', '2024-08-28 18:31:07.70593');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (104, 801541001, 80000, 'completed', '2024-08-28 20:53:00.75403');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (90, 801541001, 80000, 'completed', '2024-08-28 19:57:23.484931');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (112, 801541001, 99000, 'ожидает оплаты', '2024-08-29 20:53:03.937252');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (91, 801541001, 80000, 'completed', '2024-08-28 20:14:28.938983');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (100, 801541001, 80000, 'completed', '2024-08-28 20:34:35.748118');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (88, 801541001, 80000, 'completed', '2024-08-28 19:54:01.428304');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (80, 801541001, 80000, 'completed', '2024-08-28 19:02:59.824224');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (87, 801541001, 80000, 'completed', '2024-08-28 19:51:00.708072');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (98, 801541001, 80000, 'waiting', '2024-08-28 20:33:04.966453');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (109, 801541001, 80000, 'completed', '2024-08-28 22:29:47.27948');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (111, 801541001, 80000, 'ожидает оплаты', '2024-08-29 20:46:23.607715');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (126, 801541001, 399996, 'completed', '2024-09-03 22:59:06.227222');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (105, 801541001, 80000, 'completed', '2024-08-28 21:10:55.187678');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (121, 801541001, 399996, 'waiting', '2024-09-03 18:12:29.796048');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (150, 801541001, 10000, 'completed', '2024-09-08 20:47:09.541979');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (122, 801541001, 199998, 'completed', '2024-09-03 18:20:50.529737');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (127, 801541001, 320000, 'completed', '2024-09-04 21:42:20.226469');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (123, 801541001, 399996, 'completed', '2024-09-03 18:33:06.606655');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (124, 801541001, 40000, 'completed', '2024-09-03 18:44:53.43721');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (125, 801541001, 399996, 'completed', '2024-09-03 18:46:12.964035');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (142, 801541001, 80000, 'completed', '2024-09-06 20:17:17.485088');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (214, 801541001, 33333, 'completed', '2024-12-09 16:46:42.558588');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (226, 801541001, 4501, 'completed', '2025-01-07 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (218, 801541001, 4500, 'pending_payment', '2024-12-09 19:41:27.540084');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (227, 801541001, 3999996, 'completed', '2025-01-07 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (228, 801541001, 1777776, 'completed', '2025-01-05 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (148, 801541001, 152000, 'completed', '2024-09-06 20:37:07.171846');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (149, 801541001, 1299987, 'completed', '2024-09-07 21:33:39.895132');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (153, 801541001, 133332, 'completed', '2024-09-08 20:54:25.377924');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (151, 801541001, 555555, 'completed', '2024-09-08 20:49:35.845352');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (152, 801541001, 111111, 'completed', '2024-09-08 20:53:37.640577');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (154, 801541001, 222222, 'completed', '2024-09-09 20:34:15.364344');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (146, 801541001, 999990, 'completed', '2024-09-06 20:36:30.653315');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (131, 801541001, 399996, 'completed', '2024-09-06 14:39:45.504796');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (155, 801541001, 1200, 'completed', '2024-09-09 21:01:37.877781');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (229, 801541001, 444444, 'completed', '2025-01-04 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (234, 801541001, 444444, 'completed', '2025-01-02 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (165, 801541001, 10000, 'waiting', '2024-09-15 16:41:47.347632');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (253, 801541001, 4501, 'waiting', '2025-01-09 18:00:20.63655');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (248, 801541001, 5100000000000, 'completed', '2025-01-09 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (224, 801541001, 72000, 'completed', '2025-01-09 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (236, 801541001, 3333333333, 'completed', '2025-01-04 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (240, 801541001, 333333333, 'completed', '2025-01-05 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (245, 801541001, 444444, 'waiting', '2025-01-07 01:32:31.092291');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (247, 801541001, 1777776, 'completed', '2025-01-06 20:38:28.01819');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (271, 801541001, 5000000000000, 'completed', '2025-01-14 20:54:17.973347');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (265, 801541001, 50000000000, 'problem', '2025-01-14 15:16:58.582104');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (269, 5680927718, 5000000000000, 'completed', '2025-01-14 16:13:09.633145');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (277, 801541001, 100000000, 'paid', '2025-01-14 22:23:57.850575');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (282, 801541001, 50000000000, 'paid', '2025-01-22 19:54:09.34509');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (173, 801541001, 333, 'completed', '2024-09-19 17:35:13.334928');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (172, 801541001, 333, 'ожидает оплаты', '2024-09-19 17:34:10.326478');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (174, 801541001, 4444, 'completed', '2024-09-19 17:44:36.044471');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (175, 801541001, 4444, 'completed', '2024-09-19 17:45:20.848616');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (176, 801541001, 4444, 'completed', '2024-09-19 17:46:21.388683');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (177, 801541001, 4444, 'completed', '2024-09-19 17:48:05.977978');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (40, 801541001, 11110, 'completed', '2024-08-21 18:41:25.891302');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (97, 801541001, 19000, 'completed', '2024-08-28 20:31:07.38026');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (99, 801541001, 80000, 'completed', '2024-08-28 20:34:02.073213');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (101, 801541001, 80000, 'completed', '2024-08-28 20:35:46.773021');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (81, 801541001, 19000, 'completed', '2024-08-28 19:04:08.366205');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (89, 801541001, 19000, 'completed', '2024-08-28 19:57:05.28129');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (92, 5680927718, 80000, 'completed', '2024-08-28 20:15:10.86605');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (93, 5680927718, 80000, 'completed', '2024-08-28 20:16:01.266718');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (119, 801541001, 599994, 'completed', '2024-09-03 18:05:14.11468');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (120, 801541001, 160000, 'completed', '2024-09-03 18:09:39.510774');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (132, 801541001, 399996, 'completed', '2024-09-06 14:59:21.698574');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (133, 801541001, 399996, 'completed', '2024-09-06 15:14:41.953089');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (134, 801541001, 38000, 'completed', '2024-09-06 15:47:00.066389');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (135, 801541001, 199998, 'completed', '2024-09-06 15:47:53.82831');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (136, 801541001, 599994, 'completed', '2024-09-06 15:53:39.467523');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (137, 801541001, 540000, 'completed', '2024-09-06 19:46:51.647608');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (138, 801541001, 399996, 'completed', '2024-09-06 20:13:19.681352');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (139, 801541001, 913992, 'completed', '2024-09-06 20:16:21.331677');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (140, 801541001, 99999, 'completed', '2024-09-06 20:16:52.989377');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (141, 801541001, 99999, 'completed', '2024-09-06 20:17:11.37952');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (143, 801541001, 240000, 'completed', '2024-09-06 20:23:42.54093');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (144, 801541001, 399996, 'completed', '2024-09-06 20:31:58.535721');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (145, 801541001, 399996, 'completed', '2024-09-06 20:32:32.954565');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (147, 801541001, 799992, 'completed', '2024-09-06 20:37:05.591339');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (158, 801541001, 222222, 'completed', '2024-09-15 15:45:54.389578');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (159, 801541001, 859998, 'completed', '2024-09-15 15:58:27.976305');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (160, 801541001, 111111, 'completed', '2024-09-15 15:59:28.937419');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (161, 801541001, 222222, 'completed', '2024-09-15 16:15:05.35199');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (162, 801541001, 111111, 'completed', '2024-09-15 16:16:46.896405');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (163, 801541001, 99999, 'completed', '2024-09-15 16:32:21.726613');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (168, 801541001, 555, 'completed', '2024-09-18 22:40:55.71692');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (169, 801541001, 80000, 'completed', '2024-09-19 17:27:45.14439');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (171, 801541001, 4444, 'completed', '2024-09-19 17:32:57.428705');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (179, 801541001, 4445, 'completed', '2024-09-26 21:39:49.041041');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (180, 801541001, 888888, 'ожидает оплаты', '2024-09-26 21:45:07.232555');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (181, 801541001, 22225, 'completed', '2024-09-27 20:29:18.889509');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (182, 801541001, 4444, 'ожидает оплаты', '2024-09-27 21:53:39.456396');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (217, 801541001, 4500, 'pending_payment', '2024-12-09 19:39:39.30807');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (223, 801541001, 9002, 'completed', '2025-01-05 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (225, 801541001, 4501, 'completed', '2025-01-07 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (246, 801541001, 1777776, 'completed', '2025-01-08 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (230, 801541001, 444444, 'completed', '2025-01-02 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (235, 801541001, 4501, 'completed', '2025-01-03 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (244, 801541001, 444444, 'completed', '2025-01-06 16:28:04.699219');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (270, 5680927718, 5000000000000, 'problem', '2025-01-14 16:32:36.226592');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (272, 801541001, 10000000000000, 'paid', '2025-01-14 20:58:45.43463');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (276, 801541001, 5000000000000, 'paid', '2025-01-14 21:48:03.338945');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (278, 801541001, 5000000000000, 'waiting', '2025-01-14 22:24:51.701781');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (281, 801541001, 444444, 'paid', '2025-01-20 14:06:39.617195');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (254, 801541001, 44444, 'paid', '2025-01-09 19:21:46.865834');
INSERT INTO public.orders (order_id, user_id, total_price, status, created_at) OVERRIDING SYSTEM VALUE VALUES (283, 801541001, 50000000000, 'paid', '2025-01-22 21:30:51.356687');


--
-- TOC entry 4969 (class 0 OID 25537)
-- Dependencies: 225
-- Data for Name: productImages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4981 (class 0 OID 25714)
-- Dependencies: 237
-- Data for Name: product_publication_formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (25, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (25, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (25, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (62, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (62, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (62, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (64, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (64, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (64, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (65, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (65, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (65, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (66, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (66, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (66, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (67, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (68, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (68, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (68, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (69, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (69, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (69, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (70, 6);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (71, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (71, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (71, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (72, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (72, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (72, 6);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (73, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (73, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (73, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (73, 6);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (74, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (74, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (75, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (75, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (76, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (76, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (76, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (77, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (77, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (77, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (78, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (78, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (78, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (79, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (79, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (80, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (80, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (81, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (81, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (81, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (82, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (82, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (82, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (83, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (83, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (83, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (84, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (84, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (84, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (63, 6);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (86, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (86, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (86, 5);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (87, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (87, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (87, 3);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (87, 4);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (51, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (51, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (85, 1);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (85, 2);
INSERT INTO public.product_publication_formats (product_id, format_id) VALUES (85, 3);


--
-- TOC entry 4971 (class 0 OID 25541)
-- Dependencies: 227
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (2, 1234, 3, 'Hello', 'The title', 1000, '2024-08-07 20:02:30.32218', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (3, 801541001, 3, 'Hello2', 'The description', 10000, '2024-08-07 20:04:56.027888', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (7, 801541001, 3, 'Hello2', 'The description', 10000, '2024-08-07 20:15:16.116987', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (8, 801541001, 3, 'Hello2', 'The description', 10000, '2024-08-07 20:17:02.629511', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (10, 801541001, 3, 'ffff', 'THE order history', 345, '2024-08-08 12:13:18.112342', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (11, 801541001, 3, '5555', '5555', 555, '2024-08-11 21:56:40.391549', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (24, 801541001, 2, 'уцацуац', 'цуцкуц', 4444, '2024-08-11 22:02:47.242701', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (25, 801541001, 3, 'ецкцу', 'уцкецкуе', 555, '2024-08-11 22:02:47.242701', 'work', '2024-08-16 22:13:20.51976', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (40, 801541001, 3, 'POP', 'ewfdewffs', 5555, '2024-08-19 16:27:45.353343', 'work', '2024-08-19 16:27:45.353343', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (41, 801541001, 3, 'Test2', 'jjjjjjjjjjjjjjjjj', 19000, '2024-08-19 19:58:19.693045', 'work', '2024-08-19 19:58:19.693045', 2, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (42, 801541001, 60344, 'Test2', 'rrrrrrrrrrrrrrrrr', 3000, '2024-08-21 19:00:06.678983', 'work', '2024-08-21 19:00:06.678983', 2, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (67, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-09-17 20:52:54.172659', 'work', '2024-09-17 20:52:54.172659', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (68, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-09-24 22:00:42.742783', 'work', '2024-09-24 22:00:42.742783', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (72, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-10-02 21:41:56.353001', 'work', '2024-10-02 21:41:56.353001', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (84, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-10-13 11:39:00.048555', 'work', '2024-10-13 11:39:00.048555', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (62, 801541001, 60344, 'TestCheenal', 'аааа', 50000000000, '2024-09-16 11:12:51.276204', 'work', '2024-09-16 11:12:51.276204', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (70, 801541001, 60344, 'TestCheenal', 'аааа', 5000000000, '2024-09-27 20:42:39.70717', 'work', '2024-09-27 20:42:39.70717', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (85, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 400000000, '2024-10-13 11:49:23.935033', 'work', '2024-10-13 11:49:23.935033', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (87, 801541001, 2, 'TestCheenal', 'аааа', 50000000000, '2024-10-19 17:02:50.394988', 'work', '2024-10-19 17:02:50.394988', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (86, 801541001, 60344, 'TestCheenal', 'аааа', 5000000000000, '2024-10-13 18:43:21.881466', 'work', '2024-10-13 18:43:21.881466', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (43, 801541001, 3, 'POP', 'hhhh', 80000, '2024-08-22 20:17:44.778256', 'work', '2024-08-22 20:17:44.778256', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (44, 801541001, 60347, 'POP', 'Hello world!', 3400, '2024-08-23 18:23:14.288506', 'work', '2024-08-23 18:23:14.288506', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (45, 801541001, 3, 'POP', 'ghjjg', 8000, '2024-08-25 09:20:06.527269', 'work', '2024-08-25 09:20:06.527269', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (46, 801541001, 60344, 'POP', 'hhhhhhh', 60000, '2024-08-28 23:09:10.171627', 'work', '2024-08-28 23:09:10.171627', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (47, 801541001, 3, 'Test2', 'ss', 4444, '2024-08-30 16:00:12.748271', 'work', '2024-08-30 16:00:12.748271', 2, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (48, 801541001, 60344, 'POP', 'aaaa', 99999, '2024-08-30 16:00:38.64405', 'work', '2024-08-30 16:00:38.64405', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (49, 801541001, 3, 'POP', 'ss', 3333, '2024-09-02 14:22:31.556736', 'work', '2024-09-02 14:22:31.556736', 1, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (53, 801541001, 60347, 'Droid_Ad', '22222', 111111, '2024-09-07 23:18:56.858635', 'work', '2024-09-07 23:18:56.858635', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (52, 801541001, 60349, 'Forest_add', 'ffff', 33333, '2024-09-07 23:09:22.249012', 'work', '2024-09-07 23:09:22.249012', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (54, 801541001, 60349, 'Forest_add', 'Ащкуые шы ', 1200, '2024-09-09 20:58:38.453821', 'work', '2024-09-09 20:58:38.453821', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (55, 801541001, 60349, 'Forest_add', 's', 1200, '2024-09-09 20:59:57.955337', 'work', '2024-09-09 20:59:57.955337', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (60, 801541001, 60349, 'Droid_Ad', 'sddsd', 44, '2024-09-15 20:31:21.68174', 'work', '2024-09-15 20:31:21.68174', 16, '20:35:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (56, 801541001, 60347, 'Forest_add', 'Test post_time', 2000, '2024-09-15 15:39:21.384931', 'work', '2024-09-15 15:39:21.384931', 15, '20:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (57, 801541001, 60347, 'Forest_add', 'вввввв', 2300, '2024-09-15 20:23:54.697027', 'work', '2024-09-15 20:23:54.697027', 15, '00:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (59, 801541001, 60349, 'Droid_Ad', 'hhhh', 745, '2024-09-15 20:28:11.419068', 'work', '2024-09-15 20:28:11.419068', 16, '00:30:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (61, 801541001, 2, 'Forest_add', 'ddd', 333, '2024-09-16 11:08:41.176489', 'work', '2024-09-16 11:08:41.176489', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (64, 801541001, 60349, 'Forest_add', 'ddddd', 333, '2024-09-17 20:37:23.898041', 'work', '2024-09-17 20:37:23.898041', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (65, 801541001, 2, 'Droid_Ad', 'toy', 4444, '2024-09-17 20:43:01.192736', 'work', '2024-09-17 20:43:01.192736', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (51, 801541001, 60344, 'TestCheenal', 'аааа', 50000000000, '2024-09-07 22:21:30.630848', 'work', '2024-09-07 22:21:30.630848', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (66, 801541001, 60347, 'Forest_add', 'sss', 3333, '2024-09-17 20:47:16.420961', 'work', '2024-09-17 20:47:16.420961', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (69, 801541001, 60344, 'Droid_Ad', 'This channel Droid_add', 3500, '2024-09-27 20:35:20.434736', 'work', '2024-09-27 20:35:20.434736', 16, '19:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (74, 801541001, 2, 'Forest_add', 'ццц', 2211, '2024-10-02 21:43:56.314161', 'work', '2024-10-02 21:43:56.314161', 15, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (75, 801541001, 60344, 'Test2', 'sss', 222, '2024-10-02 21:46:05.046758', 'work', '2024-10-02 21:46:05.046758', 2, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (78, 801541001, 60347, 'Droid_Ad', 'Post time ', 3000, '2024-10-07 21:40:58.194181', 'work', '2024-10-07 21:40:58.194181', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (80, 801541001, 60349, 'Droid_Ad', 'Post time ', 3000, '2024-10-07 21:44:06.742044', 'work', '2024-10-07 21:44:06.742044', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (81, 801541001, 60347, 'Droid_Ad', 'Post time ', 3000, '2024-10-07 21:49:55.490519', 'work', '2024-10-07 21:49:55.490519', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (82, 801541001, 60347, 'Droid_Ad', 'eee', 2000, '2024-10-07 21:50:26.512113', 'work', '2024-10-07 21:50:26.512113', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (83, 801541001, 60344, 'Droid_Ad', '3333', 4444, '2024-10-09 18:07:40.165853', 'work', '2024-10-09 18:07:40.165853', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (63, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-09-17 20:33:07.837854', 'work', '2024-09-17 20:33:07.837854', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (50, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-09-07 22:19:11.990092', 'work', '2024-09-07 22:19:11.990092', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (58, 801541001, 60347, 'MyPopikChannel', 'уууууууууууууу', 4501, '2024-09-15 20:27:07.898491', 'work', '2024-09-15 20:27:07.898491', 11, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (77, 801541001, 60344, 'Droid_Ad', 'gggggg', 444444, '2024-10-02 21:48:09.211555', 'work', '2024-10-02 21:48:09.211555', 16, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (79, 801541001, 60344, 'TestCheenal', 'аааа', 50000000000, '2024-10-07 21:42:28.301832', 'work', '2024-10-07 21:42:28.301832', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (71, 801541001, 60344, 'TestCheenal', 'аааа', 5000000000, '2024-10-02 21:41:12.94143', 'work', '2024-10-02 21:41:12.94143', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (73, 801541001, 60344, 'TestCheenal', 'аааа', 500000000000, '2024-10-02 21:43:12.680218', 'work', '2024-10-02 21:43:12.680218', 7, '12:00:00+03');
INSERT INTO public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) OVERRIDING SYSTEM VALUE VALUES (76, 801541001, 60344, 'TestCheenal', 'аааа', 5000000000, '2024-10-02 21:47:30.29453', 'work', '2024-10-02 21:47:30.29453', 7, '12:00:00+03');


--
-- TOC entry 4983 (class 0 OID 25746)
-- Dependencies: 239
-- Data for Name: products_post_time; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (1, 77, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (2, 77, '16:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (3, 77, '20:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (4, 82, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (5, 82, '14:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (6, 83, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (7, 83, '14:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (8, 84, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (9, 84, '18:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (10, 84, '21:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (14, 63, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (15, 86, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (16, 86, '20:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (30, 51, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (31, 51, '20:15:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (40, 85, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (45, 66, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (69, 87, '12:00:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (70, 87, '20:15:00+03');
INSERT INTO public.products_post_time (post_time_id, product_id, post_time) OVERRIDING SYSTEM VALUE VALUES (71, 87, '23:00:00+03');


--
-- TOC entry 4980 (class 0 OID 25706)
-- Dependencies: 236
-- Data for Name: publication_formats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.publication_formats (format_id, format_name) VALUES (1, '1/24');
INSERT INTO public.publication_formats (format_id, format_name) VALUES (2, '2/48');
INSERT INTO public.publication_formats (format_id, format_name) VALUES (3, '3/72');
INSERT INTO public.publication_formats (format_id, format_name) VALUES (4, 'Indefinite');
INSERT INTO public.publication_formats (format_id, format_name) VALUES (5, 'Repost');
INSERT INTO public.publication_formats (format_id, format_name) VALUES (6, 'Response');


--
-- TOC entry 4978 (class 0 OID 25683)
-- Dependencies: 234
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.review (review_id, buyer_id, "seller_id ", rating, review_text, created_at) VALUES (1, 801541001, 801541001, 3, 'eeeee', '15:14:02.560304');


--
-- TOC entry 4973 (class 0 OID 25549)
-- Dependencies: 229
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (1, 801541001, 5680927718, 5, 'Very good!', '2024-09-08 14:50:44.629711', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (2, 801541001, 5680927718, 3, 'So So', '2024-09-08 14:51:02.15636', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (3, 5680927718, 801541001, 3, 'rrr', '2024-09-08 15:04:12.800705', 148);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (5, 5680927718, 801541001, 4, 'а', '2024-09-08 15:16:40.157766', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (6, 5680927718, 801541001, 4, 'а', '2024-09-08 15:17:50.270766', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (8, 801541001, 801541001, 4, 'а', '2024-09-08 15:26:34.546973', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (9, 801541001, 801541001, 4, 'а', '2024-09-08 15:27:00.983142', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (10, 801541001, 801541001, 4, 'а', '2024-09-08 15:29:49.053906', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (11, 801541001, 801541001, 3, 'а', '2024-09-08 15:29:51.392674', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (12, 801541001, 801541001, 5, 'а', '2024-09-08 15:33:51.127712', 149);
INSERT INTO public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) OVERRIDING SYSTEM VALUE VALUES (13, 801541001, 801541001, 5, 'Good seller', '2024-09-09 20:42:11.449377', 149);


--
-- TOC entry 4975 (class 0 OID 25556)
-- Dependencies: 231
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (1234, 'vlad', 0, '2024-08-07 14:51:06.349819', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (12345, 'АПРОО', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (123456, 'кпкыпк', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (1234567, 'крнеренра', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (2345, 'лролдошлдлро', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (3456, 'ропропр', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (543, 'кпуррвнере', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (5432, 'наоноане', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (4576, 'ррмрооьпролрл', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (23421, 'нораноаньнг', 0, '2024-08-12 15:17:13.739202', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (12345577, 'STEEEPP', 0, '2024-08-22 20:00:35.845149', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (5680927718, 'Sidogini', 4.00, '2024-08-22 19:49:41.326893', NULL, NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (801541001, 'Степан', 4.00, '2024-08-07 17:41:45.268639', '4526c40d-3bb8-45ac-af4f-d751e64aceb3', NULL);
INSERT INTO public.users (user_id, username, rating, created_at, user_uuid, chat_id) VALUES (6337131614, 'Pop', 0, '2024-11-19 14:05:41.43304', 'c474d80f-88a6-403a-8a95-acbbd76d2251', NULL);


--
-- TOC entry 4976 (class 0 OID 25563)
-- Dependencies: 232
-- Data for Name: verifiedchannels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (1, 801541001, 'POP', 'https://t.me/MyPopikChannel', true, true, '2024-08-16 22:31:08.182633+03', '2024-08-16 22:31:08.182633+03', 100, NULL, 111, NULL);
INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (2, 801541001, 'Test2', 'https://t.me/MyPopikChannel', true, true, '2024-08-18 09:55:08.05338+03', '2024-08-18 09:55:08.05338+03', 1200, NULL, 234, NULL);
INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (15, 801541001, 'Forest_add', 'https://t.me/Forest_add', true, true, '2024-09-07 23:06:18.298546+03', '2024-09-07 23:06:18.298546+03', 2, 'Forest', -1002251249447, NULL);
INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (16, 801541001, 'Droid_Ad', 'https://t.me/Droid_Ad', true, true, '2024-09-07 23:06:24.36951+03', '2024-09-07 23:06:24.36951+03', 2, 'Droid', -1002367345063, NULL);
INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (7, 801541001, 'TestCheenal', 'https://t.me/TestCheenal', true, true, '2024-08-26 22:29:00.965562+03', '2024-08-26 22:29:00.965562+03', 4, 'Test канал', -1002067887794, 2.6666667);
INSERT INTO public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) VALUES (11, 801541001, 'MyPopikChannel', 'https://t.me/MyPopikChannel', true, true, '2024-08-29 12:54:39.376999+03', '2024-08-29 12:54:39.376999+03', 4, 'Попик', -1002109696428, 9.333333);


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 216
-- Name: CartItems_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItems_cart_item_id_seq"', 368, true);


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 218
-- Name: Cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cart_cart_id_seq"', 4, true);


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 220
-- Name: Categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Categories_category_id_seq"', 60349, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 222
-- Name: OrderItems_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItems_order_item_id_seq"', 402, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 224
-- Name: Orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Orders_order_id_seq"', 283, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 226
-- Name: ProductImages_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductImages_image_id_seq"', 1, false);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 228
-- Name: Products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Products_product_id_seq"', 87, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 230
-- Name: Reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Reviews_review_id_seq"', 13, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 238
-- Name: products_post_time_post_time_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_post_time_post_time_id_seq', 71, true);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 235
-- Name: publication_formats_format_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publication_formats_format_id_seq', 6, true);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 233
-- Name: verifiedchannels_channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verifiedchannels_channel_id_seq', 16, true);


--
-- TOC entry 4769 (class 2606 OID 25575)
-- Name: cartitems CartItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY (cart_item_id);


--
-- TOC entry 4771 (class 2606 OID 25577)
-- Name: cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (cart_id);


--
-- TOC entry 4773 (class 2606 OID 25579)
-- Name: categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (category_id);


--
-- TOC entry 4775 (class 2606 OID 25581)
-- Name: orderitems OrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (order_item_id);


--
-- TOC entry 4777 (class 2606 OID 25583)
-- Name: orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (order_id);


--
-- TOC entry 4779 (class 2606 OID 25585)
-- Name: productImages ProductImages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImages_pkey" PRIMARY KEY (image_id);


--
-- TOC entry 4781 (class 2606 OID 25587)
-- Name: products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (product_id);


--
-- TOC entry 4783 (class 2606 OID 25589)
-- Name: reviews Reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (review_id);


--
-- TOC entry 4785 (class 2606 OID 25591)
-- Name: users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);


--
-- TOC entry 4797 (class 2606 OID 25718)
-- Name: product_publication_formats product_publication_formats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_pkey PRIMARY KEY (product_id, format_id);


--
-- TOC entry 4799 (class 2606 OID 25750)
-- Name: products_post_time products_post_time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_post_time
    ADD CONSTRAINT products_post_time_pkey PRIMARY KEY (post_time_id);


--
-- TOC entry 4793 (class 2606 OID 25713)
-- Name: publication_formats publication_formats_format_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication_formats
    ADD CONSTRAINT publication_formats_format_name_key UNIQUE (format_name);


--
-- TOC entry 4795 (class 2606 OID 25711)
-- Name: publication_formats publication_formats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publication_formats
    ADD CONSTRAINT publication_formats_pkey PRIMARY KEY (format_id);


--
-- TOC entry 4791 (class 2606 OID 25688)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4787 (class 2606 OID 25593)
-- Name: verifiedchannels tg_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT tg_id UNIQUE (channel_tg_id);


--
-- TOC entry 4789 (class 2606 OID 25595)
-- Name: verifiedchannels verifiedchannels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_pkey PRIMARY KEY (channel_id);


--
-- TOC entry 4800 (class 2606 OID 25596)
-- Name: cartitems CartItem_Cart_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Cart_FK" FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id);


--
-- TOC entry 4801 (class 2606 OID 25601)
-- Name: cartitems CartItem_Product_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4802 (class 2606 OID 25606)
-- Name: cart Cart_User_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4803 (class 2606 OID 26224)
-- Name: orderitems OrderItem_Order_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Order_FK" FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4804 (class 2606 OID 25616)
-- Name: orderitems OrderItem_Product_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4806 (class 2606 OID 25621)
-- Name: orders Order_User_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Order_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4805 (class 2606 OID 25729)
-- Name: orderitems OrederIrem_Format_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrederIrem_Format_FK" FOREIGN KEY (format) REFERENCES public.publication_formats(format_id) NOT VALID;


--
-- TOC entry 4807 (class 2606 OID 25626)
-- Name: productImages ProductImage_Product_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImage_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4808 (class 2606 OID 25631)
-- Name: products Product_Category_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Category_FK" FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 4809 (class 2606 OID 25636)
-- Name: products Product_Channels_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Channels_FK" FOREIGN KEY (channel_id) REFERENCES public.verifiedchannels(channel_id) NOT VALID;


--
-- TOC entry 4810 (class 2606 OID 25641)
-- Name: products Product_User_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4811 (class 2606 OID 25689)
-- Name: reviews order_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT order_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) NOT VALID;


--
-- TOC entry 4815 (class 2606 OID 25751)
-- Name: products_post_time product_id_FK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_post_time
    ADD CONSTRAINT "product_id_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4813 (class 2606 OID 25724)
-- Name: product_publication_formats product_publication_formats_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.publication_formats(format_id) ON DELETE CASCADE;


--
-- TOC entry 4814 (class 2606 OID 25719)
-- Name: product_publication_formats product_publication_formats_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- TOC entry 4812 (class 2606 OID 25646)
-- Name: verifiedchannels verifiedchannels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2025-01-28 07:43:12

--
-- PostgreSQL database dump complete
--

