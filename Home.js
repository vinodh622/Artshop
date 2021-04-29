import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Image,
} from 'react-native';
import {COLORS} from './Styles/colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {StylesAll} from './commanStyle/objectStyle';

import {useDispatch, useSelector} from 'react-redux';

import SampleData from './SampleData';
import {useIsFocused} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

// import { DrawerActions } from '@react-navigation/native';

const Home = ({navigation}) => {
  const isFocused = useIsFocused();

  const [voucherData, setVoucherData] = useState([]);

  const LoginStatus = useSelector((state) => state.loginDetails);

  const {loginData} = LoginStatus;

  const isCarousel = React.useRef(null);

  const [isLoadingList, setIsLoadingList] = useState(true);

  const [viewPostData, setViewPostData] = useState([]);

  const [splash, setSplash] = useState(true);

  const [userData, setUserData] = useState({});
  const [walletAmount, setwalletAmount] = useState('  ');

  const [payPoints, setpayPoints] = useState('  ');

  const [userResponse, setuserResponse] = useState(false);

  const renderItemCarouselCardItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Voucherdetail', {
            dataValue: item,
            isVoucher: true,
          });
        }}>
        <View key={index} style={[styles.shadowLayout]}>
          <Image
            source={{uri: `http://artshop.shiftlogics.com/${item.photo}`}}
            resizeMode="cover"
            style={{
              width: windowWidth - windowWidth / 5.0, //Raja edited
              height: '100%',
              aspectRatio: 1 / 0.56, //Raja edited
              borderRadius:11
            }}
            key={index}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyListMessage = () => {
    if (loginData === null) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Loginscreen');
          }}>
          <View
            style={[
              {
                aspectRatio: 1 / 0.56,
                width: windowWidth - 60,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Image
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: '#ED1C24'}}
              source={require('./Image/opps.png')}
            />
            <Text style={[StylesAll.boldFont, {fontSize: 12, color: '#000'}]}>
              Oops, login is required!
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={[
            {
              aspectRatio: 1 / 0.56,
              width: windowWidth - 60,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Image
            style={{width: 40, height: 40}}
            source={require('./Image/opps.png')}
            resizeMode="cover"
          />
          <Text style={[StylesAll.emptyDatatext]}>
            No new voucher at this time!
          </Text>
        </View>
      );
    }
  };

  useEffect(() => {
    let abort = new AbortController();
    var form = new FormData();

    fetch(
      'http://artshop.shiftlogics.com/api/newpost/viewNewpost',
      {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        }),
        // body: form,
      },
      {signal: abort.signal},
    )
      .then((response) => response.json())
      .then((data) => {
        if (loginData === null) {
          setIsLoadingList(false);
          setVoucherData([]);
        } else {
          var form = new FormData();
          form.append('api_token', loginData.token);
          fetch('http://artshop.shiftlogics.com/api/voucher/viewVoucherAPP', {
            method: 'POST',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            }),
            body: form,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === 'success') {
                setIsLoadingList(false);

                setVoucherData(data.data);
              } else {
                setIsLoadingList(false);
              }
            })
            .catch((e) => console.log(e));
        }

        if (data.status === 'success') {
          setViewPostData(data.data);
          setIsLoadingList(false);
        } else {
          setIsLoadingList(false);
        }
      })
      .catch((e) => console.log(e));

    return () => {
      abort.abort();
    };
  }, [isFocused]);

  const renderItem = ({item}) => {
    return (
      <View>
        {item.postImage.map((ee) => {
          return (
            <View style={[{borderRadius: 11 }, styles.shadowLayout]}>
              <Image
                source={{uri: `http://artshop.shiftlogics.com/${ee.pImage}`}}
                style={{
                  width: windowWidth - windowWidth / 2.34, //Raja edited
                  height: '100%',
                  aspectRatio: 1 / 1.42, //Raja edited
                  borderRadius: 11,
                }}
                resizeMode="cover"></Image>
            </View>
          );
        })}
      </View>
    );
  };

  const ItemSeparator = () => {
    return <View style={{width: 20}}></View>;
  };

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => {
      //test
      clearInterval(() => {
        setSplash(true);
      });
    };
  }, []);

  useEffect(() => {
    if (loginData === null) {
      //console.log("no data")

      setuserResponse(true);
    } else {
      // console.log(" data foundsss.....")
      fetch(
        `http://artshop.shiftlogics.com/api/user/data?api_token=${loginData.token}`,
        {
          method: 'GET',
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }),
        },
      )
        .then((response) => response.json())

        .then((data) => {
          if (data.status === 'success') {
            setUserData(data.data);

            let getPoint = data.data.point.toString();

            let setpoint =
              getPoint.length <= 6
                ? parseInt(getPoint).toLocaleString() + '\xa0 ' + 'PTS'
                : parseInt(getPoint.substring(0, 6)).toLocaleString() +
                  '\xa0 ' +
                  'PTS';

            setpayPoints(setpoint);
          } else if (data.status === 'failure') {
            setUserData({

            });
          }
        })

        .catch((e) => console.log(e));
    }

    return () => {};
  }, [isFocused]);







  return splash ? (
    <View style={{flex: 1, flexDirection: 'column' ,backgroundColor:"#fff"}}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FCFB"></StatusBar>

      <ImageBackground
        source={require('./Image/Login_bg.png')}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={require('./Image/MainLogo.png')} style={{width:140 ,height:60}} resizeMode="contain"  />
      </ImageBackground>
    </View>
  ) : (
    <View style={StylesAll.flexScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FCFB"></StatusBar>
      <SafeAreaView style={StylesAll.flexScreen}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 20,
           paddingVertical:12
          }}>
          <View style={{paddingHorizontal: 20}}>
            <Image
              source={require('./Image/MainLogo.png')}
              style={{width:140, height: 60}}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Drawer')}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 19,
                paddingLeft: 30,
              }}>
              <Image
                style={[{width: 30, height: 30}, {tintColor: '#ED1C24'}]}
                source={require('./Image/mainmenu.png')}></Image>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            {/* {loginData == null ? null : (
          <Text
            style={[
              {paddingTop: 10, paddingHorizontal: 30, paddingBottom: 10 ,color:"#171717"},
             
              StylesAll.mediamFont,
            ]}>
            Hi, {loginData.name}
          </Text>
        )} */}

            {loginData === null ? null : (
              <View style={StylesAll.featurePointssec}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Dashboard')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('./Image/Wallet.png')}
                      style={{width: 18, marginRight: 6, tintColor:"#ED1C24"}}
                      resizeMode="contain"
                    />

                    <Text style={StylesAll.featurePoints}>
                      {' '}
                      RM
                      {`\xa0 ` +
                        Number(
                          parseFloat(userData.wallet).toFixed(2),
                        ).toLocaleString('en', {
                          minimumFractionDigits: 2,
                        })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Dashboard')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('./Image/Ticketstar.png')}
                      style={{width: 18, marginRight: 6 ,tintColor:"#ED1C24"}}
                      resizeMode="contain"
                    />
                    <Text style={StylesAll.featurePoints}>{payPoints}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View style={{flex: 1.3, paddingBottom: 10}}>
              <Text
                style={[
                  { paddingLeft: 30, paddingBottom: 10},
                  StylesAll.boldFont2,
                ]}>
                Latest Vouchers
              </Text>

              <FlatList
                contentContainerStyle={{
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
                horizontal
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                data={voucherData}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={EmptyListMessage}
                keyExtractor={(item) => item.id}
                //keyExtractor={(item, index) => index.toString()}
                renderItem={renderItemCarouselCardItem}
              />
            </View>

            <View
              style={{
                flex: 2.5,
                paddingBottom: 10,
                justifyContent: 'flex-end',
              }}>
              <Text
                style={[
                  {paddingTop: 5, paddingLeft: 30, paddingBottom: 10},
                  StylesAll.boldFont2,
                ]}>
                Popular
              </Text>

              <FlatList
                contentContainerStyle={{
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
                horizontal
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                data={viewPostData}
                ItemSeparatorComponent={ItemSeparator}
                //ListEmptyComponent={EmptyListMessage}
                keyExtractor={(item) => item.id}
                //keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            {
              flexDirection: 'row',
              paddingHorizontal: 30,
             
              justifyContent: 'space-between', backgroundColor:"#F9FCFB"
            },
            {paddingVertical: 12},
          ]}>
          <TouchableOpacity
            style={styles.Btm_menudimensions}
            onPress={() => {
              navigation.navigate('menuDashboard');
            }}>
            <View style={[styles.labelBox]}>
              <Image
                source={require('./Image/menuNew.png')}
                style={[styles.labelIcons, {tintColor: '#ED1C24'}]}
              />
              <Text style={StylesAll.btm_Menu}>Menu</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Btm_menudimensions}
            onPress={() => {
              navigation.navigate('ScanQr');
            }}>
            <View style={[styles.labelBox]}>
              <Image
                source={require('./Image/orderNew.png')}
                style={[styles.labelIcons, {tintColor: '#ED1C24'}]}
              />
              <Text style={StylesAll.btm_Menu}>Order</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Btm_menudimensions}
            onPress={() => {
              navigation.navigate('Reserve');
            }}>
            <View style={[styles.labelBox]}>
              <Image
                source={require('./Image/reserveNew.png')}
                style={[styles.labelIcons, {tintColor: '#ED1C24'}]}
              />

              <Text style={[StylesAll.btm_Menu]}>Book</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Btm_menudimensions}
            onPress={() => {
              navigation.navigate('Outlet');
            }}>
            <View style={[styles.labelBox]}>
              <Image
                source={require('./Image/outletNew.png')}
                style={[styles.labelIcons, {tintColor: '#ED1C24'}]}
              />
              <Text style={StylesAll.btm_Menu}>Outlets</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  mainContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  navBar: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    height: 30,
  },

  body: {
    flex: 3,
    display: 'flex',
  },

  carsection: {
    backgroundColor: '#EECA39',
    width: 300,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },

  carbackground: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#424242',
  },
  section1: {
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#2AFD89',
  },
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#00D35F',
    justifyContent: 'space-between',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
  },
  group: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  section1word: {
    backgroundColor: '#2AFD89',
  },
  sec1wordinside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#2AFD89',
  },
  text1: {
    fontWeight: 'bold',
  },
  text2: {
    fontWeight: 'bold',
    color: 'white',
    borderBottomWidth: 4,
    borderColor: 'white',
    paddingBottom: 10,
    width: 75,
    textAlign: 'center',
  },
  end: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    padding: 10,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  picture: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  endtext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 10,
  },
  loginView: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'white',
    padding: 0,
  },
  listView: {
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 0,
  },
  list: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  loginHeaderView: {
    backgroundColor: '#00000012',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ListHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  logintextView: {
    marginLeft: 0,
  },
  logintext1: {
    color: 'black',
    paddingLeft: 3,
    fontFamily: 'SFMono-Bold',
    fontSize: 15,
  },
  logintext2: {
    color: 'gray',
    fontWeight: 'normal',
    fontSize: 15,
    paddingLeft: 10,
  },
  search: {
    width: 70,
    height: 70,
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },

  androidios: {
    backgroundColor: '#EFCB38',
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'SFMono-Bold',
    fontSize: 20,
  },
  labelIcons: {width: 19, height: 19, marginBottom: 3},

  labelBox: {alignItems: 'center'},

  shadowLayout: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,   borderRadius:11
  },
  Btm_menudimensions: {flexDirection: 'row'},
});
