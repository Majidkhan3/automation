const fs = require("fs");
const path = require("path");

const replaceInFile = (filePath, search, replace) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const updatedContent = fileContent.replace(new RegExp(search, "g"), replace);
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Replaced in: ${filePath}`);
};

const traverseDirectory = (dir, search, replace) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    // Skip node_modules and .next directories
    if (stat.isDirectory() && (file === "node_modules" || file === ".next")) {
      return;
    }

    if (stat.isDirectory()) {
      traverseDirectory(fullPath, search, replace);
    } else if (
      fullPath.endsWith(".js") ||
      fullPath.endsWith(".ts") ||
      fullPath.endsWith(".tsx") ||
      fullPath.endsWith(".jsx")
    ) {
      replaceInFile(fullPath, search, replace);
    }
  });
};

const directoryPath = "./"; // Start from the root of the project
const searchWord = "widgetcustomization";
const replaceWord = "widgetcustomization";

console.log(
  `Starting replacement of "${searchWord}" with "${replaceWord}" in ${directoryPath}...`
);
traverseDirectory(directoryPath, searchWord, replaceWord);
console.log("Replacement completed.");
