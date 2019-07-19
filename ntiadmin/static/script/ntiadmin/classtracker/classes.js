
// Client ID and API key from the Developer Console
var CLIENT_ID = '1045641075151-6fc0n5uqhoobih2v6nqimdv8uub0a9dv.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDNCzSzosDQ00kQH8rd-ObNgRlRDvMdHVE';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/classroom.courses.readonly ";
SCOPES += " https://www.googleapis.com/auth/classroom.coursework.me.readonly ";
SCOPES += " https://www.googleapis.com/auth/classroom.rosters.readonly ";
SCOPES += " https://www.googleapis.com/auth/classroom.coursework.students.readonly ";


console.log("Scopes:" + SCOPES);

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


var courseTable = document.getElementById('courseTable');
var tableData = []

/**
 *  On load, called to load the auth2 library and API client library.
 */
handleClientLoad();
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
    // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';

        listCourses();

    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('courses')
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the names of the first 10 courses the user has access to. If
 * no courses are found an appropriate message is printed.
 */
function listCourses() {

    try {
        gapi.client.classroom.courses.list({
            pageSize: 10,
        }).then(function(response){
            let courseQuery = response.result.courses;
            let container = document.getElementById('courses')
            container.insertAdjacentHTML('beforeend', "<h3>Kurser: </h3>");
            for(let i = 0; i < courseQuery.length;i++){
                container.insertAdjacentHTML('beforeend', "<div " + "onclick='displayCourse(" + courseQuery[i].id + ")'" +">" + courseQuery[i].name + "</div>");
            }
        });
    } catch (error) {
        console.log("Error: " + error);
    }

}

function displayCourse(courseid){
    let contentPage = document.getElementById('page');
    
    gapi.client.classroom.courses.get(
        {
            id : courseid,
        }
        ).then(function(Cresponse){
            console.log("response: " + Cresponse.result.name);
            contentPage.insertAdjacentHTML('afterbegin', "<h1>" + Cresponse.result.name +"</h1>");

            // Make Student list?
            // Too later fill with celldata...


            gapi.client.classroom.courses.courseWork.list(
                {
                    courseId : courseid,
                }
            ).then(function(CWresponse){

                works = CWresponse.result.courseWork
                //console.log("CW result: " + JSON.stringify(CWresponse.result, null, 2));
                
                for(let i = 0; i < works.length;i++){
                    addWorkToTable(works[i], courseid);
                }
            });

        });

}

function addWorkToTable(cWork, cId){
    
    newWork = document.createElement('div');
    newWork.classList.add("column");
    newWork.id = cWork.id;
    newWork.insertAdjacentHTML('beforeend', "<h3>" + cWork.title + "</h3>");
    courseTable.appendChild(newWork);

    colorField = document.createElement('div');
    colorField.style.backgroundColor = 'white';


    gapi.client.classroom.courses.courseWork.studentSubmissions.list(
        {
            courseId : cId,
            courseWorkId : cWork.id,
        }
    ).then(function(response){

        set = response.result.studentSubmissions;

        //Fill Table with Data...?
        //Data first?
        for (let i = 0; i < set.length; i++){
            //console.log("Submissions: " + JSON.stringify(set[i], null, 2));

            if (!(set[i].userId in tableData)){
                tableData[set[i].userId] = {};
            }
            let newDataSet = {
                'state' : set[i].state,
                'link' : set[i].alternateLink,
                'lastUpdate' : set[i].updateTime,
                'type' : set[i].courseWorkType,
            }
            tableData[set[i].userId][set[i].courseWorkId] = newDataSet;

            block = document.getElementById(set[i].courseWorkId).insertAdjacentHTML(
                'beforeend',
                '<p>' + newDataSet.state + '</p>' +
                '<p>' + set[i].userId + '</p>'
            )
        }

    });
    
}

function drawTable(importantOnly){

    console.log(tableData);

}