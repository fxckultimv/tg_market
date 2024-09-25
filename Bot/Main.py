
import logging
import os
import threading
from aiogram.dispatcher.filters.state import StatesGroup, State
from aiogram.types import ChatType, UserProfilePhotos
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, KeyboardButton, \
    ReplyKeyboardMarkup, WebAppInfo
from aiogram.dispatcher import FSMContext
from aiogram.contrib.middlewares.logging import LoggingMiddleware
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, ParseMode, ContentType
from aiogram.utils import executor
import asyncpg
from flask import Flask, jsonify, request
from datetime import datetime, timedelta, timezone
from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest

import asyncio

API_TOKEN = '7248552375:AAFU11syb9Xi6ii3TLarCkwUB3tG8fYnquQ'

# Логирование
logging.basicConfig(level=logging.INFO)

# Инициализация хранилища для состояний
storage = MemoryStorage()

# Инициализация бота и диспетчера с хранилищем состояний
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot, storage=storage)

# Глобальный объект пула соединений с базой данных
db_pool = None

# Инициализация Flask приложения
app = Flask(__name__)


# Вставьте свои данные
api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
phone_number = '+8562057532284'

# Создание клиента Telethon
client = TelegramClient('session_name', api_id, api_hash)

class OrderState(StatesGroup):
    waiting_for_advertisement = State()
async def create_db_pool():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'Stepan110104'),
            database=os.getenv('DB_NAME', 'TeleAdMarket'),
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            min_size=1,  # Минимальный размер пула
            max_size=10  # Максимальный размер пула соединений
        )
        logging.info("Подключение к базе данных успешно создано")
    except Exception as e:
        logging.error(f"Ошибка подключения к базе данных: {e}")


# Обработчик команды start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = message.from_user.id

    # Проверка на наличие пользователя в базе данных
    async with db_pool.acquire() as connection:
        user = await connection.fetchrow("""
            SELECT user_uuid FROM users WHERE user_id = $1
        """, user_id)

        if user:
            # Если пользователь найден, получаем его user_uuid
            user_uuid = user['user_uuid']

            # Получаем фото профиля
            photos = await bot.get_user_profile_photos(user_id)

            if photos.total_count > 0:
                file_id = photos.photos[0][0].file_id  # Получаем файл ID самого большого фото
                file = await bot.get_file(file_id)
                file_path = file.file_path

                # Формируем путь для сохранения фото
                save_path = f'static/user_{user_uuid}.png'

                # Проверяем существование папки static, если её нет, создаем
                if not os.path.exists('static'):
                    os.makedirs('static')

                # Скачиваем фото
                await bot.download_file(file_path, save_path)



        else:
            # Если пользователь не найден, вы можете добавить логику для регистрации нового пользователя.
            await message.answer("Вы не зарегистрированы в системе.")

    # Создаем кнопки
    button_orders = KeyboardButton('Мои заказы')
    button_ads = KeyboardButton('Мои рекламы')
    button_verified = KeyboardButton('Добавить канал')
    button_my_channels = KeyboardButton('Мои каналы')
    button_support = KeyboardButton('Поддержка')

    # Создаем клавиатуру
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(button_orders).add(button_ads).add(button_support).add(button_verified).add(button_my_channels)

    # Отправляем сообщение с клавиатурой
    await message.answer("Добро пожаловать! Выберите нужный пункт меню:", reply_markup=keyboard)

