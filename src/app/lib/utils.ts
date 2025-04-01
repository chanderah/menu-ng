import { environment } from 'src/environments/environment';

export const isDevelopment = !environment.production;

export const disableBodyScroll = () => {
  document.body.classList.add('block-scroll');
};

export const enableBodyScroll = () => {
  document.body.classList.remove('block-scroll');
};

export const encode = (data: any) => {
  return typeof data === 'string' ? btoa(data) : btoa(jsonStringify(data));
};

export const decode = (data: string) => {
  return atob(data);
};

export const trim = (data: string) => {
  return data.trim();
};

export const isEmpty = (obj: any) => {
  if (!obj || obj == null || obj == '' || obj?.length === 0 || JSON.stringify(obj) === '{}') return true;
  else return false;
};

export const jsonParse = <T = any>(obj: any): T => {
  try {
    if (typeof obj != 'string') return JSON.parse(jsonStringify(obj));
    return JSON.parse(obj);
  } catch (_) {
    return obj;
  }
};

export const jsonStringify = (obj: any): string => {
  const stringify = require('json-stringify-deterministic');
  return stringify(obj);
};

export const capitalize = (str: string) => {
  if (isEmpty(str)) return '';
  return str
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substring(1))
    .join(' ');
};

export const capitalizeFirstLetter = (data: string) => {
  return isEmpty(data) ? '' : data.charAt(0).toUpperCase() + data.slice(1);
};

export const sortArrayByLabelProperty = (a: any, b: any) => {
  if (a.label > b.label) return 1;
  if (a.label < b.label) return -1;
  return 0;
};

export const toAscii = (num: number) => {
  return String.fromCharCode(97 + num);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getImageUrl = (filePath: string) => {
  return `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/${filePath}`;
};

export const toLetter = (num: number) => {
  if (num < 0 || num > 25) {
    throw new Error('Number must be between 0 and 25');
  }
  return String.fromCharCode(num + 97);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const refreshPage = () => {
  window.location.reload();
};
