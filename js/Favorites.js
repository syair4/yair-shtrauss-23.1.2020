window.addEventListener("load", init);

function init() {
  getFavorites();
}

/*api response function */
function getFavorites () {
  var favoritesList = JSON.parse(localStorage.getItem("favorites"));
  if(favoritesList && favoritesList.length > 0){
    for (let i = 0; i< favoritesList.length; i++) {
      var city = new cityForecast(favoritesList[i].id,favoritesList[i].name);
      currentConditionsReq(onLocationResp,city);
    }
}
}
/*api response function */
function onLocationResp () {
    this.city.currentConditionsRespFunc(this.responseText);
    renderView(this.city);   
}

/*render forecast view*/
function renderView (city) {
  var daysContainer = document.getElementsByClassName('forecast-container')[0];
  var forecast = document.createElement("div");
  forecast.setAttribute("id", city.id);
  forecast.setAttribute("class", "forecast");
  forecast.addEventListener("click", function (e) {
    window.location.replace("main.html?id="+e.target.id+"&name="+e.toElement.querySelector(".name").innerText);
  });
  forecast.innerHTML =
      '<div class="forecast-header">'+
        '<div class="name" >'+city.name +'</div>'+
      '</div>'+
      '<div class="forecast-content">'+
       '<div class="forecast-icon">'+
          '<div class="image s'+city.weatherIcon+'"></div>'+
        '<div class="degree">'+city.currentTemp+'<sup>o</sup>C</div>'+
        '<small>'+city.weatherText+'</small>'+
      '</div>'; 

      daysContainer.appendChild(forecast);
      daysContainer.classList.add('show');
  }

