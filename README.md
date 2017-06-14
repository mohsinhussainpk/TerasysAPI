**Readme**
======

### **Introduction**
Backend API to take in data from IoT devices and serve it to clients via REST endpoints.
Devices need to be registered before they can send data to API.

**API has been updated to accept only HTTPS requests.**

### **REST API**

REST API documentation can be found [here](https://documenter.getpostman.com/collection/view/1909663-fbb9d248-decd-d62c-608d-ba5714087222)

### **Socket.io**

Connection to socket.io is done at [https://www.terasyshub.io/](https://www.terasyshub.io/)

#### Listen Events

To obtain data from socket.io, you must set it to listen to the type of data you want returned. In this case either ```temperature``` or ```humidity``` as these are the only ones we have implemented so far.

To get get data from the API, there are two methods:

#### Polling at intervals

Using this method, it is possible to manually set an interval in the frontend at which to poll the API for data.
To do so, emit the event ```getData``` to socket.io. The data to provide is as follows:

```JSON
{
  "mac" : "00:0a:95:9d:68:16",
  "type" : "temperature",
  "last" : 1487868693,
  "token" : {{authtoken}}
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
socket.emit('register', {device:'00:0a:95:9d:68:16', token:'{{authtoken}}'});
```

To stop listening for updates for a device, simply ```unregister``` from the device:

```JS
socket.emit('unregister', '00:0a:95:9d:68:16');
```

## Webhook Api documentation

#### There are four endpoints that recieves a post request in this sprint namely:
- **/api/webhook-obd2**: this endpoint recieves a **post** request from the webhook and persist the data in a mongo db there after sending a response status of **200** back to the webhook

- **/api/events/message**: this is the endpoint to retrieves all messages events (from most recent to oldest) relating to a particular account and returns an array of message events along with pagination meta data.
the endpoint recieves 3 input posts.

  (1) **AccountName (compulsory)**: this is the name of the account as registered by the webhook services provider in which it  message events is required.

  (2) **limit(optional)**: the number of most recent events required.

  (3) **offset(optional)**: the number of data to skip when querying.

- **/api/events/track**: this is the endpoint to retrieves all track events (from most recent to oldest) relating to a particular account and returns an array of presence events along with pagination meta data.
the endpoint recieves 3 input posts.

  (1) **AccountName (compulsory)**: this is the name of the account as registered by the webhook services provider in which it track events is required.

  (2) **limit(optional)**: the number of most recent events required.

  (3) **offset(optional)**: the number of data to skip when querying.

- **/api/events/presence**: this is the endpoint to retrieves all presence events (from most recent to oldest) relating to a particular account and returns an array of presence events along with pagination meta data.
the endpoint recieves 3 input posts.

  (1) **AccountName (compulsory)**: this is the name of the account as registered by the webhook services provider in which it track events is required.

  (2) **limit(optional)**: the number of most recent events required.

  (3) **offset(optional)**: the number of data to skip when querying.
