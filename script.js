function router(divID){

    const sections=document.querySelectorAll("section")
    sections.forEach(item => item.classList.remove("visible"))
    const div =document.querySelector("#"+divID)
    div.classList.add("visible")

}


class Course{
    constructor(courseName,gradeScale){
        this.courseName=courseName
        this.gradeScale=gradeScale

    }

}

let studentid=0
class Student{
    constructor(name){
        this.id=studentid++
        this.name=name;
    }
    
}


const courses=[
    new Course("Database","7")
]




const courseForm= document.querySelector("#courseForm")
courseForm.addEventListener("submit", (event) =>{
    event.preventDefault();

    const courseName= document.querySelector("#courseName").value
    const gradeScale= document.querySelector("#gradeScale").value
    console.log(courseName,gradeScale);
    courses.push(new Course(courseName,gradeScale))
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

}

function delCourse(index){
    courses.splice(index, 1);
    updateCourseTable();
    
}

updateCourseTable()