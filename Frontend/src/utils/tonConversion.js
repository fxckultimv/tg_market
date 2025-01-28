/**
 * Converts nanoTon to TON
 * @param {number|string} nanoTon - The amount in nanoTon
 * @returns {number} - The equivalent amount in TON
 */
export function nanoTonToTon(nanoTon) {
    if (typeof nanoTon === 'string') {
        nanoTon = parseFloat(nanoTon)
    }
    return nanoTon / 1_000_000_000
}

/**
 * Converts TON to nanoTon
 * @param {number|string} ton - The amount in TON
 * @returns {number} - The equivalent amount in nanoTon
 */
export function tonToNanoTon(ton) {
    if (typeof ton === 'string') {
        ton = parseFloat(ton)
    }
    return ton * 1_000_000_000
}
