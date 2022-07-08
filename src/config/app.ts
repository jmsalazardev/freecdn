/* eslint-disable no-undef */

import { emulatorsConfig } from './emulators';

const {
  PUBLIC_URL: publicUrl,
  NODE_ENV: env,
  REACT_APP_API_URL: apiUrl,
  REACT_APP_STORAGE_URL: storageUrl,
  REACT_APP_LICENSE: license,
} = process.env;

export const appConfig = {
  publicUrl,
  storageUrl,
  isDev: env === 'development',
  apiUrl: env === 'development' ? emulatorsConfig.functions.url : apiUrl,
  license: license || '',
};
