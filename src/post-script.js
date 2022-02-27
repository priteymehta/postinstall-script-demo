import pkg from 'inquirer';
const { inquirer } = pkg;
import fsObj, { writeFileSync } from 'file-system';
const { openSync } = fsObj;

//#region start >> global variables 
var configObject = {
    firebaseConfig: {
        apiKey: null,
        authDomain: null,
        databaseURL: null,
        projectId: null,
        storageBucket: null,
        messagingSenderId: null,
        appId: null,
        measurementId: null
    },
    nodeAPIURL: null
} // config sample object
const filePath = "src/config.json"; //config file path

//#endregion >> global variables 


var checkFortheDataAvailability = new Promise((resolve, reject) => {

    var arrQues = [];
    let askForAllTheDetails = false;
    if (!fsObj.existsSync(filePath)) {
        // if files does not exists
        fsObj.writeFileSync(filePath,"");
    }
    try {
        // check if file having read/write permission or not.
        fsObj.accessSync(filePath, fsObj.constants.R_OK | fsObj.constants.W_OK);
        // read file and fetch the data from the file
        fsObj.readFile(filePath, 'utf8', (err, data) => {

            //check if any data available in the file or not.
            if (data) {
                var currentConfigObject = JSON.parse(data);
                if (currentConfigObject) {
                    // if data available in current config file.
                    // then check for each fields that all the needed fields are available or not.
                    // check firebase object
                    if (currentConfigObject?.firebaseConfig) {
                        Object.keys(configObject.firebaseConfig).forEach(function (key) {
                            console.log(key, configObject[key]);
                            if (currentConfigObject?.firebaseConfig[key]) {
                                configObject.firebaseConfig[key] = currentConfigObject.firebaseConfig[key];

                            }
                            else {
                                let obj = {
                                    type: "input",
                                    name: key,
                                    message: key
                                }
                                arrQues.push(obj);
                                console.log(arrQues);
                            }

                        });
                        askForAllTheDetails = false;
                    }
                    else {
                        askForAllTheDetails = true;
                    }
                }

            }
            else {
                askForAllTheDetails = true;
            }
            if (askForAllTheDetails) {
                arrQues = [
                    {
                        type: 'input',
                        name: 'apiKey',
                        message: "Please provide the firebase config details.\napiKey:"
                    },
                    {
                        type: 'input',
                        name: 'authDomain',
                        message: "authDomain:"
                    },
                    {
                        type: 'input',
                        name: 'databaseURL',
                        message: "databaseURL:"
                    },
                    {
                        type: 'input',
                        name: 'projectId',
                        message: "projectId:"
                    },
                    {
                        type: 'input',
                        name: 'storageBucket',
                        message: "storageBucket:",
                        default: "test"
                    },
                    {
                        type: 'input',
                        name: 'messagingSenderId',
                        message: "messagingSenderId:"
                    },
                    {
                        type: 'input',
                        name: 'appId',
                        message: "messagingSenderId:"
                    },
                    {
                        type: 'input',
                        name: 'measurementId',
                        message: "measurementId:"
                    }
                ]
            }
            resolve(arrQues);
        })
    }
    catch (err) {
        throw new Error("permission denied"); // throw an err to ask for the read/write permission
    }

});



var askFortheDetails = async (_queArray) => {
    // Backend API url question
    var backendAPIURLQuestions = {
        type: 'input',
        name: 'nodeAPIURL',
        message: "Please enter Backend API URL:"
    }
    //console.log(configObject);
    //#endregion >> create object for question
    // get the values from user for firebase configuration.
    await pkg.prompt(_queArray).then(objResponse => {
        for (const key in objResponse) {
            if (Object.hasOwnProperty.call(objResponse, key)) {
                configObject.firebaseConfig[key] = objResponse[key];
            }
        }
        console.log(configObject);
        // configObject.firebaseConfig[_queArray]
    })

    // get the node api url from user
    await pkg.prompt(backendAPIURLQuestions).then(objResponse => {
        configObject.nodeAPIURL = objResponse.nodeAPIURL;
    })
    var json = JSON.stringify(configObject);

    // This text will be written on file input.text
    const textContent = json;

    // Starting position in file
    const position = 0;

    // writeSync returns number of bytes written
    // on file which is stores in this variable
    writeFileSync(filePath, textContent);
    // const numberOfBytesWritten =
    //     writeSync(fd, textContent, position, 'utf8');

}

checkFortheDataAvailability.then((queArray) => {
    console.log("cofig que arr", queArray)

    if (queArray && queArray.length > 0) {
        askFortheDetails(queArray);
    }

})





