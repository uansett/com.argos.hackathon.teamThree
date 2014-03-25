argos.detectDevice = (new function() {
	
	var config = {
		promptExists : "",
		cookie : "AppPrompt",
		cookieExists : false,
		appPromptExists : false,
		cookieDate : "",
		cookieExpiry: "",
		cookieExpiryPeriod : "",
		cookieOverrideDate : "",
		cookieApplyOverride : false,
		currentDate : _setToday(),
		expiryDate : _setToday(),
		closebuttonText : ""
	}
	
	var _global = {
		retrieveCookieSettings : function() {
		
			var requestValues = _permitAjaxRequest();
			if(requestValues){
				$.ajax({
					url : "/webapp/wcs/stores/servlet/AppPromptDisplay?storeId=" + argos.app.storeId + "&langId=" + argos.app.langId,
						success : function(html) {
						argos.page.elements.body.append(html);
						_cookieProcess();
					}
				});
			}
		}	
	}
	
	/* Public methods
	 *****************/
	this.isSecure = function() {
		return window.location.protocol == "https:";
	}
	
	this.init = function(item) {
		_global[item]();
	}
	
	/* Private
	 ***********/
	
	function _setToday(){
		var today = new Date();
	//	today.setHours(0,0,0,0);
		return today;
	}
	
	function _parseCookie(){
		//using the values stored in the cookie 
		config.cookieExists = true;
		var strCookie = argos.cookie.get(config.cookie);
		var dateValues = strCookie.split("|");
		config.cookieDate =  new Date(Date.parse(dateValues[0]));
		config.cookieExpiry =  new Date(Date.parse(dateValues[1]));
		config.cookieExpiryPeriod = _daysDiff(config.currentDate,config.cookieExpiry);
	}
	
	function _permitAjaxRequest(){
		var result = false;
		if(argos.cookie.get(config.cookie) == null){
			result = true;	
		} else {
			_parseCookie();
				
			if(_daysDiff(config.cookieDate,config.currentDate)>=1){
				result = true;	
			} 
		}
		return result;
	}
	
	function _daysDiff(firstDate,lastDate) {
		var lastDate = new Date(Date.parse(lastDate));
		lastDate.setHours(0,0,0,0);
		var firstDate = new Date(Date.parse(firstDate));
		firstDate.setHours(0,0,0,0);
		return (Math.round((lastDate.getTime() - firstDate.getTime()) / (1000*60*60*24)));
	}
	
	function _checkForOverrideDate(){
		if(argos.app.deviceAppPromptOverrideDate != 0){
			config.cookieOverrideDate = argos.utils.dateFromString(argos.app.deviceAppPromptOverrideDate);
			if(((_daysDiff(config.cookieDate,config.cookieOverrideDate)>=1)) && ((_daysDiff(config.cookieOverrideDate,config.currentDate)>=0))) {
				config.cookieApplyOverride =  true;
			}
		}
	}
	
	function _cookieProcess(){
		
		var currentDate =  new Date(Date.parse(config.currentDate));
		var expiryDate =  new Date(Date.parse(config.expiryDate));
		config.appPromptExists = argos.app.deviceAppPromptExists;
		config.closebuttonText = argos.app.deviceAppPromptCloseButtonText;
		

	//	currentDate.setDate(25);
		
		if(config.cookieExists){
			_checkForOverrideDate();
		}
		
		//set default values 
		var cookieValue = currentDate + "|"+expiryDate;
		// message to display
		
		promptUser = false;
	
	
		if(config.appPromptExists){		
			if(config.cookieApplyOverride || !config.cookieExists) {
				promptUser = true;
				config.cookieExpiryPeriod = argos.app.deviceAppPromptExpPeriod;
				expiryDate.setTime(currentDate.getTime()+(argos.app.deviceAppPromptExpPeriod*24*60*60*1000));
			} 
		} else {
			cookieValue = expiryDate + "|"+expiryDate;
		}
	
		//document.cookie = "ambo=1";
		if(promptUser){
				var html = $("#lightBoxDisplayAppMessages");
                var lb = argos.page.elements.lightbox;
                lb.setContent(html);
                lb.addButton({"text":config.closebuttonText});
                _buttonTagging();
                
                if(argos.cookie.get("ambo") == 1){
                	$("#lightBoxDisplayAppMessages").addClass("mobileView");
        		}
          
                $("#lightBoxDisplayAppMessages .closeButton").bind("click", function() { 
					lb.close(); 
				});
                                
                $(".LightboxActivatee .button,.LightboxActivatee .closeButton,.LightboxActivatee button.close").bind("click", function() { 
                   	argos.cookie.set(config.cookie,cookieValue,config.cookieExpiryPeriod);
               	});
                
                $(".LightboxOverlay").unbind("click");
                lb.position();
             
                s.prop25 = "ar:devicedetection:displayed:";
                var s_code=s.t();
            
                lb.open();
                
                var timeToShift;
                $(window).resize(function() {
                    clearTimeout(timeToShift);
                    timeToShift = setTimeout(_shiftAppPrompt, 50);
                });
                
              
		} else {
			argos.cookie.set(config.cookie,cookieValue,config.cookieExpiryPeriod);
		}
	}
	
	function _shiftAppPrompt() {
	    $(".LightboxOverlay").css("width","100%").css("height","100%"); 
	  
	    var offsetWidth = (($(".LightboxOverlay").width()/2)-($("#lightBoxDisplayAppMessages").width()/2));
	    var offsetHeight = (($(".LightboxOverlay").height()/2)-($("#lightBoxDisplayAppMessages").height()/2));
	    
	    if(offsetWidth>=0){
   	    	$(".LightboxActivatee").css("left", offsetWidth+"px");
	    }
	    
	    if(offsetHeight>=0){
   	    	$(".LightboxActivatee").css("top", offsetHeight+"px");
	    }
	    
	}
	
	function _buttonTagging(val){
		$("#lightBoxDisplayAppMessages .closeButton").bind("click", function() { 
			argos.tracking.set(this, "Device App Prompt", {
				prop25:'ar:devicedetection:nothanks:'
			});
		});
		$(".LightboxActivatee button.close").bind("click", function() { 
			argos.tracking.set(this, "Device App Prompt", {
				prop25:'ar:devicedetection:close:'
			});
		});
		$("#lightBoxDisplayAppMessages .acceptButton").bind("click", function() { 
			argos.tracking.set(this, "Device App Prompt", {
				prop25:'ar:devicedetection:downloadnow:'
			});
		});
		
	}
	
});

/* Initialise global site features
 *********************************/
$(document).ready(function() {
	var initialise = new Array("retrieveCookieSettings");
	for(var i=0; i<initialise.length; ++i) {
		argos.detectDevice.init(initialise[i]);
	}
});