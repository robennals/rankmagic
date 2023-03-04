const FS = require('fs');

const testFolder = './tests/';
const fs = require('fs');
const Entities = require('html-entities');

function getAllToots() {
    const folder = 'cached/toots';
    var allToots = [];
    fs.readdirSync(folder).forEach(filename => {
        // console.log(filename);
        const cachedJson = FS.readFileSync(folder + '/' + filename).toString();
        const tootsInFile = JSON.parse(cachedJson);
        allToots = [...allToots, ...tootsInFile];
        // console.log('toots so far', allToots.length);
    })
    return allToots;
}

// not including reblogs as activity for filter, since some media bots seem to reblog each other
function shouldKeepToot(toot) {
    return toot.language == 'en' && toot.sensitive == false && !toot.in_reply_to_id && toot.media_attachments.length == 0
        && (toot.replies_count || toot.favourites_count);
}

function filterDups(toots) {
    var seen = {};
    var keep = [];
    toots.forEach(toot => {
        if (!seen[toot.id]) {
            keep.push(toot);
            seen[toot.id] = true;
        }
    })
    return keep;
}

function stripHtml(html) {
    var text = html.replace(/<p>/g, '\n');
    text = text.replace(/<br>/g, '\n');
    text = Entities.decode(text);
    text = text.replace(/<\/?[^>]+(>|$)/g, "");
    return text;
}

function createScoredToot(toot, {positive, political}) {
    console.log('political', political[toot.id], political[toot.id] != 'No political topics');
    console.log('negative', positive[toot.id], positive[toot.id] == 'negative');

    return {
        id: toot.id,
        text: stripHtml(toot.content),
        html: toot.content,
        account: {
            display_name: toot.account.display_name,
            acct: toot.account.acct,
            avatar: toot.account.avatar,
        },
        followers: toot.account.followers_count,
        bot: toot.account.bot,
        replies: toot.replies_count,
        reblogs: toot.reblogs_count,
        likes: toot.favourites_count,
        disrespectful: positive[toot.id] == 'negative' ? 1 : 0,
        political: political[toot.id] != 'No political topics' ? 1 : 0,
        date: new Date(toot.created_at).valueOf()
    }
}


function parseGptFeature(featureText) {
    var feature = {};
    featureText.split('\n').forEach(line => {
        if (line.trim()) {
            const [key, result] = line.trim().split(':');
            feature[key] = result;
        }        
    })
    return feature;
}

function loadGptFeatures() {
    const positive = parseGptFeature(FS.readFileSync('gptresults/positive.feature').toString())
    const political = parseGptFeature(FS.readFileSync('gptresults/political.feature').toString());
    return {positive, political}
}


function scoreToots() {
    const allToots = getAllToots();
    const gptFeatures = loadGptFeatures();
    const filtered = allToots.filter(toot => shouldKeepToot(toot));
    const notDups = filterDups(filtered);
    const scoredToots = notDups.map(toot => createScoredToot(toot, gptFeatures));
    console.log('toots left after filtering', notDups.length);
    const jsonString = JSON.stringify(scoredToots, null, 2);
    const javascriptContent = 'exports.scoredToots = ' + jsonString;
    FS.writeFileSync('cached/scored.js', javascriptContent);
    console.log('written file');
}

scoreToots();
