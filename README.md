**Readme**
======
###**Introduction**
Terasys-api to take in data from IoT devices over websockets and serve it to clients via REST endpoints.

###**Websockets**
Connect to websockets at ```http://159.203.164.3:8765```.

The following events can be used to send data to the appropriate colletions in the database:

```temperature```
```humidity```

API accepts formatted JSON strings. Below is sample datapoint:

```JSON
{
	'mac': '00:0a:95:9d:68:16',
	'value': 20,
	'unit': 'fahrenheit'
	'timestamp': 1486547814,
	'location': {
		'lat': 12.0231,
		'lon': -1.1293
	}
}
```

###**REST Endpoints**
The following endpoints can be used to retrieve data from the API.

####**Devices**

GET http://159.203.164.3:8765/api/v1/devices


	Get get list of devices that have sent data to API. Devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc

GET http://159.203.164.3:8765/api/v1/devices/:device


	Retrieve information about a single device, uniquely identified by MAC address.

####**Temperature**

GET http://159.203.164.3:8765/api/v1/temperature/:device


	Get temperature datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc

####**Humidity**

GET http://159.203.164.3:8765/api/v1/humidity/:device


	Get humidiy datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc