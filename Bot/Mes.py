import asyncio
import logging
import os
from datetime import datetime, timedelta, timezone
from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import InputPeerChannel, PeerChannel
import asyncpg

# Вставьте свои данные для Telethon
api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
phone_number = '+8562057532284'

# Создание клиента Telethon
client = TelegramClient('session_name', api_id, api_hash)

# Глобальный пул для базы данных
db_pool = None


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


async def get_average_views(channel_id, message_limit=10):
    try:
        # Получаем InputPeer для канала, если он существует
        peer_channel = await client.get_input_entity(PeerChannel(channel_id))

        # Получаем историю сообщений
        history = await client(GetHistoryRequest(
            peer=peer_channel,
            offset_id=0,
            offset_date=None,
            add_offset=0,
            limit=message_limit,
            max_id=0,
            min_id=0,
            hash=0
        ))

        # Текущая дата и время
        now = datetime.now(timezone.utc)

        # Фильтруем сообщения старше одного дня
        one_day_ago = now - timedelta(days=1)
        filtered_messages = [msg for msg in history.messages if msg.date < one_day_ago]

        # Проверяем, есть ли минимум 3 сообщения
        if len(filtered_messages) < 3:
            print(f"Недостаточно сообщений для анализа в канале {channel_id}.")
            return None

        # Берем последние 3 сообщения
        last_three_messages = filtered_messages[:3]

        # Подсчитываем общее количество просмотров
        total_views = sum(msg.views for msg in last_three_messages if msg.views is not None)

        # Считаем среднее количество просмотров
        average_views = total_views / len(last_three_messages)

        return average_views

    except ValueError as e:
        print(f"Ошибка при получении данных для канала {channel_id}: {e}")
        return None



async def update_channel_views():
    async with db_pool.acquire() as connection:
        # Получаем список каналов из базы данных
        rows = await connection.fetch("SELECT channel_tg_id FROM verifiedchannels")

        for row in rows:
            channel_id = row['channel_tg_id']

            # Получаем среднее количество просмотров
            average_views = await get_average_views(channel_id)

            if average_views is not None:
                # Обновляем записи в базе данных
                await connection.execute("""
                    UPDATE verifiedchannels 
                    SET views = $1
                    WHERE channel_tg_id = $2
                """, average_views, channel_id)




async def daily_update():
    while True:
        await update_channel_views()
        await asyncio.sleep(86400)  # Ожидаем 24 часа перед следующим запуском


async def main():
    await create_db_pool()  # Инициализация пула базы данных
    await client.start(phone_number)  # Запуск клиента Telethon

    # Параллельно запускаем обновление просмотров и проверку заказов
    await asyncio.gather(
        daily_update(),  # Обновление просмотров каждый день
    )


if __name__ == '__main__':
    # Запуск основного event loop для Telethon и базы данных
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