@dp.message_handler(lambda message: message.text == "Мои заказы")
async def my_orders(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            orders = await connection.fetch("""
                SELECT o.order_id, o.total_price, o.status, o.created_at
                FROM Orders o
                WHERE o.user_id = $1 AND status = 'pending'
                ORDER BY o.created_at DESC
            """, user_id)

            if orders:
                response = "Ваши заказы:"
                keyboard = InlineKeyboardMarkup()
                for order in orders:
                    # Форматирование цены с округлением до целых чисел и разделением тысяч пробелами
                    formatted_price = f"{order['total_price']:,.0f}".replace(",", " ")
                    button_text = f"Заказ №{order['order_id']} - {formatted_price} руб."
                    callback_data = f"order_{order['order_id']}"
                    keyboard.add(InlineKeyboardButton(button_text, callback_data=callback_data))

                await message.answer(response, reply_markup=keyboard)
            else:
                await message.answer("У вас пока нет заказов.")
    except Exception as e:
        logging.error(f"Ошибка получения заказов: {e}")
        await message.answer("Произошла ошибка при получении заказов.")


@dp.message_handler(lambda message: message.text == "Добавить канал")
async def add_channel(message: types.Message):
    try:
        # Кнопка для добавления бота в канал
        add_bot_button = InlineKeyboardMarkup().add(
            InlineKeyboardButton(
                text="Добавить бота в канал",
                url="https://t.me/TeleAdMarketBot?startgroup=true"
            )
        )

        await message.answer(
            "Чтобы верифицировать ваш канал, нужно добавить бота в администраторы вашего канала. "
            "Нажмите на кнопку ниже для добавления бота.",
            reply_markup=add_bot_button
        )

    except Exception as e:
        logging.error(f"Ошибка при добавлении канала: {e}")
        await message.answer("Произошла ошибка при добавлении канала.")



@dp.my_chat_member_handler()
async def on_bot_added_to_channel(my_chat_member: types.ChatMemberUpdated):
    # Проверяем, что бот был добавлен в канал
    if my_chat_member.chat.type == ChatType.CHANNEL and my_chat_member.new_chat_member.status == "administrator":
        try:
            # Получаем информацию о канале
            chat_info = await bot.get_chat(my_chat_member.chat.id)

            # Проверяем, есть ли канал уже в базе данных
            async with db_pool.acquire() as connection:
                channel_exists = await connection.fetchval("""
                    SELECT EXISTS(SELECT 1 FROM verifiedchannels WHERE channel_tg_id = $1)
                """, chat_info.id)

            if channel_exists:
                await bot.send_message(
                    chat_id=my_chat_member.from_user.id,
                    text="Этот канал уже добавлен в базу данных."
                )
                return

            # Получаем количество подписчиков канала
            subscribers_count = await bot.get_chat_members_count(my_chat_member.chat.id)

            # Получаем аватарку канала
            file_path = "Аватарка отсутствует"
            if chat_info.photo:
                file = await bot.get_file(chat_info.photo.big_file_id)
                file_path = f'static/channel_{my_chat_member.chat.id}.png'

                # Скачиваем файл
                await bot.download_file(file.file_path, file_path)

            # Получаем администраторов канала
            administrators = await bot.get_chat_administrators(my_chat_member.chat.id)
            owner_id = None

            # Ищем владельца среди администраторов
            for admin in administrators:
                if admin.status == 'creator':
                    owner_id = admin.user.id
                    break

            if owner_id:
                # Собираем информацию о канале
                channel_title = chat_info.title
                channel_id = chat_info.id
                channel_username = chat_info.username if chat_info.username else "Нет имени пользователя"
                channel_description = chat_info.description if chat_info.description else "Нет описания"

                # Отправляем сообщение владельцу канала с информацией о канале и количестве подписчиков
                await bot.send_message(
                    chat_id=owner_id,
                    text=(f"Бот был добавлен в канал:\n"
                          f"Название канала: {channel_title}\n"
                          f"ID канала: {channel_id}\n"
                          f"Имя пользователя канала: {channel_username}\n"
                          f"Описание канала: {channel_description}\n"
                          f"Количество подписчиков: {subscribers_count}\n"
                          # f"Аватарка сохранена в: {file_path}\n"
                          f"Ваш user_id: {owner_id}\n")
                )

                channel_url = f"https://t.me/{channel_username}"

                # Добавляем информацию о канале в базу данных
                async with db_pool.acquire() as connection:
                    await connection.execute("""
                        INSERT INTO verifiedchannels(user_id, channel_name, channel_title, channel_url, subscribers_count, channel_tg_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (channel_tg_id) DO NOTHING
                    """, owner_id, channel_username, channel_title, channel_url, subscribers_count, channel_id)

                await bot.send_message(
                    chat_id=owner_id,
                    text="Ваш канал был успешно добавлен в нашу базу данных."
                )
            else:
                await bot.send_message(
                    chat_id=my_chat_member.from_user.id,
                    text="Не удалось определить владельца канала."
                )
        except Exception as e:
            logging.error(f"Ошибка при получении информации о канале: {e}")
            await bot.send_message(
                chat_id=my_chat_member.from_user.id,
                text="Произошла ошибка при получении информации о канале."
            )


@dp.message_handler(lambda message: message.text == "Мои каналы")
async def my_channels(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            channels = await connection.fetch("""
                SELECT channel_name, subscribers_count, channel_url
                FROM verifiedchannels 
                WHERE user_id = $1 
                ORDER BY created_at DESC
            """, user_id)

            if channels:
                response = "<b>Ваши каналы:</b>\n\n"
                for channel in channels:
                    channel_name = channel['channel_name']
                    subscribers_count = channel['subscribers_count']
                    channel_url = channel['channel_url']

                    # Форматируем вывод для каждого канала
                    response += (
                        f"<b>Название:</b> <a href='{channel_url}'>{channel_name}</a>\n"
                        f"<b>Количество подписчиков:</b> {subscribers_count}\n\n"
                    )

                await message.answer(response, parse_mode="HTML")
            else:
                await message.answer("У вас пока нет верифицированных каналов.", parse_mode="HTML")
    except Exception as e:
        logging.error(f"Ошибка получения каналов: {e}")
        await message.answer("Произошла ошибка при получении каналов.", parse_mode="HTML")


# Обработчик для обработки order_id
@dp.callback_query_handler(lambda query: query.data.startswith("order_"))
async def process_order_callback(callback_query: types.CallbackQuery, state: FSMContext):
    order_id = int(callback_query.data.split('_')[1])  # Извлекаем order_id из callback_data
    user_id = callback_query.from_user.id

    try:
        async with db_pool.acquire() as connection:
            # Запрос на получение user_id из таблицы Products через таблицы Orders и OrderItems
            result = await connection.fetchrow("""
                SELECT p.user_id
                FROM Products p
                JOIN OrderItems oi ON oi.product_id = p.product_id
                JOIN Orders o ON o.order_id = oi.order_id
                WHERE o.order_id = $1
            """, order_id)

            if result:
                target_user_id = result['user_id']

                # Сообщаем пользователю, что он должен отправить сообщение для пересылки
                await callback_query.message.answer(
                    "Ваше рекламное предложение будет отправлено продавцу для утверждения. "
                    "Отправьте сообщение для пересылки."
                )

                # Сохраняем target_user_id и order_id в состояние
                await state.update_data(target_user_id=target_user_id, order_id=order_id)

                # Активируем состояние ожидания сообщения для пересылки
                await OrderState.waiting_for_advertisement.set()
            else:
                await callback_query.message.answer("Заказ с таким ID не найден.")
    except Exception as e:
        logging.error(f"Ошибка при получении user_id: {e}")
        await callback_query.message.answer("Произошла ошибка при обработке заказа.")


# @dp.message_handler(lambda message: message.text and not message.text.startswith('/'))
# async def forward_advertisement(message: types.Message, state: FSMContext):
#     data = await state.get_data()
#     target_user_id = data.get("target_user_id")
#
#     if target_user_id:
#         try:
#             # Пересылаем сообщение продавцу
#             await bot.forward_message(target_user_id, message.chat.id, message.message_id)
#             await message.answer("Сообщение отправлено продавцу.")
#         except Exception as e:
#             logging.error(f"Ошибка при пересылке сообщения: {e}")
#             await message.answer("Произошла ошибка при отправке сообщения.")
#     else:
#         await message.answer("Не удалось определить пользователя для пересылки сообщения.")


@dp.message_handler(state=OrderState.waiting_for_advertisement, content_types=types.ContentType.ANY)
async def forward_message(message: types.Message, state: FSMContext):
    # Получаем сохраненные данные из состояния
    data = await state.get_data()
    target_user_id = data.get('target_user_id')
    order_id = data.get('order_id')

    if target_user_id and order_id:
        try:
            # Пересылаем сообщение получателю (продавцу)
            await bot.forward_message(chat_id=target_user_id, from_chat_id=message.chat.id, message_id=message.message_id)

            async with db_pool.acquire() as connection:
                await connection.execute("""
                    UPDATE orderitems
                    SET message_id = $1
                    WHERE order_id = $2
                """, message.message_id, order_id)

            # Выполняем запрос к базе данных для получения информации о заказе
            async with db_pool.acquire() as connection:
                order_info = await connection.fetch("""
                    SELECT oi.order_id, oi.post_time, p.product_id, vc.channel_name, vc.channel_url, (oi.quantity * oi.price) as total_price
                    FROM orderitems oi
                    JOIN products p ON oi.product_id = p.product_id
                    JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                    WHERE oi.order_id = $1
                """, order_id)



            if order_info:
                # Обрабатываем все записи и собираем информацию о датах и общей стоимости
                channel_name = order_info[0]['channel_name']
                channel_url = order_info[0]['channel_url']
                post_times = [record['post_time'].strftime("%d-%m-%Y %H:%M") for record in order_info]
                total_prices = sum(record['total_price'] for record in order_info)
                formatted_total_price = f"{total_prices:,.0f}".replace(",", " ")

                post_times_str = ", ".join(post_times)

                message_text = (
                    f"Пользователь @{message.from_user.username} хочет купить у вас рекламу \n"
                    f"в канале <a href='{channel_url}'>{channel_name}</a> \n"
                    f"на даты: {post_times_str}. \n"
                    f"По общей цене {formatted_total_price} руб. \n"
                )

                keyboard = InlineKeyboardMarkup(row_width=2)
                keyboard.add(
                    InlineKeyboardButton("Разместить", callback_data=f"accept_{order_id}"),
                    InlineKeyboardButton("Отклонить", callback_data=f"decline_{order_id}")
                )

                await bot.send_message(
                    chat_id=target_user_id,
                    text=message_text,
                    parse_mode="HTML",
                    reply_markup=keyboard
                )

                # Уведомляем покупателя
                await bot.send_message(
                    chat_id=message.from_user.id,
                    text="Ваше сообщение было успешно отправлено продавцу. Ожидайте его ответа."
                )

                # Обновляем статус заказа на 'waiting'
                async with db_pool.acquire() as connection:
                    await connection.execute("""
                        UPDATE Orders
                        SET status = 'waiting'
                        WHERE order_id = $1
                    """, order_id)

                # Сбрасываем состояние, чтобы бот больше не ждал сообщений
                await state.finish()

            else:
                await message.reply("Не удалось найти информацию о заказе.")

        except Exception as e:
            logging.error(f"Ошибка при пересылке сообщения: {e}")
            await message.reply(f"Ошибка при пересылке: {e}")
    else:
        await message.reply("Не удалось получить данные для пересылки сообщения.")


# Обработчики для нажатия на кнопки
@dp.callback_query_handler(lambda c: c.data and c.data.startswith('accept_'))
async def accept_ad(callback_query: CallbackQuery):
    order_id = int(callback_query.data.split('_')[1])  # Извлекаем order_id из callback_data

    try:
        # Обновляем статус заказа на "ожидает оплаты"
        async with db_pool.acquire() as connection:
            await connection.execute("""
                            UPDATE Orders
                            SET status = 'ожидает оплаты'
                            WHERE order_id = $1
                        """, order_id)

            # Выполняем запрос для получения информации о заказе и канале
            order_info = await connection.fetchrow("""
                SELECT oi.order_id, vc.channel_name, vc.channel_url, o.user_id
                FROM orderitems oi
                JOIN products p ON oi.product_id = p.product_id
                JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                JOIN orders o ON oi.order_id = o.order_id
                WHERE oi.order_id = $1
            """, order_id)

        if order_info:
            channel_name = order_info['channel_name']
            channel_url = order_info['channel_url']
            buyer_user_id = order_info['user_id']

            # Отправляем сообщение продавцу о принятии предложения
            await bot.answer_callback_query(callback_query.id)
            await bot.send_message(
                chat_id=callback_query.from_user.id,
                text=f"Вы приняли предложение. Заказ с ID {order_id} ожидает оплаты."
            )

            # Отправляем сообщение покупателю с информацией о принятии и кнопкой оплаты
            pay_button = InlineKeyboardMarkup().add(
                InlineKeyboardButton("Оплатить", web_app=WebAppInfo(url=f"https://tma.internal:443/buy/{order_id}"))
            )

            await bot.send_message(
                chat_id=buyer_user_id,
                text=(
                    f"Продавец одобрил вашу рекламу в канале "
                    f"<a href='{channel_url}'>{channel_name}</a>. "
                    f"Теперь вам нужно оплатить заказ."
                ),
                parse_mode="HTML",
                reply_markup=pay_button
            )

        else:
            await bot.send_message(
                chat_id=callback_query.from_user.id,
                text="Не удалось найти информацию о заказе."
            )

    except Exception as e:
        logging.error(f"Ошибка при принятии заказа: {e}")
        await bot.send_message(
            chat_id=callback_query.from_user.id,
            text="Произошла ошибка при принятии заказа."
        )


@dp.callback_query_handler(lambda c: c.data and c.data.startswith('decline_'))
async def decline_ad(callback_query: CallbackQuery):
    order_id = int(callback_query.data.split('_')[1])  # Извлекаем order_id из callback_data

    try:
        async with db_pool.acquire() as connection:
            # Выполняем SQL-запрос для обновления статуса заказа на 'rejected'
            await connection.execute("""
                UPDATE Orders
                SET status = 'rejected'
                WHERE order_id = $1
            """, order_id)

            # Получаем user_id покупателя на основе order_id
            buyer_user_id = await connection.fetchval("""
                SELECT user_id FROM orders WHERE order_id = $1
            """, order_id)

            # Отправляем сообщение продавцу о том, что объявление отклонено
            await bot.answer_callback_query(callback_query.id)
            await bot.send_message(
                chat_id=callback_query.from_user.id,
                text=f"Вы отклонили предложение. Статус заказа с ID {order_id} обновлен на 'Отменено'."
            )

            # Отправляем сообщение покупателю о том, что его заказ отклонен
            if buyer_user_id:
                await bot.send_message(
                    chat_id=buyer_user_id,
                    text=f"К сожалению, ваше предложение на заказ с ID {order_id} было отклонено продавцом."
                )
            else:
                logging.warning(f"Покупатель не найден для order_id: {order_id}")

    except Exception as e:
        logging.error(f"Ошибка при обновлении статуса заказа: {e}")
        await bot.send_message(
            chat_id=callback_query.from_user.id,
            text=f"Произошла ошибка при отклонении предложения."
        )


@app.route('/buy', methods=['POST'])
def handle_buy():
    try:
        # Получение данных из запроса
        data = request.json
        user_id = data.get('user_id')
        order_id = data.get('order_id')
        message_id = data.get('message_id')
        format = data.get('format')
        post_time = data.get('post_time')
        channel_name = data.get('channel_name')
        channel_url = data.get('channel_url')
        print(data)

        # Формирование строки с датами публикации
        if isinstance(post_time, list):
            formatted_post_times = "\n".join([f"• {time}" for time in post_time])
        else:
            formatted_post_times = post_time

        # Формирование сообщения для отправки
        if user_id and post_time and channel_name and channel_url:
            text_message = (
                f"🎉 Ваша реклама была куплена!\n\n"
                f"🕒 Время публикации:\n{formatted_post_times}\n"
                f"🕒 Формат:\n{format}\n"
                f"📢 Канал: {channel_name}\n"
                f"🔗 Ссылка на канал: {channel_url}\n"
                "Напиши любое сообщение для просмотра рекламы "
            )

            # Отправляем сообщение продавцу через бота и получаем message_id
            future = asyncio.run_coroutine_threadsafe(bot.send_message(user_id, text_message), event_loop)
            message = future.result()

            # Сохраняем message_id в состоянии пользователя
            state = dp.current_state(user=user_id)
            asyncio.run_coroutine_threadsafe(state.update_data(message_id=message_id), event_loop)

            # Ответ о том, что сообщение было отправлено и получен message_id
            return jsonify(
                {"status": "success", "message": "Message sent to seller", "message_id": message_id}), 200
        else:
            return jsonify({"status": "failure", "message": "Invalid data provided"}), 400
    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        return jsonify({"status": "failure", "message": str(e)}), 500


@dp.message_handler(lambda message: message.text)
async def forward_specified_message(message: types.Message, state: FSMContext):
    # Получаем данные из состояния пользователя
    data = await state.get_data()
    specific_message_id = data.get('message_id')

    user_id = message.from_user.id

    if specific_message_id:
        try:
            # Пересылаем сообщение с сохраненным message_id
            await bot.forward_message(chat_id=user_id, from_chat_id=user_id, message_id=specific_message_id)
        except Exception as e:
            logging.error(f"Ошибка при пересылке сообщения: {e}")
            await message.answer("Произошла ошибка при пересылке сообщения.")
    else:
        await message.answer("Не удалось найти сохраненный message_id.")


@app.route('/order', methods=['POST'])
async def handle_order():
    try:
        # Получение данных из запроса
        data = request.json
        user_id = data.get('user_id')
        order_id = data.get('order_id')

        # Проверка данных
        if not user_id or not order_id:
            return jsonify({"status": "failure", "message": "Invalid data provided"}), 400

        # Отправляем сообщение пользователю о том, что его предложение должно быть отправлено
        message_text = (
            f"Вы сделали заказ {order_id}"
        )

        # Используем asyncio для отправки сообщения асинхронно
        asyncio.run_coroutine_threadsafe(
            bot.send_message(user_id, message_text, parse_mode=ParseMode.MARKDOWN),
            event_loop
        )


        # Возвращаем успешный ответ
        return jsonify({"status": "success", "message": "Message sent and data saved"}), 200

    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        return jsonify({"status": "failure", "message": str(e)}), 500


async def send_survey(db_pool):
    async with db_pool.acquire() as connection:
        now = datetime.now()
        last_day = now - timedelta(days=1)
        print("Отправка запроса на подтверждение выполнения условий сделки:", now)

        results_now = await connection.fetch("""
            SELECT oi.order_id, oi.post_time, oi.product_id, p.user_id AS seller_id, o.user_id AS buyer_id, vc.channel_name, vc.channel_url
            FROM orderitems oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN products p ON oi.product_id = p.product_id
            JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
            WHERE DATE_TRUNC('minute', oi.post_time::timestamp) = DATE_TRUNC('minute', $1::timestamp)
              AND o.status = 'completed'
        """, last_day)

        # Отправка сообщений для подтверждения выполнения условий
        for record in results_now:
            # Сообщение для продавца (seller_id)
            seller_message = (
                f"📊 <b>Вы опубликовали рекламное объявление?</b>\n\n"
                f"📢 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                f"🕒 <b>Время публикации:</b> {record['post_time']}\n\n"
                f"Выполнили ли вы свои условия?"
            )

            # Создание клавиатуры с двумя кнопками для подтверждения продавцом
            seller_keyboard = InlineKeyboardMarkup(row_width=2)
            seller_keyboard.add(
                InlineKeyboardButton("✅Выполнил", callback_data=f"completed_seller_{record['order_id']}"),
                InlineKeyboardButton("❌Не выполнил", callback_data=f"not_completed_seller_{record['order_id']}")
            )

            # Отправка сообщения продавцу
            await bot.send_message(
                chat_id=record['seller_id'],
                text=seller_message,
                reply_markup=seller_keyboard,
                parse_mode="HTML"  # Используем HTML форматирование
            )

            # Сообщение для покупателя (buyer_id)
            buyer_message = (
                f"📢 <b>Продавец опубликовал рекламу?</b>\n\n"
                f"📊 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                f"🕒 <b>Время публикации:</b> {record['post_time']}\n\n"
                f"Выполнил ли продавец свои условия?"
            )

            # Создание клавиатуры с двумя кнопками для подтверждения покупателем
            buyer_keyboard = InlineKeyboardMarkup(row_width=2)
            buyer_keyboard.add(
                InlineKeyboardButton("✅Выполнил", callback_data=f"completed_buyer_{record['order_id']}"),
                InlineKeyboardButton("❌Не выполнил", callback_data=f"not_completed_buyer_{record['order_id']}")
            )

            # Отправка сообщения покупателю
            await bot.send_message(
                chat_id=record['buyer_id'],
                text=buyer_message,
                reply_markup=buyer_keyboard,
                parse_mode="HTML"  # Используем HTML форматирование
            )


# Обработчик для продавца
@dp.callback_query_handler(lambda query: query.data.startswith('completed_seller_'))
async def process_completion_seller(callback_query: types.CallbackQuery):
    order_id = callback_query.data.split('_')[2]
    # Изменение сообщения, если продавец подтвердил выполнение
    await bot.edit_message_text(
        chat_id=callback_query.message.chat.id,
        message_id=callback_query.message.message_id,
        text=f"✅ Вы подтвердили, что выполнили условия для заказа {order_id}.",
        parse_mode="HTML"
    )
    await bot.answer_callback_query(callback_query.id)


@dp.callback_query_handler(lambda query: query.data.startswith('not_completed_seller_'))
async def process_not_completion_seller(callback_query: types.CallbackQuery):
    order_id = callback_query.data.split('_')[2]
    # Изменение сообщения, если продавец отказал
    keyboard = InlineKeyboardMarkup(row_width=1)
    keyboard.add(
        InlineKeyboardButton("Поддержка", callback_data=f"1"),
    )
    await bot.edit_message_text(
        chat_id=callback_query.message.chat.id,
        message_id=callback_query.message.message_id,
        text=f"❌ Обратитесь в поддержку по заказу {order_id}.",
        reply_markup=keyboard,
        parse_mode="HTML"
    )
    await bot.answer_callback_query(callback_query.id)


# Обработчик для покупателя
@dp.callback_query_handler(lambda query: query.data.startswith('completed_buyer_'))
async def process_completion_buyer(callback_query: types.CallbackQuery):
    order_id = callback_query.data.split('_')[2]
    order_id = int(order_id)
    # Получаем user_id продавца на основе order_id
    async with db_pool.acquire() as connection:
        seller_info = await connection.fetchrow("""
            SELECT p.user_id AS seller_id
            FROM orderitems oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = $1
        """, order_id)

        # Отправка сообщения продавцу
        if seller_info:
            seller_id = seller_info['seller_id']
            await bot.send_message(
                chat_id=seller_id,
                text=f"✅ Покупатель подтвердил, что вы выполнили условия для заказа {order_id}.",
                parse_mode="HTML"
            )

    # Создание клавиатуры с оценками
    rating_keyboard = InlineKeyboardMarkup(row_width=5)
    rating_keyboard.add(
        InlineKeyboardButton(text="⭐", callback_data=f'rating_1_{order_id}'),
        InlineKeyboardButton(text="2⭐", callback_data=f'rating_2_{order_id}'),
        InlineKeyboardButton(text="3⭐", callback_data=f'rating_3_{order_id}'),
        InlineKeyboardButton(text="4⭐", callback_data=f'rating_4_{order_id}'),
        InlineKeyboardButton(text="5⭐", callback_data=f'rating_5_{order_id}')
    )

    # Изменение сообщения, если покупатель подтвердил выполнение
    await bot.edit_message_text(
        chat_id=callback_query.message.chat.id,
        message_id=callback_query.message.message_id,
        text=f"✅ Вы подтвердили, что продавец выполнил условия для заказа {order_id}."
             f"Поставте отзыв продавцу",
        parse_mode="HTML",
        reply_markup=rating_keyboard
    )

    await bot.answer_callback_query(callback_query.id)


@dp.callback_query_handler(lambda query: query.data.startswith('rating_'))
async def process_rating(callback_query: types.CallbackQuery):
    data = callback_query.data.split('_')
    rating = int(data[1])  # Извлечение рейтинга (от 1 до 5)
    order_id = int(data[2])  # Извлечение order_id
    user_id = callback_query.from_user.id  # Извлечение user_id покупателя

    # Получаем seller_id на основе order_id
    async with db_pool.acquire() as connection:
        seller_info = await connection.fetchrow("""
            SELECT p.user_id AS seller_id
            FROM orderitems oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = $1
        """, order_id)

    if seller_info:
        seller_id = seller_info['seller_id']

        # Вставляем рейтинг в таблицу reviews
        async with db_pool.acquire() as connection:
            await connection.execute("""
                INSERT INTO reviews (seller_id, user_id, rating, order_id)
                VALUES ($1, $2, $3, $4)
            """, seller_id, user_id, rating, order_id)

    # Создаем клавиатуру с кнопкой "Написать отзыв"
    feedback_keyboard = InlineKeyboardMarkup(row_width=1)
    feedback_keyboard.add(
        InlineKeyboardButton(text="Написать отзыв", callback_data=f'feedback_{order_id}')
    )

    # Отправка сообщения пользователю с благодарностью за оценку и кнопкой "Написать отзыв"
    await bot.send_message(
        chat_id=callback_query.message.chat.id,
        text=f"Спасибо за вашу оценку {rating}⭐ для заказа {order_id}.",
        parse_mode="HTML",
        reply_markup=feedback_keyboard
    )

    await bot.answer_callback_query(callback_query.id)


# @dp.callback_query_handler(lambda query: query.data.startswith('feedback_'))
# async def process_feedback(callback_query: types.CallbackQuery):
#     order_id = int(callback_query.data.split('_')[1])
#
#     # Спрашиваем пользователя, чтобы он отправил свой комментарий (отзыв)
#     await bot.send_message(
#         chat_id=callback_query.message.chat.id,
#         text=f"Пожалуйста, напишите ваш отзыв для заказа {order_id}.",
#         parse_mode="HTML"
#     )
#
#     @dp.message_handler()
#     async def get_feedback(message: types.Message):
#         comment = message.text  # Получаем текст отзыва
#         user_id = message.from_user.id  # Получаем user_id покупателя
#
#         # Получаем seller_id на основе order_id
#         async with db_pool.acquire() as connection:
#             seller_info = await connection.fetchrow("""
#                 SELECT p.user_id AS seller_id
#                 FROM orderitems oi
#                 JOIN products p ON oi.product_id = p.product_id
#                 WHERE oi.order_id = $1
#             """, order_id)
#
#         if seller_info:
#             seller_id = seller_info['seller_id']
#
#             # Обновляем запись в таблице reviews с добавлением комментария
#             async with db_pool.acquire() as connection:
#                 await connection.execute("""
#                     UPDATE reviews
#                     SET comment = $1
#                     WHERE order_id = $2 AND user_id = $3
#                 """, comment, order_id, user_id)
#
#         # Отправляем пользователю подтверждение
#         await bot.send_message(
#             chat_id=message.chat.id,
#             text=f"Ваш отзыв для заказа {order_id} был успешно сохранен. Спасибо!",
#             parse_mode="HTML"
#         )


@dp.callback_query_handler(lambda query: query.data.startswith('not_completed_buyer_'))
async def process_not_completion_buyer(callback_query: types.CallbackQuery):
    order_id = callback_query.data.split('_')[2]
    # Изменение сообщения, если покупатель отказал
    keyboard = InlineKeyboardMarkup(row_width=1)
    keyboard.add(
        InlineKeyboardButton("Поддержка", callback_data=f"2"),
    )
    await bot.edit_message_text(
        chat_id=callback_query.message.chat.id,
        message_id=callback_query.message.message_id,
        text=f"❌ Обратитесь в поддержку по заказу {order_id}.",
        reply_markup=keyboard,
        parse_mode="HTML"
    )
    await bot.answer_callback_query(callback_query.id)



async def check_orders_10min(db_pool):
    async with db_pool.acquire() as connection:
        now = datetime.now()
        ten_minutes_later = now + timedelta(minutes=10)
        print("10 минут до публикации:", now, ten_minutes_later)

        results_10min = await connection.fetch("""
            SELECT oi.order_id, oi.post_time, oi.product_id, p.user_id, vc.channel_name, vc.channel_url, pf.format_name
            FROM orderitems oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN products p ON oi.product_id = p.product_id
            JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
            JOIN publication_formats pf ON pf.format_id = oi.format
            WHERE oi.post_time BETWEEN $1 AND $2
              AND o.status = 'completed'
        """, now, ten_minutes_later)

        # Оповещение за 10 минут до публикации
        for record in results_10min:
            await bot.send_message(
                chat_id=record['user_id'],
                text=(
                    f"📢 <b>Через 10 минут нужно опубликовать рекламу!</b>\n\n"
                    f"📢 <b>Формат{record['format_name']}</b>\n\n"
                    f"📊 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                    f"🕒 <b>Время публикации:</b> {record['post_time']}"
                ),
                parse_mode="HTML"  # Используем HTML форматирование
            )


async def check_orders_now(db_pool):
    async with db_pool.acquire() as connection:
        now = datetime.now()
        print("Публикация прямо сейчас:", now)

        results_now = await connection.fetch("""
            SELECT oi.order_id, oi.post_time, oi.product_id, p.user_id, vc.channel_name, vc.channel_url, pf.format_name
            FROM orderitems oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN products p ON oi.product_id = p.product_id
            JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
            JOIN publication_formats pf ON pf.format_id = oi.format
            WHERE DATE_TRUNC('minute', oi.post_time::timestamp) = DATE_TRUNC('minute', $1::timestamp)
              AND o.status = 'completed'
        """, now)

        # Оповещение о необходимости публикации прямо сейчас
        for record in results_now:
            await bot.send_message(
                chat_id=record['user_id'],
                text=(
                    f"🚨 <b>Пора выкладывать рекламу!</b>\n\n"
                    f"🚨 <b>Формат:{record['format_name']}</b>\n\n"
                    f"📊 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                    f"🕒 <b>Время публикации:</b> {record['post_time']}"
                ),
                parse_mode="HTML"  # Используем HTML форматирование
            )



async def on_startup(dp):
    await create_db_pool()  # Создаем пул при запуске
    logging.info("Пул соединений с базой данных создан")

    # Запускаем фоновые задачи для проверок
    asyncio.create_task(check_orders_10min_loop())
    asyncio.create_task(check_orders_now_loop())
    asyncio.create_task(send_survey_loop())
    # asyncio.create_task(daily_update())



async def check_orders_10min_loop():
    while True:
        await check_orders_10min(db_pool)
        await asyncio.sleep(600)  # Проверяем каждые 60 секунд

async def check_orders_now_loop():
    while True:
        await check_orders_now(db_pool)
        await asyncio.sleep(60)  # Проверяем каждые 60 секунд

async def send_survey_loop():
    while True:
        await send_survey(db_pool)
        await asyncio.sleep(60)  # Проверяем каждые 60 секунд


# async def daily_update():
#     while True:
#         await update_channel_views(db_pool)
#         await asyncio.sleep(86400)  # Ожидаем 24 часа перед следующим запуском



if __name__ == '__main__':
    def start_aiogram():
        global event_loop
        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)
        executor.start_polling(dp, skip_updates=True, on_startup=on_startup)

    # Запуск aiogram в отдельном потоке
    threading.Thread(target=start_aiogram).start()

    # Запуск обновления просмотров в основном потоке
    # with client:
    #     client.loop.run_until_complete(daily_update())

    app.run(host='0.0.0.0', port=5001)
