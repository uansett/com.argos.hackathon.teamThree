//var AI_CUSTOMER_ID = "38e5c972-174d-11e0-a152-12313b032222"; 
var AI_TOP_DOMAIN = document.domain; 
var AI_SERVICE_HOST = "service.avail.net";


/*
*	eMark.js version: 2.0.1
*
*	Global STATIC Parameters, dynamic ones above
*/
var AI_SERVICE_PROTOCOL = ai_getProtocol();
var AI_SERVICE_PATH = "/2009-02-13/dynamic/";
var AI_COOKIE_NAME = "__avail_session__";
var AI_DEBUG = false;
var AI_TESTING = false;
var ai_load_lock = false;
var __avail_ret;


// see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
// generate UUID browser side
var AI_NEW_SESSION_ID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
}).toUpperCase();


/**
*	This is the return type of all calls to functions in the Emark class. The dynamic script will populate the
*	member {@link #values} with the result from the dynamic script.
*	@constructor
*/
function ResponseObj(){

	/**
	* Holds the result from function calls. Values can be of the type one or two dimensional Array.
	*/
	this.values = new Array('');
	this.trackingcode = "";
	this.clickurls = new Array();
	this.carturls = new Array();
	this.products = new Array();

	/** @private */
	this.valueOf = this.toSource = this.toString = function(){ return this.values.toString();}
	/** @private */
	this.update = function(v) {
		this.values = v['values'].slice();
		if('trackingcode' in v){
			this.trackingcode = v['trackingcode'];

			ps = v['products'].slice();
			for(var i = 0; i < ps.length; i++){
				url = ai_getSynchronousCallUrl("logClickedOn", ["TrackingCode", "Product"], [v['trackingcode'], ps[i]], "bounce") + "&u=";
				this.clickurls[i] = url;

				url = ai_getSynchronousCallUrl("logAddedToCart", ["TrackingCode", "Product"], [v['trackingcode'], ps[i]], "bounce") + "&u=";
				this.carturls[i] = url;

				this.products[i] = ps[i];
			}
		}
	}
}

/*
*	Call Object
*	Each call to an Emark function creates a Call Object that is placed on the call stack
*/
function CallObj(method, args){
	this._method = ai_jesc(method);
	this._args = args;

	// Return a list: [methodname , {arg1 : val1, arg2 : val2, ... }]
	this.toQString = function(){
		var ret = new Array();
		ret[0] = this._method;
		ret[1] = this._args;

		return '[' + ret.toString() + ']';
	}

	this.toString = this.toQString;
}


/*
	_AI_* -classes below provides JSON compatible toString() -methods
*/
function _AI_String(str){
	this.str = str;

	this.toString = function(){
		//return '"' + this.str + '"';
		return this.str;
	}
}

function _AI_Array(arr){
	this.arr = arr;

	this.toString = function(){
		if(this.arr.length == 0){
			return "[]";
		}
		var ret = '[';
		ret += this.arr[0];
		for (var i = 1; i < this.arr.length; i++){
			ret += ',' + this.arr[i];
		}
		return ret + ']';
	}
}
function _AI_Dic(dic){
	this.dic = dic;
	this.add = function(key, value){
		dic[key] = value;
	}

	this.toString = function(){
		var ret = new Array();
		for(e in dic){
			ret.push('"' + e + '":' + dic[e]);
		}
		return '{' + ret + '}';
	}
}

