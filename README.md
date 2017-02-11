**Readme**
======

### **Introduction**
Backend API to take in data from IoT devices and serve it to clients via REST endpoints.
Devices need to be registered before they can send data to API.

**API has been updated to accept only HTTPS requests.**

### **Sending Data**
Data is consumed by API through POST endpoints as JSON formatted string in the body of the POST request. 

#### Registering Device
Before sending any data from a device, it needs to be registered with the API.
This is done by POSTing the device MAC address to the following endpoint:

POST https://www.terasyshub.io/api/v1/keys

Sample body payload:
```json
{
	"mac": "00:0a:95:9d:68:16"
}
```
The API will return an API key that is to be included with all subsequent data POST requests from that device.

Below is a DFD for the registration process:

![Registration Process DFD](http://tinypic.com/r/2u9tv8y/9)

To retrieve the API key for a registered device, you can either use the POST endpoint again or use the following GET endpoint:

GET https://www.terasyshub.io/api/v1/keys/:mac-address

Currently the following metrics can be sent to their respective URIs:

#### Temperature

POST https://www.terasyshub.io/api/v1/data/temperature

Temperature data sample:
```json
{
	"mac": "00:0a:95:9d:68:16",
	"value": 20,
	"unit": "fahrenheit",
	"timestamp": 1486547814,
	"location": {
		"lat": 12.0231,
		"lon": -1.1293
	},
	"key":"2e7f1eeaaf308e6917bf"
}
```

#### Humidity

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
	},
	"key":"2e7f1eeaaf308e6917bf"
}
```


### **Retrieving Data**
The following endpoints can be used to retrieve data from the API.

#### **Devices**

GET https://www.terasyshub.io/api/v1/devices


	Get get list of devices that have sent data to API. Devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc

GET https://www.terasyshub.io/api/v1/devices/:mac-address


	Retrieve information about a single device, uniquely identified by MAC address.

#### **Temperature**

GET https://www.terasyshub.io/api/v1/data/temperature/:mac-address


	Get temperature datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc, defaults to desc

#### **Humidity**

GET https://www.terasyshub.io/api/v1/data/humidity/:mac-address


	Get humidiy datapoints for device specified in path. devices are uniquely identified by MAC address. Supports pagination, filtering, and ordering.

	Query Parameters:

		page: for pagination
		results: for number of results per page, defaults to 10
		filter: select field to sort by, defaults to timestamp
		order: asc or desc, defaults to desc