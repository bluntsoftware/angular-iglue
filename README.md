## Configuration
Bower Install
```
bower install "https://github.com/bluntsoftware/angular-iglue.git#~1.5.0"
```
Or in your bower json file add the following dependencies
```
"angular-resource": "~1.5.0",
"angular-conduit":"https://github.com/bluntsoftware/angular-iglue.git#~1.5.0"
```
include your script tags in index.html 
```
  <script src="bower_components/angular-resource/angular-resource.js"></script>
  <script src="bower_components/angular-conduit/dist/iglue.min.js"></script>
```

include the the following modules in your app module

```
angular.module('myApp', [
  'ngResource',
  'iglue' 
]).config(function(){
    // Set the Iglue application endpoint url
    window.iglue_env.base_url = "http://bluntsoftware.com/glue/";
});
```
The iglue module contains 3 services
1. $auth - for authenticating to the Iglue server.
2. $iglue - for communicating to the Iglue api. 
3. $conduit - for communicating to your custom rest api.

## Using the Authentication Service

## Using the IGlue Service

## Using the Conduit Service
Inject the conduit service into a controller
```
angular.controller('View1Ctrl', ['$conduit',function($conduit) {
    $conduit.collection('doc').get().then(function(returnData){
      console.log(returnData);
    });
}]);
```
### Posting - Saving Data
The client needs to communicate with the server. The example source contains a helper library named conduit to allow calls to the server flows. Below are some examples.

For posting (sending) a document (data) to the server we can use

```
var somedata = {first_name:'Jane',last_name:'Doe'};
$conduit.collection('flowname','flowcontext').post(somedata).then(function(returnData){

});
```
### Getting - Finding Data
For getting (finding) documents (data) from the server. note: filterByFields as a valid [mongo query][mongo-find] 
```
var cat = 'Household Goods';
var listparams = {
     sidx: "_id", //field name to sort on
     sord: "ASC", //sort order ascending or descending 
     rows: 1000,  //maximum number of rows to return
     filterByFields:{ // case insensitive search where category field contains 'Household Goods'  
          'category':{ '$regex': '^'+cat , '$options': 'i' } 
     }
};
var collection = $conduit.collection('flowname','flowcontext');
var promise = collection.get(listparams);
promise.then(function(data){
                 
});

```
```
/* Short Version using Query builder*/
var qry = window.queryBuilder.new().qry().setRows(1000).icn('category','Household Goods');
$conduit.collection('flowname','flowcontext').get(qry.build()).then(function(data){

});
```
### Getting by Id - Finding a document by id


### Removing by Id - Remove a document by id
[mongo-find]:https://docs.mongodb.com/manual/reference/method/db.collection.find/
