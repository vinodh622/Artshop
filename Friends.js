
import React from 'react';
import { Text,Dimensions,StatusBar, View, StyleSheet, Image, ScrollView, ImageBackground, FlatList,TouchableOpacity ,Platform,TouchableHighlight} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS } from "./Styles/colors";
import { StylesAll } from "./commanStyle/objectStyle";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Friends = ({navigation}) => {

  const headerView = () => {
      return(
        <View> 
          <Text style={{color:'gray',textAlign:'center',padding:10}}>AVAILABLE REWARDS FOR YOU</Text>
        </View>


    );
  };

    const onPress2 = () => {
         navigation.navigate('MyInvites');
      }

      const renderItem = ({item}) => {
        return (
          <View style={StylesAll.rewardLists}>
            <View style={{width: '100%' ,
                  height: undefined,
                  aspectRatio: 800 / 450,}}>
              <Image
                source={item.image}
                style={[
                  StylesAll.imageStyle,
                  {borderTopLeftRadius: 10, borderTopRightRadius: 10,backgroundColor:COLORS.app_brownlightheme},
                ]}
                resizeMode= 'cover'
              />
            </View>

   
    
            <View style={{flexDirection: 'row', padding: 15, alignItems: 'center'}}>
              <View style={{flexDirection: 'column', flex: 1, paddingRight: 10}}>
                <Text style={[StylesAll.md_Title11,{marginBottom:10}]} numberOfLines={1}>
                  {item.name}
                </Text>
                
                <Text numberOfLines={1} style={StylesAll.md_Title12}>{item.desc}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() =>{
                  onPress2()
                }}>
                  <View style={StylesAll.sm_Button}>
                    <Text style={StylesAll.btnText}>Invite</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      };
  
return(
 
<View style={{backgroundColor:COLORS.app_bgtheme,flex:1}}>
<FlatList 
    contentContainerStyle={{padding:30}}
    showsVerticalScrollIndicator={false}
      data= {[
      {
        "id" : 1,
        "name" : 'Get RM10 Voucher when you refer 5 friends',
        "desc" : 'Invite 5 of your friends to download our app',
        "image" : require('./Image/invite1.jpg')
      },
      {
        "id" : 2,
        "name" : 'Get Free Gift when you refer a friend',
        "desc" : 'Invite 1 of your friends to download our app ',
        "image" : require('./Image/invite2.jpg')
      },

    ]}
 
 renderItem={renderItem}
 />
</View>

    );

}
export default Friends;
 
 