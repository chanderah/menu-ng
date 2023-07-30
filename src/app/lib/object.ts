export const isEmpty = (obj: any) => {
    if (obj == null || obj === '' || obj.length === 0 || JSON.stringify(obj) === '{}') return true;
    else return false;
};

export const jsonParse = (obj: any) => {
    if (typeof obj != 'string') obj = jsonStringify(obj);
    return JSON.parse(obj);
};

export const jsonStringify = (obj: any) => {
    return JSON.stringify(obj);
};
