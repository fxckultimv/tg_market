const TonWeb = require('tonweb');
const logger = require('../config/logging');

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

const MARKET_PRIVATE_KEY = process.env.MARKET_PRIVATE_KEY;

async function verifyTonPayment(amount, transactionHash) {
    try {
        const transactions = await tonweb.getTransactions(transactionHash);
        
        if (!transactions || transactions.length === 0) {
            logger.warn(`Transaction not found: ${transactionHash}`);
            return false;
        }

        const transaction = transactions[0];

        logger.info(`Transaction object: ${JSON.stringify(transaction)}`);

        if (!transaction.in_msg || !transaction.in_msg.value) {
            logger.warn(`Transaction does not contain incoming message or value: ${transactionHash}`);
            return false;
        }

        const receivedAmount = TonWeb.utils.fromNano(transaction.in_msg.value);
        const expectedAmount = parseFloat(amount);

        logger.info(`Received amount: ${receivedAmount}, Expected amount: ${expectedAmount}`);

        if (Math.abs(receivedAmount - expectedAmount) > 0.01) {
            logger.warn(`Amount mismatch. Expected: ${expectedAmount}, Got: ${receivedAmount}`);
            return false;
        }

        return true;
    } catch (error) {
        logger.error(`Error verifying TON payment: ${error.message}`);
        return false;
    }
}

async function sendTon(fromAddress, toAddress, amount) {
    try {
        const wallet = new tonweb.wallet.create({
            address: fromAddress,
            publicKey: MARKET_PRIVATE_KEY
        });

        const seqno = await wallet.methods.seqno().call();
        
        await wallet.methods.transfer({
            secretKey: MARKET_PRIVATE_KEY,
            toAddress: toAddress,
            amount: TonWeb.utils.toNano(amount),
            seqno: seqno,
            payload: '',
            sendMode: 3,
        }).send();

        return true;
    } catch (error) {
        logger.error(`Error sending TON: ${error.message}`);
        return false;
    }
}

module.exports = {
    verifyTonPayment,
    sendTon
};