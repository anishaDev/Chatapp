import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
// import Moment from 'react-moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import {theme} from './theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Message from '../Screens/Message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiPicker from 'rn-emoji-keyboard';
import storage from '@react-native-firebase/storage';
let oldCoverImageURL;
const Chat = ({navigation, ...props}) => {

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    console.log(result);
  };

  function onUploadImage() {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      data => setCoverImg(data.assets[0].uri),
    );
    console.log(setCoverImg);
  }

  async function upladCoverImg(GoogleId) {
    const splitPath = coverImg.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const reference = storage().ref(`/${GoogleId}/images/${imageName}`);
    const data = await reference.putFile(coverImg);
    return await storage().ref(data.metadata.fullPath).getDownloadURL();
  }

  const [coverImg, setCoverImg] = useState(null);
  const [height, setHeight] = useState();
  const pressHandler = () => {
    navigation.navigate('Home');
  };
  const route = useRoute();
  const {firstName, userProfilePic, id} = route.params;
  const [isOpen, setIsOpen] = useState(false);
  const [textmessage, setTextMessage] = useState('');
  const [GoogleId, setGoogleId] = useState('');
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'hello',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React native',
  //       },
  //     },
  //   ]);
  // }, []);

  const user = useRef(0);
  const scrollView = useRef();

  const userChat = async () => {
    let id = await AsyncStorage.getItem('googleUser');
    setGoogleId(id);
  };
  const combinedid = GoogleId > id ? GoogleId + '-' + id : id + '-' + GoogleId;

  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      userChat();
      getChatList();
    }
  }, [combinedid]);

  const getChatList = () => {
    const querySnapShot = firestore()
      .collection('chatRoom')
      .doc(combinedid)
      .collection('messages')
      .orderBy('createdAt', 'asc');
    querySnapShot.onSnapshot(snapShot => {
      const allMessages = snapShot.docs.map(snap => {
        const data = snap.data();
        if (data.createdAt) {
          return {...snap.data(), createdAt: new Date()};
        } else {
          return {...snap.data(), createdAt: new Date()};
        }
      });
      console.log(allMessages, '-->?');
      setMessages(allMessages);
      // console.log(allMessages, 'allmsg-->');
    });
  };

  //ADD TO FIRESTORE
  const onSend = async item => {
    const downloadURL = await upladCoverImg(GoogleId);
    setTextMessage('');
    
    const myMsg = {
      time: new Date().getHours(),
      text: textmessage,
      senderId: GoogleId,
      coverImage: downloadURL,
      receiverId: id,
      createdAt: new Date(),
      user: {
        _id: GoogleId,
      },
    };
    firestore()
      .collection('chatRoom')
      .doc(combinedid)
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    getChatList();
  };

  const renderItem = ({item, index}) => {
    // console.log(item, '-->');
    return (
      <Message
        key={index}
        time={JSON.stringify(item.createdAt)}
        isLeft={item.senderId != GoogleId}
        message={item.text}
        coverImage={item.coverImage}
      />
    );
  };

  const handlePick = emoji => {
    console.log(emoji, 'emoji===>');
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => pressHandler()}>
          <AntDesign name="left" size={25} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileAndOptions}>
          <TouchableOpacity style={styles.profile}>
            <Image
              style={styles.image}
              source={{uri: userProfilePic}}
              resizeMode="contain"
            />
            <View style={styles.usernameAndOnlineStatus}>
              <Text style={styles.username}>{firstName}</Text>
              <Text style={styles.onlineStatus}>online</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.options}>
            <TouchableOpacity style={{paddingHorizontal: 5}}>
              <AntDesign name="setting" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    
      <FlatList
        style={{flex: 1, backgroundColor: theme.colors.white}}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        // inverted
        showsVerticalScrollIndicator={false}
      />
      {coverImg ?   
       (<View style={{flexDirection: 'row', margin: 20}}>
        <Image
          style={styles.image}
          source={{uri: coverImg}}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.touchabelBtn}>
          <Text
            style={{
              width: 200,
              marginHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
              color: '#000',
            }}>
            Selected Image
          </Text>
        </TouchableOpacity>
      </View>):(null)
      }
  
 

      <View style={styles.container1}>
        <View style={styles.innerContainer}>
          <View style={styles.inputAndMicrophone}>
            {/* <EmojiPicker
      onEmojiSelected={(emoji) =>handlePick()}
      open={isOpen}
      onClose={() => setIsOpen(false)} /> */}
            <TouchableOpacity style={styles.emoticonButton}>
              <Entypo
                name="emoji-happy"
                color={theme.colors.description}
                size={20}
              />
            </TouchableOpacity>
            <TextInput
              // {...props}
              multiline={true}
              placeholder="Message"
              placeholderTextColor="#000"
              onContentSizeChange={event => {
                setHeight(event.nativeEvent.contentSize.height);
              }}
              style={[styles.input, {height: height}]}
              onChangeText={text => setTextMessage(text)}
              value={textmessage}
            />

            <TouchableOpacity
              onPress={() => {
                onUploadImage();
              }}
              style={styles.rightIconButtonStyle}>
              <AntDesign
                name="paperclip"
                color={theme.colors.description}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openCamera();
              }}
              style={styles.rightIconButtonStyle}>
              <Entypo
                name="camera"
                color={theme.colors.description}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onSend} style={styles.sendButton}>
            <Icon
              name={textmessage ? 'send' : 'microphone'}
              color={theme.colors.white}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#12558a',
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  profileAndOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 4,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 32.5,
  },
  usernameAndOnlineStatus: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineStatus: {
    color: '#fff',
    fontSize: 14,
  },
  options: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container1: {
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    height: 60,
  },
  innerContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  inputAndMicrophone: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputs: {
    minHeight: 40,
    marginLeft: 16,
    paddingTop: 10,
    overflow: 'hidden',
    padding: 15,
    paddingRight: 25,
    borderBottomColor: '#000000',
    flex: 1,
    position: 'absolute',
    width: '100%',
    color: theme.colors.inputText,
  },
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    color: theme.colors.inputText,
    flex: 3,
    maxHeight: 100,
    alignSelf: 'center',
    fontSize: 12,
  },
  rightIconButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
  },
  emoticonButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  uploadBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    elevation: 10,
  },
});
