/*
 * May need to be extracted if used elsewhere
 * *********************************************/
argos.products = new (function() {
	var _classes = {
		Carousel : argos.classes.Carousel,
		Element: argos.classes.Element
	}

	var _helpers = {
		unique : argos.utils.generateUniqueStr
	}

	
	// CLASSES
	function Price(data, selectors) {
		var _main = data["main"] ? data.main.trim() : "";
		var _findFigure = /[^\d]*(\d*\.\d{2}).*/;
		var _was = data["was"] ? data.was.trim() : "";
		var _save = data["save"] ? data.save.trim() : "";
		var _symbols = data["symbols"] ? data.symbols : new Array();
		var _addCurrency = "&pound;$1";
		
		this.now = "<span class=\"main\">" + _main.trim().replace(_findFigure, _addCurrency) + "</span>";
		this.symbols = _symbolsToHtml(_symbols);
		this.was = _was ? "<span class=\"wasPrice\">was " + _was.replace(_findFigure, _addCurrency) + "</span>" : "";
		this.save = _save ? "<span class=\"savePrice\">" + _save.replace(_findFigure, _addCurrency) + "</span>" : "";


		function _symbolsToHtml(symbols) {
			var html = "";
			for(var i=0; i<symbols.length; ++i) {
				html += "<img class=\"" + symbols[i]["class"] + "\" src=\"" + symbols[i]["src"] + "\" alt=\"" + symbols[i]["alt"] + "\" />";
			} 
			return html;
		}
	}
	
	function Image(src, href, text) {	
		function _html() {
			return "<img alt=\"" + text + "\" src=\"" + src + "\" />";
		}
		
		this.linkedHtml = function() {
			return "<a href=\"" + href + "\" title=\"more details on " + text + "\">" + _html() + "</a>";
		}
		
		this.html = _html;
	}
});

// Custom sorting functions for Argos products.
argos.products.sorting = {
	titleAToZ : function(a, b) {
		var titleA = $(a).find(".title").text();
		var titleB = $(b).find(".title").text();
		if(titleA < titleB) return -1;
		if(titleA == titleB) return 0;
		if(titleA > titleB) return 1;
	},

	priceLowToHigh : function(a, b) {
		// If the product has .price .main stucture, that's what we want. Else, just try getting price from dd.price
		var priceA = parseFloat($(a).find(".price .main, dd.price").text().replace(/[£|&pound;|\s]/mg, ""));
		var priceB = parseFloat($(b).find(".price .main, dd.price").text().replace(/[£|&pound;|\s]/mg, ""));
		priceA = priceA.slice(0, priceA.indexOf(".") + 3);
		priceB = priceB.slice(0, priceB.indexOf(".") + 3);
		if(priceA < priceB) return -1;
		if(priceA > priceB) return 1;
		if(priceA == priceB || isNaN(priceA) || isNaN(priceB)) return 0;
	},

	ratingHighToLow : function(a, b) {
		var ratingA = Number($(a).find(".rating").text());
		var ratingB = Number($(b).find(".rating").text());
		if(ratingA > ratingB) return -1;
		if(ratingA == ratingB) return 0;
		if(ratingA < ratingB) return 1;
	},

	reversed : function(a, b) {
		// This doesn't work in IE. Use Array.reverse() if possible.
		return 1;
	}
}

argos.products.components = new(function(){

	var _classes = {
		Collection: argos.classes.Collection
	}


	// this is populated page builds (see method below)									
	var _containersProductComponentLimit = [];
	
	// methods called as page builds
	this.setContainerProductComponentLimit = function(selector,maxlimit) {
		_containersProductComponentLimit.push([selector,maxlimit]);
	}
		
	// this method is used to examine list of containers we are working with
	this.checkContainerProductComponentLimit = function(selector) {
		var result = false;
		$(_containersProductComponentLimit).each(function () {
            if (this[0] == selector) {
            	result = true;
            }
        });
		return result;
	}
	
	this.getProductComponentsByArray = function(partnumbers,selector,viewname,options) {
		// stop if partnumbers are deduped
		var items = $.makeArray(partnumbers);
		if(!items.length){
			$(selector).hide();
			return;
		}	
		
		var url = "/webapp/wcs/stores/servlet/"+viewname;	
		var data = "storeId="+argos.app.storeId+"&langId="+argos.app.langId;

		// by individual partNumbers
		//	data += "&partNumber=" + partnumbers.join("&partNumber=");
		// using CSV format to ensure correct return order
		data += "&partNumberCsv="+partnumbers.join(",");
		$.ajax({
			url: url,
			dataType: "html",
			type: "get",
			data: data,
			success: function(html){
				_insertProductComponents(html,selector,options);
			},
			error: function(){
				// if getter fails, just return out
				return;
			}
		});
		
		
	}

	function _insertProductComponents(html,selector,options) {
		var config = {
			quicklink : false,
			appendFunction : null,
			preAppendFunction : null,
			postAppendFunction : null,
			trackingCode : null
		}
	
		if(typeof options === "object"){
			config.quicklink = (typeof options.quicklink === "boolean") ? options.quicklink : config.quicklink;
			config.appendFunction = (typeof options.appendFunction=== "function") ? options.appendFunction : config.appendFunction;
			config.preAppendFunction = (typeof options.preAppendFunction=== "function") ? options.preAppendFunction : config.preAppendFunction;
			config.postAppendFunction = (typeof options.postAppendFunction=== "function") ? options.postAppendFunction : config.postAppendFunction;
			config.trackingCode = (typeof options.trackingCode=== "string") ? options.trackingCode : config.trackingCode;
		}
	
		
		if(html.length) {			
			var c = $(selector);
			// wrap the supplied products to ensure find operation works
			var h = $("<div class='products' />").append(html);
			var hProducts = h.find("dl.product").addClass("returnedComponent");
			var productsToAppend = new _classes.Collection();
			
			// run pre functions 
			_runAppendAndPrePostFunctions(config.preAppendFunction(selector));
			// if we have valid products and container is in place then proceed
			var productsToAdd = _calculateProductsToAdd(hProducts.length,selector);
			if(productsToAdd>0){
				// push up to allowed number of products
				for(var i=0; i < productsToAdd; i++) {
					
				
					productsToAppend = productsToAppend.add(hProducts[i]);
				}
				if(config.appendFunction){
					//send products back to page specific script for insertion
					_runAppendAndPrePostFunctions(config.appendFunction(selector,productsToAppend));
				} else {
					c.append(productsToAppend);
				}
			
			}
			// run post append functions 
			_runAppendAndPrePostFunctions(config.postAppendFunction(selector,config.trackingCode));		
		
		} else {
			//remove if no products inserted
			$(selector).hide()
		}
	}
	
	// allows retrieved products to be added to container if still within MAX_LIMIT
	// will not alter products provided on page load
	function _calculateProductsToAdd(productcount,selector) {
		var existingProducts = $(selector + " .product");
		var productsToAdd = 0;	
		//find MAX_LIMIT for this container
		$(_containersProductComponentLimit).each(function () {
            if (this[0] == selector) {
      //    	alert("!!!"+this[0]+ " max limit is " + this [1] + ", there are " + existingProducts.length + " exisitng products and " + productcount + " from avail");
				//how many have been supplied + exist already... up to the max limit set
				productExcess = parseInt(this[1]) - (existingProducts.length + productcount);
				productsToAdd = (productExcess < 0) ? productcount + productExcess : productcount;
			}
       });
       return productsToAdd
	}	
	
	function _runAppendAndPrePostFunctions(functionToRun,productsToAppend){
		if(functionToRun != null){
			$(functionToRun).each(function () {
				this();
			});
		}
	}
	
	
});

/* PDP
 *******/
