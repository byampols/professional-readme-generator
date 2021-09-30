//list of sections
const itemArr = ["title", "description", "table", "installation", "usage", "license", "contributors", "tests"];

data = {
    title: 'professional-readme-generator', //required
    description: 'A program that when run via the command line generates a dynamic professional README.',
    source: 'https://github.com/byampols/weather-dashboard',
    installation: ['Clone or download the repository from github.', 'Open the command line and navigate to the cloned directory.', 'Use "node -v" to check that node is installed, if it is not, install node.', 'Enter "npm install" to install required node modules.', 'Enter "node app" to run the application.'],
    usage: ["Enter 'node app' in this program's directory after following the instructions in [Installation](#installation).","Enter information into the prompts as they appear. At the end, a README file containing the entered information will be generated in the 'dist' folder. "],
    license: 'MIT License',
    contributors: ["Ben Yampolsky"],
    tests: "",
    profile: "https://github.com/byampols", //required
    email: "byampols@alumni.cmu.edu" //required
};

//capitolize the first letter of a string
const capitolize = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

//create a markdown list from an array
const createListString = (array) => {
    //if the sent data is a string, return it as is.
    if (typeof array === 'string') {
        return `${array}\n`;
    }
    console.log(array);
    //for each member of the list, add a bullet to the string
    string = ``;
    array.forEach(element => {
        string += `* ${element}\n`;
    });
    return string;
};

//create a markdown link [string](link)
const sourceCreator = (link, string) => {
    if (link === '' || link === null || string === `` || string === null) {
        return '';
    } else {
        return `\n[${string}](${link}).\n`
    }
};

const stringCreator = (data, stringObj, n, segment) => {
    //create the segment string, removing the section if there is no content
    if (data[segment] === null || data[segment] === ``) {
        stringObj[segment] = ``;
    } else {
        //check if this is the license (since that needs an alternate format), if not generate the standard format
        if (segment === "license") {
            stringObj[segment] = `## ${capitolize(segment)}\n${sourceCreator("LICENSE", data.license)}`;
        } else {
            stringObj[segment] = `## ${capitolize(segment)}\n${createListString(data[segment])}`;   
        }
        //segment exists, so add segment to the table of contents, increment counter
        stringObj.table += `${n}. [${capitolize(segment)}](#${segment})\n`;
        n += 1;
    }
    return [stringObj, n]
};

const stringAppender = (stringObj) => {
    let string = ``;
    itemArr.forEach (section => {
        if (stringObj[section] === '') {
            string+= ""
        } else {
            string += `${stringObj[section]}\n`;
        }
    });
    return string;
};

const generatePage = (data) => {
    //initialize string object, a counter, and the table of contents
    let stringObj = {};
    let n = 1;
    stringObj.table = `## Table of Contents\n`;

    //create the title string
    stringObj.title = `# ${data.title}\n`
    //create the description string, leaving a placeholder if there is no content
    sourceString = sourceCreator(data.source, "Github Source Repository");
    if (data.description === null || data.description === ``) {
        stringObj.description = `## Description\nTBA\n${sourceString}}`;
    } else {
        stringObj.description = `## Description\n${data.description}\n${sourceString}`;
    }

    //add all of the sections
    itemArr.slice(3).forEach(section => {
        [ stringObj, n ] = stringCreator(data, stringObj, n, section);
    });
    //add questions to table of contents
    stringObj.table += `${n}. [Questions](#questions)\n`;
    
    let readmeString = stringAppender(stringObj) + `## Questions\n###[My github profile.](${data.profile})\n### [Email me if you have any questions!](${data.email})`;
    return readmeString;
};

module.exports = generatePage;