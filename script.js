const timer=document.querySelector('.timer');
const title=document.querySelector('.title');
const startBtn=document.querySelector('.startBtn');
const pauseBtn=document.querySelector('.pauseBtn');
const resumeBtn=document.querySelector('.resumeBtn');
const resetBtn=document.querySelector('.resetBtn');
const pomoCountsDisplay=document.querySelector('.pomoCountsDisplay');

const workTime=25*60;
const breakTime=5*60;
let timerId=null;
let oneRoundCompleted=false; //one round=worktime+breaktime
let totalCount=0; //to count the no of rounds completed
let paused=false;


//function so that title can be updated in different conditions;
const updateTitle=(msg)=>{
   
       
        title.textContent= msg;
    
}

//function to save no of rounds in local storage;
const saveLocalCounts=()=>{
    let counts=JSON.parse(localStorage.getItem("pomoCounts"));
   counts!==null?counts++:counts=1;
   localStorage.setItem("pomoCounts",JSON.stringify(counts));

}


//function to countdown;
const countDown=(time)=>{
    return () =>{
        const minutes=Math.floor(time/60).toString().padStart(2,'0');
        const seconds=Math.floor(time%60).toString().padStart(2,'0');
        timer.textContent=`${minutes}:${seconds}`;
        time--;
        if(time<0){
            stopTimer();
            //now because work time is ended we have to start break time;
            if(!oneRoundCompleted){
               timerId= startTimer(breakTime);
                oneRoundCompleted=true;
                updateTitle("It is Break Time");
            }
            else{
             
                updateTitle("Completed 1 round of  Pomodoro Technique");
                setTimeout(()=> updateTitle("Start Timer Again!"),2000);
                totalCount++;
                saveLocalCounts();
                showPomoCounts();
               
            }
            
        }
    }
    
}
//function to start the timer

const startTimer=(startTime)=>{
    if(timerId!==null){
        stopTimer()
    }
    return setInterval(countDown( startTime),1000);
}

//function to stop timer;
const stopTimer=()=> {
      clearInterval(timerId);
      timerId=null;
}

//Adding event listener to start button
startBtn.addEventListener('click',()=>{
    
    timerId=startTimer(workTime);
 
    updateTitle("It's Work Time!")
});

//Adding event listener to reset button
resetBtn.addEventListener('click',()=>{
   
   
    stopTimer();
    timer.textContent="25:00";
})

//Adding event listener to pause button
pauseBtn.addEventListener('click',()=>{
    paused=true;
    stopTimer();
    updateTitle("Timer Paused")
})

//Adding event listener to resume  button
resumeBtn.addEventListener('click',()=>{
    
    if(paused){
        const currentTime=getTimeInSeconds(timer.textContent);
        timerId=startTimer(currentTime);
        paused=false;
        (!oneRoundCompleted)?updateTitle("It's Work Time"):updateTitle("It is Break Time")
    }
   
})

const getTimeInSeconds=(timeString)=>{
    const[minutes,seconds]=timeString.split(":");//destructurig
    return parseInt(minutes * 60) + parseInt(seconds);
}

//function to show completed pomodoros to screen from local storage
const showPomoCounts=()=>{
    //accessing counts from local storage;
    const counts=JSON.parse(localStorage.getItem("pomoCounts"));
    if(counts>0){
        pomoCountsDisplay.style.display="flex";
    }
    pomoCountsDisplay.firstElementChild.textContent=counts;
}



showPomoCounts();