import React from 'react';
import MoreUserDetails from '@Screens/Info/MoreDetails';
import {useGetMoreDetailsQuery} from '@Redux/service/misDashboardService';
import {useSelector} from 'react-redux';
import {Text} from 'react-native';

function UserInfo() {
  const UserSelect = useSelector(state => state?.UserDetails);
  const {data, isLoading} = useGetMoreDetailsQuery({
    params: {Idcard: UserSelect?.UserId},
  });

  if (isLoading) {
    return <Text>Loading....</Text>;
  }
  return (
    <>
      <MoreUserDetails data={data?.data} />
    </>
  );
}

export default UserInfo;
