import { Entypo, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import RenderHTML from 'react-native-render-html';
import { getTootsAsync } from './data';
import { LinkText } from './linktext';
import { rankToots } from './ranking';
import { scoredToots } from './scored';
import { Slider } from './shim';
// import Slider from 'react-native-slider';

// import HTMLView from 'react-native-htmlview';


console.log('Slider', Slider);


export default function App() {
  const [expanded, setExpanded] = useState(true);
  const [likes, setLikes] = useState(0);
  const [reblogs, setReblogs] = useState(0);
  const [replies, setReplies] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [disrespectful, setDisrespectful] = useState(0);
  const [political, setPolitical] = useState(0);
  const [showCount, setShowCount] = useState(20);


  console.log('scoredToots', scoredToots);

  const rankedToots = rankToots({toots: scoredToots, likes, reblogs, replies, followers, political, disrespectful});

  console.log('rankedToots', rankedToots);


  const topToots = rankedToots.slice(0, showCount);
  // const topToots = rankedToots;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.border}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, marginHorizontal: 8}}>
            <Text style={{fontWeight: 'bold', marginRight: 16}}>Ranking Importance</Text>
            <FontAwesome name={expanded ? 'chevron-up' : 'chevron-down'} />
          </View>
        </TouchableOpacity>
        {expanded ? 
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 13, marginTop: 8, marginBottom: 2}}>Engagement</Text>
            <RankingSlider title='Like' value={likes} onChange={setLikes} />
            <RankingSlider title='Reshare' value={reblogs} onChange={setReblogs} />
            <RankingSlider title='Reply' value={replies} onChange={setReplies} />
            <RankingSlider title='Follow' value={followers} onChange={setFollowers} />
            <Text style={{alignSelf: 'center', fontWeight: 'bold', fontSize: 13, marginTop: 8, marginBottom: 2}}>Content</Text>
            <RankingSlider title='Political' value={political} onChange={setPolitical} />
            <RankingSlider title='Disrespectful' value={disrespectful} onChange={setDisrespectful} />
          </View>
        : null}
      </View> 

      {/* <Button onPress={updateToots} title='Get Toots'/> */}
      <ScrollView style={{flex: 1, flexShrink: 1, margin: 4}}>
        {topToots.map(toot => 
          <Toot key={toot.id} toot={toot} />
        )}
        <Button title='Show More Toots' onPress={() => setShowCount(showCount + 200)} />
      </ScrollView>
    </View>
  );
}

function filterToots(toots) {
  return toots.filter(toot => toot.language == 'en' && toot.sensitive == false && !toot.in_reply_to_id);
}

function Toot({toot}){
  const [expanded, setExpanded] = useState(false);
  const date = new Date(toot.date);
  const formattedDate = date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})

  const textLines = toot.text.split('\n');

  return (
    <View style={{flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 16, paddingBottom: 16}}>
      {/* <Image source={toot.account.avatar} style={{width: 48, height: 48, borderRadius: 24, marginRight: 16}}/> */}
      <View style={{maxWidth: 350, overflow: 'hidden', flex: 1, flexShrink: 1}}>
        <View style={{flexDirection: 'row', flex: 1, overflow: 'hidden'}}>
          <Image source={toot.account.avatar} style={{width: 32, height: 32, borderRadius: 16, marginRight: 8}}/>
          <View>
            <Text style={{fontWeight: 'bold'}}>{toot.account.display_name}</Text>
            <Text style={{color: '#999', fontSize: 13}}>{formattedDate}</Text>
          </View>
          {/* <Text style={{color: '#999'}}>({toot.account.followers_count})</Text> */}
        </View>
        <View style={{color: '#222', marginVertical: 8, flexShrink: 1, overflow: 'hidden'}}>
          {textLines.map((line, idx) => 
            <LinkText key={idx} text={line} style={{marginVertical: 2, lineHeight: 17}} />
            // <Text key={line} style={{marginVertical: 2, lineHeight: 17}}>{line}</Text>
          )}
        </View>
        {/* <Text style={{color: '#222', marginTop: 8, marginBottom: 8, flexShrink: 1, overflow: 'hidden'}}>
          {toot.text}
        </Text> */}
        {/* <LinkText text={toot.text} style={{color: '#222', marginTop: 4, marginBottom: 8}} /> */}
        {/* <RenderHTML source={{html: toot.te``}} contentWidth={450} defaultTextProps={{selectable:true}} /> */}
        <TootStats toot={toot} />
      </View>
    </View>
  )
}


const tootStatStyle = StyleSheet.create({
  state: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginRight: 32
  },
  icon: {
    size: 16,
    color: '#999',
    marginRight: 4
  },
  count: {
    color: '#999'
  }
  
})

function TootStats({toot}) {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={tootStatStyle.state}>
        <FontAwesome name='reply' style={tootStatStyle.icon}/>       
        <Text style={tootStatStyle.count}>{toot.replies}</Text>
      </View>
      <View style={tootStatStyle.state}>
        <Entypo name='loop' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.reblogs}</Text>
      </View>
      <View style={tootStatStyle.state}>
        <FontAwesome name='heart' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.likes}</Text>
      </View>      
      <View style={tootStatStyle.state}>
        <FontAwesome name='user' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.followers}</Text>
      </View>

    </View>
  )
}


function RankingSlider({title, value, onChange}) {
  return (
    <View style={{flexDirection: 'row', marginHorizontal: 8}}>
      <Text style={{textAlign: 'right', fontSize: 14, color: '#222', marginRight: 8}}>{title} ({value})</Text>
      <Slider
            value={value}
            onChange={onChange}
            style={{}}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderColor: '#ddd',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    margin: 8
  }
});
