argos.stockChecker = new (function() {
	
	this.init = function () {
			// Can call this from page.js eventually
			_setUpLBStockChecker();
	}
	
	function _setUpLBStockChecker() {
		if(typeof argos.pdp.inGiftMode !== "undefined" && argos.pdp.inGiftMode === true) return;

		var postCodeFieldDefaultMessage = argos.pdp.lightBoxStockCheckTextBox; // Var from getResource.jspf
		var postCodeFieldDefaultMessage2 = "Postcode";
		var postCodeFieldDefaultMessage3 = "Enter postcode";
		
		var deliveryDetails = $(".stockChecker")[0];
		var homeContainer= $("li.home")[0];
		var target;
		if(typeof argos.pdp.isaltmServiceEnabled !== "boolean") return;
		if(typeof argos.pdp.buyOrReservable !== "boolean") return;
		if(typeof argos.pdp.outOfStockEmailable !== "boolean") return;
		var showPostCode=true;
	 	if(deliveryDetails === undefined && !argos.pdp.outOfStockEmailable) return;		
		
		if(argos.pdp.isaltmServiceEnabled && argos.pdp.buyOrReservable) {
			showPostCode = true;
		}
		else if(argos.pdp.outOfStockEmailable) {
			showPostCode = false;
		}
		else {
			// in the case that !buyOrReservable && !outOfStockEmailable
			return;
		}
		
		$(deliveryDetails).find("span.priceStockChecker").remove();
	
		
	 	var html = (function(){	
	 				 		
	 		if(showPostCode) {
	 			target = $(deliveryDetails);
		 		var postCodeValue = getTownNameFromCookie();
		 		if(postCodeValue == "")
		 			postCodeValue = getPostCodeFromCookie();
		 		var postCodeFieldValue = postCodeValue;
		 		if(typeof postCodeValue == "undefined" || postCodeFieldValue == "undefined" || postCodeFieldValue ==""){
		 			postCodeFieldValue=postCodeFieldDefaultMessage;
		 		}		 
		 		
		 		var s ='';
		 		s +=		'<h2>Check stock in your area</h2>';
		 		s +=		'<input type="hidden" name="checkStock" value="true">'; 
		 		s +=		'<input type="hidden" name="backTo" value="product">';	 
		 		s +=		'<input type="text" id="qasSearchTerm" class="text" name="qasSearchTerm" value="'+postCodeFieldValue+'"/>';
				s +=		'<input type="submit" id="pdpCheckStockGo" class="button" value="Go" />';
		 	}
		 	// outOfStockEmailable
		 	else {
		 		target = $(homeContainer);
		 		var s ='';
 				s +=		'<span class="emailMeBackInStock">Email me when back in stock</span>';
		 		
		 		$("#deliveryInformation").removeClass("isaltNoDisplay");
			 	$("#deliveryInformation").addClass("isaltDisplay");	
			 	$(".noDelivery").show();
		 	}
	 		return s;
	 	}());
	 	
	 	$(deliveryDetails).addClass("hasStockChecker");
	 	
	 	$(target).append(html);
	 	
	 	
	 	if(showPostCode) {
	 		
	 		$("input#qasSearchTerm").keydown(function(event){
				if(event.keyCode === 13) {
					$("#checkStockGo").click();
					return false;
				}
			});
	 		
			$("input#qasSearchTerm").focus(function() {
				if( this.value == postCodeFieldDefaultMessage ) {
					this.value = "";
				}
			}).blur(function() {
				if( !jQuery.trim(this.value).length ) {
					this.value = postCodeFieldDefaultMessage;
				}
			});
			
		}
		else {
			//$("li.emailMeBack a.emailMeBackInStock").bind("click", emailMeWhenBackInStock_onClick);
			//$("li.emailMeBack a.emailMeBackInStock").bind("click", LightBoxStockCheckerTracking.trackAddToBasketPopup);
		}
	}
	
	
   function getPostCodeFromCookie() {
	    var val = argos.cookie.get("PostCodeSessionCookie");
    	//val = unescape( val );
    	if( val == null )
    		val = "";
    	else if(typeof val === "undefined")
			val = "";
		
		// CR528 Trolley Redesign - phase 2			
		// The first postCode is the one entered previously for stock availability checking.
		// The second postCode is the one from the signed in user's account.
		var postCodes = val.split( "%2C" );
		var postCode = postCodes[0];
		if( postCode == null || postCode == "" )
			postCode = postCodes[1];
    	return postCode;
    }
	    
	function getTownNameFromCookie() {
	    var val = argos.cookie.get("PostCodeSessionCookie");
    	//val = unescape( val );
    	if( val == null )
    		val = "";
    	else if(typeof val === "undefined")
			val = "";
		
		var postCodes = val.split( "%2C" );
		var townName = "";
		if(postCodes.length == 3)
			townName = postCodes[2];
		
    	return townName;
    }

});