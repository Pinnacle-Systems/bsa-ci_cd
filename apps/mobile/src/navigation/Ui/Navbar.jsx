import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook

import {useCustomFonts} from '@Component/CustomHooks/useFonts';
import NotificationModal from '@Component/Modal/NotificationModal';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setUserDetails} from '@Redux/Slices/UserDetails';
import MisDashboard, {
  useGetCommonDataQuery,
  useGetUserMobDataQuery,
} from '@Redux/service/misDashboardService';

import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGetPermissionRequestQuery} from '@Redux/service/Notification';
import socket from '@Utils/Socket';
import {showMessage} from 'react-native-flash-message';
import {Notofication_Approval_handler} from '@Utils/Notification_approval_Handler';
import {TextOnlyDropdown} from '@ReusableComponents/TextOnlyDropDown';
import UsersApi, {useGetCompanycodeQuery} from '@Redux/service/user';
import {RestartApi} from '@Utils/RestartApi';
import AdvanceData from '@Redux/service/Advance';
import {permission} from '@Redux/service';
import {Common_Context} from '@Context/Common_Context';
import {CustomNavigation} from '@Utils/NavigationRef';
import tailwind from 'twrnc';
import OndutyRTk from '@Redux/service/Onduty';
import RoleOnSevices from '@Redux/service/RoleOn';

const ANGLE = 10;
const TIME = 100;
const EASING = Easing.elastic(1.5);

