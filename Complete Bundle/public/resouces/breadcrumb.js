/* 
	argos breadcrumb generator
	Rozario Chivers : 17/01/2008
	reads Mercado parameters from URL
	builds links and text into a ordered list for product details pages
	also can be called to generate breadcrumb for customer services pages
	e.g. argos.page.breadCrumb.init("productdetails");
	e.g.  argos.page.breadCrumb.init("customerservices");
*/


// add breadcrumb object
argos.page.breadCrumb = {
	// browser URL
	URL : window.location.href,
	// domain name ( read from first list link in breadcrumb )
	// e.g. "http://<sitename>/"
	SITE_URL : "",
	// WebSphere Commerce prefix ( read from URL )
	// e.g. "http://<sitename>/webapp/wcs/stores/servlet/Browse?storeId=..."
	WCSPrefix : "",
	// HTML file extension
	HTML_EXT : ".htm",
	// browse display command
	BROWSE_CMD : "Browse",
	// product display command
	PRODUCT_DISPLAY_CMD : "Product",
	// part number URL fragment
	PRODUCT_PARTNO_CMD : "partNumber",
	// cached category id
	CACHEDCATEGORY_ID : (function() {
		// cachecatalogid should be declared in JSP (global variable).
		// Testing for existence to fix undeclared instances.
		var localCacheCatalogId = "";
		try {
			localCacheCatalogId = argos.pdp.cachedcatalogid;
		}
		catch(e) {
			if(e instanceof ReferenceError && argos.debug) {
				console.log("cachecatalogid is undeclared");
			}
		}
		return localCacheCatalogId;
	}()),
	// category root delimeter
	CAT_ROOT_DELIM : "category_root",
	// price cut identifier
	PRICE_CUT : "Price+Cut",
	
	STORERO : "Store",
	// category delimeter
	DELIM : "c_",
	// category id and name delimeter
	SUB_DELIM : "|",
	// category id parameter
	CATEGORY_IDENTIFIER_PARAM : "cat_",
	// refinement delimeter
	REFINE_DELIM : "r_",
	// MAIN_DELIM for URL NVPs
	MAIN_DELIM : "/",
	// search parameter
	SEARCH_PARAM : "searchtext",
	SEARCH_PARAM_2 : "q=",
	STOREID : "storeId=",
	// parameters for Mercado
	paramList : [],
	// hashtable of Mercado Category URLs
	// contains runtime properties based on DELIM - used a keys
	categoryURL : {	 
		// method that returns the number of keys in hash 
		size : function() { 
				var len = 0;
				for ( var i in this ) {
					// only count string data members - ignore size method
					if ( typeof this[i] == 'string' ) len++;
				}	
				return len; 
			}
	},
	
	// hashtable of Category breadcrumb text
	// contains runtime properties based on DELIM - used a keys
	crumbText : {},
	// index to split out breadcrumb text
	splitIndex : 2,
	
	init : function(pageContext) {
		cachedcatalogid = argos.pdp.cachedcatalogid;
		argos.page.breadCrumb.render(pageContext);
	},
	
	createUrlPrefix : function(url) {
		// reduce namespace
		var breadCrumb = argos.page.breadCrumb;
		var newUrl = "";
		// get highest level category level	
		var highestCatLevel = url.split(breadCrumb.DELIM).length-1;

		
		var categoryLinks = url.split(breadCrumb.DELIM);
				
		// cater for encoded / unencoded delimeters
		if ( url.split(breadCrumb.DELIM)[highestCatLevel].indexOf(argos.url.encode(
					breadCrumb.SUB_DELIM
				)) != -1) {
			
				
			var mainCatCode = "";
			//encoded
			mainCatCode = url.split(breadCrumb.DELIM)[highestCatLevel].split(
				argos.url.encode(
						breadCrumb.SUB_DELIM
					)
			)[3];
			
		} else {
			// unencoded
			mainCatCode = url.split(breadCrumb.DELIM)[highestCatLevel].split(breadCrumb.SUB_DELIM)[3];
		}

		mainCatCode = mainCatCode.split(".")[0];
		
		// update product code in URL Prefix
		//var prefixTmp =  
		var urlPrefix = url;
		var startMarker = cachedcatalogid + breadCrumb.MAIN_DELIM;
		var endMarker = breadCrumb.MAIN_DELIM;
		var urlCatCode = urlPrefix.substring(urlPrefix.indexOf(startMarker) + startMarker.length, urlPrefix.length - endMarker.length);
		 
		newUrl = urlPrefix.replace(urlCatCode, mainCatCode);

		

		return newUrl.substring(0,newUrl.length-1);
	},
	
	createBreadCrumbData : function() {
		// reduce namespace
		var breadCrumb = argos.page.breadCrumb;
		// url decode if encoded
		breadCrumb.URL = (argos.url.decode(breadCrumb.URL));
		// check for invalid chars
		//if (breadCrumb.URL.indexOf("<") != -1) return;
		
		// cater for unencoded sub delimeter
		/*gh
		if (breadCrumb.URL.indexOf(breadCrumb.SUB_DELIM) == -1) {
			breadCrumb.SUB_DELIM = argos.comms.url.encode(
				breadCrumb.SUB_DELIM
			);
		};
		*/
		
		// string to store URL of Mercado category parameters
		var categoryURL = "";
		// get param list from URL
		breadCrumb.paramList = breadCrumb.URL.split( breadCrumb.DELIM );
		// populate main portion of Web site URL
		breadCrumb.WCSPrefix = breadCrumb.paramList[0].replace(breadCrumb.PRODUCT_PARTNO_CMD, breadCrumb.BROWSE_CMD + breadCrumb.MAIN_DELIM + breadCrumb.CACHEDCATEGORY_ID);
		// get category data
		// start index at 1 because URL prefix data not needed
		for (var i = 1; i < breadCrumb.paramList.length; i++) {
						
			// get category URLs
			categoryURL = breadCrumb.paramList[ i ];

			//gh
			categoryURL = argos.url.decode( 
					// remove "+" from breadcrumb text if present
					categoryURL.replace(new RegExp(/\+/ig), " "))
			
			// remove refinements
			if (categoryURL.indexOf(breadCrumb.REFINE_DELIM) != -1 || 
				categoryURL.indexOf(argos.url.encode(
						breadCrumb.REFINE_DELIM
					)) != -1) {
				categoryURL = categoryURL.substring(0,
						( categoryURL.indexOf( breadCrumb.REFINE_DELIM ) -1 ) 
					);
			}
			
			//adjust URL
			var breadCrumbTmp = "";
			// add .htm to end of 
			if (categoryURL.lastIndexOf(breadCrumb.MAIN_DELIM) == categoryURL.length -1) {
			
				breadCrumbTmp = categoryURL.substring(0, categoryURL.length-1) ;
				categoryURL = breadCrumbTmp;
			}
			/*  
				-- Recap on constants --
				CAT_ROOT_DELIM : "category_root"
				DELIM : "c_"
				SUB_DELIM : "|"
				REFINE_DELIM : "r_"
				MAIN_DELIM : "&"
			*/
			
			// add DELIM back in
			// create adhoc hashtable keys from URL for category links
			breadCrumb.categoryURL[ breadCrumb.DELIM + 
				categoryURL.substring(0,1) ] = breadCrumb.DELIM + categoryURL;
			
			// create adhoc hashtable keys from URL for breadcrumb text
			// get breadcrumb text only and clean up URL encoding
			
			breadCrumb.crumbText[ breadCrumb.DELIM + 
				categoryURL.substring(0,1) ] =  argos.url.decode( 
					// remove "+" from breadcrumb text if present
					categoryURL.replace(new RegExp(/\+/ig), " ").split(
							breadCrumb.SUB_DELIM
						)[breadCrumb.splitIndex] 
				);	// assigns breadcrumb text section within delimetered string
			
			breadCrumb.crumbText[ breadCrumb.DELIM + 
				categoryURL.substring(0,1) ] = categoryURL.split(
							breadCrumb.SUB_DELIM
						)[breadCrumb.splitIndex] ;				
		
			
		}// end for var i
		
	},
	
	render : function(pageContext) {
		
		// render breadcrumb based on page context
		if ( pageContext == "productdetails" ) {
			// reduce namespace
			var breadCrumb = argos.page.breadCrumb;
						
			// No category information is part of the URL of a Hero Product
			var fromHeroProductUrl = (breadCrumb.URL.indexOf(breadCrumb.CAT_ROOT_DELIM) == -1);
			var fromUnOptimizedProductUrl = (breadCrumb.URL.indexOf(breadCrumb.STOREID) != -1);
			// identify if previous page was a search
			var fromSearchPage = breadCrumb.URL.indexOf(breadCrumb.SEARCH_PARAM) != -1 || breadCrumb.URL.indexOf(breadCrumb.SEARCH_PARAM_2) != -1;			
			
			if(typeof(EFFECTIVE_URL)!="undefined" && ((fromHeroProductUrl || fromUnOptimizedProductUrl) && !fromSearchPage)) {
				breadCrumb.URL = EFFECTIVE_URL;
			} 
			// concatenate each category parameter list as it's found
			
			if(window.disableSearchMessage && disableSearchMessage==true){
				fromSearchPage=false;
			}
			var fromFizzardBrowse = false;
			if(!fromSearchPage && breadCrumb.URL.indexOf(breadCrumb.STOREID) != -1){
				fromFizzardBrowse = true;
			}
			var fromPriceCut = breadCrumb.URL.indexOf(breadCrumb.PRICE_CUT) != -1;
			
			$.urlParam = function(name){
				var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
				if(results)
					return results[1] || 0;
			};
			
			var storeRO="";
			var fromStoreRO = false;
			if($.urlParam('store')){
				storeRO = $.urlParam('store');	
				fromStoreRO = true;				
			}
			
			// exit if no category information found
			if (!fromSearchPage && !fromPriceCut && breadCrumb.URL.indexOf(breadCrumb.DELIM) == -1) return;
			
			// intialise breadcrumb data
			// populate categoryURL and crumbText
			breadCrumb.createBreadCrumbData();
			// sting of params to build up category heirarchy links
			var urlCateogories = "";
			var searchPrefix = "";
			var searchSuffix = "";
			var priceCutPrefix = "";
			var priceCutSuffix = "";
			
			var StoreROPrefix = "";
			var StoreROSuffix = "";
			var StoreROClearanceUrl = "/static/ArgosClearance";
			var StoreROClearanceStoreUrl = "/static/Browse/" + cachedcatalogid + "/1/r_001/1|Store|"+storeRO+"|1.htm";
			
			var priceCutLink = "/static/Browse/" + cachedcatalogid + "/Price+Cut/r_1/1|Price+Cut|Yes|1.htm";			
			
			var priceCutFragment = "/r_1/1|Price+Cut|Yes|1.htm";
			var priceCutUrl = "/static/Browse/" + cachedcatalogid + priceCutFragment;
			
			// from a search
			if (fromSearchPage) {
				searchPrefix = '<span class="searchpre">You searched for </span>';
				searchSuffix = "1 result found";
			}
			// from price cuts
			if (fromPriceCut) {
				priceCutPrefix = '<li><a href="'+ priceCutLink +'">Price Cuts</a></li>';
				priceCutSuffix = "/r_1/1|Price+Cut|Yes|1/";
			}
			
			if (fromStoreRO) {
				
				StoreROPrefix  = '<li><a href="'+ StoreROClearanceUrl +'"> Clearance </a></li>';
				//StoreROPrefix  = StoreROPrefix + '<li><a href="'+ StoreROClearanceStoreUrl +'"> '+storeRO+ '</a></li>';
				StoreROSuffix = 'r_001/1|Store|'+storeRO+'|1/'
			}
			
			// get a reference to the breadcrumb div	
			var breadCrumbDiv = document.getElementById("subheader").getElementsByTagName("DIV")[0];
			// get defensive - if breadcrumb does not exist do not run
			if (!breadCrumbDiv) return;
			// set up string for HTML chunk
			var breadCrumbHTML = "";
			
			// read first link to homepage from page and save for later 
			breadCrumb.SITE_URL = document.getElementById("subheader").getElementsByTagName("A")[0];
			
			// re-build start of breadcrumb and homepage link
			breadCrumbHTML = 	searchPrefix + '<span class="location">You are in: </span>' +
							 	'<ul>' +
			 					'<li class="first">' +
									'<a href="' + 
									breadCrumb.SITE_URL + 
									'" title="Return to homepage">Home</a>' +
								'' +
								priceCutPrefix + StoreROPrefix;
			
			// build breadcrumb heirarchy
			// use breadcrumb url and text hashtables to populate links
			// by calling the category keys in order
			for (var i = 1; i <= breadCrumb.categoryURL.size(); i++) {
				
				
			
				// call hash keys in order
				// concatenate params to build up category heirarchy links
				urlCateogories += breadCrumb.categoryURL[breadCrumb.DELIM + i];
				// clean off last link MAIN_DELIM
				/* not required for Argos - Roz
				if ( urlCateogories.lastIndexOf(breadCrumb.MAIN_DELIM) != -1 ) { 
					urlCateogories = urlCateogories.substring(
						0, urlCateogories.lastIndexOf(breadCrumb.MAIN_DELIM)
					); 
				}
				*/
					
				var breadCrumbTmp = "";
				// build breadcrumb list				
				var breadCrumbURL = urlCateogories;
			
				if (i > 1) {
					// c_{i}/{i}
					var matchingPrefix = breadCrumb.DELIM + i + breadCrumb.MAIN_DELIM + i + breadCrumb.SUB_DELIM;
					var pattern = matchingPrefix + '\\d{8}';
				
					var matches = breadCrumbURL.match(pattern);

					if (typeof(matches) != undefined && matches.length > 0) {
						// expect only one match really
						var categoryIdentifier = matches[0];
						
						// c_{i}/{i}|{categoryid}
						var currentSection = matchingPrefix + categoryIdentifier;
						// c_{i}/{i}|cat_{categoryid}
						var updatedSection = matchingPrefix + breadCrumb.CATEGORY_IDENTIFIER_PARAM + categoryIdentifier;
						
						breadCrumbURL = breadCrumbURL.replace(currentSection, updatedSection);
					}
				}
				
				
				breadCrumbURL = StoreROSuffix+breadCrumbURL;
				// add .htm to end of 
				if (breadCrumbURL.indexOf(breadCrumb.HTML_EXT) == -1) {
					
					breadCrumbTmp = breadCrumbURL.substring(0, breadCrumbURL.length) + breadCrumb.HTML_EXT;
					breadCrumbURL = breadCrumbTmp;
				}
				
				if (fromSearchPage) {
					//breadCrumbURL += "&q=" + breadCrumb.getSearchText();
				} 
				
				// remove .htm from URL
				var cleanPriceCutUrl = priceCutFragment.replace(".htm", "");
				var priceCutUrlTmp = "";
				
				

				// correct URL for each link

				var fullURL = null
				
				if(fromFizzardBrowse){
					fullURL = breadCrumb.WCSPrefix +breadCrumbURL.replace(/\//g,"").replace(".htm", "");

				}else{
					fullURL = breadCrumb.createUrlPrefix(breadCrumb.WCSPrefix + breadCrumbURL) + breadCrumb.MAIN_DELIM + breadCrumbURL;
					fullURL = fullURL.replace(breadCrumb.PRODUCT_DISPLAY_CMD +  breadCrumb.MAIN_DELIM, "");

				}
				
				if(fromStoreRO){					
					fullURL = fullURL.replace("?store="+storeRO, "");
				}
				
				if (fromPriceCut) {
					// not ideal - url cleaning
					breadCrumbURL = breadCrumbURL.replace("?Price Cut=1", "");
					
					fullURL = breadCrumb.createUrlPrefix(breadCrumb.WCSPrefix + breadCrumbURL) + cleanPriceCutUrl + breadCrumb.MAIN_DELIM + breadCrumbURL;
					priceCutUrlTmp = fullURL.replace(breadCrumb.PRODUCT_DISPLAY_CMD +  breadCrumb.MAIN_DELIM, "");
					priceCutUrlTmp = priceCutUrlTmp.replace(breadCrumb.PRICE_CUT + breadCrumb.MAIN_DELIM, "");
					fullURL = priceCutUrlTmp;
				}
				// add +'s back in
				
				
				
				fullURL = fullURL.replace(/\s/ig, "+");
				
				if (!fromSearchPage) {
				
				if(fromStoreRO && i==1){
				breadCrumbHTML += 	'<li>' + 
										'<a href="' + 
										fullURL + 
										'">' + 
											breadCrumb.crumbText[
													breadCrumb.DELIM + i
												] +' - '+storeRO +
										'</a>' +
									'</li>';
				}else{
				breadCrumbHTML += 	'<li>' + 
										'<a href="' + 
										fullURL + 
										'">' + 
											breadCrumb.crumbText[
													breadCrumb.DELIM + i
												] + 
										'</a>' +
									'</li>';
				
				}
				}
				// add MAIN_DELIM between each category link
				urlCateogories += breadCrumb.MAIN_DELIM;
				
			}// end for loop
			
			// append the product name to the breadcrumb
			var breadCrumbList = document.getElementById("subheader").getElementsByTagName("UL")[0].getElementsByTagName("LI");
			var productName = breadCrumbList[breadCrumbList.length-1].getElementsByTagName("STRONG")[0].innerHTML;
			
			
			breadCrumbHTML += 	'<li class="last"><strong>' + productName.replace(/\&amp;#39;/ig, "'") + '</strong> '+ searchSuffix +'</li>';
								
			// close breadcrumb ordered list
			breadCrumbHTML += '</ul>';
			
			// render HTML string into breadcrumb
			// use innerHTML - renders much more quickly than DOM methods
			breadCrumbDiv.innerHTML = breadCrumbHTML;	
						
		} // end if pageContext == "productdetails"
		
	},
	
	/**
	 * Get the search text from the url parameter "Trail". 
	 * The search text is embeded as part of the Trail value, prefixed with "searchtext>".
	 */
	getSearchText : function() {
		var searchText;
		var searchParam = "Trail";  // parameter that stores the search value, can be configured
		var SEARCH_TRAIL = "Trail";  // search trail used for search param, search text is a partial trail value
		
		var searchTerm = argos.url.getParameter(argos.page.breadCrumb.URL, searchParam);
		if (searchTerm) { // search value found
			if (SEARCH_TRAIL === searchParam) { // search trail found, extract search text
				var prefix = (searchTerm.indexOf(">") !=-1 ) ? "searchtext>" : "searchtext%3E";
				var prefixIndex = searchTerm.indexOf(prefix);
	
				if (prefixIndex != -1) { // search text param found
					var searchTextStart = prefixIndex + prefix.length;
					searchText = searchTerm.substring(searchTextStart); // get search text
				}
			} else { // set search text
				searchText = searchTerm;
			}
			
			searchText = searchText.replace(/\+/ig, " ");
		}

		return searchText;
	}
	
} // end argos.page.breadCrumb
	
/**
	Popupate the value for Site Satalyst tags: 
		s.pageName, s.channel, s.prob4
		s.eVar3, s.eVar21, s.eVar22 and s.eVar23
	Tag values depend on its default data (if any) and the breadcrumb data.
*/
var scPrefix	= 'ar:cat';
var sChannel	= scPrefix + ':';
var sPageName	= scPrefix;

function doSiteCatalystTags() {
	s.pageName	= sPageName;
	s.channel	= sChannel;	
	
	var PATH_DELIM = ">"; 
	var TAG_DELIM = ":";
	
	// define tag values from the breadcrumb data
	var breadCrumb = argos.page.breadCrumb;
	if (breadCrumb) {
		// only 3 levels from the breadcrumb data is used (as of live).
		var item1 = breadCrumb.crumbText[breadCrumb.DELIM + 1];
		var item2 = breadCrumb.crumbText[breadCrumb.DELIM + 2];
		var item3 = breadCrumb.crumbText[breadCrumb.DELIM + 3];
		
		if (item1) {
			s.eVar21 = item1;
			s.eVar3	= item1;
			s.pageName += TAG_DELIM + item1.replace(/\s/g, "");
		}
		
		if (item2) {
			s.eVar22 = item2;
			s.eVar3	+= PATH_DELIM + item2;
			s.pageName += TAG_DELIM + item2.replace(/\s/g, "");
		}
		
		if (item3) {
			s.eVar23 = item3;
			s.eVar3	+= PATH_DELIM + item3;
			s.pageName += TAG_DELIM + item3.replace(/\s/g, "");
		}
	}
	s.pageName += ':product:';
	s.prop4	= s.pageName;
};