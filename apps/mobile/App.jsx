import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import { useAuthInitialization } from './src/hooks/useAuthInitialization';
import { useAppNavigation } from './src/hooks/useAppNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from '@Redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Text} from 'react-native';
import {useGetUserRolesOnPageQuery} from '@Redux/service/user';
import {NavRef} from '@Utils/NavigationRef';
import NavBar from '@Navigation/Ui/Navbar';
import CustomDrawer from '@Navigation/Ui/SideBar';
import tabs from '@Navigation/tabIndex';
import LoginScreen from '@Screens/Auth/Login/Login';
import {Easing} from 'react-native-reanimated';
import SiderBarTabs from '@Navigation/SidebarTabs';
import FlashMessage from 'react-native-flash-message';
import {ThemeProvider} from 'react-native-paper';
import Splash from '@Screens/Splash/Splash';
import {Common_Context} from '@Context/Common_Context';
import {useNetInfo} from '@react-native-community/netinfo';
import {NetworkErrorView} from '@Utils/NoIntertNetPage';
import {AllowedTabs_Filter} from '@Utils/AllowedPagesFiltering';
import NoAllocatedPage from '@Component/Common/NoAllocatedPage';
import {requestLocationPermission} from '@Utils/CustomLocation';
import {ensureLocationEnabled} from '@Utils/EnsureLocation';
import LightModeProvider from './LightModeProvider';
import {BASE_DOMAIN} from '@Constants/apiUrl';

const Stack = createNativeStackNavigator();

// ─── Transition Config ───────────────────────────────────────────────────────

const customTransitionSpec = {
  open: {
    animation: 'timing',
    config: {
      duration: 700,
      easing: Easing.out(Easing.exp),
    },
  },
  close: {
    animation: 'timing',
    config: {
      duration: 500,
      easing: Easing.in(Easing.circle),
    },
  },
};

const screenCardStyleInterpolator = ({current, layouts}) => ({
  cardStyle: {
    opacity: current.progress,
    transform: [
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.height, 0],
        }),
      },
      {
        rotate: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '0deg'],
        }),
      },
    ],
  },
});

// ─── Main App ────────────────────────────────────────────────────────────────

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('LOGIN');
  const [dnsResolved, setDnsResolved] = useState(true);

  const netInfo = useNetInfo();

  // 2. Auth & Location Initialization Hook
  const { loading: authLoading, isAdmin, userRoleId } = useAuthInitialization();

  // 3. Fetch User Roles API
  const {
    data: rolesOnPage,
    isLoading: rolesLoading,
    isError,
    error,
  } = useGetUserRolesOnPageQuery(
    {RoleId: userRoleId},
    {skip: !userRoleId || !dnsResolved},
  );

  const roles = rolesOnPage?.data || [];

  // 4. Navigation & Tab Filtering Hook
  const { activeTabSet, filterSidebar, showNoRolesScreen } = useAppNavigation(isAdmin, roles);

  // 5. Navigation state handler
  const handleStateChange = useCallback(state => {
    const current = state?.routes[state.index]?.name;
    setCurrentRoute(current);
  }, []);

  // 6. Guards
  if (!ensureLocationEnabled()) {
    return <Text>Enable Location</Text>;
  }

  if (!netInfo?.isConnected) {
    return <NetworkErrorView isnet={!netInfo?.isConnected} />;
  }

  // 7. Don't render navigation until DNS is resolved
  if (!dnsResolved) {
    return <Splash />;
  }

  return (
    <Common_Context.Provider
      value={{
        page: rolesOnPage?.data || [],
        loading: rolesLoading || authLoading,
        admin: isAdmin,
      }}>
      <NavigationContainer ref={NavRef} onStateChange={handleStateChange}>
        {currentRoute !== 'LOGIN' && currentRoute !== 'SPLASH' && (
          <>
            <NavBar openSidebar={sidebarOpen} setopenSidebar={setSidebarOpen} />
            <CustomDrawer
              activeRoute={currentRoute}
              tabs={filterSidebar}
              openSidebar={sidebarOpen}
              setopenSidebar={setSidebarOpen}
            />
          </>
        )}

        <ThemeProvider>
          <Stack.Navigator
            initialRouteName="SPLASH"
            screenOptions={{
              cardStyleInterpolator: screenCardStyleInterpolator,
              transitionSpec: customTransitionSpec,
            }}>
            {activeTabSet.map(item => (
              <Stack.Screen
                key={item?.name}
                name={item?.name}
                component={item?.component}
                options={{headerShown: false}}
              />
            ))}

            {showNoRolesScreen && (
              <Stack.Screen
                name="DashBoard"
                component={NoAllocatedPage}
                initialParams={{isError,error}}
                options={{headerShown: false}}
              />
            )}
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </Common_Context.Provider>
  );
};

// ─── Root Component ──────────────────────────────────────────────────────────

export default function RootComponent() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <FlashMessage position="top" />
        <LightModeProvider>
          <App />
        </LightModeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
