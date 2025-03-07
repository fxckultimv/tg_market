import os
from http.client import HTTPException
from typing import Union, List
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import StatesGroup, State
from aiogram.types import (
    ChatType, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery,
    KeyboardButton, ReplyKeyboardMarkup, ParseMode, ContentType, WebAppInfo, InputFile
)
from aiogram import types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import logging
import asyncpg
from datetime import datetime, timedelta

from aiogram.utils.callback_data import CallbackData
from aiogram.utils.exceptions import FileIsTooBig
from aiogram.utils.markdown import escape_md
from pydantic import BaseModel
from telethon import TelegramClient
import asyncio
from fastapi import FastAPI
from uvicorn import Config, Server

app = FastAPI()

API_TOKEN = '7236806586:AAEyzDi_99Y6YKhyG5ZGPCBWSMAVlkrt7VI'

logging.basicConfig(level=logging.INFO)

storage = MemoryStorage()
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot, storage=storage)

db_pool = None

api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
phone_number = '+8562057532284'

client = TelegramClient('session_name', api_id, api_hash)

class OrderState(StatesGroup):
    waiting_for_advertisement = State()

def nano_ton_to_ton(nano_ton):
    """
    Converts nanoTon to TON.

    :param nano_ton: The amount in nanoTon (int, float, or str).
    :return: The equivalent amount in TON (float).
    """
    if isinstance(nano_ton, str):
        # Удаляем пробелы перед преобразованием
        nano_ton = float(nano_ton.replace(" ", ""))
    return nano_ton / 1_000_000_000


def ton_to_nano_ton(ton):
    """
    Converts TON to nanoTon.

    :param ton: The amount in TON (int, float, or str).
    :return: The equivalent amount in nanoTon (float).
    """
    if isinstance(ton, str):
        # Удаляем пробелы перед преобразованием
        ton = float(ton.replace(" ", ""))
    return ton * 1_000_000_000



async def create_db_pool():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'Stepan110104'),
            database=os.getenv('DB_NAME', 'TeleAdMarket'),
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            min_size=1,
            max_size=10
        )
        logging.info("Подключение к базе данных успешно создано")
    except Exception as e:
        logging.error(f"Ошибка подключения к базе данных: {e}")

@dp.message_handler(content_types=types.ContentType.VIDEO)
async def get_video_id(message: types.Message):
    await message.answer(message.video.file_id)  # Выведет новый file_id в консоль


@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = message.from_user.id

    inline_keyboard = InlineKeyboardMarkup().add(
        InlineKeyboardButton("Биржа", web_app=types.WebAppInfo(url="https://marusinohome.ru"))  # Замени ссылку
    )

    # async with db_pool.acquire() as connection:
    #     user = await connection.fetchrow(
    #         "SELECT user_uuid FROM users WHERE user_id = $1", user_id
    #     )
    #
    #     if user:
    #         user_uuid = user['user_uuid']
    #         photos = await bot.get_user_profile_photos(user_id)
    #
    #         if photos.total_count > 0:
    #             file_id = photos.photos[0][0].file_id
    #             file = await bot.get_file(file_id)
    #             file_path = file.file_path
    #
    #             save_path = f'static/user_{user_uuid}.png'
    #
    #             if not os.path.exists('static'):
    #                 os.makedirs('static')
    #
    #             await bot.download_file(file_path, save_path)
    #
    #     else:
    #         await message.answer("Вы не зарегистрированы в системе.")

    button_orders = KeyboardButton('Профиль')
    button_ads = KeyboardButton('Рекламы')
    button_applications = KeyboardButton('Заказы на выполнение')
    button_verified = KeyboardButton('Добавить канал')
    button_my_channels = KeyboardButton('Мои каналы')
    button_support = KeyboardButton('Поддержка')

    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(button_orders, button_ads, button_applications, button_verified, button_my_channels, button_support)

    text = (
        "<b>🚀 Добро пожаловать на биржу рекламы <a>@Carrot</a></b>\n\n"
        "💼 Покупайте рекламу в <b>один клик!</b>\n"
        "💰 Резерв средств до выполнения заказа – <b>безопасная сделка</b>.\n"
        "📢 Продавайте рекламу в своих Telegram-каналах и зарабатывайте.\n"
        "💎 Зарабатывайте TON на своей аудитории прямо в Telegram!\n\n"
        "<b>📊 Быстро. Удобно. Надежно.</b>"
    )

    # Отправляем обычную (Reply) клавиатуру перед видео
    await message.answer("Выберите действие:", reply_markup=keyboard)

    # Отправляем видео с Inline-кнопками
    await message.answer_video(
        'BAACAgIAAxkBAAM0Z6XHGstjH-WLiyov3KQmWEt9mCIAAtpjAAI01DBJe9Dkz7pjxKU2BA',
        caption=text,
        reply_markup=inline_keyboard,
        parse_mode="HTML"
    )

@dp.message_handler(commands=["menu"])
async def menu_handler(message: types.Message):
    user_id = message.from_user.id

    # Текст сообщения
    text = (
        f"👤 <b>Имя:</b> Strep\n"
        # f"💰 <b>Баланс:</b> 10 TON\n"
        f"📆 <b>Стаж:</b> 5 месяцев\n\n"
        "Выберите действие:"
    )

    # Inline-кнопки 4 кнопки, по 2 в ряд
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="📢 Рекламы", callback_data="ads"),
            types.InlineKeyboardButton(text="👤 Профиль", callback_data="profile"),
        ],
        [
            types.InlineKeyboardButton(text="📡 Каналы", callback_data="channels"),
            types.InlineKeyboardButton(text="🛠 Поддержка", callback_data="support"),
        ]
    ])

    await message.answer(text, reply_markup=keyboard, parse_mode="HTML")



# @dp.message_handler(commands=['myProfile'])
# async def send_welcome(message: types.Message):
#     user_id = message.from_user.id
#
#     pay_button = InlineKeyboardMarkup().add(
#         InlineKeyboardButton("Оплатить", web_app=WebAppInfo(url=f"https://tma.internal/user/4526c40d-3bb8-45ac-af4f-d751e64aceb3"))
#     )
#
#     await message.answer("Добро пожаловать! Выберите нужный пункт меню: тут(https://t.me/TeleAdMarketBot/tma.internal/user/4526c40d-3bb8-45ac-af4f-d751e64aceb3)", reply_markup=pay_button)



@dp.message_handler(lambda message: message.text == "Профиль")
async def user_profile(message: types.Message):
    user_id = message.from_user.id

    try:
        async with db_pool.acquire() as connection:
            user = await connection.fetchrow(
                "SELECT * FROM users WHERE user_id = $1", user_id
            )

        if user:
            # Форматируем информацию о пользователе
            response = (
                f"👤 <b>Имя:</b> {user['username']}\n"
                f"🆔 <b>User ID:</b> {user['user_id']}\n"
                f"💰 <b>Баланс:</b> 10 TON\n"
                f"📅 <b>Дата регистрации:</b> {user['created_at'].strftime('%d.%m.%Y')}\n"
                f"🛠 <b>Статус:</b> {user['rating']}\n"
            )

            # Создаём inline-кнопку "Сменить фото"
            keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
                [types.InlineKeyboardButton(text="🖼 Сменить фото", callback_data="change_photo")]
            ])

            await message.answer(response, reply_markup=keyboard, parse_mode="HTML")
        else:
            await message.answer("🚨 Ошибка: Пользователь не найден в базе данных.")
    except Exception as e:
        logging.error(f"Ошибка получения данных профиля: {e}")
        await message.answer("🚨 Произошла ошибка при получении данных профиля.")

@dp.callback_query_handler(lambda callback_query: callback_query.data == "change_photo")
async def my_orders(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id

    try:
        async with db_pool.acquire() as connection:
            user = await connection.fetchrow(
                "SELECT user_uuid FROM users WHERE user_id = $1", user_id
            )

        if user:
            user_uuid = user['user_uuid']
            photos = await bot.get_user_profile_photos(user_id)

            if photos.total_count > 0:
                file_id = photos.photos[0][0].file_id
                file = await bot.get_file(file_id)
                file_path = file.file_path

                save_directory = 'static'
                if not os.path.exists(save_directory):
                    os.makedirs(save_directory)

                save_path = os.path.join(save_directory, f'user_{user_uuid}.png')

                # Удаляем старый файл, если он существует
                if os.path.exists(save_path):
                    os.remove(save_path)

                # Скачиваем новый файл
                await bot.download_file(file_path, save_path)

                await callback_query.message.answer("✅ Ваше фото успешно обновлено!")
            else:
                await callback_query.message.answer("❌ У вас нет фотографий в профиле.")
        else:
            await callback_query.message.answer("🚨 Вы не зарегистрированы в системе.")
    except FileIsTooBig:
        await callback_query.message.answer("❌ Ваше фото слишком большое для загрузки.")
    except Exception as e:
        logging.error(f"Ошибка при смене фото: {e}")
        await callback_query.message.answer("🚨 Произошла ошибка при смене фото.")

@dp.message_handler(lambda message: message.text == "Рекламы")
async def ads_menu(message: types.Message):
    # Создаём inline-кнопки
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="📦 Мои заказы", callback_data="my_orders"),
            types.InlineKeyboardButton(text="📢 Мои рекламы", callback_data="my_ads"),
        ]
    ])

    await message.answer("📢 Выберите действие:", reply_markup=keyboard)

