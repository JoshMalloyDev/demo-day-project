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
  console.log('switch Test')
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
    method:"put",
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
document.querySelector(".startWalk").addEventListener("click", travelTime)
let distanceArray = []
let timerId
function travelTime(){
  console.log('Hit')
  const status = document.querySelector(".locationString")
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    console.log('lat:', latitude, 'long:', longitude)
   
    distanceArray.push({ latitude: latitude, longitude: longitude })
  }
  function error() {
    status.textContent = 'Unable to retrieve your location';
}
 //if there is no geolocation API, then send this msg
 if (!navigator.geolocation) {
  status.textContent = 'Geolocation is not supported by your browser';
} else {
  //if there is a location, then we will automatically run and get the current position of every 2 seconds
  timerId = setInterval(() => {
      status.textContent = 'Locating…';
      //telling it to start tracking
      navigator.geolocation.getCurrentPosition(success, error, options);
      console.log(distanceArray,)
  }, 2000)
}
//getCurrentPosition needs this passed into it
options = {
  enableHighAccuracy: false,
  timeout: 5000,
  //the position you find acceptable to return
  maximumAge: 0
};
}
function distance(lat1, lat2, lon1, lon2) {

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in miles
  let r = 3956;

  // calculate the result
  return (c * r);
}
document.querySelector('.stopWalk').addEventListener('click', () => {
  //distanceArr has all of the coordinates as objects, in pairs as lat and long
  //we're passing the current pair and grabbing the lat
  // then we're telling it to referecne the distanceArr and use the currentidex that we're all, and then add one to it

  let distanceCollection = []

  //looping through the global array and setting safety checks to ensure that there is always more than one coordinate pair inside of the array and that we arent at the last set of coordinates
  let correctSize = distanceArray.length > 1
  if (correctSize) {
      distanceArray.forEach((currentValue, currentIndex) => {
          let notLastEntry = currentIndex + 1 != distanceArray.length
          if (notLastEntry) {
              // calcute the difference between the two points
              let deltaDistance = distance(
                  //grabbing the latitude of the object inside of the array
                  currentValue.latitude,
                  //grabing the latitude of the next object inside of the array
                  distanceArray[currentIndex + 1].latitude,
                  //doing the same thing as it did with the first latitude  
                  currentValue.longitude,
                  //doing the same thing as it did with the second latitude 
                  distanceArray[currentIndex + 1].longitude
              )
              distanceCollection.push(deltaDistance)
          }
      }
      )
  }
  // going through the distanceCollection array and combining the values and sum of the distance collection
  //totalSum is the accumalator, looping through the array
  //currentValue will be the first entry of the array
  let totalDistance = distanceCollection.reduce((totalSum, currentValue) => totalSum + currentValue)
  console.log('totalDistance:', totalDistance)
  //we are stopping the timer loop 
  clearInterval(timerId)
  //getting todays current date
  const distanceWalked = document.querySelector('.locationString')
  if ( totalDistance < 0.25){
  distanceWalked.textContent = `you walked: ${Math.floor(totalDistance * 5280)} feet,`;

  }else {distanceWalked.textContent = `you walked: ${Math.floor(totalDistance )} miles,`; }

  // send total desiance in miles times number of feet in mille 5280
  // i want to send that to ejs in the location string
  // if distance is more than a 0.25 send totalDistanice miles 
    })


