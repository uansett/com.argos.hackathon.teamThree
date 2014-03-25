argos.page = (new function() {
	var _global = {
		menu : function() {
			$.ajax({
				url : "/webapp/wcs/stores/servlet/FetchDropdownMenuContentView?storeId=" + argos.app.storeId + "&langId=" + argos.app.langId,
				success : function(html) {
					argos.page.menu = new argos.classes.Menu($("#menu"), $(html), "ddm_");
				}
			});
		},

		search : function() {
			
			$("#sb .submit").click(function() {
				if( $('#sb input.text').val() == "" || $('#sb input.text').val() == "Search by word or catalogue number" ) {
					return false;
				}
	    	});
			
			var $sf = $("#search form");
			var $sfText = $("input[type='text']", $sf);
			var sfInitTextValue = $sfText.val();
			
			$sf.bind("submit", function() {
				return argos.validation.applySearchValidation();
			});
			
			$sfText.focus(function() {
				if(sfInitTextValue == this.value){
					this.value = '';
				}
				this.select();
			});
			//clear compared products
			if(!($("body").hasClass("productcompare") || $("body").hasClass("lister"))){
				argos.page.user.compareClear();
			}
		},
		
		messages : function() {			
			// Set up queue for any product messages.
			argos.messages.productQueue = new argos.classes.ProductQueue();
			
			// Look for and set up Help/Information messages
			$.ajax({
				url : argos.app.contentDir + "messages.htm",
				success : function(html) {
					if(html.match(/^<dl>.*?<\/dl>$/gim)) { 
						argos.messages.html = html;
					}
					else {
						"<dl></dl>";
					}
					$(document).ready(function() {
						argos.messages.createActivators();
					});
				}
			});
			
			// Fetch product information for those added to queue.
			$(window).load(function() {
				var xhr = argos.messages.productQueue.get();
				if(xhr) {
					xhr.done(function(html) {
						argos.messages.addProducts($(html).filter(".product"))
					});
				}
			});
		},
		
		qvc : function() {
			// QVC (User recognition / Sign in dropdown)
			argos.page.qvc	= new argos.classes.RecognitionController({
				activators : "a.logIn, a.myAccount",
				activateeId : "qvc",
				container : "#personal .userInformation",
				salutation : ".salutation",
				maxNameSize : 18
			});
		},
		
		qvt : function() {
			// QVT (Quick View Trolley)
			var offset = $("#personal .trolleyInformation").offset();
			if (offset != null) {
				var offsetLeft = (offset.left + $("#personal .trolleyInformation").width()-430);
				argos.page.qvt = new argos.classes.QvtActivator(
					$("#personal .trolleyInformation").get(0), 
					new argos.classes.QvtActivatee({
						displayLimit : 3,
						left: offsetLeft,
						top: "40"
					}, argos.page.user)
				);
			}
			
		},
		
		rvi : function() {
			// RVI (Recently View Items)
			var rvi = new argos.classes.RviController($("#recentlyViewed").get(0), argos.page.user, {
				displayLimit : 3,
				removeButtonText : "remove",
				titleElement : "h2"
			});
			
			argos.page.rvi = rvi;
			if(rvi && rvi.$node) {
				rvi.fetch().done(function() {
					rvi.display();
					if(rvi.list().length > 0) {
						//restrict what's new to 3 items max
						$("#whatsNew .product").slice(3).hide();
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
	 
});





/* Initialise global site features
 *********************************/
$(document).ready(function() {
	// set up fasttrack messaging
	fasttrackMessaging.init();
	
	var initialise = new Array("menu", "search", "messages", "qvc", "qvt", "rvi");
	
	//set listener
	argos.fulfulment = self.setInterval(function(){
		var fulfilmentLoaded = $('#fulfilment .tabs_section');
		if (fulfilmentLoaded.length) {
			stopInt();
		}
	},2000);	
	var stopInt = function() {		
	      $(".formValues").focus(function() { 
	            this.value = "";
	      }).blur(function() {
	               if($(this).val() == '') {
	                   $(this).val('Postcode');
	               }
	      });
		window.clearInterval(argos.fulfulment)
	}

	
	//stop interval
	
	
	
	//clear on focus
	argos.page.formValues = function() {
		$(".formValues").click(function() {		
			this.value = "";
		});	
	};
	argos.page.formValues();
	
	
	//alert(initialise);
	// Initialise user
	argos.page.user = new argos.classes.User();
	
	// Initialise trolley
	argos.trolley = new argos.classes.Trolley();
	
	// Common lookups and reusable elements
	argos.page.elements = {
		body : $(document.body),
		main : $("#main"),
		lightbox : new argos.classes.LightboxActivatee({id:"lightbox"}),
		mandatoryLoginLightbox : new argos.classes.MandatoryLoginActivatee(),
		messageActivatee : new argos.classes.MessageActivatee()
	}		
	
	// Control initialised components and features
	if(argos.page.elements.body.hasClass("tvPage")) {
		initialise = new Array("rvi");
	}
	
	for(var i=0; i<initialise.length; ++i) {
		argos.page.init(initialise[i]);
	}

	// Enable CSS support for JS hidden elements. 
	argos.page.elements.body.addClass("jsEnabled");
});



/* Initialise page specific features
 ***********************************/
$(document).ready(function() {
	var $body = argos.page.elements["body"];
	
	// Category.
	if($body.hasClass("category")) {
		var $brands = $("#brands");
		var $brandsText = $("#brands_text");
		
		// Brand list expand/collapse
		if($brands.length > 0 && $brandsText.length > 0) {
			new argos.classes.Expander({
				container : $brands.get(0),
				openText : "Show all brands +",
				closeText : "Hide all brands -",
				hidden : $("#brands_text")
			});
		}				
	}
	
	// RviLister
	if(argos.page.elements["body"].hasClass("rviLister")) {
		$("#products .product").each(function(i) {
			var $product = $(this);
			var partNumber = $(".partnum", this).text();
			var number = i+1;
			var activator = argos.page.rvi.removeActivator(this, number);
			activator.$node.unbind("click");
			activator.$node.click(function() {
				argos.page.rvi.remove(partNumber);
				window.location.reload();
			});
			$product.parent().append(activator.node);					
		});
	}
	
	// PDP
	if(argos.page.elements["body"].hasClass("pdp")) {
		$(window).load(function() {
			// argos.pdp.product set up in document.ready after one we're
			// in so add to window.load to make sure it's there before using.
			argos.page.rvi.add(argos.pdp.product.number);
		});
	}	
	
	
	
	// Sign In only 
	if($body.hasClass("login")) {
		$("#userRecognition").each(function() {
			// Bit hacky, but reusing toggle functionality originally designed for QVC, now in page version.
			argos.classes.RecognitionActivatee.prototype.addLoginFormToggle.call(this);
			$("input[type='radio']", this).each(function() {
				var $this = $(this);
				if($this.attr("checked") == "checked") {
					$this.click();
				}
			});
		});
		
		//  login/registration info boxes
		$('.login form input[name="edit"]').on('change', function(e) {
			var inputVal = $(this).val();
			var $loginBoxes = $('.login form .loginInfoBox');
			var $loginBox = $loginBoxes.filter('.' + inputVal);
			var $form = $(this).closest('form');
			
			if ($loginBox.length) {
				$loginBoxes.not($loginBox).hide();
				$loginBox.show();
			}
			
			var isCollectionSignin = $('.signIn.reservation').length > 0;
			if (isCollectionSignin) {
				// change text in submit button on collection page only
				var isLoginButton = inputVal == 'loginuser';
				var submitButtonText = isLoginButton ? 'Sign in securely' : 'Continue';
				
				$form.find('.loginButtons .button.progressive').val(submitButtonText);
				
				// show forgotten password note
				if (isLoginButton) {
					$form.find('.forgotPasswordNote').show();
				} else {
					$form.find('.forgotPasswordNote').hide();
				}
			}
		});
		
        $('.login #forgotPassword').on('click', function(e) {
            e.preventDefault();
            var $loginForm = $('#registerUserFormEcom');
            var $forgottenPasswordOuter = $('.forgottenPasswordOuter');
            var $logonId = $loginForm.find('input[name="logonId"]');

            $forgottenPasswordOuter.find('#forgottenEmail').val($logonId.val());
            $('.forgottenPasswordOuter').show();
            $('.signIn').hide();
        });

	    // cancel fogotten password form
	    $('.login .cancelButton').on('click', function(e) {
            e.preventDefault();
            $('.forgottenPasswordOuter').hide();
            $('.signIn').show();
	    });

    
		$('.login form .signinUser').on('click', function(e) {
			e.preventDefault();
			// $('.login form #loginuser').prop('checked', true);
			$('label[for="loginuser"] input').click().click();
		});
		
		$('.forgottenPasswordOuter .forgottenPasswordNote a').on('click', function(e) {
			e.preventDefault();
			var $loginForm = $('#registerUserFormEcom');
            var $forgottenPasswordOuter = $('.forgottenPasswordOuter');
            var $logonId = $forgottenPasswordOuter.find('input[name="logonId"]');
            
            $loginForm.find('input[name="logonId"]').val($logonId.val());
            
			$('.forgottenPasswordOuter').hide();
			$('.signIn').show();
			$('#registeruser').click();
		});
		
		// display forgotten password form if submitted
		
		if ($('.forgottenPasswordOuter.forgottenPasswordFormSubmitted').length) {
			var $loginForm = $('#registerUserFormEcom');
			var $forgottenPasswordOuter = $('.forgottenPasswordOuter');
			
			// move error message from login form to forgotten password form
			$('.forgottenPasswordOuter.forgottenPasswordFormSubmitted .errorMessageContainer').append($('#registerUserFormEcom .errorMessageContainer > *'));
			$forgottenPasswordOuter.find('.errorMessageContainer').append($loginForm.find('.errorMessageContainer > *'));
			// move css error classes from login form to forgotten password form
			$loginForm.find('input[type="text"]').each(function() {
				var $correspondingForogttenPwField = $forgottenPasswordOuter.find('input[name="' + $(this).attr('name') + '"]');
				//  copy error css classes
				if ($(this).hasClass('errorField')) {
					$correspondingForogttenPwField.addClass('errorField');
					$(this).removeClass('errorField');
	}
				// copy values
				$correspondingForogttenPwField.val($(this).val());
			});
		}
	
	}
	
	// Trolley
	if($body.hasClass("trolley")) {
		/**
		new argos.classes.MandatoryLoginActivator({
			activator: $("#buyForHomeDeliveryButton").get(0),
			activatee: argos.page.elements.mandatoryLoginLightbox,
			user: argos.page.user
		});
		**/
		if($("body#pgPaymentDetails").length > 0) {
			argos.page.user.limitSession();
		}
	}
	
// START -  Added for new RVI items in order confirmations //
	if ($body.attr('id') == 'orderConfirmation') {
		var rvi = new argos.classes.RviController($("#recentlyViewed").get(0), argos.page.user, {
			displayLimit : 3,
			removeButtonText : "remove",
			titleElement : "h2"
		});
		
		argos.page.rvi = rvi;
		$("#recentlyViewed .product").each(function(i) {
			var $product = $(this);
			var partNumber = $(".partnum", this).text();
			var number = i+1;
			var activator = argos.page.rvi.removeActivator(this, number);
			activator.$node.unbind("click");
			activator.$node.click(function() {
				argos.page.rvi.remove(partNumber);
				window.location.reload();
			});
			$product.parent().append(activator.node);					
		});
		
	}
	
	
	// scene7 (multiple pages)
	if($body.is(".home, .category")) {
		new S7Video({server : "http://argos.scene7.com"});
		$(".bauComponentRow .s7video-button").parents(".mediaPlayer").addClass("scene7Player");
	}
	
	// Login and Registration
	if($body.hasClass("login") || $body.hasClass("account")) {
		var HIDE_HELP = "fieldHelpTextHidden";
		var $togglers = $(".toggleHelpText");
		$togglers.parent().addClass(HIDE_HELP);
		
		$togglers.focus(function() {
			$(this.parentNode).removeClass(HIDE_HELP);
		});
		
		$togglers.blur(function() {
			$(this.parentNode).addClass(HIDE_HELP);
		});
	}
	
	// Quickview (multiple pages).
	if($body.is(".lister, .pdp, .offerdetails, .productcompare, #stockAvailability")) {
		var qvpActivatee = new argos.classes.QvpActivatee();
		argos.page.elements.qvp = qvpActivatee.$node;
		
		$("#main dl.product, #yourDetailsReserveForm dl.oosrProduct").not('#main dl.noquickview, .product_selector').each(function() {
			new argos.classes.QvpActivator({
				container : $(".actions", this),
				product : this,
				activatee : qvpActivatee
			});
		});
		
		argos.page.elements.checkStockActivatee = new argos.classes.CheckStockActivatee();
		$("#checkStockGo, #emailOutOfStock, .emailMe").each(function () {
			new argos.classes.CheckStockActivator(this, argos.page.elements.checkStockActivatee);
		});
	}
	
	//StoreAvailabilityView
	if($body.is("#stockAvailability")) {
		
		//Show lighbox on PayNow Button
		$('input[name="payNow"], input[name="continue"]').click(function(e){
			
			e.preventDefault();
			
			if(document.getElementById('payForAllItemsNow').length > 0) {
				document.getElementById('payForAllItemsNow').value = 'true';
			}
			if($(this).attr('name') === 'payNow') {
				$('#yourDetailsReserveForm').append('<input class="hidden" name="payNow.x">');
			}
			
			if( null != document.getElementById('partialOOSProduct'))
			{
				// Omniture tagging for showing partial oos lightbox
				argos.tracking.set($(this), 'StockAvailabilityPage–PartialQuantityRemindDisplay', {
					products: s.products
				});
				var productOOS = $("#productOOSInfoFinal").val();
				var productOOSArray = new Array();
				var productOOSProductInfo = new Array();
				var lightBoxStartHTML = "<div id='storeAvailabilityPayNowPopup'><a class='button close' onclick='LightBox.hideLightBox();LightBox.hideOverlay();'>Close X</a><p class='oosProductHeading'>Some of your products are not available in the quantity you requested</p><p style='text-align: center; line-height: 1.5;'>";
				var lightBoxMiddleHTML = "";
				productOOSArray = productOOS.split(";");
				for(var i = 0;i<productOOSArray.length;i++){
					  productOOSProductInfo = productOOSArray[i].split(":");
					  lightBoxMiddleHTML = "<span>" + lightBoxMiddleHTML + "<strong>"+productOOSProductInfo[2]+"</strong> " + productOOSProductInfo[0] + "<br><strong>"+productOOSProductInfo[1]+"</strong>"+ " available</span><br><br>";
				}
				
				if($(this).attr('name') === 'payNow') {
					var lightBoxEndHTML = "</p><p class='payNowPopupQuestion'><span>Do you want to continue with just the available items?</span></p><div class='textaligncenter'><span><a id='oosrPopupContinueLink' class='button' onclick='argos.tracking.set(null, &#39;StoreAvailabilityPage-PartialQuantityReminder-YesContinue&#39;, {products:s.products});$(&#39;input[name=&quot;continueWithAvailableQuantities&quot;]&#39;).val(&#39;true&#39;);LightBox.hideLightBox();LightBox.hideOverlay();reserveForm();'>Yes, continue</a></span><span class='paddingLeftTwo'><a class='button' onclick='argos.tracking.set(null, &#39;StoreAvailabilityPage-PartialQuantityReminder-NoUpdateOrder&#39;, {products:s.products});LightBox.hideLightBox();LightBox.hideOverlay();'>No, update order</a></span></div></div>";
				} else {
					var lightBoxEndHTML = "</p><p class='payNowPopupQuestion'><span>Do you want to continue with just the available items?</span></p><div class='textaligncenter'><span><a id='oosrPopupContinueLink' class='button' onclick='argos.tracking.set(null, &#39;StoreAvailabilityPage-PartialQuantityReminder-YesContinue&#39;, {products:s.products});$(&#39;input[name=&quot;continueWithAvailableQuantities&quot;]&#39;).val(&#39;true&#39;);LightBox.hideLightBox();LightBox.hideOverlay();validateReservationFormDetails();'>Yes, continue</a></span><span class='paddingLeftTwo'><a class='button' onclick='argos.tracking.set(null, &#39;StoreAvailabilityPage-PartialQuantityReminder-NoUpdateOrder&#39;, {products:s.products});LightBox.hideLightBox();LightBox.hideOverlay();'>No, update order</a></span></div></div>";
				}
				var finalLightBoxHTML = lightBoxStartHTML+lightBoxMiddleHTML+lightBoxEndHTML;

				LightBox.setHTML(finalLightBoxHTML);
				LightBox.showOverlay();
				LightBox.showLightBox();
				return false;
			}
			else {
				// If we clicked the reserve button, then validate the e-mail & mobile
				if($(this).attr('name') === 'continue') {
					validateReservationFormDetails();
				} else if($(this).attr('name') !== 'continue') {
					reserveForm();
				}
			}
		});

		// Remove payNow.x when you change to reserve
		$('#changeToReserve').click(function() {
			$('input[name="payNow.x"]').remove();
		});

		// Toggling Alternative Products
		$('.toggleAlternativeProducts').click(function() {

			if($.browser.msie && parseInt($.browser.version) == 9 )
			{ 
				/********************************************************************************************************************/
				if ($(this).text().trim() === 'Show Alternative Products') 
				{
					// Close any open alternative products sections
					$('tr.alternativeProductsRow').each(function() {
						if($(this).css('display') !== 'none') 
						{
								$(this).toggle();
								$(this).find('.message').parent().toggle();
								$(this).prev().children().children('div').children('span:first').text('Show Alternative Products');
						}
					});
						
					$(this).parent().parent().parent().next().toggle();
					$(this).parent().parent().parent().next().children('td').children('div:first').show();  
					$(this).text('Hide Alternative Products');
					$(this).parent().parent().parent().next().children('td').css({
					       	'background':'url("https://argos.co.uk/wcsstore/argos/en_GB/images/p2/newtrolley/img/trolleylist_basic_td_bg.gif")',
					        'background-position': 'bottom left',
							'background-repeat': 'repeat-x'
				    });
				} else 
				{
									if ($(this).text().trim() === 'Hide Alternative Products') 
									{
										$(this).parent().parent().parent().next().children('td').children('div:first').show(); 
										$(this).parent().parent().parent().next().toggle(); 
										$(this).text('Show Alternative Products');
										$(this).parent().parent().parent().next().children('td').css('background','none');
									}
				}
				/********************************************************************************************************************/
			} else 
			{
				if ($(this).text().trim() === 'Show Alternative Products') {
				// Close any open alternative products sections
					$('tr.alternativeProductsRow').each(function() {
						if($(this).css('display') !== 'none') {
								$(this).slideToggle('slow');
								$(this).find('.message').parent().slideToggle('slow', function() {
									$(this).parent().parent().prev().children().children('div').children('span:first').text('Show Alternative Products');
								});
							}
						});
						
						$(this).parent().parent().parent().next().slideToggle('slow');
						$(this).parent().parent().parent().next().children('td').children('div:first').slideToggle('slow', function() {
								$(this).parent().parent().prev().children().children('div').children('span:first').text('Hide Alternative Products');
						});
						$(this).parent().parent().parent().next().children('td').css({
					        	'background':'url("https://argos.co.uk/wcsstore/argos/en_GB/images/p2/newtrolley/img/trolleylist_basic_td_bg.gif")',
					        	'background-position': 'bottom left',
								'background-repeat': 'repeat-x'
				    });
				} else {
					if ($(this).text().trim() === 'Hide Alternative Products') {
						$(this).parent().parent().parent().next().children('td').children('div:first').slideToggle('slow');
						$(this).parent().parent().parent().next().slideToggle('slow', function() {
							$(this).prev().children().children().children('span:first').text('Show Alternative Products',function(){
								$(this).parent().parent().parent().next().children('td').css('background','none');
								});
						});
						
					}
				}
			}
			
		});
		// Attach scroll event to home delivery text
		$('div.checkStocks a').click(function() { 
			target = $('#improvedInventory');
			$('html,body').animate({scrollTop: target.offset().top}, 1000);
		});
		// When the ajax is finished for loading the quick view,
		// we need to update the quantity box + add link to Add button
		$(document).ajaxComplete(function(event, request, settings) {
			if(settings.url.indexOf('RelatedQuickView') >= 0) {				
				$('#Quantity').html('');
				// Requested quantity of clicked product
				requestedQuantity = '#' + settings.url.split('/partNumber/')[1].split('.htm')[0] + '_parentQuantity';
								
				for(var i = 1; i <= $(requestedQuantity).val(); ++i) {
					if(i === parseInt($(requestedQuantity).val())) {
						$('#Quantity').append('<option selected="1">' + i + '</option>');
					} else {
						$('#Quantity').append('<option>' + i + '</option>');
					}
				}
				// Add button link
				$('#oosrAddToTrolley').click(function(){
					// Send omniture tags
					argos.tracking.set($(this), 'StockAvailabilityPage-QuickView-AddToTrolley', {
						products: s.products,
						events: 'scAdd'
					});
					// Attach submit handler to form on the quick view
					event.preventDefault();
					// Build URL
					oosQuantity = $('#Quantity').val();
					oosPartNumber = $('div#quickInfo span.partnumber').text().replace('/', '');
					oosOrderID = $('.orderID:first').val();
					oosPostcode = $('input[name="postcode"]').val();
					oosSelectedStore = $('input[name="selectedstore"]').val();
					// IE9 window.location.origin fix
					if(!window.location.origin) {
						window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
					}
					oosHrefAdd = window.location.origin + '/webapp/wcs/stores/servlet/ArgosReserveAvailability?addAlternativeItem_' 
					+ $('input.orderID').val() 
					+ '=_' + oosSelectedStore 
					+ '&partNumber=' + oosPartNumber 
					+ '&quantity=' + oosQuantity 
					+ '&orderId=' + oosOrderID 
					+ '&selectstore=' + $('input[name="selectstore"]').val() 
					+ '&qasDisplayTerm=' + $('input[name="qasDisplayTerm"]').val();


					//oosHrefAdd = window.location.origin + '/webapp/wcs/stores/servlet/ArgosReserveAvailability?addAlternativeItem_' + $('input.orderID').val() + '=_' + oosSelectedStore + '&partNumber=' + oosPartNumber + '&quantity=' + oosQuantity + '&orderId=' + oosOrderID;
					// Go
					window.location = oosHrefAdd;
				});
			}
		});
	}
});

var fasttrackMessaging = (function() {
	// start fasttrack

	// fasttrackMouseOutTimeout: time in milliseconds between moving mouse out of popup area before closing
	var fasttrackMouseOutTimeout = 2 * 100;
	var fasttrackMouseOutTimer;

	function init() {
		addEvents();
	}

	function addEvents() {

		// start fasttrack messaging
		// Removed '.fasttrackDeliveryInfo .fasttrackLogo' as popup doesn't need to be shown when hovering over fast track logo.
		$(document).on('mouseover', '.ftInfoIcon, .fasttrackDeliveryInfo .fieldInformation, .fasttrackDeliveryInfo .fasttrackPopup', handleFasttrackMouseover);
		$(document).on('mouseout', '.ftInfoIcon, .fasttrackDeliveryInfo .fieldInformation, .fasttrackDeliveryInfo .fasttrackPopup', handleFasttrackMouseout);
		$(document).on('click', '.fasttrackDeliveryInfo .fieldInformation', handleFasttrackClick);
		$('body').on('click', handleBodyClick);
		// end fasttrack messaging	
	
	
	}

	function toggleFasttrackPopup($fasttrackDeliveryInfo, $trigger) {
		// find fasttrack popup(s)
		var $fasttrackPopup = $fasttrackDeliveryInfo.find('.fasttrackPopup');
		// toggle visibility of popup(s)
		if ($fasttrackPopup.is(':visible')) {
			showFasttrackPopup($fasttrackDeliveryInfo, $trigger);
		} else {
			hideFasttrackPopup($fasttrackDeliveryInfo, $trigger);
		}
	}

	function showFasttrackPopup($fasttrackDeliveryInfo, $trigger) {
		// find fasttrack popup(s)
		var $fasttrackPopup = $fasttrackDeliveryInfo.find('.fasttrackPopup');
		// check that popup is hidden
		if (!$fasttrackPopup.is(':visible')) {
			$fasttrackPopup.show();
			// position popup tab relative to the element that was clicked/tapped
			var $fasttrackPopupTab = $fasttrackPopup.find('.fasttrackPopupTab');
			var leftPost = $trigger.offset().left - $fasttrackPopup.offset().left + $trigger.width()/2;
			$fasttrackPopupTab.css({'left': Math.round(leftPost) + 'px'});
		}
	}

	function hideFasttrackPopup($fasttrackDeliveryInfo) {
		// find fasttrack popup(s)
		var $fasttrackPopup = $fasttrackDeliveryInfo.find('.fasttrackPopup');
		if ($fasttrackPopup.is(':visible')) {
			$fasttrackPopup.hide();
		}
	}

	// start event handlers

	function handleFasttrackClick(e) {
		// stop links from being followed
		e.preventDefault();
		// stop event from reaching body where popup will be closed
		e.stopPropagation();
		toggleFasttrackPopup($(this).closest('.fasttrackDeliveryInfo'), $(e.target));
		if (fasttrackMouseOutTimer) {
			clearTimeout(fasttrackMouseOutTimer);
		}
	}

	function handleFasttrackMouseover(e) {
		showFasttrackPopup($(this).closest('.fasttrackDeliveryInfo'), $(e.target));
		if (fasttrackMouseOutTimer) {
			clearTimeout(fasttrackMouseOutTimer);
		}
	}

	function handleFasttrackMouseout(e) {
		if (fasttrackMouseOutTimer) {
			clearTimeout(fasttrackMouseOutTimer);
		}
		// store this in _self for access by timeout function
		var _self = this;
		fasttrackMouseOutTimer = setTimeout(function() {
			hideFasttrackPopup($(_self).closest('.fasttrackDeliveryInfo'), $(e.target));
		}, fasttrackMouseOutTimeout);
	}

	function handleBodyClick(e) {
		var $fasttrackDeliveryInfo = $('.fasttrackDeliveryInfo');
		hideFasttrackPopup($('.fasttrackDeliveryInfo'));
		if (fasttrackMouseOutTimer) {
			clearTimeout(fasttrackMouseOutTimer);
		}
	}

	// end event handlers

	// end fasttrack
	
	// public API
	return {
		init: init
	};
})();

$(window).load(function() {
	if(window.location && window.location.href.indexOf("/webapp/wcs/preview/servlet/PreviewStore")>-1){
		var anchors = $("a");
		//alert(anchors.length);
		var buff = "";
		$(anchors).each(function(){
			//buff += $(this).attr("href")+"\n";
			//http://www.wc7st1stage.argos.co.uk/static/Browse/ID72/33006169/c_1/1|category_root|Technology|33006169.htm
			var url = $(this).attr("href");			
			var prefix = "argos.co.uk/static/Browse/ID72/";
			var prefixLoc = url.indexOf(prefix);
			if(prefixLoc>-1){
				// 33006169/c_1/1|category_root|Technology|33006169.htm
				url=url.substring(prefixLoc+prefix.length);
				//buff += url+"\n";
			}else{
				return;
			}
			var queryString = "/webapp/wcs/preview/servlet/Browse?storeId=10151&langId=110";			
			url = url.substring(0, url.length-4);
			var urlTokens = url.split("/");
			for(var i =1; i<urlTokens.length; i++){
				var token = urlTokens[i];
				//buff += token+" ";
				if(i%2==1){
					queryString += "&"+token+"=";
				}else{
					queryString += token;
				}
			}
			$(this).attr("href", queryString);
			buff += queryString;
		});
		//alert(buff);
	}
});

function validateReservationFormDetails() {
	// Continue button initiates form validation and if passed submits Reservation
	var valid_flag = 0;
	var mobile_valid_flag = 0;
	var validationHintMessage = "";
	$('.fieldContextualDetailsEverPresent').show();
	function validationHint(hintMessageText) {
		var hintMessageFirst = '<div class="fieldContextualDetails fieldContextualDetailsError "><div class="br"><div class="bl"><div class="tr"><div class="tl"><div class="arrow"><div class="errorMessage"><p class="singleLine">';
		var hintMessageLast = '</p></div></div></div></div></div></div></div>';
		var hintMessage = hintMessageFirst;
		hintMessage += hintMessageText 
		hintMessage += hintMessageLast;
		validationHintMessage = hintMessage;
		return validationHintMessage;
	};          
	$('input').parent().parent().parent().removeClass("fieldError");
	$('.fieldContextualDetailsError').remove();
	var emailAddress = $('input#emailAddress').val();
	var mobileNumber = $('input#mobileNumber').val();
	if (mobileNumber === "") {
		var mobileEmpty = true;
		}
		else {mobileEmpty = false};
	mobileNumber = $('input#mobileNumber').val().replace(/[^\d]/g, "");
	var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
	var mobileRegex = new RegExp(/^\d{11,15}$/i);
	var mobileFirstRegex = new RegExp();
	var emailValid = emailRegex.test(emailAddress);
	var mobileValid = mobileRegex.test(mobileNumber);
	var firstTwoChars = mobileNumber.substr(0, 2);
	if (!emailValid) {
		$('input#emailAddress').parent().parent().parent().addClass("fieldError");
		validationHint("Please enter a valid email address");
		$('input#emailAddress').parent().parent().parent().append(validationHintMessage);
		$('input#emailAddress').parent().parent().next().css('position', 'static');
		valid_flag = 1;
	}
	if (!mobileValid && !mobileEmpty) {
		$('.fieldContextualDetailsEverPresent').hide();
		$('input#mobileNumber').parent().parent().parent().addClass("fieldError");
		validationHint("Your phone number must be between 11-15 numeric characters");
		$('input#mobileNumber').parent().parent().parent().append(validationHintMessage);
		$('input#mobileNumber').parent().parent().next().next().css('position', 'static');
		valid_flag = 1;
		mobile_valid_flag = 1;
	}
	if (mobile_valid_flag === 0) {              
		if ((firstTwoChars != "07") && (firstTwoChars != "08") && !mobileEmpty) {
			$('.fieldContextualDetailsEverPresent').hide();
			$('input#mobileNumber').parent().parent().parent().addClass("fieldError");
			validationHint("Please enter a mobile phone number starting '07' or '08'");
			$('input#mobileNumber').parent().parent().parent().append(validationHintMessage);
			valid_flag = 1;
		}
	}
	if (valid_flag == 1) {
		return false;
	} else {
		document.getElementById('payForAllItemsNow').value = 'false';
		$("#yourDetailsReserveForm").submit();
	}
}