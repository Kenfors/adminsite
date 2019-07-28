

var activeCourse = "";


function listCourses() {
    console.log("Listing courses...");
    let courseList = document.createElement('ul');
    courseList.classList.add('list-group');

    document.getElementById('side').innerHTML = "";
    document.getElementById('side').appendChild(getSpinner());
    

    gapi.client.classroom.courses.list({
        pageSize: 10,
    }).then(function(response){

        let courseQuery = response.result.courses;
        
        for(let i = 0; i < courseQuery.length;i++){
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.classList.add('clickable');
            listItem.id = 'course-list-' + courseQuery[i].id;
            listItem.innerHTML = courseQuery[i].name; 
            listItem.onclick = function(event){courseHandler(courseQuery[i].id);};
            courseList.appendChild(listItem);
        }

        document.getElementById('side').innerHTML = "";
        document.getElementById('side').appendChild(courseList);

    }, function(error){
        console.log("Error: " + error);
        courseList = document.createElement('div');
        courseList.classList.add('alert');
        courseList.classList.add('alert-danger');
        courseList.insertAdjacentHTML('afterbegin',
            "<h3>Error</h3>" + 
            "<p>Failed to list courses</p>"
        );
        
        document.getElementById('side').innerHTML = "";
        document.getElementById('side').appendChild(courseList);
    });


}


function courseHandler(courseid){
    if (activeCourse != ""){
        document.getElementById('course-list-' + activeCourse).classList.remove('active');
    }
    document.getElementById('course-list-' + courseid).classList.add('active');
    activeCourse = courseid;
    document.getElementById('page').appendChild(getSpinner(20));


    console.log("Build Table Data");

    gapi.client.classroom.courses.students.list({
        courseId : courseid
    }).then(function(studentQuery){
        gapi.client.classroom.courses.courseWork.list({
            courseId : courseid,
        }).then(function(workQuery){
            
            let stus = studentQuery.result.students;
            let works = workQuery.result.courseWork;

            let stusSimple = [];
            let worksSimple = [];

            for (let i = 0; i < stus.length; i++){
                let stu = {
                    id : stus[i].userId,
                    name : stus[i].profile.name.fullName,
                };
                stusSimple.unshift(stu);

            }
            for(let j = 0; j < works.length;j++){
                let work = {
                    id : works[j].id,
                    name : works[j].title,
                };
                worksSimple.push(work);
            }

            buildTable(stusSimple,worksSimple);
        });     

    });
}

function buildTable2(stus, works){
    let viewTable = document.createElement('div');

}

function buildTable(stus, works){

    let tableContainer = document.createElement('div');
    tableContainer.classList.add('table-responsive');

    table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-hover');
    table.classList.add('table-light');
    table.classList.add('table-bordered');

    
    table.style.wordWrap = 'break-word';

    let tableBody = document.createElement('tbody');

    for (let i = 0; i < stus.length; i++) {
        let row = document.createElement('tr');

        for (let j = 0; j < works.length; j++) {
            if (j==0){
                let name = document.createElement('td');
                name.innerHTML = stus[i].name;
                name.classList.add('firstCol');

                row.appendChild(name);
            }
            
            let data = document.createElement('td');
            data.id = "" + stus[i].id + works[j].id;

            //data.appendChild(getSpinner());

            row.appendChild(data);
        }
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    document.getElementById('page').innerHTML = "";
    tableContainer.appendChild(table);

    document.getElementById('page').appendChild(tableContainer);


    let tableHead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    for (let j = 0; j < works.length; j++) {
        let text = document.createElement('div');
        text.style.width = '4em';
        if(j == 0){
            let data = document.createElement('th');
            data.innerHTML = 'Namn';
            data.classList.add('firstCol');
            headerRow.appendChild(data);    
        }
        
        let data = document.createElement('th');
        text.innerHTML = works[j].name;
        data.appendChild(text);
        


        headerRow.appendChild(data);

        loadCellData(works[j].id);

    }

    tableHead.appendChild(headerRow);
    document.getElementById('page').lastChild.firstChild.insertBefore(tableHead, table.firstChild);



}


function loadCellData(workID){

    gapi.client.classroom.courses.courseWork.studentSubmissions.list({
        courseId : activeCourse,
        courseWorkId : workID,
    }).then(function(submissionQuery){

        subSet = submissionQuery.result.studentSubmissions;

        for (let i = 0; i < subSet.length; i++){
            id = "" + subSet[i].userId + subSet[i].courseWorkId;
            cell = document.getElementById(id);

            buildCell(subSet[i], cell);

        }

    });

}


function buildCell(submission, cell){

    //console.log(JSON.stringify(submission, null, 2));
    /**
     {
  "courseId": "37347804713",
  "courseWorkId": "37347804723",
  "id": "Cg4IjP69kYsBELOM6ZCLAQ",
  "userId": "116181642329319478061",
  "state": "NEW",
  "alternateLink": "https://classroom.google.com/c/MzczNDc4MDQ3MTNa/sa/MzczNDc4MDQ3MjNa/submissions/student/MzczNDkxOTU1MzJa",
  "courseWorkType": "SHORT_ANSWER_QUESTION",
  "assignmentSubmission": {}
} */

    cell.innerHTML = "";
    switch (submission.state) {
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

    cell.value = submission;
}