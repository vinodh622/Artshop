import React,{useEffect} from 'react';
import {View, Text, StatusBar, SafeAreaView, Image,TouchableOpacity} from 'react-native';
import {StylesAll} from "./commanStyle/objectStyle"

import QRCode from 'react-native-qrcode-image';
 
import { Ltout,loginAction,loginPhoneAction} from './actions/loginActions'
import { useDispatch,useSelector } from "react-redux";
import { purgeStoredState } from "redux-persist";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";



 const Payment = ({ navigation,route}) => {

  PushNotification.configure({
   
    onNotification: function(notification) {
      
      navigation.navigate('Dashboard');
    },
    popInitialNotification: true,
    requestPermissions: true
  })



  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;
 
    if (isClicked) {
      navigation.navigate('Dashboard');
    } else {
      navigation.navigate('Dashboard');
    }
  };



    const LoginStatus = useSelector((state) => state.loginDetails);
    const{loginData} = LoginStatus

    //route?.params.

    useEffect(() => {
         
      if (Platform.OS  ===  'ios'){
        
        PushNotificationIOS.addEventListener('notification', onRemoteNotification);
      }


    }, [])

  return (

 
    <View style={StylesAll.commonWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FCFB"></StatusBar>
      <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
 
        <View >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={[
                StylesAll.commonHeader,
              
              ]}>
              <Image source={require('./Image/back.png')} style={StylesAll.headArrow} resizeMode="contain" />
              <Text
                style={[StylesAll.headTitle]}>
                {route.params?.isPayment === true ? 'PAY' : 'TOP UP'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
              

        <View style={{flex: 1, justifyContent: 'center'  , shadowColor: "#ED1C24",
        }}>
          
          <View style={[StylesAll.qrBox,{justifyContent:'center',alignItems:'center'}]}>


          <QRCode
          value={ (loginData != null) ? loginData.token : "No Token Please Login"}
          size={240}
          bgColor='#FFFFFF'
          fgColor='#000000'
          />
          <View style={{position:"absolute" , top:"55%" ,left:"55%" ,backgroundColor:"#fff" ,padding:6}}>
<Image source={require('./Image/MainLogo.png')} style={{width:50 ,height:50, tintColor:"#000"} } resizeMode="contain"/>
</View>






          </View>

          <View style={StylesAll.qrbottomBox}>
            <Text style={StylesAll.btnText}>Wallet Balance</Text>

            <Text style={[StylesAll.mediamFont,StylesAll.whitecolor]}>RM {(Math.round(route.params?.memberData.wallet * 100) / 100).toFixed(2)} </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default Payment