var $ = require('minified').$;

$(function (){
	var tLocation = '{{city}}, {{country}}',
			celsius, fahrenheit;
	$.request('GET', 'https://freegeoip.net/json/').then(function (text) {
		var data = $.parseJSON(text);
		var tmp = {
			country: data['country_name'],
			city: data['time_zone'].split('/')[1].replace('_', ' '),
			cc: data['country_code']
		};
		$('#loc').ht(tLocation, tmp);
		return tmp;
	}).then(function (tmp) {
		$.request('GET', 'https://api.openweathermap.org/data/2.5/weather?q='+tmp.city+','+tmp.cc+'&APPID=7bd15f43323fc8ab5ad1ccd741d622f1').then(function(text){
		var data = $.parseJSON(text);
		var kelvin = data.main.temp;
		celsius = (kelvin - 273.15).toFixed(2) + ' °C';
		fahrenheit = (kelvin*(9/5) - 459.67).toFixed(2) + ' °F';
			$('#temp').fill(celsius);

			var climate = data.weather[0].main;

			$('#clim').fill(climate);

			return data.weather[0].id;
		}).then(function (code) {
			$.request('GET', 'https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json').then(function (text) {
				var weatherIcons = $.parseJSON(text);
				var icon = weatherIcons[code].icon;
				if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
    			icon = 'day-' + icon;
  			}
  			icon = 'wi-' + icon;
  			$('#icon-clim').set(icon);
			});
		});
	});

	$('#temp').onClick(function () {
		$('#temp').fill( ($('#temp').text() == celsius) ? fahrenheit : celsius);
	});
});
