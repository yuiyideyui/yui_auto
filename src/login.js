const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const inquirer = require('inquirer');
function sleep(time) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}
//const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function waitForEnter() {
	return new Promise((resolve) => {
		rl.question('成功后请按回车', () => {
			console.log('回车了噢。。。等待5秒钟后方可结束yes--后面的报错不用管');
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
 * @param {path} executablePath 浏览器路径--chromium--linux必须要配置这个
 * @returns
 */
export const loginBilibili = (
	cookiePath = './myCookie.JSON',
	localStoragePath = './myStorage.json',
	executablePath = ''
) => {
	return new Promise(async (resolve, reject) => {
		let browser = '';
		if (executablePath) {
			browser = await puppeteer.launch({
				args: ['--no-sandbox'],
				executablePath: executablePath,
				defaultViewport: { width: 1920, height: 1080 },
				//            args: ['--start-maximized'],
				//            executablePath: browserPath,
				// defaultViewport:{
				//     width:1920,
				//     height:1080
				// },
				headless: 'new'
				//            headless: false,
			});
		} else {
			browser = await puppeteer.launch({
				args: ['--no-sandbox'],
				defaultViewport: { width: 1920, height: 1080 },
				//            args: ['--start-maximized'],
				//            executablePath: browserPath,
				// defaultViewport:{
				//     width:1920,
				//     height:1080
				// },
				headless: 'new'
				//            headless: false,
			});
		}

		const page = await browser.newPage();
		page.setDefaultNavigationTimeout(0);
		const finalResponse = new Promise(async (resolve, reject) => {
			await page.waitForResponse((response) => {
				if (
					response.url().startsWith('https://passport.bilibili.com/x/passport-login/web/qrcode/generate') &&
					response.status() === 200
				) {
					resolve(response.text());
				}
			});
		});
		await page.goto('https://passport.bilibili.com/login');
		await sleep(1000);
		const data = await finalResponse;
		
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: '选着什么方式登录',
                default: 'code',
                choices: [
                    { name: '二维码', value: 'code' },
                    { name: 'Url连接', value: 'url' },
                ]
            }
        ])
        if(answers.type === 'code'){
            //生成二维码
            printQRCode(JSON.parse(data).data.url);
        }else if(answers.type === 'url'){
            console.log('手机复制打开此链接-结束后按回车\n', JSON.parse(data).data.url);
        }
		await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: '登录完成',
                default: 'yes',
                choices: [
                    { name: 'yes', value: 'yes' },                
                ]
            }
        ]);
		//        await sleep(5000)
        await sleep(2000);
		await page.goto('https://www.bilibili.com/');
		await sleep(2000);
		const getcookies = await page.cookies();
		fs.writeFileSync(cookiePath, JSON.stringify(getcookies));
		// 遍历每个键并获取对应的值
		let obj = await page.evaluate(() => {
			// 获取localStorage中的所有键
			const keys = Object.keys(localStorage);
			let obj = {};
			for (const key of keys) {
				const value = localStorage.getItem(key);
				obj[key] = value;
			}
			return Promise.resolve(obj);
		});
		fs.writeFileSync(localStoragePath, JSON.stringify(obj));
		await sleep(2000);
        await page.close();
		await browser.close();
		resolve('成功');
	});
};
