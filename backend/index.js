import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cron from "node-cron";

const app = express();
const SCRAPE_URL = (page) => `https://www.olx.kz/nedvizhimost//?page=${page}`;
const MAX_PAGES = 5;
const properties = [];

async function scrapePage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const listings = $('[data-testid="l-card"]');
        listings.each((index, element) => {
            const title = $(element).find('.css-16v5mdi').text().trim();
            const locationDate = $(element).find('.css-1a4brun').text().trim();
            const image = $(element).find('.css-8wsg1m').attr('src');
            const postedDate = $(element).find('.css-1a4brun').text().trim().split(' - ')[1];
            const postLink = $(element).find('.css-z3gu2d').attr('href');

            properties.push({ title, locationDate, image, postedDate, postLink });
        });

    } catch (error) {
        console.error("Error scraping data:", error);
    }
}


async function scrapeWebSite() {
    for (let page = 1; page <= MAX_PAGES; page++) {
        const url = SCRAPE_URL(page);
        await scrapePage(url);
    }
}

app.get("/items", (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = properties.slice(startIndex, endIndex);

    res.json({
        total: properties.length,
        page: parseInt(page),
        limit: parseInt(limit),
        results
    });
});

export const job = cron.schedule('0 12 * * *', async () => {
    console.log('Running cron job to scrape website...');
    properties.length = 0;
    await scrapeWebSite();
    console.log('Scraping done.');
});

(async () => {
    await scrapeWebSite();
})();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
