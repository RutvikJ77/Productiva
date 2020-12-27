
let TIME_LIMIT = 20;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = TIME_LIMIT/2;
const ALERT_THRESHOLD = TIME_LIMIT/4;
let temp_time_limit = 20;

// Initially, no time has passed, but this will count up
// and subtract from the TIME_LIMIT
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
      },
      alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
      }
  };
  
let remainingPathColor = COLOR_CODES.info.color;





document.getElementById("app").innerHTML=`

<div class="start-pause">
  <input type="button" id="both" value="Start"/>
  <input type="button" id="reset" value="Reset"/>
</div>

<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stoke-dasharray="283"
        class = "base-timer__path-remaining ${remainingPathColor}"
        d="
        M 50,50 
        m -45,0
        a 45,45 0 1,0 90,0
        a 45,45 0 1,0 -90,0
        ">
        </path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">
    ${formatTime(timeLeft)}
  </span>
</div>


<div class="Timers">
    <button id="small-timer">25</button>
    <button id="mid-timer">50</button>
</div>


`;
//var small_timer = document.querySelector("#small-timer");
//small_timer.addEventListener("click",update_time(25*60));

//var mid_timer = document.querySelector("#mid-timer");
//mid_timer.addEventListener("click",update_time(50*60));

// function update_time(value){
//   TIME_LIMIT = value;
//   console.log(TIME_LIMIT);

//   return value/60;
// }



var Start_pause = document.getElementById("both");
Start_pause.addEventListener("click",Start);
Start_pause.addEventListener("click",startTimer);


var reset_timer = document.getElementById("reset");
reset_timer.addEventListener("click",reset);

//Start and stop function
function Start(){
  
  console.log("Started");
  Start_pause.value="Pause";
  Start_pause.removeEventListener("click",Start);
  Start_pause.addEventListener("click",pause);

}

function pause(){
  Start_pause.removeEventListener("click",startTimer);
  console.log("Paused");
  Start_pause.value="Start";
  Start_pause.removeEventListener("click",pause);
  Start_pause.addEventListener("click",Start);
  
  

}



function reset(){
  console.log("Reset");
  timePassed=-1;
  onTimesUp();
}


function onTimesUp() {
    clearInterval(timerInterval);
  }


function startTimer(){
    timerInterval = setInterval(()=>{
        timePassed +=1;
        timeLeft = TIME_LIMIT - timePassed;
        if(timeLeft>=0){
          document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
          setCircleDasharray();
          setRemainingPathColor(timeLeft);
        }
        if (timeLeft === 0 || timeLeft<0){
          //Add a reset function
          reset();
        }
    },1000);
}


function formatTime(time) {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(time / 60);
    
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = time % 60;
    
    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    
    // The output in MM:SS format
    return `${minutes}:${seconds}`;
  }


function setRemainingPathColor(timeLeft){
    const {alert,warning, info} = COLOR_CODES;
    if (timeLeft <= alert.threshold){
      document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
      document.getElementById("base-timer-path-remaining").classList.add(alert.color);
    }else if( timeLeft <=warning.threshold){
      document.getElementById("base-timer-path-remaining").classList.remove(info.color);
      document.getElementById("base-timer-path-remaining").classList.add(warning.color);
    }else{
      document.getElementById("base-timer-path-remaining").classList.remove(alert.color);
      document.getElementById("base-timer-path-remaining").classList.add(info.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }