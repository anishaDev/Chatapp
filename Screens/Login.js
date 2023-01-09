import { StyleSheet, Text, View,Image,TextInput,BackHandler,Alert,TouchableOpacity } from 'react-native'
// import messaging from '@react-native-firebase/messaging';
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useState, useEffect} from 'react';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';

const Login = ({navigation}) => {




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    GoogleSignin.configure({
      scopes: [],
      webClientId:
      "1038208376342-9ehf684dp3e8q3ka6jkbnj77ir3gqoe7.apps.googleusercontent.com",
      offlineAccess: false,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
      iosClientId: '',
    });
  }, []);
  const storeUid = async uid => {
    await AsyncStorage.setItem('googleUser', uid);
  
    navigation.navigate('Home');
  };



  async function onGoogleButtonPress() {
    let Token = await AsyncStorage.getItem('fcmToken',Token)
    console.log(Token,"-->asynctoken")
    GoogleSignin.hasPlayServices().then(async () => {
      GoogleSignin.signIn()
      .then(response => {
          console.log(response);
          const credential = firebase.auth.GoogleAuthProvider.credential(
            response.idToken,
          );
          auth()
            .signInWithCredential(credential)
            .then(res => {
              console.log(res.additionalUserInfo.profile, 'res-->');
              const isNewUser = res.additionalUserInfo.isNewUser;
              const {
                first_name,
                given_name,
                last_name,
                family_name,
                email_verified,
                picture,
               
                 } = res.additionalUserInfo.profile;
              const {uid, email,} = res.user._user;
              const userData = {
                token:Token,
                id: uid,
                email: email,
                username: email.replace('@gmail.com', ''),
                firstName: first_name ? first_name : given_name,
                lastName: last_name ? last_name : family_name,
                emailVerified: email_verified,
                userProfilePic: picture,
                createdAt: firestore.FieldValue.serverTimestamp(),
              };
                firestore()
                .collection('gmailList')
                .doc(uid)
                .set(userData)
                .then(elem => {})
                .catch(err => {
                  console.log(err);
                });
                
              storeUid(uid);

              // }
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    });
  }
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


  return (
    <View style={styles.container}>
      <Image  source={require("../src/assets/login1.jpg")}
      style={styles.backImage}
      />
      <View style={styles.whiteSheet}>
        <View style={{marginHorizontal:10,marginVertical:20,justifyContent:'center',alignItems:'center'}}>
      <TextInput
        value={email}
        placeholder="Email"
        placeholderTextColor="#fff"
        style={styles.primaryInput}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        value={password}
        placeholder="Password"
        placeholderTextColor="#fff"
        style={styles.primaryInput}
        onChangeText={text => setPassword(text)}
      />
      </View>
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
          bottom:15,
          borderWidth:1,
          borderColor:'#fff'

        }}
        onPress={null}>
        <Text style={{fontSize: 18, color: '#fff'}}>LogIn</Text>
      </TouchableOpacity>
      </View>
         <View style={{
          width: '84%',
          height: 50,
          backgroundColor: 'transparent',
          borderRadius: 10,
          // marginTop: 30,
          justifyContent: 'flex-end',
          alignItems: 'center',
          alignSelf: 'center',
          bottom:15,
          // borderWidth:1,
          // borderColor:'#fff',
          flex:1,
          
          // position:'absolute',

        }}>
        <GoogleSigninButton
          style={{width: 312, height: 48,borderRadius:50,  }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onGoogleButtonPress}
        />
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    // justifyContent:'center',
    // alignItems:'center',

  },
  backImage:{
    width:"100%",
    height: 280,
    position:'absolute',
    top:0,
    resizeMode:'contain'
  },
  whiteSheet:{
    width:"100%",
    height:"65%",
    position:'absolute',
    backgroundColor:'#013455',
    borderTopLeftRadius:60,
    bottom:0,
  },
  primaryInput: {
    width: '80%',
    margin: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: 'gray',
    color:'white',
  
 },



})