

// query selector stuff
document.querySelector(".logRecipe").addEventListener("click", logFinalRecipe);
// creating and empty recipe array thay will constanstanly have stepped pushed into
// it as its looping through all of the inputs
function logFinalRecipe() {
  let recipeArray = [];
  
  let rowArray = document.querySelectorAll(".somerow"); // an array or all of the rows
  // we are begining to loop throw the array
  for (let i = 0; i < rowArray.length; i++) { // we looped throw the row 
    let cells = rowArray[i].getElementsByTagName("td"); // we aregrabbing all of the data cells inside of the rows
    let recipeStep = cells[0].getElementsByTagName("input")[0].value; //targeting the first data cell becasue its nested we have to target th first input cell inside of that
    recipeArray.push(recipeStep);// once we have the value of that input we are pushing to the empty array we created at the top
  }

  let recipeTitle = document.querySelector('.recipeTitle').value
console.log(recipeTitle)
let whatTimeIsIt = document.querySelector('.time').value
  // final object to ship over to the server
  let recipeDataForServer = { 
    steps: recipeArray,
    whatTimeIsIt: whatTimeIsIt,  
    recipeTitle: recipeTitle,

  };

  console.log(recipeDataForServer, "data for server");
  fetch("submitRecipes", {
    method:"post",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify({
      recipeDataForServer:recipeDataForServer
    })
  })
  // .then((response)=>{
  //   if(response.ok) return response.text()
  // })
  // .then((text)=>{
  //   console.log(text)
  // })
}
// looked at stackover flow solutions
function addRow(tableID) {
  let table = document.getElementsByClassName(tableID);
  let rowCount = table[0].rows.length;

  if (rowCount >= 21) {
    // +1 for header row.
    return;
  }

  let row = table[0].insertRow(rowCount);
  row.classList.add("somerow");
  let cell1 = row.insertCell(0);
  let element1 = document.createElement("input");
  element1.type = "text";
  element1.name = "";
  element1.classList.add("step");
  element1.placeholder = "your next step";
  cell1.appendChild(element1);

  let cell2 = row.insertCell(1);
  cell2.innerHTML = rowCount;

  let cell3 = row.insertCell(2);
  let element2 = document.createElement("input");
  element2.type = "checkbox";
  element2.name = "chkbox[]";
  cell3.appendChild(element2);
}

function deleteRow(tableID) {
  let table = document.getElementsByClassName(tableID);
  let rowCount = table[0].rows.length;

  for (let i = 0; i < rowCount; i++) {
    let row = table[0].rows[i];

    let chkbox = row.cells[2].childNodes[0];

    if (chkbox.checked) {
      table[0].deleteRow(i);
      rowCount--;
      i--;
    }
  }
}

document.querySelector('.button').addEventListener('click', chooseMeal)
function chooseMeal(){
  console.log('choosing')
  let currentHour = new Date().getHours();
  fetch("getMeal", {
    method:"post",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify({
      currentHour:currentHour
    })
  })
}