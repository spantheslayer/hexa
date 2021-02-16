import { applyMiddleware, createStore, combineReducers } from 'redux'
import { AsyncStorage as storage } from 'react-native'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { call, all, spawn } from 'redux-saga/effects'
import { composeWithDevTools } from 'redux-devtools-extension'

import storageReducer from './reducers/storage'
import setupAndAuthReducer from './reducers/setupAndAuth'
import accountsReducer from './reducers/accounts'
import sssReducer from './reducers/sss'
import fBTCReducers from './reducers/fbtc'
import notificationsReducer from './reducers/notifications'
import sendingReducer from './reducers/sending'
import trustedContactsReducer from './reducers/trustedContacts'
import { persistStore, persistReducer } from 'redux-persist'
import preferencesReducer from './reducers/preferences'
import loaders from './reducers/loaders'
import swanIntegrationReducer from './reducers/SwanIntegration'
import wyreIntegrationReducer from './reducers/WyreIntegration'
import VersionHistoryReducer from './reducers/versionHistory'


const config = {
  key: 'root', // key is required
  storage, // storage is now required
  blacklist: [ 'setupAndAuth', 'loaders' ],
}

import {
  initDBWatcher,
  fetchDBWatcher,
  insertDBWatcher,
  servicesEnricherWatcher,
} from './sagas/storage'

import {
  initSetupWatcher,
  initRecoveryWatcher,
  credentialStorageWatcher,
  credentialsAuthWatcher,
  changeAuthCredWatcher,
} from './sagas/setupAndAuth'

import {
  fetchTransactionsWatcher,
  testcoinsWatcher,
  accumulativeTxAndBalWatcher,
  fetchBalanceTxWatcher,
  generateSecondaryXprivWatcher,
  resetTwoFAWatcher,
  fetchDerivativeAccXpubWatcher,
  fetchDerivativeAccBalanceTxWatcher,
  removeTwoFAWatcher,
  setupDonationAccountWatcher,
  updateDonationPreferencesWatcher,
  addNewAccountShellWatcher,
  syncViaXpubAgentWatcher,
  updateAccountSettingsWatcher,
  reassignTransactionsWatcher,
  mergeAccountShellsWatcher,
  refreshAccountShellWatcher,
  feeAndExchangeRatesWatcher,
  addNewSecondarySubAccountWatcher,
  autoSyncShellsWatcher
} from './sagas/accounts'

import {
  initHCWatcher,
  generateMetaSharesWatcher,
  uploadEncMetaShareWatcher,
  downloadMetaShareWatcher,
  updateMSharesHealthWatcher,
  checkMSharesHealthWatcher,
  overallHealthWatcher,
  uploadRequestedShareWatcher,
  requestShareWatcher,
  updateDynamicNonPMDDWatcher,
  downloadDynamicNonPMDDWatcher,
  recoverMnemonicWatcher,
  recoverWalletWatcher,
  restoreDynamicNonPMDDWatcher,
  generatePersonalCopyWatcher,
  checkPDFHealthWatcher,
  restoreShareFromQRWatcher,
  shareHistoryUpdateWatcher,
  updateWalletImageWatcher,
  fetchWalletImageWatcher,
  sharePersonalCopyWatcher,
} from './sagas/sss'

import {
  accountSyncWatcher,
  getQuoteWatcher,
  executeOrderWatcher,
  getBalancesWatcher,
} from './sagas/fbtc'

import {
  updateFCMTokensWatcher,
  fetchNotificationsWatcher,
} from './sagas/notifications'

import {
  approveTrustedContactWatcher,
  fetchTrustedChannelWatcher,
  fetchEphemeralChannelWatcher,
  updateEphemeralChannelWatcher,
  updateTrustedChannelWatcher,
  trustedChannelsSetupSyncWatcher,
  removeTrustedContactWatcher,
  syncTrustedChannelsWatcher,
  walletCheckInWatcher,
  postRecoveryChannelSyncWatcher,
} from './sagas/trustedContacts'

import nodeSettingsReducer from './reducers/nodeSettings'
import { connectToBitHyveNodeWatcher, restorePersonalNodeConfigurationWatcher, savePersonalNodeConfigurationWatcher } from './sagas/nodeSettings'

import {
  fetchSwanAuthenticationUrlWatcher,
} from './sagas/SwanIntegration'

import {
  fetchWyreReservationWatcher
} from './sagas/WyreIntegration'
import { versionHistoryWatcher } from './sagas/versionHistory'
import walletRescanningReducer from './reducers/wallet-rescanning'
import { calculateSendMaxFeeWatcher } from './sagas/sending'

