import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  TextInput,
  Keyboard,
  ScrollView,
  Linking,
  AsyncStorage,
  ActivityIndicator,
  Image
} from 'react-native';
import Colors from '../../common/Colors';
import Fonts from '../../common/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from 'react-redux';
import { REGULAR_ACCOUNT, SECURE_ACCOUNT, TEST_ACCOUNT } from '../../common/constants/serviceTypes';

export default function ExistingSavingMethods(props) {
    const [getBittrAccounts, setGetBittrAcounts] = useState([]);

    useEffect(()=>{
        (async()=>{
            let getBittrAccounts = [];
            let accounts = JSON.parse(await AsyncStorage.getItem("getBittrAccounts"));
            if(accounts){
                for (let i = 0; i < accounts.length; i++) {
                    const element = accounts[i];
                    for (let j = 0; j < element.getBitrrAccounts.length; j++) {
                        const subElement = element.getBitrrAccounts[j];
                        let obj={
                            ...subElement, 
                            accountType: accounts[i].accountType
                        }
                        getBittrAccounts.push(obj);
                    }
                }
                setGetBittrAcounts(getBittrAccounts ? getBittrAccounts : []);
            }
            console.log("accounts", getBittrAccounts)
        })();
    },[])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor1 }}>
        <StatusBar backgroundColor={Colors.backgroundColor1} barStyle="dark-content"/>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.backgroundColor1 }}/>
        <View style={styles.modalContainer}>
            <View style={styles.modalHeaderTitleView}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{ height: 30, width: 30, justifyContent: 'center' }}
                    >
                        <FontAwesome
                            name="long-arrow-left"
                            color={Colors.black1}
                            size={17}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginRight: 10, marginBottom: 10 }}>
                        <Text style={styles.modalHeaderTitleText}>{'Payment Source'}</Text>
                        <Text style={styles.modalHeaderSmallTitleText}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        <View style={{flex:1}}>
            {getBittrAccounts.map((value)=>{
                return <TouchableOpacity onPress={()=>{props.navigation.navigate("ExistingSavingMethodDetails", {getBittrAccount: value})}} style={{marginLeft:20, marginRight:20, marginTop:5, marginBottom:5, flexDirection:'row', alignItems:'center', borderColor: Colors.borderColor, borderWidth: 1, borderRadius: 10}} >
                <View style={{ width:wp('10%'), height:wp('10%'), borderRadius:wp("10%")/2, backgroundColor:Colors.backgroundColor, justifyContent:'center', alignItems:'center', marginLeft:wp('3%'), }}>
                    <Image source={require("../../assets/images/icons/icon_getbitter.png")} style={{width:wp('7%'), height:wp("7%")}}/>
                </View>
                <View style={{ flex:1, marginLeft:wp('3%'), marginRight:wp('3%')}}>
                    <View style={{ padding:wp('3%'), }}>
                        <Text style={{color:Colors.textColorGrey, fontFamily:Fonts.FiraSansRegular, fontSize: RFValue(13)}}>Ref # {value.data.deposit_code}</Text>
                        <Text style={{color:Colors.textColorGrey, fontFamily:Fonts.FiraSansRegular, fontSize: RFValue(13), marginTop:5}}>{value.email}</Text>
                    </View>
                    <View style={{ height:1, backgroundColor:Colors.borderColor, }}/>
                    <View style={{ padding:wp('3%'),}}>
                        <Text style={{color:Colors.textColorGrey, fontFamily:Fonts.FiraSansRegular, fontSize: RFValue(13)}}>Amount Saved</Text>
                        <View style={styles.transactionModalAmountView}>
                            <Image
                                source={require('../../assets/images/icons/icon_bitcoin_gray.png')}
                                style={{ width: 12, height: 12, resizeMode: 'contain' }}
                            />
                            <Text style={styles.transactionModalAmountText}>0.059</Text>
                            <Text style={styles.transactionModalAmountUnitText}>sats</Text>
                        </View>
                    </View>
                </View>
                <View style={{ width:wp('10%'), height:wp('10%'), justifyContent:'center', alignItems:'center', marginRight:wp('3%')}}>
                    {/* <View style={{backgroundColor:Colors.green, borderRadius: wp('5%')/2, width:wp('5%'), height:wp('5%'), justifyContent:'center', alignItems:'center'}}>
                        <Feather
                            name={'check'}
                            size={RFValue(13)}
                            color={Colors.darkGreen}
                        />
                    </View> */}
                    <Ionicons
                        name="ios-arrow-forward"
                        color={Colors.borderColor}
                        size={RFValue(20)}
                        style={{ alignSelf: 'center' }}
                    />         
                </View>
            </TouchableOpacity>
            })}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderTitleView: {
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: hp('5%'),
  },
  modalHeaderTitleText: {
    color: Colors.black1,
    fontSize: RFValue(18),
    fontFamily: Fonts.FiraSansRegular,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundColor1,
    width: '100%',
  },
  modalHeaderSmallTitleText: {
    color: Colors.textColorGrey,
    fontSize: RFValue(13),
    fontFamily: Fonts.FiraSansRegular,
    marginBottom: 10
  },

  transactionModalAmountView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionModalAmountText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: RFValue(17),
    fontFamily: Fonts.OpenSans,
    color: Colors.textColorGrey
  },
  transactionModalAmountUnitText: {
    color: Colors.textColorGrey,
    fontSize: RFValue(10),
    fontFamily: Fonts.OpenSans,
  },
});
