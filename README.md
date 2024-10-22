````markdown
# Инструкция по запуску проекта

## Клонирование репозитория

Для начала необходимо клонировать репозиторий с веткой `dev`:

```bash
git clone -b dev https://github.com/fxckultimv/tg_market.git
```
````

## Добавление базы данных

1. Зайдите в **pgAdmin** и создайте базу данных.
2. Откройте вкладку в созданной БД: `Схемы -> public`.
3. Нажмите правую клавишу мыши и выберите "Восстановить". Затем выберите файл `bd.sql`.

## Запуск Backend

1. Перейдите в директорию с сервером:

```bash
cd tg_market/Server
```

2. Создайте файл `.env` со следующим содержимым:

```bash
PORT=5000
DB_NAME=Название базы данных
DB_USER=postgres
DB_PASSWORD=пароль
DB_HOST=localhost
DB_PORT=5432
BOT_TOKEN=токен бота
```

Токен настроенного бота = '7248552375:AAFU11syb9Xi6ii3TLarCkwUB3tG8fYnquQ'

3. Установите зависимости и запустите сервер:

```bash
pnpm i
pnpm run dev
```

## Запуск Frontend

1. Из корня проекта перейдите в директорию с фронтендом:

```bash
cd Frontend
```

2. Установите зависимости:

```bash
pnpm i
```

3. Установите **mkcert**:

```bash
choco install mkcert
```

4. Выполните команды для установки сертификатов:

```bash
mkcert -install
mkcert -key-file ./tma.internal-key.pem -cert-file ./tma.internal.pem tma.internal
```

5. Запустите фронтенд:

```bash
pnpm run dev
```

## Запуск Bot

1. Из корня проекта перейдите в директорию с ботом:

```bash
cd Bot
```

Создайте виртуальное окружение и активируйте его:

```bash
cd Bot

python -m venv venv

source venv/scripts/activate
```

Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Замените токен бота:

```bash
API_TOKEN = 'Токен бота'
```

Токен настроенного бота = '7248552375:AAFU11syb9Xi6ii3TLarCkwUB3tG8fYnquQ'

3. Запуск бота:

```bash
python main.py
```

Теперь проект готов к использованию!
