function router(divID){

    const sections=document.querySelectorAll("section")
    sections.forEach(item => item.classList.remove("visible"))
    const div =document.querySelector("#"+divID)
    div.classList.add("visible")

}


class Course{
    constructor(courseName,gradeScale,students){
        this.courseName=courseName
        this.gradeScale=gradeScale
        this.students=students

    }

    addStudent(student,midterm,final){
        this.students.push({"studentid":student,"midterm":midterm,"final":final})
    }

}


class Student{
    constructor(name,studentid,courses){
        this.studentid=studentid;
        this.name=name;
        this.courses=courses
    }

    editName(name){
        this.name= name;
    }
    addCourse(course,midterm,final){
        this.courses.push({"courseName":course.courseName,"midterm":midterm,"final":final})
    }
    
}


const coursesJson= JSON.parse( localStorage.getItem("courses")) ?? []
// get courses from local storage if exists or create an empty array
const courses= coursesJson.map((course) => new Course(course.courseName,course.gradeScale,course.students))
console.log(courses)


// const courses=[
//     new Course("Database","7")
// ]

const studentsJson= JSON.parse(localStorage.getItem("students")) ?? []
const students= studentsJson.map((student) => new Student(student.name,student.studentid,student.courses))
/*const students=[
    new Student("Emir Bakkal","220709004")
]*/


const courseForm= document.querySelector("#courseForm")
courseForm.addEventListener("submit", (event) =>{
    event.preventDefault();

    const courseName= document.querySelector("#courseName").value
    const gradeScale= document.querySelector("#gradeScale").value
    console.log(courseName,gradeScale);
    courses.push(new Course(courseName,gradeScale,[]))
    updateCourseTable()

    event.target.reset();

})


function updateCourseTable(){
    const tableBody=document.querySelector("#courseTableBody")
    tableBody.innerHTML = ""
    for (let i=0; i< courses.length; i++)  {
        tableBody.innerHTML+=
        `<tr>
            <td>${courses[i].courseName}</td>
            <td>${courses[i].gradeScale}</td>
            <td>
                <button onclick="delCourse(${i})" > Delete Course </button>
            </td>
         </tr>`
    }
    const courseJSON=JSON.stringify(courses)
    localStorage.setItem("courses",courseJSON)

}

function delCourse(index){
    courses.splice(index, 1);
    updateCourseTable();
    
}

const studentForm= document.querySelector("#studentForm")
studentForm.addEventListener("submit", (event) =>{
    event.preventDefault();

    const studentName= document.querySelector("#studentName").value
    const studentid= document.querySelector("#studentid").value
    students.push(new Student(studentName,studentid,[]))
    updateStudentTable()
    event.target.reset();

})

