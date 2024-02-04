import { environment } from './../../environments/environment.prod';

export default class SharedUtil {
    // public isLoading = true;
    public env = environment;
    // public isDevelopment: boolean = environment.production === false;
    public isDevelopment = true;

    constructor() {}

    encrypt = (data: any) => {
        return data;
    };

    decrypt = (data: any) => {
        return data;
    };

    isEmpty = (obj: any) => {
        return isEmpty(obj);
    };

    capitalize = (str: string) => {
        return capitalize(str);
    };

    capitalizeFirstLetter = (str: string) => {
        return capitalizeFirstLetter(str);
    };

    toAscii(num: number) {
        return toAscii(num);
    }
}

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
    if (typeof obj != 'string') return JSON.parse(jsonStringify(obj));
    return JSON.parse(obj);
};

export const jsonStringify = (obj: any): string => {
    const stringify = require('json-stringify-deterministic');
    return stringify(obj);
};

// export const jsonParse = (obj: any) => {
//     if (typeof obj != 'string') return JSON.parse(jsonStringify(obj));
//     return JSON.parse(obj);
// };

// export const jsonStringify = (obj: any) => {
//     return JSON.stringify(obj);
// };

export const capitalize = (str: string) => {
    if (isEmpty(str)) return '';

    const words = str.split(' ');
    return words
        .map((w) => {
            return w[0].toUpperCase() + w.substring(1);
        })
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
