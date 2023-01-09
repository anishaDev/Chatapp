import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import {useSelector, useDispatch} from 'react-redux';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
const {height, width} = Dimensions.get('screen');
const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const User_List = useSelector(state => state.getFbdata.userList);

  const signOut = async () => {
    GoogleSignin.signOut();
    AsyncStorage.clear();
    navigation.navigate('Login');
  };
  // const navigation = useNavigation();
  // const pressHandler = () => {
   
  //   navigation.navigate('Chat',{username:item.username});
  // };
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      CheckEmail();
    }
  }, [focus]);
  const CheckEmail = async () => {
    const GoogleId = await AsyncStorage.getItem('googleUser');

    if (GoogleId !== null) {
      navigation.navigate('Home');
      const login_Userlist = await firestore().collection('gmailList').get();

      const data = login_Userlist._docs.map(item => {
        return item._data;
      });
   

      dispatch({
        type: 'FB_USER_LIST',
        payload: data.filter(itm => itm.id !== GoogleId),
      });
    } else {
      navigation.navigate('Login');
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
       style={{flex:1,justifyContent:'center',alignItems:'center',}}
       onPress={() => navigation.navigate('Chat',{firstName:item.firstName,userProfilePic:item.userProfilePic,id:item.id})}

       >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          height: 80,
          width: width - 15,
          backgroundColor: '#cfd3e3',
          marginHorizontal: 10,
          borderRadius: 20,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View style={{height: 60, width: 60}}>
            <Image
              source={{uri: item.userProfilePic}}
              style={{width: '100%', height: '100%', borderRadius: 100}}
              resizeMode="contain"
            />
          </View>
          <View style={{}}>
            <View
              style={{
                width: width * 0.6,
                top: 5,
                alignSelf: 'center',
                marginHorizontal: 5,
              }}>
              <Text style={{color: 'black', fontSize: 16, fontWeight: '500'}}>
                {item.firstName}
              </Text>
            </View>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={User_List}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity
        style={{
          width: '84%',
          height: 50,
          backgroundColor: '#12558a',
          borderRadius: 10,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          bottom: 15,
          borderWidth: 1,
          borderColor: '#fff',
        }}
        onPress={signOut}>
        <Text style={{fontSize: 18, color: '#fff'}}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
