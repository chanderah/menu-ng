import { parse, stringify } from 'lossless-json';
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

    jsonParse = (obj: any) => {
        return jsonParse(obj);
    };

    jsonStringify = (obj: any) => {
        return jsonStringify(obj);
    };

    sortArrayByLabelProperty = (a: any, b: any) => {
        return sortArrayByLabelProperty(a, b);
    };

    capitalizeFirstLetter = (data: string) => {
        return capitalizeFirstLetter(data);
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
    if (typeof obj != 'string') return parse(stringify(obj));
    return parse(obj);
};

export const jsonStringify = (obj: any): string => {
    return stringify(obj);
};

// export const jsonParse = (obj: any) => {
//     if (typeof obj != 'string') return JSON.parse(jsonStringify(obj));
//     return JSON.parse(obj);
// };

// export const jsonStringify = (obj: any) => {
//     return JSON.stringify(obj);
// };

export const capitalize = (data: string) => {
    data.split(' ').forEach((c: string) => {
        c = c.charAt(0).toUpperCase() + (c.length === 1 ? '' : c.slice(1));
    });
    return data;
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
