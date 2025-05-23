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
  snakeToTitleCase,
  toLetter,
} from './utils';
import { Product, ProductOption, ProductOptionValue } from '../interface/product';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PagingInfo } from '../interface/paging_info';

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

  jsonParse<T = any>(obj: string) {
    return jsonParse<T>(obj);
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

  isOrderPaid(status: string) {
    return ['settlement', 'capture'].includes(status);
  }

  isOrderCompleted(status: string) {
    return status === 'complete';
  }

  isOrderPending(status: string) {
    return status === 'pending';
  }

  isOrderExpired(status: string) {
    return status === 'expire';
  }

  snakeToTitleCase(str: string) {
    return snakeToTitleCase(str);
  }

  getSortOrder(pagingInfo: PagingInfo) {
    return pagingInfo.sortOrder === 'ASC' ? 1 : -1;
  }

  get dialogBreakpoints() {
    return { '768px': '90vw' };
  }

  get defaultDialogConfig(): DynamicDialogConfig {
    return {
      modal: true,
      maximizable: true,
      dismissableMask: true,
      closeOnEscape: true,
      showHeader: true,
      keepInViewport: true,
      transitionOptions: '100ms ease-out',
      contentStyle: {
        overflow: 'auto',
        maxHeight: '80vh',
      },
      style: {
        width: isMobile ? '90vw' : '40vw',
        height: 'auto',
      },
    };
  }

  get defaultStackedDialogConfig(): DynamicDialogConfig {
    return {
      ...this.defaultDialogConfig,
      dismissableMask: false,
      closeOnEscape: false,
      style: {
        width: isMobile ? '92vw' : '42vw',
        height: 'auto',
      },
    };
  }

  get defaultPageOptions() {
    return [10, 20, 50, 100];
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
