const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (nodecg) {
    const testReplicant = nodecg.Replicant("test-replicant");

    // Listen for update msg
    nodecg.listenFor("testMessage", async query => {
        // Log
        nodecg.log.info(`Received Query = ${query}`);
        // mon cul
        // testReplicant.value = "Le caca est cuit !";

        try {
            const config = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            };
            const apiResponse = await axios.get(`https://tracker.gg/valorant/profile/riot/${query}/overview?platform=pc&playlist=competitive`, config);

            nodecg.log.info(`Status : ${apiResponse.status}`);
        } catch (e) {
            nodecg.log.error(e);
        }
    });
};
