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
        if (!obj || obj == null || obj == '' || obj?.length === 0 || JSON.stringify(obj) === '{}') return true;
        else return false;
    };

    jsonParse = (obj: any) => {
        if (typeof obj != 'string') return JSON.parse(this.jsonStringify(obj));
        return JSON.parse(obj);
    };

    jsonStringify = (obj: any) => {
        return JSON.stringify(obj);
    };

    sortArrayByLabelProperty = (a: any, b: any) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
    };

    capitalizeFirstLetter = (data: string) => {
        return data.charAt(0).toUpperCase() + data.slice(1);
    };

    toAscii(num: number) {
        return String.fromCharCode(97 + num);
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

export const jsonParse = (obj: any) => {
    if (typeof obj != 'string') return JSON.parse(jsonStringify(obj));
    return JSON.parse(obj);
};

export const jsonStringify = (obj: any) => {
    return JSON.stringify(obj);
};

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
