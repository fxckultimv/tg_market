PGDMP                      |            TeleAdMarket    16.3    16.3 W    p           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            r           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            s           1262    25208    TeleAdMarket    DATABASE     �   CREATE DATABASE "TeleAdMarket" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
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
       public         heap    postgres    false            �            1259    25706    publication_formats    TABLE     |   CREATE TABLE public.publication_formats (
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
       public          postgres    false    236            t           0    0 !   publication_formats_format_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.publication_formats_format_id_seq OWNED BY public.publication_formats.format_id;
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
       public          postgres    false    232            u           0    0    verifiedchannels_channel_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.verifiedchannels_channel_id_seq OWNED BY public.verifiedchannels.channel_id;
          public          postgres    false    233            �           2604    25709    publication_formats format_id    DEFAULT     �   ALTER TABLE ONLY public.publication_formats ALTER COLUMN format_id SET DEFAULT nextval('public.publication_formats_format_id_seq'::regclass);
 L   ALTER TABLE public.publication_formats ALTER COLUMN format_id DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    25573    verifiedchannels channel_id    DEFAULT     �   ALTER TABLE ONLY public.verifiedchannels ALTER COLUMN channel_id SET DEFAULT nextval('public.verifiedchannels_channel_id_seq'::regclass);
 J   ALTER TABLE public.verifiedchannels ALTER COLUMN channel_id DROP DEFAULT;
       public          postgres    false    233    232            Y          0    25515    cart 
   TABLE DATA           <   COPY public.cart (cart_id, user_id, created_at) FROM stdin;
    public          postgres    false    217   'z       W          0    25509 	   cartitems 
   TABLE DATA           c   COPY public.cartitems (cart_item_id, cart_id, product_id, quantity, post_time, format) FROM stdin;
    public          postgres    false    215   ~z       [          0    25520 
   categories 
   TABLE DATA           @   COPY public.categories (category_id, category_name) FROM stdin;
    public          postgres    false    219   �z       ]          0    25524 
   orderitems 
   TABLE DATA           y   COPY public.orderitems (order_item_id, order_id, product_id, quantity, price, message_id, post_time, format) FROM stdin;
    public          postgres    false    221   {       _          0    25530    orders 
   TABLE DATA           T   COPY public.orders (order_id, user_id, total_price, status, created_at) FROM stdin;
    public          postgres    false    223   ��       a          0    25537    productImages 
   TABLE DATA           J   COPY public."productImages" (image_id, product_id, image_url) FROM stdin;
    public          postgres    false    225   ��       m          0    25714    product_publication_formats 
   TABLE DATA           L   COPY public.product_publication_formats (product_id, format_id) FROM stdin;
    public          postgres    false    237   Ň       c          0    25541    products 
   TABLE DATA           �   COPY public.products (product_id, user_id, category_id, title, description, price, created_at, status, updated_at, channel_id, post_time) FROM stdin;
    public          postgres    false    227   �       l          0    25706    publication_formats 
   TABLE DATA           E   COPY public.publication_formats (format_id, format_name) FROM stdin;
    public          postgres    false    236   ��       j          0    25683    review 
   TABLE DATA           d   COPY public.review (review_id, buyer_id, "seller_id ", rating, review_text, created_at) FROM stdin;
    public          postgres    false    234   Ҍ       e          0    25549    reviews 
   TABLE DATA           g   COPY public.reviews (review_id, seller_id, user_id, rating, comment, created_at, order_id) FROM stdin;
    public          postgres    false    229   �       g          0    25556    users 
   TABLE DATA           Q   COPY public.users (user_id, username, rating, created_at, user_uuid) FROM stdin;
    public          postgres    false    231   �       h          0    25563    verifiedchannels 
   TABLE DATA           �   COPY public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id, views) FROM stdin;
    public          postgres    false    232   h�       v           0    0    CartItems_cart_item_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public."CartItems_cart_item_id_seq"', 232, true);
          public          postgres    false    216            w           0    0    Cart_cart_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Cart_cart_id_seq"', 4, true);
          public          postgres    false    218            x           0    0    Categories_category_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."Categories_category_id_seq"', 60349, true);
          public          postgres    false    220            y           0    0    OrderItems_order_item_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."OrderItems_order_item_id_seq"', 263, true);
          public          postgres    false    222            z           0    0    Orders_order_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Orders_order_id_seq"', 177, true);
          public          postgres    false    224            {           0    0    ProductImages_image_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."ProductImages_image_id_seq"', 1, false);
          public          postgres    false    226            |           0    0    Products_product_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."Products_product_id_seq"', 68, true);
          public          postgres    false    228            }           0    0    Reviews_review_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."Reviews_review_id_seq"', 13, true);
          public          postgres    false    230            ~           0    0 !   publication_formats_format_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.publication_formats_format_id_seq', 6, true);
          public          postgres    false    235                       0    0    verifiedchannels_channel_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.verifiedchannels_channel_id_seq', 16, true);
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
       public            postgres    false    237    237            �           2606    25713 7   publication_formats publication_formats_format_name_key 
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
       public          postgres    false    4766    215    217            �           2606    25601    cartitems CartItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 I   ALTER TABLE ONLY public.cartitems DROP CONSTRAINT "CartItem_Product_FK";
       public          postgres    false    4776    215    227            �           2606    25606    cart Cart_User_FK    FK CONSTRAINT     w   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 =   ALTER TABLE ONLY public.cart DROP CONSTRAINT "Cart_User_FK";
       public          postgres    false    4780    217    231            �           2606    25611    orderitems OrderItem_Order_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Order_FK" FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 I   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Order_FK";
       public          postgres    false    4772    221    223            �           2606    25616    orderitems OrderItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Product_FK";
       public          postgres    false    227    221    4776            �           2606    25621    orders Order_User_FK    FK CONSTRAINT     z   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Order_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 @   ALTER TABLE ONLY public.orders DROP CONSTRAINT "Order_User_FK";
       public          postgres    false    231    223    4780            �           2606    25729    orderitems OrederIrem_Format_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrederIrem_Format_FK" FOREIGN KEY (format) REFERENCES public.publication_formats(format_id) NOT VALID;
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrederIrem_Format_FK";
       public          postgres    false    4790    236    221            �           2606    25626 %   productImages ProductImage_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImage_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 S   ALTER TABLE ONLY public."productImages" DROP CONSTRAINT "ProductImage_Product_FK";
       public          postgres    false    225    227    4776            �           2606    25631    products Product_Category_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Category_FK" FOREIGN KEY (category_id) REFERENCES public.categories(category_id);
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Category_FK";
       public          postgres    false    227    219    4768            �           2606    25636    products Product_Channels_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Channels_FK" FOREIGN KEY (channel_id) REFERENCES public.verifiedchannels(channel_id) NOT VALID;
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Channels_FK";
       public          postgres    false    4784    232    227            �           2606    25641    products Product_User_FK    FK CONSTRAINT     ~   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 D   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_User_FK";
       public          postgres    false    227    231    4780            �           2606    25689    reviews order_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT order_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT order_id_fk;
       public          postgres    false    229    223    4772            �           2606    25724 F   product_publication_formats product_publication_formats_format_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.publication_formats(format_id) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public.product_publication_formats DROP CONSTRAINT product_publication_formats_format_id_fkey;
       public          postgres    false    4790    237    236            �           2606    25719 G   product_publication_formats product_publication_formats_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_publication_formats
    ADD CONSTRAINT product_publication_formats_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 q   ALTER TABLE ONLY public.product_publication_formats DROP CONSTRAINT product_publication_formats_product_id_fkey;
       public          postgres    false    227    237    4776            �           2606    25646 .   verifiedchannels verifiedchannels_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 X   ALTER TABLE ONLY public.verifiedchannels DROP CONSTRAINT verifiedchannels_user_id_fkey;
       public          postgres    false    231    232    4780            Y   G   x�=ʱ�0��L��d0�Y�����sN�C�O�D>B{v�Uڧh>��2Y���o�g#d�2���h      W   L   x�324�4�45FF&��F
�FV@���edhNP�A��T`Sa���C�9�F�0&��=... D0      [   5   x�3�ɯ�2�tO�M�23061��K-/3�9�2��~�%�E�\1z\\\ m�$      ]   \  x���ݙ�*���*��9��l�u�Ov��L�gn6z-�	X������Ͽ/�5Ժ�P[��QD1�8�(4Z�84^�Rhi!ʡ�HB����V�kh����\!�@q�3CS\8���kƏq�6g�V~�І�U��z��\/y
�e��	"����0�Z��7��5~X�*������{�k)��w�[�#�:O�����"�Ç ��N%�:T����7��4XU����*b�@�L�S��ѩ z�K�@��I���W�~�e�fިAh�H;��h\J�X��_A�|��Rd^,��ya_}�X���ˊ� �"�7e�_��N�\�fI;M{	j�x�_��<4Xqe��B�G��P�˥J(��RK(e.р*09A�����2o��:o�:� ���-C���C#[�f�e�{ޝ�V�S�K��h�Q
5׻褘�"��1����c����'Ɵ��u�sux6p�o۰x|��:F��S��J��~�����L����k?��C{�O[�ۈ���|�p��7�0��k�Ǭmc�E�u���S;�d����07��ǧ�#=h�!����Ȳ���I]���ƾđu!��C��w�Ī���`e_x�H~D.��J�JBWy�PF��y;:;Zn��%�`	����x^Ay[����e�J���3v�[ܯ�v�4ã+�}���.�7��+��1�v��K��p�<���Ï��S{�,�r}qa6o`W-׶���Ga�o`��0�)����f�x���*a�� [8X�;؛Q7�[4�$Զ���D� ���q�����]�V�`�0ݚvpr�e�-2��l��5��3�z��[�v�ֶ�}_�;�9X�{ľ{�]խ�js���{��ւ���^��`��j�7��[��.)͢�Z�>΍wpr]��5�t��p��G3��� s[��4�q�]��[7Le?���?Q���^��e��q^��_H�r?�vv���ߔ�8}��N=��n`��z_b�a'�s��C����4Æ`��?�\�E`9n`���9y����>�~�6�7h�	���@.�>��=\�Ƹ��-Wņ�8�U�۾z������ي���`9v�_l6I��l�lPr�Wv;q�/��SS��
pMG�fY�99��A�g�\o�n�j��#���|�K��j�M�������X��Q�vc�V��g8�R�Z���$�@����7K��S��JjԍD�����e��繁t[�2(����*y��<M'=ͣ�'�p���'E{���-��r^|�$���_Qv}a�g��@u�7�N1"���B:Wq�s�,���ؖ�B�y���(َn/� #^*L�Q�	`���2՜ �L�z8s��G�	�������?�      _     x��YK���7W��ŭ]�%�nbE�z��x$[h�(�Ȗ��H>1&4P:]u�s�T��);�R�{��˟^�����w�w=߱=���f2'�����?|����@�3Q��@�-�4fʙ�Eg1��o@䋇��p����Ǘ�n���ٲ���i�L���o��/?~������}�s�>����l�Gc��<o�>7��l<s���>&�[���x��y�9�uR��od��*��o�>H2TF9���d����������������_?��������_>����w��hV��نN6��~d�e�4�����a�d]2��}��W�������������Lӂ���2F�$�Z���x<��g�u��8��1�����_|/�]f�ƒ���[\�	�S�n�㦝ǣvd��Z�����#|���ˇ�7uAUL��Y�A�y�[v�crj���=t�[ߡ��5�J%7	���x��h�LJ�C!���P��5{�-cfi}�
��8� ���V�{"3�_ơ���HN���Rb+���
�����8���ͽ7s1��m�j�q�ʻ�<������� ������A5���H{��pXe�:��A̎������@����yd�{9�a�@�N>���⮧�N��H��)�n�C|�i��ƞXO�iM�RCk_���ؐĩ�p�s6+J5@4�^~!	�y��1�^E��[�A#�!���uh�Dr	��)��%?�J-?�dX",�]�E�]"A�~�Ѿ��"5P��R5���1���՞i�:jW����N�'�@��d�o:��ԇ���TC�b7��'�����)�J��`B7$d�3�:bgm'��X��L�����'q=�b'�ä�x׸('Vs�PMB��ma��r|�@�P6O�"���{H�����)쏩���fr�%f(�jċ�Z	Q��&����`-��)h���h!0F�2�ܗܩ=Z�gG㏽��Z�C�b٣~Q~C2��-��j�ߩ���Q�J�brl��|��a��R>`ӄ�a�D8�$y�������L�]-W����#�$?����1�hB�������|�Q��A��
� ;zߨ�B
.�A� �Nq|yҒrŔ�x����'|fS+�o�ڪ���bW�4z����>=3� K>��@<�0��Qr>����(�G��ϵ��9�nX%R�=��z����iK.�Ap�V��6Lz"�����*�j�e��>��8{C̈́�v� �Qe�r���E�;X��b���䥨T4! �/C��m�b�%'8���{�Ӗ�q3TKb����b9��('7�"���nA+�w;��^�I�lu�fЃf8�1�� ��
z��(�Y,e�+�xJl�d��^(d4�Vr����3�������r��es#��F>cĺ��'�*mvT��e�+������Xy��.߹Mx(�nU7��-/�r�i�:Q����}�=��>vC����C$xFЏHh��l��t����R]��Hk�����D�p��� ����ۻ�rԊ3�h#\j�����q���LE�蚟^r�.�� �'0��6kƔ��M�XahGPT@�b��͢	���c\��z�z2E�m�E:�70�8WCm���;[���E=��0�:, 5j����_ln&˞xB8,JDGEqs�@���̖��`���Q�okӯ�h��	DM��>q��~�A���JX�)6w�Ǹ�yR�	M�Y���ɖ�X�h��>ƕ�E3����Цi�/���      a      x������ � �      m   C   x�%˻�@��\���\1�_;���G��蕤�N�&LX�`A����khhx��<��z.I/���      c   Y  x����n�F���S0u����?�����$.\p0BZ����(����!�5y� ��{
�2K�qg��&,�5���
��@8��?=�tO�����ۥh��Z�Bs��5�
U�u���kć��I`��|���;m������Z/��V�P{=�Zz�ZI��	��*�t�JZ�މ1�h��Դ�����z�=��gj�B�E@�V ��p1�K���@ON����\ �����?TݪiW�|ѯ�ճ�ƞx��A#2�B�� �Y:��I	T��P�D��x	��b�����g�y���"�A7���0t2*��4^�A�.r$�̰�� !��|��xټ��j����r#�O����;�5�
\��6Vj�����2P�۶_�x�G@gf�kj��E�(��I1gb��v�?B��IqR��!���	)��§s:t3��ꌑ��.��R�O�l�h(��S�Z6�Pэy��P#U���U9��2�-���f�U'5�R���7=���&�⊀���r���/)%��ìONH�O$d���UJk���&�ϊkB�2!L�sGG�tJU:Hg��������ؐ!z<�V`jj���k7��Ҝ`�6�րQ�e�%���Ed�Ҏ�aK)[	l�5�����n)Z��0e��i/pZJT&�9�/;^|�������4�K#,���-�1)�țS?v+2��]��ƨ�C���H�>*(|ɤ`s �p����a�}ټV�?�_*��8�15$j����ꀐ�K)��s�~F���hi��	�X�`N�c0���q�qZL���e�t|��B
c�cv���v����:z�^���GF�jZ�tL�u0Qs)�a<�?G��{z	�9��P�XCc�+������j��M��~0��hw(�~��#Y�M��Tg�j�����a2��zyTRW1�O�0K)������o�Ӧa<��U�Ќq&ČTJy�N�'��S:O��4X��*S�2i�����4�y�'6Oِ�L<ύ��<�9��u�<��U��y*"NR�J����,�+��ˠ�n®L���],����	�ZL��X�3)���\*�c��$'����@��e�d�;!e�����?Fۂ�      l   A   x�3�4�72�2�4�7��2�4�77�2���KIM���,I�2�J-�/.�22���S�b���� ��y      j   /   x�3�00451400Dbs�� ���������������	W� �	�      e   �   x����M�@��P����3O�'�D\V�NtE)�D6��r����LA�d�R�;j��0L���8>�%&�ŉjmFM54:ޏ�t��x�ш3�HY�l�w��i�~Pk��+��Ͷv�o5���P��4Wu/k�r��<qf�/�}����D�i	�E�a�(G(/t�F��d���R٥�,��u��K�7�R\��a����տ�˰Yo�<7 ���/����V      g   M  x���;N�@�z}�\������ۧE�B�Ɖ	AGA�'p�H�`�
�1kJ*[���j?ϿP��uQ
)�T�J�J7 �����C.&	�L#�^�ִ>�`� :s:��`��@��)֞�1jVTі�*��N�o�sk����c�mG:u���c�4u���Y1�8����nT񻉲S�q1"w�n#���_ظ�}�R��q?���'}�;�_����(5P2H��<����e��/����jy���3y@~ ���\G�%)9�{sχ�!�e���Y@�1�:h���,S=��M1K�.���[,f�N&Y�$?����      h   L  x����J1��٧ػl:3�;�Iśڃ�B)t��ږv/>���Q*�+�Lw��-6!��}0��� (F#1���.�|.w/��f�4�OW�r)��	H��9QP�K�d���O� b|/1]�ȏ客��>���Q�w�}!R�&�h4-��z���l�h��\��I��$�F�#�l�E"$�Z�ZŶTn���lr}"��ګAZ*�{-:aS�qP�)m����;��p^���k��͠���@�5�R����1y�Ƿ���G#�y�kA���eiV�r'3q��H��X*g���؛j_�W���q��!�e�ɋ��^�XfY�O���     