import React, { useState, useEffect, useCallback, createRef } from 'react'
import {
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native'
import Colors from '../../common/Colors'
import _ from 'underscore'
import ModalContainer from '../../components/home/ModalContainer'
import BottomInputModalContainer from '../../components/home/BottomInputModalContainer'

import SeedHeaderComponent from './SeedHeaderComponent'
import SeedPageComponent from './SeedPageComponent'
import SeedBacupModalContents from './SeedBacupModalContents'
import ConfirmSeedWordsModal from './ConfirmSeedWordsModal'
import { useDispatch } from 'react-redux'
import { setSeedBackupHistory, updateSeedHealth } from '../../store/actions/BHR'
import AlertModalContents from '../../components/AlertModalContents'
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import dbManager from '../../storage/realm/dbManager'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BackupSeedWordsContent = ( props ) => {
  const [ seedWordModal, setSeedWordModal ] = useState( false )
  const [ confirmSeedWordModal, setConfirmSeedWordModal ] = useState( false )
  const [ showAlertModal, setShowAlertModal ] = useState( false )
  const [ seedSecondName, setSeedSecondName ] = useState( '' )
  const [ info, setInfo ] = useState( '' )
  const [ seedRandomNumber, setSeedRandomNumber ] = useState( [] )
  const [ seedData, setSeedData ] = useState( [] )
  const [ seedPosition, setSeedPosition ] = useState( 0 )
  const [ headerTitle, setHeaderTitle ]=useState( 'First 6 seed words' )
  const dispatch = useDispatch()
  const fromHistory = props.navigation.getParam( 'fromHistory' )
  const isChangeKeeperType =  props.navigation.getParam( 'isChangeKeeperType' )
  useEffect( ()=>{
    RNPreventScreenshot.enabled( true )
  }, [] )
  return (
    <View style={{
      flex: 1, backgroundColor: Colors.backgroundColor
    }}>
      <SafeAreaView
        style={{
          flex: 0, backgroundColor: Colors.backgroundColor
        }}
      />
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <SeedHeaderComponent
        onPressBack={() => {
          RNPreventScreenshot.enabled( false )
          props.navigation.goBack()
        }}
        selectedTitle={headerTitle}
      />
      <View style={{
        flex: 1
      }}>
        <SeedPageComponent
          infoBoxTitle={'Note'}
          infoBoxInfo={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}
          onPressConfirm={( seed, seedData )=>{
            const i = 12, ranNums = []
            setSeedPosition( 0 )
            setSeedData( seedData )
            for( let j=0; j<2; j++ ){
              const tempNumber = ( Math.floor( Math.random() * ( i ) ) )
              if( ranNums.length == 0 || ( ranNums.length > 0 && ranNums[ j ] != tempNumber ) ){
                if ( tempNumber == undefined || tempNumber == 0 ) {
                  ranNums.push( 1 )
                }
                else {
                  ranNums.push( tempNumber )
                }
              } else j--
            }
            setSeedRandomNumber( ranNums )

            setTimeout( () => {
              setConfirmSeedWordModal( true )
            }, 500 )
          }}
          data={[]}
          confirmButtonText={'Next'}
          proceedButtonText={'Proceed'}
          disableChange={false}
          onPressReshare={() => {
          }}
          onPressChange={() => {
            RNPreventScreenshot.enabled( false )
            props.navigation.goBack()
          }}
          showButton={true}
          changeButtonText={'Back'}
          previousButtonText={'Previous'}
          isChangeKeeperAllow={true}
          setHeaderMessage={( message )=>setHeaderTitle( message )}
        />
      </View>

      <BottomInputModalContainer onBackground={() => setConfirmSeedWordModal( false )} visible={confirmSeedWordModal}
        closeBottomSheet={() => setConfirmSeedWordModal( false )}  showBlurView={true}>
        <ConfirmSeedWordsModal
          proceedButtonText={'Next'}
          seedNumber={seedRandomNumber ? seedRandomNumber[ seedPosition ] : 0}
          onPressProceed={( word ) => {
            setConfirmSeedWordModal( false )
            if( word == '' ){
              setTimeout( () => {
                setInfo( 'Please enter seed word' )
                setShowAlertModal( true )
              }, 500 )
            } else if( word !=  seedData[ ( seedRandomNumber[ seedPosition ]-1 ) ].name  ){
              setTimeout( () => {
                setInfo( 'Please enter valid seed word' )
                setShowAlertModal( true )
              }, 500 )
            } else if( !fromHistory && seedPosition == 0 ){
              setConfirmSeedWordModal( false )
              setSeedPosition( 1 )
              setTimeout( () => {
                setConfirmSeedWordModal( true )
              }, 500 )
            }else {
              setSeedWordModal( true )
              const dbWallet =  dbManager.getWallet()
              if( dbWallet!=undefined && dbWallet!=null ){
                const walletObj = JSON.parse( JSON.stringify( dbWallet ) )
                const primaryMnemonic = walletObj.primaryMnemonic
                const seed = primaryMnemonic.split( ' ' )
                const seedData = seed.map( ( word, index ) => {
                  return {
                    name: word, id: ( index+1 )
                  }
                } )
                const i = 12
                let ranNums = 1
                const tempNumber = ( Math.floor( Math.random() * ( i ) ) )
                if( tempNumber == undefined || tempNumber == 0 )
                  ranNums = 1
                else ranNums = tempNumber
                const asyncSeedData=seedData[ ranNums ]
                AsyncStorage.setItem( 'randomSeedWord', JSON.stringify( asyncSeedData ) )
              }
              dispatch( updateSeedHealth() )

              // dispatch(setSeedBackupHistory())
            }
          }}
          onPressIgnore={() => setConfirmSeedWordModal( false )}
          isIgnoreButton={true}
          cancelButtonText={'Start Over'}
        />
      </BottomInputModalContainer>
      <ModalContainer onBackground={() => setSeedWordModal( false )} visible={seedWordModal}
        closeBottomSheet={() => setSeedWordModal( false )}>
        <SeedBacupModalContents
          title={'Seed Words\nBackup Successful'}
          info={'You have successfully confirmed your backup\n\nMake sure you store the words in a safe place. The app will request you to confirm the words periodically to ensure you have the access'}
          proceedButtonText={'View Health'}
          onPressProceed={() => {
            RNPreventScreenshot.enabled( false )
            setSeedWordModal( false )
            const navigationParams =  props.navigation.getParam( 'navigationParams' )
            if ( isChangeKeeperType ) {
              props.navigation.navigate( 'SeedBackupHistory', {
                navigationParams,
                isChangeKeeperType: true,
              } )
            } else {
              props.navigation.goBack()
            }
          }}
          onPressIgnore={() => setSeedWordModal( false )}
          isIgnoreButton={false}
          isBottomImage={true}
          bottomImage={require( '../../assets/images/icons/success.png' )}
        />
      </ModalContainer>
      <ModalContainer onBackground={()=>{setShowAlertModal( false )}} visible={showAlertModal} closeBottomSheet={() => { }}>
        <AlertModalContents
          // modalRef={this.ErrorBottomSheet}
          // title={''}
          info={info}
          proceedButtonText={'Okay'}
          onPressProceed={() => {
            setShowAlertModal( false )
            if ( info == 'please delete icloud backup' ) {

              props.navigation.popToTop()
            }
          }}
          isBottomImage={false}
          // bottomImage={require( '../../assets/images/icons/errorImage.png' )}
        />
      </ModalContainer>
    </View>
  )
}
export default BackupSeedWordsContent
