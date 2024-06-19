const puppeteer = require('puppeteer')
const readline = require('readline');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}
//const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function waitForEnter() {
  return new Promise((resolve) => {
    rl.question('扫码上面的链接,成功后请按回车', () => {
    	 console.log('回车了噢。。。等待5秒钟后方可结束yes')
      resolve();
    });
  });
}



// 打印二维码
function printQRCode(base64Data) {
  qrcode.generate(base64Data, { small: true }, (qrcode) => {
    console.log(qrcode);
  });
}


/**
 * 
 * @param {path} cookiePath 要保存的cookie路径-JSON格式
 * @param {path} localStoragePath 要保存的localStorage路径-JSON格式
 * @returns 
 */
export const loginBilibili = (cookiePath = './myCookie.JSON',localStoragePath = './myStorage.json') => {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            executablePath: '/usr/bin/google-chrome-stable',
            defaultViewport: { width: 1920, height: 1080 },
//            args: ['--start-maximized'],
//            executablePath: browserPath,
            // defaultViewport:{
            //     width:1920,
            //     height:1080
            // },
             headless: 'new',
//            headless: false,
        })
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(0);
        const finalResponse = new Promise(async(resolve,reject)=>{
            await page.waitForResponse(
                response => {
                    if (response.url().startsWith('https://passport.bilibili.com/x/passport-login/web/qrcode/generate') && response.status() === 200) {
                        resolve(response.text())
                    }
                }
            );
        })
        await page.goto('https://passport.bilibili.com/login');
        await sleep(1000)
        const data = await finalResponse
        //生成二维码
        printQRCode(JSON.parse(data).data.url);
        await waitForEnter();
//        await sleep(5000)
        await page.goto('https://www.bilibili.com/');
        await sleep(2000)
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
        fs.writeFileSync(localStoragePath, JSON.stringify(obj))
        await sleep(1000)
        await browser.close()
        resolve('成功')
    })
}
