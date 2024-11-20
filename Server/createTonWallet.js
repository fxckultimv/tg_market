const TonWeb = require('tonweb')

// Создайте новый экземпляр TonWeb
const tonweb = new TonWeb()

// Сгенерируйте новые ключи
const keyPair = TonWeb.utils.newKeyPair()

// Вывод ключей
console.log('Public Key:', TonWeb.utils.bytesToHex(keyPair.publicKey))
console.log('Private Key:', TonWeb.utils.bytesToHex(keyPair.secretKey))

// Создайте адрес кошелька
const wallet = tonweb.wallet.create({
    publicKey: keyPair.publicKey,
    wc: 0, // Workchain ID
})

wallet.getAddress().then((address) => {
    console.log('Wallet Address:', address.toString(true, true, true))
})