argos.pdp = new (function() {
	var _pdp = this;
	var _verticallyClipContent = argos.utils.verticallyClipContent;
	// var _getMaxHeight = argos.utils.getMaxHeight;
	var _cleanHtml = argos.utils.cleanHtml;
	var _colourPickerItemsMax = 8; /* const */
	var _fabricPickerItemsPerRow = 9; /* const */
	var _pickerBubbleSpacer = 5; /* const */
	var _standardCarouselSelectors = ["#pdpAlternativeProducts","#pdpAlsoInThisRange","#pdpAdditionalItems","#pdpEssentialExtras"];
	var _products = argos.products.components;
	var _dedupe = argos.utils.deduplication;
	var _comments =  argos.utils.comments;
	
	var _deduplicationSelectorArray	= [];
	var _potentialContainersToHideArray = [];
	// one click Avail values
	var _oneclickFormDelaySubmit = true;
	var _productOneClickAvailPrice = "";
    var _productOneClickAvailPartnumber = "";
	var _productOneClickAvailCurrency = "";
	var _productOneClickAvailUserId = "";
	var _productOneClickAvailUniqueUser = "";
	var _paymentFormDelaySubmit = true;
	
	var _classes = {
		Carousel : argos.classes.Carousel,
		Element: argos.classes.Element
	}
	
	
	this.init = function () {
		$("body").addClass("jsEnabled");
		_setEvar53();
		_setUpJsOnlyChanges();
		this.product = _setUpProductData();
		// Must happen before product to product.
		if(argos.page.elements.body.hasClass("ppp")) {
			_setUpPppProductData();
		}
		else {
			_setUpPdpProductData();			
		}
		//7394 fix?
		try{
		_ecomFulFilment();
		}catch(e){
			console.log("error found in _ecommFulfilment: " + e);
		}
		
		// Create required Activatees
		argos.page.elements.checkStockActivatee = new argos.classes.CheckStockActivatee();
		
		// product to product 
		if(_pdp.productToProductActive){
		
			//set partnumber up
			var currentPartnumber = $("#pdpProduct .partnumber").text();
			this.pdpCurrentPartnumber = currentPartnumber.replace("/","");
		
			// see notes in argos.utils.deduplication as to correct param form (4th item in array specifies an attribute value to target)
			_deduplicationSelectorArray = [["#sizeSelectHolder","option.sizeOption","option.sizeOption","rel"],
										[".pdpPicker",".partnum",".pickerItem"], 
										["#serviceDeliveryOptions",".partnum","li.productOption"], 
										["#pdpEssentialExtras",".product .partnum","dl.product"], 
										["#pdpAdditionalItems",".product .partnum","dl.product"],
										["#pdpAlsoInThisRange",".product .partnum","dl.product"],
										["#pdpAlternativeProducts",".product .partnum","dl.product"]];
			_dedupe.removeTargetedElementsFromPage(_deduplicationSelectorArray);
			//hide containers that are empty and not set up to receive new products
			_hideThisContainerIfEmpty(".pdpPicker",".pickerItem");
			_hideThisContainerIfEmpty("#serviceDeliveryOptions","li.productOption");
			_hideThisContainerIfEmpty("#pdpFabricPicker","li.fabricBandListItem");
			_hideThisContainerIfEmpty("#pdpAlsoInThisRange","dl.product");
			_hideThisContainerIfEmpty("#pdpAdditionalItems","dl.product");
			_hideThisContainerIfEmpty("#pdpAlternativeProducts","dl.product");

		}
		// end of product to product 
		
		argos.page.breadCrumb.init("productdetails");
		$("#breadcrumb ul").find("li:eq(1)").addClass("noliststyle");
		argos.stockChecker.init();
		_setUpPrint();
		_setUpSocialMedia();
		_setUpBriefProductDetails();
		_setUpProductButtons();
		_oneClick();
		_setUpCarouselFor(_standardCarouselSelectors);
		_correctEssentialExtrasHeight();
		// TODO: _experimentalMicroformat();
		_setUpColourPicker();
		//_createProductActivators();
	
	}
	
	this.carousels = {};	
	this.product = {};
	
	// avail values for one click submission
	this.productToProductOneClickUserSetup = function(userID,uniqueId){
		_productOneClickAvailUserId = userID;
		_productOneClickAvailUniqueUser = uniqueId;
	}
	
	this.productToProductOneClickProductSetup = function(partnum,price,currency){
		_productOneClickAvailPartnumber = partnum;
		_productOneClickAvailPrice = price;
		_productOneClickAvailCurrency = currency;
		
	}
	
	// product to product - 624a
	this.requestProducts = function(partnumbers,selector,viewname,title,quicklink,trackingCode){	
		// proceed only if partnumbers have been received and correct container is in place
		if(partnumbers.length && _ensureContainerToAddTo(selector,title)){
			// get products - param order - supplied partnumbers, main selector, precise selector for product insertion, tab title, apply quick link, functions to run before and after append	
			
			_products.getProductComponentsByArray(_dedupe.getUniqueValues(partnumbers),selector,viewname,{
				quicklink : quicklink,
				appendFunction : _appendProducts,
				preAppendFunction : _preProductsAppend,
				postAppendFunction: _postProductsAppend,
				trackingCode: trackingCode
			});
			
					
		} else {
			// this will remove an empty targeted container after dedupe
			// if Avail returns no additional products	
			_hideThisContainerIfEmpty(selector,"dl.product");
		}
	}
	
	this.fulfilment = {
	        storeFound: function(store) {
	            // TODO: Not getting store value from FindStoreActivatee code yet.
	            $("#pdpForm").append("<input type=\"hidden\" name=\"store\" value=\"" + store + "\" />");
	            $("#stockReserve").show();
	        }
	    }
	this.setUpTabs = function() {
		_setUpTabs();
	}
	
	this.setUpActivators = function() {
		_createProductActivators();
	}
	
	this.updateOOSAlternatives = function() {
		// replace alternatives section with the correct one
		// if product is out of stock then move alternatives section up otherwise unhide one at the bottom
		var stockLevel = parseInt($('#alternativesFlag').html());				
		
		if($('#alternativeArea1').length) {
    		$('#alternativeArea1').show();
		}

		if(stockLevel <= 0) {  
		    if($('#alternativeArea1').children().length > 0)
			{
				$('#alternativeArea1').children().appendTo($('#alternativeArea2'));
				$('#alternativeArea1').hide();
				$('#alternativeArea2').show();
			}
		} else 
		{
			if($('#alternativeArea2').children().length > 0)
			{
				$('#alternativeArea2').children().appendTo($('#alternativeArea1'));
				$('#alternativeArea2').hide();
				$('#alternativeArea1').show();
			}
		}      
	}
	
	// PRIVATE
	
	function _setUpProductData() {
		var title = $("#pdpProduct h1").text();
		return {
			number : $("#pdpProduct .partnumber").text().replace("/",""),
			pdp : location.href,
			shortDescription : title, // currently same as title.
			title : title
		}
	}
	function _ecomFulFilment() {
		
		var ocContent, ocTarget;
		if (document.getElementById('stkDetailsContainer')) {
			ocContent = document.getElementById('stkDetailsContainer');
			ocTarget = document.getElementById('stkDetailsLink').href;

		var loading = "<div class='ajaxLoadingFrame'></div>";
		ocContent.innerHTML = loading;
		};	
		$.ajax({
			url: ocTarget,
			dataType: "html",
			error: function () {
		    	// Deal with error here
			},
			success: function (html) {
				//alert(html);
				$(ocContent).empty();
				$(ocContent).append(html);
				if ($(ocContent).find('.product_unavailable').length) {
					$('#fulfilment').addClass('product_unavailable');
				}
				// Update out-of-stock alternatives
				argos.pdp.updateOOSAlternatives();
				//$(ocContent).append(html);
				argos.messages.createActivators(ocContent);
			},
			complete: function(){
				_setUpTabs();
				new argos.classes.LightboxActivator(document.getElementById('findStock'), argos.page.elements.lightbox);
				_setUpBrowser();
			}
		});	
	}
	
	function _setUpTabs(){
		// JavaScript Document for tabs
			//When page loads...
			$(".tab_content").hide(); //Hide all content
			//$("ul.tabs01 li:first a").css('border-bottom','none');
			$("ul.tabs01 li:first a").addClass("active1").show(); //Activate first tab

			$(".tab_content:first").show(); //Show first tab content

			$(".tab_content01").hide(); //Hide all content
			$("ul.tabs02 li:first a").addClass("active1").show(); //Activate first tab
			$(".tab_content01:first").show(); //Show first tab content
			
			//On Click Event
			$("ul.tabs01 li a").click(function() {
				$("ul.tabs01 li a").removeClass("active1"); //Remove any "active" class
				$(this).addClass("active1"); //Add "active" class to selected tab
				$(".tab_content").hide(); //Hide all tab content

				var activeTab = $(this).attr("href"); //Find the href attribute value to identify the active tab + content
				activeTab = activeTab.substring(activeTab.indexOf("#"));
				$(activeTab).show(); //Fade in the active ID content
				
				// Update out-of-stock alternative products
				argos.pdp.updateOOSAlternatives();
				
				return false;
			});
			$("ul.tabs02 li a").click(function() {

				$("ul.tabs02 li a").removeClass("active1"); //Remove any "active" class
				$(this).addClass("active"); //Add "active" class to selected tab
				$(".tab_content01").hide(); //Hide all tab content
				
				var activeTab = $(this).attr("href"); //Find the href attribute value to identify the active tab + content
				activeTab = activeTab.substring(activeTab.indexOf("#"));
				$(activeTab).show(); //Fade in the active ID content
				
				// Update out-of-stock alternative products
				argos.pdp.updateOOSAlternatives();
				
				return false;
			});
			
			var $pcText = $("#postCodeCheck");
			var pcInitTextValue = $pcText.val();
			
			$pcText.focus(function() {
				if(pcInitTextValue == this.value){
					this.value = '';
				}
				this.select();
			});
			
			argos.tracking.pdp.fulfilmentTabs();
			argos.tracking.pdp.trolleyAdd_collect();
			argos.tracking.pdp.trolleyAdd_local_collect();
			argos.tracking.pdp.trolleyAdd_deliver();
			argos.tracking.pdp.oneClickLoaded();
			argos.pdp.setUpActivators();
	}
	
	function _setUpBrowser() {
		var reset = function() {
            setTimeout(function(){$('.Element').css('top','13px')},100)
        }
        if ($.browser.mozilla) {
            reset();
            $('#findStock').bind('click', function() {
                reset();
            });
        }
	}	
	function _createProductActivators () {
		argos.page.elements.checkStockActivatee = new argos.classes.CheckStockActivatee();
	
		$("#checkStockGo, .emailMe, #pdpCheckStockGo").each(function () {
			new argos.classes.CheckStockActivator(this, argos.page.elements.checkStockActivatee);
		});
	}
	
	// Current PDP page details.
	function _setUpPdpProductData() {
		var title = $("#pdpProduct h1").text();
		_pdp.product = {
			number : $("#pdpProduct .partnumber").text().replace("/",""),
			url : location.href,
			shortDescription : title, // currently same as title.
			title : title,
			image : $("#mainimage").attr("src")
		}
	}
	
	// Product Purchase Page (Add To Trolley variant)
	function _setUpPppProductData() {
		var $product = $("#addToTrolley .trolleyProduct");
		var title = $product.get(0).firstChild.nodeValue;
		_pdp.product = {
			number : $(".catnumber", $product).text().replace("/",""),
			url : location.href,
			shortDescription : title, // currently same as title.
			title : title
		}
	}
	
	// actions to take place after products get appended as part of callback
	function _postProductsAppend(selector,trackingCode){
		_setUpProductButtons();
		_applyClickLogging(selector,trackingCode);
		//TODO: _showAndSetupQuicklinkToContainer(selector);
		_correctEssentialExtrasHeight();
		 _pdpEssentialExtrasChanges();
		//hide container if it has no products after avail run
		_hideThisContainerIfEmpty(selector,"dl.product");
		
		// Target .addToCart on products returned from Avail.
		argos.tracking.pdp.relatedItems(".returnedComponent");
	}
	
	// specific container styling and markup alterations 
	function _pdpAdditionalItemsChanges() {
		var e = $("#pdpEssentialExtras");
		var a = $("#pdpAdditionalItems");
		var eProducts = e.find(".product");
		var aParent = a.parents(".pdpRelatedInformationWrapper");
		var eClasses = "essentialExtras_0 essentialExtras_1 essentialExtras_2 essentialExtras_3";
	
		// check if wrapper div is in place
	//	if(aParent.length) {
			$(aParent).removeClass(eClasses);
			// adjust classes based on adjusted essential extras
			if(eProducts.length){
				e.removeClass("withoutAdditionalItems").addClass("withAdditionalItems");
				a.addClass("withEssentialExtras");
				aParent.addClass("essentialExtras_"+eProducts.length);
			} else {
				 e.remove();
				 aParent.addClass("essentialExtras_"+eProducts.length);
				 a.removeClass("withEssentialExtras").addClass("withoutEssentialExtras");
				 $("#relatedInformation").removeClass("hideRelatedItems");
		}
	}
	
	// will remove any container if contains no product components
	function _hideThisContainerIfEmpty(selector,item) {
		var c = $(selector);
		var items = c.find(item);
		if(items.length == 0){
			c.hide();
		}
	}
	
	function _ensureContainerToAddTo(selector,title){
		// make sure the container has been specified with a max limit, or return out
		if(!_products.checkContainerProductComponentLimit(selector)) { 
			return; 
		}
		// if page load has only provided substitute place holders, these need to be replaced with proper containers (hidden on load)
		var c = $(selector);
		var cID =	(selector.replace("#",""));	
		var	cHTML = "<div class='pdpRelatedInformation section' id="+cID+"><div class='content'><div class='productsWrapper'><h2><span>"+title+"</span></h2><div class='productContent'></div></div></div></div>";
		
		var result = false;
		// will locate matching container ID
		if(c.length){
			// will establish if we need to replace the substitute or leave alone
			if(c.hasClass("pdpRelatedInformationSub")){
				c.replaceWith(cHTML);
			//	c = $(selector).css("visibility","hidden");
			}
			result = true;		
		} 
		// if the html has not been set on page load, this will return us out safely
		return result;
		
	}
	
	// appending products and carrying out required carousel builds
	function _appendProducts(selector,productsToAppend){
		var carousel = _pdp.carousels[selector.replace("#","")];
		var cTarget = $(selector + " .content  .productContent");
		
		
		//if(selector === "#pdpAlternativeProducts"){
		//	cTarget  = $(selector + " .content .productsWrapper .productContent");
		
		//}

		if(cTarget.length > 0){
			if(carousel){
				carousel.updateElements(-1,productsToAppend);		
			} else {
				
				cTarget.append(productsToAppend);
				_pdp.setUpCarouselsFor([selector]);
			}
		}
		
		if (selector === "#pdpAdditionalItems" || selector === "#pdpAlternativeProducts" ) {	
			$(selector + " dl.returnedComponent").each(function() {
				new argos.classes.QvpActivator({
					container : $(".actions", this),
					product : this,
					activatee : argos.page.elements.qvp.get(0).Element
				});
			});
		}
	}
	
	// actions to take place before products get appended as part of callback
	function _preProductsAppend(selector){
		switch(selector) {
			case "#pdpAdditionalItems" :
				 _pdpAdditionalItemsChanges();
				 break;
				 
		}
	}
	
	// specific container styling and markup alterations 
	function _pdpEssentialExtrasChanges() {
		var e = $("#pdpEssentialExtras");
		var aProducts = $("#pdpAdditionalItems").find(".product");
		if(e.length && aProducts.length<1){
				e.addClass("withoutAdditionalItems");
		}

	}
	
	// run after product append 
	function _applyClickLogging(selector,trackingCode){
	
		var c = $(selector);
		var items = c.find(".returnedComponent");
		var targetLinks;
		if(items.length > 0){
			$(items).each(function(){
				partnumber = $(this).find(".partnum").text().replace("/","");
				targetLinks = $(this).find("a");
				$(targetLinks).each(function() {
					//not these links
					if($(this).hasClass('btnbuyreserve') || $(this).hasClass('quickinfo')){
						_bindAvailAddToCart(this,partnumber,trackingCode,this.href)
					}else{
					_bindAvailLogging(this,partnumber,trackingCode,this.href);
					}
				});
			});
		}
	}
	
	function _bindAvailLogging(elem,partnumber,trackingCode,url){
		var item = elem;
		var p = partnumber;
		var t = trackingCode
		var timeoutSubmitLink;
		$(item).click(function(){
			// send tracking code with partnumber to emark object with delay before redirecting to new page
			emark.logClickedOn(p,t);
			emark.commit(function(){
				clearTimeout(timeoutSubmitLink);
				window.location.href= url;
			});
			// timeout failsafe to submit form anyway if logclick commit does not run
			timeoutSubmitLink = setTimeout(function(){	
				window.location.href= url;
			}, 1500);
			return false;
		});
	}
	function _bindAvailAddToCart(elem,partnumber,trackingCode,url){
		var item = elem;
		var p = partnumber;
		var t = trackingCode
		var timeoutSubmitLink;
		$(item).click(function(){
			// send tracking code with partnumber to emark object with delay before redirecting to new page
			emark.logAddedToCart(p,t);
			emark.commit(function(){
				clearTimeout(timeoutSubmitLink);
				window.location.href= url;
			});
			//timeout failsafe to submit form anyway if logclick commit does not run
			timeoutSubmitLink = setTimeout(function(){	
				window.location.href= url;
			}, 1500);
			return false;
		});
	}
	// end of product to product
	
	// Start OneClick Reserve functionality
	function _oneClick () {
		var userState = argos.page.user.getState().toLowerCase();
		var isOneClickProduct = argos.pdp.isOneClickEligibleForThisProduct;
		var callOneClick = userState === "loggedout" || userState == "unknown" ? false : true;
		//console.log("State:" + userState + " Eligable:" + isOneClickProduct + " Make Call:" + callOneClick);
		
		var ocContent = $("#oneClickContainer"),
			ocLink = $("#oneClickLink"),
			ocTarget = $("#oneClickLink").attr("href");
				
		// Check to see if ajax is needed and set up accordingly
		if (ocLink.length > 0 && callOneClick) {
			_setUpOneClickXhr(ocContent, ocTarget);
			return;
		}
		
		$(ocContent).show();
		$("#activeUser").show();
		_setUpStoreInfo();
		_setUpNearStoresLB();
		_resetStoreQuantity();
	}
	
	function _setUpOneClickXhr( content, getURL ) {
		$(content).show();
		var loading = $("<div class='ajaxLoadingFrame'></div>");
		content.append(loading);
		$.ajax({
			url: getURL,
			error: function () {
		    	// Deal with error here
			},
			success: function (html) {
				$(content).empty().append(html);
				_setUpMessageActivators();
				_setUpStoreInfo();
				_setUpNearStoresLB();
				_resetStoreQuantity();
				_setUpOneClickProductToProduct();
		//		argos.tracking.pdp.oneClickLoaded.call($('#oneClickContainer'));
			}
		});
	}
	
	function _setUpOneClickProductToProduct(){
		$("input.oneClickEnabled").bind("click", function(){
			if(_paymentFormDelaySubmit){
				var timeoutSubmitForm;
				var emarkTwo = new Emark();
				emarkTwo.logPurchase(String(_productOneClickAvailUserId),String(_productOneClickAvailPartnumber),String(_productOneClickAvailPrice),String(_productOneClickAvailUniqueUser),String(_productOneClickAvailCurrency));
				emarkTwo.commit(function(){
					_paymentFormDelaySubmit = false;	
					// kill timeout failsafe
					clearTimeout(timeoutSubmitForm);
					$("#oneClickReserveForm").submit();
				});
			
				// timeout failsafe to submit form anyway if logpurchase commit does not run
				timeoutSubmitForm = setTimeout(function(){	
					_paymentFormDelaySubmit = false;	
					$("#oneClickReserveForm").submit();
				}, 1500);
			}	
			return false;
		});
	}
	
	function _setUpMessageActivators() {
		var activatee = new argos.classes.MessageActivatee();
		argos.messages.addToHtml($("[class*='messageActivatee']"));
		$("[class*='messageActivator'], .contextInformation").each(function() {
			new argos.classes.MessageActivator(this, activatee);
		});
		
		var activateDisabled = $(".oneClickDisabled");
		if (activateDisabled.length) {
			activateDisabled.bind("click", function () {
				return false;
			});
		}
		
		/* Disabling for now due to CR changing the QVC activator
		$(".oneClickHelp a, #oneClickActivate a, .oneClickSignIn a").bind("click", function () {
			$("body, html").scrollTop(0);
			$("a.logIn").click();
			return false;
		}); */
	}
	
	function _setUpStoreInfo () {
		// Tool tip functionality which displays store information on hover
		var activateLink = $(".storeLink a");
		if (activateLink.length) {
			argos.messages.addToHtml($("[class*='storeInformation']"));
			var activatee = new argos.classes.MessageActivatee({id:"storeDetialsActivatee"});
			var activator = new argos.classes.MessageActivator(activateLink.get(0), activatee);
			//console.log(activatee , activator);
		}
	}
	
	function _setUpNearStoresLB() {
		// Set up LightBox for nearest stores
		var nearestStoresActivator = $(".nearestStoresActivator");
		if (nearestStoresActivator.length) {
			new argos.classes.LightboxActivator(nearestStoresActivator.get(0), argos.page.elements.lightbox);
		}
	}
	
	function _resetStoreQuantity () {
		// Reset Quantity and build select options based on store quantity
		var node = $(".oneClickResults");
		var select = $("#changeOptions");
		var stockCheckStatus = $("input[name=stockCheckAllowed]").val();
		var stockCheckTrue = (stockCheckStatus === "true");
		if (select.length < 1 ) return false;
		
		var storeField = $("input[type=radio]");
		var selectedStore = node.find(" :checked").get(0);
		if (!selectedStore) return false;
		var lowestMaxQty = parseInt(selectedStore.className);
		if (stockCheckTrue) {
			buildQtySelect(lowestMaxQty);
		}
		
		// On change of store radio inputs
		storeField.change( function () {
			if (stockCheckTrue) {
				var storeVal = parseInt(this.className);
				buildQtySelect(storeVal);
			}
			select.val('1');
		}); 
		
		// Build the qty select field with appropriate options length
		function buildQtySelect (max) {
			// console.log(select);
			if (select.length > 0) {
				var strQty = max;
				var selectSize = $("#changeOptions option").length;
				if (strQty !== selectSize) {
					$('option', select).remove();
					for (i=0; i<strQty; i++) {
						var optionVal = (i+1);
						select.append('<option value="'+ optionVal + '">' + optionVal + '</option>');
					}
				}
			}
		}
	}
	// End OneClck
	
	function _setUpJsOnlyChanges() {

		// Make instant JS-on changes.
		$(".pdpRelatedInformation .hiddenOnLoad").removeClass("hiddenOnLoad");
		$(".jsOnly").removeClass("jsOnly");

		// swap outOfStock and Quick view order for desired layout.
		$("#pdpPromotions .actions").each(function() {
			var t = $(this);
			t.after(t.prev(".availability"));
		});
		
		$(".pdpCreditOffer dl.message").hide();
	}
	
	function _setUpPrint() {
		// Print Page.
		if(window.print) { 
			var pp = $('<a href="#" title="Click here to print this page"><span>Print page</span></a>');
			var partNumber = "partNumber=" + $("input[name=partNumber]").val();
			var storeId = "storeId=" + $("input[name=storeId]").val();
			var langId = "langId=" + $("input[name=langId]").val();
			var url = "/webapp/wcs/stores/servlet/ProductDetailsPrintableView?" + partNumber + "&" + storeId + "&" + langId;
			var name = "printablePDP";
			var features = "width=855,height=750,directories=no,location=no,menubar=yes,scrollbars=yes,toolbar=no,status=no,resizable=yes,top=0,left=0";

			pp.insertAfter("#emailFriend");
			pp.click(function(){
				window.open(url, name, features);
			});
			pp.wrap('<li id="printPage"></li>');
		}
	}
	
	function _setUpSocialMedia() {
		// socialLinks only shows with script on
		$('#pdpSocialMedia').show();
	}
	
	function _cleanProductDetails() {
		var pdContent = $("#pdpFullProductInformation #contentLeftBlock");
		pdContent.html(_cleanHtml(pdContent.html()));
	}

	function _setUpBriefProductDetails() {
		var bpdContent = $("#pdpBriefDetails .content");
		var baseContent = $(".fullDetails")[0];
		var pdContent = $(baseContent).clone();
		var cleanedHtml, clippedContent;
		bpdContent.html(argos.utils.cleanHtml(pdContent));
		//clippedContent = _verticallyClipContent(bpdContent.children(), 95);
		clippedContent = argos.utils.verticallyClipContent(bpdContent.children(), 95);
		bpdContent.empty();
		var fullDetailsAction = $("<p><a href='#pdpFullProductInformation' class='button' title='Full details'>"+ argos.pdp.productBriefAnchor +"</a></p>");
		bpdContent.append(clippedContent).append(fullDetailsAction);
		$("#pdpBriefDetails h4.summaryTitle").show();
	}
	
	function _setUpProductButtons() {
		// Because the PDP shows QuickInfo buttons, we need to apply
		// small tweak to rearrange order. Non-JS will show buyorreserve buttons normally.
		$(".product .addtocart, .product .addtogiftlist").each(function() {
			var button = $(this);
			button.next(".QvpActivator").after(button);
		});
	}
	
	function _setUpCarouselFor(carouselSelectors) {
		var c, items, carousel;
		for(var i=0; i < carouselSelectors.length; i++) {
			c = $(carouselSelectors[i]);
			items = $(".product", c);
			if(!_pdp.carousels[carouselSelectors[i].replace("#","")]){
				carousel = new _classes.Carousel(items, {
					"step" : 0,
					"offset" : 12,
					"paging" : 4
				});
				if(carousel.exists){
					_pdp.carousels[carouselSelectors[i].replace("#","")] = carousel;
				}
			}
		}
	}
	
	function _setUpPromotionsCarousel() {
		// Create (condensed promotion) carousel from listed promotions and replace static content.
		var container = $("#pdpPromotionsCarousel.static .content");
		var promotions = $("#pdpPromotions .promotion");
		argos.promotions.carousel.init(promotions, container);
	}
	
	function _setEvar53(){
		currentUrl=window.location.href;
		if(currentUrl.indexOf("soc=")>-1){
			currentUrlPos=currentUrl.substring(currentUrl.indexOf("soc=")+4);
			s.eVar53=currentUrlPos;
		}
	}
	
	function _correctEssentialExtrasHeight() {
		// Due to changes in button (hover) style of carousel, need to make minor adjustment
		// to essentialExtras area, when it's smaller than the carousel area.
		var cProduct = $("#pdpAdditionalItems .product");
		var cProductParent = cProduct.parent();
		var cProductHeight = (cProduct.length > 0) ? cProduct.height() : 0;
		var eProduct = $("#pdpEssentialExtras .product");
		var eProductHeight = (eProduct.length > 0) ? eProduct.height() : 0;
		var eMargin = 0;
		var cPadding = 0;

		if(eProduct.length) {
			if(eProductHeight < cProductHeight) {
				// Nicety to adjust height of essential Extra right border length.
				eMargin = Number(eProduct.css("margin-top").replace("px","")) + Number(eProduct.css("margin-bottom").replace("px",""));
				// alert(cProductHeight);	
				eProduct.css("height", Number(cProductHeight) - eMargin);
			}
			else {
				// Only worry if carousel present, otherwise being smaller doesn't matter.
				if(cProductParent.hasClass("carousel")) {
					cProductParent.css("height", cProductParent.height() + (eProductHeight - cProductHeight));
				}
			}
		}

	}
	
	function _setUpColourPicker() {
		var colourPicker = $("#pdpColourPicker");
		if(colourPicker.length > 0) {
			var items = colourPicker.find("a.pickerItem");
			carousel = new _classes.Carousel(items, {
				"offset" : 22, 
				"step" : 1,
				"titleTextNext" : "Next colour",
				"titleTextPrevious" : "Previous colour"
			});
			if(items.length > _colourPickerItemsMax) {
				colourPicker.addClass("carouselActive");
				_addExtraControlStyle();
			}
				
			// remove alt incase missing image disturbs carousel layout
			for(var i=items.length-1; i>=0;i--){
				$(items[i]).find("img").removeAttr("alt");
				if($(items[i]).hasClass("currentlySelected")){
					$(items[i]).bind("click" , function(){
							return false;
					});
				}
			}
		}
		
		argos.messages.addToHtml($("[class*='colourBubble']"));
		var activatee = new argos.classes.MessageActivatee({
			id : "colourPickerActivatee",
			TIME_DELAY_CLOSE : 0,
			TIME_OPEN_LIMIT : 0
		});
		
		activatee.position = function () {
			this.positionNear(this.property("activator").$node, {
				vOffset : -165,
				hOffset : -70
			});
			//this.positionToFit();
		}
		
		activatee.setContent = function (swatch) {
			argos.classes.MessageActivatee.prototype.setContent.call(this, swatch);
			argos.tracking.pdp.colourSwatch(activatee.$node);
		}
		
		$("#pdpColourPicker a.pickerItem").each(function() {
			var activator = new argos.classes.MessageActivator(this, activatee);
			activator.setMessage(this.className.replace(/^.*?(colourPickerBubble\d+).*$/, "$1"));
			activator.property("constants", {
				SENSITIVITY_TIME : 0, // No delay required
				SENSITIVITY_PROP : "sensitivity"
			});
		});		
		//_concludeGenericPickerSetup(items, bubble, "swatchcolor");
	}
	
	function _addExtraControlStyle() {
		//add extra divs to stop shadow bleed on 9th colour - not ideal!
		var nextButton = $("#pdpColourPicker .controller .forward");
		var prevButton = $("#pdpColourPicker .controller .back");
		nextButton.attr('alt','Next color').wrap("<div class='arrowNext' />");
		prevButton.attr('alt','Previous color').wrap("<div class='arrowBack' />");
		$("#pdpColourPicker .arrowBack").addClass("unactive").hide();
		nextButton.bind("click", function () {
			var backHidden = $("#pdpColourPicker .arrowBack").hasClass("unactive") ? true : false;
			if (backHidden) {
				$(".arrowBack").removeClass("unactive").show();
			}
			return false;
		});
		$("#pdpColourPicker .controller button").bind("click", function () {
			argos.messages.addToHtml($("[class*='colourBubble']"));
			var activatee = new argos.classes.MessageActivatee({
				id : "colourPickerActivatee",
				TIME_DELAY_CLOSE : 0,
				TIME_OPEN_LIMIT : 0
			});
			
			activatee.position = function () {
				this.positionNear(this.property("activator").$node, {
					vOffset : -165,
					hOffset : -70
				});
				//this.positionToFit();
			}
			
			$("#pdpColourPicker a.pickerItem").each(function() {
				var activator = new argos.classes.MessageActivator(this, activatee);
				activator.setMessage(this.className.replace(/^.*?(colourPickerBubble\d+).*$/, "$1"));
				activator.property("constants", {
					SENSITIVITY_TIME : 0, // No delay required
					SENSITIVITY_PROP : "sensitivity"
				});
			});
		});
		
	}
	
	this.setUpCarouselsFor = _setUpCarouselFor;
	
});


