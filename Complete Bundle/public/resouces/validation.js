/* Argos Validation object
 *************************
 * BASIC USE:
 * 1). Apply a validation function to a form.
 *		e.g. argos.validation.apply($(myform), myValidationFunction);
 * 2). Any detected errors in your validation function should result in passing both the jQuery(myField) and String(errorMessage) to handler()
 * 		e.g.   
 * 			if(myFirstCheckCausedError) {
 *  			handler($field1, "Field 1 first error message");
 *  			error = true;
 *  		}
 *  		if(!error && mySecondCheckCausedError) {
 *  			handler($field1, "Field 1 second error message");
 * 			}
 *  
 * ADVANCED USE: 
 * 1). Same as BASIC USE.  
 * 2). Same as BASIC USE but, due to a check of message validity within handler() function, you can abuse it to use shorthand scripting of checks. 
 *		e.g.   
 *		handler($field1, function() {
 *			if(myFirstCheckCausedError) return "Field 1 first error message";
 *			if(mySecondCheckCausedError) return "Field 1 second error message";
 *		}.call());
 *	
 *		This is effectively a different way to write the code example in BASIC USE.
 * 	
 * OTHER INFORMATION
 * 1). You can use your own messages or call ones that may already be stored. Stored messages should be place on argos.validation.messages object.
 * 2). You can alter the output area by using argos.validation.outputElement() to set a new object, before you use argos.validation.handler(). 	
*/
argos.validation = (new function(){
	var _validation = this;
	var _output = $();
	var ERROR_CONTAINER_CLASSNAME = "errorMessageContainer";
	var ERROR_FIELD_CLASSNAME = "errorField";
	var ERROR_LIST_CLASSNAME = "errorMessages";
	var ERROR_LIST_ELEMENT = "ul";
	var ERROR_ITEM_ELEMENT = "li";
	
	this.errors = 0;
	this.submitted = ""; // Populate with element ID using click events to submit buttons if you want to use this. 

	this.outputElement = function($el) {
		// You should set this in your form validation function before any handler call.
		if(arguments.length > 0) {
			try {
				$el.get(0).tagName;
				_output = $el;
			} catch (e) {
				if(e instanceof TypeError) {
					// We need an error container to continue. 
					throw new argos.classes.Error.Lookup($el.selector);
				}
			}
		}
		return _output;
	}
	
	this.handler = function(/*jQuery*/$field, /*String*/message) {
		// Controls what happens when an errors are found (customise the function if site design changes). 
		// Note: If Passing an undefined message no error will be created.
		var $oe = this.outputElement();
		var addedError = false;
		var $list;
		
		// Default style is for errors to be list items so we should have UL for outputElement.
		if($oe.get(0).tagName.toLowerCase() != ERROR_LIST_ELEMENT) {
			$list = $oe.find(ERROR_LIST_ELEMENT);
			if($list.length == 0) {
				$list = $("<" + ERROR_LIST_ELEMENT + "></" + ERROR_LIST_ELEMENT + ">");
				$list.addClass(ERROR_LIST_CLASSNAME);
				$oe.append($list);
			}
			this.outputElement($list);
		}
		
		// If the message is there, add it and do the rest. 
		if(message) {
			$field.addClass(ERROR_FIELD_CLASSNAME);
			this.outputElement().append("<" + ERROR_ITEM_ELEMENT + ">" + message + "</" + ERROR_ITEM_ELEMENT + ">");
			window.scrollTo(0, this.outputElement().offset().top);
			this.errors++;
			addedError = true;
		}
		
		return addedError;
	}
	
	this.reset = function(form) {
		var context = arguments.length > 0 ? form : document;
		$("." + ERROR_FIELD_CLASSNAME, context).removeClass(ERROR_FIELD_CLASSNAME);
		this.outputElement().children().remove();
		_validation.errors = 0;
	}
	
	this.apply = function($form, validation, $errorContainer) {
		var av = this;
		$form.submit(function() {
			av.outputElement($errorContainer && $errorContainer.length > 0 ? $errorContainer : $("." + ERROR_CONTAINER_CLASSNAME, $form)); // Likely just a empty DIV on first visit.
			av.reset($form); // Resets the form class (if set) and errors. 
			av[validation].call($form); // Forms should be on argos.validation object.		
			av.submitted = ""; // Reset for button submit (if set) needs to be after validation.call.
			return av.errors <= 0; // Value of false prevents form submit.
		});
	}
	this.off = function($form){
		var av = this;
		$form.off("submit");
	}
	this.highlightField = function(field) {
		// Only supporting legacy validation??
		field.className += " error";
		field.focus();
		field.select();
	}
	

	/* Argos Validation Check Functions 
	 ***********************************/
	this.check = {
		onlyValidCharacters: function(value, validChars) {
			// Allow only certain characters in a string
			// example usage:	isValidChar('132 \'-.', 'abcdefghijklmnopqrstuvwxyz1234567890 \'-.')"
			var valid = true;
			for (var i = 0; i < validChars.length; i++) {
				if (validChars.indexOf(value.charAt(i).toLowerCase()) == -1) {
					valid = false;
					break;
				}
			}
			return valid;
		},

		hasNumbers: function(str) {
			//Check string for numbers
			return str.search(/\d/) >= 0;
		},

		isNumeric: function(str) {
			return str.replace(",","").search(/^\d+\.(?=\d)\d*$/) >= 0;
		},

		isAlpha: function(str) {
			return str.search(/^[A-Za-z]+$/) >=0;
		},

		isAlphaAndNumeric: function(str) {
			return str.search(/^\w+$/) >=0;
		},
	
		isEmpty: function(str){
			return arguments.length < 1 || str.length <= 0;
		},

		isLength: function(str, length){
			// Checks string for specific length.
			return Boolean(str && str.length == Number(length));
		},

		minLength: function(str, length) {
			return Boolean(str && str.length >= Number(length));
		},

		luhn: function(/*String*/number) {
			var valid = false;
			var digit=0;
			var total=0;

			// Set the string length and parity
			var parity=number.length % 2;

			// Loop through each digit and do the maths
			for (i=0; i < number.length; ++i) {
				digit=Number(number.charAt(i));

				// Multiply alternate digits by two
				if (i % 2 == parity) {
					digit = digit * 2;

					// If the sum is two digits, add them together (in effect)
					if (digit > 9) {
						digit=digit - 9;
					}
				}

				// Total up the digits
				total = total + parseInt(digit);
			}

			// If the total mod 10 equals 0, the number is valid
			if (total % 10 == 0) {
				value = true;
			} 

			return valid;
		},

		emailAddress: function(email){
			var valid = false;
			var SP = "\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\_\\`\\{\\|\\}\\~";
			var ATEXT = "[a-zA-Z0-9" + SP + "]";
			var ATOM = ATEXT + "+";
			var DOTATOM = "\\." + ATOM;
			var LOCALPART = ATOM + "(" + DOTATOM + ")*";
			// RFC 1035 tokens for domain names:
			var LETTER = "[a-zA-Z]";
			var LETDIG = "[a-zA-Z0-9]";
			var LETDIGHYP = "[a-zA-Z0-9-]";
			var RFCLABEL = LETDIG + "(" + LETDIGHYP + "{0,61}" + LETDIG + ")?";
			var DOMAIN = RFCLABEL + "(\\." + RFCLABEL + ")*\\." + LETTER + "{2,6}";
			//Combined together, these form the allowed email regexp allowed by RFC 2822:
			var ADDRSPEC = "^" + LOCALPART + "@" + DOMAIN + "$";
			var regex = new RegExp(ADDRSPEC+"|^$");

			if (regex.test(email)) {
				valid = true;
			}
			return valid;
		},

		// Check to see if the field is made of valid "name characters" only.
		nameCharacters: function(name){
			var regex = new RegExp("^([a-zA-Z- '`])+$|^$");
			return regex.test(name);
		},

		phoneNumber: function(value) {
			var valid = false;
			var regex = new RegExp("^[+]?[0-9- ]*\\({1}[0-9]+\\){1}[0-9- ]+$|^[+]?[0-9- ]+$|^$");

			if(value && value != "" && value.length >= 9 && regex.test(value)) {
				valid = true;
			}

			// If it is 100
			if(value === "100") {
				valid = true;
			}

			return valid;
		},

		// Check to see if the field value is a valid number.
		number: function(value) {
			var regex = new RegExp("^([0-9])+$|^$");
			return regex.test(value);
		},

		// Check to see if the field value is a string made up of alpha digit special characters, full stops.
		alphaDigitsSpecialFullStop: function(value) {
			var regex = new RegExp("^([a-zA-Z0-9- '`.])+$|^$");
			return regex.test(value);
		},

		// Check to see if the field value is a string made up of alpha digit special characters, commas.
		alphaDigitsSpecialComma: function(value) {
			var regex = new RegExp("^([a-zA-Z0-9- '`,])+$|^$");
			return regex.test(value);
		},

		// Check to see if the field value is a string made up of alpha digit special characters, commas or a full stop.
		alphaDigitsSpecialCommaFullStop: function(str) {
			var regex = new RegExp("^([a-zA-Z0-9- '`.,])+$|^$");
			return regex.test(str);
		},

		// Compare two field values.
		matches: function(value, matchValue) {
			return value === matchValue;
		},

		// Check to see if the field is made of valid "letters or numbers or space" only.
		lettersNumbers: function(str){
			var regex = new RegExp("^([ a-zA-Z0-9])+$|^$");
			return regex.test(str);
		},

		lettersNumbersNoSpaces: function(str){
			var regex = new RegExp("^([a-zA-Z0-9])+$|^$");
			return regex.test(str);
		},

		letters: function(str){
			var regex = new RegExp("^([a-zA-Z ])+$|^$");
			return regex.test(str);
		},

		// Watford, St. Albans, Watton-at-Stone. 
		townName: function(str) {
			var regex = new RegExp("^([a-zA-Z-',. ])+$|^$");
			return regex.test(str);
		},
		
		postcode: function(postcode) {
			var regex = new RegExp("^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {0,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$","i");
			return regex.test(postcode);
		},
		
		// Check field has value when separate field is checked. 
		emptyWhenFieldChecked: function(value, field) {
			return field && field.checked && argos.validation.check.isEmpty(value);
		},

		password: function(password) {
			// must be 6 or more characters
			// must contain at least 2 alpha chars
			// must contain at least 2 numeric chars
			// argos.app.passwordNoChange is visual aid allowing no change to existing value without sending actual password to HTML. 
			var str = password ? password : "";
			var numbers = str.replace(/[^\d]/gm, "").length;
			var letters = str.replace(/[^a-z]/gim, "").length;
			return str.length >= 6 && numbers > 1 && letters > 1 || str == argos.app.passwordNoChange;
		},
		
		argosChallengeAnswer: function(answer) {
			var regex = new RegExp(/^([a-zA-Z0-9]){2,}$|^$/);
			return regex.test(answer);
		}
	}
	
	
	/* Argos Validation Messages
	 ***************************/
	this.messages = { 
		// These should all be set in storetext and will be fed into errorMessages template by BE.
	}
	
});

