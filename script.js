if (window.location.hash === ""){
    window.location.hash="courses" // this sets the default section
}
function router(divID){ 
    /// this is used to navigate between different sections 

    
    if (divID==="editCourse"){
        updateCombinedDropdowns()
        updateCombinedTable()

    }
    else if(divID === "students"){
        updateStudentTable()

    }
    else if(divID==="searchCourse"){
        populateCourseSelection()
    }


    const sections=document.querySelectorAll("section")
    sections.forEach(item => item.classList.remove("visible"))
    const div =document.querySelector("#"+divID)
    div.classList.add("visible")
    window.location.hash=divID


}


class Course{
    //course class
    constructor(courseName,gradeScale,students){
        this.courseName=courseName
        this.gradeScale=gradeScale
        this.students=students

    }

    addStudent(student,midterm,final){
        this.students.push({"studentid":student,"midterm":midterm,"final":final})
    }

    delStudent(studentID){
        const index=this.students.findIndex((student) => student.studentid=== studentID)

        this.students.splice(index,1)
    }


}


class Student{
    //student class
    constructor(name,studentid,courses){
        this.studentid=studentid;
        this.name=name;
        this.courses=courses
    }

    editName(name){
        this.name= name;
    }
    addCourse(courseName,midterm,final,gradeScale){
        this.courses.push({"courseName":courseName,"midterm":midterm,"final":final,"gradeScale":gradeScale})
    }
    gradeLetterToGPA(l){
        return l === "A" ? 4 : l=== "B" ? 3 : l==="C" ?2 : l=== "D"? 1 : 0
    }
    calcGPA(){
        // A:4 B:3 C:2 D:1 F:0
        let gpa=0
        this.courses.forEach((course) => {
            const gradeLetter=calcGradeLetter(course.midterm,course.final,course.gradeScale) // we find the letters corresponding value
            gpa += this.gradeLetterToGPA(gradeLetter)  // add it to gpa

        })
        gpa = gpa/this.courses.length; // then we divide the whole additions to length of courses to find it
        if (isNaN(gpa)){
            return 0
        }
        return gpa
    }

    delCourse(crsName){
        const crs= courses.find((course) => course.courseName===crsName)
        crs.delStudent(this.studentid)

        const index=this.courses.findIndex((course) => course.courseName=== crsName)
        console.log(index+ "ok ??")
        this.courses.splice(index,1)
        updateCourseTable()
        updateStudentTable()
    }
    
}

if (!localStorage.getItem("courses")){  // if the localstorage is empty than we fetch from local json file 
    fetch("courses.json" )
        .then(response => response.json())
        .then(data => localStorage.setItem("courses",JSON.stringify(data)))
}

const coursesJson= JSON.parse( localStorage.getItem("courses")) ?? []
// get courses from local storage if exists or create empty array

// map the courses from local storage to Course Class objs
const courses= coursesJson.map((course) => new Course(course.courseName,course.gradeScale,course.students))



if (!localStorage.getItem("students")){ // if the localstorage is empty than we fetch from local json file 
    fetch("students.json" )
        .then(response => response.json())
        .then(data => localStorage.setItem("students",JSON.stringify(data)))
}
// get students from local storage if exists or create empty array

const studentsJson= JSON.parse(localStorage.getItem("students")) ?? []
// map the courses from local storage to Student Class objs

const students= studentsJson.map((student) => new Student(student.name,student.studentid,student.courses))


const courseForm= document.querySelector("#courseForm")
courseForm.addEventListener("submit", (event) =>{  //for handling addition of courses
    event.preventDefault();

    const courseName= document.querySelector("#courseName").value
    if (courses.find((crs) => crs.courseName === courseName) ){ // if the crs already exists
        alert("There's already a course with the same name..")
        return
    }

    const gradeScale= document.querySelector("#gradeScale").value


    courses.push(new Course(courseName,gradeScale,[]))  // add the new course to array
    updateCourseTable()

    event.target.reset();

})



