PGDMP                       |            TeleAdMarket    16.3    16.3 E    P           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            R           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            S           1262    25208    TeleAdMarket    DATABASE     �   CREATE DATABASE "TeleAdMarket" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
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
    post_time jsonb
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
    post_time jsonb,
    message_id bigint
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
    category_id bigint,
    title character varying(255),
    description text,
    price numeric NOT NULL,
    post_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    status character varying,
    updated_at timestamp without time zone DEFAULT now(),
    channel_id bigint
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
    seller_id bigint,
    user_id bigint,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT now()
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
            public          postgres    false    229            �            1259    25556    users    TABLE     �   CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying,
    rating numeric DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    25563    verifiedchannels    TABLE       CREATE TABLE public.verifiedchannels (
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
    channel_tg_id bigint NOT NULL
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
       public          postgres    false    232            T           0    0    verifiedchannels_channel_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.verifiedchannels_channel_id_seq OWNED BY public.verifiedchannels.channel_id;
          public          postgres    false    233            �           2604    25573    verifiedchannels channel_id    DEFAULT     �   ALTER TABLE ONLY public.verifiedchannels ALTER COLUMN channel_id SET DEFAULT nextval('public.verifiedchannels_channel_id_seq'::regclass);
 J   ALTER TABLE public.verifiedchannels ALTER COLUMN channel_id DROP DEFAULT;
       public          postgres    false    233    232            =          0    25515    cart 
   TABLE DATA           <   COPY public.cart (cart_id, user_id, created_at) FROM stdin;
    public          postgres    false    217   1`       ;          0    25509 	   cartitems 
   TABLE DATA           [   COPY public.cartitems (cart_item_id, cart_id, product_id, quantity, post_time) FROM stdin;
    public          postgres    false    215   �`       ?          0    25520 
   categories 
   TABLE DATA           @   COPY public.categories (category_id, category_name) FROM stdin;
    public          postgres    false    219   �`       A          0    25524 
   orderitems 
   TABLE DATA           q   COPY public.orderitems (order_item_id, order_id, product_id, quantity, price, post_time, message_id) FROM stdin;
    public          postgres    false    221   'a       C          0    25530    orders 
   TABLE DATA           T   COPY public.orders (order_id, user_id, total_price, status, created_at) FROM stdin;
    public          postgres    false    223   �c       E          0    25537    productImages 
   TABLE DATA           J   COPY public."productImages" (image_id, product_id, image_url) FROM stdin;
    public          postgres    false    225   h       G          0    25541    products 
   TABLE DATA           �   COPY public.products (product_id, user_id, category_id, title, description, price, post_time, created_at, status, updated_at, channel_id) FROM stdin;
    public          postgres    false    227   3h       I          0    25549    reviews 
   TABLE DATA           ]   COPY public.reviews (review_id, seller_id, user_id, rating, comment, created_at) FROM stdin;
    public          postgres    false    229   �j       K          0    25556    users 
   TABLE DATA           F   COPY public.users (user_id, username, rating, created_at) FROM stdin;
    public          postgres    false    231   �j       L          0    25563    verifiedchannels 
   TABLE DATA           �   COPY public.verifiedchannels (channel_id, user_id, channel_name, channel_url, is_verified, is_active, created_at, updated_at, subscribers_count, channel_title, channel_tg_id) FROM stdin;
    public          postgres    false    232   �k       U           0    0    CartItems_cart_item_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public."CartItems_cart_item_id_seq"', 105, true);
          public          postgres    false    216            V           0    0    Cart_cart_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Cart_cart_id_seq"', 4, true);
          public          postgres    false    218            W           0    0    Categories_category_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."Categories_category_id_seq"', 60348, true);
          public          postgres    false    220            X           0    0    OrderItems_order_item_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."OrderItems_order_item_id_seq"', 133, true);
          public          postgres    false    222            Y           0    0    Orders_order_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Orders_order_id_seq"', 112, true);
          public          postgres    false    224            Z           0    0    ProductImages_image_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public."ProductImages_image_id_seq"', 1, false);
          public          postgres    false    226            [           0    0    Products_product_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public."Products_product_id_seq"', 49, true);
          public          postgres    false    228            \           0    0    Reviews_review_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."Reviews_review_id_seq"', 1, false);
          public          postgres    false    230            ]           0    0    verifiedchannels_channel_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.verifiedchannels_channel_id_seq', 11, true);
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
       public            postgres    false    231            �           2606    25593    verifiedchannels tg_id 
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
       public          postgres    false    4750    215    217            �           2606    25601    cartitems CartItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.cartitems
    ADD CONSTRAINT "CartItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 I   ALTER TABLE ONLY public.cartitems DROP CONSTRAINT "CartItem_Product_FK";
       public          postgres    false    227    215    4760            �           2606    25606    cart Cart_User_FK    FK CONSTRAINT     w   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "Cart_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 =   ALTER TABLE ONLY public.cart DROP CONSTRAINT "Cart_User_FK";
       public          postgres    false    231    4764    217            �           2606    25611    orderitems OrderItem_Order_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Order_FK" FOREIGN KEY (order_id) REFERENCES public.orders(order_id);
 I   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Order_FK";
       public          postgres    false    221    4756    223            �           2606    25616    orderitems OrderItem_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.orderitems
    ADD CONSTRAINT "OrderItem_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 K   ALTER TABLE ONLY public.orderitems DROP CONSTRAINT "OrderItem_Product_FK";
       public          postgres    false    4760    221    227            �           2606    25621    orders Order_User_FK    FK CONSTRAINT     z   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "Order_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 @   ALTER TABLE ONLY public.orders DROP CONSTRAINT "Order_User_FK";
       public          postgres    false    223    231    4764            �           2606    25626 %   productImages ProductImage_Product_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public."productImages"
    ADD CONSTRAINT "ProductImage_Product_FK" FOREIGN KEY (product_id) REFERENCES public.products(product_id);
 S   ALTER TABLE ONLY public."productImages" DROP CONSTRAINT "ProductImage_Product_FK";
       public          postgres    false    225    227    4760            �           2606    25631    products Product_Category_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Category_FK" FOREIGN KEY (category_id) REFERENCES public.categories(category_id);
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Category_FK";
       public          postgres    false    219    227    4752            �           2606    25636    products Product_Channels_FK    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_Channels_FK" FOREIGN KEY (channel_id) REFERENCES public.verifiedchannels(channel_id) NOT VALID;
 H   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_Channels_FK";
       public          postgres    false    227    4768    232            �           2606    25641    products Product_User_FK    FK CONSTRAINT     ~   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_User_FK" FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 D   ALTER TABLE ONLY public.products DROP CONSTRAINT "Product_User_FK";
       public          postgres    false    227    4764    231            �           2606    25646 .   verifiedchannels verifiedchannels_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.verifiedchannels
    ADD CONSTRAINT verifiedchannels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 X   ALTER TABLE ONLY public.verifiedchannels DROP CONSTRAINT verifiedchannels_user_id_fkey;
       public          postgres    false    4764    231    232            =   G   x�=ʱ�0��L��d0�Y�����sN�C�O�D>B{v�Uڧh>��2Y���o�g#d�2���h      ;   S   x�32�4�� .#3d����kb$����Lt,t�B���H��� J)���:C,�L�Tr���:#u1z\\\ �l$      ?   ,   x�3�ɯ�2�tO�M�23061��K-/3�9�2��1z\\\ �[	�      A   �  x��W1�!���p]�B0Hȏp��>��ʙ��f&�١���&$��-.�ek�2
>��RK��e�տU�R
�W�|�)o_oZ��� G���M��xD�-%9�p�J(Gn�V�� ���$Zb�q�&�%��]�'���0]��$V.�	I�B"�XmQ�hI(l��
s��a�O�R�$F�����Y��Jc�k�!�	qeh�)!�R�����;0�%��s�o���k:%��iu%f��f�ͱ��9j����" ����И���4� e��H��t�-�ޤ��W:>����|5ic3�m��I������5Ns��Б�u�Uڣ�u<ً��������m�Eh3Y�^z�k��X':_�m����S��8_O��`L"��5S��s������>�s�@�m��<#���y��v6�+%o��^�(,���F�/	 ��\w�ԴkThz@�z�5<?�3=���MP��ٺ��3|�fU�R�4�n��k����w&82Γͮd�7���#�� r'f-��k݌"Sw��Wey���'
˳e�X֍R/GK�q���Ĳ|�M,kEi΍.�\}����^�D� �@��z�'Iĳ�D�sB,�Z���7�'=�;@�3��'�x�B}@����,飰fP'<	�l�����[���J�H���*j�Ќ
�Zn����n�?h0±      C     x��WK�E]O�b.�T�?���fd��FȒ��[.� $$�BύxY5@�T�(q���~��E��M62������x���ۏ��n���i�����B�p���YL�P2`7���|�����BTś9Pv�����Z����3����3���������Ų�z����[�����������
��h��59����Z�� d�7�x��}=lk���Y��{/���W��.�ew֢���`���џ�}@c�ĢX^�����<�v�������קϷ����ӗ��O?��+�E���u-�_��(>��h!�d�k�vdM��h_y#����ta��[>Ӵ`;��%��U	T��u��-�h�=k�.�|.q��c�aV�M�KK�����(��~�o����o��B��592/J�5u���O�y�xw14�IQ���$������P�_st��"�92���h"�J7	���xgG�AR�.,�x���p��OU���􅥶�GSt���t��3Й�>�����HNF���_	�R�Ay�c����-�Us1��]�3Ԏ�"�w�yFMo�i� 	�ǅ���.З�@{�h8�2��p(��!�����>M	s��{��a��썼��iq��U�B�+��>����߬=BJ��`:�p��A�sv�E��85��{r%�-�Q�����$��M�G��u���Qō��f���a<\&�k[<M����1��0��n��L%�5Ƈ�7����d�mX�Ej`4'����a1M�$n�gZ�������*�+�� ���9Y�%������i
��6���x������5$�gLu�.��8Z{�	6�u�ꓡ�UN�QؤFa2�S��'ω-<TS�x;�>@�2���ͥO��v:���=�:���-�����e�%̸X�'��XM0����`�S ��'�#Y/����h������<FuT�t\^��=j��7nC�v����!������Q����1iu�� \qY������Z�Y      E      x������ � �      G   X  x���Kn�0���)�����}���,�̦��؆Q���k9O7����:�%!r�`����8C���w�f��eU�V�M%@)%P!͔�)W"D�bOc�VR#�߮I�%bQI�Y�^�!�.<l����Y�~�V�_-�&.Ec�B��$�}&L+l�n
�?���b0 S`P��C�ﾖ�zQ��r����ɼ3|��z\�ڝ��an��B�5�χ�fl$n��;�)R��?��_����o�+�c�����I$tj��h2������A�����z����S~����E�����cs*�uu(!��f<�lD�Hm�&��Y��:���u?�n'�N'7��I� mЊ���e��{g[��*O��B��C�� ��VZ�Ϭ�d��^r����2���tΣ�l��:Sϫk���Q>o���m�aJ�1�Of<i<�$�{�r�0�\30��\��Z�ץZ�*D�+j��m�:��܎dfz�j*���OD��k|�t%�����2Ӎ4p��^�Z?N�|� �#�.Α,w����C�����H�Q�5�����ؘ�8/3�v�;]f
K��i��X�;]2���AE�9�c      I      x������ � �      K   *  x���;N�0�k�{��<~ď>�JKI������^A�'X��fC�W߈��HE�d������c�����b��B�pKa��� �Bi��s'�h��;l��4m
Y�RyT�0|�|��N� `�
�<����J��c��,q�=�[�)6���UG�;��!>�3g���0��1NF�<Q��["�G���d$m�EO�I�4��MΨ�Wv6ħ�i�n�F$��C���%U��c�i鄗ւc�zssY_�'�$�M
E�«�k�������Z� DP�pڀ������!�i      L   �   x���;N1@k�ۣ�Ό��65�e��6�,���pJ\�G�$�n�R"�Փ��x���  ��tȫ!�q�"�����uY�R7�2-��\C�#�bg��;�W�9i�r,��/�V9��!x�F⤨��%�o��~��6��1x�i�rZOc�i����@DIA��C����a�]�Hg/�:�t�˭�R�&jV�;f��a�Q��O�-��x^;v��\+)��ى-     