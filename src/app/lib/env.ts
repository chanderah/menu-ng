import { environment } from './../../environments/environment';

export const isDevelopment = () => {
  return environment.production === false;
};

export const isProduction = () => {
  return environment.production === true;
};
