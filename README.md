# bilibili-哔哩哔哩-自动化
bili登录获取token和自动更新token

Linux需要注意第三个参数需要传入chromium路径

# linux安装chromium-browser
```
sudo apt update
sudo apt install chromium-browser
```
```
executablePath:"/usr/bin/chromium-browser",
```
# 登录--windows可以不传executablePath
```
import { loginBilibili } from 'yui_auto_bili'
---------------------------------------------------
const {loginBilibili} = require('yui_auto_bili')
```
# 更新token
```
import { updateToken } from 'yui_auto_bili'
---------------------------------------------------
const {updateToken} = require('yui_auto_bili')
```
