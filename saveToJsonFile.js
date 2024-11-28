// Retrieve JSON data from localStorage
let courseJsonData = localStorage.getItem('courses');
let studentJsonData = localStorage.getItem('students');


// Convert JSON data to a Blob object
let cblob = new Blob([courseJsonData], { type: 'application/json' });
let sblob = new Blob([studentJsonData], { type: 'application/json' });

// Create a URL for the Blob object
let cUrl = URL.createObjectURL(cblob);
let sUrl = URL.createObjectURL(sblob);
// Create an anchor element, set its href to the Blob URL, and trigger a download
let a = document.createElement('a');
let a2= document.createElement('a')
a.href = cUrl;
a2.href = sUrl;
a.download = 'courses.json'; // Specify the filename
a2.download= 'students.json';
document.body.appendChild(a);
document.body.appendChild(a2);
a.click();
a2.click();
document.body.removeChild(a);
document.body.removeChild(a2);

