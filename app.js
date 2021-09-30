//imports
const inquirer = require('inquirer');
const licenses = require('./src/licenses.js');
const writeFile = require('./utils/generate-markdown.js');
const generatePage = require('./utils/page-generator.js');

//counters
let installCounter = 0;
let usageCounter = 0;
let contribCounter = 0;

//basic functions
const stringifyNumber = (n) => {
    if (n % 10 === 1) {
        return `${n}st`;
    } else if (n % 10 === 2) {
        return `${n}nd`;
    } else if (n % 10 === 3) {
        return `${n}rd`;
    } else {
        return `${n}th`;
    }
};

//prompt functions

//initial prompt
const promptUser = () => {
    console.log(`
========================================================================================================
Basic Information (INSTALLATION INSTRUCTIONS, USAGE INSTRUCTRIONS, and CONTRIBUTORS will be asked later)
========================================================================================================
        `);
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is your project's title? (Required)",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter your project's title!");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                message: "Describe your project:"
            },
            {
                type: 'input',
                name: 'source',
                message: "Please enter the github link for your project:"
            },
            {
                type: 'list',
                name: 'license',
                message: "Please choose the license your project is using:",
                choices: Object.keys(licenses)
            },
            {
                type: 'editor',
                name: 'tests',
                message: 'Please describe methods for testing for your project.'
            },
            {
                type: 'input',
                name: 'profile',
                message: "Please enter your github username. (Required)",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter your github username!");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'email',
                message: "Please enter your email address. (Required)",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please enter your email address!");
                        return false;
                    }
                }
            }
        ]);
}

//installation info prompt
const promptInstallation = data => {
    //increment the install counter (for 1st, 2nd, 3rd, etc. text in prompts)
    installCounter+=1;
    //set the installation instruction array if it doesn't already exist
    if (!data.installation) {
        data.installation = [];
    }
    //bar break
    console.log(`
=========================
Installation Instructions
=========================
    `);
    return inquirer.prompt([
        {
            type: 'input',
            name: 'step',
            message: `Please describe the ${stringifyNumber(installCounter)} step of installation.`,
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the instruction!");
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAddStep',
            message: `Would you like to add another step?`,
            default: false
        } 
    ]).then(step => {
        //add the step to the installation array
        data.installation.push(step.step);
        //if user said to add another step, run this function again, else return the data
        if (step.confirmAddStep) {
            return promptInstallation(data);
        } else {
            return data;
        }
    });
};

//usage info prompt
const promptUsage = data => {
    //increment the usage counter (for 1st, 2nd, 3rd, etc. text in prompts)
    usageCounter+=1;
    //set the usage instruction array if it doesn't already exist
    if (!data.usage) {
        data.usage = [];
    }
    console.log(`
==================
Usage Instructions
==================
    `);
    return inquirer.prompt([
        {
            type: 'input',
            name: 'step',
            message: `Please describe the ${stringifyNumber(usageCounter)} step to use your project.`,
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the instruction!");
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAddStep',
            message: `Would you like to add another step?`,
            default: false
        } 
    ]).then(step => {
        //add the step to the usage array
        data.usage.push(step.step);
        //if user said to add another step, run this function again, else return the data
        if (step.confirmAddStep) {
            return promptUsage(data);
        } else {
            return data;
        }
    });
};

//contributors prompt
const promptContributors = data => {
    //increment the contributors counter (for 1st, 2nd, 3rd, etc. text in prompts)
    contribCounter+=1;
    //set the contributors array if it doesn't already exist
    if (!data.contributors) {
        data.contributors = [];
    }
    console.log(`
============
Contributors
============
    `);
    return inquirer.prompt([
        {
            type: 'input',
            name: 'contrib',
            message: `Please name the ${stringifyNumber(contribCounter)} contributor.`,
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log(`Please enter the ${stringifyNumber(contribCounter)} contributor!`);
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAddContrib',
            message: `Would you like to add another contributor?`,
            default: false
        } 
    ]).then(contributor => {
        //add the contributor to the array
        data.contributors.push(contributor.contrib);
        //if user said to add another contributor, run this function again, else return the data
        if (contributor.confirmAddContrib) {
            return promptContributors(data);
        } else {
            return data;
        }
    });
};

//function call
promptUser()
    .then(promptInstallation)
    .then(promptUsage)
    .then(promptContributors)
    .then(pageString => {
        return writeFile(pageString);
    })
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        }).catch(err => {
            console.log(err);
        });