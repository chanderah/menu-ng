import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class Aes256Service {
    constructor() {}

    encrypt(data: string) {
        return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(environment.aesKey), {
            iv: CryptoJS.enc.Utf8.parse(environment.aesIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).ciphertext.toString(CryptoJS.enc.Base64);
    }

    decrypt(data: string) {
        return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(environment.aesKey), {
            iv: CryptoJS.enc.Utf8.parse(environment.aesIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);
    }
}
