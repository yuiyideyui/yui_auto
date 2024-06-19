
// const {loginBilibili } = require('./login.js')
// loginBilibili('./myCookie.json','./myStorage.json')
// const { updateToken } = require('./updateToken.js')
// updateToken('./myCookie.json','./myStorage.json')

import {loginBilibili} from './login.js'
import {updateToken} from './updateToken.js'
export default {
    loginBilibili,
    updateToken
};