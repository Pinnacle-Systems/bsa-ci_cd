const readline = require('readline');
const { spawn } = require('child_process');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=============================================');
console.log('🚀 React Native Local Dev Speed Boost 🚀');
console.log('=============================================\n');

rl.question('Which emulator architecture are you running on?\n[1] x86_64 (Windows/Intel/AMD Mac)\n[2] arm64-v8a (M1/M2/M3 Mac / Physical ARM device)\n[3] Auto-detect (Let React Native decide)\n\nEnter 1, 2, or 3 (default is 1): ', (answer) => {
  let commandArgs = ['react-native', 'run-android'];
  
  if (answer.trim() === '2') {
    console.log('\n✅ Selected: arm64-v8a (Building ONLY arm64-v8a native code for speed)');
    commandArgs.push('--extra-params');
    commandArgs.push('-PreactNativeArchitectures=arm64-v8a');
  } else if (answer.trim() === '3') {
    console.log('\n✅ Selected: Auto-detect (--active-arch-only)');
    commandArgs.push('--active-arch-only');
  } else {
    console.log('\n✅ Selected: x86_64 (Building ONLY x86_64 native code for speed)');
    commandArgs.push('--extra-params');
    commandArgs.push('-PreactNativeArchitectures=x86_64');
  }

  console.log(`\nRunning: npx ${commandArgs.join(' ')}\n`);

  const child = spawn(os.platform() === 'win32' ? 'npx.cmd' : 'npx', commandArgs, {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    process.exit(code);
  });
  
  rl.close();
});
