require('dotenv').config()
const TonWeb = require('tonweb')
const logger = require('../config/logging')

const isTestnet = process.env.NODE_ENV === 'test'

const tonweb = new TonWeb(
    new TonWeb.HttpProvider(
        isTestnet
            ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
            : 'https://toncenter.com/api/v2/jsonRPC',
        { apiKey: process.env.TON_API_KEY }
    )
)

const MARKET_WALLET_ADDRESS = process.env.MARKET_WALLET_ADDRESS
const MARKET_PRIVATE_KEY = Buffer.from(process.env.MARKET_PRIVATE_KEY, 'hex')
const MARKET_PUBLIC_KEY = Buffer.from(process.env.MARKET_PUBLIC_KEY, 'hex')

const FEE_WALLET_ADDRESS = process.env.FEE_WALLET_ADDRESS
const TRANSACTION_FEE_PERCENTAGE =
    parseFloat(process.env.TRANSACTION_FEE_PERCENTAGE) / 100

const GAS_LIMIT = TonWeb.utils.toNano('0.1')
const STORAGE_FEE = TonWeb.utils.toNano('0.01')

async function verifyTonPayment(amount, transactionHash) {
    try {
        const transactions = await tonweb.getTransactions(transactionHash)

        if (!transactions || transactions.length === 0) {
            logger.warn(`Транзакция не найдена: ${transactionHash}`)
            return { valid: false, error: 'TRANSACTION_NOT_FOUND' }
        }

        const transaction = transactions[0]

        logger.info(`Объект транзакции: ${JSON.stringify(transaction)}`)

        if (!transaction.in_msg || !transaction.in_msg.value) {
            logger.warn(
                `Транзакция не содержит входящего сообщения или значения: ${transactionHash}`
            )
            return { valid: false, error: 'INVALID_TRANSACTION_DATA' }
        }

        const receivedAmount = TonWeb.utils.fromNano(transaction.in_msg.value)
        const expectedAmount = parseFloat(amount)

        logger.info(
            `Полученная сумма: ${receivedAmount}, Ожидаемая сумма: ${expectedAmount}`
        )

        const tolerance = 0.01
        if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
            logger.warn(
                `Несоответствие суммы. Ожидалось: ${expectedAmount}, Получено: ${receivedAmount}`
            )
            return { valid: false, error: 'AMOUNT_MISMATCH' }
        }

        const confirmations = await tonweb.getTransactions(transactionHash)
        if (confirmations.length < (isTestnet ? 1 : 3)) {
            return { valid: false, error: 'INSUFFICIENT_CONFIRMATIONS' }
        }

        return { valid: true }
    } catch (error) {
        logger.error(`Ошибка при проверке платежа TON: ${error.message}`)
        return {
            valid: false,
            error: 'VERIFICATION_ERROR',
            details: error.message,
        }
    }
}

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

async function sendTon(fromAddress, toAddress, amount) {
    try {
        const WalletClass = tonweb.wallet.all['v3R1']
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: MARKET_PUBLIC_KEY,
            wc: 0,
        })

        const walletAddress = await wallet.getAddress()
        if (walletAddress.toString(true, true, true) !== fromAddress) {
            throw new Error(
                `Несоответствие адреса кошелька: ожидалось ${fromAddress}, получено ${walletAddress.toString(
                    true,
                    true,
                    true
                )}`
            )
        }

        const seqno = await getSeqno(wallet)
        logger.info(`Получен seqno: ${seqno}`)

        const amountNano = TonWeb.utils.toNano(amount)
        const fees = TonWeb.utils.toNano('0.05')
        const totalAmount = new TonWeb.utils.BN(amountNano).add(
            new TonWeb.utils.BN(fees)
        )

        const balance = await tonweb.getBalance(fromAddress)
        if (new TonWeb.utils.BN(balance).lt(totalAmount)) {
            throw new Error(
                `Недостаточный баланс. Требуется: ${TonWeb.utils.fromNano(
                    totalAmount
                )} TON, Доступно: ${TonWeb.utils.fromNano(balance)} TON`
            )
        }

        const transfer = wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: amountNano,
            seqno: seqno,
            payload: '',
            sendMode: 3,
            stateInit: null,
            gasLimit: GAS_LIMIT,
            storageFee: STORAGE_FEE,
        })

        const sendResult = await transfer.send()
        if (!sendResult || !sendResult.hash) {
            throw new Error('Отправка перевода не удалась, хеш не получен')
        }

        logger.info(
            `Перевод TON инициирован: ${amount} TON с ${fromAddress} на ${toAddress}: хеш транзакции: ${sendResult.hash}`
        )
        return { success: true, transactionHash: sendResult.hash }
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

async function sendFee(amount) {
    return sendTon(MARKET_WALLET_ADDRESS, FEE_WALLET_ADDRESS, amount)
}

async function estimateTransactionFees(fromAddress, toAddress, amount) {
    try {
        const WalletClass = tonweb.wallet.all['v3R1']
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: MARKET_PUBLIC_KEY,
            wc: 0,
        })

        const seqno = await getSeqno(wallet)
        const amountNano = TonWeb.utils.toNano(amount)

        const transfer = wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: amountNano,
            seqno: seqno,
            payload: '',
            sendMode: 3,
            stateInit: null,
            gasLimit: GAS_LIMIT,
            storageFee: STORAGE_FEE,
        })

        const estimatedFees = await transfer.estimateFee()
        return {
            success: true,
            fees: TonWeb.utils.fromNano(estimatedFees.total_account_fees),
        }
    } catch (error) {
        logger.error(
            `Ошибка при оценке комиссии за транзакцию: ${error.message}`
        )
        return {
            success: false,
            error: 'FEE_ESTIMATION_ERROR',
            details: error.message,
        }
    }
}

module.exports = {
    verifyTonPayment,
    sendTon,
    getWalletBalance,
    sendFee,
    estimateTransactionFees,
    isTestnet,
}
