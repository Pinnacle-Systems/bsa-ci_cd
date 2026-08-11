const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../');

const aliases = {
  '@Screens': path.resolve(projectRoot, 'Component/Screens'),
  '@Utils': path.resolve(projectRoot, 'Component/Utils'),
  '@UserRoles': path.resolve(projectRoot, 'Component/User&roles'),
  '@Auth': path.resolve(projectRoot, 'Component/Authunticate'),
  '@Constants': path.resolve(projectRoot, 'constants'),
  '@Context': path.resolve(projectRoot, 'Context'),
  '@Redux': path.resolve(projectRoot, 'redux'),
  '@ReusableComponents': path.resolve(projectRoot, 'ReusableComponents'),
  '@Component': path.resolve(projectRoot, 'Component'),
};

// Sort aliases by descending length of the path, so more specific matches (like @Screens) hit before @Component
const sortedAliases = Object.entries(aliases).sort((a, b) => b[1].length - a[1].length);

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (['node_modules', 'android', 'ios', '.git', 'build', 'assets', 'img'].includes(file)) continue;
      filelist = walkSync(dirFile, filelist);
    } else {
      if (/\.(js|jsx|ts|tsx)$/.test(file)) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const processFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Regex to find all import and require paths
  const importRegex = /(import[\s\S]*?from\s+['"])(.*?)(['"])/g;
  const requireRegex = /(require\s*\(\s*['"])(.*?)(['"]\s*\))/g;
  const dynamicImportRegex = /(import\s*\(\s*['"])(.*?)(['"]\s*\))/g;

  const replacer = (match, p1, importPath, p3) => {
    // Only process relative paths
    if (!importPath.startsWith('.')) return match;

    const absoluteImportPath = path.resolve(path.dirname(filePath), importPath);

    // Try to match against our aliases
    for (const [aliasName, aliasPath] of sortedAliases) {
      if (absoluteImportPath === aliasPath || absoluteImportPath.startsWith(aliasPath + path.sep)) {
        // Calculate the new path
        const relativeToAlias = absoluteImportPath.substring(aliasPath.length);
        const newImportPath = (aliasName + relativeToAlias).replace(/\\/g, '/'); // normalize slashes for imports
        
        console.log(`Replaced in ${path.relative(projectRoot, filePath)}: ${importPath} -> ${newImportPath}`);
        return p1 + newImportPath + p3;
      }
    }

    return match;
  };

  updatedContent = updatedContent.replace(importRegex, replacer);
  updatedContent = updatedContent.replace(requireRegex, replacer);
  updatedContent = updatedContent.replace(dynamicImportRegex, replacer);

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
};

const allFiles = walkSync(projectRoot);
console.log(`Found ${allFiles.length} files to scan.`);

allFiles.forEach(processFile);
console.log('Refactoring complete.');
