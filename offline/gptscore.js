const FS = require('fs');
const fetch = require('node-fetch');
const { scoredToots } = require('./cached/scored');

const keys = require('./keys');

async function callOpenAIAsync({action, data}) {
    const url = 'https://api.openai.com/v1/' + action;
    const response = await fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + keys.OPENAI,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })        
    return await response.json();
}

async function testCompletionAsync() {
    const result = await callOpenAIAsync({action: 'completions', data: {
        'model': 'text-davinci-003',
        'prompt': 'Say this is a test'
    }})
    console.log('result', result);
}

async function callChatAsync({messages}) {
    const result = await callOpenAIAsync({action: 'chat/completions', data: {
        temperature: 0,
        model: 'gpt-3.5-turbo-0301',
        max_tokens: 32,
        messages
    }});
    console.log('result', result);
    console.log(result.choices[0].message.content);
    return result.choices[0].message.content;
}

async function testChatAsync() {
    const result = await callChatAsync({messages: [
            // {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}
        ]
    })
    console.log('result', result);
}

async function scoredTootTextAsync({feature, text}) {
    const strippedText = text.replace(/\n/g,' ');
    const prompt = FS.readFileSync('gptprompts/' + feature + '.prompt').toString();
    const message = prompt + '\nTweet: ' + strippedText + '\nYou:';
    console.log('Tweet', strippedText);
    // console.log('message:', message);
    const result = await callChatAsync({messages: [
        {role: 'user', 'content': message},
        // {role: 'user', 'content': prompt + '\nTweet: ' + text + '\nYou:'},
    ]})
    console.log('result', result);
    return result;
}

const tootThousand = 'Just hangin around imagining how it’d be if all the people who live their lives according to a 2,000 year old text decided to start adhering to stuff we as beings have come to understand as scientific truth in say like the last fifty or so years';
const tootScott = 'I watched the youtube clip where Scott Adams did his racist star turn, and another where he "explained" himself. It seemed clear that he knew he would lose the strip. He was quite deliberate about it. More like a career move than an outburst. Planned cancelling. Not the quiet part said out loud, but the loud part delivered quietly and calmly.'
const tootTrump = "Jimmy Carter's most important legacy is probably his least well known. Before Carter, 3.6 million people per year were infected by Guinea Worm, a neglected tropical disease. Today, that's down to *13* cases per year, a reduction of 99.99%. And it throws his post-presidency into stark relief from Trump's who is golfing and ranting on social media while trying to get richer. https://brianklaas.substack.com/p/jimmy-..."
const tootApple = 'On March 7th and 8th Apple are hosting free, in-person events at their shiny new developer center in Cupertino! Both are full-day events, and they look wonderful'
const tootMastodon = "Thank you @Gargron for your superhuman commitment to the fediverse and all it stands for. Mastodon goes beyond the realm of software and into the realm of movement. I'm so excited to be part of it."
const tootTwitter = 'A reminder to all the hangers on still using the wretched bird site: Twitter was never a public square. It was the private property of a for-profit business that was beholden to no one other than its shareholders. Now it has been taken over by a sociopath. Get over it. Move on!'

async function testTootScoreAsync() {
    const result = await scoredTootTextAsync({feature: 'positive', 
        text: tootTwitter
        // text: 'Just hangin around imagining how it’d be if all the people who live their lives according to a 2,000 year old text decided to start adhering to stuff we as beings have come to understand as scientific truth in say like the last fifty or so years'
    });
    console.log('result', result);   
}

async function scoreTootsAsync({toots, maxCount, feature}) {
    const doneAlready = FS.readFileSync('gptresults/' + feature + '.feature').toString();
    const doneLines = doneAlready.split('\n');
    const doneScore = {};
    console.log('lines', doneLines);
    doneLines.forEach(line => {
        console.log('line', line);
        if (line.trim()) {
            const [key, result] = line.trim().split(':');
            doneScore[key] = result;
        }
    });
    console.log('doneScore', doneScore);
    var countRemaining = maxCount;
    for(toot of toots) {
        if (countRemaining > 0 && !doneScore[toot.id]) {
            countRemaining = countRemaining - 1;
            const result = await scoredTootTextAsync({feature, text: toot.text});
            FS.appendFileSync('gptresults/' + feature + '.feature', toot.id + ':' + result + '\n');
        }
    }
}

// scoreTootsAsync({toots: scoredToots, maxCount: 1000, feature: 'positive'});

scoreTootsAsync({toots: scoredToots, maxCount: 1000, feature: 'political'});

// testTootScoreAsync();


