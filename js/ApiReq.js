  const apiKey = '9NX3Oqwv5lZ41dHba9boDdOMZ7HA1uTp';
  
  function currentConditionsReq (respFunc,city) {
    var url = "http://dataservice.accuweather.com/currentconditions/v1/locationKey?apikey="
    +apiKey+"&locationKey="+city.id;
  getReq(url,respFunc,city);
  }

  function fiveDayReq (respFunc,city) {
    var url = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/locationKey?apikey="
    +apiKey+"&locationKey="+city.id+"&metric=true&details=true";
   getReq(url,respFunc,city);
  }

  function autocompleteReq (str,respondFunc) {
    var url = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey="
    +apiKey+"&q="+str+"&language=en-us";
    getReq(url,respondFunc);
  }

  function getReq (url,respondFunc,city) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", respondFunc);
    oReq.onerror = function () {
      alert("network error!");
    };
    oReq.city = city;
    oReq.open("GET", url);
    oReq.send();
  }

  