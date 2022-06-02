/* eslint-disable no-undef */

import {emulatorsConfig} from './emulators';

const {
    PUBLIC_URL: publicUrl,
    NODE_ENV: env,
    REACT_APP_API_URL: apiUrl,
} = process.env;

console.log({apiUrl});
export const appConfig = {
    publicUrl,
    isDev: env === 'development',
    apiUrl: env === 'development' ? emulatorsConfig.functions.url : apiUrl, 
};
