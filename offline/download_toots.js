
const FS = require('fs');
const fetch = require('node-fetch');
const { transferableAbortController } = require('util');


async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    return data;
}

async function getToots({maxId}) {
    const url = 'https://mastodon.social/api/v1/timelines/public?limit=40&max_id=' + maxId;
    console.log('url', url);
    return fetchJson(url);
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchWithCacheAsync({url, filename}) {
    console.log('filename', filename);
    if (FS.existsSync(filename)) {
        console.log('file exists');
        const cachedJson = FS.readFileSync(filename).toString();
        return JSON.parse(cachedJson);
    } else {
        console.log('need to fetch ', url);
        await sleep(500);
        const json = await fetchJson(url);
        const jsonString = JSON.stringify(json, null, 2);
        // console.log('get json', json);
        FS.writeFileSync(filename, jsonString);
        console.log('written file');
        return json;
    }
}

// const maxId = 109943000000000000;
const maxId = 109943700000000000;


async function getLotsOfTootsAsync({countWanted}) {
    var countSoFar = 0;
    var currentMaxId = maxId;
    while(countSoFar < countWanted) {
        const url = 'https://mastodon.social/api/v1/timelines/public?limit=40&max_id=' + currentMaxId;
        const filename = 'cached/toots/' + currentMaxId + '.json';
        console.log('fetching toots: ', countWanted - countSoFar, 'remaining')
        const toots = await fetchWithCacheAsync({url, filename})
        console.log('got ', toots.length, 'toots');
        const oldestToot = toots[toots.length - 1];
        currentMaxId = oldestToot.id - 1;
        countSoFar = countSoFar + toots.length;
    }
}

getLotsOfTootsAsync({countWanted:10000});


