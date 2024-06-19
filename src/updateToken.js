
const cp = require('child_process');
const puppeteer = require('puppeteer')
const fs = require('fs');
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}
//const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
/**
 * 
 * @param {path} cookiePath 账号cookie的地址
 * @param {path} localStoragePath 账号localStoragePath的地址
 * @returns 
 */

export const updateToken = (cookiePath = './myCookie.JSON' ,localStoragePath = './myStorage.json') => {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            executablePath: '/usr/bin/google-chrome-stable',
            defaultViewport: { width: 1920, height: 1080 },
            // args: ['--start-maximized'],
            //executablePath: browserPath,
            // defaultViewport:{
            //     width:1920,
            //     height:1080
            // },
            headless: 'new',
            //headless: false,
        })
        const cookiesString = fs.readFileSync(cookiePath);
        const cookies = JSON.parse(cookiesString);

//        const localStorageString = ;
        const localStorages = JSON.parse(fs.readFileSync(localStoragePath));


        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.bilibili.com/');
        await sleep(2000)
        await page.setCookie(...cookies);
        // 设置localStorage的值
        await page.evaluate((localStorages) => {
            console.log('localStorages', localStorages)
            // 导入数据到localStorage
            for (const key in localStorages) {
                if (Object.hasOwnProperty.call(localStorages, key)) {
                    localStorage.setItem(key, localStorages[key]);
                }
            }
        }, localStorages);
        await sleep(1000)
        await page.goto('https://www.bilibili.com/');
        let message = cp.execSync("curl -G 'https://wasm-rsa.vercel.app/api/rsa'" + ' --data-urlencode' + ' "t=$((`date ' + "'+%s'`*1000+`date '+%N'`/1000000))" + '"')
        message = JSON.parse(message.toString()).hash
        console.log('message',message);
        const mytest = await page.evaluate(async (message) => {

            /**
             * @param {请求的方式} method 
             * @param {请求的url} url 
             * @param {请求的参数对象形式(默认null)} param 
             * @param {返回类型('text'|'object')} returnType 
             * @returns 
             */
            const myRequest = (method, url, param = null, returnType = 'object') => {
                return new Promise((resolve, reject) => {
                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    var data = new FormData();
                    if (param !== null) {
                        for (const key in param) {
                            if (Object.hasOwnProperty.call(param, key)) {
                                data.append(key, param[key])
                            }
                        }
                    }
                    xhr.addEventListener("readystatechange", function () {
                        if (this.readyState === 4) {
                            // console.log('this.responseText',this.responseText);
                            if (returnType == 'text') {
                                resolve(this.responseText)
                            } else {
                                resolve(JSON.parse(this.responseText))
                            }

                        }
                    })
                    xhr.open(method, url);
                    xhr.send(data);
                })
            }
          try {
                //是否刷新
                const ifCsrf = await myRequest('GET', `https://passport.bilibili.com/x/passport-login/web/cookie/info?csrf=${document.cookie.split('bili_jct')[1].split(';')[0].split('=')[1]}`)
                //目前设置必刷新
                let getIdName = ''
                if (ifCsrf) {
                    getIdName = await myRequest("GET", `https://www.bilibili.com/correspond/1/${message}`, null, 'text')
                }
                //获取<div id="1-name">
                if (getIdName.split('<div id="1-name">')[1].split('</div>')[0]) {
                    let bili_jct = document.cookie.split('bili_jct')[1].split(';')[0].split('=')[1]
                    let params = {
                        'csrf': bili_jct,
                        "refresh_csrf": getIdName.split('<div id="1-name">')[1].split('</div>')[0],
                        "source": "main_web",
                        "refresh_token": localStorage.getItem("ac_time_value")
                    }
                    //获取新的ac_time_value并刷新cookie
                    const refreshRes = await myRequest("POST", "https://passport.bilibili.com/x/passport-login/web/cookie/refresh",params)
                    if(refreshRes.data && refreshRes.data.refresh_token){
                        localStorage.setItem('ac_time_value', refreshRes.data.refresh_token)
                    }
                }
              return '成功'
          } catch (error) {
              return '失败'
          }
        },message)
        console.log('mytest',mytest)
        const getcookies = await page.cookies();
        fs.writeFileSync(cookiePath, JSON.stringify(getcookies));
        // 遍历每个键并获取对应的值
        let obj = await page.evaluate(() => {
                    // 获取localStorage中的所有键
            const keys = Object.keys(localStorage)
            let obj = {}
                for (const key of keys) {
                const value = localStorage.getItem(key)
                obj[key] = value
            }
            return Promise.resolve(obj);
            
        });
        fs.writeFileSync(localStoragePath,JSON.stringify(obj))
        await browser.close()
        resolve()
    })

}