function updateStudentTable(){
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
      </td>
      `;
        tableBody.appendChild(row);

    })

    localStorage.setItem("students",JSON.stringify(students))

    /*for (let i=0; i< students.length; i++)  {
        tableBody.innerHTML+=
        `<tr>
            <td>${students[i].name}</td>
            <td>${students[i].studentid}</td>
            
            <td>
                <button onclick="editStudent(${i})" > Edit Student ${i} </button>
                <button onclick="delStudent(${i})" > Delete Student </button>
            </td>
         </tr>`
    }*/

}
function delStudent(index){
    students.splice(index, 1);
    updateStudentTable();

}

function findStudentById(id){
    return students.find((student) => student.studentid===id)
}

/*function editStudent(index) {
    console.log(index)
    const dialog = document.querySelector("#studentEditDialog");
    dialog.showModal()
    const closeButton= document.querySelector("#closeStudentDialog")

    const formName= document.querySelector("#studentNameDialog")
    formName.value= students[index].name
    const formId= document.querySelector("#studentidDialog")
    formId.value= students[index].studentid

    const formButton = document.querySelector("#studentSubmitButton")
    formButton.addEventListener("click",(event) =>{
        event.preventDefault();
        students[index].name=formName.value;
        students[index].studentid=formId.value;
        updateStudentTable()
        dialog.close()
    })


    closeButton.addEventListener("click", () => {
        dialog.close();

    });
}*/
function editStudent(index) {
    const dialog = document.querySelector("#studentEditDialog");
    dialog.showModal()
    const closeButton= document.querySelector("#closeStudentDialog")

    const formName= document.querySelector("#studentNameDialog")
    formName.value= students[index].name
    //const formId= document.querySelector("#studentidDialog")
    const id= students[index].studentid
    // formId.value=id

    const formButton = document.querySelector("#studentSubmitButton")
    formButton.addEventListener("click",(event) =>{
        event.preventDefault();
        console.log(id)
        const selectedStudent=students.find((student) => student.studentid===id)
        console.log(selectedStudent)

        selectedStudent.editName(formName.value)


        updateStudentTable()
        dialog.close()
    })


    closeButton.addEventListener("click", () => {
        dialog.close();

    });
}


function updateCombinedDropdowns() {
    const courseSelect = document.querySelector("#courseSelect");
    const studentSelect = document.querySelector("#studentSelect");
    students.forEach(student =>{
        const option = `<option value="${student.name}">${student.name}</option>`;
        studentSelect.innerHTML += option;
    })
    // const statsCourseSelect = document.getElementById("statsCourseSelect");
    // courseSelect.innerHTML = `<option value="">Select a Course</option>`;
    courses.forEach(course => {
        const option = `<option value="${course.courseName}">${course.courseName}</option>`;
        courseSelect.innerHTML += option;
        // statsCourseSelect.innerHTML += option;
    });
}

const combinedForm= document.querySelector("#editCourseForm")

combinedForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    const course= document.querySelector("#courseSelect").value
    console.log(course)
    const student= document.querySelector("#studentSelect").value
    const midterm= document.querySelector("#midterm").value
    const final= document.querySelector("#final").value

    let chosenCourse=null
    let chosenStudent=null
    for (let i=0; i<courses.length; i++){
        if (courses[i].courseName===course){
            chosenCourse=courses[i]
            console.log("chosen course:"+chosenCourse.courseName)
        }
    }
    for (let i=0; i<students.length; i++){
        if (students[i].name===student){
            chosenStudent=students[i]
            console.log("chosen student:"+chosenStudent.studentid)
        }
    }

    chosenCourse.addStudent(chosenStudent.studentid,midterm,final)
    console.log("nigg"+chosenStudent.studentid,midterm,final)
    //chosenStudent.addCourse(chosenCourse,midterm,final)

    updateCombinedTable()
     event.target.reset();

})

function updateStudentsinCourseArray(){

}

function updateCombinedTable(){
    const tableBody = document.querySelector("#coursesAndStudentsTableBody")
    tableBody.innerHTML = ""

    courses.forEach((course,index) =>{
        course.students.forEach((studentObj,stuIndex ) => {
            console.log(studentObj)
            const row=document.createElement("tr");
            row.innerHTML=`
                <td>${course.courseName}</td>
                <td>${findStudentById(studentObj.studentid).name}</td>
                <td>${studentObj.studentid}</td>
                <td>${studentObj.midterm} </td>
                <td>${studentObj.final} </td>
                <td> ${calcGradeLetter(studentObj.midterm,studentObj.final,course.gradeScale)}</td>
                 `
            tableBody.appendChild(row);
        })




    })

    localStorage.setItem("students",JSON.stringify(students))
    localStorage.setItem("courses",JSON.stringify(courses))

}

function calcGradeLetter(midterm,final,gradescale){
    const total= 0.4*midterm + 0.6*final;

    if (gradescale === "10"){
        return total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 60 ? "D" : "F";

        //return total >= 90 ? "AA" : total >= 85 ? "BA" : total>= 80 ? "BB" : total >=75 ? "CB": total >=70 ? "CC": total >=65 ? "DC": total >=60 ? "DD" : "FF"
    }
    else if (gradescale === "7"){
        return  total >= 93 ? "A" : total >= 86 ? "B" : total >= 79 ? "C" : total >= 72 ? "D" : "F"

    }


}



updateCourseTable()
updateStudentTable()
updateCombinedDropdowns()
updateCombinedTable()
