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

async function verifyTonPayment(amount, transactionHash) {
    try {
        const transactions = await tonweb.getTransactions(transactionHash)

        if (!transactions || transactions.length === 0) {
            logger.warn(`Transaction not found: ${transactionHash}`)
            return { valid: false, error: 'TRANSACTION_NOT_FOUND' }
        }

        const transaction = transactions[0]

        logger.info(`Transaction object: ${JSON.stringify(transaction)}`)

        if (!transaction.in_msg || !transaction.in_msg.value) {
            logger.warn(
                `Transaction does not contain incoming message or value: ${transactionHash}`
            )
            return { valid: false, error: 'INVALID_TRANSACTION_DATA' }
        }

        const receivedAmount = TonWeb.utils.fromNano(transaction.in_msg.value)
        const expectedAmount = parseFloat(amount)

        logger.info(
            `Received amount: ${receivedAmount}, Expected amount: ${expectedAmount}`
        )

        if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
            logger.warn(
                `Amount mismatch. Expected: ${expectedAmount}, Got: ${receivedAmount}`
            )
            return { valid: false, error: 'AMOUNT_MISMATCH' }
        }

        const confirmations = await tonweb.getTransactionConfirmations(
            transactionHash
        )
        if (confirmations < (isTestnet ? 1 : 3)) {
            return { valid: false, error: 'INSUFFICIENT_CONFIRMATIONS' }
        }

        return { valid: true }
    } catch (error) {
        logger.error(`Error verifying TON payment: ${error.message}`)
        return {
            valid: false,
            error: 'VERIFICATION_ERROR',
            details: error.message,
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
            throw new Error('Wallet address mismatch')
        }

        const seqno = await wallet.methods.seqno().call()

        const transfer = wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: TonWeb.utils.toNano(amount),
            seqno: seqno,
            payload: '',
            sendMode: 3,
        })

        const sendResult = await transfer.send()

        logger.info(
            `TON transfer initiated: ${amount} TON from ${fromAddress} to ${toAddress}`
        )
        return { success: true, transactionHash: sendResult.hash }
    } catch (error) {
        logger.error(`Error sending TON: ${error.message}`)
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
        logger.error(`Error getting wallet balance: ${error.message}`)
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

module.exports = {
    verifyTonPayment,
    sendTon,
    getWalletBalance,
    sendFee,
    isTestnet,
}