/* PDP Tagging
 ***************/
argos.tracking.ArgosISALTMStockAvailability = {}; // Adding here because Stock Check templates are fragmented. 
argos.tracking.pdp = {
		trolleyAdd_collect: function() {
			$("#tab1 .buttAddToTrolley").bind("click", function() {	
				argos.tracking.set(this,"Trolley Add Collect", {
					events : "scAdd",
					eVar13 : "Collection",
					products : s.products,
					prop7 : s.prop7,
					eVar7 : s.prop7,
					eVar75 : s.eVar75
				});
				
			});
		},
		trolleyAdd_local_collect: function() {
			$(".buttAddToTrolleyLocal").bind("click", function() {	
				argos.tracking.set(this,"Trolley Add Collect", {
					events : "scAdd",
					eVar13 : "Collection",
					products : s.products,
					prop7 : s.prop7,
					eVar7 : s.prop7,
					eVar75 : s.eVar75
				});
			});
		},
		trolleyAdd_deliver: function() {
			$(".btnbuyreserve").bind("click", function() {
				argos.tracking.set(this,"Trolley Add Delivery", {
					events : "scAdd",
					eVar13 : "Delivery",
					products : s.products,
					prop7 : s.prop7,
					eVar7 : s.prop7,
					eVar75 : s.eVar75
				});
			});
		},
		trolleyAdd_deliver: function() {
			$("#tab2 .buttAddToTrolley").bind("click", function() {
				argos.tracking.set(this,"Trolley Add Delivery", {
					events : "scAdd",
					eVar13 : "Delivery",
					products : s.products,
					prop7 : s.prop7,
					eVar7 : s.prop7,
					eVar75 : s.eVar75
				});
			});
		},
		
		fulfilmentTabs : function() {

			$("#collectionTab a").bind("click", function(){

			argos.tracking.set(this, "PDP-CollectionTab", {
				pageName : s.pageName,
				channel : s.channel,
				eVar74 : s.pageName,
				prop7 : s.prop7,
		        eVar7 : s.prop7,
					eVar75 : s.eVar75,
		        products : s.products
				});
			});


			$("#deliveryTab a").bind("click", function(){
				argos.tracking.set(this, "PDP-DeliveryTab", {
				pageName : s.pageName,
				channel : s.channel,
				eVar74 : s.pageName,
				prop7 : s.prop7,
	            eVar7 : s.prop7,
					eVar75 : s.eVar75,
	            products : s.products
				});
			});
		},

		

		findStockButton : function(stockTagStatus) {

			$("#findStock").bind("click", function(){
				 argos.tracking.set(this, stockTagStatus, {
            	pageName : s.pageName,
            	channel : s.channel,
            	eVar74 : s.pageName,
            	prop7 : s.prop7,
                eVar7 : s.prop7,
					eVar75 : s.eVar75,
                products : s.products,
                events : "event57"
            	});
            });

		},

		storeFailStockCheck : function(stockTagMessage) {
            s.prop6 = stockTagMessage;
			s.linkTrackVars="prop6";
			var s_code = s.tl(this,'o',"Store Fail Stock Check");
		},

		storeInStockLoad : function(stockTagMessage){
			var newStockMessage=stockTagMessage.replace(/(<([^>]+)>)/ig,"");
			
			if (newStockMessage.match(/Available to collect in store in/gi)){
				s.prop63='Available to collect in store in a few days';
			}
			
			if (newStockMessage.match(/order by 1pm to collect from 4pm today/gi)){
				s.prop63='Available to collect in store today';
			}
			
			if (newStockMessage.match(/order by midnight/gi)){
				s.prop63='Available to collect in store tomorrow';
			}
			s.linkTrackVars="prop63";
			var s_code =  s.tl(this,'o',"In Stock");
		},

		storeOutOfStockLoad : function(selectedStoreId,stockTagMessage){
            s.prop63 = stockTagMessage;
            s.events = "event32";
			s.eVar74 = s.pageName;
            s.eVar16 = selectedStoreId;
			s.linkTrackEvents="event32";
			s.linkTrackVars="prop63,events,eVar74,eVar16";
			var s_code =  s.tl(this,'o',"Store Out Of Stock");
		},

		deliveryAvailability : function(){
            s.prop63 = stockTagMessage;
            s.events = "event32";
			s.eVar74 = s.pageName;
            s.eVar16 = selectedStoreId;
            var s_code = s.t();
		},

		findStoreTabs : function(){

            $("#stockChecker .buttonFirst").bind("click", function(){
                argos.tracking.set(this, "Stock check - Local stores", {
                	pageName : s.pageName,
                	channel : s.channel,
                	eVar74 : s.pageName,
                	prop7 : s.prop7,
                    eVar7 : s.prop7,
					eVar75 : s.eVar75,
					events : ""
                });
            });

            $("#stockChecker .buttonLast").bind("click", function(){
            	argos.tracking.set(this, "Stock check - My favourite stores", {
            	   pageName : s.pageName,
            	   channel : s.channel,
            	   eVar74 : s.pageName,
            	   prop7 : s.prop7,
                    eVar7 : s.prop7,
					eVar75 : s.eVar75,
					events : ""
            	});
            });



		},

		oneClickActivate : function(){
			$("#tab1 .oneClickButtonContainer a.activate").bind("click", function(){
				argos.tracking.set(this, "Login|Registration Location", {
			            pageName : s.pageName,
			            channel : s.channel,
			            prop4 : s.prop4,
			            events : 'event60',
		                prop25 : '1click:activate:selected:'
		          });

			});
	
		},
		
		oneClickSignin : function(){
			$("#tab1 .continueButton a.activate").bind("click", function(){
				argos.tracking.set(this, "Login|Registration Location", {
					 	pageName : s.pageName,
			            channel : s.channel,
			            prop4 : s.prop4,
						prop25: "1-Click Sign-in"
		         });

			});
			
		},


		oneClickLoaded : function() {
			
			argos.tracking.pdp.oneClickSignin();
			argos.tracking.pdp.oneClickActivate();
			
			if ($("#oneClickReserveURL").length) {
				var storeNumber = $("#oneClickReserveURL input[name='storeNumber']").val();


				 var setVar27;
		          var prodEvent;
		          var setProducts;
		          var partNumber = $('#pdpProduct .partnumber').text().replace(/\D/g,''); 
		          //does it contain text 'in stock'
		          //one click in stock
		               

		                prodEvent = 'event52=1';
		                setEvents = 'event52,event57';            
		                setVar27 = '1click:Stockck:'; 
		                
		         

		/*
		          else {//one click out of stock
		                prodEvent = 'event51=1';
		                setEvents = 'event51,event57';
		          }
		          
		    */      
		              setProducts = partNumber + ';'+ prodEvent +';'+'eVar16='+storeNumber+';';
		            
		           

				argos.tracking.set(this, "One Click Loaded", {
			                prop25 : '1click:activate:offered:',
			              //  eVar16 : setVar16,
			                //prop42 : setProp+':',
			                //products : ';'+partNumber+';;;'+setProducts+';'+'evar16='+setVar16.replace(/:/g, "")+';',
			                products : ';'+setProducts,
			                events : setEvents,
			                eVar27 : setVar27,
			                eVar16 : storeNumber

			      });
			}
		},


		/*	
	// 1-click reservation tagging
	oneClickLoaded : function() {
	    var oneClickResultsLi = $('.oneClickResults li',this); 
	    var result = [];
	    var oneClickLoaded = 0;
	    var setEvents, setProducts;
	    if(oneClickResultsLi.length) 
		    oneClickResultsLi.each(function(index) {
		          var $this = $(this);
		          result.push({
		            label: $this.find('label').text(),
		            storeNumber: $this.find('input').val()?$this.find('input').val().slice(0,4):'',
		            isDisabled : $this.find('.labelSet span').hasClass('inStock')?true:false,        
		            order: index+1
		        });                 
		        oneClickLoaded = 1;                                   
		    });
	    
	    if (oneClickLoaded == 1) { 
	          oneClickOnLoad();             
	    };                      
	
	    //general tests - console.log('label: '+result[0].label);
	
	    function storeOutOfStock() {
	          var oos = '';
	          for (i in result){
	                if (result[i].isDisabled == true) {
	                      oos = oos + result[i].label+'|'
	                }                       
	          }
	          return oos.replace("undefined", "");
	    }
	    
	    function getVar16() {
	          var var16='';
	          for (i in result){
	                if (result[i].isDisabled == true) {
	                      var16 = var16 + ':'+result[i].storeNumber
	                }                       
	          }
	          return var16.replace("undefined", "");
	    }
	    
	    function getProp() {
	          var setProp;
	          for (i in result){
	                if (result[0].isDisabled == false && result[i].isDisabled == false ) {     
	                      if (i <= 2) {
	                            setProp = (setProp + ':'+result[i].storeNumber + ':'+result[i].order).replace(/undefined/g, ""); 
	                      }
	                }                       
	          }
	          return setProp
	    }
	          
	    //7.1.2     Product Details page 
	    // prop25 - set to active when one click becomes available
	    function oneClickOnLoad(){
	          var setVar16 = getVar16();
	          var setProp = getProp();
	          var setVar27;
	          var prodEvent;
	          var setProducts;
	          var partNumber = $('#pdpProduct .partnumber').text().replace(/\D/g,''); 
	          //does it contain text 'in stock'
	          if (result[0].isDisabled == false) {//no it doesn't its out of Stock
	                prodEvent = 'event51=1';
	                setEvents = 'event51,event57';
	                
	          } else {//yes it does its in stock
	                prodEvent = 'event52=1';
	                setEvents = 'event52,event57';            
	                setVar27 = '1click:Stockck:';                   
	          }
	          
	          // check first product is oos or in stock 
	          var firstStoreInStock = result[0].isDisabled;
	          setProducts = partNumber+';;;'
	          for (var i=0; i < result.length; i++) {                     
	                if (result[i].isDisabled == firstStoreInStock) {
	                      setProducts = setProducts + prodEvent +';'+'evar16='+result[i].storeNumber.replace(/:/g, "")+';'
	                }
	          }  
	
	          //set up products                  
	          
	          // oos get all stores that are oos plus all values
	          // of not oss get all stores that are oos plus all values
	          
	          
	          
	          argos.tracking.set(this, "One Click Loaded", {
	                prop25 : '1click:activate:offered:',
	                eVar16 : setVar16,
	                prop42 : setProp+':',
	                //products : ';'+partNumber+';;;'+setProducts+';'+'evar16='+setVar16.replace(/:/g, "")+';',
	                products : ';'+setProducts,
	                events : setEvents,
	                eVar27 : setVar27
	          });
	    }     
	    
	    // prop25 - if signin available set on click
	    $('.oneClickSignIn',this).bind('click', function() {  
	          argos.tracking.set(this, "One Click Sign In", {
	                prop25 : '1click:signin:'
	          });
	    });
	    // prop25 - when one click button clicked - user logged out
	    $('#oneClickActivate a',this).bind('click', function() {    
	          argos.tracking.set(this, "One Click Button Activated", {
	                events : 'event60',
	                prop25 : '1click:activate:selected:'
	          });
	    });
	    
	    // s.products - when one click button clicked
	    $('.oneClickEnabled',this).bind('click', function() { 
	          var storeLink = $('.storeLink').length; 
	          var var27 = '1click:RegularReservation:';
	          var setProp51 = storeOutOfStock();
	          
	          if (storeLink >= 1) { // if exists it DOES use improved inventory
	                var27 = '1click:Improved Inventory Reservation:';
	          } 
	          argos.tracking.set(this, "One Click Button Clicked", {
	                prop25 : '1click:activate:selected:',
	                eVar27 : var27,
	                prop51 : setProp51,
	                eVar16 : '512'
	          });
	    });
	},
		*/
	
	
	// Init
	init: function() {
		with(this) {
			fabricPicker();
			buyOrReserve();
			outOfStock();
			social(); 
			sizePicker(); // Untested
			specialOffer();
			creditOffer();
			fullDetails();
			relatedItems();
			
			
		// specificiation(); - DROP 2
		}
	},

	// BE DEVELOPMENT 
	// 6.2.1 Product Details Page (page tagging to be developed by BE outside of this script)
	
	// 6.2.2 Colour Swatch
	colourSwatch: function(context) {
		$("a", context).bind("click", function () {
			argos.tracking.set(this,"Color Swatch", {
				eVar58 : "ar:product:swatch"
			});
		});
	},
	
	// 6.2.3 Fabric Picker
	fabricPicker: function() {
		$("#pdpFabricPicker .pickerItem").bind("click", function() {
			argos.tracking.set(this,"Fabric Picker", {
				eVar58 : "ar:product:swatch:fabric:"
			});
		});
	},
	
	// 6.2.4 BuyOrReserve
	buyOrReserve: function() {
		$("#pdpPurchase .btnbuyreserve").bind("click", function() {
			argos.tracking.set(this,"Buy Or Reserve", {
				events : "scAdd"
			});
		});
	},
	
	// 6.2.5-6 Social Media
	social: function() {
		$("#pdpSocialMedia .shareitem a").bind("click", function() {
			var type = this.firstChild.nodeValue.toLowerCase().replace(/\s/g, "");
			argos.tracking.set(this, "Social Link", {
				prop25 : "ar:product:socialdropdown:" + type + ":"
			});
		});
		
		// 6.2.6 Third-party issue.
	},
	
	// 6.2.7 Out Of Stock Information
	outOfStock: function() {
		// emailMeBackInStock gets injected in stockChecker.js this *should* run after that.
		$("#deliveryInformation .emailMeBackInStock").click(function(e){
			argos.tracking.set(this,"Email me when back in stock", {
				prop25 : "ar:product:emailmewheninstock:"
			});
		});
	},

	// 6.2.8 Size Picker
	sizePicker: function() {
		$("#sizeGuideLaunch").bind("click", function(e){
			argos.tracking.set(this,"Size Picker", {
				prop25 : "ar:product:sizeguide:"
			});
		});
	},
	
	// 6.2.9 + 6.2.17 Special Offers
	specialOffer: function() {
		$("#pdpPricing a.specialoffer").bind("click", function(){
			argos.tracking.set(this,"Special Offer Summary", {
				prop25 : "ar:product:specialoffersummary:"
			});
		});
		
		$("#pdpPromotions .buyOrReserve").bind("click", function(){
			argos.tracking.set(this, "Add Offer To Trolley", {
				eVar46 : $(this).parent().children("input[name=promotionIdentifier]").val(),
				events : "scAdd"
			});
		});	
	},
	
	// 6.2.10 + 6.2.12 Credit Offer Link + Full width component.
	creditOffer: function() {
		$(".pdpCreditAction a").bind("click", function(){
			argos.tracking.set(this,"Credit Offer Link", {
				prop25 : 'ar:product:instantcreditbanner:'
			});
		});
		
		$("#pdpCreditOffers .creditHelp").bind("click", function(){
			argos.tracking.set(this,"Credit Offer Component", {
				prop25 : "ar:product:howdoigetthisdeal:"
			});
		});
	},
	
	// 6.2.11 Full Details
	fullDetails: function() {
		$(".button.fullDetails").bind("click", function(){
			argos.tracking.set(this,"Full Details Button", {
				prop25 : "ar:product:showfulldetails:"
			});
		});
	},
	
	// From PDP:
	// 6.2.13 - 6.2.16 Essential Extras, You May Also Like, Alternatives, Also In Range
	// From PPP (Purchase Product Page / Add to trolley)
	// 6.2.24 - 6.2.26 Essential Extras, You May Also Like, Also In Range
	relatedItems: function(specific) {
		// Might want to make selector more specific.
		// E.g. target .returnedComponents for post-Avail products.
		var s = arguments.length > 0 ? (" " + specific) : "";
		this.addToTrolley("#pdpEssentialExtras" + s, "Essential Extras");
		this.addToTrolley("#pdpAdditionalItems" + s, "You May Also Like");
		this.addToTrolley("#pdpAlternativeProducts" + s, "Alternatives");
		this.addToTrolley("#pdpAlsoInThisRange" + s, "Also In This Range");		
	},
	
	addToTrolley: function(component, label) {
		$(component + " .addtocart").bind("click", function(){
			argos.tracking.set(this, label, {
				eVar46 : "ar:" + argos.tracking.identifier + ":" + label.toLowerCase().replace(/[^0-9a-z]/g, "") + ":" + argos.pdp.product.number + ":" + argos.utils.partNumberFromParentProduct.call(this) + ":",
				events : "scAdd"
			});
		});		
	},
	
	// QuickView Lightbox - See tagging.js 
	// 6.2.18 From PPP
	// 6.2.22 From PDP
	// 6.2.27 from Add to trolley (duplication of 6.2.18) ??

	
	// 6.2.19-21 Stock Information + Check Stock Lightbox
	// 6.2.21.1 Existing tagging on 1-Click reservation component
	// 6.2.21.2 1-Click Reservation Cancellation Lightbox
	// Uses CheckStockActivatee.prototype.modifyContent()
	stockCheck: {
		
		events: function() { 
			// (Not checked 1-Click tagging but should still be in place).
			function tag(e) {
				var breadcrumbs = argos.tracking.breadcrumb().slice(1).join(":").toLowerCase().replace(/[^0-9a-z:]/g,"");
				var props = { eVar29 : "product:stockcheck:" + e.data.what + ":" }
				
				if(breadcrumbs.length > 0) {
					props.prop4 = "ar:" + breadcrumbs + ":pdp:lbstockcheck:";
				}
				
				if(e.data.events) {
					props.events = e.data.events;
				}
				
				argos.tracking.set(this, "Stock Check Event", props);			
			};
			
			$("#buyOrReserveForm input[type=submit]", this).bind("click", { 
					what: "addtobasket",
					events: "scAdd" 
				}, tag
			);
			
			$(".close", this).bind("click", { what: "close" }, tag);
			$(".checkOtherStores", this).bind("click", { what: "checkotherstores" }, tag);
			$("#checkStock", this).bind("click", { what: "postcodego" }, tag);		
		},
		
		display: function() {
			var event = argos.tracking.ArgosISALTMStockAvailability.event; // Number 32, 40, or 0 for not set.
			var homeDelTag = argos.tracking.ArgosISALTMStockAvailability.homeDeliveryInStock ? "" : (argos.pdp.product.number + ";;;event33=1;eVar16=500");
			var eventTag = "event" + event + "=1";
			var storeTag = ";eVar16=" + $("input[name=storeNo]", this).val();
			var appendTag = (event != 0 ? (argos.pdp.product.number + ";;;" + eventTag + storeTag) : "");
			var products = ";" + homeDelTag + (homeDelTag && appendTag ? ";;;" : "") + appendTag;
			var events = products.match(/event[0-9]{1,2}/g);
			var props = {
				channel : "ar:lbstockcheck:",
				products : products,
				events : events ? events.join(",") : "",
				eVar52 : argos.tracking.ArgosISALTMStockAvailability.eVar52
			}
			
			// 6.2.21
			if(argos.tracking.ArgosISALTMStockAvailability.eVar9) {
				props.eVar9 = argos.tracking.ArgosISALTMStockAvailability.eVar9;
			}
			
			if(argos.tracking.ArgosISALTMStockAvailability.eVar27) {
				props.eVar27 = argos.tracking.ArgosISALTMStockAvailability.eVar27;
			}
			
			
			
			// Multiple views are pumped through CheckStockActivatee - Only fire tagging for those defined.
			if(argos.tracking.ArgosISALTMStockAvailability.template == "ArgosISALTMStockAvailabilityResultsSnippet") {
				argos.tracking.set(this, "Stock Check Display", props);
			}
		}
	}
	
	// BE DEVELOPMENT
	// 6.2.23 Add To Trolley Page (page tagging to be developed by BE outside of this script)
	
	// 6.2.28 BazaarVoice
	// All tagging in this area handled by BazaarVoice 
	
	// TODO: DROP 2 - TO BE DEVELOPED
	// 6.3.1 Specification Table
	/* 
	specificiation: function() {
		$("#showFullSpecification").bind("click", function(){
			argos.tracking.set(this, "Specification Table", {
				eVar46 : "ar:product:showfulltable:",
			});
		});		
	}
	*/
	
}

