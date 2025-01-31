// require('dotenv').config()
const TonWeb = require('tonweb')
const logger = require('../config/logging')
const { log } = require('winston')
const fs = require('fs')

const node_env = fs.readFileSync('/run/secrets/node_env', 'utf8').trim()
const ton_api_key = fs.readFileSync('/run/secrets/ton_api_key', 'utf8').trim()
const market_wallet_address = fs
    .readFileSync('/run/secrets/market_wallet_address', 'utf8')
    .trim()
const market_private_key = fs
    .readFileSync('/run/secrets/market_private_key', 'utf8')
    .trim()
const market_public_key = fs
    .readFileSync('/run/secrets/market_public_key', 'utf8')
    .trim()
const fee_wallet_address = fs
    .readFileSync('/run/secrets/fee_wallet_address', 'utf8')
    .trim()
const fee_wallet_private_key = fs
    .readFileSync('/run/secrets/fee_wallet_private_key', 'utf8')
    .trim()

const isTestnet = node_env === 'test'

const tonweb = new TonWeb(
    new TonWeb.HttpProvider(
        isTestnet
            ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
            : 'https://toncenter.com/api/v2/jsonRPC',
        { apiKey: ton_api_key }
    )
)

const MARKET_WALLET_ADDRESS = market_wallet_address
const MARKET_PUBLIC_KEY = TonWeb.utils.hexToBytes(market_public_key)
const MARKET_PRIVATE_KEY = TonWeb.utils.hexToBytes(market_private_key)

const FEE_WALLET_ADDRESS = fee_wallet_address
const TRANSACTION_FEE_PERCENTAGE = parseFloat(fee_wallet_private_key) / 100

const GAS_LIMIT = TonWeb.utils.toNano('0.1') // Adjust as needed
const STORAGE_FEE = TonWeb.utils.toNano('0.01') // Adjust as needed

// Функция получения транзакций
const getTransactions = async (address, limit, lt, hash, to_lt) => {
    try {
        const params = { address, limit, lt, hash, to_lt, archival: true }
        return await tonweb.provider.send('getTransactions', params)
    } catch (error) {
        console.error('Error fetching transactions:', error.message)
        throw error
    }
}

// Задержка для ожидания
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Функция проверки платежа с ожиданием
const verifyTonPayment = async (
    amount,
    buyerAddress,
    maxRetries = 5,
    delayMs = 5000
) => {
    await delay(delayMs)
    try {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`Attempt ${attempt}/${maxRetries}: Checking payment...`)

            // Получаем последние транзакции покупателя
            const transactions = await getTransactions(buyerAddress, 1)
            if (!transactions.length) {
                console.error('No transactions found')
                await delay(delayMs)
                continue
            }

            // Берем последнюю транзакцию
            const lastTransaction = transactions[0]

            // Проверяем сумму и адрес
            const isAmountMatch =
                parseFloat(lastTransaction.out_msgs[0]?.value) === amount
            const isBuyerMatch =
                lastTransaction.out_msgs[0]?.destination ===
                process.env.MARKET_WALLET_ADDRESS

            // console.log('value: ', isAmountMatch)
            // console.log('destination: ', isBuyerMatch)

            if (isAmountMatch && isBuyerMatch) {
                // Дополнительный запрос на ваш адрес для проверки получения денег
                const { created_lt, body_hash } = lastTransaction.out_msgs[0]
                // console.log(body_hash)
                // console.log(created_lt)

                const walletTransactions = await getTransactions(
                    process.env.MARKET_WALLET_ADDRESS,
                    created_lt
                )

                if (walletTransactions.length > 0) {
                    return {
                        valid: true,
                        transactionHash:
                            walletTransactions[0].transaction_id.hash,
                    }
                    // return {
                    //     success: true,
                    //     created_lt: walletTransactions[0].transaction_id.lt,
                    //     body_hash: walletTransactions[0].transaction_id.hash,
                    // }
                } else {
                    console.error('Payment not found on our wallet.')
                    return false
                }
            } else {
                console.error(
                    'Payment verification failed. Amount or address mismatch.'
                )
                return false
            }

            console.log('Payment not found, retrying...')
            await delay(delayMs)
        }

        console.error('Payment verification failed after maximum retries.')
        return false
    } catch (error) {
        console.error('Error during payment verification:', error.message)
        throw error
    }
}

// async function verifyTonPayment(amount, transactionHash) {
//     try {
//         const transactions = await tonweb.provider.getTransactions(
//             MARKET_WALLET_ADDRESS,
//             { limit: 10 }
//         )

//         if (!transactions || transactions.length === 0) {
//             logger.warn(`Транзакция не найдена: ${transactionHash}`)
//             return { valid: false, error: 'TRANSACTION_NOT_FOUND' }
//         }

//         const transaction = transactions.find(
//             (tx) => tx.hash === transactionHash
//         )

//         if (!transaction) {
//             logger.warn(`Транзакция с хешем ${transactionHash} не найдена.`)
//             return { valid: false, error: 'TRANSACTION_NOT_FOUND' }
//         }

//         logger.info(`Объект транзакции: ${JSON.stringify(transaction)}`)

//         if (!transaction.in_msg || !transaction.in_msg.value) {
//             logger.warn(
//                 `Транзакция не содержит входящего сообщения или значения: ${transactionHash}`
//             )
//             return { valid: false, error: 'INVALID_TRANSACTION_DATA' }
//         }

//         const receivedAmount = TonWeb.utils.fromNano(transaction.in_msg.value)
//         const expectedAmount = parseFloat(amount)

//         logger.info(
//             `Полученная сумма: ${receivedAmount}, Ожидаемая сумма: ${expectedAmount}`
//         )

//         const tolerance = 0.01
//         if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
//             logger.warn(
//                 `Несоответствие суммы. Ожидалось: ${expectedAmount}, Получено: ${receivedAmount}`
//             )
//             return { valid: false, error: 'AMOUNT_MISMATCH' }
//         }

//         const confirmations = transaction.utime
//         const requiredConfirmations = isTestnet ? 1 : 3
//         if (confirmations < requiredConfirmations) {
//             return { valid: false, error: 'INSUFFICIENT_CONFIRMATIONS' }
//         }

//         return { valid: true }
//     } catch (error) {
//         logger.error(`Ошибка при проверке платежа TON: ${error.message}`)
//         return {
//             valid: false,
//             error: 'VERIFICATION_ERROR',
//             details: error.message,
//         }
//     }
// }

async function getSeqno(wallet) {
    let retries = 3
    while (retries > 0) {
        try {
            const seqno = await wallet.methods.seqno().call()
            if (seqno === null || seqno === undefined) {
                throw new Error('Seqno равен null или undefined')
            }
            return seqno
        } catch (error) {
            logger.warn(
                `Не удалось получить seqno. Осталось попыток: ${retries - 1}`
            )
            retries--
            if (retries === 0) {
                throw error
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
    }
}

async function estimateGasFees(wallet, toAddress, amount) {
    try {
        const transfer = wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: TonWeb.utils.toNano(amount),
            seqno: await wallet.methods.seqno().call(),
            sendMode: 3,
        })
        const estimatedFees = await transfer.estimateFee()
        return TonWeb.utils.fromNano(estimatedFees.total_account_fees)
    } catch (error) {
        logger.error(`Ошибка при оценке комиссии за газ: ${error.message}`)
        throw error
    }
}

async function sendTon(fromAddress, toAddress, amount) {
    try {
        const WalletClass = tonweb.wallet.all['v3R2']

        const wallet = new WalletClass(tonweb.provider, {
            publicKey: MARKET_PUBLIC_KEY,
            wc: 0,
        })

        const walletAddress = await wallet.getAddress()
        console.log('Wallet Address:', walletAddress.toString(true, true, true))
        if (walletAddress.toString(true, true, true) !== fromAddress) {
            throw new Error('Invalid fromAddress')
        }

        const seqno = await wallet.methods.seqno().call()
        logger.info(`Получен seqno: ${seqno}`)

        const gasFees = await estimateGasFees(wallet, toAddress, amount)
        const amountNano = TonWeb.utils.toNano(amount.toString())
        const totalAmount = new TonWeb.utils.BN(amountNano).sub(
            new TonWeb.utils.BN(TonWeb.utils.toNano(gasFees))
        )

        const transfer = wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: totalAmount,
            seqno: seqno,
            sendMode: 3,
        })

        const result = await transfer.send()
        return {
            success: true,
            transactionHash: result.transaction_id.hash,
        }
    } catch (error) {
        logger.error(`Ошибка при отправке TON: ${error.message}`)
        return {
            success: false,
            error: 'TRANSFER_ERROR',
            details: error.message,
        }
    }
}

async function getWalletBalance(address = MARKET_WALLET_ADDRESS) {
    try {
        const balance = await tonweb.getBalance(address)
        return { success: true, balance: TonWeb.utils.fromNano(balance) }
    } catch (error) {
        logger.error(`Ошибка при получении баланса кошелька: ${error.message}`)
        return {
            success: false,
            error: 'BALANCE_CHECK_ERROR',
            details: error.message,
        }
    }
}

module.exports = {
    verifyTonPayment,
    sendTon,
    getWalletBalance,
    isTestnet,
}
