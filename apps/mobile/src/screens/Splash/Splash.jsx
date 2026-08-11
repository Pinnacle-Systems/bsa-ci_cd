import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Animated,
  Easing,
  Text,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {useGet_Change_SettingsQuery} from '@Redux/service/user';

// Constants
const GRADIENT_COLORS = ['#ffffff', '#f0f9ff'];
const GRADIENT_CONFIG = {start: {x: 0, y: 0}, end: {x: 1, y: 1}};
const LOADING_TIMEOUT = 10000; // 10 seconds max for all operations
const MIN_SPLASH_TIME = 2500; // Force at least 2.5s of splash screen

const Splash = React.memo(({navigation}) => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [IDCARD, SETIDCARD] = useState(null);

  // Animation refs
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const logoScale = useMemo(() => new Animated.Value(0.4), []);
  const textSlide = useMemo(() => new Animated.Value(40), []);
  const pulseAnim = useMemo(() => new Animated.Value(1), []);

  const lottieRef = useRef(null);
  const timeoutRef = useRef(null);

  // Always trigger settings query, skip if IDCARD is not yet loaded
  const {
    data,
    isLoading: settings_loading,
    isError,
  } = useGet_Change_SettingsQuery({params: {Idcard: IDCARD}}, {skip: !IDCARD});

  const settings_data = useMemo(() => data?.data || {}, [data]);

  // Handle Entrance Animations immediately
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Force minimum splash duration for brand exposure
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_SPLASH_TIME);

    return () => clearTimeout(minTimer);
  }, [fadeAnim, logoScale, textSlide, pulseAnim]);

  // Load user data initial fetch
  useEffect(() => {
    let isMounted = true;

    // Global fallback timeout
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        navigation.reset({routes: [{name: 'LOGIN'}]});
      }
    }, LOADING_TIMEOUT);

    const loadUserData = async () => {
      try {
        const result = await AsyncStorage.getItem('userName');
        if (isMounted) {
          if (result) {
            const res = JSON.parse(result);
            SETIDCARD(res?.Id);
          } else {
            clearTimeout(timeoutId);
            setMinTimeElapsed(true); // Short-circuit if no user
          }
        }
      } catch (error) {
        if (isMounted) {
          clearTimeout(timeoutId);
          navigation.reset({routes: [{name: 'LOGIN'}]});
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigation]);

  // Handle biometric verification
  const handleBiometricVerification = useCallback(async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {available} = await rnBiometrics.isSensorAvailable();

      if (!available) {
        navigation.reset({routes: [{name: 'DashBoard'}]});
        return;
      }

      const biometricPromise = rnBiometrics.simplePrompt({
        promptMessage: 'Verify your identity to proceed',
        cancelButtonText: 'Use Password',
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Biometric timeout')), 5000),
      );

      const {success} = await Promise.race([biometricPromise, timeoutPromise]);

      if (success) {
        navigation.reset({routes: [{name: 'DashBoard'}]});
      } else {
        setVerificationFailed(true);
        timeoutRef.current = setTimeout(() => {
          navigation.reset({routes: [{name: 'LOGIN'}]});
        }, 1500);
      }
    } catch (error) {
      navigation.reset({routes: [{name: 'LOGIN'}]});
    }
  }, [navigation]);

  // Navigation Logic
  useEffect(() => {
    // Wait until minimum time has elapsed to ensure smooth visual experience
    if (!minTimeElapsed) {
      return;
    }

    const proceed = async () => {
      const userName = await AsyncStorage.getItem('userName');

      // If no user found, go straight to login
      if (!userName) {
        navigation.reset({routes: [{name: 'LOGIN'}]});
        return;
      }

      // If user exists, we must wait for API to finish loading settings
      if (settings_loading) {
        return;
      }

      // Handle failures gracefully by sending to Dashboard if API fails, assuming cache or standard flow
      if (isError || !settings_data) {
        navigation.reset({routes: [{name: 'DashBoard'}]});
        return;
      }

      // Smooth fade out before switching screens
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(async () => {
        if (settings_data?.BioMatrics) {
          await handleBiometricVerification();
        } else {
          navigation.reset({routes: [{name: 'DashBoard'}]});
        }
      });
    };

    proceed();
  }, [
    minTimeElapsed,
    settings_loading,
    isError,
    settings_data,
    IDCARD,
    navigation,
    fadeAnim,
    handleBiometricVerification,
  ]);

  if (verificationFailed) {
    return (
      <LinearGradient
        colors={['#ef4444', '#b91c1c']}
        style={styles.container}
        {...GRADIENT_CONFIG}>
        <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
        <LottieView
          ref={lottieRef}
          source={require('@Utils/assets/Error.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
        <Text style={styles.errorTitle}>Authentication Failed</Text>
        <Text style={styles.errorText}>Please try again or login manually</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={styles.container}
      {...GRADIENT_CONFIG}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {transform: [{scale: logoScale}, {scale: pulseAnim}]},
          ]}>
          <Image
            source={require('@Component/img/logo_splash1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={{
            transform: [{translateY: textSlide}],
            alignItems: 'center',
          }}>
          <Text style={styles.title}>Pinnacle World</Text>
          <Text style={styles.subtitle}>Your Gateway to Excellence</Text>

          {settings_loading && IDCARD && (
            <ActivityIndicator
              size="small"
              color="#3b82f6"
              style={{marginTop: 24}}
            />
          )}
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    shadowColor: '#3b82f6',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    backgroundColor: '#fff',
    borderRadius: 36,
    padding: 16,
    marginBottom: 40,
  },
  logo: {
    width: Platform.select({ios: 140, android: 130}),
    height: Platform.select({ios: 140, android: 130}),
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
    fontWeight: '500',
  },
});

export default Splash;
