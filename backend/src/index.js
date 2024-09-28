const puppeteer = require('puppeteer')

const dotenv = require('dotenv')
dotenv.config({path: '../.env'});

// Preparando variáveis de ambiente
const username = process.env.NODE_ENV_NAME
const password = process.env.NODE_ENV_PASSWORD

async function localizaContinuar(page) {
    const element = await page.$('[type="submit"]');
    element.click()
}


async function initialize() {

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./temp"
    });

    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://si3.ufc.br/sigaa/verTelaLogin.do');

    await page.keyboard.type(
        username, {
        delay: 20
    })

    await page.keyboard.press('Tab')

    await page.keyboard.type(
        password, {
        delay: 20
    })

    await page.keyboard.press('Enter')

    await page.waitForNavigation()

    // localizaContinuar(page)

    // await page.waitForNavigation()

    await page.locator('div ::-p-text(Portal do Discente)').click()
    
    await page.waitForNavigation()

    await page.locator('td ::-p-text(Restaurante Universitário)').hover()

    await page.locator('td ::-p-text(Agendar Refeição)').click()

    await page.waitForNavigation()
    await page.waitForNavigation()

    
    await browser.close();
}

initialize()
