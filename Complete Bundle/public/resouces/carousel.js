(new function() {
	argos.classes.register(Carousel);
	function Carousel($items, options) {
		// Horizontal scrolling of grouped items, scrolling one group at a time (vertical scrolling not yet implemented).
		// Uses jQuery
		
		// Private variables
		var _carousel = this;
		var _items = new Array();
		var _hasSorting = false;
		var _automated = false;
		var _controller, _container;
		var _rowCount;
	
		
		// Helpers
		var _helpers = {
			getMaxHeight : argos.utils.getMaxHeight
		}
		
		// External classes.
		var _classes = {
			//Button : argos.classes.Button,
			Element : argos.classes.Element,
			Collection : argos.classes.Collection
		}
	
	
		// Externally configurable options.
		var _options = _updateOptions.call(new Object({	
			"buttonTextNext" : "next",
			"buttonTextPrevious" : "prev",
			"wrapperClass" : "carousel",
			"dummyClass" : "carouselDummy",
			"duration" : 750,
			"initialSortingOption" : true,
	//		"leftOffset" : 0, No longer supported. Use offset instead.
			"numberItems" : false,
			"offset" : 0,
			"paging" : 0, // Number of paging links visible
			"reverse" : false,
			"step" : 0,
			"supportIE6HoverOnButtons" : true, 
			"titleTextNext" : "Next",
			"titleTextPrevious" : "Previous",
			"vertical" : false,
			"wrapper" : "<div />"
		}), options);
	
		
		// Initialise object
		_init($items);
	
	
		// PRIVATE:
		function _init(/*Collection*/$items, /*Optional integer*/itemsPerPage) {
			// Note: Calling .position() on display:none item causes jQuery error (see _countItemsInRow).
			// Make sure items passed in are valid.
			// Passing in items so function can be reused (see carousel.append). 
			// Passed object is jQuery collection.
			var extras = 0;
			var dummy;
	
			// Stored value will also be used to prevent repeat of calculation when using _updateElements.
			_rowCount = itemsPerPage ? itemsPerPage : _countItemsInRow($items);

			// Only create carousel if we have more than one row of items.
			if(_rowCount < $items.length) {
				// If we want paging, we need to make an equal number of items for
				// each page. We do this by creating dummy items.
				if(_options.paging > 0) {				
					extras = ($items.length % _rowCount > 0) ? _rowCount - ($items.length % _rowCount) : 0;
					$items = _addDummies($items, extras);
				}

				_controller = _createController($items, _rowCount, extras);
				_items = _setUpLayout($items);
				_resetPositions();
				_updateController();
			}
			else {
				_controller = null;
				_container = null;
			}
	
			_exists.call(_carousel);
		}
	
		function _addDummies($collection, extras) {
			var $dummy;
			for(var i=0; i < extras; i++) {
				$dummy = $("<" + $collection.get(0).tagName + " />").addClass($collection.eq(0).attr("class") + " " + _options.dummyClass); // Create an empty shell dummy item.
				$collection.parent().append($dummy);
				$collection = $collection.add($dummy);
			}
			return $collection;
		}
		
		function _updateOptions(customisations) {
			if(customisations && customisations["leftOffset"]) customisations["offset"] = customisations["leftOffset"]; // Backwards compatibility for deprecated leftOffset.
			for(var c in customisations) {
				this[c] = customisations[c];
			}
			return this;
		}
	
		function _exists() {
			var exists = false;
			if(_container && _controller) {
				exists = true;
			}
			this["exists"] = exists;
			return this.exists;
		}
	
		function _countItemsInRow(items) {	
			// Function assumes items are inline, floated, or display inline, 
			// and attempts to calculate how many items fit on one row.
			// First element with different top position is assumed to be the
			// first element starting new row.

			// Note: IE8 bug avoided by doing $(items.get(0)).position() instead of
			// items.position() - which works in all other IE browsers.
			var x = (items.length > 0) ? $(items.get(0)).position().top : 0;
			var item, top;

			// Having gained a starting top position from first element, 
			// loop until we find an element.top that is greater (new row item).
			for(var count=0; count < items.length; ++count) {	
				item = $(items[count]);
				top = item.position().top;
				if(top > x) {
					break;
				}
			}
			
			return count; 
		}
	
		function _setUpLayout($items) {
			var arr = new Array();
	
			// Add carousel wrapper if requested.
			if(_options.wrapper != "") $items.wrapAll(_options.wrapper);
	
			// The Carousel (and items) must have certain styles applied to work.
			_setMandatoryStyles($items);
			
			// Record the container with applied carousel class and appended controller.
			if(!_container) { // Make sure doesn't already exist (e.g. we're rebuilding)
				_container = new _classes.Element($items.eq(0).parent().addClass(_options.wrapperClass).append(_controller.$node).get(0));
			}
			
			if(_options.numberItems) {
				_container.$node.addClass("carouselWithItemNumbers");
				$items.each(function(i) {
					var $this = $(this);
					var tag;
					switch(this.tagName.toLowerCase()) {
						case "dl" : tag = "dd";
							break;
						case "ul" : ; // fall through
						case "ol" : tag = "li"; 
							break;
						default : "span";
					}
					if(!$this.hasClass(_options.dummyClass)) {
						$this.append("<" + tag + " class=\"carouselItemNumber\">" + (i+1) + ".</" + tag + ">");
					}
				});
			}
	
			// return as Array instead of jQuery collection for easier sorting.
			for(var i=0; i<$items.length; ++i) {
				arr.push($items.eq(i));
			}
			
			return arr; 
		}
		
		function _setMandatoryStyles(items) {
			// Do this after carousel wrap to make sure to have all required styles in place.
			var item = items.eq(0);
			var height = _helpers.getMaxHeight(items);
			var vPadding = Number(item.css("padding-top").replace("px","")) + Number(item.css("padding-bottom").replace("px",""));
			var vMargin = Number(item.css("margin-top").replace("px","")) + Number(item.css("margin-bottom").replace("px",""));
		
			// Carousel items must be position absolute.
			items.css("position", "absolute");
			
			if(!_options.vertical) {
				// Set items to have same height based on max (note: remove padding from max because it will distort visual result).
				items.css("height", (height - vPadding) + "px");
				// Items parent should equal their height + any vertical margin applied to them.
				item.parent().css({"height": (height + vMargin) + "px", "position":"relative"});
			} 	
		}
	
		function _createController($items, itemsPerPage, dummies) {
			var el = new _classes.Element("<div class=\"controller\"></div>");
			var status = $("<p class=\"status\"></p>");
			var paging = $("<p class=\"paging\"></p>");
			var forward = $("<button class=\"forward\" title=\"" + _options.titleTextNext + "\" type=\"button\"><span>" + _options.buttonTextNext + "</span></button>");
			var back = $("<button class=\"back\" title=\"" + _options.titleTextPrevious + "\" type=\"button\"><span>" + _options.buttonTextPrevious + "</span></button>");
			var sorting = _sorting();
	
			if(_options.step < 1) _options.step = itemsPerPage;
				el.property("count",{
					"start" : 1, // showing items x to y of z where value of 'start' is x.
					"end" : itemsPerPage, // showing items x to y of z where value of 'end' is y.
					"row" : itemsPerPage, // keep track of number of items per row (shouldn't change).
					"total" : $items.length, // showing items x to y of z where value of 'total' is z. 
					"page" : 1, // should reflect currently showing page.
					"pages" : $items.length / itemsPerPage,
					"dummy" : dummies // any extras we created to even up when paging. 
			});
	
			el.$node.append(status)
				.append(forward)
				.append(back)
				.append(sorting)
				.append(paging);
	
			forward.click(function() { _carousel.forward(); });
			back.click(function() { _carousel.back(); });
	
			// compensation for lack of :hover support in IE6
			if(_options.supportIE6HoverOnButtons && jQuery.browser.msie && Math.floor(jQuery.browser.version) <= 6) {
				forward.bind("mouseover mouseout", function() { $(this).toggleClass("forward_hover")});
				back.bind("mouseover mouseout", function() { $(this).toggleClass("back_hover")});
			}
	
			return el;
		}
	
		function _updatePositions(items) {
			// Note: if position is set to zero, returned value of item[0].css(position.name) is 0pt, which screws things up.
			var $initialElement = $(items[0]);
			var $currentElement;
			var vertical = _options.vertical;
			var position = {
				amount : vertical ? $initialElement.height() : $initialElement.outerWidth(true),
				name : vertical ? "top" : "left",
				value : vertical ? $initialElement.get(0).style.top : $initialElement.get(0).style.left
			}
	
			var amount = position.value == "" || position.value.indexOf("0") == 0 ? _options.offset : Number($initialElement.css(position.name).replace("px", ""));
			for(var i=0; i < items.length; ++i) {
				$currentElement = items[i];
				if(i != 0 && _options.vertical) {
					position.amount = $currentElement.height();
				}
				$currentElement.css(position.name, amount + "px"); // Added "px" to fix item starting at zero error (see above).
				amount += position.amount; 
			}
		}
	
		function _status() {
			var count = _controller.property("count");
			var realTotal = count.total - count.dummy;
			var html  = "<span class=\"start\">" + ((count.start > realTotal) ? 1 : count.start) + "</span>";
				html += "<span class=\"to\"> to </span>";
				html += "<span class=\"end\">" + ((count.end > realTotal) ? realTotal : count.end)  + "</span>";
				html += "<span class=\"of\"> of </span>";
				html += "<span class=\"total\">" + realTotal + "</span>";
			return html;
		}
	
		function _paging() {
			// Create paging element content
			var count = _controller.property("count");
			var elements = $("<span class=\"label\">Page:</span>");
			var previous = $("<span class=\"button previous\">previous</span>");
			var next = $("<span class=\"button next\">next</span>");
			var row = count.row;
			var selectedWrapperClass = "selected";
			var pageLimit = _options.paging;
			var halfWayPoint = Math.ceil(pageLimit / 2);
			var numberOfPages = Math.floor(count.total / count.row);
			var page = count.page;
			var visibleFrom = (page <= halfWayPoint) ? 1 : ((page + halfWayPoint <= numberOfPages) ? page - (page - halfWayPoint) : (numberOfPages - pageLimit) + 1);
			var button;
	
			// Add "previous" button.
			previous.click(function() { 
				var selected = Number($(".selected", this.parentNode).text());
				if(selected) {
					_carousel.page(selected - 1);
				}
			});
			
			elements = elements.add(page == 1 ? previous.addClass("previousDisabled") : previous);
			
			// Add paging buttons.
			for(var i=row; i<=count.total; i+=row) {
				button = $("<span class=\"button\">" + (i/row) + "</span>");
				button.addClass((i/row >= visibleFrom && i/row < visibleFrom + pageLimit) ? "visible" : "hidden");
				if(count.page == (i/row)) {
					button.addClass(selectedWrapperClass);
				}
				else {
					button.click(function() { _carousel.page($(this).html()); });
				}
				elements = elements.add(button);
			}
	
			// Add "next" button.
			next.click(function() { 
				var selected = Number($(".selected", this.parentNode).text());
				if(selected) {
					_carousel.page(selected + 1);
				}
			});
			elements = elements.add(page + 1 < (visibleFrom + pageLimit) ? next : next.addClass("nextDisabled"));
	
			return elements;
		}
	
		function _sorting() {
			var sorting = "";
			var html  = "<div class=\"sorting\">";
				html += "<label>Sort by:</label>";
				html += "<select>";
				if(_options.initialSortingOption) {	 
						html += "<option class=\"initial\">Choose order</option>";
				}	  
				html += "</select>";
				html += "</div>";
	
				sorting = $(html);
				sorting.find("select").change(function() {
						$("option", this).eq(this.selectedIndex).focus();
				});
			return $(sorting);
		}
	
		function _updateController(action) {
			// See controller creation to know what these variables do.
			var count = _controller.property("count");
			var step = _options.step;
			var start = count.start;
			var end = count.end;
			var total = count.total;
			var elementsPerPage = _options.vertical ? 1 : count.row;
			var page = count.page;
	
			switch(action) {
				case "forward": 
					count.start = ((start + step) > total) ? (start + step) - total : start + step;
					count.end = ((end + step) > total) ? (end + step) - total : end + step;
					if(step == elementsPerPage) {
						count.page = page > (count.total / elementsPerPage) ? 1 : page;
					}
					else {
						count.page = (count.end % elementsPerPage > (elementsPerPage / 2)) ? ((page + 1 > (total / elementsPerPage)) ? 1 : page + 1) : page;
					}
					break;
				case "backward": 
					count.start = ((start - step) < 1) ? total + (start - step) : start - step;
					count.end = ((end - step) < 1) ? total + (end - step) : end - step;
					if(step == elementsPerPage) {
						count.page = (page < 1 ? Math.floor(count.total / elementsPerPage) : page);
					}
					else {
						count.page = (count.end % elementsPerPage == 0 || count.end % elementsPerPage > (elementsPerPage / 2)) ? page : ((page - 1 < 1) ? total / elementsPerPage : page - 1);
					}
					break;
				case "pageForward": 
					count.page = (page > count.total / elementsPerPage ? 1 : page); 
					count.start = ((count.page - 1) * elementsPerPage) + 1;
					count.end = (count.start + elementsPerPage) - 1; 
					break;
				case "pageBackward": 
					count.page = (page < 1 ? Math.floor(count.total / elementsPerPage) : page); 
					count.start = ((count.page - 1) * elementsPerPage) + 1;
					count.end = (count.start + elementsPerPage) - 1; 
					break;
				default: 
					count.start = 1;
					count.end = count.end;
					count.page = 1;
			}
	
			_controller.$node.children(".status").html(_status());
	
			if(_options.paging > 0) {
				// Redraw the paging buttons.
				_controller.$node.children(".paging").empty().append(_paging()); 
			}
	
			_controller.property("moving", false); // Allow movements.
		}
	
		function _slideRight(howMany, before, after) {
			// Show previous items/go back.
			// 1). Add last step number of elements to start of array (and set up position).
			// 2). Recalculate left positions before we move.
			// 3). Move last and first row to the right
			// 4). Remove last (= row number) elements from array (resets to original length).
			// 5). Reposition left values of all elements (once stopped moving).
			// 6). Reset moving flag so other movements can happen.
			var duration = _options.duration
			var step = howMany;
			var count = _carousel.controller.property("count");
			var width = _items[0].outerWidth(true);
			var row = count.row;
	
			// 1). What we need to do to set up items.				
			if(before) { before(); }
	
			// 2). Reposition all items getting them ready for moving to the right.
			_updatePositions(_items);
	
			// 3). Move first row + howMany number of items (current visible and those off visible area) only.
			for(var i=(row + howMany) - 1; i >= 0 ; i--) {
				if(i > 0) {
					// All but last.
					_items[i].animate(
						{ left: "+=" + (width * howMany) },
						duration
					);
				}
				else {
					// Last only.
					_items[i].animate(
						{ left: "+=" + (width * howMany) },
						duration,
						function() {
							// 4). Should be cleanup of what we did in step 1. 
							if(after) { after(); }
	
							// 5). Reposition all elements left property to make sure we're set up for another run.
							_updatePositions(_items)
	
							// 6). Reset to false so movement calls will work again.
							_controller.property("moving", false);
						}
					);
				}
			}
		}
	
		function _slideLeft(howMany, before, after) {
			// Show next items/go forward.
			// 1). Add first row of elements to end of array.
			// 2). Recalculate left positions before we move.
			// 3). Move first and second row to the left
			// 4). Remove first (= row number) elements from array (resets to original length).
			// 5). Reposition left values of all elements (once stopped moving).
			// 6). Reset moving flag so other movements can happen.
	
			var duration = _options.duration; 
			var step = howMany;
			var count = _carousel.controller.property("count");
			var width = _items[0].outerWidth(true);
			var row = count.row;
	
			// 1). What we need to do to set up items.
			if(before) { before(); }
	
			// 2). Reposition all items getting them ready for moving to the left.
			_updatePositions(_items);
	
			// 3). Move all but the last current, then the last with clean up function.
			for(var i=0; i < (row + howMany); i++) {
				if(i < (row + howMany) - 1) {
					// All but last.
					_items[i].animate(
						{ left: "-=" + (width * howMany) },
						duration
					);
				}
				else {
					// Last only.
					_items[i].animate(
						{ left: "-=" + (width * howMany) },
						duration,
						function() {
							// 4). Should be cleanup of what we did in step 1. 
							after();
	
							// 5). Reposition all elements left property to make sure we're set up for another run.
							_updatePositions(_items);
	
							// 6). Reset to false so movement calls will work again.
							_controller.property("moving", false);
						}
					);
				}
			}
		}
	
		function _slideUp() {
			// TODO: Need to finish because the movement is dodgy.
	//		console.log("sliding up...");
			// Show next items/go forward.
			// 1). Add first row of elements to end of array.
			// 2). Recalculate left positions before we move.
			// 3). Move first and second row to the left
			// 4). Remove first (= row number) elements from array (resets to original length).
			// 5). Reposition left values of all elements (once stopped moving).
			// 6). Reset moving flag so other movements can happen.
	
			var duration = _options.duration; 
			var step = howMany;
			var count = _carousel.controller.property("count");
			var width = _items[0].outerWidth(true);
			var row = count.row;
	
			// 1). What we need to do to set up items.
			if(before) { before(); }
	
			// 2). Reposition all items getting them ready for moving to the left.
			_updatePositions(_items);
	/*
			// 3). Move all but the last current, then the last with clean up function.
			for(var i=0; i < (row + howMany); i++) {
				if(i < (row + howMany) - 1) {
					// All but last.
					_items[i].animate(
						{ left: "-=" + (width * howMany) },
						duration
					);
				}
				else {
					// Last only.
					_items[i].animate(
						{ left: "-=" + (width * howMany) },
						duration,
						function() {
								// 4). Should be cleanup of what we did in step 1. 
								after();
	
								// 5). Reposition all elements left property to make sure we're set up for another run.
								_updatePositions(_items);
	
								// 6). Reset to false so movement calls will work again.
								_controller.property("moving", false);
						}
					);
				}
			}
	*/
		}
	
		function _slideDown() {
				// TODO: Need to finish (see _slideUp, above).
	//			console.log("sliding down...");
				_controller.property("moving", false);
		}
		
		function _sort(func) {
			var dummies = new Array();
			_items.sort(func);
	
			// Check for dummies because we always want to put them at the end;
			for(var i=0; i<_items.length; i++) {
				if($(_items[i]).hasClass(_options.dummyClass)) {
					dummies.push(_items.splice(i,1)[0]);
					i = -1; // Because we removed one, need to start again.
				}
			}
	
			_items = _items.concat(dummies); // Add the extracted dummies to the end.
			_resetPositions();
		}
	
		function _resetPositions() {
			for(var i=0; i<_items.length; ++i) {
				_items[i].stop(); // Just in case...
			}
			_items[0].css("left", "0px"); // want to clear it so the positionItems works correctly.
			_updatePositions(_items);
		}

		function _updateElements(/*Array*/removeIndexes, /*Collection*/elements, /*Boolean*/append) { 
			// Add elements to _items array and _container.$node element.
			// Note: This is all very hacky as the Carousel wasn't 
			// originally designed to add/remove on the fly.
			// 1. record currently showing page.
			// 2. remove specified indexes and dummy items.
			// 3. add new elements to collection.
			// 4. insert all collection items into DOM (which now include the add elements).
			// 5. remove the old controller.
			// 6. remove any added div.carousel, or just the class
			// 7. reinitialise using stored rowCount _init(collection, rowCount).
			// 8. move new carousel to recorded page number.
			var collection = new _classes.Collection();
			var parent = _options.wrapper.length > 0 ? _container.$node.parent() : _container.$node;
			var append = arguments.length > 2 ? append : true;

			// 1.
			var currentPage = _controller.property("count") ? _controller.property("count").page : 1; 

			// 2.
			// 2a) set removed items to null.
			for(var i=0; i<removeIndexes.length; ++i) {
				if(removeIndexes[i] >= 0 && removeIndexes[i] < _items.length && !isNaN(removeIndexes[i])) {
					// Only here if valid index number.
					delete _items[removeIndexes[Number(i)]];
				}
			}

			// 2b) rebuild a collection excluding the null items and dummies.
			for(var i=0; i<_items.length; ++i) {
				if(_items[i] != null && !_items[i].hasClass(_options.dummyClass)) {
					collection = collection.add(_items[i]);
				}
			}

			// 3. (can append or prepend to carousel)
			if(append) {
				collection = collection.add(elements);
			}
			else {
				collection = elements.add(collection);
			}
			
			// 4. 
			parent.append(collection);
			
			// 5. 
			_controller.$node.remove();		
	
			// 6.
			if(_options.wrapper.length > 0) {
				_container.$node.remove();
				_container = null;
			}
			else {
				_container.$node.removeClass(_options.wrapperClass);
			}
	
			// 7. 
			_init(collection, _rowCount);
			
			// 8. 
			if(_rowCount < collection.length) {
				// Only try this if we've not removed too many items.
				_carousel.page(currentPage);
			}
		}
	
		function _rebuild(/*Collection*/$elements) {
			// Replace _items array contents with elements passed in.
			// Note: This is all very hacky as the Carousel wasn't 
			// originally designed to rebuild on the fly.
			//  1. record currently showing page.
			//  2. empty the _items array.
			//  3. remove the controller.
			//  4. remove any added div.carousel, or just the class
			//  5. recall _init($elements, rowCount).
			//  6. move new carousel to recorded page number.
	
			// 1.
			var currentPage = _controller.property("count") ? _controller.property("count").page : 1;
	
			// 2. 
			_items = new Array();
	
			// 3.
			_controller.$node.remove();
	
			// 4.
			if(_options.wrapper.length > 0) {
				_container.$node.remove();
				_container = null;
			}
			else {
				_container.$node.removeClass(_options.wrapperClass);
			}
	
			// 5. 
			_init($elements, _rowCount);
	
			// 6. 
			if(_rowCount < $elements.length) {
				// Only try this if we've not removed too many items.
				_carousel.page(currentPage);
			}
	
			return _carousel;
		}
	
	
		// PUBLIC:
		this.controller = _controller;
		this.container = _container;
	
		this.automate = function(opts) {
			// Automate the forward/backward movements.
			// opts.interval = speed/duraction (how long to complete motion).
			// opts.reverse = movement (forward/back).
			var options = arguments.length > 0 ? opts : {};
			var interval = parseInt((options.interval != undefined ? options.interval : this.options.duration) + 100);
			var direction = options.reverse ? this.back : this.forward;
			if(_controller && !_automated && !isNaN(interval) && interval > 1) {
				window.setInterval(direction, interval);
				_automated = true;
			}
		}
	
		this.forward = function() {
			var step = _options.step;
			var action = _options.vertical ? _slideUp : _slideLeft;
			var count = _controller.property("count");
			var elementsPerPage = _options.vertical ? 1 : count.row; 
			if(!_controller.property("moving")) {
				_controller.property("moving", true); // prevent other moving actions
				action(
					step,
					function(){
						// Before movement.
						// Changes to fix issues caused by using jQuery clone() now leave this function unused.
					},
					function(){
						// After movement.
						_items = _items.concat(_items.splice(0, step)); // Moved items shifted to end of array.
						if(step == elementsPerPage) {
							count.page++;
						}
						_updateController("forward");
					}
				);
			}
		};
	
		this.back = function() {
			var step = _options.step;
			var action = _options.vertical ? _slideDown : _slideRight;
			var count = _controller.property("count");
			var elementsPerPage = _options.vertical ? 1 : count.row;
			if(!_controller.property("moving")) {
				_controller.property("moving", true); // prevent other moving actions
				action(
					step,
					function(){
						// Before movement.
						// Changed to avoid issues caused by using jQuery clone()
						// End row added to front of array.
						var lastItems = _items.splice(_items.length - step); // get last step number
						lastItems[0].css("left", _items[0].position().left - (_items[0].outerWidth(true) * step));
						for(var i=lastItems.length - 1; i>=0; --i) {
							_items.unshift(lastItems[i]);
						}
					},
					function(){
						// After movement.
						if(step == elementsPerPage) {
							count.page--;
						}
						_updateController("backward");
					}
				);
			}
		};
	
		this.page = function(number) {
	 		// TODO: Not entirely sure this works properly...
			var originalItems = _items.slice(0);
			var count = _controller.property("count");
			var page = count.page;
			var row = count.row;
			var step = row;
			var beforePageItems, pageItems, afterPageItems;
	
			// We cannot do if already moving. Number must be valid and not equal to current page.
			if(!_controller.property("moving") && number >= 1 && number <= count.pages && number != count.page) {
				_controller.property("moving", true); // prevent other moving actions
	
				number = Number(number);
				pageItems = _items.splice((number - page) * row, row); // get target page items.
	
				// Adjust order of items, reset left values based on new order, move, update controller.
				if(number > page) {
					// forwards...
					_slideLeft(
						row,
						function() {
							// Add the desired page row to the array after (visually right of) the currently visible row.
							beforePageItems = _items.slice(0, row);
							afterPageItems = _items.slice(row);
							_items = beforePageItems.concat(pageItems, afterPageItems);
						},
						function(){
							count.page = number;
							_items = originalItems.concat(originalItems.splice(0, (number - page) * row));
							_updateController("pageForward");
						}
					);
				}
				else { 
					// backwards...
					_slideRight(
						row,
						function(){
							// Set up left position of first element in desired page row  then add desired page row to end of the array.
							pageItems[0].css("left", _items[0].position().left - (_items[0].outerWidth(true) * row));
							_items = pageItems.concat(_items);
						},
						function(){
							count.page = number;
							_items = originalItems.splice((number - page) * row, originalItems.length - ((number - page) * row)).concat(originalItems);
							_updateController("pageBackward");
						}
					);
				}
			}
		}
		
		this.updateElements = _updateElements;
		this.rebuild = _rebuild;
	
		this.addSorting = function(func, label, selected) {
			var selected = (selected) ? "selected=\"selected\"" : "";
			var option = $("<option " + selected + ">" + label + "</option>");
			// Using focus because we want to call this by the Select onchange 
			// event for maximum browser compatibiity and easy coding.
			option.focus(function() {
				_sort(func);
			});
			if(_controller) {
				$(".sorting select", _controller.$node).append(option);
			}
		}
	
		this.sort = _sort;
	
	}
	
	
	
	
	// Custom sorting functions for Argos product carousels.
	if(!argos.classes.Carousel.products) argos.classes.Carousel.products = {};
	
	argos.classes.Carousel.products.sortTitleAToZ = function(a, b) {
		var titleA = $(a).find(".title").text();
		var titleB = $(b).find(".title").text();
		if(titleA < titleB) return -1;
		if(titleA == titleB) return 0;
		if(titleA > titleB) return 1;
	}
	
	argos.classes.Carousel.products.sortPriceLowToHigh = function(a, b) {
		// If the product has .price .main stucture, that's what we want. Else, just try getting price from dd.price
		var priceA = $(a).find(".price .main, dd.price").text().replace(/[?|&pound;|\s]/mg, "");
		var priceB = $(b).find(".price .main, dd.price").text().replace(/[?|&pound;|\s]/mg, "");
		priceA = priceA.slice(0, priceA.indexOf(".") + 3);
		priceB = priceB.slice(0, priceB.indexOf(".") + 3);
		if(priceA < priceB) return -1;
		if(priceA == priceB) return 0;
		if(priceA > priceB) return 1;
	}
	
	argos.classes.Carousel.products.sortRatingHighToLow = function(a, b) {
		var ratingA = Number($(a).find(".rating").text());
		var ratingB = Number($(b).find(".rating").text());
		if(ratingA > ratingB) return -1;
		if(ratingA == ratingB) return 0;
		if(ratingA < ratingB) return 1;
	}
	
	argos.classes.Carousel.products.reverse = function(a, b) {
		return 1;
	}
});
