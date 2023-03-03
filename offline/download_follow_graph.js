

const FS = require('fs');
const fetch = require('node-fetch');


async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    return data;
}

async function getFollowingAsync({id}) {
    const url = 'https://mastodon.social/api/v1/accounts/' + id + '/following';
    console.log('url', url);
    return fetchJson(url);
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


async function getOrLoadFollowingAsync({id}) {
    console.log('getting followers for ' + id);
    const filename = 'cached/followers/' + id + '.json';
    console.log('filename', filename);
    if (FS.existsSync(filename)) {
        console.log('file exists');
        const cachedJson = FS.readFileSync(filename).toString();
        return JSON.parse(cachedJson);
    } else {
        console.log('need to download');
        await sleep(500);
        const json = await getFollowingAsync({id});
        // console.log('json', json);
        const jsonString = JSON.stringify(json);
        FS.writeFileSync(filename, jsonString);
        console.log('written file');
        return json;
    }
}

async function grabSecondDegreeFollowingAsync({seedId}) {
    const seen = {};
    const topFollowing = await getOrLoadFollowingAsync({id: seedId});
    for (const followed of topFollowing) {
        // console.log('follower', follower);
        seen[followed.id] = true;
        console.log(followed.id, followed.display_name, followed.acct, followed.followers_count);
        const secondFollowing = await getOrLoadFollowingAsync({id: followed.id});
        for (const second of secondFollowing) {
            if (!seen[second.id]) {
                console.log('>>> ', second.id, second.display_name, second.acct, second.followers_count);
            }

            // if (!seen[secondFollowed.id]) {
            //     seen[follower.id] = true;                
            //     const thirdFollowing = await getOrLoadFollowingAsync()            

            // }
        }
    }


}

const eliPariserId = '109236433339564533'

grabSecondDegreeFollowingAsync({seedId: eliPariserId});
// getOrLoadFollowersAsync({id: eliPariserId});


