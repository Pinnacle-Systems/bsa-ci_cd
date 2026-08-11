import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Master_Meta, Permission_Meta} from '@Redux/States/Master/Master';
import InputWraper from '@Screens/InputWraper';
import {useDispatch, useSelector} from 'react-redux';
import {
  useGet__per_categoryQuery,
  useGetDocIDQuery,
  useRequestPermissionMutation,
} from '@Redux/service/permission';
import {setInput} from '@Redux/Slices/inputsHandler';
import {formattedDate} from '@Utils/FormatedDate';
import {parseDateStringToISO} from '@Utils/FormateToISO';
import {showMessage} from 'react-native-flash-message';
import socket from '@Utils/Socket';
import {
  useGet_hod_tokenQuery,
  useGet_refresh_tokenQuery,
} from '@Redux/service/user';
import {_FCM_SENDER} from '@Utils/FCM';
import {screenWidth} from '@Utils/Screens';
import {calculateTimeDifference} from '@Utils/Differnent_Time';

const PermissionEntry = () => {
  const InputState = useSelector(state => state?.Input?.Permission_state);
  const {data: ref_token, isError: ref_token_error} =
    useGet_refresh_tokenQuery();
  const {data: get_per_category} = useGet__per_categoryQuery({
    type: 'permission',
  });

  const UserSelect = useSelector(state => state?.UserDetails);
  const [add_requestPer] = useRequestPermissionMutation();
  const {data, error, refetch} = useGetDocIDQuery();
  const dispatch = useDispatch();

  const {
    data: hodfcm,
    isLoading,
    isError,
    error: terr,
  } = useGet_hod_tokenQuery({params: {hod: UserSelect?.hod}});

  const handleSubmit = async () => {
    const {idcard, docdate, fTime, tTime, thrs, reason, docid, category} =
      InputState;
    const docDateIso = parseDateStringToISO(docdate);

    // ── Refetch fresh doc ID instantly to prevent sequence race conditions ──
    const latestDocQuery = await refetch();
    const latestCount =
      latestDocQuery?.data?.data?.count || data?.data?.count || 0;
    let finalDocid = docid || 'DOC_ID';
    if (latestCount) {
      const paddedCount = latestCount.toString().padStart(6, '0');
      finalDocid = `PER-${paddedCount}`;
    }

    const payload = {
      userId: idcard,
      docDate: new Date(docDateIso),
      hod: String(UserSelect?.hod),
      createdBy: UserSelect?.UserId,
      userId: UserSelect?.UserId,
      compCode: UserSelect?.GCOMPCODE,
      username: UserSelect?.EMPNAME,
      fTime,
      tTime,
      modified_By: UserSelect?.UserId,
      docid: finalDocid,
      reason,
      mobile: String(UserSelect?.MOBNO),
      thrs,
      category,
    };

    try {
      const response = await add_requestPer({
        data: payload,
        params: {docCount: Number(latestCount)},
      }).unwrap();
      if (response?.status == 1) {
        showMessage({
          message: 'Permission',
          description: 'permission request sent successfully',
          type: 'success',
        });

        dispatch(
          setInput({
            fTime: '',
            tTime: '',
            thrs: '',
            category: '',
            reason: '',
            id: 'Permission_state',
          }),
        );
        socket.emit('permission_request', {
          hod: UserSelect?.hod,
          hr: String(UserSelect?.hr),
          compcode: UserSelect?.GCOMPCODE,
          userdata: {
            email: '',
            username: UserSelect?.userName,
            Idcard: UserSelect?.UserId,
            mobile: UserSelect?.MOBNO,
          },
          ...response?.data,
        });
      } else if (response?.status == 500) {
        const error = response?.error;
        if (error?.meta?.field_name == 'hod') {
          Alert.alert('Error', 'Hod User Not Found');
        } else {
          const errString =
            response?.message ||
            response?.error?.message ||
            JSON.stringify(response?.error) ||
            'Server error occurred.';
          Alert.alert('Server Error', errString);
        }
      } else {
        const errDesc =
          response?.message || response?.error || 'permission request failed';
        showMessage({
          message: 'Permission Failed',
          description:
            typeof errDesc === 'string' ? errDesc : JSON.stringify(errDesc),
          type: 'danger',
        });
      }

      try {
        const notificationResponse = await _FCM_SENDER(
          ref_token?.data?.token,
          hodfcm?.data?.fcm,
          'Request By : ' + UserSelect?.EMPNAME,
        );
      } catch (notificationError) {
        console.warn('Error sending notification:', notificationError);
      }
    } catch (error) {
      console.error('Permission submit error:', error);
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        error?.error ||
        JSON.stringify(error);
      Alert.alert(
        'Submission Failed',
        typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
      );
    } finally {
      // ✅ Always explicitly update UI doc ID after attempt
      await refetch();
    }
  };

  useEffect(() => {
    let num = data?.data?.count;
    let padded = num?.toString().padStart(6, '0');
    dispatch(setInput({docid: 'PER-' + padded, id: 'Permission_state'}));
    dispatch(setInput({docdate: formattedDate, id: 'Permission_state'}));
    dispatch(setInput({idcard: UserSelect?.UserId, id: 'Permission_state'}));
  }, [data]);

  useEffect(() => {
    dispatch(
      setInput({
        category_options: get_per_category?.data,
        id: 'Permission_state',
      }),
    );
  }, [get_per_category]);

  useEffect(() => {
    if (InputState?.tTime && InputState?.fTime) {
      var differnce = calculateTimeDifference(
        InputState?.fTime,
        InputState?.tTime,
      );
      dispatch(setInput({thrs: differnce || '0', id: 'Permission_state'}));
    }
  }, [InputState?.fTime, InputState?.tTime]);

  //ref_token_error Reftoken removed if need pls add
  if (error || isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>
          Something Went Wrong ! Please restart the app.
        </Text>
        {error && (
          <Text style={{color: 'red', marginTop: 10}}>
            Doc Error: {JSON.stringify(error)}
          </Text>
        )}
        {isError && (
          <Text style={{color: 'red', marginTop: 10}}>
            HOD Token Error: {JSON.stringify(terr)}
          </Text>
        )}
        {ref_token_error && (
          <Text style={{color: 'red', marginTop: 10}}>
            Ref Token Error: {JSON.stringify(ref_token_error)}
          </Text>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Permission Entry</Text>
      <View style={styles.formContainer}>
        <InputWraper states={Permission_Meta} />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 2,
  },
  formContainer: {
    paddingHorizontal: 5,
    paddingBottom: 80,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'center',
    width: screenWidth - 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default PermissionEntry;
