import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../common/Colors';
import Fonts from '../../common/Fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppBottomSheetTouchableWrapper } from '../AppBottomSheetTouchableWrapper';
import { ScrollView } from 'react-native-gesture-handler';

export default function SendHelpContents(props) {
  return (
    <ScrollView style={styles.modalContainer} snapToInterval={hp('89%')}>
        <View style={{height: hp('89%'), justifyContent: 'space-between', paddingBottom: hp('4%')}}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                    style={{
                        color: Colors.white,
                        fontFamily: Fonts.FiraSansMedium,
                        fontSize: RFValue(20),
                        marginTop: hp('1%'),
                        marginBottom: hp('1%'),
                    }}
                >
                    Sending Bitcoins
                </Text>
            </View>
            <View
                style={{
                backgroundColor: Colors.homepageButtonColor,
                height: 1,
                marginLeft: wp('5%'),
                marginRight: wp('5%'),
                marginBottom: hp('1%'),
                }}
            />
            <Text
            style={{
                textAlign: 'center',
                color: Colors.white,
                fontSize: RFValue(12),
                fontFamily: Fonts.FiraSansRegular,
            }}
            >
                When you want to send Bitcoins, you need a{'\n'}destination, which is denoted by the{'\n'}recipient’s address. This address is an{'\n'}alphanumeric string beginning with “1”, “3” or{'\n'}“bc1” for Bitcoin Mainnet, and “2” for the{'\n'}Bitcoin Testnet
            </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/bitcoin_send_info_1.png')}
                    style={{ width: wp('90%'), height: wp('90%'), resizeMode: 'contain' }}
                />
            </View>
            <Text
            style={{
                textAlign: 'center',
                color: Colors.white,
                fontSize: RFValue(12),
                fontFamily: Fonts.FiraSansRegular,
            }}
            >
                Bitcoin transactions can not be reversed or cancelled.{'\n'}For this reason, it is recommended that you scan a QR{'\n'}code instead of keying in the characters
            </Text>
            <Text
            style={{
                textAlign: 'center',
                color: Colors.white,
                fontSize: RFValue(12),
                fontFamily: Fonts.FiraSansRegular,
            }}
            >
                Once you press “Send” on Hexa, the transaction{'\n'}is relayed to a bitcoin full node. This full node{'\n'}then announces the transactions to other full{'\n'}nodes, including those of miners
            </Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                    style={{
                        borderStyle: 'dotted',
                        borderWidth: 1,
                        borderRadius: 1,
                        borderColor: Colors.white,
                        width: wp('70%'),
                        height: 0,
                    }}
                />
            </View>
        </View>
        <View style={{height: hp('89%'), justifyContent: 'space-between', paddingTop:hp('2%'), paddingBottom: hp('4%')}}>
            <Text
            style={{
                textAlign: 'center',
                color: Colors.white,
                fontSize: RFValue(12),
                fontFamily: Fonts.FiraSansRegular,
            }}
            >
                A transaction that is not confirmed stays in the{'\n'}pool of unconfirmed transactions, called the{'\n'}mempool. The mempool is routinely cleared by{'\n'}miners every three to six hours
            </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/bitcoin_send_info_2.png')}
                    style={{ width: wp('90%'), height: wp('90%'), resizeMode: 'contain' }}
                />
            </View>
            <Text
                style={{
                    textAlign: 'center',
                    color: Colors.white,
                    fontSize: RFValue(12),
                    fontFamily: Fonts.FiraSansRegular,
                }}
            >
                A miner includes a transaction within their{'\n'}block only if the fee associated with it is{'\n'}sufficiently high. This is why Hexa requests for{'\n'}a fee when sending a transaction
            </Text>
            <Text
                style={{
                    textAlign: 'center',
                    color: Colors.white,
                    fontSize: RFValue(12),
                    fontFamily: Fonts.FiraSansRegular,
                }}
            >
                If the fee associated with a transaction is low,{'\n'}you may increase the fee paid by RBF{'\n'}or Replace-By-Fee. This provides additional{'\n'}incentive for the miner to mine{'\n'}your transaction
            </Text>
        </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    height: '100%',
    backgroundColor: Colors.blue,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: hp('5%'),
    elevation: 10,
    shadowColor: Colors.borderColor,
    shadowOpacity: 10,
    shadowOffset: { width: 0, height: 2 },
  },
});