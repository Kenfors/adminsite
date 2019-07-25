
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
var tableData = {}
var numOfRequests;

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
                //container.insertAdjacentHTML('beforeend', "<div " + "onclick='displayCourse(" + courseQuery[i].id + ")'" +">" + courseQuery[i].name + "</div>");
                container.insertAdjacentHTML('beforeend', "<div " + "onclick='retrieveCourseData(" + courseQuery[i].id + ")'" +">" + courseQuery[i].name + "</div>");
            }
        });
    } catch (error) {
        console.log("Error: " + error);
    }

}

function clearTable(contentPage){
    while(contentPage.hasChildNodes()){
        contentPage.removeChild(contentPage.firstChild);
    }
}

function retrieveCourseData(courseid){
    
    clearTable(document.getElementById('page'));

    gapi.client.classroom.courses.get({
        id : courseid,
    }).then(function(courseQuery){
        // Do stuff with course?

        //console.log("" + JSON.stringify(courseQuery.result));

        let page = document.getElementById('page');
        page.insertAdjacentHTML('afterbegin', "<h1>" + courseQuery.result.name + "</h1>");


        return gapi.client.classroom.courses.students.list({
            courseId : courseid,
        });
    }).then(function(studentQuery){

        gapi.client.classroom.courses.courseWork.list({
            courseId : courseid,
            
        }).then(function(worksQuery){
            let works = worksQuery.result.courseWork;
            let stus = studentQuery.result.students;

            var table = document.createElement('table');
            table.classList.add('course-table');

            let nameRow = document.createElement('tr');
            nameRow.classList.add('course-table-row');
            nameRow.appendChild(document.createElement('th'));
            for (let j = 0; j < stus.length; j++){
                let names = document.createElement('th');
                names.innerHTML = stus[j].profile.name.fullName;
                nameRow.classList.add('course-table-header');
                nameRow.appendChild(names);
            }
            table.appendChild(nameRow);

                

            var datasheet = {};
            for (let i = 0; i < works.length; i++){
                let dataRow = document.createElement('tr');
                dataRow.classList.add('course-table-row');
                let rowName = document.createElement('th');
                rowName.innerHTML = works[i].title;
                rowName.classList.add('course-table-cell');
                dataRow.appendChild(rowName);
                datasheet[works[i].id] = {}
                for (let j = 0; j < stus.length; j++){
//                    console.log("" + works[i].id);
//                    console.log("" + stus[j].profile.id);
                    datasheet[works[i].id][stus[j].profile.id] = { 'cell' : "" + i + j};
                    let data = document.createElement('td');
                    data.classList.add('course-table-cell');
                    data.id = "" + i + j;
                    dataRow.appendChild(data);
                }
                table.appendChild(dataRow);

                gapi.client.classroom.courses.courseWork.studentSubmissions.list({
                    courseId : courseid,
                    courseWorkId : works[i].id,

                }).then(function(submissionSet){

                    submissionSet = submissionSet.result.studentSubmissions;

                    for(let i = 0; i < submissionSet.length;i++){
                        let cell = document.getElementById(datasheet[submissionSet[i].courseWorkId][submissionSet[i].userId].cell);

                        cell.style.backgroundColor = 'white';
                        cell.addEventListener('click', function(event){
                            window.open(submissionSet[i].alternateLink);
                        });

                        switch (submissionSet[i].state) {
                            case 'CREATED':
                            case 'NEW':
                            cell.style.backgroundColor = 'red';
                            break;
                            case 'RECLAIMED_BY_STUDENT':
                            case 'RETURNED':
                            cell.style.backgroundColor = 'yellow';
                            break;
                            case 'TURNED_IN':
                            cell.style.backgroundColor = 'green';
                            break;
                            default:
                            cell.style.backgroundColor = 'white';
                        }
                    }                    

                });

            }
        
        document.getElementById('page').appendChild(table);

        });
    });
}