function updateCourseTable(){ 
    /// populate the course table
    const tableBody=document.querySelector("#courseTableBody")

    tableBody.innerHTML = ""
    for (let i=0; i< courses.length; i++)  {
        tableBody.innerHTML+=
        `<tr>
            <td>${courses[i].courseName}</td>
            <td>${courses[i].gradeScale}</td>
            <td>
                <button onclick="viewDetailsInCourse('${courses[i].courseName}')" >View Details</button>
                <button onclick="delCourse(${i})" > Delete Course </button>
            </td>
         </tr> `
    }
    const courseJSON=JSON.stringify(courses)
    localStorage.setItem("courses",courseJSON) // add to localStorage

}
function viewDetailsInCourse (crsName) { // for redirecting to search section
    router('searchCourse')

    document.querySelector('#courseSearchSelection').value=crsName


}
function delCourse(index){
    courses.splice(index, 1);
    updateCourseTable();
    
}
function editStudent(index) {  // for handling the editStudent dialog
    const dialog = document.querySelector("#studentEditDialog");
    dialog.showModal() // open the modal
    const closeButton= document.querySelector("#closeStudentDialog")

    const formName= document.querySelector("#studentNameDialog")
    formName.value= students[index].name  // populate the inputs  name value from table
    
    const id= students[index].studentid
   

    const formButton = document.querySelector("#studentSubmitButton")
    formButton.addEventListener("click",(event) =>{  // when submit gets clicked
        event.preventDefault();
        
        const selectedStudent=students.find((student) => student.studentid===id)
        console.log(selectedStudent)

        selectedStudent.editName(formName.value)
        alert("Student's name is updated to: "+formName.value)
        updateStudentTable()
        window.location.reload();  //reloading page here because there s a glitch if you try to edit again without refleshing

        dialog.close()
    })


    closeButton.addEventListener("click", () => {
        dialog.close();

    });
}

const studentForm= document.querySelector("#studentForm")
studentForm.addEventListener("submit", (event) =>{  /// adding new students
    event.preventDefault();

    const studentName= document.querySelector("#studentName").value
    const studentID= document.querySelector("#studentid").value
    if (findStudentById(studentID)){  // if the student already in db
        alert("A student with the same ID already exists..")
        return;
    }
    students.push(new Student(studentName,studentID,[]))
    updateStudentTable()
    event.target.reset();

})

function updateStudentTable(){

    /// populate student table
    console.log(students)
    const tableBody=document.querySelector("#studentTableBody")
    tableBody.innerHTML = ""

    students.forEach((student,index) =>{
      const row=document.createElement("tr");
      row.innerHTML=`
      
      <td>${student.name}</td>
      <td>${student.studentid}</td>
            
      <td>
          <button onclick="editStudent(${index})"> Edit Student </button>
          <button onclick="delStudent(${index})" > Delete Student </button>
          <span>GPA:${+student.calcGPA().toPrecision(3)}</span>
      </td>
      `;
        tableBody.appendChild(row);

    })

    localStorage.setItem("students",JSON.stringify(students))


}
function delStudent(index){
    students.splice(index, 1);
    updateStudentTable();

}

function findStudentById(id){

    return students.find((student) => student.studentid===id)
}



function updateCombinedDropdowns() {
    // for populating dropdowns 
    const courseSelect = document.querySelector("#courseSelect");
    const studentSelect = document.querySelector("#studentSelect");
    studentSelect.innerHTML=""
    students.forEach(student =>{
        const option = `<option value="${student.name}">${student.name}</option>`;
        studentSelect.innerHTML += option;
    })

    courseSelect.innerHTML=""

    courses.forEach(course => {
        const option = `<option value="${course.courseName}">${course.courseName}</option>`;
        courseSelect.innerHTML += option;

    });
}

const combinedForm= document.querySelector("#editCourseForm")

