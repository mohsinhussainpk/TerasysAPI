**Readme**
======

###**Introduction**
Backend API to take in data from IoT devices and serve it to clients via REST endpoints.
Devices are automatically registered on first data POST.

**API has been updated to accept only HTTPS requests at port 8765.**

###**Sending Data**
Data is consumed by API through POST endpoints.
Data to be sent as JSON formatted string in the body of the POST request. 
Currently the following metrics can be sent to their respective URIs:

####Temperature

POST https://www.terasyshub.io/api/v1/data/temperature

Temperature data sample
```json
{
	"mac": "00:0a:95:9d:68:16",
	"value": 20,
	"unit": "fahrenheit",
	"timestamp": 1486547814,
	"location": {
		"lat": 12.0231,
		"lon": -1.1293
	}
}
```

####Humidity

POST https://www.terasyshub.io/api/v1/data/humidity

Humidity data sample
```json
{
	"mac": "00:0a:95:9d:68:16",
	"value": 17.8,
	"unit": "%",
	"timestamp": 1486547814,
	"location": {
		"lat": 12.0231,
		"lon": -1.1293
	}
}
```


###**Retrieving Data**
The following endpoints can be used to retrieve data from the API.

####**Devices**

GET https://www.terasyshub.io/api/v1/devices


	Get get list of devices that have sent data to API. Devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc

GET https://www.terasyshub.io/api/v1/devices/:mac-address


	Retrieve information about a single device, uniquely identified by MAC address.

####**Temperature**

GET https://www.terasyshub.io/api/v1/data/temperature/:mac-address


	Get temperature datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc

####**Humidity**

GET https://www.terasyshub.io/api/v1/data/humidity/:mac-address


	Get humidiy datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc