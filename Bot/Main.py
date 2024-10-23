import logging
import os
import threading
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import StatesGroup, State
from aiogram.types import (
    ChatType, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery,
    KeyboardButton, ReplyKeyboardMarkup, ParseMode, ContentType, WebAppInfo
)
from aiogram.utils import executor
import asyncpg
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
import asyncio

API_TOKEN = '7741416101:AAERfPXfyjwvIQbIHqZQc5iKFHdHaRk4WWE'

logging.basicConfig(level=logging.INFO)

storage = MemoryStorage()
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot, storage=storage)

db_pool = None

app = Flask(__name__)

api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
phone_number = '+8562057532284'

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
            min_size=1,
            max_size=10
        )
        logging.info("Подключение к базе данных успешно создано")
    except Exception as e:
        logging.error(f"Ошибка подключения к базе данных: {e}")

@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = message.from_user.id

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

                save_path = f'static/user_{user_uuid}.png'

                if not os.path.exists('static'):
                    os.makedirs('static')

                await bot.download_file(file_path, save_path)

        else:
            await message.answer("Вы не зарегистрированы в системе.")

    button_orders = KeyboardButton('Мои заказы')
    button_ads = KeyboardButton('Мои рекламы')
    button_verified = KeyboardButton('Добавить канал')
    button_my_channels = KeyboardButton('Мои каналы')
    button_support = KeyboardButton('Поддержка')

    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(button_orders, button_ads, button_verified, button_my_channels, button_support)

    await message.answer("Добро пожаловать! Выберите нужный пункт меню:", reply_markup=keyboard)

@dp.message_handler(lambda message: message.text == "Мои заказы")
async def my_orders(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            orders = await connection.fetch(
                """SELECT o.order_id, o.total_price, o.status, o.created_at
                   FROM Orders o WHERE o.user_id = $1 AND status = 'pending'
                   ORDER BY o.created_at DESC""", user_id
            )

            if orders:
                response = "Ваши заказы:"
                keyboard = InlineKeyboardMarkup()
                for order in orders:
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

            file_path = "Аватарка отсутствует"
            if chat_info.photo:
                file = await bot.get_file(chat_info.photo.big_file_id)
                file_path = f'static/channel_{my_chat_member.chat.id}.png'
                await bot.download_file(file.file_path, file_path)

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
                    text=(
                        f"Бот был добавлен в канал:\n"
                        f"Название канала: {channel_title}\n"
                        f"ID канала: {channel_id}\n"
                        f"Имя пользователя канала: {channel_username}\n"
                        f"Описание канала: {channel_description}\n"
                        f"Количество подписчиков: {subscribers_count}\n"
                        f"Ваш user_id: {owner_id}\n"
                    )
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

@dp.message_handler(lambda message: message.text == "Мои каналы")
async def my_channels(message: types.Message):
    user_id = message.from_user.id
    try:
        async with db_pool.acquire() as connection:
            channels = await connection.fetch(
                """SELECT channel_name, subscribers_count, channel_url
                   FROM verifiedchannels 
                   WHERE user_id = $1 ORDER BY created_at DESC""", user_id
            )

            if channels:
                response = "<b>Ваши каналы:</b>\n\n"
                for channel in channels:
                    channel_name = channel['channel_name']
                    subscribers_count = channel['subscribers_count']
                    channel_url = channel['channel_url']

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
            await bot.forward_message(chat_id=target_user_id, from_chat_id=message.chat.id, message_id=message.message_id)

            async with db_pool.acquire() as connection:
                await connection.execute(
                    """UPDATE orderitems SET message_id = $1 WHERE order_id = $2""",
                    message.message_id, order_id
                )

                order_info = await connection.fetch(
                    """SELECT oi.order_id, oi.post_time, p.product_id, vc.channel_name, vc.channel_url, 
                              (oi.quantity * oi.price) AS total_price
                       FROM orderitems oi
                       JOIN products p ON oi.product_id = p.product_id
                       JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                       WHERE oi.order_id = $1""", order_id
                )

            if order_info:
                channel_name = order_info[0]['channel_name']
                channel_url = order_info[0]['channel_url']
                post_times = [record['post_time'].strftime("%d-%m-%Y %H:%M") for record in order_info]
                total_prices = sum(record['total_price'] for record in order_info)
                formatted_total_price = f"{total_prices:,.0f}".replace(",", " ")

                post_times_str = ", ".join(post_times)

                keyboard = InlineKeyboardMarkup(row_width=2)
                keyboard.add(
                    InlineKeyboardButton("Разместить", callback_data=f"accept_{order_id}"),
                    InlineKeyboardButton("Отклонить", callback_data=f"decline_{order_id}")
                )

                await bot.send_message(
                    chat_id=target_user_id,
                    text=(
                        f"Пользователь @{message.from_user.username} хочет купить у вас рекламу \n"
                        f"в канале <a href='{channel_url}'>{channel_name}</a> \n"
                        f"на даты: {post_times_str}. \n"
                        f"По общей цене {formatted_total_price} руб."
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
            await connection.execute(
                "UPDATE Orders SET status = 'ожидает оплаты' WHERE order_id = $1", order_id
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
                InlineKeyboardButton("Оплатить", web_app=WebAppInfo(url=f"https://yourwebapp.com/buy/{order_id}"))
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

@app.route('/buy', methods=['POST'])
def handle_buy():
    try:
        data = request.json
        user_id = data.get('user_id')
        order_id = data.get('order_id')
        message_id = data.get('message_id')
        format = data.get('format')
        post_time = data.get('post_time')
        channel_name = data.get('channel_name')
        channel_url = data.get('channel_url')

        if not all([user_id, post_time, channel_name, channel_url]):
            return jsonify({"status": "failure", "message": "Invalid data provided"}), 400

        formatted_post_times = "\n".join([f"• {time}" for time in post_time]) if isinstance(post_time, list) else post_time

        text_message = (
            f"🎉 Ваша реклама была куплена!\n\n"
            f"🕒 Время публикации:\n{formatted_post_times}\n"
            f"🕒 Формат:\n{format}\n"
            f"📢 Канал: {channel_name}\n"
            f"🔗 Ссылка на канал: {channel_url}\n"
        )

        future = asyncio.run_coroutine_threadsafe(bot.send_message(user_id, text_message), asyncio.get_event_loop())
        message = future.result()

        state = dp.current_state(user=user_id)
        asyncio.run_coroutine_threadsafe(state.update_data(message_id=message_id), asyncio.get_event_loop())

        return jsonify({"status": "success", "message": "Message sent to seller", "message_id": message_id}), 200

    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        return jsonify({"status": "failure", "message": str(e)}), 500

@dp.message_handler(lambda message: message.text)
async def forward_specified_message(message: types.Message, state: FSMContext):
    data = await state.get_data()
    specific_message_id = data.get('message_id')
    user_id = message.from_user.id

    if specific_message_id:
        try:
            await bot.forward_message(chat_id=user_id, from_chat_id=user_id, message_id=specific_message_id)
        except Exception as e:
            logging.error(f"Ошибка при пересылке сообщения: {e}")
            await message.answer("Произошла ошибка при пересылке сообщения.")
    else:
        await message.answer("Не удалось найти сохраненный message_id.")

@app.route('/order', methods=['POST'])
async def handle_order():
    try:
        data = request.json
        user_id = data.get('user_id')
        order_id = data.get('order_id')

        if not user_id or not order_id:
            return jsonify({"status": "failure", "message": "Invalid data provided"}), 400

        message_text = (
            f"Вы сделали заказ {order_id}"
        )

        asyncio.run_coroutine_threadsafe(
            bot.send_message(user_id, message_text, parse_mode=ParseMode.MARKDOWN),
            asyncio.get_event_loop()
        )

        return jsonify({"status": "success", "message": "Message sent and data saved"}), 200

    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {e}")
        return jsonify({"status": "failure", "message": str(e)}), 500

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

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(create_db_pool())
    executor.start_polling(dp, skip_updates=True)