combinedForm.addEventListener("submit", (event) =>{  // adding students in the courses
    event.preventDefault();
    const courseName= document.querySelector("#courseSelect").value
    console.log(courseName)
    const studentName= document.querySelector("#studentSelect").value
    const midterm= document.querySelector("#midterm").value
    const final= document.querySelector("#final").value

    const chosenCourse=courses.find((course) => course.courseName===courseName)
    const chosenStudent=students.find((studentObj) => studentObj.name===studentName)
    console.log(chosenCourse.students)

    if (chosenCourse.students.find((student) => student.studentid===  chosenStudent.studentid)){
        alert(chosenStudent.name+ " is already in "+chosenCourse.courseName)
        return
    }

    chosenCourse.addStudent(chosenStudent.studentid,midterm,final)
    chosenStudent.addCourse(courseName,midterm,final,chosenCourse.gradeScale)

    updateCombinedTable()
     // event.target.reset();

})


function updateCombinedTable(){
    //populate table
    const tableBody = document.querySelector("#coursesAndStudentsTableBody")
    tableBody.innerHTML = ""

    listCourses(courses,tableBody,"showAll")

    localStorage.setItem("students",JSON.stringify(students))
    localStorage.setItem("courses",JSON.stringify(courses))

}

function calcGradeLetter(midterm,final,gradescale){
    //for calculating grade letter
    const total= 0.4*midterm + 0.6*final;
    if (gradescale === "10"){
        return total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 60 ? "D" : "F";
        //return total >= 90 ? "AA" : total >= 85 ? "BA" : total>= 80 ? "BB" : total >=75 ? "CB": total >=70 ? "CC": total >=65 ? "DC": total >=60 ? "DD" : "FF"
    }
    else if (gradescale === "7"){
        return  total >= 93 ? "A" : total >= 86 ? "B" : total >= 79 ? "C" : total >= 72 ? "D" : "F"
    }

}


document.querySelector("#searchStudentForm").addEventListener("submit",(event) => {
    // for searching students
    event.preventDefault()
    const searchedName= document.querySelector("#studentSearch").value;

    const tableCaption=document.querySelector("#searchedStudentTable caption")
    tableCaption.innerHTML="The results for "+searchedName+":";

    const tableBody= document.querySelector("#searchedStudentTable tbody")
    tableBody.innerHTML=""
    const studentResult=students.filter((student) => student.name.toLowerCase().includes( searchedName.toLowerCase()))
    console.log(studentResult)
    if (studentResult.length<1){
        // alert("No students found..")
        tableCaption.innerHTML="The results for "+searchedName+": Could not be found" ;
        return
    }

    studentResult.forEach((student) =>{
        const gpa = document.createElement("h2");
        gpa.innerHTML="GPA OF "+ student.name +" is: " + student.calcGPA().toPrecision(3)
        tableBody.appendChild(gpa)

        tableBody.innerHTML+= `
        <thead>
                 <tr>
                     <th>Student Name</th>
                     <th>Student ID </th>
                     <th>Course Name</th>
                     <th>Midterm Score</th>
                     <th>Final Score</th>
                     <th>Grade</th>
                     <th>Status</th>


                 </tr>
         </thead>
        `

            student.courses.forEach((course) =>{
            const row=document.createElement("tr");
            const gradeLetter = calcGradeLetter(course.midterm,course.final,course.gradeScale)
            row.innerHTML=`
                <td>${student.name}</td>
                <td>${student.studentid}</td>
                <td>${course.courseName}</td>
                
                <td>${course.midterm} </td>
                <td>${course.final} </td>
                <td> ${gradeLetter}</td>
                <td>${gradeLetter === "F" ? "Failed" : "Passed"} </td>
                 `
            tableBody.appendChild(row);
        })

    })

})


