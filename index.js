const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'})

    const page = await browser.newPage();

    await page.goto('https://www.linkedin.com/')

    await page.type('#session_key', 'Your username', {delay: 100})

    await page.type('#session_password', 'Your password', {delay: 100})

    await page.click("button.btn-md.btn-primary.sign-in-form__submit-btn--full-width[type='submit']", { delay: 100 });

    await page.waitForSelector('.search-global-typeahead__collapsed-search-button');
    await page.click(".search-global-typeahead__collapsed-search-button", { delay: 100 });

    await page.waitForSelector('.search-global-typeahead__input');
    await page.type('.search-global-typeahead__input', 'software engineer intern', { delay: 100 });

    await page.keyboard.press('Enter')
    await page.waitForNavigation();

    await page.waitForSelector('button.artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button[aria-pressed="false"]', {delay: 100});
    await page.click('button.artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button[aria-pressed="false"]', {delay: 200});

    await page.waitForSelector('li.jobs-search-results__list-item')

      const getJobs = await page.evaluate(() => {
        const jobTags = document.querySelectorAll('li.jobs-search-results__list-item')

        let jobInfo = []

        jobTags.forEach((job) => {
            const jobTitleElement = job.querySelector('.artdeco-entity-lockup__title a').innerText;
            const jobTitleHref =  'https://www.linkedin.com/' +  job.querySelector('.artdeco-entity-lockup__title a').getAttribute('href');
            const company = job.querySelector('.artdeco-entity-lockup__subtitle span').innerText;
            // Add location
            const locationTags = job.querySelectorAll('li.job-card-container__metadata-item ');
            let locations = []

            locationTags.forEach((location) => {
                locations.push(location.innerText)
            })

            jobInfo.push({
                jobTitle: jobTitleElement,
                jobLink: jobTitleHref,
                company: company,
                location: locations,
            });

        })
        return jobInfo;
    })

    console.log(getJobs)


    const jsonData = JSON.stringify(getJobs, null, 2);
    const filePath = '***Replace with path to desktop***'; 

    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File saved successfully:', filePath);
        }
    });
})();