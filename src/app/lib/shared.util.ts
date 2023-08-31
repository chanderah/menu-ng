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

export default class CommonUtil {
    constructor() {}

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
}
