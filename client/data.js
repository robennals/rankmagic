

export async function getTootsAsync() {
    const actionUrl = 'https://mastodon.social/api/v1/timelines/public?limit=10';
    const response = await fetch(actionUrl, {
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    console.log('got response JSON', data);
    return data;
}

