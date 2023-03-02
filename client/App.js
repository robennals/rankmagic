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
  return toots.filter(toot => toot.language == 'en' && toot.sensitive == false);
}

function Toot({toot}){
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={{flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 16, paddingBottom: 16}}>
      <Image source={toot.account.avatar} style={{width: 48, height: 48, borderRadius: 24, marginRight: 16}}/>
      <View style={{maxWidth: 450, maxHeight: expanded ? null : 200, overflow: 'hidden'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: 'bold'}}>{toot.account.display_name}</Text>
        </View>
        <RenderHTML source={{html: toot.content}} contentWidth={450} defaultTextProps={{selectable:true}} />
        {/* <Text>{toot.content}</Text> */}
      </View>
    </View>
  )
  return <Text>Toot: {toot.content}</Text>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
