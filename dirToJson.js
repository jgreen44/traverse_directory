const fs = require('fs');
const path = require('path');

function listFiles(startPath) {
  let tree = {};

  function traverseDirectory(currentPath, subtree) {
    fs.readdirSync(currentPath, { withFileTypes: true }).forEach((dirent) => {
      // Skip hidden directories (like .git), dist, and node_modules
      if (dirent.isDirectory() && (dirent.name.startsWith('.') || dirent.name === 'dist' || dirent.name === 'node_modules')) {
        return;
      }

      const fullPath = path.join(currentPath, dirent.name);
      if (dirent.isDirectory()) {
        subtree[dirent.name] = {};
        traverseDirectory(fullPath, subtree[dirent.name]);
      } else {
        subtree[dirent.name] = null; // Represents a file
      }
    });
  }

  traverseDirectory(startPath, tree);
  return tree;
}

function main() {
  const startPath = process.argv[2]; // Take the root directory path as a command line argument

  if (!startPath) {
    console.log("Usage: node this_script.js <root_directory_path>");
    process.exit(1);
  }

  const tree = listFiles(startPath);

  // Output the directory structure as JSON
  fs.writeFileSync('directory_structure.json', JSON.stringify(tree, null, 4));

  console.log("Directory structure has been saved to 'directory_structure.json'");
}

main();
