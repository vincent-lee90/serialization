/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Convert as convert } from '../format/Convert';
import { KeyPair } from '../KeyPair';
import * as utility from './Utilities';

// tslint:disable-next-line: no-var-requires
const CryptoJS = require('crypto-js');
export class Crypto {


    /***
     * Encode a message, separated from encode() to help testing
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {Uint8Array} iv - An initialization vector
     * @param {Uint8Array} salt - A salt
     * @return {string} - The encoded message
     */
    public static _encode = (senderPriv: string,
        recipientPub: string,
        msg: string,
        iv: Uint8Array): string => {
        // Errors
        if (!senderPriv || !recipientPub || !msg || !iv) { throw new Error('Missing argument !'); }
        // Processing
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(senderPriv);
        const pk = convert.hexToUint8(recipientPub);
        const encKey = utility.ua2words(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, pk), 32);
        const encIv = {
            iv: utility.ua2words(iv, 16),
        };
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(msg), encKey, encIv);
        // Result
        const result = convert.uint8ToHex(iv) + CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
        return result;
    }
    /**
     * Encode a message
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {boolean} isHexString - Is payload string a hexadecimal string (default = false)
     * @return {string} - The encoded message
     */
    public static encode = (senderPriv: string,
        recipientPub: string,
        msg: string,
        isHexString: boolean = false): string => {
        // Errors
        if (!senderPriv || !recipientPub || !msg) { throw new Error('Missing argument !'); }
        // Processing
        const iv = Crypto.randomBytes(16);
        const encoded = Crypto._encode(senderPriv, recipientPub, isHexString ? msg : convert.utf8ToHex(msg), iv);
        // Result
        return encoded;
    }

    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {Uint8Array} payload - An encrypted message payload in bytes
     * @param {Uint8Array} iv - 16-byte AES initialization vector
     * @return {string} - The decoded payload as hex
     */
    public static _decode = (recipientPrivate: string,
        senderPublic: string,
        payload: Uint8Array,
        iv: Uint8Array): string => {
        // Error
        if (!recipientPrivate || !senderPublic || !payload) { throw new Error('Missing argument !'); }
        // Processing
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(recipientPrivate);
        const pk = convert.hexToUint8(senderPublic);
        const encKey = utility.ua2words(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, pk), 32);
        const encIv = {
            iv: utility.ua2words(iv, 16),
        };
        const encrypted = {
            ciphertext: utility.ua2words(payload, payload.length),
        };
        const plain = CryptoJS.AES.decrypt(encrypted, encKey, encIv);
        // Result
        return CryptoJS.enc.Hex.stringify(plain);
    }

    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {string} payload - An encrypted message payload
     * @return {string} - The decoded payload as hex
     */
    public static decode = (recipientPrivate: string,
        senderPublic: string,
        payload: string): string => {
        // Error
        if (!recipientPrivate || !senderPublic || !payload) { throw new Error('Missing argument !'); }
        // Processing
        const binPayload = convert.hexToUint8(payload);
        const payloadBuffer = new Uint8Array(binPayload.buffer, 16);
        const iv = new Uint8Array(binPayload.buffer, 0, 16);
        const decoded = Crypto._decode(recipientPrivate, senderPublic, payloadBuffer, iv);
        return decoded.toUpperCase();
    }
    /**
     * Generate random bytes by length
     * @param {number} length - The length of the random bytes
     *
     * @return {Uint8Array}
     */
    public static randomBytes = (length) => {
        const crypto = require('crypto');
        return crypto.randomBytes(length);
    }
}
