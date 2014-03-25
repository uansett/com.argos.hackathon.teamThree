// Copyright 2013 Accenture. (4-9-1-p0) 5a3aa400eb05
window.ADO||(window.ADO={});
(function(){function k(a,b){var c=[],d=null,f,b=b||[];for(f=0;f<b.length;f=f+1){d=b[f];if(typeof d==="string"||typeof d.length!=="number")d=[d];c.push(a.apply(null,d))}return c}function y(a,b){var c=b?m+a:a,d=document.createElement("script");d.setAttribute("src",c);document.getElementsByTagName("HEAD")[0].appendChild(d);return d}function H(a,b){if(I)y(a,b);else{o.push([a,b]);o.length===1&&y(a,b)}}function q(){var a={},b={},c;for(c=0;c<i.length;c=c+1)i[c][1].type==="FACT"?a[i[c][1].name]=i[c][0]||
i[c][1].defaultValue:i[c][1].type==="CHAR"&&(b[i[c][1].name]=i[c][0]||i[c][1].defaultValue);ADO.storeData(function(){return"__ADO_FACTS__="+ADO.encodeRawData(a)+"&__ADO_CHARS__="+ADO.encodeRawData(b)},ADO.allocationP);i=[];ADO.allocationP=false}function T(a){return function(b){var c;if(b)c=b.target===void 0?b.srcElement:b.target;else c=this;var d=c;if(ADO.enableCrossDomain&&ADO.visitorInfo){ADO.addHiddenInput(d,l,ADO.visitorInfo.visitorKey);ADO.visitorInfo.sampledP||ADO.addHiddenInput(d,n,"T")}z=
d;r=setTimeout(function(){d._ADO_submit()},ADO.captureTimeoutValue);ADO.runSafely(a,"form capture");q();b&&ADO.stopEvent(b)}}function J(a){return(a=a.attributes.getNamedItem("href"))?a.value:null}function U(a){for(;a;){if(J(a))return["href",a];if(a.tagName==="FORM")return["form",a];a=a.parentNode}return null}function K(a){var b=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f",
"\r":"\\r",'"':'\\"',"\\":"\\\\"};b.lastIndex=0;return b.test(a)?'"'+a.replace(b,function(a){var b=c[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function L(){if(!p){var a,b=ADO.context.OnContentReady.selectors;a=s;var c=0,d=0,f;for(f in b)if(b.hasOwnProperty(f)){var e=true,g=f.split(","),j;for(j in g){var h;if(h=g.hasOwnProperty(j))if(h=!A[g[j]]){h=A;var m=g[j],l;var k=g[j];try{l=B[k]?B[k]():document.getElementById(k)||ADO.getElementByXPath(k)}catch(o){l=
false}h=!(h[m]=l)}if(h){e=false;d=d+1}}if(e){for(var n in b[f])if(b[f].hasOwnProperty(n)){a.push(b[f][n]);c=c+1}delete b[f]}}a=[c,d];b=a[0];a=a[1];for(c=0;c<b;c=c+1){t=true;d=ADO.context.OnContentReady;if(s.length>0){f=s.splice(0,1)[0];ADO.runSafely(f,d)}}if(!a&&!s.length&&(i.length||ADO.allocationP)){ADO.allocationP||clearInterval(C);q();for(b=0;b<ADO.context.AfterTransformation.thunks.length;b=b+1)ADO.runSafely(ADO.context.AfterTransformation.thunks[b],"AfterTrasformation")}}}var e={},u=null,m=
null,I=false,o=[],M=null,p=false,t=false,D=[],v,z,r,l="__ADO_VISITOR_KEY__",n="__ADO_PREVENT_SAMPLING_P__",w=[],E=0,C=null,i=[];e.ADOError=function(a,b){this.name="ADOError";this.message=a||"Unknown ADO Error";this.context=b};e.ADOError.prototype=Error();e.ADOError.prototype.constructor=e.ADOError;var N=["info","warning","error","none"];e.registerError=function(a){E=E+1;if(ADO.debugEndpoint&&!(N.indexOf(ADO.debugLevel)>N.indexOf("error")||E>=200)){a&&w.push(a);ADO.logErrors&&ADO.error(a)}};var O=
function(a){if(a)try{document.body.appendChild(a)}catch(b){ADO.addEvent(window,"load",function(){document.body.appendChild(a)})}return a},F=0;e.reportAndClearAllErrors=function(a){if(F<=10){var b;b=null;var c;c=w;var a=a||ADO.getCookie(ADO.cookieName),d=null;if(c&&c.length>0){d=ADO.debugEndpoint+"?__ADO_EXCEPTIONS__="+ADO.encodeRawData(w);d=a!==null?d+"&__ADO_COOKIE__="+encodeURIComponent(a):d+"&__CACHE_BUSTER__="+Math.random().toString(36).toUpperCase().substring(2,8)}if(c=d){b=Image===void 0?document.createElement("img"):
new Image(1,1);b.src=c}if(b){O(b);F=F+1}}w=[]};e.addHiddenInput=function(a,b,c){var d=document.createElement("input");d.setAttribute("type","hidden");d.setAttribute("name",b);d.setAttribute("value",c);a.appendChild(d)};var P=["log","debug","info","warn","assert","error","exception","group","groupCollapsed","groupEnd"],h,V=function(a){var b=P[a];e[b]=function(a,d){var f={};f[b]=arguments;ADO.logs.push(f);if(window.console)try{b&&console[b]&&console[b].apply(console,arguments)}catch(e){ADO.registerError(new ADO.ADOError("failed to log into ["+
b+"]: "+arguments))}}};for(h=0;h<P.length;h=h+1)V(h);e.stopEvent=function(a){var b;b=a||window.event;b.cancelBubble=true;b.stopPropagation&&b.stopPropagation();a=a||window.event;a.preventDefault?a.preventDefault():a.returnValue=false};e.hasTagName=function(a,b){return a&&a.tagName?a.tagName.toLowerCase()===b.toLowerCase():false};e.computeLocation=function(a){if(!ADO.enableCrossDomain||ADO.visitorInfo===void 0)return a;var b=a.search("\\?")===-1?"?":"&",c="";ADO.visitorInfo.sampledP||(c="&"+n+"=T");
return a+b+l+"="+encodeURIComponent(ADO.visitorInfo.visitorKey)+c};e.releaseAllScripts=function(a,b){var c=ADO.getCookieDomain();document.cookie=a+(c?";Domain="+c:"");if(!p){I=true;c=o.slice(1);o=[];k(y,c);ADO.mode=b;if(ADO.mode===ADO.outcomeType)ADO.maybeGotoStoredLocation();else if(ADO.pendingOutcomes){c=a.match(/^[^=]*=([^;]*);/);if(c.length===2)for(;ADO.pendingOutcomes.length>0;){var d=ADO.pendingOutcomes.shift(),d=ADO.createPixelTrackingImg(d.facts,d.chars,d.autoAttach,c[1]);ADO.deferredPixels?
ADO.deferredPixels.push(d):ADO.deferredPixels=[d]}}}};e.getCookieDomain=function(){return ADO.domain?ADO.domain:null};e.getCookie=function(a){var b=document.cookie;if(!b)return null;for(var b=b.split(";"),c=a+"=",a=0;a<b.length;a=a+1){var d=b[a].replace(/^\s+|\s+$/g,"");if(d.indexOf(c)===0)return d.substring(c.length)}return null};e.getCookieValue=function(a,b){return ADO.getCookie(a)||b};e.makeVisible=function(a){a=ADO.getElement(a);a.style.visibility="visible"};e.makeVisibleWhenElementLoaded=function(a){ADO.addEvent(a,
"load",function(){ADO.makeVisible(a)})};e.registerFormCapture=function(a,b){if(a._ADO_submit===void 0){a._ADO_submit=a.submit;var c=T(b);a.submit=c;ADO.addEvent(a,"submit",c)}};e.changeDocumentLocationHrefSafely=function(a){var b;if(!ADO.getQueryStringValue("__ADO_CHANGE_LOCATION_ACTION_FIRED__")){b=a.search("\\?")>0?"&":"?";if(document.location.search){a=a+b+document.location.search.substring(1);b="&"}document.location.href=a+b+"__ADO_CHANGE_LOCATION_ACTION_FIRED__=T"}};e.stop=function(a){if(!ADO.stoppedP){ADO.stoppedP=
true;M=a}};e.registerCleanupThunk=function(a){if(t)return false;p?ADO.runSafely(a,"ADO cleanup thunk at registration call"):D.push(a)};e.runCleanupThunks=function(){if(t)return false;clearInterval(C);ADO.doDefaults()};e.doDefaults=function(){var a;if(p)return false;p=true;for(a=0;a<D.length;a=a+1)ADO.runSafely(D[a],"ADO cleanup thunk in doDefaults loop");ADO.doneDefaults=true};e.setStyle=function(a,b){for(var c in b)if(b.hasOwnProperty(c)){for(var d=a.style,f=c.toLowerCase().split("-"),e=f[0],g=void 0,
j=void 0,j=1;j<f.length;j=j+1){g=f[j];e=e+(g.charAt(0).toUpperCase()+g.substring(1))}d[e]=b[c]||""}};e.setRawCss=function(a,b){if(b)a.style.cssText=a.style.cssText?a.style.cssText+(";"+b):b};e.addStylesheet=function(a,b){var c=document.createElement("style");c.setAttribute("type","text/css");b&&c.setAttribute("id",b);c.styleSheet?c.styleSheet.cssText=a:c.appendChild(document.createTextNode(a));document.getElementsByTagName("head").item(0).appendChild(c)};e.maybeGotoStoredLocation=function(){r!==void 0&&
window.clearTimeout(r);v!==void 0&&window.open(v,"_self");z!==void 0&&z._ADO_submit()};e.JSONstringifyNVArray=function(a){var b="",c;for(c=0;c<a.length;c=c+1){c>0&&(b=b+",");b=b+("["+K(a[c][0])+","+K(a[c][1])+"]")}return"["+b+"]"};e.encodeRawData=function(a){var b=[],c,d,f;for(f in a)if(a.hasOwnProperty(f)){c=a[f];typeof c==="function"&&(c=ADO.runSafely(c));if(c instanceof Array)for(d=0;d<c.length;d=d+1)b.push([f,""+c[d]]);else b.push([f,""+c])}return encodeURIComponent(ADO.JSONstringifyNVArray(b))};
e.makeServicePoint=function(a,b){var c=document.getElementsByTagName("script"),d,f=c[c.length-1].src,e;for(e=c.length-1;e>=0;e=e-1){d=c[e];if(-1!==d.src.search(a))f=d.src}return f.substring(0,f.indexOf(a))+b};e.storeData=function(a,b){if(ADO.hiddenUrl){var c=ADO.getCookie(ADO.cookieName),d;if(!(d=c)){d=ADO.getCookieDomain();document.cookie="__ADO_TEST_COOKIE__=__ADO_TEST_COOKIE__"+(d?";Domain="+d:"");d=ADO.getCookie("__ADO_TEST_COOKIE__")?true:false}var f=a(),e=f||d||b?ADO.hiddenUrl+"?":ADO.hiddenUrl;
if(c){f!==""&&(f=f+"&");f=f+"__ADO_COOKIE__="+encodeURIComponent(ADO.cookieName+"="+c)}if(d){f!==""&&(f=f+"&");f=f+"__COOKIE_OK_P__=T"}if(b){f!==""&&(f=f+"&");f=f+"__BODY_ONLOAD_P__=T"}if(ADO.getQueryStringValue(n)){f!==""&&(f=f+"&");f=f+n+"=T"}if(ADO.getQueryStringValue(l)){f!==""&&(f=f+"&");f=f+l+"="+encodeURIComponent(ADO.getQueryStringValue(l))}H(e+f,false)}};e.storeStopped=function(){ADO.hiddenUrl&&H(ADO.hiddenUrl+"?__ADO_STOPPED_P__=T&__ADO_STOPPED_REASON__="+encodeURIComponent(M),false)};e.registerForClickCapture=
function(a,b){var c=document.getElementById(a)||ADO.getElementByXPath(a);if(c){var d=U(c);if(d){var f=d[0],e=d[1],g=(d=e.target)&&d.toLowerCase()!=="_self"&&d!==window.name,d=function(c){if(c.which===void 0?c.button<=1:c.which===1){ADO.clickedElementID=a;ADO.captureClick(e,b,g);g||ADO.stopEvent(c)}};if(f==="href"){ADO.addEvent(c,"mouseup",d);g||ADO.addEvent(c,"click",function(a){ADO.stopEvent(a)})}else f==="form"&&ADO.registerFormCapture(e,b)}}};e.captureClick=function(a,b,c){var d=ADO.computeLocation(J(a));
if(c)a.href=d;else{v=d;r=setTimeout(function(){window.open(v,"_self")},ADO.captureTimeoutValue)}ADO.runSafely(b,"capture click");q()};e.addEvent=function(a,b,c){if(a.addEventListener){a.addEventListener(b,c,false);return true}return a.attachEvent?a.attachEvent("on"+b,c):false};e.isNullOrUndefined=function(a){return a===null||a===void 0};e.hasProperties=function(a){for(var b in a)if(a.hasOwnProperty(b))return true;return false};e.getElement=function(a){return typeof a==="string"?document.getElementById(a):
a};e.getQueryStringValue=function(a,b){if(u===null){u=[];var c=null,d;c=window.location.search.substring(1);try{d=decodeURIComponent(c)}catch(f){d=unescape(c)}d=d.split("&");var e;for(e=0;e<d.length;e=e+1){c=d[e].indexOf("=");c>0&&(u[d[e].substring(0,c)]=d[e].substring(c+1))}}return u[a]||b};e.getDomNodeContent=function(a,b){var c=ADO.getElement(a)||ADO.getElementByPrimitiveXPath(a);if(c){var d=c.tagName.toUpperCase();if(d==="TEXTAREA")return c.value;if(d==="INPUT"){d=c.type.toUpperCase();return d===
"RADIO"||d==="CHECKBOX"?c.checked?c.value:"":c.value}return c.innerHTML}return b};e.getQueryString=function(){var a=document.location.search;return a.charAt(0)==="?"?a.substring(1):a};e.reorderElements=function(a,b){var c=a,d=b,f={},e=[],g,h;for(g=0;g<c.length;g=g+1)f[c[g]]=1;for(g=0;g<d.length;g=g+1)f[d[g]]&&(f[d[g]]=2);for(h in f)f.hasOwnProperty(h)&&f[h]===2&&e.push(h);if(!(e.length===a.length&&a.length===b.length)){ADO.registerError(new ADO.ADOError(a+" is not a permuation of "+b+", cannot reorder DOM elements."));
return null}a=k(ADO.getElement,a);b=k(ADO.getElement,b);for(d=0;d<a.length;d=d+1){c=a[d];f=b[d];f={id:f.id};e=document.createElement("div");g=void 0;for(g in f)f.hasOwnProperty(g)&&e.setAttribute(g,f[g]);c.parentNode.replaceChild(e,c)}for(d=0;d<b.length;d=d+1){f=b[d];e=ADO.getElement(f.id);e.parentNode.replaceChild(f,e)}};e.getElementByPrimitiveXPath=function(a){a:{var a=a.split("/"),b=[],c,d;for(c=0;c<a.length;c=c+1)if(a[c]==="")b.push(null);else{d=a[c].match(/^([A-Z][A-Z0-9]*)\[(\d+)\]$/);if(d!==
null&&parseInt(d[2],10)>0)b.push({name:d[1],index:parseInt(d[2],10)});else{a=null;break a}}a=b}var b=null,f;if(a!==null){b=document;for(d=0;d<a.length;d=d+1)if(a[d]!==null&&b!==null){c=b.firstChild;b=null;for(f=1;b===null&&c!==null;){if(c.nodeType===1&&c.nodeName.toUpperCase()===a[d].name){f===a[d].index&&(b=c);f=f+1}c=c.nextSibling}}}return b};e.computePixelTrackingURL=function(a,b,c){c=c||ADO.getCookie(ADO.cookieName);return c!==null&&(a||b)?ADO.imgTrackingUrl+"?__CACHE_BUSTER__="+Math.random().toString(36).toUpperCase().substring(2,
8)+(a?"&__ADO_FACTS__="+ADO.encodeRawData(a):"")+(b?"&__ADO_CHARS__="+ADO.encodeRawData(b):"")+"&__ADO_COOKIE__="+encodeURIComponent(ADO.cookieName+"="+c):null};e.createPixelTrackingImg=function(a,b,c,d){if(ADO.getCookie(ADO.cookieName)||d){var f=new Image(1,1);f.src=d?ADO.computePixelTrackingURL(a,b,d):ADO.computePixelTrackingURL(a,b);c&&O(f);return f}ADO.debug("ADO tracking pixel was requested, but no tracking cookie exists yet. Deferring creation until the visitor token is received. NULL value will be returned.");
d={};d.facts=a||null;d.chars=b||null;d.autoAttach=c?true:false;ADO.pendingOutcomes?ADO.pendingOutcomes.push(d):ADO.pendingOutcomes=[d]};e.storeFactsAndCharacteristics=function(a,b){ADO.createPixelTrackingImg(a,b,true)};e.getElementByXPath=function(a){var b;a:{try{document.createExpression(a,null);b=true;break a}catch(c){}b=false}if(b)return(a=document.evaluate(a,document,null,7,null))?a.snapshotItem(0):null;return ADO.getElementByPrimitiveXPath(a)};var A={},B={};e.runSafely=function(a,b){var c;try{c=
a&&a.execute?function(){var b=k(function(a){return A[a]},a.selectors);return a.execute.apply(a,b)}():a()}catch(d){d instanceof ADO.ADOError?ADO.registerError(d):ADO.registerError(new ADO.ADOError(d.message,b))}c&&i.push(c)};var s=[],G={HTMLReplacement:function(a,b){return{selectors:[a],content:b,execute:function(a){a.innerHTML=this.content;ADO.makeVisible(a)}}},image:function(a,b,c){return{selectors:[a],execute:function(a){ADO.makeVisibleWhenElementLoaded(a);a.src=b;if(c)a.alt=c}}},globalCSS:function(a){return{execute:function(){ADO.addStylesheet(a)}}},
nodeCSS:function(a,b,c){return{selectors:[a],execute:function(a){ADO.setRawCss(a,b);ADO.setStyle(a,c);ADO.makeVisible(a)}}},toggleVisibility:function(a,b){return{selectors:[a],execute:function(a){a.style.display=b;ADO.makeVisible(a)}}},javaScript:function(a,b){return{selectors:a,execute:b}},changeURL:function(a,b,c){return{selectors:[a],execute:function(a){ADO.makeVisibleWhenElementLoaded(a);var f=a.src;a.src=c;f===c&&ADO.makeVisible(a);if(b&&ADO.hasTagName(a,"img"))a.alt=b}}},callback:function(a,
b){var c=Math.random().toString(36).toUpperCase().substring(2);B[c]=a;return{selectors:[c],execute:b}}},Q=function(a){var b,c=[];for(b in a)a.hasOwnProperty(b)&&(c=c.concat(a[b].selectors||[]));return c},W={add:function(a){ADO.register(a,a.context)}},R={selectors:{},add:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(this.selectors.hasOwnProperty(b[c])?this.selectors[b[c]].push(a):this.selectors[b[c]]=[a])},schedule:function(){var a=this,b,c=function(b){var c=Q(a.selectors[b]);ADO.register(G.javaScript([b].concat(c),
function(){ADO.registerForClickCapture(b,function(){for(var c in a.selectors[b])a.selectors[b].hasOwnProperty(c)&&ADO.runSafely(a.selectors[b][c],"click capture")})}),ADO.context.OnContentReady)};for(b in this.selectors)this.selectors.hasOwnProperty(b)&&c(b)}},S={delays:{},add:function(a,b){(!b||b<=0)&&ADO.registerError("Delay capture must have a valid delay in milliseconds");this.delays.hasOwnProperty(b)?this.delays[b].push(a):this.delays[b]=[a]},schedule:function(){var a=this.delays,b,c=function(b){return function(){var c=
a[b],e=Q(c);ADO.register(G.javaScript(e,function(){for(var a in c)c.hasOwnProperty(a)&&ADO.runSafely(c[a],c[a].context||"delay");q()}))}};for(b in a)if(a.hasOwnProperty(b)){t=true;setTimeout(c(b),b*1E3)}}};e.startProcessor=function(){C=setInterval(L,10);S.schedule();R.schedule();ADO.addEvent(window,"load",function(){var a;for(a=0;a<ADO.context.OnWindowLoad.thunks.length;a=a+1)ADO.runSafely(ADO.context.OnWindowLoad.thunks[a],"OnWindowLoad")});L()};e.fact=function(a,b,c){return{name:a,value:b,saveIfNull:c===
void 0?true:c,type:"FACT"}};e.characteristic=function(a,b,c){return{name:a,value:b,saveIfNull:c===void 0?true:c,type:"CHAR"}};h={};e.captureInfo=function(a,b,c){return{name:a,type:b,defaultValue:c}};h.staticString=function(a,b){return{execute:function(){return[a,b]}}};h.queryString=function(a,b){return{execute:function(){return[ADO.getQueryStringValue(a),b]}}};h.cookie=function(a,b){return{execute:function(){return[ADO.getCookieValue(a),b]}}};h.content=function(a,b){return{selectors:[a],execute:function(a){return[ADO.getDomNodeContent(a),
b]}}};h.javaScript=function(a,b,c){return{selectors:b||[],execute:function(){return[a(),c]}}};e.createClickCapture=function(a,b){return R.add(a,b)};e.createDelayCapture=function(a,b){return S.add(a,b)};e.createRegularCapture=function(a){return W.add(a)};e.register=function(a,b){var c=a.selectors&&a.selectors.length?ADO.context.OnContentReady:ADO.context.ExecuteImmediately,d;if(typeof b==="string"){d=b;b=ADO.context.ExecuteImmediately}else{b=b||c;a:{c=b;for(d in ADO.context)if(ADO.context.hasOwnProperty(d)&&
c===ADO.context[d])break a;d=void 0}}if(!d){ADO.registerError("Attempt to register "+b+" action with unknown context.");return null}b===ADO.context.ExecuteImmediately?ADO.runSafely(a,"Standard action/capture execution in '"+b+"' context"):b.add(a);return a};ADO.captures=h;ADO.actions=G;ADO.context={ExecuteImmediately:{},OnContentReady:{selectors:{},add:function(a){a.selectors||ADO.registerError("Action/Capture must have selectors for OnContentReady context");this.selectors.hasOwnProperty(a.selectors)?
this.selectors[a.selectors].push(a):this.selectors[a.selectors]=[a]}},AfterTransformation:{thunks:[],add:function(a){this.thunks.push(a)}},OnWindowLoad:{thunks:[],add:function(a){this.thunks.push(a)}}};ADO.logs=[];ADO.stoppedP=false;ADO.segmentType=0;ADO.outcomeType=1;ADO.logErrors=false;for(var x in e)e.hasOwnProperty(x)&&typeof ADO[x]!=="function"&&(ADO[x]=e[x]);e=null;(function(){var a=document.getElementsByTagName("script");if(a.length===0)throw Error("Failed to find the current script element.");
m=a[a.length-1].src;a=m.lastIndexOf("/");m=a===-1?"":m.substring(0,a+1)})()})();
  ADO.preTransform = function () {
/* Begin utility functions */
/* Retrieve an element by xpath. A second parameter of elem can be used to designate the element to begin parsing the xpath. */
	ADO.getElementByXPathAt = function (xpath, elem) {
	 if ((function (xpath) { try { return (xpath.search(/^(\/[A-Z][A-Z0-9]*\[\d+\])+$/) === 0); } catch (e) {} return false; })(xpath)) {
	  var results = xpath.match(/(\/[A-Z][A-Z0-9]*\[\d+\])/g);
	  if ((results == null) || (results.length == 0)) return null;
	  return (function (xpaths, parent) {
	   if (xpaths.length == 0) {
		return parent;
	   } else {
		var currentChild = parent.firstChild;
		var childIndex = 0;
		var nextEval = xpaths.shift();
		var pieces = nextEval.match(/\/([A-Z][A-Z0-9]*)\[(\d+)\]/);
		if ((pieces == null) || (pieces.length != 3)) return null;
		var nodeIndex = parseInt(pieces[2]);
		while (currentChild != null) {
		 if ((currentChild.nodeType == 1) && (currentChild.nodeName == pieces[1])) childIndex++;
		 if (childIndex == nodeIndex) return arguments.callee(xpaths, currentChild);
		 currentChild = currentChild.nextSibling;
		}
		return null;
	   }
	  })(results, elem ? elem : document);
	 }
	 return null;
	};

	/* Adds a dom id to an element given an xpath */
	ADO.addDomIdByXPath = function (domId, xPath, elemAt) {
	 var elem;
	 if (elemAt) {
	  elem = ADO.getElementByXPathAt(xPath, elemAt);
	 } else {
	  elem = ADO.getElementByXPath(xPath);
	 }
	 if (elem) elem.id = domId;
	};

/* Create a function that can be used as capture thunk for click capture */
	ADO.createClickCaptureThunk = function (captureDatum, captureValue, isPrefix) {
	 return function () {
	  var facts = { };
	  var chars = { };
	  if (captureValue) {
	   if (isPrefix) {
		facts[captureDatum] = ADO.clickedElementID ? captureValue + ADO.clickedElementID : "undefined";
	   } else {
		facts[captureDatum] = captureValue;
	   }
	  } else {
	   facts[captureDatum] = ADO.clickedElementID ? ADO.clickedElementID : "undefined";
	  }
	  return '__ADO_FACTS__=' + ADO.encodeRawData(facts) + '&' + '__ADO_CHARS__=' + ADO.encodeRawData(chars);
	 };
	};

/* Capture clicks (enter keypress is ignored) for links that use javascript click handlers to change the page location */
	ADO.registerForOnclickCapture = function (domId, captureThunk, pixelTimeout) {
	 var elem = document.getElementById(domId);
	 if (elem) {
	  var mousedownFlag = false;
	  var mousedownHandler = function (event) {
	   event = event || window.event;
	   var leftButton = event.which == null ? event.button <= 1 : (event.which == 1);
	   if (leftButton) mousedownFlag = true;
	  };
	  var mouseoutHandler = function (event) {
	   mousedownFlag = false;
	  }; 
	  var mouseupHandler = function (event) {
	   event = event || window.event;
	   var leftButton = event.which == null ? event.button <= 1 : (event.which == 1);
	   if (leftButton && mousedownFlag) {
		var clickHandler = function (clickevent) {
		 if (window.addEventListener != undefined) {
		  document.body.removeEventListener("click", clickHandler, true);
		 } else if (window.attachEvent != undefined) {
		  document.releaseCapture();
		  document.body.detachEvent("onclick", clickHandler);
		 }    
		 var adoCookie = ADO.getCookie(ADO.cookieName);
		 var evt = clickevent || window.event;
		 var target = evt.target || evt.srcElement;
		 if (adoCookie != null && (target.dispatchEvent != undefined || target.click != undefined)) {
		  ADO.stopEvent(clickevent);
		  var dispatchOrFireClick = function () {
		   if (target.dispatchEvent != undefined) {
			var mouseevent = document.createEvent("MouseEvents");
			mouseevent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			target.dispatchEvent(mouseevent);
		   } else if (target.click != undefined) {
			target.click();
		   }
		  };
		  //var timeout = setTimeout(dispatchOrFireClick, pixelTimeout ? pixelTimeout : 1000);
		  var image = new Image(1, 1);
		  image.onload = function () {
		   //clearTimeout(timeout);
		   dispatchOrFireClick();
		  };
		  ADO.clickedElementID = target.id ? target.id : domId;
		  image.src = ADO.imgTrackingUrl + "/?" + captureThunk() + "&__CACHE_BUSTER__=" + Math.random() + "&__ADO_COOKIE__=" + encodeURIComponent(ADO.cookieName + "=" + adoCookie);
		 }
		}
		if (window.addEventListener != undefined) {
		 document.body.addEventListener("click", clickHandler, true);
		} else if (window.attachEvent != undefined) {
		 document.body.setCapture();
		 document.body.attachEvent("onclick", clickHandler);
		}
	   }
	  };
	  if (window.addEventListener != undefined) {
	   elem.addEventListener("mousedown", mousedownHandler, false);
	   elem.addEventListener("mouseup", mouseupHandler, false);
	   elem.addEventListener("mouseout", mouseoutHandler, false);
	  } else if (window.attachEvent != undefined) {
	   elem.attachEvent("onmousedown", mousedownHandler);
	   elem.attachEvent("onmouseup", mouseupHandler);
	   elem.attachEvent("onmouseout", mouseoutHandler);
	  }
	 }
	};

/* Capture clicks that do not unload the page */
	ADO.registerForNoUnloadClickCapture = function (domId, captureThunk) {
	 var elem = document.getElementById(domId);
	 if (elem) {
	  var clickHandler = function (event) {
	   var adoCookie = ADO.getCookie(ADO.cookieName);
	   if (adoCookie != null) {
		ADO.clickedElementID = domId;
		var image = new Image(1, 1);
		image.src = ADO.imgTrackingUrl + "/?" + captureThunk() + "&__CACHE_BUSTER__=" + Math.random() + "&__ADO_COOKIE__=" + encodeURIComponent(ADO.cookieName + "=" + adoCookie);
	   }
	  }
	  ADO.addEvent(elem, "click", clickHandler);
	 }
	};

/* Capture change event */
	ADO.registerForChangeCapture = function (domId, captureThunk) {
	 var elem = document.getElementById(domId);
	 if (elem) {
	  var changeHandler = function (event) {
	   var adoCookie = ADO.getCookie(ADO.cookieName);
	   if (adoCookie != null) {
		var evt = event || window.event;
		var target = evt.target || evt.srcElement;
		ADO.clickedElementID = target.value ? target.value : domId;
		var image = new Image(1, 1);
		image.src = ADO.imgTrackingUrl + "/?" + captureThunk() + "&__CACHE_BUSTER__=" + Math.random() + "&__ADO_COOKIE__=" + encodeURIComponent(ADO.cookieName + "=" + adoCookie);
	   }
	  }
	  ADO.addEvent(elem, "change", changeHandler);
	 }
	};
	
	ADO.elemClickCapture = function (elem, captureThunk, pixelTimeout) {
	 if (elem) {
	  var mousedownFlag = false;
	  var mousedownHandler = function (event) {
	   event = event || window.event;
	   var leftButton = event.which == null ? event.button <= 1 : (event.which == 1);
	   if (leftButton) mousedownFlag = true;
	  };
	  var mouseoutHandler = function (event) {
	   mousedownFlag = false;
	  }; 
	  var mouseupHandler = function (event) {
	   event = event || window.event;
	   var leftButton = event.which == null ? event.button <= 1 : (event.which == 1);
	   if (leftButton && mousedownFlag) {
		var clickHandler = function (clickevent) {
		 if (window.addEventListener != undefined) {
		  document.body.removeEventListener("click", clickHandler, true);
		 } else if (window.attachEvent != undefined) {
		  document.releaseCapture();
		  document.body.detachEvent("onclick", clickHandler);
		 }    
		 var adoCookie = ADO.getCookie(ADO.cookieName);
		 var evt = clickevent || window.event;
		 var target = evt.target || evt.srcElement;
		 if (adoCookie != null && (target.dispatchEvent != undefined || target.click != undefined)) {
		  ADO.stopEvent(clickevent);
		  var dispatchOrFireClick = function () {
		   if (target.dispatchEvent != undefined) {
			var mouseevent = document.createEvent("MouseEvents");
			mouseevent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			target.dispatchEvent(mouseevent);
		   } else if (target.click != undefined) {
			target.click();
		   }
		  };
		  //var timeout = setTimeout(dispatchOrFireClick, pixelTimeout ? pixelTimeout : 1000);
		  var image = new Image(1, 1);
		  image.onload = function () {
		   //clearTimeout(timeout);
		   dispatchOrFireClick();
		  };
		  ADO.clickedElementID = target.id ? target.id : domId;
		  image.src = ADO.imgTrackingUrl + "/?" + captureThunk() + "&__CACHE_BUSTER__=" + Math.random() + "&__ADO_COOKIE__=" + encodeURIComponent(ADO.cookieName + "=" + adoCookie);
		 }
		}
		if (window.addEventListener != undefined) {
		 document.body.addEventListener("click", clickHandler, true);
		} else if (window.attachEvent != undefined) {
		 document.body.setCapture();
		 document.body.attachEvent("onclick", clickHandler);
		}
	   }
	  };
	  if (window.addEventListener != undefined) {
	   elem.addEventListener("mousedown", mousedownHandler, false);
	   elem.addEventListener("mouseup", mouseupHandler, false);
	   elem.addEventListener("mouseout", mouseoutHandler, false);
	  } else if (window.attachEvent != undefined) {
	   elem.attachEvent("onmousedown", mousedownHandler);
	   elem.attachEvent("onmouseup", mouseupHandler);
	   elem.attachEvent("onmouseout", mouseoutHandler);
	  }
	 }
	};
/* End utility functions */
};

// Redefine the do default for timeout and timeout tracking
ADO.doDefaults=function(){
	 ADO.__showFF();
	 ADO.__showOneClick();
	 ADO.doneDefaults=true;
	 try{
		 if(ADO.getCookie(ADO.cookieName)==null || typeof ADO.getCookie(ADO.cookieName) =="undefined"){
			 ADO.stop("timeout for the first req");
		 }
		if ('YES' != ADO.getQueryStringValue('ADO_PREVIEW')) {
			 ADO.storeFactsAndCharacteristics({"Timeout":"true"},null);
		 }
	 }catch(err){}
};

__ControlledTest = function(){
	try{

		if(argos.cookie.get('__ADO_SAMPLE_OUT_PDP2__') === "1"){ 
			return (true);
		}else{
			return (false);
		}
	}catch(err){
		return (false);
	}
};



defineFunctions = function() {
    /* Begin utility functions */
    // function to apply the stylesheet on the page
    addStylesheet = function(a,b){
        var c=document.createElement("style");
        c.setAttribute("type","text/css");
        b&&c.setAttribute("id",b);
        c.styleSheet?c.styleSheet.cssText=a:c.appendChild(document.createTextNode(a));
        document.getElementsByTagName("head").item(0).appendChild(c)
        }
        
    // Change the global CTA button
    __globalCTA = function(){
        try{
            $("#offers a").css("background-image","-webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee))");  
            $("#offers a").css("background-image","-webkit-linear-gradient(#ffffff, #eeeeee)");
            $("#offers a").css("background-image","-moz-linear-gradient(top, #ffffff 0%, #eeeeee)");
            $("#offers a").css("background-image","-ms-linear-gradient(#ffffff, #eeeeee)");
            $("#offers a").css("background-image","-o-linear-gradient(#ffffff, #eeeeee)");
            $("#offers a").css("background-color","#eeeeee");
            $("#offers a").css("color","#666666");
            $("#offers a").css("filter","none");
        }catch(errO){
            //console.log("ERR: __globalCTA "+errO);
        }
    }
    
    // Change the price style
    __priceStyle = function(){
        try{
            $("#pdpPricing .wasprice").insertBefore($("#pdpPricing .actualprice"));
            $("#pdpPricing .wasprice").css("font-size","12px");
            $("#pdpPricing .wasprice").css("font-color","#333333");
            $("#pdpPricing .wasprice").css("text-decoration","line-through");
            $("#pdpPricing .actualprice").css("font-size","24px");
            $("#pdpPricing .actualprice").css("color","#E42119");
            $("#pdpPricing .asterisk").css("top","-5px");
            $("#pdpPricing .saving").css("font-size","12px");
            $("#pdpPricing .saving").css("color","#E42119");
        }catch(errP){
            //console.log("ERR: __priceStyle "+errP);
        }
    }
    
    // Change the CTA button text
    __ctaText = function(){
        try{    
            // to handle cache execution
            $(".buttAddToTrolley").attr("value","Buy or Reserve");
            $(".buttAddToTrolleyDelivery").attr("value","Buy or Reserve");
            $(".buttAddToTrolleyLocal").attr("value","Buy or Reserve");
            $(document).ajaxComplete(function(event, xhr, setting){//Executes action at ajax success
                if(setting.url.indexOf('OneClickReserve') > -1){
                    $(".buttAddToTrolley").attr("value","Buy or Reserve");
                    $(".buttAddToTrolleyDelivery").attr("value","Buy or Reserve");
                    $(".buttAddToTrolleyLocal").attr("value","Buy or Reserve");
                }
            });
        }catch(err){
            //console.log("ERR: __ctaText "+err);
        }
    }
    
    // Change the layout of the fullfillment box
    __FFBox = function(){
        addStylesheet('#breadcrumb {\n\tcolor: #666;\n font-size: 13px;\n line-height: 15px;\n padding: 15px 25px 15px 0px;\n /*mModified*/\n\twidth: 625px;\n}\n\n#pdpInformation {\n float: left;\n position: relative;\n width: 650px;\n}\n\n#pdpProduct {\n width: 480px;\n}\n#pdpSummaryWithMedia {\n float:left;\n margin-top: 20px;\n\tpadding-bottom: 20px;\n\tposition: relative;\n width: 650px;\n}\n\n#pdpMedia {\n border-bottom: 1px solid #cccccc;\n\tfloat: left;\n height: 354px;\n\tpadding-bottom: 10px;\n\ttext-align: center;\n\twidth: 650px;\n}\n\n#collection {\n  background: url("/wcsstore/argos/en_GB/siteAssets/images/icon_store.gif") no-repeat scroll 20px 25px transparent;\n  float: left;\n  height: 49px;\n  padding-left: 50px;\n  padding-top: 15px;\n}\n\n#delivery {\n  background: url("/wcsstore/argos/en_GB/siteAssets/images/icon_delivery.png") no-repeat scroll 25px 25px transparent;\n  float: left;\n  height: 49px;\n  padding-left: 55px;\n  padding-top: 15px;\n}\n\n#fulfilment {\nbox-shadow: 3px 3px 4px rgba(50, 50, 50, 0.25);\n position: relative;\nwidth: 310px;\n}\n#fulfilment .notice.delivery span {\n  background: url("/wcsstore/argos/en_GB/siteAssets/images/icon_delivery.png") no-repeat 21px 1px;\n}\n\n#fulfilment .notice span {\n  background: url("/wcsstore/argos/en_GB/siteAssets/images/icon_store.gif") no-repeat 8px 1px;\n}\n\n#fulfilment .note {\n  background: none repeat scroll 0 0 #F4F4F4;\n  margin: 20px auto 14px;\n  padding: 12px 0 4px 8px;\n  width: 268px;\n}\n\n#fulfilment .collectionContainer .quantity {\n right: 0px;\n top: 4px;\n}\n\n#fulfilment hr {\n\twidth: 290px;\n}\n\n\n#pdpCreditOfferBanner p  {\n padding-left: 5px;\n margin: 0px;\n width: 255px;\n}\n\n.buttonParallel {\n margin-left: 8px;\n    width: 100px;\n}\n\n\n.tabs_section .tabs ul li{ float:left; padding:0 0 0 8px; width:47%;}\n\n.tabs_section .tabs ul{\n\tmargin-bottom:-1px ;\n position:relative; \n\tlist-style:none;\n\twidth:98%; \n padding: 0 3px 0 0;\n float:right;\n margin-top:-2px;\n}\n\n#pdpMedia #main {\n left: 165px;\n}\n\n#deal {\n width: 280px;\n}\n\n.announce {\nmargin-left: 0px;\n}\n\n#fulfilment .activateContainer {\nmargin-left: 0px;\n}\n\n#fulfilment .iconActive {\nleft : 30px;\n}\n\n\n#fulfilment .iconActiveLocal {\nleft : 65px;\n}\n\n#fulfilment .activateLocal {\nwidth : 220px;\n}\n\n#fulfilment div.SignInMessage {\nmargin-left: 0px;\n}\n\n#fulfilment div.continueButton {\n\tmargin-left: 0px;\n}\n');
    }
    /* End utility functions */
};

//define all the fuctions
defineFunctions();
___executeFunctions = function(){
    try{
        __globalCTA();
        __priceStyle();
		__ctaText();
        __FFBox();
    }catch(ee){}
}

	// to hide the fullfilment box
	ADO.__hideFF = function(){
        ADO.addStylesheet('#fulfilment {visibility: hidden;\n}');
		ADO.addStylesheet('#offers {visibility: hidden;\n}');
		ADO.addStylesheet('#pdpPricing {visibility: hidden;\n}');
    };
	// to hide the one click button
	ADO.__hideOneClick = function(){
        ADO.addStylesheet('.oneClickButtonContainer {visibility: hidden;\n}');
    };
	// To show the FF box
	ADO.__showFF = function(){
	   ADO.addStylesheet('#fulfilment {visibility: visible;\n}');
	   ADO.addStylesheet('#offers {visibility: visible;\n}');
	   ADO.addStylesheet('#pdpPricing {visibility: visible;\n}');
	};
	// To show the 1 click
	ADO.__showOneClick = function(){
	   ADO.addStylesheet('.oneClickButtonContainer {visibility: visible;\n}');
	};

__ControlledTest = function(){
	try{
		if(argos.cookie.get('__ADO_SAMPLE_OUT_PDP2__') === "1"){ 
			return (true);
		}else{
			retrun (false);
		}
	}catch(err){
		return (false);
	}
}


if ('YES' === ADO.getQueryStringValue('ADO_PREVIEW')) {
    var result = document.createElement('script');
    var head = document.getElementsByTagName('HEAD')[0];
    result.setAttribute('src', '//argos.tmvtp.com/allocator/execute/Argos/Testing_PDP_2');
    head.appendChild(result); 
	// to hide and apply permanent fix
	//ADO.__hideFF();
	//ADO.__hideOneClick();
	___executeFunctions();
	if(document.readyState==="complete"){
		___executeFunctions();
	}else{
		setTimeout(___executeFunctions,200);
	}
}else {
    var campaignEditorP = 'YES' === ADO.getQueryStringValue('ADO-CAMPAIGN-EDITOR');
    ADO.cookieName = 'ADO_VISITOR_INFO';
    
	if (__ControlledTest()){
	//	ADO.stop("Controlled PDP test");
		ADO.hiddenUrl = '//argos.tmvtp.com/allocator/hidden-execute/Argos/Testing_PDP_2';
	}else{
		ADO.hiddenUrl = '//argos.tmvtp.com/allocator/hidden-execute/Argos/PDPII';
	}
    ADO.debugLevel = 'none';
    ADO.imgTrackingUrl = '//argos.tmvtp.com/allocator/img-execute/Argos';
    ADO.cleanupTimeoutValue = 4000;
    ADO.captureTimeoutValue = 4000;

	
    ADO.tempThunk = function () {
	ADO.getVisitorTreatment = function(){
    try{
	   if (ADO.treatment["CTA Weighting"])
         _tmpCTAWeighting=ADO.treatment["CTA Weighting"];
       if (ADO.treatment["Add to Trolley Position"])
		_tmpTrolleyPosition=ADO.treatment["Add to Trolley Position"];
       if (ADO.treatment["Add to Trolley CTA Icon"])
		_tmpATBIcon=ADO.treatment["Add to Trolley CTA Icon"];
       if (ADO.treatment["Fulfillment Box Layout"])
		_tmpFFLayout=ADO.treatment["Fulfillment Box Layout"];
       if (ADO.treatment["Sign-In Prompt"])
		_tmpSigninPrompt=ADO.treatment["Sign-In Prompt"];
	   if (ADO.treatment["1 Click Messaging"])
		_tmp1ClickMessaging=ADO.treatment["1 Click Messaging"];

        var _tmpTreatId = 'Pdp-';
        if (_tmpCTAWeighting=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmpCTAWeighting=='1 Click Grey')
            _tmpTreatId = _tmpTreatId + '2';
		else if (_tmpCTAWeighting=='1 Click Link')
            _tmpTreatId = _tmpTreatId + '3';

        if (_tmpTrolleyPosition=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmpTrolleyPosition=='Top')
            _tmpTreatId = _tmpTreatId + '2';
             
        if (_tmpATBIcon=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmpATBIcon=='Trolley 1')
            _tmpTreatId = _tmpTreatId + '2';
		 else if (_tmpATBIcon=='Trolley 2')
            _tmpTreatId = _tmpTreatId + '3';
        
        if (_tmpFFLayout=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmpFFLayout=='Layout 1')
            _tmpTreatId = _tmpTreatId + '2';
        else if (_tmpFFLayout=='Layout 2')
            _tmpTreatId = _tmpTreatId + '3';
		 else if (_tmpFFLayout=='Layout 3')
            _tmpTreatId = _tmpTreatId + '4';

        if (_tmpSigninPrompt=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmpSigninPrompt=='Header')
            _tmpTreatId = _tmpTreatId + '2';
        else if (_tmpSigninPrompt=='PDP Top')
            _tmpTreatId = _tmpTreatId + '3'; 

		//_tmpTreatId = _tmpTreatId + '1';//FF Box Fix
		//_tmpTreatId = _tmpTreatId + '1';//CTA Global
		//_tmpTreatId = _tmpTreatId + '1';//Price Style

		if (_tmp1ClickMessaging=='Current')
            _tmpTreatId = _tmpTreatId + '1';
        else if (_tmp1ClickMessaging=='Off')
            _tmpTreatId = _tmpTreatId + '2';
        


	
        return _tmpTreatId;
    }catch(er){
        //console.log(_tmpTreatId + "err is "+er);
        return '0';
    }
	};
};
    ADO.tempThunk();
    setTimeout(ADO.runCleanupThunks, ADO.cleanupTimeoutValue);
    if (ADO.stoppedP){
        ADO.storeStopped();
    }else{
        if (!campaignEditorP){
            ADO.registerCleanupThunk(function () {});
        };
		 ADO.createRegularCapture(ADO.captures.queryString('test', ADO.captureInfo('test', 'FACT', 'none')));
        // Capture R Path
		ADO.createRegularCapture(ADO.captures.javaScript(function() {
		 var parts = document.referrer.match(/^https?:\/\/([^/?#]*)([^?]*).(.*)$/);
		 return parts ? (parts.length > 1 ? parts[1] : "") : "null";
		 }, [], ADO.captureInfo('r_server', 'FACT')));
				ADO.createRegularCapture(ADO.captures.javaScript(function() {
		 var parts = document.referrer.match(/^https?:\/\/([^/?#]*)([^?]*)[?]?(.*)$/);
		 var retValue = parts ? (parts.length > 2 ? parts[2] : "") : "null";
		 return (retValue.length>80)  ? retValue.substring(0,80) : retValue;
		 }, [], ADO.captureInfo('r_path', 'FACT')));
		 // Capture Test query String
	    ADO.createRegularCapture(ADO.captures.queryString('test', ADO.captureInfo('test', 'FACT', 'none')));
		 
		
		// Capture HOST FLAG
		ADO.createRegularCapture(ADO.captures.javaScript(function () {
		  try{
			if (document.domain==='www.argos.co.uk')
				return ("YES");
			else
				return ("NO");
		  }catch(err){
			return ("NO");
		  }}, [], ADO.captureInfo('ISPROD', 'FACT')));
		
		// Capture PTA
		ADO.createRegularCapture(ADO.captures.javaScript(function () {
		  return "product-details-page";
		 }, [], ADO.captureInfo('PTA', 'FACT')));
		// capture Device type
		 ADO.createRegularCapture(ADO.captures.javaScript(function(){
			  try{
				 var agent = navigator.userAgent;
				 if(agent.match(/iphone/i)!=null){
					return "Iphone"
				 }else if(agent.match(/(mobile|ipod|avantgo|blackberry|bolt|boost|docomo|fone|hiptop|mini|mobi|palm|phone|pie|webos|wos)/i)!=null && agent.match(/(ipad)/i)==null){
					return "Mobile";
				 }else if(agent.match(/android/i)!=null){
					return "Tablet"
				 }else if(agent.match(/ipad/i)!=null){
					return "Ipad"
				 }else{
					return "Desktop";
				 }
			 }catch(err){}
		 }, [], ADO.captureInfo('device_type', 'FACT')));
		
		// capture product category
 		ADO.createRegularCapture(ADO.captures.javaScript(function(){
	  	try{
		 return argos.app.currentCategoryId;
	 	}catch(err){
			return "NF";}
 		}, [], ADO.captureInfo('productCategory', 'FACT')));


		ADO.allocationP = true;
		
		ADO.startProcessor();

		// Run the permanent actions
		ADO.__hideFF();
		ADO.__hideOneClick();
        ___executeFunctions();
        if(document.readyState==="complete"){
        	___executeFunctions();
        }else{
        	setTimeout(___executeFunctions,200);
        }
		//-------------------------------------------
		
	};
    ADO.reportAndClearAllErrors();
};