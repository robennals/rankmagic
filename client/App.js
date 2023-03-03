import { Entypo, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { getTootsAsync } from './data';
// import HTMLView from 'react-native-htmlview';


export default function App() {
  const [toots, setToots] = useState();

  async function updateToots() {
    setToots(filterToots(await getTootsAsync()));
  }

  return (
    <View style={styles.container}>
      <Text>This is the awesome toot ranker</Text>
      <Button onPress={updateToots} title='Get Toots'/>
      <StatusBar style="auto" />
      {toots ? 
        <ScrollView>
          {toots.map(toot => 
            <Toot key={toot.id} toot={toot} />
          )}
        </ScrollView>
        : null}
    </View>
  );
}

function filterToots(toots) {
  return toots.filter(toot => toot.language == 'en' && toot.sensitive == false && !toot.in_reply_to_id);
}

function Toot({toot}){
  const [expanded, setExpanded] = useState(false);
  const date = new Date(toot.created_at);
  const formattedDate = date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})

  return (
    <View style={{flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 16, paddingBottom: 16}}>
      <Image source={toot.account.avatar} style={{width: 48, height: 48, borderRadius: 24, marginRight: 16}}/>
      <View style={{maxWidth: 450, overflow: 'hidden'}}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={{fontWeight: 'bold'}}>{toot.account.display_name}</Text>
          <Text style={{color: '#999', fontSize: 13}}> - {formattedDate}</Text>
          {/* <Text style={{color: '#999'}}>({toot.account.followers_count})</Text> */}
        </View>
        <RenderHTML source={{html: toot.content}} contentWidth={450} defaultTextProps={{selectable:true}} />
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
        <Text style={tootStatStyle.count}>{toot.replies_count}</Text>
      </View>
      <View style={tootStatStyle.state}>
        <Entypo name='loop' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.reblogs_count}</Text>
      </View>
      <View style={tootStatStyle.state}>
        <FontAwesome name='heart' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.favourites_count}</Text>
      </View>      
      <View style={tootStatStyle.state}>
        <FontAwesome name='user' style={tootStatStyle.icon} />
        <Text style={tootStatStyle.count}>{toot.account.followers_count}</Text>
      </View>

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
});
