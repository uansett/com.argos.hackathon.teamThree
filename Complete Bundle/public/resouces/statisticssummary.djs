$BV.Internal.ajaxCallback(function(url,apiConfig){
if(!/(^|\.)(argos\.co\.uk|bazaarvoice\.com)(:\d+)?$/.test(location.hostname)){
throw "Bazaarvoice: Permission denied";
}
$BV.Internal.configureAppLoader("qa",false,{});
$BV.Internal.require(["injection.shared","feedback","browserVersion","qa/contentFocusingSupportQA","contentFocusingSupport","jquery.core","qa/analyticsHooksQA","qa/analyticsInternalLegacyHooksQA","dropdown","domUtils","parseUri","requester","cookies","analyticsVersioning","analyticsHooks","magpie","magpieTracking","analyticsAutoTagHooks","jquery.effects.core","animationOptions","contentDisplay"],function(Injection){
var materials={"BVQASourceID":"","BVQASummaryBoxSourceID":"<div id=\"BVQASummaryBoxID\" class=\"BVQASummaryBox BVQASummaryBoxView\"><h1 id=\"BVQASummaryBoxTitleID\" class=\"BVQATitle BVQASummaryBoxTitle\">Q&A's<\/h1><div id=\"BVQASummaryBoxQuestionAndAnswerCountID\" class=\"BVQASummaryBoxQuestionAndAnswerCount\"><span class=\"BVQACount BVQANonZeroCount\"><span class=\"BVQANumber\">4<\/span> Questions<\/span> <span class=\"BVQACount BVQANonZeroCount\"><span class=\"BVQANumber\">4<\/span> Answers<\/span><\/div><div id=\"BVQASummaryBoxViewQuestionsID\" class=\"BVQASummaryBoxLink\"><a data-bvtrack=\"eventTarget:Question,eName:ReadAll\" onclick=\"if (bvShowContent('QA','1493-en_gb','1062487','BVQAWidgetID')) {$bv.Event(event).preventDefault()};\" href=\"#BVQAWidgetID\">Read all Q&amp;A<\/a><\/div><\/div>"},
initializers={"BVQASourceID":[],"BVQASummaryBoxSourceID":[]},
widgets={};
widgets["content"]={"handledContentTypes":["Question","Answer"],"containerId":"BVQAContainer","sourceId":"BVQASourceID"};
widgets["socialSummary"]={"containerId":"BVQASocialSummaryContainer","sourceId":"BVQASocialSummarySourceID"};
widgets["summary"]={"containerId":"BVQASummaryContainer","sourceId":"BVQASummaryBoxSourceID"};
var injectionData={
apiConfig:apiConfig,
containerInitializer:false,
cookiePath:"/",
crossDomainUrl:"http://argos.ugc.bazaarvoice.com/answers/1493-en_gb/crossdomain.htm?format=embedded",
embeddedUrl:url,
globalInitializers:[{"module":"browserVersion","init":"initialize","data":{"useBodyTag":false,"containerId":"BVQAContainer"}},{"module":"browserVersion","init":"initialize","data":{"useBodyTag":false,"containerId":"BVQASummaryContainer"}},{"module":"dropdown","init":"addSelectHandlers","data":{"dropdownId":"BVQASortListID"}},{"module":"feedback","init":"onInjection","data":{"id":"Product_h9ictdb2lmaxctxb257nw3o43","options":{"cookiePrefixes":{"Voting":"pfv"},"cookiePath":"/","contentFocusing":{"args":["1493-en_gb","1062487"],"fn":"bvShowContentOnReturnQA"}}}},{"module":"feedback","init":"onInjection","data":{"id":"Question_h9ictdb2lmaxctxb257nw3o43","options":{"cookiePrefixes":{"Inappropriate":"qif","Voting":"qfv"},"cookiePath":"/","contentFocusing":{"args":["1493-en_gb","1062487"],"fn":"bvShowContentOnReturnQA"}}}},{"module":"feedback","init":"onInjection","data":{"id":"Answer_h9ictdb2lmaxctxb257nw3o43","options":{"cookiePrefixes":{"Inappropriate":"aif","Voting":"afv"},"cookiePath":"/","contentFocusing":{"args":["1493-en_gb","1062487"],"fn":"bvShowContentOnReturnQA"}}}},{"module":"qa/contentFocusingSupportQA","init":"postInjection","data":{"application":"QA","source":"readLink","defaultContentContainerId":"BVQAContainer","tabSwitcher":"bvShowTab","displayCode":"1493-en_gb"}}],
gotoCookieRegexp:/^https?:\/\/[^/?#]+(\/[^?#]*)\//,
inFrameSubmissionEnabled:false,
pageIdPrefix:"BVQA",
pageTrackers:[],
postInjectionFunction:function(Inject){
if (window.$bv.isFunction(window.bvClosePopups)) {
window.$bv('.BVQAQuestionHeader').click(window.bvClosePopups);
}
if (window.bvAppendSubmission) {
window.bvAppendSubmission.showContent('QA');
}
},
replaceDisplayTokens:true,
replacementsPrefix:"BVQA",
replaceSessionParameters:false,
setWindowTitle:false,
soiContainerID:"BVQAContentValidationID_1062487",
soiContentIDs:[],
sviParameterName:"bvqap",
sviRedirectBaseUrl:"",
webAnalyticsConfig:{"customTrackedObjects":"","customizersName":"BVQAAnalyticsCustomizers","customContainersFnName":"BVQAAnalyticsCustomContainers","conversionTracking":{"conversionTrackingElementSelector":null,"conversionTrackingMetadataSelector":null,"conversionTrackingParseRegexp":null,"conversionTrackingName":"AddToCart"},"SIWZeroDeployEnabled":false,"maxTrackingTagTraversalDepth":3,"customTrackedObjectsSelector":"","jsonData":{"bvProduct":"AskAndAnswer","autoTagAnalyticsConfiguration":{"trackSubmissionPageLoads":true,"autoTagAnalyticsVersion":"5.1","trackFormActions":true,"productTracking":{"tracking":true,"initialProductDisplay":false},"vendors":[{"vendorName":"omniture","eventNum":30,"eVarNum":43,"trackerReference":"s","brandVoiceTrackingType":null,"brandVoiceTrackingEVarNum":0},{"vendorName":"magpie","anonymous":true,"defaultClassesOnly":true}]},"bvExtension":{},"bvAnalyticsVersion":"5.3","productId":"1062487","eType":"Read","bvDisplayCode":"1493-en_gb","rootCategoryId":"33006169","subjectType":"Product","brand":"LG","analyticsWhitespaceTrackingEnabled":true,"attributes":{"numQuestions":4,"numAnswers":4,"good":false},"ciTrackingEnabled":false,"bvClientName":"Argos","leafCategoryId":"33017148"}},
widgetInitializers:initializers,
widgetLimit:1,
widgetMaterials:materials,
widgetMetadata:widgets,
windowTitle:null};
Injection.newInstance().apiInjection(injectionData);
});
});