class cityForecast {
  constructor(id,name){
    this.id = id;
    this.name = name;
  }
  
  currentConditionsRespFunc(responseText){
    var data = JSON.parse(responseText)[0];
    this.currentTemp =  parseInt(data.Temperature.Metric.Value);
    this.weatherIcon =  parseInt(data.WeatherIcon);
    this.weatherText =  data.WeatherText;
  }
}
