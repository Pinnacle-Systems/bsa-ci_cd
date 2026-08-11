const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running knip to find unused files (this might take a few seconds)...');

try {
  // We run knip with the json reporter
  // knip usually exits with code 1 if it finds unused items, so we catch the error to parse the output.
  execSync('npx knip --reporter json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log('No unused files found.');
} catch (error) {
  if (error.stdout) {
    try {
      const result = JSON.parse(error.stdout);
      const unusedFiles = result.files || [];
      
      if (unusedFiles.length === 0) {
        console.log('No unused files found.');
        process.exit(0);
      }

      console.log(`Found ${unusedFiles.length} unused files. Proceeding to remove...`);
      
      let removedCount = 0;
      unusedFiles.forEach(file => {
        const fullPath = path.resolve(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`[DELETED] ${file}`);
          removedCount++;
        }
      });
      
      console.log(`Finished removing ${removedCount} unused files.`);
    } catch (parseError) {
      console.error('Failed to parse knip JSON output:', parseError);
    }
  } else {
    console.error('Error executing knip:', error.message);
  }
}
