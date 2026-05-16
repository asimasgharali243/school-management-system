// src/utils/encryption.js
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '../config/constants';

// Double Base64 Encoding (as used in your backend)
export const encode = (str) => {
    try {
        const firstEncode = btoa(str);
        const secondEncode = btoa(firstEncode);
        return secondEncode;
    } catch (error) {
        console.error('Encoding error:', error);
        return str;
    }
};

// Double Base64 Decoding
export const decode = (encodedStr) => {
    try {
        const firstDecode = atob(encodedStr);
        const secondDecode = atob(firstDecode);
        return secondDecode;
    } catch (error) {
        console.error('Decoding error:', error);
        return encodedStr;
    }
};

// AES Encryption for sensitive data
export const encrypt = (data) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return data;
    }
};

// AES Decryption
export const decrypt = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption error:', error);
        return cipherText;
    }
};