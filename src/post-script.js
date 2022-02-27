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
    apiEndpoint: null
} // config sample object
const filePath = "src/config.json"; //config file path

//#endregion >> global variables 


var checkFortheDataAvailability = new Promise((resolve, reject) => {

    var arrQues = [];
    let askForAllTheDetails = false;
    if (!fsObj.existsSync(filePath)) {
        // if files does not exists
        fsObj.writeFileSync(filePath, "");
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
                        message: "appId:"
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
    // Question object for the API endpoint.
    var apiEndpointQuestion = {
        type: 'input',
        name: 'apiEndpoint',
        message: "Please enter API endpoint:"
    }
    //#endregion >> create object for question
    // get the values from user for firebase configuration.
    await pkg.prompt(_queArray).then(objResponse => {
        for (const key in objResponse) {
            if (Object.hasOwnProperty.call(objResponse, key)) {
                configObject.firebaseConfig[key] = objResponse[key];
            }
        }
        console.log(configObject);
    })

    // get the api endpoint from user
    await pkg.prompt(apiEndpointQuestion).then(objResponse => {
        configObject.apiEndpoint = objResponse.apiEndpoint;
    })

    var json = JSON.stringify(configObject);
    const textContent = json;
    const position = 0; // Starting position in file
    writeFileSync(filePath, textContent);
}

// call the function
checkFortheDataAvailability.then((queArray) => {
    if (queArray && queArray.length > 0) {
        askFortheDetails(queArray);
    }

})





