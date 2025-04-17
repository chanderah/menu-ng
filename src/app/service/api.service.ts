import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/interface/product';
import { Category } from './../interface/category';
import { Order, PaymentMethod } from './../interface/order';
import { PagingInfo } from './../interface/paging_info';
import { User, UserLogin } from './../interface/user';
import { getImageSrc, jsonStringify } from '../lib/utils';
import { ApiResponse } from '../interface/api';
import { Table } from '../interface/customer';
import { BusinessConfig } from '../interface/business_config';
import { Aes256Service } from './aes256.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private aes256Service: Aes256Service
  ) {}

  getBusinessConfig() {
    return this.httpClient.post<ApiResponse<BusinessConfig[]>>('/business/findAll', null);
  }

  getBusinessConfigByParam(param: string) {
    return this.httpClient.post<ApiResponse<BusinessConfig>>('/business/findByParam', { param });
  }

  saveBusinessConfig(req: BusinessConfig) {
    return this.httpClient.post<ApiResponse<void>>('/business/save', req);
  }

  register(user: User) {
    return this.httpClient.post<any>('/user/register', user);
  }

  login(user: UserLogin) {
    return this.httpClient.post<any>('/user/login', user);
  }

  getUsers(pagingInfo: PagingInfo) {
    return this.httpClient.post<any>('/user/findAll', pagingInfo);
  }

  getUserRoles() {
    return this.httpClient.post<any>('/user/role/findAll', null);
  }

  findUserById(user: User) {
    return this.httpClient.post<any>('/user/findById', user);
  }

  findUserByUsername(user: User) {
    return this.httpClient.post<any>('/user/findByUsername', user);
  }

  findUserByToken() {
    return this.httpClient.post<any>('/user/findByToken', null);
  }

  updateUser(user: User) {
    return this.httpClient.post<any>('/user/update', user);
  }

  updateFcmToken(user: User) {
    return this.httpClient.post<any>('/user/updateFcmToken', user);
  }

  deleteUser(user: User) {
    return this.httpClient.post<any>('/user/deleteUser', user);
  }

  getCategories() {
    return this.httpClient.post<any>('/category/findAll', null);
  }

  findCategoryById(category: Category) {
    return this.httpClient.post<any>('/category/findById', category);
  }

  saveCategory(category: Category) {
    return this.httpClient.post<ApiResponse<void>>('/category/save', category);
  }

  deleteCategory(category: Category) {
    return this.httpClient.post<any>('/category/delete', category);
  }

  getTables(pagingInfo: PagingInfo) {
    return this.httpClient.post<any>('/table/findAll', pagingInfo);
  }

  findTableById(id: number) {
    return this.httpClient.post<ApiResponse<Table>>('/table/findById', { id });
  }

  createTable(table: Table) {
    return this.httpClient.post<any>('/table/create', table);
  }

  updateTable(table: Table) {
    return this.httpClient.post<any>('/table/update', table);
  }

  deleteTable(table: Table) {
    return this.httpClient.post<any>('/table/delete', table);
  }

  getProducts(pagingInfo: PagingInfo) {
    return this.httpClient.post<any>('/product/findAll', pagingInfo);
  }

  findProductByCategory(product: Product) {
    return this.httpClient.post<any>('/product/findByCategory', product);
  }

  findActiveProductByCategoryParam(pagingInfo: PagingInfo) {
    return this.httpClient.post<any>('/product/findActiveByCategoryParam', pagingInfo);
  }

  findProductById(product: Product) {
    return this.httpClient.post<any>('/product/findById', product);
  }

  saveProduct(product: Product, productImages: File[]) {
    // const isEdit = !!product.id;
    const formData = new FormData();

    for (const v of productImages.filter(Boolean)) formData.append('productImages', v);
    // const data = this.aes256Service.encrypt(jsonStringify(product));
    const data = jsonStringify(product);
    formData.append('product', data);

    return this.httpClient.post<ApiResponse<void>>('/product/save', formData);
  }

  deleteProduct(product: Product) {
    return this.httpClient.post<any>('/product/delete', product);
  }

  markOrderAsDone(listId: number[]) {
    return this.httpClient.post<any>('/order/markAsDone', { listId });
  }

  getLiveOrders(lastFetchedId: number, limit: number) {
    return this.httpClient.post<any>('/order/findLive', { id: lastFetchedId, limit });
  }

  getOrders(pagingInfo: PagingInfo) {
    return this.httpClient.post<ApiResponse<Order[]>>('/order/findAll', pagingInfo);
  }

  getOrderById(id: number) {
    return this.httpClient.post<ApiResponse<Order>>('/order/findById', { id });
  }

  getOrderByCode(orderCode: string) {
    return this.httpClient.post<ApiResponse<Order>>('/order/findByCode', { orderCode });
  }

  createOrder(req: Order) {
    return this.httpClient.post<ApiResponse<Order>>('/order/create', req);
  }

  completeOrder(req: Order) {
    return this.httpClient.post<ApiResponse<Order>>('/order/complete', req);
  }

  deleteOrder(orderId: number) {
    return this.httpClient.post<ApiResponse<void>>('/order/delete', { orderId });
  }

  getPaymentMethods() {
    return this.httpClient.post<ApiResponse<PaymentMethod[]>>('/paymentMethod/findAll', null);
  }

  savePaymentMethod(req: PaymentMethod) {
    return this.httpClient.post<ApiResponse<void>>('/paymentMethod/save', req);
  }

  getImage(filePath: string) {
    const url = getImageSrc(filePath);
    return this.httpClient.get(url, { responseType: 'blob' });
  }

  getImageThumbnail(filePath: string, size: number = 80) {
    const url = getImageSrc(filePath, size);
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
