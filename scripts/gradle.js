const { spawnSync } = require('node:child_process');
const path = require('node:path');

const isWindows = process.platform === 'win32';
const wrapper = isWindows ? 'gradlew.bat' : './gradlew';
const result = spawnSync(wrapper, process.argv.slice(2), {
  cwd: path.resolve(__dirname, '..', 'android'),
  stdio: 'inherit',
  shell: isWindows,
});

if (result.error) {
  console.error(`Unable to start Gradle wrapper: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
