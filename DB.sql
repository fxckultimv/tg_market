PGDMP              	    	    |            TeleAdMarket    16.3    16.3 ]    z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            {           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            |           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            }           1262    25208    TeleAdMarket    DATABASE     �   CREATE DATABASE "TeleAdMarket" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
    DROP DATABASE "TeleAdMarket";
                postgres    false            �            1255    25506 +   add_to_cart(bigint, bigint, integer, jsonb)    FUNCTION     p  CREATE FUNCTION public.add_to_cart(p_user_id bigint, p_product_id bigint, p_quantity integer, p_post_time jsonb) RETURNS void
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
 p   DROP FUNCTION public.add_to_cart(p_user_id bigint, p_product_id bigint, p_quantity integer, p_post_time jsonb);
       public          postgres    false            �            1255    25507 "   delete_from_cart(integer, integer)    FUNCTION       CREATE FUNCTION public.delete_from_cart(p_user_id integer, p_product_id integer) RETURNS void
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
 P   DROP FUNCTION public.delete_from_cart(p_user_id integer, p_product_id integer);
       public          postgres    false            �            1255    25508 *   remove_product_from_cart(integer, integer)    FUNCTION     l  CREATE FUNCTION public.remove_product_from_cart(p_user_id integer, p_product_id integer) RETURNS void
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
 X   DROP FUNCTION public.remove_product_from_cart(p_user_id integer, p_product_id integer);
       public          postgres    false            �            1259    25509 	   cartitems    TABLE     �   CREATE TABLE public.cartitems (
    cart_item_id bigint NOT NULL,
    cart_id bigint,
    product_id bigint,
    quantity integer,
    post_time timestamp without time zone,
    format integer
);
    DROP TABLE public.cartitems;
       public         heap    postgres    false            �            1259    25514    CartItems_cart_item_id_seq    SEQUENCE     �   ALTER TABLE public.cartitems ALTER COLUMN cart_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."CartItems_cart_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    25515    cart    TABLE     �   CREATE TABLE public.cart (
    cart_id bigint NOT NULL,
    user_id bigint,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    25519    Cart_cart_id_seq    SEQUENCE     �   ALTER TABLE public.cart ALTER COLUMN cart_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Cart_cart_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    217            �            1259    25520 
   categories    TABLE     n   CREATE TABLE public.categories (
    category_id bigint NOT NULL,
    category_name character varying(100)
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    25523    Categories_category_id_seq    SEQUENCE     �   ALTER TABLE public.categories ALTER COLUMN category_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Categories_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    219            �            1259    25524 
   orderitems    TABLE     �   CREATE TABLE public.orderitems (
    order_item_id bigint NOT NULL,
    order_id bigint,
    product_id bigint,
    quantity integer,
    price numeric,
    message_id bigint,
    post_time timestamp without time zone,
    format integer
);
    DROP TABLE public.orderitems;
       public         heap    postgres    false            �            1259    25529    OrderItems_order_item_id_seq    SEQUENCE     �   ALTER TABLE public.orderitems ALTER COLUMN order_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."OrderItems_order_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    221            �            1259    25530    orders    TABLE     �   CREATE TABLE public.orders (
    order_id bigint NOT NULL,
    user_id bigint,
    total_price numeric,
    status character varying,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    25536    Orders_order_id_seq    SEQUENCE     �   ALTER TABLE public.orders ALTER COLUMN order_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Orders_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    223            �            1259    25537    productImages    TABLE     �   CREATE TABLE public."productImages" (
    image_id bigint NOT NULL,
    product_id bigint,
    image_url character varying(255)
);
 #   DROP TABLE public."productImages";
       public         heap    postgres    false            �            1259    25540    ProductImages_image_id_seq    SEQUENCE     �   ALTER TABLE public."productImages" ALTER COLUMN image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."ProductImages_image_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    225            �            1259    25541    products    TABLE     �  CREATE TABLE public.products (
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
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    25548    Products_product_id_seq    SEQUENCE     �   ALTER TABLE public.products ALTER COLUMN product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Products_product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    227            �            1259    25549    reviews    TABLE     �   CREATE TABLE public.reviews (
    review_id bigint NOT NULL,
    seller_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    order_id bigint NOT NULL
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    25555    Reviews_review_id_seq    SEQUENCE     �   ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Reviews_review_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    229            �            1259    25714    product_publication_formats    TABLE     u   CREATE TABLE public.product_publication_formats (
    product_id integer NOT NULL,
    format_id integer NOT NULL
);
 /   DROP TABLE public.product_publication_formats;
       public         heap    postgres    false            �            1259    25746    products_post_time    TABLE     �   CREATE TABLE public.products_post_time (
    post_time_id bigint NOT NULL,
    product_id bigint,
    post_time time with time zone
);
 &   DROP TABLE public.products_post_time;
       public         heap    postgres    false            �            1259    25745 #   products_post_time_post_time_id_seq    SEQUENCE     �   ALTER TABLE public.products_post_time ALTER COLUMN post_time_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.products_post_time_post_time_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    239            �            1259    25706    publication_formats    TABLE     |   CREATE TABLE public.publication_formats (
    format_id integer NOT NULL,
    format_name character varying(50) NOT NULL
);
 '   DROP TABLE public.publication_formats;
       public         heap    postgres    false            �            1259    25705 !   publication_formats_format_id_seq    SEQUENCE     �   CREATE SEQUENCE public.publication_formats_format_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.publication_formats_format_id_seq;
       public          postgres    false    236            ~           0    0 !   publication_formats_format_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.publication_formats_format_id_seq OWNED BY public.publication_formats.format_id;
          public          postgres    false    235            �            1259    25683    review    TABLE     �   CREATE TABLE public.review (
    review_id bigint NOT NULL,
    buyer_id bigint NOT NULL,
    "seller_id " bigint NOT NULL,
    rating integer,
    review_text character varying(255),
    created_at time without time zone DEFAULT now()
);
    DROP TABLE public.review;
       public         heap    postgres    false            �            1259    25556    users    TABLE     �   CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying,
    rating numeric DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    user_uuid uuid
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    25563    verifiedchannels    TABLE     '  CREATE TABLE public.verifiedchannels (
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
 $   DROP TABLE public.verifiedchannels;
       public         heap    postgres    false            �            1259    25572    verifiedchannels_channel_id_seq    SEQUENCE     �   CREATE SEQUENCE public.verifiedchannels_channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.verifiedchannels_channel_id_seq;
       public          postgres    false    232                       0    0    verifiedchannels_channel_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.verifiedchannels_channel_id_seq OWNED BY public.verifiedchannels.channel_id;
          public          postgres    false    233            �           2604    25709    publication_formats format_id    DEFAULT     �   ALTER TABLE ONLY public.publication_formats ALTER COLUMN format_id SET DEFAULT nextval('public.publication_formats_format_id_seq'::regclass);
 L   ALTER TABLE public.publication_formats ALTER COLUMN format_id DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    25573    verifiedchannels channel_id    DEFAULT     �   ALTER TABLE ONLY public.verifiedchannels ALTER COLUMN channel_id SET DEFAULT nextval('public.verifiedchannels_channel_id_seq'::regclass);
 J   ALTER TABLE public.verifiedchannels ALTER COLUMN channel_id DROP DEFAULT;
       public          postgres    false    233    232            a          0    25515    cart 
   TABLE DATA           <   COPY public.cart (cart_id, user_id, created_at) FROM stdin;
    public          postgres    false    217   �       _          0    25509 	   cartitems 
   TABLE DATA           c   COPY public.cartitems (cart_item_id, cart_id, product_id, quantity, post_time, format) FROM stdin;
    public          postgres    false    215   @�       c          0    25520 
   categories 
   TABLE DATA           @   COPY public.categories (category_id, category_name) FROM stdin;
    public          postgres    false    219   ��       e          0    25524 
   orderitems 
   TABLE DATA           y   COPY public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format) FROM stdin;
    public          postgres    false    221   �       g          0    25530    orders 
   TABLE DATA           T   COPY public.orders (order_id, user_id, total_price, status, created_at) FROM stdin;
    public          postgres    false    223   ��       i          0    25537    productImages 
   TABLE DATA           J   COPY public."productImages" (image_id, product_id, image_url) FROM stdin;
    public          postgres    false    225   
