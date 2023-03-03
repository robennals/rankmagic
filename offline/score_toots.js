const FS = require('fs');

const testFolder = './tests/';
const fs = require('fs');

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

function stripHtml(html) {
    var text = html.replace(/<p>/g, '\n');
    text = html.replace(/<br>/g, '\n');
    text = text.replace(/<\/?[^>]+(>|$)/g, "");
    return text;
}

function createScoredToot(toot) {
    return {
        id: toot.id,
        text: stripHtml(toot.content),
        html: toot.content,
        account: {
            display_name: toot.account.display_name,
            acct: toot.account.acct,
            avatar: toot.account.avatar,
        },
        bot: toot.account.bot,
        followers: toot.account.followers_count,
        replies: toot.replies_count,
        reblogs: toot.reblogs_count,
        likes: toot.favourites_count,
        date: new Date(toot.created_at).valueOf()
    }
}

function scoreToots() {
    const allToots = getAllToots();
    const filtered = allToots.filter(toot => shouldKeepToot(toot));
    const scoredToots = filtered.map(toot => createScoredToot(toot));
    console.log('toots left after filtering', filtered.length);
    const jsonString = JSON.stringify(scoredToots, null, 2);
    FS.writeFileSync('cached/scored.json', jsonString);
    console.log('written file');
}

scoreToots();