export default function NavBar({openSidebar, setopenSidebar}) {
  const {fontsLoaded} = useCustomFonts();
  const dispatch = useDispatch();
  const [notification_Count, setNotification_count] = useState(0);
  const [livechange_Notifi, setLivechange_Notifi] = useState();
  const UserSelect = useSelector(state => state?.UserDetails);
  const commoncontext = useContext(Common_Context);
  const [GlobalSelected, setGlobalSelected] = useState();
  // const [openLogoutModal,setLogoutModal]=useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${rotation.value}deg`}],
  }));
  const navigation = useNavigation(); // Use the hook to get the navigation object
  const [wishes, setwishes] = useState((new Date().getHours() + 24) % 12 || 12);
  const [User, setUserName] = useState();

  const {data: companyCode, refetch: companycoderef} = useGetCompanycodeQuery();

  //role
  const {data: getUserRole, refetch} = useGetCommonDataQuery({
    table: 'MOBILEUSER m,GTDESIGNATIONMAST g,HREMPLOYDETAILS d ',
    fields:
      'm.ROLE,d.DEPTNAME,d.HOSTEL,d.PF,d.IDCARD,d.VEHICLE,d.SALTYPE,d.ESI,d.DOJ,g.DESIGNATION',
    where: ` d.IDCARD=m.ID and  d.DESIGNATION=g.GTDESIGNATIONMASTID and m.ID='${UserSelect?.UserId}'`,
  });

  const {
    data: mobData,
    isSuccess,
    isLoading,
    error,
    refetch: mobref,
  } = useGetUserMobDataQuery({
    params: {Idcard: UserSelect.IDCARD, GCOMPCODE: UserSelect?.GCOMPCODE},
  });

  const {
    data: notifidata,
    error: Notifipermissionerror,
    refetch: notifyref,
  } = useGetPermissionRequestQuery({
    params:
      UserSelect.IDCARD == UserSelect.hod ||
      UserSelect.IDCARD == UserSelect.hr ||
      UserSelect?.level != 'user'
        ? {hod: UserSelect.IDCARD, hr: UserSelect.IDCARD}
        : {emp: UserSelect.IDCARD},
  });
  //  alert(JSON?.stringify(mobData))

  useEffect(() => {
    var count = notifidata?.data ? Number(notifidata?.data?.length) : 0;
    setNotification_count(count);
  }, [notifidata?.data]);

  useEffect(() => {
    let anim;

    if (notification_Count > 0) {
      anim = setInterval(() => {
        rotation.value = withSequence(
          withTiming(-ANGLE, {duration: TIME / 2, easing: EASING}),
          withRepeat(
            withTiming(ANGLE, {duration: TIME, easing: EASING}),
            7,
            true,
          ),
          withTiming(0, {duration: TIME / 2, easing: EASING}),
        );
      }, 10000);
    }

    return () => clearInterval(anim); // Proper cleanup
  }, [notification_Count]);

  const Get_Notification_handler = data => {
    setNotification_count(count => count + 1);
    setLivechange_Notifi(data);
    showMessage({
      message: '🔔 New Notification',
      description: `📩 Request from ${data?.data?.userdata?.username}`,
      type: 'success', // still controls the default color unless overridden
      backgroundColor: '#4CAF50', // green background (overrides `type`)
      color: '#fff', // white text
      icon: {icon: 'success', position: 'left'}, // icon appearance
      style: {
        padding: 16,
        borderLeftWidth: 5,
        borderLeftColor: '#2e7d32',
        borderRadius: 8,
        marginTop: 10,
        marginHorizontal: 10,
        elevation: 5,
      },
      titleStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      textStyle: {
        fontSize: 14,
      },
      duration: 5000,
    });
  };

  useEffect(() => {
    if (!UserSelect?.UserId || !socket?.connected) {
      return;
    }

    const get_Notifi_Socket = {
      ['get_Notifi_permission_id:' +
      UserSelect?.GCOMPCODE +
      UserSelect?.UserId]: Get_Notification_handler,
      ['get_Notifi_leave_id:' + UserSelect?.GCOMPCODE + UserSelect?.UserId]:
        Get_Notification_handler,
      ['get_Notifi_onduty_id:' + UserSelect?.GCOMPCODE + UserSelect?.UserId]:
        Get_Notification_handler,
      ['get_Notifi_advance_id:' + UserSelect?.GCOMPCODE + UserSelect?.UserId]:
        Get_Notification_handler,
    };

    Object.entries(get_Notifi_Socket).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    const socketEvents = {
      ['get_Approval_Notifi:' +
      UserSelect?.GCOMPCODE +
      '' +
      UserSelect?.UserId]: Notofication_Approval_handler,
      ['get_leave_Approval_Notifi:' +
      UserSelect?.GCOMPCODE +
      '' +
      UserSelect?.UserId]: Notofication_Approval_handler,
      ['get_advance_Approval_Notifi:' +
      UserSelect?.GCOMPCODE +
      '' +
      UserSelect?.UserId]: Notofication_Approval_handler,
      ['get_Onduty_Approval_status:' +
      UserSelect?.GCOMPCODE +
      '' +
      UserSelect?.UserId]: Notofication_Approval_handler,
    };

    Object.entries(socketEvents).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(get_Notifi_Socket).forEach(([event, handler]) => {
        socket.off(event, handler);
      });

      Object.entries(socketEvents).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [UserSelect, socket?.connected]);

  useEffect(() => {
    if (error) {
      dispatch(
        setUserDetails({
          error,
        }),
      );
    } else {
      dispatch(
        setUserDetails({
          isLoading,
        }),
      );
    }
  }, [isLoading]);

  useEffect(() => {
    if (mobData?.data) {
      dispatch(
        setUserDetails({
          ...mobData?.data[0],
          ...mobData?.data,
        }),
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (GlobalSelected) {
      AsyncStorage?.getItem('userName', (error, result) => {
        if (!error) {
          const GetuserDetails = JSON.parse(result);

          const {GCOMPCODE: OLD, ...reset} = GetuserDetails;
          AsyncStorage?.setItem(
            'userName',
            JSON?.stringify({...reset, GCOMPCODE: GlobalSelected}),
          ).finally(() => {
            dispatch(
              setUserDetails({
                userName: GetuserDetails?.userName,
                UserId: GetuserDetails?.Id,
                IDCARD: GetuserDetails?.Id,
                GCOMPCODE: GlobalSelected,
                COMPID: GetuserDetails?.COMPID,
                hod: GetuserDetails?.hod,
                approval: GetuserDetails?.approval,
                hr: GetuserDetails?.hr,
                Role: getUserRole?.data[0]?.ROLE,
              }),
            );
          });
        }
      }).finally(() => {
        RestartApi(
          [
            AdvanceData,
            UsersApi,
            MisDashboard,
            permission,
            OndutyRTk,
            RoleOnSevices,
          ],
          dispatch,
        );
      });
    }
  }, [GlobalSelected]);

  useEffect(() => {
    if (!GlobalSelected) {
      AsyncStorage?.getItem('userName', (error, result) => {
        if (!error) {
          const GetuserDetails = JSON.parse(result);
          setUserName(GetuserDetails?.userName);
          dispatch(
            setUserDetails({
              userName: GetuserDetails?.userName,
              UserId: GetuserDetails?.Id,
              IDCARD: GetuserDetails?.Id,
              GCOMPCODE: GetuserDetails?.GCOMPCODE,
              COMPID: GetuserDetails?.COMPID,
              hod: GetuserDetails?.hod,
              approval: GetuserDetails?.approval,
              hr: GetuserDetails?.hr,
              Role: getUserRole?.data[0]?.ROLE,
            }),
          );
        }
      });
    }
  }, [User, GlobalSelected]);

  function getAmOrPm(date) {
    return date
      .toLocaleString('en-US', {hour: '2-digit', hour12: true})
      .split(' ')[1]; // Extracts AM/PM
  }

  const wishesTXT = () => {
    if (wishes >= 0 && wishes <= 12 && getAmOrPm(new Date()) == 'AM') {
      return 'Good Morning';
    } else if (wishes <= 6 && wishes >= 3) {
      return 'Good Evening';
    } else if (wishes >= 12 && getAmOrPm(new Date()) == 'PM') {
      return 'Good Afternoon';
    } else {
      return 'Good Afternoon';
    }
  };

  return (
    <SafeAreaView
      style={[
        NewStyle.header,
        tailwind`shadow-xs bg-white border-gray-400   `,
      ]}>
      {/* <View style={{position:"absolute"}}>  <LogoutModal isModalVisible={openLogoutModal}  confirm={()=>{
            handleLogout(navigation)
            navigation?.reset({
                index: 0, // This represents the index of the screen in the stack you want to be active
                routes: [
                  { name: 'LOGIN' }, // Replace with the name of the screen you want to navigate to
                ],
              })
            setLogoutModal(false)
          }} cancel={()=>setLogoutModal(false)}></LogoutModal></View> */}
      {/*   <Image
                style={styles.title}
                source={require('@Component/img/bharani-small.png')}
            />

            <View style={styles.log}>
                <TouchableOpacity onPress={handleNavigate} style={styles.iconContainer}>
                    <Icon name="user" size={26} color="white" />
                </TouchableOpacity>

                <LogoutButton style={styles.logoutButton} />
            </View>
           */}

      <View style={[NewStyle?.wishesView, tailwind` p-0 px-2 rounded-full`]}>
        {/*<CustomText style={NewStyle?.TimeDate} >{formattedDate}</CustomText>*/}

        <TouchableOpacity
          onPress={() => {
            CustomNavigation('HOME');
          }}>
          <Image
            style={[tailwind`w-40 h-10    p-4   text-left`]}
            resizeMode={'cover'}
            source={require('../../assets/logo.png')}
          />
        </TouchableOpacity>
        {/* <Entypo name="chevron-small-down"   size={26} color="black" /> */}

        <View>
          {commoncontext?.admin == 1 && commoncontext?.admin && (
            <TextOnlyDropdown
              selected={GlobalSelected}
              disabled={commoncontext?.admin == 1 ? false : true}
              auto_open={GlobalSelected || UserSelect?.GCOMPCODE}
              label={<Text>{GlobalSelected || UserSelect?.GCOMPCODE}</Text>}
              setSelected={setGlobalSelected}
              labelstyle={NewStyle?.wishes}
              options={companyCode}
              zIndex={300}
            />
          )}

          {/* <Text style={[NewStyle?.wishes,tailwind`text-sm m-auto`]}>{GlobalSelected || UserSelect?.GCOMPCODE} </Text> */}
        </View>

        {/* <CustomText style={NewStyle?.wishes}>{wishesTXT()} {User}</CustomText>  */}
      </View>

      <View style={NewStyle?.NotificationView}>
        <View style={{position: 'absolute', textAlign: 'center'}}>
          <NotificationModal
            close_modal={setModalVisible}
            data={notifidata}
            livedata={livechange_Notifi}
            refresh={notifyref}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={{position: 'relative'}}>
          <View style={NewStyle.notificationBadge}>
            <Text style={NewStyle.badgeText}>{notification_Count}</Text>
          </View>
          <Animated.View style={animatedStyle}>
            <Ionicons
              style={NewStyle.iconWrap}
              name="notifications-outline"
              size={24}
              color="#2036c5"
            />
          </Animated.View>
        </Pressable>

        {/* <Pressable onPress={()=>setLogoutModal(true)} > <MaterialCommunityIcons name="location-exit" size={24} color="black" /></Pressable> */}
        <Pressable
          onPress={() => setopenSidebar(true)}
          style={NewStyle.iconContainer}>
          <AntDesign name="bars" size={22} color="#2036c5" />
        </Pressable>
      </View>

      {/* <View style={{position:"absolute",zIndex:10,right:-8,bottom:-13,width:15,borderTopEndRadius:0,borderTopRightRadius:0,height:27,borderBottomStartRadius:9,backgroundColor:"#4927a1",  transform: [{rotateZ:"-40deg"},{rotateY:"20deg"}]}}></View>
        <View style={{position:"absolute",zIndex:10,left:-8,bottom:-9,width:15,borderTopEndRadius:10,borderTopLeftRadius:0,height:20,borderBottomStartRadius:20,backgroundColor:"#4927a1",  transform: [{rotateZ:"40deg"},{rotateY:"20deg"}]}}></View> */}
    </SafeAreaView>
  );
}

const NewStyle = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },

  wishesView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },

  TimeDate: {
    opacity: 0.5,
    fontSize: 12,
    color: '#555',
  },

  wishes: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#57575e',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
    fontFamily: 'System',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 9,
  },

  NotificationView: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  iconContainer: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#2036c5',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconWrap: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 10,
    elevation: 2,
  },
});

/*
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        fontFamily:"Dosis-Light",
        marginTop: 15,
        paddingVertical: 12,
        borderTopWidth:.1,
        borderBottomWidth: .5,
        borderBottomColor: '#8e8d8f',
        shadowColor: "#8e8d8f",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 50,
         // Slight shadow effect for iOS-like feel
    },
    title: {
        width: 140,
        height: 35,
        margin: 5,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: "white",
        borderRadius: 8, // More rounded corners for a clean, soft look
        borderWidth: 0.5, // Thin border
        borderColor: '#dcdcdc', // Light border for a more subtle look
    },
    log: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        paddingLeft:8,
        paddingRight:8,
        paddingBottom:4,
        paddingTop:4,
        backgroundColor: '#007bff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    logoutButton: {
        marginLeft: 10,
    },
});*/