function listCourses(courseList,tableBody,filter) {
    ///for listing students and courses together

    const detailCheckbox = document.querySelector("#detailCheckbox")
    let passedCount=0
    let failedCount=0


    courseList.forEach((course) =>{
        if(course.students.length!==0){
            
        
            tableBody.innerHTML+= `
            <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Student Name</th>
                        <th>Student ID </th>
                        
                        <th>Midterm Score</th>
                        <th>Final Score</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th>Settings</th>


                    </tr>
            </thead>
            `

            if (filter==="passed"){  ///for passed filter
                course.students.forEach((student, index) =>{
                    const gradeLetter = calcGradeLetter(student.midterm,student.final,course.gradeScale)
                    if (gradeLetter !=="F"){
                        passedCount++
                        const row=document.createElement("tr");
                        row.innerHTML = `
                    <td>${course.courseName}</td>
                    <td>${findStudentById(student.studentid).name}</td>
                    <td>${student.studentid}</td>
                    
                    
                    <td>${student.midterm} </td>
                    <td>${student.final} </td>
                    <td> ${gradeLetter}</td>
                    <td>${gradeLetter === "F" ? "Failed" : "Passed"} </td>
                    <td><button onclick="editScore('${student.studentid}','${course.courseName}','${student.midterm}','${student.final}')">Edit Score</button>
                        <button onclick="delScore('${student.studentid}','${course.courseName}')">Delete Score</button>
                    </td>   
                    
                    `
                        tableBody.appendChild(row);
                    }
                    else{
                        failedCount++
                    }

                })
            }
            else if (filter==="showAll") ///for showAll filter
            course.students.forEach((student) =>{

                const row=document.createElement("tr");
                const gradeLetter = calcGradeLetter(student.midterm,student.final,course.gradeScale)
                if (gradeLetter !=="F"){
                    passedCount++
                }
                else {
                    failedCount++
                }
                row.innerHTML=`
                    <td>${course.courseName}</td>
                    <td>${findStudentById(student.studentid).name}</td>
                    <td>${student.studentid}</td>
                    
                    
                    <td>${student.midterm} </td>
                    <td>${student.final} </td>
                    <td> ${gradeLetter}</td>
                    <td>${gradeLetter === "F" ? "Failed" : "Passed"} </td>
                    <td><button onclick="editScore('${student.studentid}','${course.courseName}','${student.midterm}','${student.final}')">Edit Score</button>
                        <button onclick="delScore('${student.studentid}','${course.courseName}')">Delete Score</button>
                    </td>
                    
                    `
                tableBody.appendChild(row);
            })

            else if (filter==="failed"){///for failed students filter
                course.students.forEach((student) =>{
                    const gradeLetter = calcGradeLetter(student.midterm,student.final,course.gradeScale)
                    if (gradeLetter ==="F"){
                        failedCount++
                        const row=document.createElement("tr");
                        row.innerHTML = `
                    <td>${course.courseName}</td>
                    <td>${findStudentById(student.studentid).name}</td>
                    <td>${student.studentid}</td>
                    
                    
                    <td>${student.midterm} </td>
                    <td>${student.final} </td>
                    <td> ${gradeLetter}</td>
                    <td>${gradeLetter === "F" ? "Failed" : "Passed"} </td>
                    <td><button onclick="editScore('${student.studentid}','${course.courseName}','${student.midterm}','${student.final}')">Edit Score</button>
                        <button onclick="delScore('${student.studentid}','${course.courseName}')">Delete Score</button>
                    </td>
                    
                    
                        
                    `
                        tableBody.appendChild(row);
                    }
                    else {
                        passedCount++
                    }

                })
            }

            if (detailCheckbox.checked){
                document.querySelector("ul").style="list-style: disc;"

                document.querySelector("#failedStu").innerHTML=`Number of failed Students:${failedCount}`
                document.querySelector("#passedStu").innerHTML=`Number of passed Students:${passedCount}`
                document.querySelector("#meanOfCourse").innerHTML=`Mean of class: ${calcMeanOfCourse(course).toPrecision(3)}`
            }
            else{
                document.querySelector("ul").style="list-style: none;"
                document.querySelector("#failedStu").innerHTML=""
                document.querySelector("#passedStu").innerHTML=""
                document.querySelector("#meanOfCourse").innerHTML=``
            }
        }   
    })
}
function delScore(stuID,crsName){ //delete a students score from a course

    const stu=findStudentById(stuID.toString())
    stu.delCourse(crsName)
    updateCombinedTable()
    // alert("Score Deleted for "+crsName)
    const table= document.querySelector("#searchedCourseTable tbody")
    table.innerHTML=""
}
function editScore(stuID,crsName,midtermScore,finalScore) { 
    //edit a students score from a course

    const dialog = document.querySelector("#scoreEditDialog");
    dialog.showModal()
    const closeButton= document.querySelector("#closeScoreDialog")
    
    const midterm= document.querySelector("#midtermDialog")
    midterm.value=midtermScore
    const final= document.querySelector("#finalDialog")
    final.value=finalScore
    
    const formButton = document.querySelector("#scoreSubmitButton")
    formButton.addEventListener("click",(event) =>{
        event.preventDefault();
        if (midterm.value> 100 || midterm.value <0 || final.value <0  || final.value >100){
            alert("Score values should be between 0-100")
            return
        }
        delScore(stuID,crsName)
        
        const chosenStudent=students.find((studentObj) => studentObj.studentid===stuID)
        const chosenCourse=courses.find((course) => course.courseName===crsName)
        

        chosenCourse.addStudent(chosenStudent.studentid,midterm.value.toString(),final.value.toString())
        chosenStudent.addCourse(crsName,midterm.value.toString(),final.value.toString(),chosenCourse.gradeScale)

        alert("Edited "+chosenStudent.name+"'s score for "+chosenCourse.courseName)
        window.location.reload()
        updateCombinedTable()

        dialog.close()
    })


    closeButton.addEventListener("click", () => {
        dialog.close();

    });
}


