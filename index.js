const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container")

// initially variable need
let currentTab=userTab;
const API_KEY= "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    console.log(1);
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCordinate=sessionStorage.getItem("user-coordinates");
    if(!localCordinate){
        grantAccessContainer.classList.add("active");
    }else{
        const cordinates=JSON.parse(localCordinate);
        fetchUserWeatherInfo(cordinates);
    }
}

async function fetchUserWeatherInfo(cordinates){
    const {lat ,lon} =cordinates;

    // grantcontainer invisible
    grantAccessContainer.classList.add("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // Api call

    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // H/W
    }

}

function renderWeatherInfo(weatherInfo){
    // firstly, we have to fetch the element 
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=weatherInfo?.wind?.speed; 
    humidity.innerText=weatherInfo?.main?.humidity;
    cloudiness.innerText=weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else{
        // h/w 
    }
}

function showPosition(position){
    const userCordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-cordinates",JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
    grantAccessContainer.classList.remove("active");

}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);



const searchInput=document.querySelector("[data-seachInput]");
searchForm.addEventListener("submit",(a)=>{
    a.preventDefault();
    let cityName=searchInput.areaValueMax;

    if(cityName===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metrid`);
        
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(err){

    }
}