const rootSaga = function* () {
  const sagas = [
    // database watchers
    initDBWatcher,
    fetchDBWatcher,
    insertDBWatcher,
    servicesEnricherWatcher,

    // wallet setup watcher
    initSetupWatcher,
    initRecoveryWatcher,
    credentialStorageWatcher,
    credentialsAuthWatcher,
    changeAuthCredWatcher,

    // accounts watchers
    fetchTransactionsWatcher,
    fetchBalanceTxWatcher,
    testcoinsWatcher,
    accumulativeTxAndBalWatcher,
    generateSecondaryXprivWatcher,
    resetTwoFAWatcher,
    removeTwoFAWatcher,
    fetchDerivativeAccXpubWatcher,
    fetchDerivativeAccBalanceTxWatcher,
    syncViaXpubAgentWatcher,
    feeAndExchangeRatesWatcher,
    setupDonationAccountWatcher,
    updateDonationPreferencesWatcher,
    refreshAccountShellWatcher,
    addNewAccountShellWatcher,
    addNewSecondarySubAccountWatcher,
    updateAccountSettingsWatcher,
    reassignTransactionsWatcher,
    mergeAccountShellsWatcher,
    autoSyncShellsWatcher,

    // sss watchers
    initHCWatcher,
    generateMetaSharesWatcher,
    uploadEncMetaShareWatcher,
    downloadMetaShareWatcher,
    generatePersonalCopyWatcher,
    sharePersonalCopyWatcher,
    updateMSharesHealthWatcher,
    checkMSharesHealthWatcher,
    checkPDFHealthWatcher,
    overallHealthWatcher,
    uploadRequestedShareWatcher,
    requestShareWatcher,
    updateDynamicNonPMDDWatcher,
    downloadDynamicNonPMDDWatcher,
    restoreDynamicNonPMDDWatcher,
    recoverMnemonicWatcher,
    recoverWalletWatcher,
    restoreShareFromQRWatcher,
    shareHistoryUpdateWatcher,
    updateWalletImageWatcher,
    fetchWalletImageWatcher,

    //fBTC
    accountSyncWatcher,
    getQuoteWatcher,
    executeOrderWatcher,
    getBalancesWatcher,

    // Node Settings
    savePersonalNodeConfigurationWatcher,
    connectToBitHyveNodeWatcher,
    restorePersonalNodeConfigurationWatcher,

    // Notifications
    updateFCMTokensWatcher,
    fetchNotificationsWatcher,

    // Trusted Contacts
    approveTrustedContactWatcher,
    removeTrustedContactWatcher,
    updateEphemeralChannelWatcher,
    fetchEphemeralChannelWatcher,
    updateTrustedChannelWatcher,
    fetchTrustedChannelWatcher,
    trustedChannelsSetupSyncWatcher,
    walletCheckInWatcher,
    syncTrustedChannelsWatcher,
    postRecoveryChannelSyncWatcher,

    // Swan Integration
    fetchSwanAuthenticationUrlWatcher,

    // Wyre Integration
    fetchWyreReservationWatcher,

    //VersionHistory integration
    versionHistoryWatcher,

    // Sending
    calculateSendMaxFeeWatcher,
  ]

  yield all(
    sagas.map( ( saga ) =>
      spawn( function* () {
        while ( true ) {
          try {
            yield call( saga )
            break
          } catch ( e ) {
            console.log( e )
          }
        }
      } )
    )
  )
}

const rootReducer = combineReducers( {
  storage: storageReducer,
  setupAndAuth: setupAndAuthReducer,
  accounts: accountsReducer,
  sss: sssReducer,
  fbtc: fBTCReducers,
  nodeSettings: nodeSettingsReducer,
  notifications: notificationsReducer,
  sending: sendingReducer,
  trustedContacts: trustedContactsReducer,
  preferences: preferencesReducer,
  loaders,
  swanIntegration: swanIntegrationReducer,
  walletRescanning: walletRescanningReducer,
  wyreIntegration: wyreIntegrationReducer,
  versionHistory: VersionHistoryReducer,
} )

export default function makeStore() {
  const sagaMiddleware = createSagaMiddleware()
  const reducers = persistReducer( config, rootReducer )
  const storeMiddleware = composeWithDevTools(
    applyMiddleware( sagaMiddleware, thunk )
  )

  const store = createStore( reducers, storeMiddleware )

  persistStore( store )
  sagaMiddleware.run( rootSaga )

  return store
}