�       u          0    25714    product_publication_formats 
   TABLE DATA           L   COPY public.product_publication_formats (product_id, format_id) FROM stdin;
    public          postgres    false    237   '�       k          0    25541    products 
   TABLE DATA           �   COPY public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) FROM stdin;
    public          postgres    false    227   Ɛ       w          0    25746    products_post_time 
   TABLE DATA           Q   COPY public.products_post_time (post_time_id, product_id, post_time) FROM stdin;
    public          postgres    false    239   �       t          0    25706    publication_formats 
   TABLE DATA           E   COPY public.publication_formats (format_id, format_name) FROM stdin;
    public          postgres    false    236   R�       r          0    25683    review 
   TABLE DATA           d   COPY public.review (review_id, buyer_id, "seller_id ", rating, review_text, created_at) FROM stdin;
    public          postgres    false    234   ��       m          0    25549    reviews 
   TABLE DATA           g   COPY public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) FROM stdin;
    public          postgres    false    229   �       o          0    25556    users 
   TABLE DATA           Q   COPY public.users (user_id, username, rating, created_at, user_uuid) FROM stdin;
    public          postgres    false    231   ܙ       p          0    25563    verifiedchannels 
   TABLE DATA           �   COPY public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) FROM stdin;
    public          postgres    false    232   9�       �           0    0    CartItems_cart_item_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public."CartItems_cart_item_id_seq"', 258, true);
          public          postgres    false    216            �           0    0    Cart_cart_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Cart_cart_id_seq"', 4, true);
          public          postgres    false    218            �           0    0    Categories_category_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."Categories_category_id_seq"', 60349, true);
          public          postgres    false    220            �           0    0    OrderItems_order_item_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."OrderItems_order_item_id_seq"', 277, true);
          public          postgres    false    222            �           0    0    Orders_order_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Orders_order_id_seq"', 182, true);
          public          postgres    false    224            �           0    0    ProductImages_image_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."ProductImages_image_id_seq"', 1, false);
          public          postgres    false    226            �           0    0    Products_product_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."Products_product_id_seq"', 83, true);
          public          postgres    false    228            �           0    0    Reviews_review_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."Reviews_review_id_seq"', 13, true);
          public          postgres    false    230            �           0    0 #   products_post_time_post_time_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.products_post_time_post_time_id_seq', 7, true);
          public          postgres    false    238            �           0    0 !   publication_formats_format_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.publication_formats_format_id_seq', 6, true);
          public          postgres    false    235            �           0    0    verifiedchannels_channel_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.verifiedchannels_channel_id_seq', 16, true);
          public          postgres    false    233            �           2606    25575    cartitems CartItems_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItems_pkey" PRIMARY KEY (cart_item_id);
 D   ALTER TABLE ONLY public.cartitems DROP CONSTRAINT "CartItems_pkey";
       public            postgres    false    215            �           2606    25577    cart Cart_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (cart_id);
 :   ALTER TABLE ONLY public.cart DROP CONSTRAINT "Cart_pkey";
       public            postgres    false    217            �           2606    25579    categories Categories_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (category_id);
 F   ALTER TABLE ONLY public.categories DROP CONSTRAINT "Categories_pkey";
       public            postgres    false    219            �           2606    25581    orderitems OrderItems_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY (order_item_id);
 F   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItems_pkey";
       public            postgres    false    221            �           2606    25583    orders Orders_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (order_id);
 >   ALTER TABLE ONLY public.orders DROP CONSTRAINT "Orders_pkey";
       public            postgres    false    223            �           2606    25585     productImages ProductImages_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImages_pkey" PRIMARY KEY (image_id);
 N   ALTER TABLE ONLY public."productImages" DROP CONSTRAINT "ProductImages_pkey";
       public            postgres    false    225            �           2606    25587    products Products_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (product_id);
 B   ALTER TABLE ONLY public.products DROP CONSTRAINT "Products_pkey";
       public            postgres    false    227            �           2606    25589    reviews Reviews_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY (review_id);
 @   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "Reviews_pkey";
       public            postgres    false    229            �           2606    25591    users Users_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT "Users_pkey";
       public            postgres    false    231            �           2606    25718 <   product_publication_formats product_publication_formats_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_pkey PRIMARY KEY (product_id, format_id);
 f   ALTER TABLE ONLY public.product_publication_formats DROP CONSTRAINT product_publication_formats_pkey;
       public            postgres    false    237    237            �           2606    25750 *   products_post_time products_post_time_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.products_post_time
    ADD CONSTRAINT products_post_time_pkey PRIMARY KEY (post_time_id);
 T   ALTER TABLE ONLY public.products_post_time DROP CONSTRAINT products_post_time_pkey;
       public            postgres    false    239            �           2606    25713 7   publication_formats publication_formats_format_name_key 
   CONSTRAINT     y   ALTER TABLE ONLY public.publication_formats
    ADD CONSTRAINT publication_formats_format_name_key UNIQUE (format_name);
 a   ALTER TABLE ONLY public.publication_formats DROP CONSTRAINT publication_formats_format_name_key;
       public            postgres    false    236            �           2606    25711 ,   publication_formats publication_formats_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.publication_formats
    ADD CONSTRAINT publication_formats_pkey PRIMARY KEY (format_id);
 V   ALTER TABLE ONLY public.publication_formats DROP CONSTRAINT publication_formats_pkey;
       public            postgres    false    236            �           2606    25688    review review_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);
 <   ALTER TABLE ONLY public.review DROP CONSTRAINT review_pkey;
       public            postgres    false    234            �           2606    25593    verifiedchannels tg_id 
   CONSTRAINT     Z   ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT tg_id UNIQUE (channel_tg_id);
 @   ALTER TABLE ONLY public.verifiedchannels DROP CONSTRAINT tg_id;
       public            postgres    false    232            �           2606    25595 &   verifiedchannels verifiedchannels_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_pkey PRIMARY KEY (channel_id);
 P   ALTER TABLE ONLY public.verifiedchannels DROP CONSTRAINT verifiedchannels_pkey;
       public            postgres    false    232            �           2606    25596    cartitems CartItem_Cart_FK    FK CONSTRAINT        ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Cart_FK" FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id);
 F   ALTER TABLE ONLY public.cartitems DROP CONSTRAINT "CartItem_Cart_FK";
       public          postgres    false    215    4771    217            �           2606    25601    cartitems CartItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 I   ALTER TABLE ONLY public.cartitems DROP CONSTRAINT "CartItem_Product_FK";
       public          postgres    false    4781    215    227            �           2606    25606    cart Cart_User_FK    FK CONSTRAINT     w   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 =   ALTER TABLE ONLY public.cart DROP CONSTRAINT "Cart_User_FK";
       public          postgres    false    4785    217    231            �           2606    25611    orderitems OrderItem_Order_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Order_FK" FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 I   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Order_FK";
       public          postgres    false    4777    221    223            �           2606    25616    orderitems OrderItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Product_FK";
       public          postgres    false    227    221    4781            �           2606    25621    orders Order_User_FK    FK CONSTRAINT     z   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Order_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 @   ALTER TABLE ONLY public.orders DROP CONSTRAINT "Order_User_FK";
       public          postgres    false    223    231    4785            �           2606    25729    orderitems OrederIrem_Format_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrederIrem_Format_FK" FOREIGN KEY (format) REFERENCES public.publication_formats(format_id) NOT VALID;
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrederIrem_Format_FK";
       public          postgres    false    236    4795    221            �           2606    25626 %   productImages ProductImage_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImage_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 S   ALTER TABLE ONLY public."productImages" DROP CONSTRAINT "ProductImage_Product_FK";
       public          postgres    false    4781    225    227            �           2606    25631    products Product_Category_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Category_FK" FOREIGN KEY (category_id) REFERENCES public.categories(category_id);
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Category_FK";
       public          postgres    false    219    227    4773            �           2606    25636    products Product_Channels_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Channels_FK" FOREIGN KEY (channel_id) REFERENCES public.verifiedchannels(channel_id) NOT VALID;
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Channels_FK";
       public          postgres    false    232    227    4789            �           2606    25641    products Product_User_FK    FK CONSTRAINT     ~   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 D   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_User_FK";
       public          postgres    false    231    4785    227            �           2606    25689    reviews order_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT order_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT order_id_fk;
       public          postgres    false    229    4777    223            �           2606    25751     products_post_time product_id_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products_post_time
    ADD CONSTRAINT "product_id_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 L   ALTER TABLE ONLY public.products_post_time DROP CONSTRAINT "product_id_FK";
       public          postgres    false    227    4781    239            �           2606    25724 F   product_publication_formats product_publication_formats_format_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.publication_formats(format_id) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public.product_publication_formats DROP CONSTRAINT product_publication_formats_format_id_fkey;
       public          postgres    false    237    236    4795            �           2606    25719 G   product_publication_formats product_publication_formats_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 q   ALTER TABLE ONLY public.product_publication_formats DROP CONSTRAINT product_publication_formats_product_id_fkey;
       public          postgres    false    237    4781    227            �           2606    25646 .   verifiedchannels verifiedchannels_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 X   ALTER TABLE ONLY public.verifiedchannels DROP CONSTRAINT verifiedchannels_user_id_fkey;
       public          postgres    false    231    232    4785            a   G   x�=ʱ�0��L��d0�Y�����sN�C�O�D>B{v�Uڧh>��2Y���o�g#d�2���h      _   \   x�m���0�3L�R�4I����rK��?a�]L���gC���'#�R��B8���7@�#@�ҁ��P?�O� ������T���"U      c   5   x�3�ɯ�2�tO�M�23061��K-/3�9�2��~�%�E�\1z\\\ m�$      e   �  x����u++��q����B�"v��:ί��2�W^b}��	0EUCN�B���Ͽ�j]�Z�-d���(�Z�?E-D/D)�����B$��BTB+�54]�Zhm��c���).�f�l�5�˸p�3d+�khC�*B{=ׂe��<��2�^��X{q���0�Z��;��5��聜*������}�c)��w�[�#�:O�����"�Ç ��N%�:T����7��4XU����*b�@�L�S��ѩ z�K�@��I���GԾ�e�f��Ah�H;��h\J�X��oA�|��Rd^,��ya_}�X���ˊ� �"�7e�_��N�\�fI;M{	j�x���<4Xqe��B�G��P�˥J(��RK(e.р*09A�����2o��:o�:� ���-C���C#[�f�e�{ޝ�V�S�K��h�Q
5׳褘�"��cp9����w��������l���a��n[�9PFOeX:+e����w\��3��V��?�Stx���F��֮���N�}�����}��6fX���SE6���y%{��Հ�i4���:��>d���_Y��4�+}>��ؗ8�.��y���5�X�������ɷȅ��Y�uAI�*�ʨ=oGgG�-�ܰ�,A���1�WP��"c'nꃒ�2������]8���JEh��dx�K;ō���"�g���a��&�1�r�x��#���^,���\_\���UƵms?�Q���- uJ~k��%�䳾J�6���f��+	�m-�6�9H�ij���}+�`׼�2X?L���ll��9(8z�e����G�ֺ�]���`�W�vV���}Wu+��\�)��h����0ſ�F�;�e�Z����w�KJ�h�V��s��\��{M=���=\n�ь��"�ܖ�0�{�k�-��Sُ����wԧ����v�r�ׯ�R�܏��]p*�7%0N_�Sk���ޗ�e������/���.Ͱ!��8.Wv�X��Xp�ڜ����eM?^���UB��y��^ N���{c�o���bÅF���m_�����I�l�I[���/6�$bwM�k�(��+���ݗ�٩)�f���w��ݜ�O������T�S5�qÑ�Wt>ڥ�F��vga�qyw���(e��X���V�q���
my�OZv��%\�)Ml%5�F"KZmr\j��K���L��]���^�m��\d������דQ8��׌��=M��kt9/�]G���(��03�v�:�)F�p"�#RH�*�}N�0��_a�R_H�b;����2%���E`�Ke�i8
?a� ����\��`���C�a�~K�`P8���eF;��q�̉�7>�|��W����o��;��y��7�t�G&�G�G�P�o�}y��t��&�m~����}}鵀�������?xx<      g   C  x��YKn$�]�N�L"㛑uo2aȰd�@�V[_FK0`���F~Q�w��Z9JpA�:"���E��)*�R���p�����o>���+�؞k�d+��J��J����o?}���ށ�W�"^́�{���+ki��d1��o~������^��t���Z_-
���t}��ڹ5�����w?��e�a<s]�\�7_L�yd6�[a�m�xܻ}m���x�(Qٽ/���5�fy�ZW�R�;�����72�f����-�'IB���(7��X����������������矞��_�����>���W��|;[�������gY+�$��F�Z�C����i��F�o�A�te*�k,|_�a��X�83FV��N�����v4��G^����L+�U�4�fK�������\XB�}�k~���&�ߍ~ڹ?jG�U�Ԫ.��=O�9M�3RY7����t�{k�sj��E2)h� ����y��đh#Y��BI]�7:mM��*s�����Rj��C����6�lW���,��8�f�҂�a/f�eǁ!p���9N2,lk��\mmC8��y\$��V�kG���l�c�p�BN5A�"*��i8�2d���fGG�d#P�lF���#\v�g�:{%_�уKBE[oM��sݸ�@6$N����W�ūVo���)k��B�T�;���=Lp����l>�g�B@��O!�`�)G7�OZ��4哎ּ]��І�O�w���!�듸ݞi��s\ei��8��L q	s�Ňy<a��	�F�:Y�{�	j��S(�v����.��ZX�,ϴ&�f
c}r�m�%mhhB0﫥ϫ��恔.`)^�$���K��+O���Z�i�S���Y!��r
/�c����
V�@�cB/�і�ҏ~�B��Ԝ�j�I9�� F�w��l�ߩ˶��gqx�t��e(�>�U�l.���R�O�	�,��g:���L��.5o�nN��a�ؕz�G{C{�8Gp���9�ŋqoҀ���+����I&�ܤ�ɸ��q�
A����2�SU��ќhs�y���fw�
,�o� ���bѰ�m��EƏ�Ғ	�N�Aq���A���Z��*1��$8|Y��.�:���fv�,�TPO
���͡��sm޶��ZCo��3d�Q_n^���V�;3���s�aە�i9i�S$HZ�+V�Br!-��)��W����I�����_�@X�+S���T��<�F}�M��Ӣ�Qv�.L�o�ߗ/�A�&B�Tf���i�'�E
8��m�R����4��8����s|:�1.X�z�wU{�'"/h��$X����n����|Z��4�*=ep�����X�ܤ%h�Ϝ�0h-g�ѧqPR�'(j���u�u�0��+p�*���Q��{G-�,�;�CxC���=>K^{�+�W,��������97�<] V*ݤf��k��9�+�'�8���`CbV�!xxy���m�`�3F�K�]�gߖ~�J�$h�;��j�(>YXl��m�G�� -����[%qyN����h���@��퉶�tux*���4�f�H����G'w�(����G�tώd�����eK�u\e#C��g�����9�,G 6[ԫ�����dw�A�6��X��=��j����W��f��$.�S����=�9RS��2Q?;9A�6p^΂�MDr����71���%;�O�\�ѶJ鶍��<
v�E�m�r��J�
���d��Z.�-���;s�}S� ��A�Yh�h�3%{��BbLs�>��z8ub{���]-P��~�)6�Qs���CY��Z�      i      x������ � �      u   �   x�%���0ߡ�S �^��>#��*�/��W�mR!�4�D]�B�mq[�m��z��j�gR�l;�T�`�/(;N�|�AJ+A)��6ЎV�v��@hw��&H�vz&�����5?G �AӠ)����G�.�      k   ,  x��Y�n�D�v�b��k��^�vQ�ڤj#!���o�-aw�ݪ�]��7��A�J)�`�B�����܅t�lc������j�Yʔd��LS!ev�ލ��饣���w���"��M�6�!�B��V�d��Z�2�1^P
?�P���L�LdWz���l�G���q/�/@�r�&m�P^�Ι]��M�	���b��,�5������M���Ѵ?4t	�,��)7֞�м.!S�9c�YsB�ڄ��k�����F����+2��19�O���LH�Ⳅ5����\|,�S��+!�p+$����y(�(xV?�U��G����?��3��IX+��)M�%7�\��*R�:kH�l���/<��U_�T�޻�}#��=(��`23�R�#L�R�B	!Eē��(v�No2��m�2����R]�l�\���D��<��I����DH˙���\�l�j�hEb�#Xp1"��]'en��JG$)��)�n�!j6<�;�o���a���dέU4�KQħ��n�>l�Z�Q���7�Q�p�����a�y�؀�������0ͣ<ق".���I���a�0�i��6W�"���+s~���͵�T��,A��K|���6SN�, �+���amnAc�	�A�הH?��;�ڎG�)�Z�f�KG��`�8�A_ 	��}��J�RE���p�c���a�ܽXfܯ�������
�!��''�}0���{e9+�"v��G4��e�-�TL�3FDX�P�Դo�3RUC��Г�'$H��R	�YĞ��]�c���Ar7�SPNLY�"2M��3'e9)����T5�)��ȵe&�Z�诨�^8e�P/�d4��i��<(	���΋V:�1F�/ƁE�:��tud\ļ �EI(��r�*��KC^�������;�����h�UŨ�g��ҽڟMe0��r)���"��ж�,D��>�.��E�_`ӲD�&���A��Һ�)Eq���'�7�$�d�X"HP,�Fs*S��S�^� �2Qo6���*Y�<�X=r���^Xe�$�/���8��(��{p�k�\�������"�e"�P��_�G�Y�;�A�\J��&괩�c�ly#���͜ ��fYҶ���A����yd�NfW��E��,^��D$�(vr��I�tm����f��s����?�UO�����zQ?���i�N�8��g�}�딼<��0�o�� ��~�w�/�92���t�:�:�v�(�]2���g{��~	�7����xX�ٟN��[d�|�}ukqmwt������wgN�����Z��. ��;��J�f��ýC�������ŭ��s��y���Q��E��C�&0�O���H��u�7/wn��?&31�;�.��kW�_�c���<������o`��/����[0��y�.��'�͕����kN�^,�P=�N�p��&��l�'���˙O�<x��7y�i��:���;ȴHbQB��rC3i(�`�F[��!L�#�=��N�P��t�$��V1�u]��E�
�n�s�#hG��7is�,Ђ���,�V����];����*��#�j*]�d�M�E���6U.'æcQ0���JmT�V!O�F�r��۶2+��	��g�����= �Iq����fe�8�eZ1r0�3�2�(��&���7�A&�A&�{/�4R�`�_2;3E1'.Yq��-��6�Y�[hC4��]3|���oF��R)[(CijqN��օ1J�00*�Z8Cs��5����ag)NA�s� DDJ��,���%�<�����,j��_��E�#E[7�����      w   @   x�3�47�44�20 "mc.#��B�$`d�0�0B�b
0A�qZ��0 ������ !��      t   A   x�3�4�72�2�4�7��2�4�77�2���KIM���,I�2�J-�/.�22���S�b���� ��y      r   /   x�3�00451400Dbs�� ���������������	W� �	�      m   �   x����M�@��P����3O�'�D\V�NtE)�D6��r����LA�d�R�;j��0L���8>�%&�ŉjmFM54:ޏ�t��x�ш3�HY�l�w��i�~Pk��+��Ͷv�o5���P��4Wu/k�r��<qf�/�}����D�i	�E�a�(G(/t�F��d���R٥�,��u��K�7�R\��a����տ�˰Yo�<7 ���/����V      o   M  x���;N�@�z}�\������ۧE�B�Ɖ	AGA�'p�H�`�
�1kJ*[���j?ϿP��uQ
)�T�J�J7 �����C.&	�L#�^�ִ>�`� :s:��`��@��)֞�1jVTі�*��N�o�sk����c�mG:u���c�4u���Y1�8����nT񻉲S�q1"w�n#���_ظ�}�R��q?���'}�;�_����(5P2H��<����e��/����jy���3y@~ ���\G�%)9�{sχ�!�e���Y@�1�:h���,S=��M1K�.���[,f�N&Y�$?����      p   L  x����J1��٧ػl:3�;�Iśڃ�B)t��ږv/>���Q*�+�Lw��-6!��}0��� (F#1���.�|.w/��f�4�OW�r)��	H��9QP�K�d���O� b|/1]�ȏ客��>���Q�w�}!R�&�h4-��z���l�h��\��I��$�F�#�l�E"$�Z�ZŶTn���lr}"��ګAZ*�{-:aS�qP�)m����;��p^���k��͠���@�5�R����1y�Ƿ���G#�y�kA���eiV�r'3q��H��X*g���؛j_�W���q��!�e�ɋ��^�XfY�O���     