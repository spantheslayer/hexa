import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../common/Colors";
import BottomSheet from "reanimated-bottom-sheet";
import ModalHeader from "../../components/ModalHeader";
import HistoryPageComponent from "./HistoryPageComponent";
import PersonalCopyShareModal from "../../components/PersonalCopyShareModal";
import moment from "moment";
import _ from "underscore";
import DeviceInfo, { getFirstInstallTime } from "react-native-device-info";
import ErrorModalContents from "../../components/ErrorModalContents";
import SmallHeaderModal from "../../components/SmallHeaderModal";
import PersonalCopyHelpContents from "../../components/Helper/PersonalCopyHelpContents";
import HistoryHeaderComponent from "./HistoryHeaderComponent";
import {
  getPDFData,
  confirmPDFShared,
  sendApprovalRequest,
  onApprovalStatusChange,
  emptyShareTransferDetailsForContactChange,
  secondaryShareDownloaded,
} from "../../store/actions/health";
import KeeperTypeModalContents from "./KeeperTypeModalContent";
import {
  LevelHealthInterface,
  notificationType,
} from "../../bitcoin/utilities/Interface";
import { StackActions } from "react-navigation";
import QRModal from "../Accounts/QRModal";
import S3Service from "../../bitcoin/services/sss/S3Service";
import ApproveSetup from "./ApproveSetup";

