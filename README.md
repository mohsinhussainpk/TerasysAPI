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

![Registration Process DFD](https://image.ibb.co/bMU6Jv/device_registration_dfd.png)

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
Data can be retrieved using either GET requests to the REST endpoints or socket.io for long polling requests.

### **REST Endpoints**
The following endpoints can be used to retrieve data using REST from the API.

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
		
### **Socket.io**

Connection to socket.io is done at https://www.terasyshub.io/

#### Listen Events

To obtain data from socket.io, you must set it to listen to the type of data you want returned. In this case either ```temperature``` or ```humidity``` as these are the only ones we have implemented so far.

To get get data from the API, there are two methods:

####Polling at intervals

Using this method, it is possible to manually set an interval in the frontend at which to poll the API for data.
To do so, emit the event ```getData``` to socket.io. The data to provide is as follows:

```JSON
{
  "mac" : "00:0a:95:9d:68:16",
  "type" : "temperature",
  "last" : 1487868693 
}
```

```mac``` is the mac address of the device to get data for

```type``` is the type of data to be returned

```last``` optional field. Determines up to what time to pull results from. Leave blank to return latest datapoint. 

Data is returned as it would be from the REST endpoint.


#### Registering to database updates

This method returns data to the ```temperature``` and ```humdity``` events as soon as data is saved in the database.

To be updated whenever data for a device is saved in the DB, simply send the mac address of the device to the ```register``` listener like so:

```JS
socket.emit('register', '00:0a:95:9d:68:16');
```

To stop listening for updates for a device, simply unregister from the device:

```JS
socket.emit('unregister', '00:0a:95:9d:68:16');
```