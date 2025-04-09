import { Injectable } from '@angular/core';
import { Aes256Service } from './service/aes256.service';
import { jsonParse, jsonStringify } from './lib/utils';
import { Nullable } from './interface/common';

interface DataWithExpiry<T = any> {
  data: T;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private aes256Service: Aes256Service) {}

  get<T = any>(key: string): Nullable<T> {
    const localData = localStorage.getItem(key);
    if (!localData) return null;

    const value = this.aes256Service.decrypt(localData);
    return jsonParse(value) as T;
  }

  set(key: string, data: any) {
    const value = this.aes256Service.encrypt(jsonStringify(data));
    localStorage.setItem(key, value);
  }

  getWithExpiry<T = any>(key: string): Nullable<T> {
    const localData = this.get(key);
    if (!localData) return null;

    const { data, expiry } = jsonParse<DataWithExpiry<T>>(localData);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }

  setWithExpiry(
    key: string,
    data: any,
    expiryInMinutes: number = 720 // 12 hour
  ) {
    this.set(key, {
      data,
      expiry: Date.now() + expiryInMinutes * 60 * 1000,
    });
  }
}
