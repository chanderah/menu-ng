import { environment } from 'src/environments/environment';
import { capitalize, capitalizeFirstLetter, isEmpty, jsonParse, jsonStringify, toAscii } from './utils';

export default class SharedUtil {
    public env = environment;
    public isDevelopment: boolean = environment.production === false;

    constructor() {}

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

    jsonParse(obj: string) {
        return jsonParse(obj);
    }

    jsonStringify(obj: any) {
        return jsonStringify(obj);
    }
}
