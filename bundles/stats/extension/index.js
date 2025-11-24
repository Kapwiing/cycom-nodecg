const axios = require('axios');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

module.exports = function (nodecg) {
    const playerData = nodecg.Replicant("playerData");

    // Listen for update msg
    nodecg.listenFor("testMessage", async query => {
        nodecg.log.info(`Received Query = ${query}`);

        try {
            let username = query;
            let platform = 'riot';

            if (typeof query === 'object' && query !== null) {
                username = query.username || query.name || query.user || username;
                platform = query.platform || query.platformType || platform;
            }

            if (!username || typeof username !== 'string') {
                throw new Error('Missing username to scrape. Provide a string or an object like { username, platform }');
            }

            const url = `https://tracker.gg/valorant/profile/${encodeURIComponent(platform)}/${encodeURIComponent(username)}/overview`;

            let browser;
            try {
                browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
                    headless: false,
                });
                const extraHeaders = {
                    Referer: 'https://google.com/',
                };
                const page = await browser.newPage();
                await page.setExtraHTTPHeaders(extraHeaders);
                await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36');
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });

                // Give page a moment to render dynamic content
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Extract top-level readable text and some common stat targets
                // Wait for key selectors to ensure dynamic content has loaded
                try {
                    await page.waitForSelector('.trn-ign__username, .trn-defstat__value, main', { timeout: 10000 });
                } catch (waitErr) {
                    // timeout waiting for selectors — continue anyway and attempt to scrape what is available
                }

                const cookieBtn = '#ncmp__tool > div > div > div.ncmp__banner-actions > div.ncmp__banner-btns > button:nth-child(2)';
                try {
                    await page.waitForSelector(cookieBtn, { timeout: 3000, visible: true });
                    await page.click(cookieBtn).catch(() => {});
                } catch (err) {
                    // timeout / not found — continue without closing cookie banner
                }

                const currentRank = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-main > div.area-main-stats > div.v3-card.segment-stats > div.v3-card__body.v3-card__body--v2\\.5 > div.highlighted.rounded-t-4.highlighted--giants > div.highlighted__content > div > div.trn-profile-highlighted-content__stats > div > div:nth-child(1) > span.stat__value';
                const peakRank = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-sidebar.h-full > div.v3-card.has-primary.area-rating > div > div > div.rating-summary__content.rating-summary__content--secondary.mt-4 > div > div > div > div > div.rating-entry__rank-info > div.value';
                const topRole = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-sidebar.h-full > div.roles.v3-card.area-roles > div > div > div:nth-child(1) > h5';
                const avgDamage = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-main > div.area-main-stats > div.v3-card.segment-stats > div.v3-card__body.v3-card__body--v2\\.5 > div.giant-stats > div:nth-child(1) > div > div.numbers > span.flex.items-center.gap-2 > span';
                const avgKDR = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-main > div.area-main-stats > div.v3-card.segment-stats > div.v3-card__body.v3-card__body--v2\\.5 > div.giant-stats > div:nth-child(2) > div > div.numbers > span.flex.items-center.gap-2 > span';
                const headshotPct = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-main > div.area-main-stats > div.v3-card.segment-stats > div.v3-card__body.v3-card__body--v2\\.5 > div.giant-stats > div:nth-child(3) > div > div.numbers > span.flex.items-center.gap-2 > span';
                const topAgent = '#app > div.trn-wrapper > div.trn-container > div > main > div.min-h-\\[80vh\\].flex.flex-col > div > div.v3-site-container.v3-grid.pb-6 > div.min-h-100 > div > div.area-main > div.top-agents.area-top-agents > div > div > div > div.st-content > div > div:nth-child(1) > div.st__item.st-content__item-value.st__item--sticky.st__item--wide > div.info > div.value';

                try {
                    await page.waitForSelector(currentRank, { timeout: 10000 });
                } catch (e) {
                    // ignore timeout / not found
                }

                const selectors = { currentRank, peakRank, topRole, avgDamage, avgKDR, headshotPct, topAgent };
                const scraped = await page.evaluate((sels) => {
                    const out = {};
                    for (const key in sels) {
                        try {
                            const sel = sels[key];
                            const el = document.querySelector(sel);
                            const text = el ? el.textContent.replace(/\s+/g, ' ').trim() : null;
                            out[key] = { value: text, found: !!el };
                        } catch (err) {
                            out[key] = { value: null, error: String(err) };
                        }
                    }
                    return out;
                }, selectors);

                // Add a username field for clarity
                scraped.username = username.split('#')[0];

                scraped.url = url;
                nodecg.log.info('Scraped data: ' + JSON.stringify(scraped, null, 2));
                playerData.value = scraped;
            } finally {
                if (browser) {
                    try { await browser.close(); } catch (e) { /* ignore close errors */ }
                }
            }
        } catch (e) {
            nodecg.log.error(e);
        }
    });
};
