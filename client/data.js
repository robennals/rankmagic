

export async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    return data;
}

// const maxId = 109943000000000000;
const maxId = 109943700000000000;



export async function getTootsAsync() {
    const actionUrl = 'https://mastodon.social/api/v1/timelines/public?limit=20&max_id=' + maxId;
    const response = await fetch(actionUrl, {
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    console.log('got response JSON', data);
    return data;
}

export async function getFollowingAsync({id}) {
    return fetchJson('https://mastodon.social/api/v1/accounts/' + id + '/following');
}

const getId = 'https://mastodon.social/api/v1/accounts/lookup?acct=@elipariser'
export const eliId = 109236433339564533
const getFollowing = 'https://mastodon.social/api/v1/accounts/109236433339564533/following'


