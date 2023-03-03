import { Entypo, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// import RenderHTML from 'react-native-render-html';
import { getTootsAsync } from './data';
// import { LinkText } from './linktext';
import { scoredToots } from './scored';
// import HTMLView from 'react-native-htmlview';


export default function App() {
  const [toots, setToots] = useState();
  const [expanded, setExpanded] = useState(true);

  console.log('scoredToots', scoredToots);

  // async function updateToots() {
  //   setToots(filterToots(await getTootsAsync()));
  // }

  const topToots = scoredToots.slice(0, 20);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text>This is the awesome toot ranker</Text>
      {/* <Button onPress={updateToots} title='Get Toots'/> */}
      <ScrollView style={{flex: 1, flexShrink: 1, margin: 4}}>
        {topToots.map(toot => 
          <Toot key={toot.id} toot={toot} />
        )}
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
          {textLines.map(line => 
            <Text key={line} style={{marginVertical: 2, lineHeight: 17}}>{line}</Text>
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
        <Text style={tootStatStyle.count}>{toot.account.followers}</Text>
      </View>

    </View>
  )
}


function RankingSliders({rankingWeights, setRankingWeights}) {

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