function calcMeanOfCourse(course){
    // for calculation of mean score
    // A:4 B:3 C:2 D:1 F:0
    let mean=0
    course.students.forEach((student) => {
        const score=student.midterm*0.4+ student.final*0.6
        mean+=score
    })
    mean = mean/course.students.length; // then we divide the whole additions to length of courses to find it
    return isNaN(mean) ? 0 : mean
}



const searchCourseFunc = (event,method) => {

    /// used for searching or selecting a course 

    event.preventDefault()
    const tableCaption=document.querySelector("#searchedCourseTable caption")
    const filterSelection = document.querySelector("#filterSelection")



    let searchedName=""
    if(method==="search"){
        searchedName= document.querySelector("#courseSearch").value;
        tableCaption.innerHTML="The results for "+searchedName+":";
    }
    else if (method==="selection") {
        searchedName = document.querySelector("#courseSearchSelection").value;
        tableCaption.innerHTML=searchedName
    }
    const courseResult=courses.filter((course) => course.courseName.toLowerCase().includes( searchedName.toLowerCase()))

    console.log(courseResult)
    if (courseResult.length<1){
        // alert("No course found..")
        tableCaption.innerHTML="The results for "+searchedName+": Could not be found" ;
        return
    }

    const tableBody= document.querySelector("#searchedCourseTable tbody")
    tableBody.innerHTML=""


    if(filterSelection.value==="passed"){
        listCourses(courseResult,tableBody,"passed")
    }else if(filterSelection.value==="failed"){
        listCourses(courseResult,tableBody,"failed")
    }
    else{
        listCourses(courseResult,tableBody,"showAll")
    }



}
function populateCourseSelection(){
    // used for populating courses in the dropdown
    const courseSelect=document.querySelector("#courseSearchSelection")
    courseSelect.innerHTML=""

    courses.forEach(course => {
        const option = `<option value="${course.courseName}">${course.courseName}</option>`;
        courseSelect.innerHTML += option;

    });
}

document.querySelector("#searchCourseForm").addEventListener("submit",(event) =>{
    searchCourseFunc(event,"search")

})

document.querySelector("#searchCourseForm2").addEventListener("submit",(event) =>{
    searchCourseFunc(event,"selection")
})



router(window.location.hash.replace("#",""));  // this is to keep track of where the user was before refreshing
updateCourseTable() // used for updating table in first load

