function findStore(partNumber) {

	var productId =  $("#catentryId").val();
	var qasSearchTerm = $('#postcodeMsg #stock01_OOPS').val();
	var partNumber =partNumber;
	var catEntryId_0 = $("#catentryId").val();
	var quantity = '';
	var actionType = 'searchAction';
	var loading = "<div class='ajaxLoadingFrame'></div>";
	$('div.collectionContainer div.stockOptions').empty();
	$('#checkStock_go').attr("disabled", "disabled");
	$('div.collectionContainer div.stockOptions').append(loading);
	$('.stockOptions .ajaxLoadingFrame').css({'min-width':'100%'});
	// $("input[type=submit]").attr("disabled", "disabled");
	var data = '&productId='+ productId + '&qasSearchTerm=' + qasSearchTerm  
			+ '&partNumber=' + partNumber + '&catEntryId_0='
			+ catEntryId_0 + '&quantity=' + quantity + '&actionType='
			+ actionType;
	$.ajax( {
				url : '/webapp/wcs/stores/servlet/ArgosFindStoreCmd',
				data : data,//data tobe  send to the server (optional)
				type : 'post', //either post or get
				dataType : 'json', //get response as json fron server
				success : function(data) { //this function is called when the ajax function is successfully executed
					if (data != null) {
						
						if (typeof data.errorCode == "undefined" || typeof data.errorMessage=="undefined") {
							if(typeof data.errorText == "undefined"){
							$('div.errorStore').hide();
							var searchByTown = false;
							var searchByStore = false;
							if (typeof data.showStoreList != "undefined") {
								if (data.showStoreList.toLowerCase() == 'true') {

									searchByStore = true;
								}
							}
							if (typeof data.showTownList != "undefined") {
								if (data.showTownList.toLowerCase() == 'true') {
									searchByTown = true;
								}
							}
							if (searchByStore) {
								var findStorePlace = data.data;
								if (null != findStorePlace) {
									
									var appendHtml = "<hr>" 
											+ "<input type='button' class='progressive'id='continueStoreTop' value='Select store' onClick='searchStoreMiles(" + partNumber + ");'/>"  
											+ "<p>Store results for <strong>"
											+ qasSearchTerm
											+ "</strong></p>";
									for ( var i = 0; i < findStorePlace.length; i++) {
										//Stock Check during Store Search
										if(findStorePlace[i] !== undefined && findStorePlace[i].isInStock !== undefined){
											if(findStorePlace[i].isInStock){
												var stockClass = "inStock";
												var stockMsg = "In stock";
												var url = "/wcsstore/argos/en_GB/images//green_arrow.png"
												
											}else{
													var stockClass = "outOfStock";
													var stockMsg = "Out of stock";
													var url = "/wcsstore/argos/en_GB/images/grey_arrow.gif"
											}
										}
										appendHtml = appendHtml
												+ "<input id='r"
												+ i
												+ "' type ='radio' value='"
												+ $
														.trim(findStorePlace[i].mmstrname)
												+ "|"
												+ findStorePlace[i].mmdist
												+ "|"
												+ findStorePlace[i].mmstrnbr
												+ "|"
												+ findStorePlace[i].isInStock
												+ "' name='store'";
										if (i == 0) {
											appendHtml += "checked ='checked'"
										}
										appendHtml += "><label for ='r"
												+ i
												+ "'><strong>"
												+ $
														.trim(findStorePlace[i].mmstrname)
												+ "</strong>  ("
												+ parseFloat(Math.round((findStorePlace[i].mmdist) * 100) / 100).toFixed(1)
												+ " miles)"
												+ "<input type='hidden' name='storeNBR' value="
												+ findStorePlace[i].mmstrnbr
												+ "/></label>";
										if(findStorePlace[i] !== undefined && findStorePlace[i].isInStock !== undefined){//Only append stock if defined
											appendHtml += "<div class='stockMsg "+stockClass+"'>"
												+"<img class='stockIcon' src='"+url+"'>"
												+stockMsg
												+"</div>"
												+"<hr>"
										}else {
											appendHtml += "<hr>"
										}
									}

									appendHtml = appendHtml
											+ "<input type='button' class='progressive'id='continueStore' value='Select store' onClick='searchStoreMiles(" + partNumber + ");'/>";
									$('div.collectionContainer div.stockOptions').empty();
									$('div.collectionContainer div.stockOptions').html(appendHtml);
									$('#checkStock_go').removeAttr("disabled");
								}
								$(".stockOptions").show();
								$(".areaOptions").hide();
							}
							if (searchByTown) {
								var localityDetailsList = data.localityDetailsList;
								var appendHtml = "<hr><p><strong>Matches found for Town/Name</strong></p><p>Please select the"
										+ "town/area you would like to check</p>";
								for ( var i = 0; i < localityDetailsList.length; i++) {
									appendHtml = appendHtml + "<input id='t"
											+ i + "' type ='radio' value='"
											+ localityDetailsList[i].easting
											+ ", "
											+ localityDetailsList[i].northing
											+ "' name='townarea'";
									if (i == 0) {
										appendHtml += "checked ='checked'"
									}
									
									appendHtml += "><input name='t" + i + "name' type='hidden' value='" + localityDetailsList[i].name + "'";
									
									appendHtml += "><label for ='t" + i
											+ "'><strong>" + localityDetailsList[i].name
											+ "</strong></label><br>";
								}
								appendHtml = appendHtml
										+ "<input type='button' class='progressive CheckStoreActivator'id='continueStore' value='Continue' onClick='findStoreByKwd("
										+ partNumber
									//	+ ","
									//	+ $('.areaOptions input[name="townarea"]:checked').val();
								+")'>";
								$('div.collectionContainer div.areaOptions')
										.html(appendHtml);
								$(".areaOptions").show();
								$(".stockOptions").hide();
								
							}
						}
						}	else {
							$('div.errorStore')
									.html("<p>We found no Postcodes with the value "
											+ qasSearchTerm
											+ " in our listings. Please try again.</p>");
							$(".areaOptions").hide();
							$(".stockOptions").hide();
							$('div.errorStore').show();
						}
					} else {
						$('div.errorStore')
								.html(
										"<p>We found no Postcodes with the value "
												+ qasSearchTerm
												+ " in our listings. Please try again.</p>");
						$(".areaOptions").hide();
						$(".stockOptions").hide();
						$('div.errorStore').show();
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					$(".areaOptions").hide();
					$(".stockOptions").hide();
					$('div.postcodeErrorMsg div#ErrorText')
							.html(
									"<div class='error'><p>We found no Postcodes with the value"
											+ qasSearchTerm
											+ "in our listings. Please try again.</p></div>");
				}

			});
}

function findStoreByKwd(partNumber) {

	var productId =  $("#catentryId").val();
	var qasSearchTerm = $('.areaOptions input[name="townarea"]:checked').val();
	var partNumber = partNumber;
	var catEntryId_0 = $("#catentryId").val();
	var quantity = '';
	var actionType = 'searchAction';
	var data = 'productId='
			+ productId + '&qasSearchTerm=' + qasSearchTerm 
			+ '&partNumber=' + partNumber + '&catEntryId_0='
			+ catEntryId_0 + '&quantity=' + quantity + '&actionType='
			+ actionType;
	$
			.ajax( {
				url : '/webapp/wcs/stores/servlet/ArgosFindStoreCmd',
				data : data,//data tobe  send to the server (optional)
				type : 'post', //either post or get
				dataType : 'json', //get response as json fron server
				success : function(data) { //this function is called when the ajax function is successfully executed
					if (data != null) {
						if (typeof data.errorCode == "undefined"){
						if (typeof data.errorText == "undefined") {
							$('div.errorStore').hide();
							var searchByTown = false;
							var searchByStore = false;
							if (typeof data.showStoreList != "undefined") {
								if (data.showStoreList.toLowerCase() == 'true') {

									searchByStore = true;
								}
							}
							if (typeof data.showTownList != "undefined") {
								if (data.showTownList.toLowerCase() == 'true') {
									searchByTown = true;
								}
							}
							if (searchByStore) {
								var findStorePlace = data.data;
								if (null != findStorePlace) {
									var selTownName = '.areaOptions input[name=\"' + $('.areaOptions input[name="townarea"]:checked').attr('id')+'name' + '\"]'; 
									$('div#postcodeMsg input#stock01_OOPS').val
									($(selTownName).val());
									
									
									var appendHtml = "<hr>" +
									"<input type='button' class='progressive'id='continueStoreTop' value='Select store' onClick='searchStoreMiles(" + partNumber + ");document.getElementById(\"siteheader\").scrollIntoView();'/>"
											+"<p><strong>Store results for "
											+ $(selTownName).val()
											+ "</strong></p><p>Select a store to check availability.</p>";
									for ( var i = 0; i < findStorePlace.length; i++) {
										//Stock Check during Store Search
										if(findStorePlace[i] !== undefined && findStorePlace[i].isInStock !== undefined){
											if(findStorePlace[i].isInStock){
												var stockClass = "inStock";
												var stockMsg = "In stock";
												var url = "/wcsstore/argos/en_GB/images//green_arrow.png"
												
											}else{
													var stockClass = "outOfStock";
													var stockMsg = "Out of stock";
													var url = "/wcsstore/argos/en_GB/images/grey_arrow.gif"
											}
										}
										appendHtml = appendHtml
												+ "<input id='r"
												+ i
												+ "' type ='radio' value='"
												+ $
														.trim(findStorePlace[i].mmstrname)
												+ "|"
												+ findStorePlace[i].mmdist
												+ "|"
												+ findStorePlace[i].mmstrnbr
												+ "' name='store'";
										if (i == 0) {
											appendHtml += "checked ='checked'"
										}
										appendHtml += "><label for ='r"
												+ i
												+ "'><strong>"
												+ $
														.trim(findStorePlace[i].mmstrname)
												+ "</strong>  ("
												+ parseFloat(Math.round((findStorePlace[i].mmdist) * 100) / 100).toFixed(1)
												+ " miles)"
												+ "<input type='hidden' name='storeNBR' value="
												+ findStorePlace[i].mmstrnbr
												+ "/></label>";
										if(findStorePlace[i] !== undefined && findStorePlace[i].isInStock !== undefined){//Only append stock if defined
											appendHtml += "<div class='stockMsg "+stockClass+"'>"
												+"<img class='stockIcon' src='"+url+"'>"
												+stockMsg
												+"</div>"
												+"<hr>"
										}else {
											appendHtml += "<hr>"
										}
									}

									appendHtml = appendHtml
											+ "<input type='button' class='progressive 'id='continueStore' value='Select store' onClick='searchStoreMiles(" + partNumber + ");document.getElementById(\"siteheader\").scrollIntoView();'>";
									$(
											'div.collectionContainer div.stockOptions')
											.html(appendHtml);
								}
								$(".stockOptions").show();
								$(".areaOptions").hide();
							}
							if (searchByTown) {
								var searchTown = data.townNames;
								var appendHtml = "<hr><p><strong>Matches found for Town/Name</strong></p><p>Please select the"
										+ "town/area you would like to check</p>";
								for ( var i = 0; i < searchTown.length; i++) {
									appendHtml = appendHtml + "<input id='t"
											+ i + "' type ='radio' value='"
											+ searchTown[i]
											+ "' name='townarea'";
									if (i == 0) {
										appendHtml += "checked ='checked'"
									}
									appendHtml += "><input name='t" + i + "name' type='hidden' value='" + searchTown[i] + "'";
									appendHtml += "><label for ='t" + i
											+ "'><strong>" + searchTown[i]
											+ "</strong></label><br>";
								}
								appendHtml = appendHtml
										+ "<input type='button' class='progressive CheckStoreActivator'id='continueStore' value='Continue' onClick='findStoreByKwd("
										+ partNumber
									//	+ ","
									//	+ $('.areaOptions input[name="townarea"]:checked').val();
								+")'>";
								$('div.collectionContainer div.areaOptions')
										.html(appendHtml);
								$(".areaOptions").show();
								$(".stockOptions").hide();
								
							}
						} else {
							$('div.errorStore')
									.html("<p>" + data.errorText + "</p>");
							$(".areaOptions").hide();
							$(".stockOptions").hide();
							$('div.errorStore').show();
						}
						}	
					} else {
						$('div.errorStore')
								.html(
										"<p>We found no Postcodes with the value "
												+ qasSearchTerm
												+ " in our listings. Please try again.</p>");
						$(".areaOptions").hide();
						$(".stockOptions").hide();
						$('div.errorStore').show();
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					$(".areaOptions").hide();
					$(".stockOptions").hide();
					$('div.postcodeErrorMsg div#ErrorText')
							.html(
									"<div class='errorStore'><p>We found no Postcodes with the value"
											+ qasSearchTerm
											+ "in our listings. Please try again.</p></div>");
				}

			});
}

function searchStoreMiles(partNumber) {
	$(".LightboxOverlay,#lightbox").hide();
	var productId =  $("#catentryId").val();
	var qasSearchTerm = $('#postcodeMsg #stock01_OOPS').val();
	var catEntryId_0 = $("#catentryId").val();	
	var productId = $("#catentryId").val();	
	
	var deliverableOnly = $("#deliverableOnly").val();	
	var collectableOnly = $("#collectableOnly").val();	
	var formattedPartNumber = $("#formattedPartNumber").val();	
	var pdMaxAvailable = $("#pdMaxAvailable").val();	
	var displayLayoutB = $("#displayLayoutB").val();	
	var stockCheck = $("#stockCheck").val();	
	var catentryId = $("#catentryId").val();
	var collectable = $("#collectable").val();
	var noCollectOrDeliver = $("#noCollectOrDeliver").val();
	
	var actionType = true;
	var checkStore = true;
		
	var selectionData = $(".stockOptions input:radio:checked").val();
	
	if (selectionData != null && selectionData != '') 
	{
		splitStoredistance = selectionData.split('|');
	}
	
	var selectedStore = splitStoredistance[0];
	var storeDistance = splitStoredistance[1];
	var physicalStoreId = splitStoredistance[2];
	
	var queryString = 
			'storeId=' + argos.app.storeId 
			+ '&langId=' + argos.app.langId
			+ '&selectedStore=' + selectedStore
			+ '&checkStore=' + checkStore 
			+ '&qasSearchTerm='	+ qasSearchTerm  
			+ '&partNumber='+ partNumber 
			+ '&actionType=' + actionType 
			+ '&physicalStoreId=' + physicalStoreId 
			+ '&storeDistance=' + storeDistance
			+ '&pageReqType='+"nearestStore"
			+ '&collectable=' + collectable
			+ '&deliverableOnly=' + deliverableOnly
			+ '&collectableOnly=' + collectableOnly
			+ '&formattedPartNumber=' + formattedPartNumber
			+ '&pdMaxAvailable=' + pdMaxAvailable
			+ '&displayLayoutB=' + displayLayoutB
			+ '&stockCheck=' + stockCheck
			+ '&noCollectOrDeliver=' + noCollectOrDeliver
			+ '&catentryId=' + catentryId;
	
	var content = document.getElementById('stkDetailsContainer');
	var loading = "<div class='ajaxLoadingFrame'></div>";
	content.innerHTML = loading;
	$.ajax( {
		url : '/webapp/wcs/stores/servlet/OneClickReserve',
		data : queryString,//data to be  send to the server (optional)
		type : 'get', //either post or get
		dataType : 'html', //get response as HTML from server
		
		success : function(html) { //this function is called when the ajax function is successfully executed		
			$(content).empty();
			$(content).append(html);
			// Update out-of-stock alternatives
			argos.pdp.updateOOSAlternatives();
			argos.messages.createActivators(content);
		},	
		complete: function(){
			argos.pdp.setUpTabs();
			new argos.classes.LightboxActivator(document.getElementById('findStock'), argos.page.elements.lightbox);
			setUpBrowser();
		},
		error : function(xhr, ajaxOptions, thrownError) {
		}
	});
}

function changeFavStore(partNumber) {
	$(".LightboxOverlay,#lightbox").hide();
	
	var deliverableOnly = $("#deliverableOnly").val();	
	var collectableOnly = $("#collectableOnly").val();	
	var formattedPartNumber = $("#formattedPartNumber").val();	
	var pdMaxAvailable = $("#pdMaxAvailable").val();	
	var displayLayoutB = $("#displayLayoutB").val();	
	var stockCheck = $("#stockCheck").val();	
	var catentryId = $("#catentryId").val();
	var collectable = $("#collectable").val();
	var noCollectOrDeliver = $("#noCollectOrDeliver").val();
	
	var checkStore = true;
	var actionType = true;
	var selectionData;	
	var radioGroup = document.getElementsByName('SelectedStore');
	for (var i = 0; i < radioGroup.length; i++) 
	{
		var button = radioGroup[i];
		if (button.checked) 
		{
			selectionData = button.value;
			break;
		}
	}	
	if (selectionData != null && selectionData != '') 
	{
		dataParts = selectionData.split('|');
	}
	
	var selectedStore = dataParts[0].replace(/^\s+|\s+$/g, '');;
	var physicalStoreId = dataParts[1].replace(/^\s+|\s+$/g, '');;
	var queryString = 
			'storeId=' + argos.app.storeId 
			+ '&langId=' + argos.app.langId
			+ '&SelectedStore=' + selectedStore
			+ '&checkStore=' + checkStore 
			+ '&actionType=' + actionType 
			+ '&partNumber='+ partNumber 
			+ '&physicalStoreId=' + physicalStoreId
			+ '&collectable=' + collectable
			+ '&deliverableOnly=' + deliverableOnly
			+ '&collectableOnly=' + collectableOnly
			+ '&formattedPartNumber=' + formattedPartNumber
			+ '&pdMaxAvailable=' + pdMaxAvailable
			+ '&displayLayoutB=' + displayLayoutB
			+ '&stockCheck=' + stockCheck
			+ '&catentryId=' + catentryId
			+ '&noCollectOrDeliver=' + noCollectOrDeliver
			+ '&pageReqType='+"favouriteStore";
	var content = document.getElementById('stkDetailsContainer');
	var loading = "<div class='ajaxLoadingFrame'></div>";
	content.innerHTML = loading;
	$.ajax( {
		url : '/webapp/wcs/stores/servlet/OneClickReserve',
		data : queryString,//data to be  send to the server (optional)
		type : 'get', //either post or get
		dataType : 'html', //get response as HTML from server
		
		success : function(html) { //this function is called when the ajax function is successfully executed
			$(content).empty();
			$(content).append(html);
			// Update out-of-stock alternatives
			argos.pdp.updateOOSAlternatives();
			argos.messages.createActivators(content);
		},
		complete: function(){
			argos.pdp.setUpTabs();
			new argos.classes.LightboxActivator(document.getElementById('findStock'), argos.page.elements.lightbox);
			setUpBrowser();
		},
		error : function(xhr, ajaxOptions, thrownError) {
		}
	});
}
function setUpBrowser() {
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

function removePostCodeValue() {
	sillyVar = $("#postCodeValue").val();
	alert(sillyVar);
	$("#postCodeValue").val(" ");
}

function findPostCode(partNumber,catentryId) {
	$("#postcodeErrorMsg").hide();
	var postCodeCheck = $("#postCodeCheck").val();
	var catentryId = catentryId;
	var quantity = $('#changeOptions1 :selected').val();
	
	var partNumber = partNumber;
	var checkStore = true;
	var data = 'checkStore=' + true + '&' + 'qasSearchTerm=' + postCodeCheck
			+ '&' + 'partNumber=' + partNumber
			+ '&' + 'catEntryId=' + catentryId + '&' + 'quantity=' + quantity
			+ '&' + 'fromHD=' + true + '&' + 'viewTaskName='
			+ 'ProductDisplayMobileView';//+ '&'+ 'catentryId='+ catentryId+ '&'+ 'quantity='+ quantity ;
	$
			.ajax( {
				url : '/webapp/wcs/stores/servlet/ArgosCheckPostalCode',
				data : data,//data tobe  send to the server (optional)
				type : 'post', //either post or get
				dataType : 'json', //get response as json fron server
				success : function(data) {
					try{
						if(typeof data.errorText != undefined && typeof data.errorText != 'undefined'){
							$("#postcodeErrorMsg").find("p").html(data.errorText);
							$("#postcodeErrorMsg").show();
						}else{
							if(typeof data.productAvailabilities != undefined){
								if(typeof data.productAvailabilities != 'undefined'){
								var productAvailabilities = data.productAvailabilities.all;
								// alert(data.productAvailabilities.all);
								if (null != productAvailabilities) {

									for ( var i = 0; i < productAvailabilities.length; i++) {
										var productAvailability = productAvailabilities[i];
										var homeDelAvail = productAvailability.homeDeliveryStockAvailability;
										//alert(homeDeliveryStockAvailability.inStock);
										if (homeDelAvail.requestError) {
											$("#hdMsg").hide();
											//Ajax:hiding previous IN-STOCK message.
											$("#hdMsgAjax").hide();
											$("#storeStockAjax").hide();
											//Ajax:hiding previous OOS message.
											$("#hdMsgAjaxOOS").find('img').hide();
											$("#hdMsgAjaxOOS").find('span').hide();
											$("#hdMsgAjaxOOS #innerhdMsgAjaxOOS").hide();
											$("#hdMsgAjaxOOS")
													.find("p")
													.html(
															"Sorry, we can't check stock at the moment. Please try again later, or we'll confirm stock during checkout.");
											$("#hdMsgAjaxOOS").show();
										} else if (!homeDelAvail.postCodeDeliverable) {
											if (searchByTownname) {
												$("#hdMsg").hide();
												//Ajax:hiding previous IN-STOCK message.
												$("#hdMsgAjax").hide();
												$("#storeStockAjax").hide();
												//Ajax:hiding previous OOS message.
												$("#hdMsgAjaxOOS").find('img').hide();
												$("#hdMsgAjaxOOS").find('span').hide();
												$("#hdMsgAjaxOOS")
														.find("p")
														.html(
																"Sorry, we are not able to offer delivery to this town");
												$("#hdMsgAjaxOOS").show();
											} else {
												$("#hdMsg").hide();
												//Ajax:hiding previous IN-STOCK message.
												$("#hdMsgAjax").hide();
												$("#storeStockAjax").hide();
												//Ajax:hiding previous OOS message.
												$("#hdMsgAjaxOOS").find('img').hide();
												$("#hdMsgAjaxOOS").find('span').hide();
												$("#hdMsgAjaxOOS")
														.find("p")
														.html(
																"Sorry, we are not able to offer delivery to this postcode");
												$("#hdMsgAjaxOOS").show();
											}

										} else if (homeDelAvail.inStock) {
											if($("#storeStockAjax").length >0){
												$("#storeStockAjax").find("span").html(data.postCode);
										 		$("#storeStockAjax").show();
											}
											if($("#storeStock").length >0){
												$("#storeStock").find("span").html(data.postCode);
										 		$("#storeStock").show();
											}
											if($("#outStock").length > 0){
												$("#outStock").show();
											}else{
												$("#inStock").show();
											}
											if ((!homeDelAvail.inventoryHubs.outOfStock)
													&& homeDelAvail.inventoryHubs.sameLeadDays) {
													$("#storeStockAjax").find("span").html(data.postCode);
											 		$("#storeStockAjax").show();
											 		$("#hdMsgAjaxOOS").hide();
											 		$("#hdMsgAjax").find("p").html("Available for home delivery <strong>within "+homeDelAvail.leadDays+ " days</strong>");
											 		$("#hdMsgAjax").show();
											 		$("#storeStock").hide();
													$("#hdMsg").hide();
											} else {
												//check for previous OOS message
												$("#storeStockAjax").find("span").html(data.postCode);
										 		$("#storeStockAjax").show();
										 		$("#hdMsgAjaxOOS").hide();
										 		$("#hdMsgAjax").find("p").html("Available for home delivery <strong>within "+homeDelAvail.leadDays+ " days</strong>");
										 		$("#hdMsgAjax").show();
										 		$("#storeStock").hide();
												$("#hdMsg").hide();
											}
											//    $("#hdMsgAjax").show();
										} else {
											$("#hdMsg").hide();
											$("#inStock").hide();
											$("#outStock").hide();
											$("#hdMsgAjax").hide();
											$("#storeStockAjax").hide();
											$("#storeStock").hide();
											$("#hdMsgAjaxOOS").find("span").html(
													"Currently out of stock for home");
											$("#hdMsgAjaxOOS").find("#innerhdMsgAjaxOOS")
													.html("delivery to : " + data.postCode);
											$("#hdMsgAjaxOOS").show();
										}
									}
								}
								}
								else{
									$("#storeStock").hide();
									$("#hdMsg").hide();
									//Ajax:hiding previous IN-STOCK message.
									$("#hdMsgAjax").hide();
									$("#storeStockAjax").hide();
									//Ajax:hiding previous OOS message.
									$("#hdMsgAjaxOOS").find('img').hide();
									$("#hdMsgAjaxOOS").find('span').hide();
									$("#hdMsgAjaxOOS")
											.find("p")
											.html(
													"Sorry, we are not able to offer delivery to this postcode");
									$("#hdMsgAjaxOOS").show();
								}
							}else{
								$("#storeStock").hide();
								$("#hdMsg").hide();
								//Ajax:hiding previous IN-STOCK message.
								$("#hdMsgAjax").hide();
								$("#storeStockAjax").hide();
								//Ajax:hiding previous OOS message.
								$("#hdMsgAjaxOOS").find('img').hide();
								$("#hdMsgAjaxOOS").find('span').hide();
								$("#hdMsgAjaxOOS")
										.find("p")
										.html(
												"Sorry, we are not able to offer delivery to this postcode");
								$("#hdMsgAjaxOOS").show();
							}
						}
					}catch(ex){
						$("#postcodeErrorMsg").find("p").html("Sorry the postcode entered was not recognised. Please check the details and try again.");
						$("#postcodeErrorMsg").show();
					}
					
			},
				error : function(xhr, ajaxOptions, thrownError) {

				$("#postcodeErrorMsg").find("p").html("Sorry the postcode entered was not recognised. Please check the details and try again.");
				$("#postcodeErrorMsg").show();
				}
			});
}
function  findPostCodeGlobal(partNumber,catentryId){
		$("#postcodeErrorMsg").hide();
		var postCodeCheck = $("#postCodeValue").val();
		var catentryId = catentryId;
		var quantity = $('#changeOptions1 :selected').val();
		var partNumber = partNumber;
		var checkStore = true;
		var data = 'checkStore=' + true + '&' + 'qasSearchTerm=' + postCodeCheck
			+ '&' + 'partNumber=' + partNumber
			+ '&' + 'catEntryId=' + catentryId + '&' + 'quantity=' + quantity
			+ '&' + 'fromHD=' + true + '&' + 'viewTaskName='
			+ 'ProductDisplayView';
			
		$.ajax( {
			url : '/webapp/wcs/stores/servlet/ArgosCheckPostalCode',
			data: data,//data tobe  send to the server (optional)
			type:'post', //either post or get
			dataType: 'json', //get response as json fron server

			success:function(data){
				try{

					if(typeof data.errorText != undefined && typeof data.errorText != 'undefined'){
						$("#postcodeErrorMsg").find("p").html(data.errorText);
						$("#postcodeErrorMsg").show();
					}else{
						if(typeof data.productAvailabilities != undefined){
							if(typeof data.productAvailabilities != 'undefined'){	
							var productAvailabilities = data.productAvailabilities.all;
							if(null!=productAvailabilities){
								for (var i = 0; i < productAvailabilities.length; i++) {
									var productAvailability = productAvailabilities[i];
									var homeDelAvail=productAvailability.homeDeliveryStockAvailability;
									if(homeDelAvail.requestError){
								 		$("#globalDelivery").hide();
								 		//Ajax:hiding previous IN-STOCK message.
										$("#hdMsgAjax").hide();
										$("#storeStockAjax").hide();
										//Ajax:hiding previous OOS message.
										$("#hdMsgAjaxOOS").find('img').hide();
										$("#hdMsgAjaxOOS").find('span').hide();
										$("#hdMsgAjaxOOS #innerhdMsgAjaxOOS").hide();
								 		$("#hdMsgAjaxOOS").find("p").
								 			html("Sorry, we can't check stock at the moment. Please try again later, or we'll confirm stock during checkout.");
								 		$("#hdMsgAjaxOOS").show();
									}
									else if(!homeDelAvail.postCodeDeliverable){
								 		if(searchByTownname){
									 		$("#globalDelivery").hide();
									 		//Ajax:hiding previous IN-STOCK message.
											$("#hdMsgAjax").hide();
											$("#storeStockAjax").hide();
											//Ajax:hiding previous OOS message.
											$("#hdMsgAjaxOOS").find('img').hide();
											$("#hdMsgAjaxOOS").find('span').hide();
									 		$("#hdMsgAjaxOOS").find("p").html("Sorry, we are not able to offer delivery to this town");
									 		$("#hdMsgAjaxOOS").show();
								 		}else{
									 		$("#globalDelivery").hide();
									 		//Ajax:hiding previous IN-STOCK message.
											$("#hdMsgAjax").hide();
											$("#storeStockAjax").hide();
											//Ajax:hiding previous OOS message.
											$("#hdMsgAjaxOOS").find('img').hide();
											$("#hdMsgAjaxOOS").find('span').hide();
									 		$("#hdMsgAjaxOOS").find("p").html("Sorry, we are not able to offer delivery to this postcode");
									 		$("#hdMsgAjaxOOS").show();
								 		}
									}
									else if(homeDelAvail.inStock){
								 		$("#globalDelivery").hide();
								 		$("#storeStockAjax").find("span").html(data.postCode);
								 		$("#storeStockAjax").show();
								 		$("#hdMsgAjaxOOS").hide();
								 		if($("#outStock").length > 0){
											$("#outStock").show();
										}else{
											$("#inStock").show();
										}
								 		if((!homeDelAvail.inventoryHubs.outOfStock) && homeDelAvail.inventoryHubs.sameLeadDays){
								 			if(data.isHDExceptionMsg) {
								 				$("#hdMsgAjax").find("p").html(data.exceptionMessage);
								 			} else {
								 				$("#hdMsgAjax").find("p").html("Available for home delivery <strong>within "+homeDelAvail.leadDays+ " days</strong>");
								 			}
								 		}else{
								 			if(data.isHDExceptionMsg) {
								 				$("#hdMsgAjax").find("p").html(data.exceptionMessage);
								 			}else {
								 				$("#hdMsgAjax").find("p").html("Available for home delivery <strong>within "+homeDelAvail.leadDays+ " days</strong>");
								 			}
								 		}
								 		$("#hdMsgAjax").show();
								 		$(".emailMe").hide();
								 		
									}else{
										outOfStock();
								 	}
								}
							}
							else{
								$("#globalDelivery").hide();
								$("#hdMsgAjax").hide();
								$("#storeStockAjax").hide();
								//Ajax:hiding previous OOS message.
								$("#hdMsgAjaxOOS").find('img').hide();
								$("#hdMsgAjaxOOS").find('span').hide();
								$("#hdMsgAjaxOOS #innerhdMsgAjaxOOS").hide();
						 		$("#hdMsgAjaxOOS").find("p").
						 			html("Sorry, we can't check stock at the moment. Please try again later, or we'll confirm stock during checkout.");
						 		$("#hdMsgAjaxOOS").show();
							}
						}else{
							$("#globalDelivery").hide();
							$("#hdMsgAjax").hide();
							$("#storeStockAjax").hide();
							//Ajax:hiding previous OOS message.
							$("#hdMsgAjaxOOS").find('img').hide();
							$("#hdMsgAjaxOOS").find('span').hide();
							$("#hdMsgAjaxOOS #innerhdMsgAjaxOOS").hide();
					 		$("#hdMsgAjaxOOS").find("p").
					 			html("Sorry, we can't check stock at the moment. Please try again later, or we'll confirm stock during checkout.");
					 		$("#hdMsgAjaxOOS").show();
						}	
							}
					
							else{
								$("#globalDelivery").hide();
								$("#hdMsgAjax").hide();
								$("#storeStockAjax").hide();
								//Ajax:hiding previous OOS message.
								$("#hdMsgAjaxOOS").find('img').hide();
								$("#hdMsgAjaxOOS").find('span').hide();
								$("#hdMsgAjaxOOS #innerhdMsgAjaxOOS").hide();
						 		$("#hdMsgAjaxOOS").find("p").
						 			html("Sorry, we can't check stock at the moment. Please try again later, or we'll confirm stock during checkout.");
						 		$("#hdMsgAjaxOOS").show();
							}
					}
				}catch(ex){
					$("#postcodeErrorMsg").find("p").html("Sorry the postcode entered was not recognised. Please check the details and try again.");
					$("#postcodeErrorMsg").show();
				}
			
		}	,
			error: function (xhr, ajaxOptions, thrownError) {
				$("#postcodeErrorMsg").find("p").html("Sorry the postcode entered was not recognised. Please check the details and try again.");
				$("#postcodeErrorMsg").show();
			}
		});
}	

function outOfStock(){
		$("#globalDelivery").hide();
		$("#hdMsgAjax").hide();
		$("#hdMsg").hide();
		$("#storeStock").hide();
		$("#storeStockAjax").hide();
		$("#inStock").hide();
		$("#outStock").hide();
		$("#hdMsgAjaxOOS").find("span").html("Currently out of stock for home ");
		$("#hdMsgAjaxOOS").find("#innerhdMsgAjaxOOS").html("delivery to : "+data.postCode);
		$("#hdMsgAjaxOOS").show();
		$(".emailMe").show();
		$("#inStock").hide();
}
$(document).ready( function() {
	$("#home_delivery_Ajax").hide();
	$("#home_delivery_AvailTime1").hide();
	$("#home_delivery_AvailTime2").hide();
	$("#home_delivery_HubDc").hide();
	$("#home_delivery_OOS").hide();
	$("#hdMsgAjax").hide();
	$("#hdMsgAjaxOOS").hide();
});

function showResult(obj) {
	$('<input>').attr( {
		type : 'hidden',
		id : 'quantity',
		name : 'quantity',
		value : $('#changeOptions :selected').text()
	}).appendTo('#changeStoreform');
	$("#changeStoreform").submit();
}
function updateQuantity(catalogId, partNumber) {

	var quantity = $('#changeOptions :selected').text();
	//alert(quantity);
	var updateQuantity = true;
	//alert(catentryId);
	var data = 'partNumber=' + partNumber + '&' + 'catalogId=' + catalogId
			+ '&' + 'quantity=' + quantity + '&' + 'fromCollection=' + true
			+ '&updateQuantity=' + updateQuantity;//+ '&'+ 'catentryId='+ catentryId+ '&'+ 'quantity='+ quantity ;

	$
			.ajax( {
				url : '/webapp/wcs/stores/servlet/ArgosCheckPostalCode',
				data : data,
				type : 'post',
				dataType : 'json',

				success : function(data) {
					var oneClickResponse = data.invRes;
					var imgDir = $('#imageDir').val();
					if (null != oneClickResponse) {
						var invRes=oneClickResponse[0];
						if(invRes.inStock){
							if (null == invRes.availableDate || invRes.alreadyAvailable) {
								$("#shutl_espot_msg, #genericESpot_PDP_Shutl_Global, #genericESpot_PDP_Shutl_LocalShutlAvailable, #genericESpot_PDP_Shutl_LocalShutlUnavailable").show();
								if(invRes.partialQuantity){
									$("#one_Click_Reserve").hide();
									$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
											"Only "+invRes.stockQuantity+" <strong>Available</strong> to collect in store now");
								}else{
									$("#one_Click_Reserve").show();
									$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
									"<strong>Available</strong> to collect in store now");
								}
							} else if ( invRes.fromHubOrDc == "FROM_HUB") {
								$("#shutl_espot_msg, #genericESpot_PDP_Shutl_Global, #genericESpot_PDP_Shutl_LocalShutlAvailable, #genericESpot_PDP_Shutl_LocalShutlUnavailable").hide();
								if (!invRes.hubBefore) {									
									if(invRes.partialQuantity){
										$("#one_Click_Reserve").hide();
										$("#fulfilment .available")
										.find("span")
										.html("<img src=\""+ imgDir + "green_arrow.png\">" +
												"Only "+invRes.stockQuantity+" <strong>Available</strong> to collect in store.<br />Order by midnight, collect first thing tomorrow");
									}else{
										$("#one_Click_Reserve").show();
										$("#fulfilment .available")
										.find("span")
										.html("<img src=\""+ imgDir + "green_arrow.png\">" +
												"<strong>Available</strong> to collect in store.<br />Order by midnight, collect first thing tomorrow");
									}
								} else if (invRes.hubBefore) {
									if(invRes.partialQuantity){
										$("#one_Click_Reserve").hide();
										$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
												"Only "+invRes.stockQuantity+" <strong>Available</strong> to collect in store.<br />Order by 1pm to collect from 4pm today");
									}else{
										$("#one_Click_Reserve").show();
										$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
										"<strong>Available</strong> to collect in store.<br />Order by 1pm to collect from 4pm today");
									}
								}
							} else if (invRes.fromHubOrDc == "FROM_DC") {
								$("#shutl_espot_msg, #genericESpot_PDP_Shutl_Global, #genericESpot_PDP_Shutl_LocalShutlAvailable, #genericESpot_PDP_Shutl_LocalShutlUnavailable").hide();								
								if(invRes.partialQuantity){
									$("#one_Click_Reserve").hide();
									$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
											"Only "+invRes.stockQuantity+" <strong>Available</strong> to collect in store in "
													+ invRes.leadDaysDC + " days");
									
								}else{
									$("#one_Click_Reserve").show();
									$("#fulfilment .available").find("span").html("<img src=\""+ imgDir + "green_arrow.png\">" +
											"<strong>Available</strong> to collect in store in "
													+ invRes.leadDaysDC + " days");
									
								}
							}
					}else{
						$("#one_Click_Reserve").hide();
						$("#shutl_espot_msg, #genericESpot_PDP_Shutl_Global, #genericESpot_PDP_Shutl_LocalShutlAvailable, #genericESpot_PDP_Shutl_LocalShutlUnavailable").hide();
						$("#fulfilment .available").find("span").html(
								"<img src=\""+ imgDir + "grey_arrow.gif\">" +
								"Currently out of stock for store collection");
					}
					} else {
						$("#one_Click_Reserve").hide();
						$("#shutl_espot_msg, #genericESpot_PDP_Shutl_Global, #genericESpot_PDP_Shutl_LocalShutlAvailable, #genericESpot_PDP_Shutl_LocalShutlUnavailable").hide();
						$("#fulfilment .available").find("span").html(
								"<img src=\""+ imgDir + "grey_arrow.gif\">" +
								"Unable to check stock at this time");

					}
				},
				error : function(xhr, ajaxOptions, thrownError) {

				}

			});

}
function addtocart() {
	
	$('<input>').attr( {
		type : 'hidden',
		id : 'quantity',
		name : 'quantity',
		value : $('#changeOptions :selected').text()
	}).appendTo('#pdpForm');
	$("#pdpForm").submit();
}
function addtocartDelivery() {
	$('<input>').attr( {
		type : 'hidden',
		id : 'quantity',
		name : 'quantity',
		value : $('#changeOptions1 :selected').text()
	}).appendTo('#pdpForm');
	$("#pdpForm").submit();
}
function oneClickRe(obj){
	$('<input>').attr({ type: 'hidden',id: 'quantity',name: 'quantity',value: $('#changeOptions :selected').text()}).appendTo('#oneClickReserveURL');
	$("#oneClickReserveURL").submit();
  }

//Added for R1 Stock Check during store search
$(document).ajaxComplete(function(event, xhr, setting) {
	  if(setting.url.indexOf('ChangeStore') > -1) {
	    $('#lightbox').css({'left':'50%', 'margin-left':'-175px', 'top':'150px'});
	    $('#stockChecker').css('width', '350px');
	  }
	});

