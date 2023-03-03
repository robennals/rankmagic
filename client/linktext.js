import React from 'react'
import {View, Text, Platform} from 'react-native'
import * as Linking from 'expo-linking';

import _ from 'lodash'
import { baseColor } from '../data/config';
import { useCustomNavigation } from './shim';

const urlExpr = /((http:\/\/)|(https:\/\/))?[-a-zA-Z0-9.-]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
export const urlRegex = new RegExp(urlExpr);

const tagExpr = /@[A-Z][a-z]*( [A-Z][a-z]*)?/
export const tagRegex = new RegExp(tagExpr);


function LinkTextLink({url, children, linkColor}) {
  if (Platform.OS != 'web') {
    return <Text style={{color: linkColor, textDecorationLine: 'underline'}} onPress={()=>Linking.openURL(url)}>{children}</Text>
  } else {
    return <a target='_blank' rel='noreferrer' style={{color: linkColor, textDecoration: 'underline'}} href={url}>{children}</a>
  }
}

function TaggedName({children}) {
  const navigation = useCustomNavigation();
  return <Text style={{color: baseColor}} onPress={() => navigation.goBack()}>{children}</Text>
}

function trimUrl(url) {
  if (url.length > 40) {
    return url.slice(0,40)+'...'
  } else {
    return url;
  }
}

function addPrefixToUrl(url) {
  if (!_.startsWith(url,'http')) {
    return 'http://' + url;
  } else {
    return url;
  }
}

function removeTrailingPeriod(url) {
  if (url[url.length - 1] == '.') {
    return url.slice(0,-1);
  } else {
    return url;
  }
}

export function LinkText({text, style, linkColor}) {
  if (!text) return null;
  const m = text.match(urlRegex);
  if (m && m.length > 0) {
    const url = m[0];
    const linkUrl = removeTrailingPeriod(addPrefixToUrl(url));
    const start = text.lastIndexOf(url);
    const before = text.slice(0,start);
    const after = text.slice(start + url.length);
    return (
      <Text style={style}>
        {before}
        <LinkTextLink style={style} linkColor={linkColor} url={linkUrl}>{trimUrl(url)}</LinkTextLink>
        <LinkText style={style} linkColor={linkColor} text={after} />
        {/* {after} */}
      </Text>
    )
  } 
  const n = text.match(tagRegex);
  if (n && n.length > 0) {
    const name = n[0];
    const start = text.lastIndexOf(name);
    const before = text.slice(0,start);
    const after = text.slice(start + name.length);
    return (
      <Text style={style}>
        {before}
        <TaggedName>{name}</TaggedName>
        <LinkText style={style} linkColor={linkColor} text={after} />
        {/* {after} */}
      </Text>
    )
  }


  return <Text style={style}>{text}</Text>
}