const PersonalCopyHistory = (props) => {
  const dispatch = useDispatch();
  const [ErrorBottomSheet, setErrorBottomSheet] = useState(React.createRef());
  const [HelpBottomSheet, setHelpBottomSheet] = useState(React.createRef());
  const [keeperTypeBottomSheet, setkeeperTypeBottomSheet] = useState(
    React.createRef()
  );
  const [selectedKeeperType, setSelectedKeeperType] = useState("");
  const [selectedKeeperName, setSelectedKeeperName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageHeader, setErrorMessageHeader] = useState("");
  const [QrBottomSheet, setQrBottomSheet] = useState(React.useRef());
  const [QrBottomSheetsFlag, setQrBottomSheetsFlag] = useState(false);
  const [blockReshare, setBlockReshare] = useState("");
  const s3Service: S3Service = useSelector( ( state ) => state.health.service )
  const [ApprovePrimaryKeeperBottomSheet, setApprovePrimaryKeeperBottomSheet] = useState(React.createRef());
  const [personalCopyHistory, setPersonalCopyHistory] = useState([
    {
      id: 1,
      title: "Recovery Key created",
      date: null,
      info: "Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit",
    },
    {
      id: 2,
      title: "Recovery Key in-transit",
      date: null,
      info:
        "consectetur adipiscing Lorem ipsum dolor sit amet, consectetur sit amet",
    },
    {
      id: 3,
      title: "Recovery Key accessible",
      date: null,
      info: "Lorem ipsum dolor Lorem dolor sit amet, consectetur dolor sit",
    },
    {
      id: 4,
      title: "Recovery Key not accessible",
      date: null,
      info: "Lorem ipsum Lorem ipsum dolor sit amet, consectetur sit amet",
    },
  ]);
  const [
    PersonalCopyShareBottomSheet,
    setPersonalCopyShareBottomSheet,
  ] = useState(React.createRef());

  const selectedPersonalCopy = props.navigation.getParam(
    "selectedPersonalCopy"
  );

  const [personalCopyDetails, setPersonalCopyDetails] = useState(null);
  const [isPrimaryKeeper, setIsPrimaryKeeper] = useState(
    props.navigation.state.params.isPrimaryKeeper
  );
  const [selectedLevelId, setSelectedLevelId] = useState(
    props.navigation.state.params.selectedLevelId
  );
  const [selectedKeeper, setSelectedKeeper] = useState(
    props.navigation.state.params.selectedKeeper
  );
  const [isReshare, setIsReshare] = useState(
    props.navigation.state.params.selectedTitle == "Pdf Keeper" ? false : true
  );
  const levelHealth = useSelector((state) => state.health.levelHealth);
  const currentLevel = useSelector((state) => state.health.currentLevel);
  const keeperInfo = useSelector((state) => state.health.keeperInfo);
  const pdfInfo = useSelector((state) => state.health.pdfInfo);
  const keeperApproveStatus = useSelector(
    (state) => state.health.keeperApproveStatus
  );
  const [isChange, setIsChange] = useState(false);
  useEffect(() => {
    setIsPrimaryKeeper(props.navigation.state.params.isPrimaryKeeper);
    setSelectedLevelId(props.navigation.state.params.selectedLevelId);
    setSelectedKeeper(props.navigation.state.params.selectedKeeper);
    setIsReshare(
      props.navigation.state.params.selectedTitle == "Pdf Keeper" ? false : true
    );
    setIsChange(
      props.navigation.state.params.isChangeKeeperType
        ? props.navigation.state.params.isChangeKeeperType
        : false
    );
  }, [
    props.navigation.state.params.selectedLevelId,
    props.navigation.state.params.isPrimaryKeeper,
    props.navigation.state.params.selectedKeeper,
    props.navigation.state.params.selectedStatus,
  ]);

  // const saveInTransitHistory = async () => {
  //   try{
  //       const shareHistory = JSON.parse(await AsyncStorage.getItem("shareHistory"));
  //     if (shareHistory) {
  //       let updatedShareHistory = [...shareHistory];
  //       // updatedShareHistory = {
  //       //   ...updatedShareHistory,
  //       //   inTransit: Date.now(),
  //       // };
  //       updateHistory(updatedShareHistory);
  //       await AsyncStorage.setItem(
  //         "shareHistory",
  //         JSON.stringify(updatedShareHistory)
  //       );
  //     }
  //   }catch(e){
  //     console.log('e', e)
  //   }
  // };

  const sortedHistory = (history) => {
    const currentHistory = history.filter((element) => {
      if (element.date) return element;
    });

    const sortedHistory = _.sortBy(currentHistory, "date");
    sortedHistory.forEach((element) => {
      element.date = moment(element.date)
        .utc()
        .local()
        .format("DD MMMM YYYY HH:mm");
    });

    return sortedHistory;
  };

  const updateHistory = (shareHistory) => {
    const updatedPersonalCopyHistory = [...personalCopyHistory];
    if (shareHistory.createdAt)
      updatedPersonalCopyHistory[0].date = shareHistory.createdAt;
    if (shareHistory.inTransit)
      updatedPersonalCopyHistory[1].date = shareHistory.inTransit;

    if (shareHistory.accessible)
      updatedPersonalCopyHistory[2].date = shareHistory.accessible;

    if (shareHistory.notAccessible)
      updatedPersonalCopyHistory[3].date = shareHistory.notAccessible;

    setPersonalCopyHistory(updatedPersonalCopyHistory);
  };

  useEffect(() => {
    (async () => {
      console.log('isChange', isChange);
      console.log("useEffect pdfInfo", pdfInfo);
      dispatch(getPDFData(selectedKeeper.shareId, isChange));
      const shareHistory = JSON.parse(
        await AsyncStorage.getItem("shareHistory")
      );
      if (shareHistory) updateHistory(shareHistory);
    })();
  }, []);

  const renderErrorModalContent = useCallback(() => {
    return (
      <ErrorModalContents
        modalRef={ErrorBottomSheet}
        title={errorMessageHeader}
        info={errorMessage}
        proceedButtonText={"Try again"}
        onPressProceed={() => {
          (ErrorBottomSheet as any).current.snapTo(0);
        }}
        isBottomImage={true}
        bottomImage={require("../../assets/images/icons/errorImage.png")}
      />
    );
  }, [errorMessage, errorMessageHeader]);

  const renderErrorModalHeader = useCallback(() => {
    return (
      <ModalHeader
      // onPressHeader={() => {
      //   (ErrorBottomSheet as any).current.snapTo(0);
      // }}
      />
    );
  }, []);

  const renderPersonalCopyShareModalContent = useCallback(() => {
    return (
      <PersonalCopyShareModal
        removeHighlightingFromCard={() => {}}
        selectedPersonalCopy={selectedPersonalCopy}
        personalCopyDetails={personalCopyDetails}
        onPressBack={() => {
          (PersonalCopyShareBottomSheet as any).current.snapTo(0);
        }}
        onPressShare={() => {}}
        onPressConfirm={() => {
          try {
            dispatch(confirmPDFShared(selectedKeeper.shareId));
            (PersonalCopyShareBottomSheet as any).current.snapTo(0);
            if (
              props.navigation.getParam("prevKeeperType") &&
              props.navigation.getParam("isChange") &&
              props.navigation.getParam("contactIndex") &&
              props.navigation.getParam("prevKeeperType") == "contact" &&
              props.navigation.getParam("contactIndex") != null
            ) {
              dispatch(
                emptyShareTransferDetailsForContactChange(
                  props.navigation.getParam("contactIndex")
                )
              );
            }
            const popAction = StackActions.pop({ n: isChange ? 2 : 1 });
            props.navigation.dispatch(popAction);
          } catch (err) {
            console.log("error", err);
          }
        }}
      />
    );
  }, [selectedPersonalCopy, personalCopyDetails]);

  const renderPersonalCopyShareModalHeader = useCallback(() => {
    return (
      <ModalHeader
        onPressHeader={() => {
          (PersonalCopyShareBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }, []);

  const renderHelpHeader = () => {
    return (
      <SmallHeaderModal
        borderColor={Colors.blue}
        backgroundColor={Colors.blue}
        onPressHeader={() => {
          if (HelpBottomSheet.current)
            (HelpBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  };

  const renderHelpContent = () => {
    return (
      <PersonalCopyHelpContents
        titleClicked={() => {
          if (HelpBottomSheet.current)
            (HelpBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  };

  const onPressChangeKeeperType = (type, name) => {
    let levelhealth: LevelHealthInterface[] = [];
    if (levelHealth[1] && levelHealth[1].levelInfo.findIndex((v) => v.updatedAt > 0) > -1)
      levelhealth = [levelHealth[1]];
    if (levelHealth[2] && levelHealth[2].levelInfo.findIndex((v) => v.updatedAt > 0) > -1)
      levelhealth = [levelHealth[1], levelHealth[2]];
    if (currentLevel == 3 && levelHealth[2])
      levelhealth = [levelHealth[2]];
    let changeIndex = 1;
    let contactCount = 0;
    let deviceCount = 0;
    for (let i = 0; i < levelhealth.length; i++) {
      const element = levelhealth[i];
      for (let j = 2; j < element.levelInfo.length; j++) {
        const element2 = element.levelInfo[j];
        if (
          element2.shareType == "contact" &&
          selectedKeeper &&
          selectedKeeper.shareId != element2.shareId &&
          levelhealth[i] &&
          selectedKeeper.shareType == "contact"
        ) {
          contactCount++;
        }
        if (
          element2.shareType == "device" &&
          selectedKeeper &&
          selectedKeeper.shareId != element2.shareId &&
          levelhealth[i] &&
          selectedKeeper.shareType == "device"
        ) {
          deviceCount++;
        }
        let kpInfoContactIndex = keeperInfo.findIndex((value) => value.shareId == element2.shareId && value.type == "contact");
        if (element2.shareType == "contact" && contactCount < 2) {
          if (kpInfoContactIndex > -1 && keeperInfo[kpInfoContactIndex].data.index == 1) {
            changeIndex = 2;
          } else changeIndex = 1;
        }
        if (element2.shareType == "device" && deviceCount == 1) {
          changeIndex = 3;
        } else if(element2.shareType == "device" && deviceCount == 2){
          changeIndex = 4;
        }
      }
    }
    if (type == "contact") {
      props.navigation.navigate("TrustedContactHistoryNewBHR", {
        ...props.navigation.state.params,
        selectedTitle: name,
        index: changeIndex,
        isChangeKeeperType: true,
      });
    }
    if (type == "device") {
      props.navigation.navigate("SecondaryDeviceHistoryNewBHR", {
        ...props.navigation.state.params,
        selectedTitle: name,
        index: changeIndex,
        isChangeKeeperType: true,
      });
    }
    if (type == "pdf") {
      (PersonalCopyShareBottomSheet as any).current.snapTo(1);
    }
  };
  const sendApprovalRequestToPK = (type) => {
    setQrBottomSheetsFlag(true);
    (QrBottomSheet as any).current.snapTo(1);
    (keeperTypeBottomSheet as any).current.snapTo(0);
  };

  const renderQrContent = () => {
    return (
      <QRModal
        isFromKeeperDeviceHistory={true}
        QRModalHeader={"QR scanner ddfds"}
        title={"Note"}
        infoText={
          "Lorem ipsum dolor sit amet consetetur sadipscing elitr, sed diam nonumy eirmod"
        }
        modalRef={QrBottomSheet}
        isOpenedFlag={QrBottomSheetsFlag}
        onQrScan={async(qrScannedData) => {
          try {
            if (qrScannedData) {
              let qrData = JSON.parse(qrScannedData);
              console.log('qrData', qrData);
              const res = await S3Service.downloadSMShare(qrData.publicKey);
              console.log("Keeper Shares", res);
              if (res.status === 200) {
                console.log("SHARES DOWNLOAD", res.data);
                dispatch(secondaryShareDownloaded(res.data.metaShare));
                (ApprovePrimaryKeeperBottomSheet as any).current.snapTo(1);
                (QrBottomSheet as any).current.snapTo(0);
              }
            }
          } catch (err) {
            console.log({ err });
          }
          setQrBottomSheetsFlag(false);
          (QrBottomSheet as any).current.snapTo(0);
        }}
        onBackPress={() => {
          setQrBottomSheetsFlag(false);
          if (QrBottomSheet) (QrBottomSheet as any).current.snapTo(0);
        }}
        onPressContinue={async() => {
          let qrScannedData = '{"requester":"ShivaniH","publicKey":"XCi8FEPHHE8mqVJxRuZQNCrJ","uploadedAt":1615528421395,"type":"ReverseRecoveryQR","ver":"1.4.6"}';
          try {
            if (qrScannedData) {
              let qrData = JSON.parse(qrScannedData);
              console.log('qrData', qrData);
              const res = await S3Service.downloadSMShare(qrData.publicKey);
              console.log("Keeper Shares", res);
              if (res.status === 200) {
                console.log("SHARES DOWNLOAD", res.data);
                dispatch(secondaryShareDownloaded(res.data.metaShare));
                (ApprovePrimaryKeeperBottomSheet as any).current.snapTo(1);
                (QrBottomSheet as any).current.snapTo(0);
              }
            }
          } catch (err) {
            console.log({ err });
          }
          setQrBottomSheetsFlag(false);
          (QrBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }

  const renderQrHeader = () => {
    return (
      <ModalHeader
        onPressHeader={() => {
          setQrBottomSheetsFlag(false);
          (QrBottomSheet as any).current.snapTo(0);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: Colors.backgroundColor }}
      />
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <HistoryHeaderComponent
        onPressBack={() => props.navigation.goBack()}
        selectedTitle={props.navigation.state.params.selectedTitle}
        selectedTime={props.navigation.state.params.selectedTime}
        selectedStatus={props.navigation.state.params.selectedStatus}
        moreInfo={props.navigation.state.params.selectedTitle}
        headerImage={require("../../assets/images/icons/note.png")}
      />
      <View style={{ flex: 1 }}>
        <HistoryPageComponent
          type={"copy"}
          IsReshare={isReshare}
          data={sortedHistory(personalCopyHistory)}
          confirmButtonText={"Confirm"}
          onPressConfirm={() => {
            (PersonalCopyShareBottomSheet as any).current.snapTo(1);
          }}
          reshareButtonText={"Restore Keeper"}
          onPressReshare={async () => {
            console.log(
              "onPressReshare PersonalCopyShareBottomSheet",
              PersonalCopyShareBottomSheet
            );
            (PersonalCopyShareBottomSheet as any).current.snapTo(1);
          }}
          changeButtonText={"Change Keeper"}
          onPressChange={() => {
            (keeperTypeBottomSheet as any).current.snapTo(1);
          }}
        />
      </View>
      <BottomSheet
        enabledInnerScrolling={true}
        ref={PersonalCopyShareBottomSheet as any}
        snapPoints={[-50, hp("85%")]}
        renderContent={renderPersonalCopyShareModalContent}
        renderHeader={renderPersonalCopyShareModalHeader}
      />
      <BottomSheet
        enabledGestureInteraction={false}
        enabledInnerScrolling={true}
        ref={ErrorBottomSheet as any}
        snapPoints={[
          -50,
          Platform.OS == "ios" && DeviceInfo.hasNotch() ? hp("35%") : hp("40%"),
        ]}
        renderContent={renderErrorModalContent}
        renderHeader={renderErrorModalHeader}
      />

      <BottomSheet
        enabledInnerScrolling={true}
        ref={HelpBottomSheet as any}
        snapPoints={[
          -50,
          Platform.OS == "ios" && DeviceInfo.hasNotch() ? hp("87%") : hp("89%"),
        ]}
        renderContent={renderHelpContent}
        renderHeader={renderHelpHeader}
      />
      <BottomSheet
        enabledInnerScrolling={true}
        ref={keeperTypeBottomSheet as any}
        snapPoints={[
          -50,
          Platform.OS == "ios" && DeviceInfo.hasNotch() ? hp("75%") : hp("75%"),
        ]}
        renderContent={() => (
          <KeeperTypeModalContents
            onPressSetup={async (type, name) => {
              setSelectedKeeperType(type);
              setSelectedKeeperName(name);
              sendApprovalRequestToPK(type);
            }}
            onPressBack={() => (keeperTypeBottomSheet as any).current.snapTo(0)}
            selectedLevelId={selectedLevelId}
            keeper={selectedKeeper}
          />
        )}
        renderHeader={() => (
          <SmallHeaderModal
            onPressHeader={() =>
              (keeperTypeBottomSheet as any).current.snapTo(0)
            }
          />
        )}
      />
      <BottomSheet
        onOpenEnd={() => {
          setQrBottomSheetsFlag( true )
        }}
        onCloseEnd={() => {
          setQrBottomSheetsFlag( false );
          ( QrBottomSheet as any ).current.snapTo( 0 )
        }}
        onCloseStart={() => { }}
        enabledGestureInteraction={false}
        enabledInnerScrolling={true}
        ref={QrBottomSheet as any}
        snapPoints={[
          -50,
          Platform.OS == 'ios' && DeviceInfo.hasNotch() ? hp( '92%' ) : hp( '91%' ),
        ]}
        renderContent={renderQrContent}
        renderHeader={renderQrHeader}
      />
      <BottomSheet
          enabledInnerScrolling={true}
          ref={ApprovePrimaryKeeperBottomSheet as any}
          snapPoints={[
            -50,
            Platform.OS == "ios" && DeviceInfo.hasNotch() ? hp("60%") : hp("70"),
          ]}
          renderContent={() => (
            <ApproveSetup
              isContinueDisabled={false}
              onPressContinue={() => {
                onPressChangeKeeperType(selectedKeeperType, selectedKeeperName);
                (ApprovePrimaryKeeperBottomSheet as any).current.snapTo(0);
              }}
            />
          )}
          renderHeader={() => (
            <SmallHeaderModal
              onPressHeader={() => {
                (keeperTypeBottomSheet as any).current.snapTo(1);
                (ApprovePrimaryKeeperBottomSheet as any).current.snapTo(0);
              }}
            />
          )}
        />
    </View>
  );
};

export default PersonalCopyHistory;

const styles = StyleSheet.create({});