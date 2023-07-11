import { ErrorHandler, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiClient {
  private axiosClient: AxiosInstance;
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
    this.axiosClient = axios.create({
      timeout: 3000,
      headers: {
        'X-Initialized-At': Date.now().toString()
      }
    });
  }

  public async get<T>(options: GetOptions): Promise<T> {
    try {
      var axiosResponse = await this.axiosClient.request<T>({
        method: 'get',
        url: options.url,
        params: options.params
      });

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  private normalizeError(error: any): ErrorResponse {
    this.errorHandler.handleError(error);
    return {
      status: 500,
      code: 'Unknown Error',
      message: 'Something went wrong.'
    };
  }
}

export interface Params {
  [key: string]: any;
}

export interface GetOptions {
  url: string;
  params?: Params;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
}
