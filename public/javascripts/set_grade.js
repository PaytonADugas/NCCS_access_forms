var grades = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

function setGrade(){
  var html = '';
  var selected = '';
  for(let i = 0; i < 12; i++){
    var grade = grades[i];
    html += `<option value="${grade}" ${selected}>${grade}</option>`;
  }
  $('#grade_select').html(html);
  console.log(JSON.stringify(student.grade));
}

function getGrade(){
  return JSON.stringify(student.grade);
}

setGrade();
