document.querySelector(".start").addEventListener("click", launchTimer);

function launchTimer() {
  // we'll store date in the databasee so we're tracking when someone times a task
  let date = new Date().toLocaleDateString();
  // grabbing the input number from client
  let timerAmount = document.querySelector(".minutes").value * 60 * 1000;

  // creating an array of focus music to select from
  let sample1 = new Audio("sample1.mp3");
  let sample2 = new Audio("sample2.mp3");
  let sample3 = new Audio("sample3.mp3");
  let sample4 = new Audio("sample4.mp3");
  let musicArray = [sample1, sample2, sample3, sample4];

  // creating a random number thats used as the index for the array
  let randomNum = Math.floor(Math.random() * timerAmount);
  let soundSelection = randomNum % musicArray.length;
  let audioChosen = musicArray[soundSelection];

  // looping the audio always
  audioChosen.loop = true; // we are targeting an html attribute of the mp3 
  // playing the audio that was randomly selected
  audioChosen.play();
  // when the timer duration is up, we'll pause the sound
  setTimeout(() => {
    audioChosen.pause();
  }, timerAmount);
}
const deg = 6;
const hour = document.querySelector(".hour");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

const setClock = () => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * deg;
  let ss = day.getSeconds() * deg;

  hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  min.style.transform = `rotateZ(${mm}deg)`;
  sec.style.transform = `rotateZ(${ss}deg)`;
};

// first time
setClock();
// Update every 1000 ms
setInterval(setClock, 1000);

const switchTheme = (evt) => {
  const switchBtn = evt.target;
  if (switchBtn.textContent.toLowerCase() === "light mode") {
    switchBtn.textContent = "dark mode";
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    switchBtn.textContent = "light mode";
    document.documentElement.setAttribute("data-theme", "light");
  }
};

const switchModeBtn = document.querySelector(".switch-btn");
switchModeBtn.addEventListener("click", switchTheme, false);

let currentTheme = "dark";

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  switchModeBtn.textContent = currentTheme;
}

const postTask = (e) => {
  
  console.log("you cicked the button")
  let timerAmount = document.querySelector(".minutes").value
  let task = document.getElementById('testTwo').value
  console.log({timerAmount,task})
  fetch("postTask", {
    method:"post",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify({
      timerAmount, 
      task
    })
  })
    .then((response)=>{
    if(response.ok) return response.text()
  })
  .then((text)=>{
    console.log(text)
  })
}
document.querySelector(".start").addEventListener("click", postTask);
