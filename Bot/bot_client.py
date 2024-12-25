from datetime import datetime, timedelta, timezone

from telethon import TelegramClient
from telethon.tl.functions.messages import GetMessagesViewsRequest, GetHistoryRequest
from telethon.tl.functions.channels import GetFullChannelRequest
from telethon.tl.types import InputPeerChannel
from telethon.errors import RPCError

# Вставьте свои данные ниже
api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
phone_number = '+8562057532284'
channel_id = -1002109696428  # Замените на ID вашего канала
message_id = 5  # Замените на ID сообщения

# Создание клиента Telethon
client = TelegramClient('session_name', api_id, api_hash)

async def get_message_views():
    try:

        await client.start(phone_number)

        # Получаем информацию о канале
        entity = await client.get_entity(channel_id)
        peer_channel = InputPeerChannel(entity.id, entity.access_hash)

        # Получаем количество просмотров для сообщения
        result = await client(GetMessagesViewsRequest(
            peer=peer_channel,
            id=[message_id],  # Можно указать несколько ID сообщений
            increment=False  # False, если вы не хотите увеличивать счетчик просмотров
        ))

        # Выводим количество просмотров
        if result.views:
            print(f"Количество просмотров сообщения {message_id}: {result.views[0]}")
        else:
            print(f"Не удалось получить количество просмотров для сообщения {message_id}")

    except RPCError as e:
        print(f"Ошибка при получении данных: {e}")



# async def get_channel_subscribers():
#     try:
#         # Запускаем Telethon-клиента, если он не запущен
#         await client.start(phone_number)
#
#         # Получаем информацию о канале
#         channel = await client.get_entity(channel_id)
#         peer_channel = InputPeerChannel(channel.id, channel.access_hash)
#
#         # Получаем полную информацию о канале
#         full_channel = await client(GetFullChannelRequest(
#             channel=peer_channel
#         ))
#
#         # Выводим количество подписчиков
#         subscribers_count = full_channel.full_chat.participants_count
#         print(f"Количество подписчиков канала: {subscribers_count}")
#
#     except Exception as e:
#         print(f"Ошибка при получении данных: {e}")



async def get_average_views():
    try:
        # Запускаем Telethon-клиента, если он не запущен
        await client.start(phone_number)

        # Получаем информацию о канале
        channel = await client.get_entity(channel_id)
        peer_channel = InputPeerChannel(channel.id, channel.access_hash)

        # Получаем историю сообщений (последние 10 сообщений для фильтрации)
        history = await client(GetHistoryRequest(
            peer=peer_channel,
            offset_id=0,
            offset_date=None,
            add_offset=0,
            limit=10,  # Получаем 10 последних сообщений
            max_id=0,
            min_id=0,
            hash=0
        ))

        # Текущая дата и время с временной зоной UTC
        now = datetime.now(timezone.utc)

        # Фильтруем сообщения, опубликованные более одного дня назад
        one_day_ago = now - timedelta(days=1)
        filtered_messages = [msg for msg in history.messages if msg.date < one_day_ago]

        # Проверяем, есть ли минимум 3 сообщения
        if len(filtered_messages) < 3:
            print("Недостаточно сообщений для анализа.")
            return

        # Берем последние 3 сообщения
        last_three_messages = filtered_messages[:3]

        # Подсчитываем общее количество просмотров
        total_views = sum(msg.views for msg in last_three_messages if msg.views is not None)

        # Считаем среднее количество просмотров
        average_views = total_views / len(last_three_messages)

        print(f"Среднее количество просмотров на последних 3 постах: {average_views}")

    except Exception as e:
        print(f"Ошибка при получении данных: {e}")



# Запускаем клиента и функцию
# with client:
#     client.loop.run_until_complete(get_channel_subscribers())
with client:
    client.loop.run_until_complete(get_message_views())
with client:
    client.loop.run_until_complete(get_average_views())
