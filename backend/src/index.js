const puppeteer = require('puppeteer')

const datefns = require('date-fns')

const dotenv = require('dotenv')
dotenv.config({path: '../.env'});

// Preparando variáveis de ambiente
const username = process.env.NODE_ENV_NAME
const password = process.env.NODE_ENV_PASSWORD

function setSunday(today) {
    if(datefns.isSunday(today)){
        sunday = today
        return setWeekDays()
    }else if(datefns.isSaturday(today)){
        sunday = datefns.addDays(today, 1)
        return setWeekDays()
    }else if(datefns.isFriday(today)){
        sunday = datefns.addDays(today, 2)
        return setWeekDays()
    }else if(datefns.isThursday(today)){
        sunday = datefns.addDays(today, 3)
        return setWeekDays()
    }else throw new Error("Dia inválido, não é possível agendar a próxima semana inteira a partir de hoje.");
}

function setWeekDays() {
    const days = []
    for(let i = 1; i <= 5; i++){
        const counter = datefns.addDays(sunday, i)
        days.push(datefns.format(counter, 'dd/MM/yyyy'))
    }
    return days
}

const week = setSunday(new Date())

for(let i = 0; i < week.length; i++){
    console.log(week[i])
}

async function localizaSubmit(page) {
    const element = await page.$('[type="submit"]');
    element.click()
}

async function localizaDataAgendamento(page) {
    const element = await page.$('[id="formulario:data_agendamento"]');
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

    localizaSubmit(page)

    await page.waitForNavigation()

    await page.locator('div ::-p-text(Portal do Discente)').click()
    
    await page.waitForNavigation()

    await page.locator('td ::-p-text(Restaurante Universitário)').hover()

    await page.locator('td ::-p-text(Agendar Refeição)').click()

    await page.waitForNavigation()

    for(let i = 0; i <= week.length; i++){
        localizaDataAgendamento(page)

        await page.keyboard.type(
            '0', {
            delay: 20
        })
        
        await page.keyboard.type(
            week[i], {
            delay: 50
        })

        await page.select('select[id="formulario:tipo_refeicao"]', '2')
        
        await setTimeout(() => {
            page.select('select[id="formulario:horario_agendado"]', '53')
            setTimeout(() => {
                page.click("input[type=submit]");
            }, "1000")
        }, "2000");

        await page.waitForNavigation();
        
        await localizaDataAgendamento(page)

        await page.keyboard.type(
            '0', {
            delay: 20
        })
        
        await page.keyboard.type(
            week[i], {
            delay: 100
        })

        await page.select('select[id="formulario:tipo_refeicao"]', '3')
        
        await setTimeout(() => {
            page.select('select[id="formulario:horario_agendado"]', '54')
            setTimeout(() => {
                page.click("input[type=submit]");
            }, "1000")
        }, "2000");

        await page.waitForNavigation();
    }
    
    await browser.close();
}

initialize()
