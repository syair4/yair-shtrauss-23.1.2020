window.addEventListener("load", init);
const defaultCityId = 710949; // Tel-Aviv id
const defaultCityName = "Tel Aviv";

function init() {
  var url  = (new URL(window.location)).searchParams;
  var cityId = url.get("id") || defaultCityId;
  var cityName = url.get("name") || defaultCityName;
  var currentCity = new cityForecast(cityId,cityName);
  autocomplete(document.getElementById("locationInput"));
  fiveDayReq(onLocationResp,currentCity);
}

/*check in local storage if city is favorite return the favorites array index*/
function isFavorite(id){
  var favoritesList =  JSON.parse(localStorage.getItem("favorites"));
  if(favoritesList && favoritesList.length > 0){
    for (let i = 0; i< favoritesList.length; i++) {
      if (favoritesList[i].id == id) {
       return i;
      }
    }
  }
  return -1;
}

function toggleFavorite(){
  this.classList.toggle('on');
  var favoritesList =  JSON.parse(localStorage.getItem("favorites"));
  var idAtPlace = isFavorite(this.id);
  if(idAtPlace !=-1 ){
    favoritesList.splice(idAtPlace, 1);
  }else if(!favoritesList){
    favoritesList = [{"id":this.id,"name":document.querySelector('.location').textContent}];
  }
  else{
    favoritesList.push({"id":this.id,"name":document.querySelector('.location').textContent});
  }
  localStorage.setItem("favorites", JSON.stringify(favoritesList));
}

/*api response function */
function onLocationResp () {
    renderView(JSON.parse(this.responseText),this.city);
}

/*render forecast view*/
function renderView (data,city) {
  var forecastContainer = document.querySelector('.forecast-container');
  var todayContainerEl = forecastContainer.querySelector('.today.forecast');
  var todayDegreeNumEl = todayContainerEl.querySelector('.num');
  var rainProbabilityEl = todayContainerEl.querySelector('.rainProbability .value');
  var windSpeedEl = todayContainerEl.querySelector('.windSpeed .value');
  var dateEl = todayContainerEl.querySelector('.date');
  var todayNameEl = todayContainerEl.querySelector('.day') ;
  var todayIconEl = todayContainerEl.querySelector('.forecast-icon .image');
  var daysContainer = forecastContainer.querySelector('.daysContainer');
  var favoriteIconEl = forecastContainer.querySelector('.favor');
  var locationEl =  forecastContainer.querySelector('.name');
  var todayData = data.DailyForecasts[0];
  var date = new Date(todayData.Date);

  todayDegreeNumEl.innerHTML = parseInt(todayData.Temperature.Maximum.Value);
  rainProbabilityEl.innerHTML = parseInt(todayData.Day.RainProbability);
  windSpeedEl.innerHTML = parseInt(todayData.Day.Wind.Speed.Value);
  todayNameEl.innerHTML = date.toLocaleDateString('en-US',{ weekday: 'long'});
  dateEl.innerHTML = date.toLocaleDateString('en-US',{day: 'numeric',month: 'long' });
  locationEl.innerHTML =city.name;
  daysContainer.innerHTML ="";

  todayIconEl.className = "image";
  todayIconEl.classList.add("s"+todayData.Day.Icon);
  

  favoriteIconEl.setAttribute("id", city.id);
  favoriteIconEl.addEventListener("click", toggleFavorite);
  if(isFavorite(city.id) != -1){
    favoriteIconEl.classList.add('on');
  }
  else{
    favoriteIconEl.classList.remove('on');
  }

  for (let i = 1; i < data.DailyForecasts.length; i++) {
    var forecastData = data.DailyForecasts[i];
    var date = new Date(forecastData.Date);
    daysContainer.innerHTML +=
    '<div class="forecast">'+
      '<div class="forecast-header">'+
        '<div class="day">'+ date.toLocaleDateString('en-US',{ weekday: 'long'})+'</div>'+
      '</div>'+
      '<div class="forecast-content">'+
       '<div class="forecast-icon">'+
          '<div class="image s'+forecastData.Day.Icon+'"></div>'+
        '<div class="degree">'+parseInt(forecastData.Temperature.Maximum.Value)+'<sup>o</sup>C</div>'+
        '<small>'+parseInt(forecastData.Temperature.Minimum.Value)+'<sup>o</sup></small>'+
        '</div>'+
      '</div>'; 
  }
  forecastContainer.classList.add('show');

} 