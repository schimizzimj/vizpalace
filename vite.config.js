import fs from "fs";
import path from "path";

const examplesDir = path.resolve(__dirname, "examples");

function findHtmlFiles(startPath) {
  let results = [];
  let files = fs.readdirSync(startPath);

  for (const files of files) {
    const fullPath = path.join(startPath, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endswidth(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

const entryPoints = findHtmlFiles(examplesDir);

export default {
  root: "examples",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: entryPoints,
    },
  },
};
