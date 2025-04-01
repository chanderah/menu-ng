import { CONSTANTS } from './../constants/common';
import { environment } from 'src/environments/environment';
import {
  capitalize,
  capitalizeFirstLetter,
  getImageUrl,
  isEmpty,
  jsonParse,
  jsonStringify,
  toAscii,
  toLetter,
} from './utils';

export default class SharedUtil {
  public env = environment;
  public isDevelopment: boolean = environment.production === false;
  public readonly CONSTANTS = CONSTANTS;

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

  getImageUrl(filePath: string) {
    return getImageUrl(filePath);
  }

  toLetter(num: number) {
    return toLetter(num);
  }
}