/**
*	Main object that has all public methods.
*
*	@param {boolean} debug (Optional) Set to true to enable debug logging. Should only be used for development.
*	@constructor
*/
function Emark(debug){
	if(ai_typeOf(debug) == 'boolean'){
		AI_DEBUG = debug;
	}

	/** @private */
	this._res_arr = new Array(1);
	/** @private */
	this._call_arr = new Array(1);
	/** @private */
	this._nr_calls = 0;
	/** @private */
	this._customer_callback = null;


	//------------ Public methods ----------------
	/**
	* Returns predictions for one or more products using a given template.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} Input (Optional) Array of key-value pairs on the form 'key:value', see <a href="Datatypes.html#Input">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getRecommendations = function (TemplateName, Input, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getRecommendations",
										new _AI_Dic({
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"Input" : new _AI_Array(ai_jesc_array(Input)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };
	//------------ Public methods ----------------
	/**
	* Returns predictions for one or more products using a given template.
	* @param {Array} ProductIDs Array of product ids. Must not be empty. Each product id must be an alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getProductsPredictions = function (ProductIDs, TemplateName, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("ProductsIDs", ProductIDs) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getProductsPredictions",
										new _AI_Dic({
										"Products" : new _AI_Array(ai_jesc_array(ProductIDs)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };
	/**
	* Returns predictions for one or more products using a given template, based on click data.
	* @param {Array} ProductIDs Array of product ids. Must not be empty. Each product id must be an alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getProductsPredictionsFromClicks = function (ProductIDs, TemplateName, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("ProductsIDs", ProductIDs) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getProductsPredictionsFromClicks",
										new _AI_Dic({
										"Products" : new _AI_Array(ai_jesc_array(ProductIDs)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };
	/**
	* Returns predictions for a user with a given template.
	* @param {String} UserID Must not be empty. Alpha-numeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Also an alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getUserPredictions = function (UserID, TemplateName,  DynamicParameters, ColumnNames) {
						if(
							!this._validateNonNullAndNonEmptyString("User", UserID) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getUserPredictions",
										new _AI_Dic({
										"User" : new _AI_String(ai_jesc(UserID)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };
	/**
	* Returns predictions for a search phrase with a given template.
	* @param {String} SearchPhrase Must not be empty.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getSearchPredictions = function (SearchPhrase, TemplateName, DynamicParameters, ColumnNames) {
						if(
							!this._validateNonNullAndNonEmptyString("Phrase", SearchPhrase) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getSearchPredictions",
										new _AI_Dic({
										"Phrase" : new _AI_String(ai_jesc(SearchPhrase)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };
	/**
	* Returns predictions for a search phrase (used on an external web search engine) with a given template.
	* @param {String} SearchPhrase Must not be empty.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getLandingPagePredictions = function (SearchPhrase, TemplateName, DynamicParameters, ColumnNames) {
						if(
							!this._validateNonNullAndNonEmptyString("Phrase", SearchPhrase) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getLandingPagePredictions",
										new _AI_Dic({
										"Phrase" : new _AI_String(ai_jesc(SearchPhrase)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };

	/**
	* Returns predictions based on the products in a shopping cart.
	* @param {Array} ProductIDs Array of product ids. Must not be empty. Each product id must be an alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getCartPredictions = function (ProductIDs, TemplateName, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("ProductsIDs", ProductIDs) ||
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getCartPredictions",
										new _AI_Dic({
										"Products" : new _AI_Array(ai_jesc_array(ProductIDs)),
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };

	/**
	* Returns predictions based on the current session's clickstream. The clickstream is collected from {@link #logClickedOn} and also from {@link #getProductsPredictions} when the input only contains one product.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getClickstreamPredictions = function (TemplateName, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getClickstreamPredictions",
										new _AI_Dic({
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };

	/**
	* Returns the current session's clickstream. The clickstream is collected from {@link #logClickedOn} and also from {@link #getProductsPredictions} when the input only contains one product.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getClickstream = function (TemplateName, DynamicParameters, ColumnNames ) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getClickstream",
										new _AI_Dic({
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };

	/**
	* Returns products from a a given template.
	* @param {String} TemplateName Which template to use for predictions. Must not be empty. Also an alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} DynamicParameters (Optional) Specify modification parameters to use with the specified template. Default empty. See <a href="Datatypes.html#DynPara">Data types</a> for details.
	* @param {Array} ColumnNames (Optional) Which columns to return. If not specified then product id column is returned. Contains alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getProducts = function (TemplateName, DynamicParameters, ColumnNames) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("TemplateName", TemplateName) ){
								return new Array(new Array(''));
						}

						ColumnNames = this._checkAndAddDefaultColumnName(ColumnNames);

						return this._addToStack(	"getProducts",
										new _AI_Dic({
										"TemplateName" : new _AI_String(ai_jesc(TemplateName)),
										"ColumnNames" : new _AI_Array(ai_jesc_array(ColumnNames)),
										"DynamicParameters" : new _AI_Array(ai_jesc_array(DynamicParameters))
										})
										); };

	/**
	* Returns users that have a similar order history as the given user.
	* @param {String} UserID The user to base Twinsumers on. This must be the same user id as in the uploaded order history.
	* @param {String} NrToReturn The maximum number of Twinsumers to return.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* When requesting only a single column, e.g. product identifiers (ProductIDs), values is a single dimensional array (myReturn.values[i]).
	* When requesting recommendations with meta data - for example price, image url and so on - values is a two dimensional array (myReturn.values[i][j]).
	*/
	this.getTwinsumers = function (UserID, NrToReturn) {
						if( !this._validateNonNullAndNonEmptyString("User", UserID) ){
								return new Array(new Array(''));
						}
						return this._addToStack(	"getTwinsumers",
										new _AI_Dic({
										"User" : new _AI_String(ai_jesc(UserID)),
										"NrToReturn" : new _AI_String(ai_jesc(NrToReturn))
										})
										); };

	/**
	* Logs the event that a user makes a purchase to the server.
	* @param {String} UserID Unique identifier for this user. This must match the user string sent to {@link #getUserPredictions}. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} ProductIDs Array of product ids that is purchased. Must not be empty. Alphanumeric strings, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {Array} Prices Array of prices that is purchased. Dot denotes decimal. Must be in the same order as the products. Must not be empty. Do not include taxes, shipment and handling or other charges outside the actual product price. All prices submitted must be in the same currency.
	* @param {String} OrderID (Optional)
	* @param {String} Currency (Optional) A three letter code denoting a currency according to ISO 4217 standard (USD, EUR, SEK, DKK, etc.). See <a href="http://en.wikipedia.org/wiki/ISO_4217">Wikipedia</a> for details about ISO 4217.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.logPurchase = function (UserID, ProductIDs, Prices, OrderID, Currency) {
						if(
							!this._validateNonNullAndNonEmptyStringOrArray("ProductsIDs", ProductIDs) ||
							!this._validateNonNullAndNonEmptyStringOrArray("Prices", Prices) ||
							!this._validateNonNullAndNonEmptyString("User", UserID) ){
								return new Array(new Array(''));
						}

						return this._addToStack(	"logPurchase",
										new _AI_Dic({
										"User" : new _AI_String(ai_jesc(UserID)),
										"Products" : new _AI_Array(ai_jesc_array(ProductIDs)),
										"Prices" : new _AI_Array(ai_jesc_array(Prices)),
										"OrderID" : new _AI_String(ai_jesc(OrderID)),
										"Currency" : new _AI_String(ai_jesc(Currency))
										})
										); };
	/**
	* Logs the event that a user adds a recommended product to the shopping cart.
	* @param {String} ProductID Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TrackingCode Server generated tracking code. The code is part of the ResponseObject returned from a prediction call, see <a href="Datatypes.html#ResponseObject">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.logAddedToCart = function (ProductID, TrackingCode) {
						if(!this._validateNonNullAndNonEmptyString("ProductID", ProductID)) {
								return;
						}

						var tracking_code_type = ai_typeOf(TrackingCode);
						var arg_dict;
						if (tracking_code_type != 'undefined') {
							arg_dict  = new _AI_Dic({
								"Product" : new _AI_String(ai_jesc(ProductID)),
								"TrackingCode" : new _AI_String(ai_jesc(TrackingCode))
							});
						} else {
							arg_dict  = new _AI_Dic({
								"Product" : new _AI_String(ai_jesc(ProductID))
							});
						}
						return this._addToStack("logAddedToCart", arg_dict);
	};

	/**
	* Removes a product from  a shopping cart. Does not affect metrics just updates emarks view of the shopping cart - allows for better cart recommendations based just on sessionId.
	* @param {String} ProductID Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.logRemovedFromCart = function (ProductID) {
						if(!this._validateNonNullAndNonEmptyString("ProductID", ProductID)) {
								return;
						}

						var arg_dict;
						arg_dict  = new _AI_Dic({
								"Product" : new _AI_String(ai_jesc(ProductID))
								});
						return this._addToStack("logRemovedFromCart", arg_dict);
	};
	/**
	* Logs the event that a user clicks on a recommended product.
	* @param {String} ProductID Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @param {String} TrackingCode Server generated tracking code. The code is part of the ResponseObject returned from a prediction call, see <a href="Datatypes.html#ResponseObject">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.logClickedOn = function (ProductID, TrackingCode) {
						if(
							!this._validateNonNullAndNonEmptyString("ProductID", ProductID) ||
							!this._validateNonNullAndNonEmptyString("TrackingCode", TrackingCode) ){
								return;
						}

						return this._addToStack(	"logClickedOn",
										new _AI_Dic({
										"Product" : new _AI_String(ai_jesc(ProductID)),
										"TrackingCode" : new _AI_String(ai_jesc(TrackingCode))
										})
										); };

	/**
	* Saves a search to the server. Predictions for searches are based on these.
	* @param {String} SearchPhrase The complete search phrase that the user entered into the search field. Must not be empty.
	* @param {String} ProductID What product the user eventually bought. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.saveSearch = function (SearchPhrase, ProductID) {
						if(
							!this._validateNonNullAndNonEmptyString("Phrase", SearchPhrase) ||
							!this._validateNonNullAndNonEmptyString("Product", ProductID) ){
								return new Array(new Array(''));
						}
						return this._addToStack(	"saveSearch",
										new _AI_Dic({
										"Phrase" : new _AI_String(ai_jesc(SearchPhrase)),
										"Product" : new _AI_String(ai_jesc(ProductID))
										})
										); };

	/**
	* Saves a landing page phrase. Predictions for landing pages are based on these.
	* @param {String} SearchPhrase The complete search phrase that the user entered into the search field. Must not be empty.
	* @param {String} ProductID What product the user eventually bought. Must not be empty. Alphanumeric string, see <a href="Datatypes.html#AlphNumString">Data types</a> for details.
	* @return Object - After {@link #commit} has been called, the returned object will have a member variable 'values'.
	* Values will contain a status message of the operation as a string.
	*/
	this.saveLandingPageData = function (SearchPhrase, ProductID) {
						if(
							!this._validateNonNullAndNonEmptyString("Phrase", SearchPhrase) ||
							!this._validateNonNullAndNonEmptyString("Product", ProductID) ){
								return new Array(new Array(''));
						}
						return this._addToStack(	"saveLandingPageData",
										new _AI_Dic({
										"Phrase" : new _AI_String(ai_jesc(SearchPhrase)),
										"Product" : new _AI_String(ai_jesc(ProductID))
										})
										); };
	/**
	* Commit a single or a set of calls to the other methods. Note that there can only be call to this method per page.
	* @param {Function} CustomerCallback Method to invoke once the predictions are loaded from the server.
	* @return void
	*/
	this.commit = function(CustomerCallback){

		var type = ai_typeOf(CustomerCallback);
		if(type != 'undefined' && type != 'function'){
			ai_log("Input argument 'Callback' for method 'commit' must be a function.");
			return;
		}

		var url = this._generateCallString();
		if(!url){
			return;
		}

		if(AI_DEBUG){
			var msg = "It seems that the script did not load correctly. Check \'Fetch URL\' in Debug Log for details. Copy the \'Fetch URL\' into a browser to see Server Error Response.";
			setTimeout('if(window.__avail_ret === undefined){ ai_log("'+msg+'"); }', 1500);
		}

		ai_log("Fetch URL: " + url);

		if(type == 'function'){
			// bind customer_callback to emark object to get a hold of the callback later
			this.customer_callback = CustomerCallback;
		} else {
			this.customer_callback = function(){ /* Do nothing */ };
		}

		var scr = document.createElement('script');

		ai_f = ai_callback(this._populateResultArray, {bind:this});

		// If IE ...
		scr.onreadystatechange = function(){
		    if(this.readyState == "loaded" || this.readyState == "complete"){
			ai_f();
		    }
		}

		// Everybody else ...
		scr.onload = ai_f;

		scr.id="avail_dynamic_code";
		scr.src=url;
		scr.charset = "UTF-8";

		document.getElementsByTagName('head')[0].appendChild(scr);
	}

	//------- Private methods -----------
	/** @private */
	this.echo = function (Phrase) {
		if( !this._validateNonNullAndNonEmptyString("Phrase", SearchPhrase) ){
				return new Array(new Array(''));
		}

		return this._addToStack( "echo", new _AI_Dic({ "Phrase" : new _AI_String(ai_jesc(SearchPhrase)) }));
	};


	/** @private */
	this._validateNonNullAndNonEmptyStringOrArray = function (_name, _val){
		if(ai_typeOf(_val) != 'string' && ai_typeOf(_val) != 'array'){
			ai_log("Variable '" + _name + "' must be string or array, was: " + _val);
			return false;
		}
		if(_val.length == 0){
			ai_log("Variable '" + _name + "' must have length > 0");
			return false;
		}

		return true;
	}
	/** @private */
	this._validateNonNullAndNonEmptyString = function (_name, _val){
		if(ai_typeOf(_val) != 'string'){
			ai_log("Variable '" + _name + "' must be string, was: " + ai_typeOf(_val));
			return false;
		}
		if(_val.length == 0){
			ai_log("Variable '" + _name + "' must have length > 0");
			return false;
		}

		return true;
	}

	/** @private */
	this._checkAndAddDefaultColumnName = function (_val){
		/*
		* - Check type.
		* - Return val
		*/
		var col_name = 'ProductId';
		var type = ai_typeOf(_val);

		if(type == 'string' || type == 'array'){
			if(_val.toString().replace(/[\s|,]/g,"").length == 0){
				return new Array(col_name);
			} else {
				return _val;
			}
		} else {
			return new Array(col_name);
		}
	}

	/**
	* Add results from dynamic script to user defined variables
	* @private */
	this._populateResultArray = function() {
		var index = 0;
		try{
			if (__avail_ret != undefined && __avail_ret != null){
				for (var i in __avail_ret) {
					this._res_arr[index].update(__avail_ret["ret" + index]);
					index++;
				}
			}
		}
		catch(e){
		}
		this.customer_callback();

		this._nr_calls = 0;
		this._call_arr = new Array(1);
		this._res_arr = new Array(1);

	}

	/**
	* Add a function call to the call stack.
	* All calls in stack are concatenated into a JSON-compatible query string (call string)
	* @private */
	this._addToStack = function ( _method, args) {
		this._call_arr[this._nr_calls] = new CallObj(_method, args);
		this._res_arr[this._nr_calls] = new ResponseObj();

		return this._res_arr[this._nr_calls++];
	}

	/**
	* Create URL and then iterate call stack and create querystring for url.
	* @private */
	this._generateCallString = function (){
		try{
			var last_index = (this._nr_calls - 1);
			if(last_index == -1){
				return null;
			}

			var url = ai_getStaticURL("js");

			url += "&q={";
			for(var i = 0; i < last_index; i++){
				url += '"ret' + i + '":' + this._call_arr[i].toQString() + ",";
			}
			url += '"ret' + last_index + '":' + this._call_arr[last_index].toQString() + "}";
			return url;
		} catch (e){
			alert(e);
		}
	}

}


