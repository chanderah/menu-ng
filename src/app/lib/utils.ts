export const disableBodyScroll = () => {
    document.body.classList.add('block-scroll');
};

export const enableBodyScroll = () => {
    document.body.classList.remove('block-scroll');
};

export const trim = (data: string) => {
    return data.trim();
};

export const isEmpty = (obj: any) => {
    if (!obj || obj == null || obj == '' || obj?.length === 0 || JSON.stringify(obj) === '{}') return true;
    else return false;
};

export const jsonParse = (obj: any): any => {
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
    return data.charAt(0).toUpperCase() + data.slice(1);
};

export const sortArrayByLabelProperty = (a: any, b: any) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
};

export const toAscii = (num: number) => {
    return String.fromCharCode(97 + num);
};