@dp.callback_query_handler(lambda callback_query: callback_query.data == "my_orders")
async def my_orders(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    try:
        async with db_pool.acquire() as connection:
            orders = await connection.fetch(
                """SELECT o.order_id, o.total_price, o.status, o.created_at
                   FROM Orders o WHERE o.user_id = $1 AND status = 'waiting'
                   ORDER BY o.created_at DESC""", user_id
            )

            if orders:
                response = "Ваши заказы:"
                keyboard = InlineKeyboardMarkup()
                for order in orders:
                    formatted_price = f"{order['total_price']:,.0f}".replace(",", " ")
                    button_text = f"Заказ №{order['order_id']} - {nano_ton_to_ton(formatted_price)}ton."
                    callback_data = f"order_{order['order_id']}"
                    keyboard.add(InlineKeyboardButton(button_text, callback_data=callback_data))

                await callback_query.message.answer(response, reply_markup=keyboard)
            else:
                await callback_query.message.answer("У вас пока нет заказов.")
    except Exception as e:
        logging.error(f"Ошибка получения заказов: {e}")
        await callback_query.message.answer("Произошла ошибка при получении заказов.")

@dp.callback_query_handler(lambda callback_query: callback_query.data == "my_ads")
async def my_orders(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    try:
        async with db_pool.acquire() as connection:
            ads = await connection.fetch(
                """SELECT DISTINCT o.user_id, o.order_id, p.product_id, total_price ,p.title FROM orders AS o
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON p.product_id = oi.product_id
                WHERE o.user_id = $1 AND o.status = 'paid'
                ORDER BY o.order_id desc""", user_id
            )

            if ads:
                response = "Ваши заказы:"
                keyboard = InlineKeyboardMarkup()
                for order in ads:
                    formatted_price = f"{order['total_price']:,.0f}".replace(",", " ")
                    button_text = f"Заказ №{order['order_id']} - {nano_ton_to_ton(formatted_price)} ton."
                    callback_data = f"ad_{order['order_id']}"
                    keyboard.add(InlineKeyboardButton(button_text, callback_data=callback_data))

                await callback_query.message.answer(response, reply_markup=keyboard)
            else:
                await callback_query.message.answer("У вас пока нет заказов.")
    except Exception as e:
        logging.error(f"Ошибка получения заказов: {e}")
        await callback_query.message.answer("Произошла ошибка при получении заказов.")

@dp.callback_query_handler(lambda callback_query: callback_query.data.startswith("ad_"))
async def ad_details(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    try:
        order_id = int(callback_query.data.split("_")[1])
        async with db_pool.acquire() as connection:
            ad_details = await connection.fetchrow(
                """
                SELECT o.user_id, o.order_id, o.total_price, array_agg(oi.post_time) AS post_times, 
                       oi.message_id, p.product_id, p.title, p.post_time, pf.format_name 
                FROM orders AS o
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON p.product_id = oi.product_id
                JOIN publication_formats pf ON oi.format = pf.format_id
                WHERE o.order_id = $1
                GROUP BY 
                    o.user_id, 
                    o.order_id, 
                    o.total_price, 
                    oi.message_id, 
                    p.product_id, 
                    p.title, 
                    p.post_time, 
                    pf.format_name;
                """,
                order_id
            )

            if ad_details:
                # Преобразование datetime в строки
                post_times = (
                    ", ".join(post_time.strftime("%Y-%m-%d %H:%M:%S") for post_time in ad_details['post_times'])
                    if ad_details['post_times']
                    else "Нет данных"
                )
                price = nano_ton_to_ton(ad_details['total_price'])
                response = (
                    f"**Детали рекламы №{escape_md(str(ad_details['order_id']))}**\n"
                    f"Название: {escape_md(ad_details['title'])}\n"
                    f"Общая цена: {price:.2f} TON\n"
                    f"Время постинга: {escape_md(post_times)}\n"
                    f"Формат публикации: {escape_md(ad_details['format_name'])}\n"
                    f"ID сообщения: {escape_md(str(ad_details['message_id']))}\n"
                    f"ID продукта: {escape_md(str(ad_details['product_id']))}\n"
                )
                # Кнопка "Пост"
                keyboard = InlineKeyboardMarkup().add(
                    InlineKeyboardButton(
                        text="Пост",
                        callback_data=f"post_{ad_details['message_id']}"
                    ),InlineKeyboardButton("Подтвердить", web_app=WebAppInfo(url="https://marusinohome.ru/profile/history/{order_id}")),
                        # InlineKeyboardButton("Не выполнено", callback_data=f"adnotdone_{ad_details['order_id']}")
                )
                await callback_query.message.edit_text(response, parse_mode="Markdown", reply_markup=keyboard)
            else:
                await callback_query.message.edit_text("Детали рекламы не найдены.")
    except Exception as e:
        logging.error(f"Ошибка получения деталей рекламы: {e}")
        await callback_query.message.edit_text("Произошла ошибка при получении деталей рекламы.")

@dp.callback_query_handler(lambda callback_query: callback_query.data.startswith("post_"))
async def post_ad(callback_query: CallbackQuery):
    try:
        message_id = int(callback_query.data.split("_")[1])
        chat_id = callback_query.message.chat.id  # ID текущего чата

        await callback_query.bot.copy_message(
            chat_id=chat_id,
            from_chat_id=chat_id,
            message_id=message_id
        )
        # await callback_query.answer("Сообщение переслано успешно!", show_alert=True)
    except Exception as e:
        logging.error(f"Ошибка пересылки сообщения: {e}")
        await callback_query.answer("Произошла ошибка при пересылке сообщения.", show_alert=True)

@dp.callback_query_handler(lambda call: call.data.startswith("addone_") or call.data.startswith("adnotdone_"))
async def ad_confirmation_handler(call: CallbackQuery):
    try:
        # Извлечение ID рекламы
        ad_id = int(call.data.split('_')[1])

        async with db_pool.acquire() as connection:
            if call.data.startswith('addone_'):
                # Обновление статуса на "completed"
                await connection.execute(
                    """
                    UPDATE orders 
                    SET status = 'completed' 
                    WHERE order_id = $1
                    """,
                    ad_id
                )
                await call.message.edit_reply_markup()  # Убираем клавиатуру
                await call.message.answer(f"Реклама №{ad_id} отмечена как выполненная.")
            elif call.data.startswith('adnotdone_'):
                # Обновление статуса на "problem"
                await connection.execute(
                    """
                    UPDATE orders 
                    SET status = 'problem' 
                    WHERE order_id = $1
                    """,
                    ad_id
                )
                await call.message.edit_reply_markup()  # Убираем клавиатуру
                await call.message.answer(f"Реклама №{ad_id} отмечена как невыполненная.")

        # Уведомление пользователя об успешном обновлении статуса
        await call.answer("Статус обновлён.", show_alert=True)

    except ValueError as e:
        logging.error(f"Ошибка обработки данных callback_data: {e}")
        await call.answer("Некорректные данные для изменения статуса.", show_alert=True)
    except Exception as e:
        logging.error(f"Ошибка изменения статуса в базе данных: {e}")
        await call.answer("Произошла ошибка при изменении статуса.", show_alert=True)

@dp.message_handler(lambda message: message.text == "Заказы на выполнение")
async def seller_orders(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            orders = await connection.fetch(
                """
                SELECT DISTINCT oi.order_item_id, oi.post_time, p.product_id, p.title 
                FROM orders AS o
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON p.product_id = oi.product_id
                WHERE p.user_id = $1 AND o.status = 'paid'
                ORDER BY oi.order_item_id DESC
                """,
                user_id
            )

            if orders:
                response = "Ваши заказы на выполнение:"
                keyboard = InlineKeyboardMarkup()
                for order in orders:
                    button_text = f"Заказ №{order['order_item_id']} - {order['title']}"
                    callback_data = f"seller_order_{order['order_item_id']}"
                    keyboard.add(InlineKeyboardButton(button_text, callback_data=callback_data))

                await message.answer(response, reply_markup=keyboard)
            else:
                await message.answer("У вас пока нет заказов на выполнение.")
    except Exception as e:
        logging.error(f"Ошибка получения заказов на выполнение: {e}")
        await message.answer("Произошла ошибка при получении ваших заказов на выполнение.")

@dp.callback_query_handler(lambda callback_query: callback_query.data.startswith("seller_order_"))
async def order_details(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    try:
        order_item_id = int(callback_query.data.split("_")[2])  # Извлечение ID заказа
        async with db_pool.acquire() as connection:
            order_details = await connection.fetchrow(
                """
                SELECT o.user_id, oi.order_id, oi.post_time, oi.message_id, oi.chat_id,
                       p.product_id, p.title, pf.format_name
                FROM orders AS o
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON p.product_id = oi.product_id
                JOIN publication_formats pf ON oi.format = pf.format_id
                WHERE oi.order_item_id = $1
                """,
                order_item_id
            )

            if not order_details:
                await callback_query.message.edit_text("Детали заказа не найдены.")
                return

            post_time = (
                order_details['post_time'].strftime("%Y-%m-%d %H:%M:%S")
                if order_details['post_time']
                else "Нет данных"
            )
            response = (
                f"**Детали заказа на выполнение №{order_details['order_id']}**\n"
                f"Название: {order_details['title']}\n"
                f"Время выполнения: {post_time}\n"
                f"Формат публикации: {order_details['format_name']}\n"
                f"ID сообщения: {order_details['message_id']}\n"
                f"ID продукта: {order_details['product_id']}\n"
            )
            # Кнопка "Пост" с передачей message_id и chat_id
            callback_data = f"adpost_{order_details['message_id']}_{order_details['chat_id']}"
            keyboard = InlineKeyboardMarkup().add(
                InlineKeyboardButton(text="Пост", callback_data=callback_data)
            )
            await callback_query.message.edit_text(response, parse_mode="Markdown", reply_markup=keyboard)
    except ValueError as e:
        logging.error(f"Некорректные данные callback_data: {e}")
        await callback_query.message.edit_text("Ошибка: некорректные данные заказа.")
    except Exception as e:
        logging.error(f"Ошибка получения деталей заказа: {e}")
        await callback_query.message.edit_text("Произошла ошибка при получении деталей заказа.")

@dp.callback_query_handler(lambda callback_query: callback_query.data.startswith("adpost_"))
async def post_ad(callback_query: CallbackQuery):
    try:
        data = callback_query.data.split("_")
        print(data)

        # Проверка, что в callback_data ожидаемое количество элементов
        if len(data) != 3:
            raise ValueError("Некорректные данные в callback_data.")

        message_id = int(data[1])  # Извлечение message_id
        chat_id = int(data[2])  # Извлечение chat_id (чат заказчика)
        current_chat_id = callback_query.message.chat.id  # Текущий чат

        # Пересылка сообщения
        await callback_query.bot.copy_message(
            chat_id=current_chat_id,  # Пересылка в текущий чат
            from_chat_id=chat_id,  # Чат заказчика
            message_id=message_id  # ID сообщения
        )
        # await callback_query.answer("Сообщение успешно переслано!", show_alert=True)
    except ValueError as e:
        logging.error(f"Ошибка обработки данных callback_data: {e}")
        await callback_query.answer("Некорректные данные для пересылки сообщения.", show_alert=True)
    except Exception as e:
        logging.error(f"Ошибка пересылки сообщения: {e}")
        await callback_query.answer("Произошла ошибка при пересылке сообщения.", show_alert=True)

@dp.message_handler(lambda message: message.text == "Добавить канал")
async def add_channel(message: types.Message):
    try:
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
    if my_chat_member.chat.type == ChatType.CHANNEL and my_chat_member.new_chat_member.status == "administrator":
        try:
            chat_info = await bot.get_chat(my_chat_member.chat.id)

            async with db_pool.acquire() as connection:
                channel_exists = await connection.fetchval(
                    "SELECT EXISTS(SELECT 1 FROM verifiedchannels WHERE channel_tg_id = $1)", chat_info.id
                )

            if channel_exists:
                await bot.send_message(
                    chat_id=my_chat_member.from_user.id,
                    text="Этот канал уже добавлен в базу данных."
                )
                return

            subscribers_count = await bot.get_chat_members_count(my_chat_member.chat.id)

            # Проверка на количество подписчиков
            if subscribers_count <= 0:
                await bot.send_message(
                    chat_id=my_chat_member.from_user.id,
                    text="Канал не может быть добавлен, так как количество подписчиков должно быть больше 1000."
                )
                return

            file_path = await download_channel_photo(bot, my_chat_member.chat.id)
            if not file_path:
                file_path = "Аватарка отсутствует"

            administrators = await bot.get_chat_administrators(my_chat_member.chat.id)
            owner_id = None
            for admin in administrators:
                if admin.status == 'creator':
                    owner_id = admin.user.id
                    break

            if owner_id:
                channel_title = chat_info.title
                channel_id = chat_info.id
                channel_username = chat_info.username or "Нет имени пользователя"
                channel_description = chat_info.description or "Нет описания"

                await bot.send_message(
                    chat_id=owner_id,
                    text=(f"Бот был добавлен в канал:\n"
                          f"Название канала: {channel_title}\n"
                          f"ID канала: {channel_id}\n"
                          f"Имя пользователя канала: {channel_username}\n"
                          f"Описание канала: {channel_description}\n"
                          f"Количество подписчиков: {subscribers_count}\n"
                          f"Ваш user_id: {owner_id}\n")
                )

                channel_url = f"https://t.me/{channel_username}"

                async with db_pool.acquire() as connection:
                    await connection.execute(
                        """INSERT INTO verifiedchannels(user_id, channel_name, channel_title, 
                           channel_url, subscribers_count, channel_tg_id)
                           VALUES ($1, $2, $3, $4, $5, $6)
                           ON CONFLICT (channel_tg_id) DO NOTHING""",
                        owner_id, channel_username, channel_title, channel_url, subscribers_count, channel_id
                    )

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

# Хендлер: Выводит список каналов с уникальным callback_data
@dp.message_handler(lambda message: message.text == "Мои каналы")
async def my_channels(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            channels = await connection.fetch(
                """SELECT channel_id, channel_name, channel_url, channel_tg_id
                   FROM verifiedchannels 
                   WHERE user_id = $1 ORDER BY created_at DESC""", user_id
            )

            if channels:
                keyboard = InlineKeyboardMarkup(row_width=1)

                for channel in channels:
                    channel_tg_id = channel['channel_tg_id']
                    channel_name = channel['channel_name']

                    button = InlineKeyboardButton(
                        text=channel_name,
                        callback_data=f"channel_{channel_tg_id}"
                    )
                    keyboard.add(button)

                await message.answer("<b>Ваши каналы:</b>", parse_mode="HTML", reply_markup=keyboard)
            else:
                await message.answer("У вас пока нет верифицированных каналов.", parse_mode="HTML")
    except Exception as e:
        logging.error(f"Ошибка получения каналов: {e}")
        await message.answer("Произошла ошибка при получении каналов.", parse_mode="HTML")

# Хендлер: Обрабатывает нажатие на кнопку с каналом и показывает кнопку "Смена картинки"
@dp.callback_query_handler(lambda call: call.data.startswith("channel_"))
async def channel_selected(call: types.CallbackQuery):
    channel_tg_id = call.data.split("_")[1]

    keyboard = InlineKeyboardMarkup().add(
        InlineKeyboardButton(
            text="Смена картинки",
            callback_data=f"change_photo_{channel_tg_id}"
        )
    )

    await call.message.answer(f"Вы выбрали канал {channel_tg_id}.", reply_markup=keyboard)
    await call.answer()


# Функция для скачивания аватарки канала
async def download_channel_photo(bot: Bot, channel_tg_id: str):
    try:
        chat = await bot.get_chat(channel_tg_id)
        if chat.photo:
            file = await bot.get_file(chat.photo.big_file_id)
            file_path = file.file_path

            # Создаем директорию, если её нет
            save_directory = 'static'
            os.makedirs(save_directory, exist_ok=True)

            save_path = os.path.join(save_directory, f'channel_{channel_tg_id}.png')

            # Удаляем старый файл, если он существует
            if os.path.exists(save_path):
                os.remove(save_path)

            # Скачиваем новый файл
            await bot.download_file(file_path, save_path)

            return save_path  # Возвращаем путь к сохранённому файлу
        else:
            return None
    except Exception as e:
        logging.error(f"Ошибка скачивания фото канала {channel_tg_id}: {e}")
        return None


# Хендлер: Обрабатывает нажатие на "Смена картинки"
@dp.callback_query_handler(lambda call: call.data.startswith("change_photo_"))
async def change_channel_photo(call: types.CallbackQuery):
    channel_tg_id = call.data.split("_")[2]

    # Скачиваем аватарку канала
    photo_path = await download_channel_photo(call.bot, channel_tg_id)

    if photo_path:
        await call.message.answer_photo(
            photo=InputFile(photo_path),
            caption="Фото канала обновлено и сохранено!"
        )
    else:
        await call.message.answer("Не удалось скачать фото канала.")

    await call.answer()

@dp.callback_query_handler(lambda query: query.data.startswith("order_"))
async def process_order_callback(callback_query: types.CallbackQuery, state: FSMContext):
    order_id = int(callback_query.data.split('_')[1])
    user_id = callback_query.from_user.id

    try:
        async with db_pool.acquire() as connection:
            result = await connection.fetchrow(
                """SELECT p.user_id
                   FROM Products p
                   JOIN OrderItems oi ON oi.product_id = p.product_id
                   JOIN Orders o ON o.order_id = oi.order_id
                   WHERE o.order_id = $1""", order_id
            )

            if result:
                target_user_id = result['user_id']

                await callback_query.message.answer(
                    "Ваше рекламное предложение будет отправлено продавцу для утверждения. "
                    "Отправьте сообщение для пересылки."
                )

                await state.update_data(target_user_id=target_user_id, order_id=order_id)

                await OrderState.waiting_for_advertisement.set()
            else:
                await callback_query.message.answer("Заказ с таким ID не найден.")
    except Exception as e:
        logging.error(f"Ошибка при получении user_id: {e}")
        await callback_query.message.answer("Произошла ошибка при обработке заказа.")

@dp.message_handler(state=OrderState.waiting_for_advertisement, content_types=types.ContentType.ANY)
async def forward_message(message: types.Message, state: FSMContext):
    data = await state.get_data()
    target_user_id = data.get('target_user_id')
    order_id = data.get('order_id')

    if target_user_id and order_id:
        try:

            async with db_pool.acquire() as connection:
                await connection.execute(
                     """
                    UPDATE orderitems 
                    SET message_id = $1, chat_id = $2 
                    WHERE order_id = $3
                    """,
                    message.message_id,
                    message.chat.id,
                    order_id
                )

                order_info = await connection.fetch(
                    """SELECT oi.order_id, oi.post_time, oi.message_id, p.product_id, p.user_id, vc.channel_name, vc.channel_url, 
                              (oi.quantity * oi.price) AS total_price
                       FROM orderitems oi
                       JOIN products p ON oi.product_id = p.product_id
                       JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                       WHERE oi.order_id = $1""", order_id
                )

            if order_info:
                channel_name = order_info[0]['channel_name']
                channel_url = order_info[0]['channel_url']
                post_times = [record['post_time'] for record in order_info]  
                post_times_str = ", ".join([record['post_time'].strftime("%d-%m-%Y %H:%M") for record in order_info])
                total_prices = sum(record['total_price'] for record in order_info)
                formatted_total_price = f"{total_prices:,.0f}".replace(",", " ")

                async with db_pool.acquire() as connection:
                    existing_orders = await connection.fetch(
                        """
                        SELECT o.order_id 
                        FROM orders AS o
                        JOIN orderitems oi ON o.order_id = oi.order_id
                        WHERE oi.product_id = $1
                        AND oi.post_time = ANY($2)
                        AND o.status IN ('pending_payment', 'paid', 'complited', 'problem');;
                        """,
                        order_info[0]['product_id'],
                        post_times
                    )

                if len(existing_orders) > 1:
                    async with db_pool.acquire() as connection:
                        await connection.execute(
                            "UPDATE Orders SET status = 'problem' WHERE order_id = $1", order_id
                        )
                    await bot.send_message(
                        chat_id=message.from_user.id,
                        text="На одну из выбранных дат уже купили рекламу."
                    )
                    return

                keyboard = InlineKeyboardMarkup(row_width=2)
                keyboard.add(
                    InlineKeyboardButton("Разместить", callback_data=f"accept_{order_id}"),
                    InlineKeyboardButton("Отклонить", callback_data=f"decline_{order_id}")
                )
                try:
                    await bot.forward_message(chat_id=order_info[0]['user_id'], from_chat_id=message.from_user.id, message_id=order_info[0]['message_id'])

                    await bot.send_message(
                    chat_id=target_user_id,
                    text=(
                        f"Пользователь @{message.from_user.username} хочет купить у вас рекламу \n"
                        f"в канале <a href='{channel_url}'>{channel_name}</a> \n"
                        f"на даты: {post_times_str}. \n"
                        f"По общей цене {nano_ton_to_ton(formatted_total_price)} ton."
                    ),
                    parse_mode="HTML",
                    reply_markup=keyboard
                    )   

                    await bot.send_message(
                    chat_id=message.from_user.id,
                    text="Ваше сообщение было успешно отправлено продавцу. Ожидайте его ответа."
                    )

                    async with db_pool.acquire() as connection:
                        await connection.execute(
                        "UPDATE Orders SET status = 'waiting' WHERE order_id = $1", order_id
                        )

                        await state.finish()

                except Exception as e:
                    logging.error(f"Ошибка при пересылке сообщения: {e}")
                    await message.reply("Не удалось переслать сообщение. Попробуйте ещё раз или свяжитесь с поддержкой.")
            else:
                await message.reply("Не удалось найти информацию о заказе.")
        except Exception as e:
            logging.error(f"Ошибка при пересылке сообщения: {e}")
            await message.reply(f"Ошибка при пересылке: {e}")
    else:
        await message.reply("Не удалось получить данные для пересылки сообщения.")



@dp.callback_query_handler(lambda c: c.data and c.data.startswith('accept_'))
async def accept_ad(callback_query: CallbackQuery):
    order_id = int(callback_query.data.split('_')[1])

    try:
        async with db_pool.acquire() as connection:
            order_status = await connection.fetchval(
                "SELECT status FROM Orders WHERE order_id = $1", order_id
            )

            if order_status != "waiting":
                await bot.answer_callback_query(callback_query.id)
                await bot.send_message(
                    chat_id=callback_query.from_user.id,
                    text=f"Заказ с ID {order_id} не может быть принят, так как его статус: {order_status}."
                )
                return
                
            await connection.execute(
                "UPDATE Orders SET status = 'pending_payment' WHERE order_id = $1", order_id
            )

            order_info = await connection.fetchrow(
                """SELECT oi.order_id, vc.channel_name, vc.channel_url, o.user_id
                   FROM orderitems oi
                   JOIN products p ON oi.product_id = p.product_id
                   JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                   JOIN orders o ON oi.order_id = o.order_id
                   WHERE oi.order_id = $1""", order_id
            )

        if order_info:
            channel_name = order_info['channel_name']
            channel_url = order_info['channel_url']
            buyer_user_id = order_info['user_id']

            await bot.answer_callback_query(callback_query.id)
            await bot.send_message(
                chat_id=callback_query.from_user.id,
                text=f"Вы приняли предложение. Заказ с ID {order_id} ожидает оплаты."
            )

            pay_button = InlineKeyboardMarkup().add(
                InlineKeyboardButton("Оплатить", web_app=WebAppInfo(url=f"https://tma.internal/buy/{order_id}"))
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
    order_id = int(callback_query.data.split('_')[1])

    try:
        async with db_pool.acquire() as connection:
            await connection.execute(
                "UPDATE Orders SET status = 'rejected' WHERE order_id = $1", order_id
            )

            buyer_user_id = await connection.fetchval(
                "SELECT user_id FROM orders WHERE order_id = $1", order_id
            )

            await bot.answer_callback_query(callback_query.id)
            await bot.send_message(
                chat_id=callback_query.from_user.id,
                text=f"Вы отклонили предложение. Статус заказа с ID {order_id} обновлен на 'Отменено'."
            )

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

# @dp.message_handler(lambda message: message.text)
# async def forward_specified_message(message: types.Message, state: FSMContext):
#     data = await state.get_data()
#     specific_message_id = data.get('message_id')
#     user_id = message.from_user.id

#     if specific_message_id:
#         try:
#             await bot.forward_message(chat_id=user_id, from_chat_id=user_id, message_id=specific_message_id)
#         except Exception as e:
#             logging.error(f"Ошибка при пересылке сообщения: {e}")
#             await message.answer("Произошла ошибка при пересылке сообщения.")
#     else:
#         await message.answer("Не удалось найти сохраненный message_id.")

class OrderRequest(BaseModel):
    user_id: int
    order_id: int

@app.post('/order')
async def handle_order(order: OrderRequest):
    user_id = order.user_id
    order_id = order.order_id

    try:
        async with db_pool.acquire() as connection:
            result = await connection.fetchrow(
                """SELECT p.user_id
                   FROM Products p
                   JOIN OrderItems oi ON oi.product_id = p.product_id
                   JOIN Orders o ON o.order_id = oi.order_id
                   WHERE o.order_id = $1""", order_id
            )

        if result:
            target_user_id = result['user_id']

            # Отправляем сообщение пользователю
            await bot.send_message(
                user_id,
                "✅ Ваше рекламное предложение будет отправлено продавцу для утверждения. "
                "Отправьте сообщение для пересылки."
            )

            # Используем FSMContext через dispatcher, а не напрямую в FastAPI
            state = dp.current_state(user=user_id)
            await state.update_data(target_user_id=target_user_id, order_id=order_id)
            await state.set_state(OrderState.waiting_for_advertisement)

        else:
            await bot.send_message(user_id, "❌ Заказ с таким ID не найден.")
            return {"status": "error", "message": "Order not found"}

        return {"status": "success", "message": "Message sent and data saved"}

    except Exception as e:
        logging.error(f"❌ Ошибка при обработке запроса: {e}")
        raise HTTPException(status_code=500, detail=f"Произошла ошибка: {str(e)}")

class BuyRequest(BaseModel):
    user_id: int
    order_id: Union[int, None] = None
    message_id: Union[int, None] = None
    format: str
    post_time: Union[List[str], str]
    channel_name: str
    channel_url: str

@app.post('/buy')
async def handle_buy(data: BuyRequest):
    try:
        # Форматируем время публикации
        if isinstance(data.post_time, list):
            formatted_post_times = "\n".join([f"• {time}" for time in data.post_time])
        else:
            formatted_post_times = data.post_time

        # Создаем текст сообщения
        text_message = (
            f"🎉 Ваша реклама была куплена!\n\n"
            f"🕒 Время публикации:\n{formatted_post_times}\n"
            f"🕒 Формат:\n{data.format}\n"
            f"📢 Канал: {data.channel_name}\n"
            f"🔗 Ссылка на канал: {data.channel_url}\n"
        )

        # Отправляем сообщение пользователю
        await bot.send_message(data.user_id, text_message, parse_mode=ParseMode.MARKDOWN)

        # Обновляем состояние пользователя, если требуется
        if data.message_id:
            state = dp.current_state(user=data.user_id)
            await state.update_data(message_id=data.message_id)

        # Возвращаем успешный ответ
        return {"status": "success", "message": "Message sent to seller", "message_id": data.message_id}

    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        raise HTTPException(status_code=500, detail=f"Произошла ошибка: {str(e)}")

async def send_survey():
    async with db_pool.acquire() as connection:
        now = datetime.now()
        last_day = now - timedelta(days=1)
        print("Отправка запроса на подтверждение выполнения условий сделки:", now)

        results_now = await connection.fetch(
            """SELECT oi.order_id, oi.post_time, oi.product_id, p.user_id AS seller_id, 
                      o.user_id AS buyer_id, vc.channel_name, vc.channel_url
               FROM orderitems oi
               JOIN orders o ON oi.order_id = o.order_id
               JOIN products p ON oi.product_id = p.product_id
               JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
               WHERE DATE_TRUNC('minute', oi.post_time::timestamp) = DATE_TRUNC('minute', $1::timestamp)
                 AND o.status = 'completed'""", last_day
        )

        for record in results_now:
            seller_message = (
                f"📊 <b>Вы опубликовали рекламное объявление?</b>\n\n"
                f"📢 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                f"🕒 <b>Время публикации:</b> {record['post_time']}\n\n"
                f"Выполнили ли вы свои условия?"
            )

            seller_keyboard = InlineKeyboardMarkup(row_width=2)
            seller_keyboard.add(
                InlineKeyboardButton("✅Выполнил", callback_data=f"completed_seller_{record['order_id']}"),
                InlineKeyboardButton("❌Не выполнил", callback_data=f"not_completed_seller_{record['order_id']}")
            )

            await bot.send_message(
                chat_id=record['seller_id'],
                text=seller_message,
                reply_markup=seller_keyboard,
                parse_mode="HTML"
            )

            buyer_message = (
                f"📢 <b>Продавец опубликовал рекламу?</b>\n\n"
                f"📊 <b>Канал:</b> <a href='{record['channel_url']}'>{record['channel_name']}</a>\n"
                f"🕒 <b>Время публикации:</b> {record['post_time']}\n\n"
                f"Выполнил ли продавец свои условия?"
            )

            buyer_keyboard = InlineKeyboardMarkup(row_width=2)
            buyer_keyboard.add(
                InlineKeyboardButton("✅Выполнил", callback_data=f"completed_buyer_{record['order_id']}"),
                InlineKeyboardButton("❌Не выполнил", callback_data=f"not_completed_buyer_{record['order_id']}")
            )

            await bot.send_message(
                chat_id=record['buyer_id'],
                text=buyer_message,
                reply_markup=buyer_keyboard,
                parse_mode="HTML"
            )

@dp.callback_query_handler(lambda query: query.data.startswith('completed_seller_'))
async def process_completion_seller(callback_query: types.CallbackQuery):
    order_id = callback_query.data.split('_')[2]
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
    pass

class ConfirmationRequest(BaseModel):
    user_id: int
    order_id: Union[int, None] = None
    price: int
    channel_name: str

@app.post('/confirmation')
async def handle_buy(data: ConfirmationRequest):
    print(data)
    try:
        # Создаем текст сообщения
        text_message = (
            f"✅ *Заказ успешно подтверждён!*\n\n"
            f"💰 *Цена:* `{nano_ton_to_ton(data.price)} Ton`\n"
            f"📢 *Канал:* `{data.channel_name}`\n"
            f"💳 *Ваш баланс пополнен! 🎉*\n"
        )
        # Отправляем сообщение пользователю
        await bot.send_message(data.user_id, text_message, parse_mode=ParseMode.MARKDOWN)

        # Возвращаем успешный ответ
        return {"status": "success", "message": "Message sent to seller",}

    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        raise HTTPException(status_code=500, detail=f"Произошла ошибка: {str(e)}")

async def start_fastapi():
    config = Config(app=app, host="0.0.0.0", port=5001, log_level="info")
    server = Server(config)
    await server.serve()

async def start_bot():
    # Запускаем бота без использования executor.start_polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    async def main():
        # Инициализация базы данных
        await create_db_pool()

        # Параллельный запуск FastAPI и Aiogram
        await asyncio.gather(
            start_fastapi(),  # Запуск FastAPI
            start_bot()       # Запуск бота
        )

    asyncio.run(main())