/**********************************************************
*	Utility functions
**********************************************************/
function ai_getStaticURL(response_type) {

	if(AI_TESTING){
	    AI_SERVICE_HOST = "service.labs.avail.net"
	}
	return ( AI_SERVICE_PROTOCOL + AI_SERVICE_HOST + AI_SERVICE_PATH + AI_CUSTOMER_ID + "/scr?r=" + response_type + "&s=" + ai_getSessionID());
}


/*
	JSON Escape a String
*/
function ai_jesc(string) {
	var type = ai_typeOf(string);
	if(type == 'null' || type == 'undefined'){
		return '""';
	} else if(type != 'string'){
		ai_log("Type unknown for jesc() (JSON Escape) : " + ai_typeOf(type));
	}

	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	ai_meta = {    // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	}

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.

	escapable.lastIndex = 0;
	return escapable.test(string) ?
		'"' + string.replace(escapable, function (a) {
			var c = ai_meta[a];
			return typeof c === 'string' ? c :
				'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' :
		'"' + string + '"';
}

/*
	JSON Escape an Array.
	Also! Type check. If not array, then check if String and return array.
*/
function ai_jesc_array(arr) {
	var type = ai_typeOf(arr);
	if(type == 'array'){
		var ret = new Array(arr.length);
		for(var i = 0; i < arr.length; i++) {
			ret[i] = ai_jesc(arr[i]);
		}
		return ret;
	} else if(type == 'string'){
		return new Array(ai_jesc(arr));
	} else if(type == 'null' || type == 'undefined'){
		return new Array();
	} else {
		ai_log("Type unknown for jesc_array() (JSON Escape Array) : " + type);
	}
}

/*
	Custom type check function since javascript 'typeof' does not handle 'null' and 'Array' properly
*/
function ai_typeOf(obj) {
	var type = typeof(obj)

	if ( type == 'object' ) {
		if(!obj){
			return 'null';
		}
		if (typeof(obj.length) == 'number'){
			return 'array';
		} else {
			return type;
		}
	} else {
		return type;
	}
}

/**
 * From http://onemarco.com/2008/11/12/callbacks-and-binding-and-callback-arguments-and-references/
 *
 * @param {Function} func the callback function
 * @param {Object} opts an object literal with the following
 * properties (all optional):
 * bind: the object to bind the function to (what the "this" keyword will refer to)
 * args: an array of arguments to pass to the function when it is called, these will be
 * appended after any arguments passed by the caller
 * suppressArgs: boolean, whether to supress the arguments passed
 * by the caller.  This default is false.
 */
function ai_callback(func,opts) {
	var cb = function() {
		var args = opts.args ? opts.args : [];
		var bind = opts.bind ? opts.bind : this;
		var fargs = opts.suppressArgs === true ?
			[] : ai_toArray(arguments);
		func.apply(bind,fargs.concat(args));
	}
	return cb;
}

/* A utility function for _ai_callback() */
function ai_toArray(arrayLike) {
	var arr = [];
	for(var i = 0; i < arrayLike.length; i++){
		arr.push(arrayLike[i]);
	}
	return arr;
}

/*
	Get stored sessionid from cookie, or create a new one and store it.
	Addition version 8.5.3
	Find session and tracking code from query string when coming from email recommendation.
*/
function ai_getSessionID(){

	var cookie = null;
	// Start 8.5.3
	var querySessionId = ai_getQuerySession();
	var queryTrackingId = ai_getQueryTracking();
	// End 8.5.3

	// If there is a previously stored cookie, then parse it out
	if (document.cookie.length > 0) {
		var start = document.cookie.indexOf(AI_COOKIE_NAME + "=");
		if (start != -1) {
			start += AI_COOKIE_NAME.length + 1;
			var end = document.cookie.indexOf(";",start);
			if (end == -1){
				end = document.cookie.length;
			}
			cookie = unescape(document.cookie.substring(start,end));
			var activeSessionId = new _AI_String(ai_jesc(cookie));
			// Start 8.5.3
			if (querySessionId != '' && queryTrackingId != '' && querySessionId != activeSessionId){
				// code not completed on emark
				try{
					var url = AI_SERVICE_PROTOCOL + AI_SERVICE_HOST + AI_SERVICE_PATH + AI_CUSTOMER_ID + "/scr?r=js&s=" + cookie;
					var d = new _AI_Dic({});
					d.add('SessionIDFrom', new _AI_String(ai_jesc(querySessionId)));
					d.add('TrackingCode', new _AI_String(ai_jesc(queryTrackingId)));
					d.add('SessionIDTo', activeSessionId);
					url += ("&q={\"ret0\":[\"moveDisplayedProducts\"," + d + "]}");
					var img = new Image();
					img.src = url;
				}
				catch(e){
					ai_log("Could not moveDisplayedProducts ('" + querySessionId + "','" + queryTrackingId + "','" + cookie + "')\nError message: " + e)
				}
			}
			// End 8.5.3
		}
  	}
	
	// Start 8.5.3
	// are we coming from email recommendation and no prior session id
	if (cookie == null && querySessionId != ''){
		cookie = querySessionId;
		var exdate = new Date();
		exdate.setFullYear(exdate.getFullYear() + 1 );

		// Remove the www-part
		if(AI_TOP_DOMAIN.indexOf("www.") == 0){
			AI_TOP_DOMAIN = AI_TOP_DOMAIN.substring(3)
		}

		document.cookie = AI_COOKIE_NAME + "=" + escape(cookie) + ( "; expires=" + exdate.toGMTString() ) + ("; domain=" + AI_TOP_DOMAIN) + ("; path=/");
	}
	// End 8.5.3
	
	// Store session_id, if there is none stored
	if(!cookie){
		cookie = AI_NEW_SESSION_ID;
		var exdate = new Date();
		exdate.setFullYear( exdate.getFullYear() + 1 );

		// Remove the www-part
		if(AI_TOP_DOMAIN.indexOf("www.") == 0){
			AI_TOP_DOMAIN = AI_TOP_DOMAIN.substring(3)
		}

		document.cookie = AI_COOKIE_NAME + "=" + escape(cookie) + ( "; expires=" + exdate.toGMTString() ) + ("; domain=" + AI_TOP_DOMAIN) + ("; path=/");
	}

	return cookie;
}

// Start 8.5.3
/*
	Get query string value for session Id
*/
function ai_getQuerySession(){
	var results = new RegExp('[\\?&]__avail_ms=([^&#]*)').exec(window.location.href);
	if (!results) { 
		return ''; 
	}
	return results[1] || '';
}
/*
	Get query string value for tracking code
*/
function ai_getQueryTracking(){
	var results = new RegExp('[\\?&]__avail_tc=([^&#]*)').exec(window.location.href);
	if (!results) { 
		return ''; 
	}
	return results[1] || '';
}
// End 8.5.3

function ai_getSynchronousCallUrl(method, argnames, argvalues, response_type){
		var url = ai_getStaticURL(response_type);
		var d = new _AI_Dic({});
		for(var i = 0; i < argnames.length; i++){
			d.add(argnames[i], new _AI_String(ai_jesc(argvalues[i])));
		}

		url += ("&q={\"ret0\":[\""+method+"\","+d+"]}");

		return url;
}

function ai_getProtocol(){
	var proto = "";

	try{
		proto = parent.location.protocol + "//";
	} catch (e){
		ai_log("Could not use parent.location.protocol")
		proto = "";
	}

	if(proto == ""){
		try{
			proto = window.location.protocol + "//";
		} catch (e){
			ai_log("Could not use window.location.protocol")
			proto = "";
		}
	}

	if(proto == "file://" || proto == ""){
		ai_log("Using fallback protocol http")
		proto = "http://";
	}

	return proto;
}

function ai_log(msg) {
	if(AI_DEBUG){
		var elem_id = '__avail_log__';

		var elem = document.getElementById(elem_id);

		if(elem){
			elem.innerHTML += "<br>" + msg + "<br>";
		} else {
			var m = "--- Could not get eMark Log output element ---\nPlease create a 'DIV' element with id='" + elem_id + "' somewhere on the page to enable log output.\n\n";
			m += "Also, make sure that the BODY is loaded before calls to eMark script, while in debug mode. \n";
			m += "Else the script can not get hold of the DIV log tag.\n\n";
			m += "Log message:\n" + msg;
			alert(m);
			return;
		}
	}
}

function ai_set_lock(state){
	ai_load_lock = state;
}
function ai_get_lock(){
	return ai_load_lock;
}


// This will run when script is loaded ...
ai_getSessionID();
