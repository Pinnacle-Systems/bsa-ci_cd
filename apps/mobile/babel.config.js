module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@Component': './src/components',
          '@Screens': './src/screens',
          '@Utils': './src/components/Utils',
          '@UserRoles': './src/screens/User&roles',
          '@Auth': './src/components/Authunticate',
          '@Constants': './src/constants',
          '@Context': './src/context',
          '@Redux': './src/store',
          '@ReusableComponents': './src/components/ReusableComponents',
          '@Navigation': './src/navigation'
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