argos.creditOffer = function() {
	argos.creditOffer.body = $('body.pdp');  
	if (argos.creditOffer.body) {
		argos.creditOffer.creditHelpContext = $(argos.creditOffer.body).find('.creditHelpContext'); 
		argos.creditOffer.messageActivatee = $(argos.creditOffer.body).find('.MessageActivatee').not( "#colourPickerActivatee"); 		
		argos.creditOffer.pdpCreditOffer = $(argos.creditOffer.body).find('.pdpCreditOffer .message dd').html(); 
		argos.creditOffer.messageActivatee.empty().append(argos.creditOffer.pdpCreditOffer);		
		argos.creditOffer.creditHelpContext.bind({
			mouseover: function(e) {
				var x = e.pageX; 
				var y = e.pageY; 
				argos.creditOffer.messageActivatee.css({"position" : "absolute", "left" : x+"px", "top" : y+"px"});
				argos.creditOffer.messageActivatee.removeClass('closed').addClass('open MessageActivatee_active').show();				
			},
			mouseout: function() {
				argos.creditOffer.messageActivatee.addClass('closed').removeClass('open MessageActivatee_active').hide();
			}
		});
	}
}


argos.utils.monitorCookie = function(pName,elem) {
    this.el = $(elem);    	
    if (this.el.val().length && localStorage.getItem(pName)) {
    	argos.cookie.set(pName,localStorage.getItem(pName));
    };
	if(this.el.val().length && this.el.val() != 'Postcode') {
		localStorage.setItem(pName,this.el.val());
		argos.cookie.set(pName,this.el.val());
	} else {
		if (argos.cookie.get(pName) == '') {
			argos.cookie.set(pName,localStorage.getItem(pName));			
		} 
		this.el.val(argos.cookie.get(pName));		
		
	}	
}

