import { animate, style, transition, trigger } from '@angular/animations';
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

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getImageSrc = (filePath: string, size?: number) => {
  if (filePath.includes('base64')) return filePath;
  let url = `https://res.cloudinary.com/${environment.cloudinary.cloudName}/image/upload/`;
  if (size) url += `c_fill,h_${size},w_${size}/`;
  return url + filePath;
};

export const toLetter = (num: number) => {
  // if (num < 0 || num > 25) {
  //   throw new Error('Number must be between 0 and 25');
  // }
  return String.fromCharCode(num + 97);
};

export const filterUniqueArr = (arr: any[], key?: string) => {
  if (key) {
    return arr.filter((v, i, self) => self.findIndex((obj) => obj.id === v.id) === i);
  }
  return arr.filter((v, i, self) => self.indexOf(v) === i);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const refreshPage = () => {
  window.location.reload();
};

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('{{duration}} ease-in', style({ opacity: 1 }))], {
    params: { duration: '300ms' },
  }),
  transition(':leave', [animate('{{duration}} ease-out', style({ opacity: 0 }))], { params: { duration: '300ms' } }),
]);

export const moveUp = trigger('moveUp', [
  transition(':enter', [
    style({ transform: 'translateY(50px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ transform: 'translateY(-50px)', opacity: 0 }))]),
]);

export const isMobile = window.innerWidth < 768;