/* Initialise Argos Validations
********************************/
$(document).ready(function(){
	var $body = argos.page.elements.body;
	var $form;
	
	if($body.hasClass("login")) {
		argos.validation.apply($("#registerUserForm"), "registration");
		argos.validation.apply($("#main #userRecognition form"), "signInOrJoinForm");
		$("#forgotPassword").click(function() { argos.validation.submitted = this.id; });
        argos.validation.apply($(".forgottenPasswordOuter form"), "forgottenPasswordForm");
	}

}); 

/* Argos Validation General and (small only) Page Specific Functions
 *******************************************************************/
argos.validation.applySearchValidation = function() {
	// JS to remove '/' char from the search string + upper case
	// + mid (colapse multiple spaces to 1), left and right trim (whitespace)
	var check = argos.validation.check;
	var $input = $("#search form input[type='text']");
	var text = $input.attr("value");
	var newSearchText = text.replace(/\//gi, "");
	var count = newSearchText.split('"').length;
	var leftChr = newSearchText.charAt(newSearchText.indexOf('"')-1);
	var isValidChr = true;
	var valid = true;
	var escapedSearchText;

	//PEP429 Convert one occurance of double quote to IN if after letter or number
	//if there is more than one quote, convert them all to blank
	//or if there is just one quote but it's the first character or is after a space then convert to blank
	if (count > 2 || (leftChr == "" || leftChr == " ") && count == 2) {
		newSearchText = newSearchText.replace(/"/g, '');
	}

	//Now our string either has no quotes or just one so lastly we need to
	//check that the character before the double quote is a valid char. If
	//it isn't, remove it.
	if (!check.isAlpha(leftChr) && !check.isNumeric(leftChr)) {
		isValidChr = false;
		newSearchText = newSearchText.replace(/"/,'')
	}
	//If it's valid, convert the quote to IN
	if (count == 2 && (leftChr != "" || leftChr != " ") && isValidChr) {
		newSearchText = newSearchText.replace(/"/,'IN')
	}
	
	newSearchText = newSearchText.toUpperCase();
	newSearchText = newSearchText.replace(/[\s]+/g, " ");
	$input.attr("value", newSearchText);
	
	// Currently code above does not invalidate code.
	return valid;
}

/* Sign in or Join (dropdown/page)
 **********************************/
argos.validation.signInOrJoinForm = function() {
	var $email = $("#logonId");
	var $password = $("#password");
	var $ccaUser = $("input.radio[value='ccauser']").attr("checked");
	var forgotPassword = (argos.validation.submitted == "forgotPassword");
	
	with(argos.validation) {
		// Email address
		if(!$ccaUser) {
			handler($email, function() {
				var value = $email.val();
				if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_MISSING;
				if(!check.emailAddress(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_FORMAT;
			}.call());
		}
		
		if(!forgotPassword) {
			handler($password, function() {
				var value = $password.val();
				if ($("input.radio[value='loginuser']").attr("checked")){
					if(check.isEmpty(value)) return messages.LOGON_ERROR_PASSWORD_MISSING;
					if(!check.password(value)) return messages._ERR_PREF_ACCOUNT_ERROR_PASSWORD_SIZE;
				}
			}.call());
		}
	}
}

/* Forgotten password form
**************************/

argos.validation.forgottenPasswordForm = function() {
        var $email = $("#forgottenEmail");
        with(argos.validation) {
                // Email address
                handler($email, function() {
                        var value = $email.val();
                        if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_MISSING;
                        if(!check.emailAddress(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_FORMAT;
                }.call());
        }
}


/* Registration form
 ********************/
argos.validation.registration = function() {
	argos.validation.name();
	//argos.validation.telephone();
	argos.validation.postcode();
	argos.validation.account();
}

/* Title and name
 *****************/
argos.validation.name = function() {
	var $title = $("#personTitle");
	var $firstName = $("#firstName");
	var $secondName = $("#lastName");
	
	with(argos.validation) {
		// Title checks
		handler($title, function() {
			var value = $title.val();
			if(check.isEmpty(value)) return messages.CREATE_ACCOUNT_ERROR_PERSONTITLE_MISSING;
		}.call());

		// First name checks
		handler($firstName, function() {
			var value = $firstName.val();
			if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_FIRSTNAME_MISSING;
			if(!check.nameCharacters(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_FIRSTNAME_FORMAT;
		}.call());
		
		// Second name checks
		handler($secondName, function() {
			var value = $secondName.val();
			if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_SURNAME_MISSING;
			if(!check.nameCharacters(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_SURNAME_FORMAT;
			if(!check.minLength(value, 2)) return messages._ERR_CREATE_ACCOUNT_ERROR_SURNAME_SIZE;
		}.call());
	}
}

/* Address
 **********/
argos.validation.postcode = function() {
	var $postcode = $("#zipCode");

	with(argos.validation) {
		handler($postcode, function() {
			var value = $postcode.val();
			if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_POSTCODE_MISSING;
			if(!check.postcode(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_POSTCODE_FORMAT;
		}.call());
	}
}

argos.validation.address = function() {
	var $house = $("#houseNumber");
	var $address1 = $("#address1");
	var $town = $("#city");
	var $county = $("#state");

	// Likely to have validation for other address fields...
	
	with(argos.validation) {
		// House name/number
		handler($house, function() {
			var value = $house.val();
			if(check.isEmpty(value)) return messages.CREATE_ACCOUNT_ERROR_HOUSE_NUMNAME_MISSING;
		}.call());

		// Address line 1
		handler($address1, function() {
			var value = $address1.val();
			if(check.isEmpty(value)) return messages.CREATE_ACCOUNT_ERROR_ADDRESS1_MISSING;
		}.call());

		// Town
		handler($town, function() {
			var value = $town.val();
			if(check.isEmpty(value)) return messages.CREATE_ACCOUNT_ERROR_CITY_MISSING;
			if(!check.minLength(value, 3)) return messages.CREATE_ACCOUNT_ERROR_CITY_FORMAT_1;
		}.call());

		//county
		handler($county, function() {
			var value = $county.val();
			if(!check.isEmpty(value) && !check.townName(value)) return messages.CREATE_ACCOUNT_ERROR_STATE_FORMAT;
		}.call());

		postcode();
	}
}

argos.validation.location = function() {
	// Validates Postcode or Town name
	var $location = $("#location");
	
	with(argos.validation) {	
		handler($location, function() {
			var value = $location.val();
			if(check.isEmpty(value)) return messages._ERR_MISSING_POSTCODE_OR_TOWN;
			if(/\d+/.test(value)) {
				// Assume Postcode
				if(!check.postcode(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_POSTCODE_FORMAT;
			}
		}.call());
	}
}

/* Username and password
 *************************/
argos.validation.account = function() {
	var $email = $("#logonId");
	var $emailConfirm = $("#repeatLogonId");
	var $password = $("#logonPassword");
	var $passwordConfirm = $("#logonPasswordVerify");
	
	with(argos.validation) {
		// Email address
		if(! handler($email, function() {
				var value = $email.val();
				if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_MISSING;
				if(!check.emailAddress(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_EMAIL1_FORMAT;
			}.call()) ){
		
			// Confirm email address
			handler($emailConfirm, function() {
				var value = $emailConfirm.val();
				if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_REPEATLOGONID_MISSING;
				if(!check.matches(value, $email.val())) return messages._ERR_CREATE_ACCOUNT_ERROR_REPEATLOGONID_MISMATCH;
			}.call());
		}
		
		// Password
		if(! handler($password, function() {
				var value = $password.val();
				if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_PASSWORD_MISSING;
				if(!check.password(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_PASSWORD_SIZE;
			}.call()) ){
		
			// Confirm password
			handler($passwordConfirm, function() {
				var value = $passwordConfirm.val();
				if(check.isEmpty(value)) return messages._ERR_CREATE_ACCOUNT_ERROR_PASSWORDVERIFY_MISSING;
				if(!check.matches(value, $password.val())) return messages._ERR_CREATE_ACCOUNT_ERROR_PASSWORDVERIFY_MISMATCH;
			}.call());
		}
	}
}

/* Telephone number
 *******************/
argos.validation.telephone = function() {
	var $mobile = $("#phone2");
	var $home = $("#phone1");
	var mv = $mobile.length > 0 ? $mobile.val() : "";
	var hv = $home.length > 0 ? $home.val() : "";

	with(argos.validation) {	
		if(!handler($mobile, function() {
			var mvEmtpy = check.isEmpty(mv);
			if(mvEmtpy && check.isEmpty(hv)) return messages._ERR_CREATE_ACCOUNT_ERROR_MOBILEPHONE1_MISSING;
			if(!mvEmtpy && !check.phoneNumber(mv)) return messages._ERR_CREATE_ACCOUNT_ERROR_MOBILEPHONE1_FORMAT;
		}.call())) {
			handler($home, function() {
				if(!check.isEmpty(hv) && !check.phoneNumber(hv)) return messages._ERR_CREATE_ACCOUNT_ERROR_MOBILEPHONE1_FORMAT;
			}.call()); 
		}
	}
}


/* Name, address, telephone number
 *********************************/
argos.validation.contactDetails = function() {
	argos.validation.name();
	argos.validation.address();
	argos.validation.telephone();
}

