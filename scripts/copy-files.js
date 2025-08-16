const fs = require('fs-extra');

function copyFiles(srcDir, destDir) {
    fs.copy(srcDir, destDir);
}

module.exports = {
    copyFiles,
};