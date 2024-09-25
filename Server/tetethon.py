from telethon import TelegramClient
from telethon.tl.functions.messages import GetMessagesViews
from telethon.tl.types import InputPeerChannel
from telethon.errors import RPCError

# Вставьте свои данные ниже
api_id = '24463380'
api_hash = '2d943e94d362db2be40612c00019e381'
channel_id = -1002109696428  # Замените на ID вашего канала
message_id = 14  # Замените на ID сообщения

# Создание клиента Telethon
client = TelegramClient('session_name', api_id, api_hash)

async def get_message_views():
    try:
        # Получаем информацию о канале
        entity = await client.get_entity(channel_id)
        peer_channel = InputPeerChannel(entity.id, entity.access_hash)

        # Получаем количество просмотров для сообщения
        result = await client(GetMessagesViews(
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

# Запускаем клиента и функцию
with client:
    client.loop.run_until_complete(get_message_views())
