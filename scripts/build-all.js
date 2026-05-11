const { spawn } = require('child_process');

const platform = process.platform;
let targets;

if (platform === 'darwin') {
  targets = ['--mac', '--win', '--linux'];
} else if (platform === 'win32') {
  targets = ['--win', '--linux'];
} else {
  targets = ['--win', '--linux'];
}

console.log(`Building for platform: ${platform}`);
console.log(`Running electron-builder with targets: ${targets.join(' ')}`);

const builder = spawn('npx', ['electron-builder', ...targets], {
  stdio: 'inherit',
  shell: true
});

builder.on('close', code => {
  process.exit(code);
});
