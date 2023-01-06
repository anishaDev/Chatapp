import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {theme} from './theme';

const Message = ({time, isLeft, message, coverImage}) => {
  let timeStore = JSON.parse(time);
  let date = new Date(timeStore);

  let hour = date.getHours();
  const day = hour >= 12 ? 'PM' : 'AM';
  let mintues = date.getMinutes();
  const [modalVisible, setModalVisible] = useState(false);
  const isOnLeft = type => {
    if (isLeft && type === 'messageContainer') {
      // console.log(isLeft,"--->")
      return {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderTopLeftRadius: 0,
      };
    } else if (isLeft && type === 'message') {
      return {
        color: '#000',
      };
    } else if (isLeft && type === 'time') {
      return {
        color: 'darkgray',
      };
    } else if (isLeft && type === 'coverImage') {

      return {
        alignSelf: 'flex-start',
        color: 'darkgray',
      };
    } else {
      return {
        borderTopRightRadius: 0,
      };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.messageContainer, isOnLeft('messageContainer')]}>
        <View style={styles.messageView}>
          <Text style={[styles.message, isOnLeft('message')]}>{message}</Text>
        </View>
        <View style={styles.timeView}>
          <Text
            style={[
              styles.time,
              isOnLeft('time'),
            ]}>{`${hour}:${mintues}${day}`}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View >
          <Image
            style={[styles.image,isOnLeft('coverImage')]}
            source={{uri: coverImage}}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        // transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}>
       
          <View>
            <Image
              style={styles.image1}
              source={{uri: coverImage}}
              resizeMode="contain"
            />
         
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  messageContainer: {
    backgroundColor: theme.colors.messageBackground,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  messageView: {
    backgroundColor: 'transparent',
    maxWidth: '80%',
  },
  timeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  message: {
    color: '#fff',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  time: {
    color: 'lightgray',
    alignSelf: 'flex-end',
    fontSize: 10,
  },
  image: {
    alignSelf: 'flex-end',
    width: 180,
    height: 180,
    marginTop:10,
  },
  image1: {
 
    width: '100%',
    height: '100%',
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 4.85,
    shadowOpacity: 4.15,
    paddingTop: 20,
    borderTopColor: '#D5D5D5',
    borderLeftColor: '#D5D5D5',
    borderRightColor: '#D5D5D5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    // top: 50,
    //   bottom:140,
  },
});
