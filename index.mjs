import selenium-webdriver from 'selenium-webdriver';
import sendemail from "./email.mjs";
import express from "espress";
import 'dotenv/config';  

const app = express();  

const port = process.env.PORT || 8080;  


app.listen(port, () =>
  console.log(`Example app listening https://localhost:${port}`),  
);  

(async () => {
    //const browser = await puppeteer.launch();
    const browser = await selenium-webdriver.launch({
        args: [
            '--headless',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();
    await page.goto("https://vs2.clubinterconnect.com/wotc/home/login.do");  

    //login page
    await page.type('#userid', 'huangab80@hotmail.com');
    await page.type('#password', process.env.LOGINPASSWORD);
    await page.click('#submit');  

    // main page
    await page.waitForSelector('.NewButtonhead');
    await page.click('.NewButtonhead');   
    
    // Stephen account page
    await page.waitForSelector('body > div.smarteformTabs > div.smarteformTabsContent > div > div.padding30 > div.main-listing > div:nth-child(1) > ul > li:nth-child(1) > a');
    const tennisbutton = await page.$x('//a[text()="Tennis Courts"]');
    await tennisbutton[0].click();
    await page.waitForNavigation();  

    // day selection page
    await page.click('#caldaylink > a:nth-child(8)');  

    // court 5 8:30 pm
    // #calendar > div > table > tbody > tr:nth-child(29) > td:nth-child(5) > a'  

    // court 4 8:30 pm
    // #calendar > div > table > tbody > tr:nth-child(29) > td:nth-child(4) > a'  

    // court 3 8:30 pm
    // #calendar > div > table > tbody > tr:nth-child(29) > td:nth-child(3) > a'  

    let secondName = 'Daniel Huang'  

    for (let i = 5; i > 0; i--) {
        try{
            //select court
            let courtID = '#calendar > div > table > tbody > tr:nth-child(29) > td:nth-child('+i+') > a';
            courtBook(browser, page, i, courtID, secondName);
            return
        } catch(e){
            returnPage(page);
        }
    }  

    // close page
    await browser.close();  

    //send error email
    sendemail('stephen382012@hotmail.com', 'error', 'error', true);
})();  

//court booking function
async function courtBook(browser, page, courtNumber, courtID, name){
    await page.waitForSelector(courtID);
    await page.click(courtID);   
    
    // input name
    await page.waitForSelector('#Team_Two_Auto');
    await page.type('#Team_Two_Auto', name);  

    //book court
    await page.click('#final');
    sendemail('stephen382012@hotmail.com',courtNumber,'8:30pm', false);
    await browser.close();
}  

//return in case of error funciton
async function returnPage(page){
    await page.waitForSelector('#smarteform > p > input');
    await page.click('#smarteform > p > input');
}
