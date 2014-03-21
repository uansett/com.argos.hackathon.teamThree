argos.richercontent = new (function() {
	var _self = this;
	var _scene7RequestedBy = "";
	var PARAMETERIZED_EVENTS = ["VIDEO_PLAY_" ,"VIDEO_NAME_", "IMAGE_"];
	
	// PUBLIC
	this.firstCall = true;
	this.assetsLoaded = false;
	this.queue = new Array();
	
	this.scene7LoadAssets = function() {
		var requests = 0;
		var responses = 0;
		var scripts = [
			argos.app.siteAssetsDir + "thirdParty/jQuery/jquery.jcarousel.min.js",
			argos.app.siteAssetsDir + "thirdParty/jQuery/jquery.cycle.all.js",
			argos.app.siteAssetsDir + "thirdParty/scene7/s7carousel.min.js"
		];

		if(!argos.page.isSecure()) {
			$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://argos.scene7.com/is/content/Argos/carousel_viewer_skin\" />");
			for(i=0; i<scripts.length; ++i) {
				requests++;
				$.ajax({
					type : "GET",
					cache : true,
					url : scripts[i],
					success : function() {
						responses++;
						if(responses == requests) {		
							argos.richercontent.assetsLoaded = true;

							// Wrap in doc.ready just for safety
							$(document).ready(function(){
								var queue = argos.richercontent.queue;								
								// Create any queued scene7 objects.
								for(var i=0; i<queue.length; ++i) {
									argos.richercontent.scene7Create(queue[i]);
								}
								
								argos.richercontent.queue = new Array(); // Blank it to reset although probably not required.
							});
						}
					}
				});
			}
		}
	}

	this.scene7Create = function(config) {
		// Not currently using return value anywhere...
		var requester = config["scene7RequestedBy"];
		var $container = this.scene7Container(requester);
		var rc = this;
		var wrapper;
		if(requester == "qvp") {
			config.orientation = "horizontal";
		}
		
		$container.data("argosProduct", this.scene7Product(requester));
		$container.bind("mouseover", function() {
			// Not good but we need some way to know the context from Third-party event.
			rc.scene7RequestedBy(requester);
		});
		
		config.container = $container;
		wrapper = new S7CarouselWrapper(config);
		return wrapper;
	}
	
	this.scene7Insert = function(config) {
		var _rs = this;
		if(!argos.page.isSecure()) {
			if(this.assetsLoaded) {
				// All required files are in place, so create.
				$(document).ready(function() {
					_rs.scene7Create(config);
				});
			}
			else {
				// Add to the queue and wait for scene7LoadAssets success.
				this.queue.push(config);
				if(this.firstCall) {
					this.scene7LoadAssets();
					this.firstCall = false;
				}
			}
		}
	}
	
	this.scene7Container = function(requestedBy) {
		var selector;
		switch(requestedBy) {
			case "pdp" : selector = "#pdpMedia";
				break;
			case "qvp" : selector = ".QvpActivatee";
				break;
			default : selector = "body";
		}
		return $(selector + " .s7carousel-main");
	}
	
	//Invoked by the Scene7 player to tag user actions inside scene7 content
	this.tagging = {}; // Populated in scene7Resources.
	this.tagEvent = function(evtAction, evtSource, evtName) {	    
		if("PopUp" == evtAction){
			evtAction = "Event";
			evtName = "POP_UP_VIEWER_OPEN";
			//evtSource ="";
		}

		if("Event" == evtAction){
			var s=s_gi(s_account);
			s.linkTrackVars = "";
			s.linkTrackEvents="";
			var tagKeys = _getTagKeys(evtName);			
			var saveParams = [];
			_debug("Found "+tagKeys.length+" tags for evtName="+evtName);
			for(var index in tagKeys){
				var tagKey = tagKeys[index];
				var tagValue = _self.tagging[tagKey];
				var tagName="";
				
				_debug(tagKey+"="+tagValue);
				if(tagValue){
					var tokens = tagValue.split(/\|/);
					if(tokens.length ==2){
						tagName=tokens[0];
						tagValue = tokens[1];
					}else{
						tagName=tokens[0];
						tagValue=evtName;
					}
					
					tagValue = _handleParameterizedEventNames(evtName, tagValue);
					saveParams[tagName] = s[tagName];
					s[tagName] = tagValue;
					_debug("s."+tagName+"="+tagValue+"");
					s.linkTrackVars =s.linkTrackVars+","+tagName;
					
					if("events"==tagName)s.linkTrackEvents=tagValue; 
				}
			}	
			_debug(s);			
			s.tl(this,'o',"Scene7 event");	
			_debug("*************************"+s.linkTrackVars);
			for(var index in saveParams){
				s[index] = saveParams[index];
				_debug(">>"+index+"="+saveParams[index]);
			}
			s.linkTrackVars ="";
			s.linkTrackEvents="";
		}
	}

	//this.hasRicherContent = function() {
	//	return true || false;
	//}

	// Creates the popup for larger image and carousel flash objects
	this.open = function(URL,winName,features) {
		var newWindow=window.open(URL,winName,features);

		_closeOtherPopups();

		if(window.focus && newWindow) {
			newWindow.focus();
		}
	}

	// Returns String value representing the context of the activated scene7 content.
	this.scene7RequestedBy = function(set) {
		if(arguments.length > 0) {
			switch(set) {
				case "pdp" : ; // fall through.
				case "qvp" :_scene7RequestedBy = set;
					break;
				default : _scene7RequestedBy = "unknown";
			}
		}
		return _scene7RequestedBy;
	}

	// Get the current product that corresponds to the clicked scene7 content.
	this.scene7Product = function(requester) {
		var requestedBy = requester ? requester : this.scene7RequestedBy();
		var product;
		switch(requestedBy) {
			case "pdp" : product = argos.pdp.product;
				break;
			case "qvp" : product = argos.page.elements.qvp.get(0).Element.product();
				break;
			default : product = {};
		}
		return product;
	}
	

	// PRIVATE FUNCTIONS

	function _debug(msg){	
		//if(true)console.debug(msg);
	}
	
	
	/**********************
	This method replaces a %1 in tagvalue with corresponding parameter from evtName	
	**********************/	
	 function _handleParameterizedEventNames(evtName, tagValue){
	 	var newTagValue = tagValue;
	 	if(tagValue.indexOf("[%1]")>-1 ){
	 		var paramValue = "";
 			for( var index in PARAMETERIZED_EVENTS){
				if(evtName.indexOf(PARAMETERIZED_EVENTS[index])==0){
					paramValue = 	 evtName.replace(PARAMETERIZED_EVENTS[index], "");
 				}
	 		}
	 		if(paramValue != ""){
	 			newTagValue = tagValue.replace("\[%1\]", paramValue)+":";
	 		}
	 	}
	 	_debug("newTagValue: "+newTagValue);
	 	return newTagValue
	 	
	 }
	/**********************
	This method retrieves all keys of the form 
	SCENE7_TAGGING_CUSTOM_IMAGE_<evtName>
	SCENE7_TAGGING_CUSTOM_EVT_<evtName>
	with or without a suffix of type _1 till _100 ( ie SCENE7_TAGGING_CUSTOM_IMAGE_<evtName>_45 )	
	**********************/
	function _getTagKeys(evtName) {
		var tagKeys = [];
		var newEvtName = "";

		//if(newEvtName ==""){
			//If no parameterized event is found use default
			//newEvtName = "SCENE7_TAGGING_CUSTOM_EVT_"+evtName;
		//}
		if(_scene7RequestedBy == "qvp"){
			newEvtName = "SCENE7_TAGGING_CUSTOM_EVT_QUICKVIEW_"+evtName;		
		}else{
			newEvtName = "SCENE7_TAGGING_CUSTOM_EVT_"+evtName;
		}
	
		var tagValue = _self.tagging[newEvtName];
	
		if(tagValue == null){
			for( var index in PARAMETERIZED_EVENTS){
				if(evtName.indexOf(PARAMETERIZED_EVENTS[index])==0){
					newEvtName = "SCENE7_TAGGING_CUSTOM_EVT_"+PARAMETERIZED_EVENTS[index]+"[%1]";
					break;
				}
			}
			tagValue = _self.tagging[newEvtName];
		}		
	
		 if(tagValue){
			tagKeys[0] = newEvtName;
		 }
	
		 for(var i =1; i<=100; i++){
			var tagKeyIndexed = newEvtName+"_"+i;
			if(!_self.tagging[tagKeyIndexed]){
				break;
			}
			tagKeys[tagKeys.length]  = tagKeyIndexed;
		 }
	
		return tagKeys;  
	}

	function _closeOtherPopups() {
		// Add functionality here to close any open popups and LBs that we don't want to remain open.
		if(argos.popups) {
			argos.popups.close();
		}
	}

});


/* Legacy, third-party (Flash) calls viewerClickAction and EventInS7Content instead of argos.richercontent scoped functions directly */
function viewerClickAction(assetName) {
	// Called by scene7 Flash content.
	// Note: Investigation indicates this function is called via a try/catch with silent failure, by the Flash object. 
	//       This means any JS error contained within this function will not show as an error, and be very hard to locate!!
	var product = argos.richercontent.scene7Product(); 
	var storeId = argos.app.storeId;
	var partNumber = product.number.replace('\/', ''); 
	var shortDescription = product.shortDescription.replace('"', '\"');
	var title = product.title.replace('"', '\"');
	var data = "?storeId=" + storeId + "&assetName=" + assetName + "&partNumber=" + partNumber + "&shortDescription=" + shortDescription + "&title=" + title;
	var url = "/webapp/wcs/stores/servlet/Scene7RicherContentPopup" + data;
	var winName = "newRicherContentWindow";
	var features = "width=855,height=750,directories=no,location=no,menubar=no,scrollbars=yes,toolbar=no,status=no,resizable=yes,top=0,left=0"; 
	argos.richercontent.open(url, winName, features);
}
	
function EventInS7Content(inAssetSetName, inEvent, inAssetName, inEventName) {
	if("PopUp" == inEvent){
	    viewerClickAction(inAssetName);
	    return;
	}
	argos.richercontent.tagEvent(inEvent, inAssetSetName, inEventName);    	
}					
