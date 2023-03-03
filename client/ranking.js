
import _ from 'lodash';

const divisors = {
    likes: 10,
    reblogs: 10,
    replies: 10,
    followers: 100000
}

const features = ['likes', 'replies', 'reblogs', 'followers']

function scoreTootFeature({toot, feature}) {
    const normalized = toot[feature]/divisors[feature];
    const squashed = Math.tanh(normalized);
    return squashed;
}

function scoreToot({toot, weights}){
    var totalScore = 0;
    features.forEach(feature => {
        const featureWeight = weights[feature];
        const featureScore = scoreTootFeature({toot, feature, weights});
        totalScore = totalScore + featureWeight * featureScore;
    })
    return totalScore;
}

function scoreAllToots({toots, weights}) {
    var scores = {};
    toots.forEach(toot => {
        const score = scoreToot({toot, weights});
        scores[toot.id] = score;
    })
    return scores;
}

export function rankToots({toots, likes, reblogs, replies, followers}) {    
    const weights = {likes, reblogs, replies, followers};
    const scores = scoreAllToots({toots, weights});
    console.log('weights', weights);
    console.log('scores', scores);
    const sortedToots = _.sortBy(toots, toot => scores[toot.id]).reverse();
    return sortedToots;
}



