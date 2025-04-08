import { CONSTANTS } from '../constant/common';
import { environment } from 'src/environments/environment';
import {
  capitalize,
  capitalizeFirstLetter,
  clearLocalStorage,
  filterUniqueArr,
  getImageSrc,
  isEmpty,
  isMobile,
  jsonParse,
  jsonStringify,
  refreshPage,
  toLetter,
} from './utils';
import { Product, ProductOption, ProductOptionValue } from '../interface/product';

export default class SharedUtil {
  public env = environment;
  public isMobile: boolean = isMobile;
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

  jsonParse(obj: string) {
    return jsonParse(obj);
  }

  jsonStringify(obj: any) {
    return jsonStringify(obj);
  }

  getImageSrc(filePath: string) {
    return getImageSrc(filePath);
  }

  toLetter(num: number) {
    return toLetter(num);
  }

  clearLocalStorage() {
    return clearLocalStorage();
  }

  refreshPage() {
    return refreshPage();
  }

  getProductsName(products: Product[]) {
    const names = filterUniqueArr(products.map((v) => v.name));
    return names.join(', ');
  }

  getProductOptions(options: ProductOption[]) {
    return options.map((v) => {
      const values = v.values.map((v) => v.value).join(', ');
      return {
        option: v.name,
        values: values,
      };
    });
  }

  getOptionValuesName(values: ProductOptionValue[]) {
    return values.map((v) => v.value).join(', ');
  }

  getOrderStatus(isServed: boolean, status: string) {
    if (isServed) return CONSTANTS.ORDER_STATUS['complete'];
    return CONSTANTS.ORDER_STATUS[status];
  }

  getEmptyMessage(isLoading: boolean) {
    return isLoading ? 'Loading...' : 'No data found.';
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  get bottomSheetStyle() {
    return {
      width: isMobile ? '100vw' : '50vw',
      height: 'auto',
      left: isMobile ? 0 : '25vw',
      overflow: 'scroll',
    };
  }
}