argos.postCodeCheckPdp = function() {
	var int = setInterval(function(){
	   timer()
	},1000),
    elem = $('.postCodeCheck input'),
    duration = 60;  
	
	function timer() {	
    	duration--; 
    	var elem = $('.postCodeCheck input');	
    	
    	if (elem.length) {   
    		argos.utils.monitorCookie('FulfilmentPostcode','.postCodeCheck input');
    		$('.postCodeCheck input').val(localStorage.getItem('FulfilmentPostcode'));
            	elem.keyup(function(event){

        argos.cookie.set('FulfilmentPostcode',elem.val());
        localStorage.setItem('FulfilmentPostcode',elem.val());
        
        var postCodeCheckButton = $(".postCodeCheck .button");
	    var checkErrorStatus = function() {	   
            if ($('#postcodeErrorMsg').is(':hidden')) {
            	var el = $(document).outerWidth();
                $('html, body').scrollTop(150).scrollLeft(580);       
            }  
		}
		postCodeCheckButton.click(function() {
		   
		   setTimeout(function() { checkErrorStatus(); }, 2000);
		});
		if(event.keyCode === 13) {			
			
			postCodeCheckButton.click();
		}
		
    });
    clearInterval(int);	} 

    	if (duration <= 0) {
            clearInterval(int);
    	}
    }
}

$(document).ready(function(){
	argos.pdp.init();
	argos.tracking.identifier = argos.page.elements.body.hasClass("ppp") ? "addtotrolley" : "product";
	argos.tracking.pdp.init();

//	argos.tracking.pdp.oneClickLoaded.call($('#oneClickContainer'));
});

$(document).ajaxComplete(function( event, xhr, settings ) {
	// Move shutl box to fix QC 8907
	if (settings.url.indexOf('OneClickReserve') != -1) {
	
		/* Get Popup Showing on Widget*/
		$('.shutl-espot').after($('.shutlPopupWrapper'));
		// Attach event handlers to shutl icon to show/hide popup
		$('a.shutlInfoIcon').mouseover(function() {
			// Show shutl popup
			$('div.shutlPopupWrapper').css('display', 'block');
		}).mouseout(function() {
			// Hide shutl popup
			$('div.shutlPopupWrapper').css('display', 'none');
		});
		$('a.shutlInfoIcon').click(function() {
			if($('div.shutlPopupWrapper').css('display') === 'none') {
				$('div.shutlPopupWrapper').css('display', 'block');
			} else {
				$('div.shutlPopupWrapper').css('display', 'none');
			}
		});
  }
});