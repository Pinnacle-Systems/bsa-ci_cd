module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'prettier/prettier': 'error',
  },
};
