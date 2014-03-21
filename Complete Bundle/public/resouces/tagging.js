/*******************************************************************************
* lister tagging
******************************************************************************/
argos.tracking.lister =  (new function(listerPageTag) {
      
      this.init = function(listerPageTag) {
            var basetag = listerPageTag;
            var location = argos.tracking.location.get();         
            var pageName = argos.tracking.cleanString(location.join(':'));
            var qvpProp4 = pageName;
            var recommended = argos.tracking.cleanString(location[0]);
            var promoslot = argos.tracking.cleanString(location[0]);    
            var sortBy = $('.sortBy option');
            var searchterm = $('.searchterm').text().replace(/"/g, "").toLowerCase();;
            var recommendedproduct = $('.recommendedproduct a');  
            var promoitem = $('.promoitem a');
            var imageAnchor = $('.lister.searchLister .product .image a');    
            var customerrating = $('#products .customerrating a');
                  
            sortBy.click(function(){
                  var optionText = $(this).text();    
            
                  argos.tracking.set(this, "Lister Sort Option", {
                        prop18 : argos.tracking.cleanString(optionText).replace(/:/g,""),
                        eVar43 : 'Browse^Bazaarvoice^Ratings And Reviews^sortbyreviews^',
                        var32 : 'search:'+searchterm+':'+optionText //applies to  navigation
                  });         
            });   
  
            recommendedproduct.click(function(){
                  var partnum = $(this).parent().parent().find('.partnum').text();              
                  argos.tracking.set(this, "Lister Recommended Product", {                      
                        eVar49 : basetag+recommended+':recommended:',
                        eVar44 : basetag+'recommended:'+partnum+':'           
                  });   
            });
            promoitem.click(function(){                     
                  argos.tracking.set(this, "Lister Promotional Slot", {                   
                        eVar49 : basetag+promoslot+':promoslot:'
                  });   
            })    
            imageAnchor.click(function(){ // not currently showing in WATS requires more work
                  argos.tracking.set(this, "Lister Search Custom Link", {                       
                        CUSTOMLINK : 'onclick="var s=s_gi("argosprod");s.tl(this,"o","ar:search:list:thumbnail:")'
                  });   
            })           
      }     
});

/*******************************************************************************
* Custom Omniture tagging for RVI
******************************************************************************/
argos.tracking.rvi = (new function() {          
      
      var basetag  = "ar:cat:recentlyviewed:";
      var basetagRemoved  = "ar:cat:recentlyviewed:removed:";
      
      function captureProduct(position,partNumber) {
            argos.tracking.set(this, "rvi product link", {
                  eVar44 : basetag+position+':'+partNumber+':'
                  
            });   
      }
      
      this.captureProduct = captureProduct;
      
      this.captureRemove = function() {
      
            if ($('body').hasClass('lister')) {
                  basetag = "ar:recentlyviewed:lister:"
            }
            argos.tracking.set(this, "rvi product removed", {
                  prop25 : basetag+'removed:'
            });   
      }     
      
      this.init = function() {
            $('#recentlyViewed .product').each(function(i) {
                  var partNumber = $(this).find('.partnum').text();
                  i = i+1; // Compensate for zero index
                  $(this).find('.image a , .title a').bind("click", function() {          
                        captureProduct(i,partNumber);
                  });               
            });
      }
});


/*******************************************************************************
* Question and Answer
******************************************************************************/
argos.tracking.question = (new function() {     

      this.init = function() {
            
            var askandanswer = $('#BVQASummaryBoxAskFirstQuestionID a');
            if (askandanswer.length) {
                  argos.tracking.set(this, "Ask and Answer", {
                        eVar41 : 'L3:NO'              
                  });   
            }     
            
            var askandanswer = $('#BVQASummaryBoxAskFirstQuestionID a');
            
            askandanswer.bind('click', function() {
                  argos.tracking.set(this, "PDP Essential Extras Quick View", {
                        eVar41 : 'L3:NO'                          
                  });   
            });         
            
      }
      

});

/*******************************************************************************
* Global Navigation
******************************************************************************/
argos.tracking.globalNav = (new function() {    
      
      this.checkUrlString = function(str) {
            return window.location.href.indexOf(str) != -1
      }
      
      this.init = function() {                  
            var basetag = 'ar:';
            if (this.checkUrlString("Price+Cut")) {
                  basetag = 'ar:pricecuts:';
            }                 
            var tnav = 'topnav:';
            var snav = 'subnav:';
            var topNav = $('#primary').find('li a');
            var subNav = $('.MenuActivatee dd a');
            //var vav49 = basetag+subNav; 
            
            topNav.bind('click', function() {               
                  var prop38 = argos.tracking.cleanString($(this).text());
                  argos.tracking.set(this, "Global Navigation Top Level", {
                        prop38 : basetag+tnav+prop38+':'                
                  });   
            });   
            
            subNav.bind('click', function() {
                  var id = $(this).parent().parent().parent().attr('id');
                  var topNavText = $('.'+id).find('a').text();
                  var subNav = $(this).text();
                  
                  argos.tracking.set(this, "Global Navigation Sub Level", {
                        prop38 : basetag+tnav+argos.tracking.cleanString(topNavText)+':'+argos.tracking.cleanString(subNav)+':',
                        eVar49 : basetag+snav+argos.tracking.cleanString(topNavText)+':'
                  });   
            });   

      }
      

});

/*******************************************************************************
* Cat landing pages (and price cuts)
******************************************************************************/
argos.tracking.catlanding = (new function() {   //integrates prices

      this.checkUrlString = function(str) {
            return window.location.href.indexOf(str) != -1
      }
      
      this.init = function() {
            
            
            var basetag = 'ar:cat:';
            var basetag2 = 'ar:cat';
            if (this.checkUrlString("Price+Cut")) {
                  basetag = 'ar:cat:pricecuts:';
                  basetag2 = 'ar:cat:pricecuts';
            }                                         
            var brands = $('#brands li a');
            var carousel = $('.carousel a');
        var isLatestOffers = false;
            if(!carousel.length > 0) {
            carousel = $('#latestOffers a');
            isLatestOffers = true;
        }
            var location = s.pageName.replace(/ar:cat:/g, "").slice(0, -1);   
            var browserLevel = argos.app.browseLevel;
            var slot = $('#categories ul.navigation a.tVisualBrowse');
            
            slot.bind('click', function() {
                  var location = s.pageName.replace(/ar:cat:/g, "").slice(0, -1);
                  var title = $(this).find('span').text();
                  argos.tracking.set(this, "Category Landing Brands Component", {
                        eVar49 : basetag+location+':'+argos.tracking.cleanString(title)+'visualbrowse:',
                        eVar41 : basetag+location+':'+argos.tracking.cleanString(title)+'visualbrowse:'
                  });   
            });
            
            brands.bind('click', function() {
                  var title = argos.tracking.cleanString($(this).find('img').attr('alt'));
                  var location = s.pageName.replace(/ar:cat:/g, "").slice(0, -1);
            
                        argos.tracking.set(this, "Category Landing Brands Component", {
                              eVar10 : title+':'+location,
                              eVar49 : basetag2+location+':'+title+':visualbrowse:',
                              eVar41 : basetag2+location+':'+title+':visualbrowse:'
                        });         

            });         
            
            carousel.bind('click', function() { 
            var location = s.pageName.replace(/ar:cat:/g, "").slice(0, -1);
            var position = $(this).closest('dl').find('.carouselItemNumber').text().replace(".","");
           if(isLatestOffers)
                    position = $(this).closest('dl').index();
            var partNo = $(this).parent().parent().find('.partnum').text();
            var pageNameSplit = s.pageName.split(':');
            var level2Cat = pageNameSplit[2];
            if(level2Cat == 'pricecuts')
               level2Cat = pageNameSplit[3];
            argos.tracking.set(this, "Category Landing Carousel", {
                    eVar44 : basetag+pageNameSplit[pageNameSplit.length-2]+':hero'+position+':'+partNo,
                    eVar49 : basetag+level2Cat+':hero'
            });               
            });
      }
      

});




/*******************************************************************************
* Custom Omniture tagging for "What's hot"
******************************************************************************/
argos.tracking.whatshot = (new function() {
      var basetag  = "ar:cat:whatshot:";
      var suffix = ":whatshot:"; 
      
      function captureProduct(position,partNumber) {
            var location = argos.tracking.location.get();
            var value = argos.tracking.cleanString(location.join(':')); 
            //argos.url.extractCatValues()[0].text
        var level2Cat = s.pageName.split(':')[2];        
            var rviLister = $('body.rviLister').length>0?true:false;
            var searchLister = $('body.searchResultsNone').length>0?true:false;
        var first = rviLister?"recentlyviewed:lister":searchLister?"searchlist":level2Cat;            
            first = argos.tracking.cleanString(first);      
            argos.tracking.set(this,"Whats Hot Product", {        
                  eVar44 : basetag+position+':'+partNumber+':',
                  eVar49 : 'ar:'+first+suffix,
                  eVar41 : 'ar:'+value+suffix
            });         
      }
      this.captureProduct = captureProduct;
      this.init = function() {
            var $products = $('#whatsNew .product');
            
            $products.each(function(i) {
                  var $links = $(this).find('.image a , .title a');
                  var partNumber = $(this).find('.partnum').text();
                  i = i+1;
                  $links.bind("click", function() {                     
                        captureProduct(i,partNumber);                                                 
                  });               
            });
            
      }     
});


/*******************************************************************************
* Custom Omniture tagging for QVC
******************************************************************************/
argos.tracking.qvc = (new function() {
      
      var properties = {};
      var basetag  = "ar:quickview:";

      this.captureSubmit = function(url) {
            var newUser = argos.url.getParameter(url, "edit") == "registeruser";
            var user = new argos.classes.User();
            if(url.indexOf("gethelp") >= 0) {
                  argos.tracking.set(this, "Forgotten Password", {
                        prop25 : basetag + "forgottenpassword:"
                  });         
            }
            else {
                  argos.tracking.set(this, "Continue", {
                        prop4 : basetag + (user.getState() == "RECOGNISED" ? "knownuser" : (newUser ? "newuser:" : "existinguser:"))
                  });
            }
      }
      
      this.captureEmail = function(url) {
            var email = argos.url.getParameter(url, "logonId");
            argos.tracking.set(this, "Continue", {
                  prop37 : email,
                  eVar37 : email
            });
      }
      
      this.captureSuccessfulLogin = function() {
            argos.tracking.set(this, "Successful Login", {
                  events : "" 
                  /*
                  * events value should be "event5" but adding this results in
                  * "event5,event5". Leaving as blank "" results in "event5". Have no
                  * idea where that's coming from.
                  */
            });         
      }
});




/*******************************************************************************
* One Click Confirmation
******************************************************************************/
argos.tracking.oneClickConfirmation = (new function() {     

      this.shuttle = function(lightboxForm) {
            var shutContent = lightboxForm.parent().parent().parent();
            var submit = lightboxForm.find('.submit');            
            //on load
            argos.tracking.set(this, "Oneclick Shuttle Offered", {
                  prop24 : 'shutloffered'                         
            });         
            submit.bind('click', function() {
                  argos.tracking.set(this, "ar:trolley:reservation:confirmationpage:shutl", {
                  
                  });   
            });         
      }
      
      this.init = function() {            
            var confirmationDetails = $('#confirmationDetails');
            // check to see if this is CSO
            var iscso = confirmationDetails.find('#iscso').length;            
            var firstProductNumber = $('.reservedItems .partnum').first().text()
            var productQty = confirmationDetails.find('#qty').text();         
            var price = $('.reservedItems .price .main').first().text().replace(" ","").replace("£","");
            var totalPrice = parseFloat(productQty*price).toFixed(2);
            var setEvent, setProduct, setCancel, setCancelEvent
            var store = $('.reservationInfo .store').text().replace(" ","");
            var resNo = confirmationDetails.find('.resNo').text();
            var confirmEssentialExtra = confirmationDetails.find('#pdpEssentialExtras a');
            var cancelReservation = confirmationDetails.find('#receipt .cancel');

            if (iscso == 1) { //if cso
                  setProduct = 'event54='+productQty+'|'+'event55='+totalPrice+'|'+
                  'event61='+productQty+'|'+'event62='+totalPrice+';';
                  setEvent = 'event53,event54,event55,event61,event62'; 
                  setCancel = ';;;event56=1|event59=1';
                  setCancelEvent = 'event56,event59';
            } else { //if not cso
                  setProduct = 'event54='+productQty+'|'+'event55='+totalPrice+'|'+
                  'event63='+productQty+'|'+'event64='+totalPrice+';';
                  setEvent = 'event53,event54,event55,event63,event64';
                  setCancel = ';;;event56=1';
                  setCancelEvent = 'event56';
            }           
            argos.tracking.set(this, "one click confirmation details", {
                  pageName : 'ar:trolley:reservation:confirmationpage:oneclick:',
                  prop4 : 'ar:trolley:reservation:confirmationpage:oneclick:',
                  prop9 : resNo,
                  prop24 : 'shutlnotoffered',               
                  channel : 'ar:trolley',
                  events : setEvent,
                  products : ';'+firstProductNumber+';;;'+setProduct,
                  eVar13 : 'Reserve',
                  eVar18 : store,
                  eVar20 : resNo          
            });

            confirmEssentialExtra.bind('click', function() {
                  argos.tracking.set(this, "Oneclick Confirm Essential Extras", {
                        var49 : 'ar:reservationconfirmation:essentialextra:',
                        prop41 : 'ar:reservationconfirmation:essentialextra:' 
                  });   
            });
            cancelReservation.bind('click', function() {
                  argos.tracking.set(this, "Oneclick Cancel Reservation", {
                        prop4 : 'ar:trolley:oneclick:cancellation:',
                        prop25 : 'ar:trolley:oneclick:cancellationyes:',
                        products : ';'+firstProductNumber+';;;event56=1',
                        events : setCancelEvent
                  });   
            });
      }
      

});



/*******************************************************************
* Location - to be replaced with argos.tracking.extractCatValues()
********************************************************************/
argos.tracking.location = (new function() {
      this.get = function() { 
            var results = [];
            
            var $body = argos.page.elements["body"];
            if ($body.hasClass("home")) {             
                  results.push('homepage')
            } else if ($body.hasClass("tvPage")) {
                  results.push('argostv')
            } else {
                  var pageName = s.pageName.replace(/ar:cat:/g, "").slice(0, -1);
                  results.push(pageName)
            
            }
            return results;
      }
      this.parseCategory = function(category) {
            if(category && category.split('|').length == 4){
                  category = category.split('|')[2];
            }
            return category;
      }
});

/*******************************************************************************
* Common QVP Lightbox tags for both PDP and Listers called from QVP ACTIVATEE
******************************************************************************/
argos.tracking.qvp = (new function() {
	this.activated = function(){
		var sProp4, type;
		
		if (argos.page.elements.body.hasClass('searchResults')) {
			// Search Lister
			sProp4 ='ar:search:mercadoresultslist:quickinfo:';
		} 
		else { 
			if (argos.page.elements.body.hasClass('lister')){
				// Browse Lister
				sProp4 = argos.tracking.cleanString(argos.tracking.location.get().join(':'))+':quickinfo:';
			}  
			else {
				// PDP 
				// PPP (Product Purchase Page - Add To Trolley) shares the same class and markup (it shouldn't!).
				if (argos.page.elements.body.hasClass("pdp")) {
					sProp4 = "ar:" + argos.tracking.identifier + ":" + _parentArea($(this).parents(".pdpRelatedInformation").attr("id")) + ":quickinfo:";			
				}
			}
		}
		
		argos.tracking.set(this, "Quick View Activated", {
			prop4: sProp4,
			products : ";" + argos.utils.partNumberFromParentProduct.call(this)                      
		});
	}

	function _parentArea(parent) {
		var area = "unknown";
		switch(parent){
        	case "pdpEssentialExtras" : area = "essentialextras"; 
        		break;
        	case "pdpAdditionalItems" : area = "youmayalsolike"; 
        		break;
        	case "pdpPromotions" : area = "specialoffers"; 
        		break;
        	case "pdpAlternativeProducts" : area = "alternatives"; 
        		break;
        	case "pdpAlsoInThisRange" : area = "alsointhisrange"; 
        		break;
		}
		return area;
	}
});


/*******************************************************************************
* Initialise tagging events.
******************************************************************************/
$(window).load(function() {   
      
      //initiate tagging for specific pages 
      var $body = argos.page.elements["body"];
      var listerPageTag = 'ar:cat:';      
      var basetagVar = 'ar:cat:';
      var $rvi = $('#recentlyViewed');
      var $whatshot = $('#whatsNew');
      
      // Quickview
      $(".QpiActivator").each(function() {
            $(this).click(function() {
                  argos.tracking.page.capture();
                  argos.tracking.quickinfo.update();
                  argos.tracking.quickinfo.send();
                  argos.tracking.page.reset();
            });
      });
      
      //on load 
      argos.tracking.question.init();
      argos.tracking.globalNav.init();

      
      if ($rvi.length) {
            argos.tracking.rvi.init();    
      }
      if ($whatshot.length) {
            argos.tracking.whatshot.init();
      }
      if ($body.hasClass("lister")) { 
            if ($body.hasClass("searchResults")) {
                  var listerPageTag = 'ar:searchlist:';
            }                 
            argos.tracking.lister.init(listerPageTag)
      }
    
      if ($body.hasClass("pdp")) {        
            //argos.tracking.pdp.init();
      }
      if ($body.hasClass("category")) {         
            argos.tracking.catlanding.init();
      }
      if ($body.hasClass("oneClickConfirmation")) {         
            argos.tracking.oneClickConfirmation.init();
      }      
});

$(document).ready(function() {
      // Stock Availability Page
      if($('body').is('#stockAvailability')) {
            // OOSR Tags

            // 3.1.1 Alternative products option show
            if(document.getElementsByClassName('toggleAlternativeProducts').length > 0) {
                  argos.tracking.set(document.getElementsByClassName('toggleAlternativeProducts')[0], 'StockAvailabilityPage-ShowAlternativeProductsShown', {
                        products: s.products,
                        events: 'event74'
                  });
            }

            // 3.1.2 Alterantive products option click
            $('span.toggleAlternativeProducts').click(function () {
                  if($(this).text() === 'Show Alternative Products') {
                        argos.tracking.set($(this), 'StockAvailabilityPage-ShowAlternativeProductsClick', {
                              products: s.products,
                              events: 'event73'
                        });
                  }
            });

            // 3.1.3 Alternative products quick view
            $('dl.oosrProduct button').click(function() {
                  argos.tracking.set($(this), 'StockAvailabilityPage-QuickView', {
                        products: s.products,
                        events: 'event67'
                  });
            });

            // 3.1.4 Alternative products add to trolley
            // This is in page.js, line 587

            // 3.2.1 Select Home Delivery (location known)
            $('#checkOtherStores button').click(function() {
                  argos.tracking.set($(this), 'StockAvailabilityPage-CheckOrderForHomeDelivery', {
                        products: s.products
                  });
            });

            // 3.2.2 Check for Home Delivery (location unknown) - eComm
            $('div.checkStocks a').click(function() {
                  argos.tracking.set($(this), 'StockAvailabilityPage-CheckOrderForHomeDelivery', {
                        products: s.products
                  });
            });

            // 3.2.3 Check for Home Delivery (location unknown) - eComm + mComm
            $('homeDeliveryForm').submit(function() {
                argos.tracking.set($(this), 'StockAvailabilityPage-CheckOrderForHomeDelivery-PostCodeCheck', {
                      products: s.products
                });
            });
            

            // 3.3.1 Stock Availability Page - Partial Stock
            $('a:contains("Update Quantity")').each(function(index) {
                  // Get part number from this link element
                  var disPartNumber = $('a.updateQuantity').closest('tr').find('.catnumber').text().replace('/' ,'');
                  var disStoreNum = $('input[name=storeId]').val().trim();
                  argos.tracking.set($(this), 'StockAvailabilityPage-PartialStock', {
                        products: disPartNumber,
                        events: 'event7=1evar16=' + disStoreNum
                  });
            });

            // 3.3.2 Stock Availability Page - Update quantity
            $('a:contains("Update Quantity")').click(function() {
                  argos.tracking.set($(this), 'StockAvailabilityPage-UpdateQuantity', {
                       products: s.products
                  });
            });

            // 3.3.3 Update quantity reminder - display
            // This is in page.js

            // 3.3.4 Update quantity reminder - customer selection
            // This is in page.js
      }
});