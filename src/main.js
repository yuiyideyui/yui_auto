
// const {loginBilibili } = require('./login.js')
// loginBilibili('./myCookie.json','./myStorage.json')
// const { updateToken } = require('./updateToken.js')
// updateToken('./myCookie.json','./myStorage.json')

import {loginBilibili} from './login.js'
import {updateToken} from './updateToken.js'
export default {
/**
 * 
 * @param {path} cookiePath 要保存的cookie路径-JSON格式
 * @param {path} localStoragePath 要保存的localStorage路径-JSON格式
 * @returns 
 */

    loginBilibili,
/**
 * 
 * @param {path} cookiePath 账号cookie的地址
 * @param {path} localStoragePath 账号localStoragePath的地址
 * @returns 
 */
    updateToken
};