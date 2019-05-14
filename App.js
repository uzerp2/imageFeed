// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });



// //////////////////////////////////////////////////////////////////////////////
// // 1-ый урок


// import { Platform, StyleSheet, View } from 'react-native';
// // import { Constants } from 'expo';
// import { getStatusBarHeight } from 'react-native-status-bar-height';

// import React from 'react';

// import Feed from './src/1/screens/Feed';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Feed style={styles.feed} />
//       </View>
//     );
//   }
// }

// const platformVersion =
//   Platform.OS === 'ios'
//     ? parseInt(Platform.Version, 10)
//     : Platform.Version;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   feed: {
//     flex: 1,
//     marginTop:
//       Platform.OS === 'android' || platformVersion < 11
//         ? getStatusBarHeight()
//         : 0,
//   },
// });


















//////////////////////////////////////////////////////////////////////////////
// итого

import {
  // AsyncStorage,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
// import { Constants } from 'expo';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import React from 'react';

import Comments from './src/screens/Comments';
import Feed from './src/screens/Feed';


import AsyncStorage from '@react-native-community/async-storage';



const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY';

export default class App extends React.Component {
  state = {
    commentsForItem: {},
    showModal: false,
    selectedItemId: null,
  };

  async componentDidMount() {
    try {
      const commentsForItem = await AsyncStorage.getItem(
        ASYNC_STORAGE_COMMENTS_KEY,
      );

      this.setState({
        commentsForItem: commentsForItem
          ? JSON.parse(commentsForItem)
          : {},
      });
    } catch (e) {
      console.log('Failed to load comments');
    }
  }

  onSubmitComment = async text => {
    const { selectedItemId, commentsForItem } = this.state;
    const comments = commentsForItem[selectedItemId] || [];

    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text],
    };

    this.setState({ commentsForItem: updated });

    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_COMMENTS_KEY,
        JSON.stringify(updated),
      );
    } catch (e) {
      console.log(
        'Failed to save comment',
        text,
        'for',
        selectedItemId,
      );
    }
  };

  openCommentScreen = id => {
    this.setState({
      showModal: true,
      selectedItemId: id,
    });
  };

  closeCommentScreen = () => {
    this.setState({
      showModal: false,
      selectedItemId: null,
    });
  };

  render() {
    const { commentsForItem, showModal, selectedItemId } = this.state;

    return (
      <View style={styles.container}>
        <Feed
          style={styles.feed}
          commentsForItem={commentsForItem}
          onPressComments={this.openCommentScreen}
        />
        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={this.closeCommentScreen}
        >
          <Comments
            style={styles.comments}
            comments={commentsForItem[selectedItemId] || []}
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
          />
        </Modal>
      </View>
    );
  }
}

const platformVersion =
  Platform.OS === 'ios'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    flex: 1,
    marginTop:
      Platform.OS === 'android' || platformVersion < 11
        ? getStatusBarHeight()
        : 0,
  },
  comments: {
    flex: 1,
    marginTop:
      Platform.OS === 'ios' && platformVersion < 11
        ? getStatusBarHeight()
        : 0,
  },
});
