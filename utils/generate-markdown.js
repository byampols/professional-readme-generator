const fs = require('fs');

const checkPathExists = path => {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return true;
    } else {
        return true;
    }
}

const writeFile = (pageString) => {
    path = '.dist/';
    if (checkPathExists(path)) {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${path}README.md`, pageString, err => {
                //if there's an error, reject the Promise and send the error to the Promise's `.catch()` method
                if (err) {
                    reject(err);
                    // return out of the function here to make sure the Promise doesn't accidentally execute the resolve() function as well
                    return;
                }
    
                // if everything went well, resolve the Promise and send the successful data to the `.then()` method
                resolve({
                    ok: true,
                    message: 'README Created!'
                });
            });
        });
    }
};

console.log(writeFile("hi"));

module.exports = writeFile;