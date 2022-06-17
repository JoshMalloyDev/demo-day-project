window.addEventListener("load", changeColor);

function changeColor() {
    console.log('getting random color')
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  document.querySelector(".container").style.background = "#" + randomColor;
  document.querySelector(".date").innerText = new Date()
    .toDateString()
    //slicing off last four letters because we dont need the year
    .slice(0, -4);
}

console.log('hey josh')