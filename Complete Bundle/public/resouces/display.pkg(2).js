$BV.Internal.define("contentFocusingSupport",[window,document],["exports","jquery.core","cookies","contentDisplay"],function(g,b,a,h,d){var c={};function f(i,j){return c[i+j]}function e(j,k,i){c[j+k]=i}g.bvShowContent=a.showContent=function(l,m,k,i){if(g.bvClosePopups){bvClosePopups()}var j=f(l,m);return j&&j.handleShowContent(k,i)};a.switchTabOnce=function(l,m,k,i){var j=f(l,m);return j&&j.handleSwitchTabOnce(k,i)};a.scrollContainers=function(i){if(i&&i.length>0){var o=i.offset().top;if(i.parents().length>2){var k=i.parents();for(var j=0;j<k.length-2;j++){try{var l=h(k[j]);var m=l.scrollTop()>0;if(!m){l.scrollTop(1);m=l.scrollTop()>0;l.scrollTop(0)}if(m&&l.css("overflow")!=="hidden"){l.scrollTop(o+l.scrollTop()-l.offset().top);o=l.offset().top}}catch(n){}}}h(g).scrollTop(o);return true}return false};a.postInjection=function(o,q,s,p){var n=o.application,k=(s.apiConfig()&&s.apiConfig().doShowContent)||(o.tabSwitcher&&g[o.tabSwitcher]),r=o.displayCode,m=s.getComponent(o.defaultContentContainerId),j=o.source,l=(s.apiConfig()&&s.apiConfig().doScrollContent);a.registerShowContent(n,r,k,m,j,l);var i=$BV.Internal.newLatch(1);if(o.deepLinkId){i.queue(function(){a.showContent(n,r,o.subjectId,o.deepLinkId)})}if(!o.submission&&p.processDisplayState){p.processDisplayState(r)}a.processReturnPosition(n,r,q,i,o.submission);i.release()};a.registerShowContent=function(l,m,o,j,n,i){var k=j?h(j).attr("id"):"";e(l,m,h.extend(f(l,m),{handleSwitchTabOnce:function(r,p){function q(){h.isFunction(o)&&o(l,m,r,p,h.noop,n)}if(!this.switchedTab){q(r,p);this.switchedTab=true}},handleShowContent:function(s,p){function u(){if(p||k!=""){if(p==""){p=k}var v=h("#"+p);if(v.length==0&&k!=""){v=h("#"+k)}return a.scrollContainers(v)}return false}function r(){return i&&i(u)===false||u()}function q(){return h.isFunction(o)&&o(l,m,s,p,r,n)===false||r()}var t=q();this.switchedTab=true;return t}}))};a.processReturnPosition=function(j,m,l,n,i){function o(q){var r=false;var p=q.split("/");if(p.length>1&&p[0]==j&&p[1]==m){if(i){a.switchTabOnce.apply(g,p)}else{a.showContent.apply(g,p);r=true}}if(r){n.increment()}return r}var k=d.get("bvReturnPosition");if(k){if(o(k)){d.remove("bvReturnPosition")}}else{n.increment();l(function(p,r){var q=p.bvReturnPosition;if(q){if(o(q)){r("bvReturnPosition")}}n.release()})}};a.saveReturnPosition=function(j,k,l,i){d.set("bvReturnPosition",j+"/"+k+"/"+l+"/"+(i||""))};a.clearReturnPosition=function(j,l,m){var k=d.get("bvReturnPosition");if(k){var i=k.split("/");if(i.length>2&&i[0]==j&&i[1]==l&&i[2]==m){d.remove("bvReturnPosition")}}};a.onPageLoad=function(l,k,i,j){}});
$BV.Internal.define("animationOptions",[],["jquery.core"],function(a){a.extend(a.fx.speeds,{bvFeedbackActiveVote:200,bvFeedbackDisabledVote:200,bvFeedbackDisplayVote:200,bvFeedbackHoverVote:200,bvFeedbackVisitedVote:200,bvFeedbackMessage:500,bvFeedbackReport:500,bvFeedbackActiveReport:200,bvFeedbackDisabledReport:200,bvFeedbackVisitedReport:200,bvSocialConnect:400})});
$BV.Internal.define("feedback",[window,document],["exports","jquery.core","cookies","requester","parseUri","analyticsHooks","jquery.effects.core","animationOptions","contentDisplay"],function(g,j,l,f,h,p,d,q){var b="bvFeedback",c=null;l.onInjection=function(r,t,s){f.each(t,function(w,v){v.$context=v.contentSectionSelector?f(v.contentSectionSelector,v.$contentRoot):v.$contentRoot;var u=a(v.$context,r,v,t);if(r.submission){u.bindHandlers()}try{u.applyCookies(s)}catch(x){$BV.log("feedback initialization failed; could not apply cookies : "+x)}})};function k(r,s){return new RegExp("^"+r.cookiePrefixes.Voting+"_([^_]+)_"+s+"$")}function m(r,s){return new RegExp("^"+r.cookiePrefixes[s]+"_(\\d+)$")}function n(r){if(typeof r==="object"&&r.fn){return function(s){var t=g[r.fn];if(typeof t==="function"){t.apply(g,(r.args||[]).concat([s]))}}}}function a(an,O,ab,t){var ad={},E={},Z;if("voting" in O.props){ad=O.props.voting.dimensions;E=O.props.voting.content}if("contentFocusing" in O){Z=n(O.contentFocusing)}function X(){ab.$content=f(ab.contentSelector,an);K();W();if("Inappropriate" in O.cookiePrefixes){B("Inappropriate");J("Inappropriate")}if("Voting" in O.cookiePrefixes){for(var at in ad){A(at,r(at))}}}function T(at){if("Inappropriate" in O.cookiePrefixes){ae("Inappropriate",at)}if("Voting" in O.cookiePrefixes){for(var au in ad){U(au,at)}}}function B(at){f(".BVDI_FVReportLink"+at+" a",an).each(function(){var au=f(this);au.unbind(I(["click","submitted"]));if(au.is(p.jsLinkSelector)){au.bind(I("click"),function(ax){var ay=f(this);var aw=aq(this);if(!f(this).data("fvEnabled")){q.fireActionEvent(aq(this).get(0),null,null,true);ax.stopImmediatePropagation();return false}var av=ay.parents(ab.contentSelector).find(".BVDI_FVReport");if(av.length>0){if(av.hasClass("BVDI_FVReportPopin")&&!av.is(":visible")){f(".BVDI_FVReport").trigger(I("hide"))}av.trigger(I("toggle"));return false}ay.addClass("BVDI_FVPendingReport");aw.data("fvEvent",{pageX:ax.pageX,pageY:ax.pageY,target:ax.target});H(aw);p.asJsLink(ay).follow(true,true);ax.preventDefault()}).bind(I("submitted"),function(ay,ax,av,az){var aA=f(this);var aw=aq(this);if(!ai(aw.get(0),az)){$BV.log("Message for "+az+" was received by "+V(this));return false}u(at,S(az));h.remove("bvReturnPosition");aA.removeClass("BVDI_FVPendingReport");if(at==="Inappropriate"){aA.parent().addClass("BVDI_FVReportLink"+at+"Level0")}ay.preventDefault()}).data("fvEnabled",true)}else{if(au.attr("href").indexOf(".htm?")!=-1){au.bind(I("click"),function(aw){var av=aq(this);if(!f(this).data("fvEnabled")){q.fireActionEvent(aq(this).get(0),null,null,true);aw.stopImmediatePropagation();return false}H(av)}).data("fvEnabled",true)}}})}function K(){ab.$content.each(function(){f(this).unbind(I("postback")).bind(I("postback"),function(av,aw,au,at){if(!ai(this,aw)){$BV.log("Message for "+aw+" was received by "+V(this));return false}p.post(au,c,function(ax){if(at[ax]){at[ax]()}else{$BV.log("Unexpected message code: "+ax)}});return false})})}function W(){ab.$content.each(function(){f(this).unbind(I("submitted")).bind(I("submitted"),function(at,ay,aw,ax){if(!ai(this,ax)){$BV.log("Message for "+ax+" was received by "+V(this));return false}var aA=f(this);var az=".BVDI_ME";var av=w("Message");var aB=aA.data("fvEvent");var au=aw?aA:M(aA);ap(aA,au,ay,az,av,aw?aB:null);return false})})}function J(at){ab.$content.each(function(){f(this).unbind(I("editing")).bind(I("editing"),function(au,aD,ax,ay,az){if(!ai(this,ay)){$BV.log("Message for "+ay+" was received by "+V(this));return false}var aB=f(this);var aA=".BVDI_FVReport";var aw=w("Report");var aC=aB.data("fvEvent");var av=ax?aB:M(aB);ap(aB,av,aD,aA,aw,ax?aC:null,"BVDI_FVActiveReport"+at,w("ActiveReport"));af(at,av,f(au.target),az);return false})})}function ai(au,av){var at=false;P(av).each(function(){if(this==au){at=true;return false}});return at}function af(av,aw,au,at){f(".BVDI_FVReport form",aw).each(function(){f(this).unbind(I(["submit","click"])).bind(I("submit"),function(){var ax=f(this);if(this.button=="submit"){p.postForm(this,this.button,function(ay){if(at[ay]){at[ay]()
}else{$BV.log("Unexpected message code: "+ay)}})}else{au.removeClass(".BVDI_FVPendingReport")}ax.trigger(I("hide"));return false}).bind(I("click"),function(ax){var ay=f(ax.target);if(!ay.is(":submit, input:image")){return}this.button=ay.attr("name")}).find(":input[name=devicefingerprint]").val((c||{}).devicefingerprint||"")})}function u(au,at){at.stop(true,true).addClass("BVDI_FVDisabledReport"+au,w("DisabledReport")).addClass("BVDI_FVVisitedReport"+au,w("VisitedReport"));at.find(".BVDI_FVReportLink"+au+":first a").each(function(){var av=f(this);ao(av);N(av,p.asJsOrHtmLink(av));L(av)})}function r(av){var at=[];for(var au in ad[av].values){at.push(au)}return new RegExp("\\bBVDI_FV("+at.join("|")+")\\b")}function A(au,at){f(".BVDI_FVVotes"+au+" .BVDI_FVVote a",an).each(function(){var av=f(this);av.unbind(I(["mouseenter","mouseleave","mousedown","keydown","mouseup","keyup","click","submitted"]));Q(av,au,av.parent().attr("class").match(at)[1]);if(av.is(p.jsLinkSelector)){av.bind(I("click"),function(az){var aA=f(this);var ax=aA.parents(".BVDI_FVVotes").first();if(ax.data("fvLocked")){q.fireActionEvent(aq(this).get(0),null,null,true);az.stopImmediatePropagation();return false}ax.data("fvLocked",true);var aw=aq(this);aA.addClass("BVDI_FVPendingVote");aw.data("fvEvent",{pageX:az.pageX,pageY:az.pageY,target:az.target});var ay=p.asJsLink(aA);var aB=V(this);C(O.cookiePrefixes.Voting,aB,au,aA.data("fvValue"),d(ay.getUrl()).authority);H(aw);ay.follow(true);if(ad[au].anonymousSubmissionAllowed){aA.trigger(I("voteDisplay"),[aA.data("fvValue"),aA.parent().is('[class *= "Undo"]')])}az.preventDefault()}).bind(I("submitted"),function(az,ay,aw,aA){var aB=f(this);var ax=aq(this);if(!ai(ax.get(0),aA)){$BV.log("Message for "+aA+" was received by "+V(this));return false}if(!ad[au].anonymousSubmissionAllowed){aB.trigger(I("voteDisplay"),[aB.data("fvValue"),aB.parent().is('[class *= "Undo"]')])}h.remove("bvReturnPosition");F(ax,au,aB.data("fvValue")).removeClass("BVDI_FVPendingVote");az.preventDefault()})}else{if(av.attr("href").indexOf(".htm?")!=-1){av.bind(I("click"),function(){var ax=f(this);var aw=aq(this);var ay=V(this);C(O.cookiePrefixes.Voting,ay,au,ax.data("fvValue"),d(ax.attr("href")).authority);H(aw)})}}});f(".BVDI_FVVoting"+au,an).each(function(){f(this).unbind(I("voteDisplay")).bind(I("voteDisplay"),function(ax,ay,av){var az=V(this);var aw=S(az);s(aw,az,au,ay,av,true,w("DisplayVote"));return false})})}function Q(at,av,au){at.bind(I(["mouseenter","mouseleave","mousedown","keydown","mouseup","keyup","click"]),function(aw){if(!f(this).data("fvEnabled")){if(aw.type=="click"){q.fireActionEvent(aq(this).get(0),null,null,true)}aw.stopImmediatePropagation()}}).bind(I("mouseenter"),function(){aq(this).stop(true,true).addClass("BVDI_FVHoverVotes"+av+au,w("HoverVote"))}).bind(I("mouseleave"),function(){aq(this).stop(true,true).removeClass("BVDI_FVHoverVotes"+av+au,w("HoverVote"))}).bind(I("mousedown"),function(aw){if(aw.which==1){aq(this).stop(true,true).addClass("BVDI_FVActiveVotes"+av+au,w("ActiveVote"))}}).bind(I("mouseup"),function(aw,ax){if(aw.which==1||ax){aq(this).stop(true,true).removeClass("BVDI_FVActiveVotes"+av+au,w("ActiveVote"))}}).bind(I("keydown"),function(aw){if(aw.which==13){aq(this).stop(true,true).addClass("BVDI_FVActiveVotes"+av+au,w("ActiveVote"))}}).bind(I("keyup"),function(aw,ax){if(aw.which==13||ax){aq(this).stop(true,true).removeClass("BVDI_FVActiveVotes"+av+au,w("ActiveVote"))}}).data("fvValue",au).data("fvEnabled",true)}function G(au,at,av){return{valueCount:au,totalCount:at,voteValue:av,asCookieValuePrefix:function(){return(typeof this.valueCount==="number"?this.valueCount:"")+"_"+(typeof this.totalCount==="number"?this.totalCount:"")+"_"}}}function aj(au){var at=/(\d+)?_(\d+)?_(\w+)?/.exec(au);return at?G(at[1],at[2],at[3]):{}}function U(av,at){var au=k(O,av);at(function(ay){for(var aD in ay){var ax=au.exec(aD);if(ax){var aA=aj(ay[aD]);if(!aA.voteValue){continue}var aC=ax[1];var aw=P(aC);if(aw.length==0){continue}if(aA.voteValue=="Invalid"){s(aw,aC,av,aA.voteValue,false,false,0);
continue}var az=ar(aC,av,aA.voteValue);var aB=az.valueCount==aA.valueCount&&az.totalCount==aA.totalCount;s(aw,aC,av,aA.voteValue,false,aB,0)}}})}function ae(av,at){var au=m(O,av);at(function(ax){for(var ay in ax){var aw=au.exec(ay);if(aw){u(av,P(aw[1]))}}})}function H(at){if(Z){Z(at.parents("[id]:first").attr("id"))}}function ar(aw,av,au){var at=E[aw][av];return G(at.values[au],at.numEntries,au)}function F(at,av,au){return at.find(".BVDI_FVVotes"+av+" .BVDI_FV"+au+" a")}function aq(au){var at=f(au);if(at.is(ab.contentSelector)){return at}return at.parents(ab.contentSelector).first()}function al(au,at){if(au.is(at)){return au}return au.find(at)}function P(av,at){var au=at?at:ab;if("subjectId" in au){if(av==au.subjectId){return al(au.$context,au.contentSelector)}}else{return al(f("#"+au.subjectIdPattern.replace("{id}",av),au.$context),au.contentSelector)}return f()}function S(au){var at=f();f.each(t,function(aw,av){at=at.add(P(au,av))});return at}function M(au){var at=f(au);if(at.hasClass("BVDI_FV")){return at}return at.find(".BVDI_FV:first")}function V(au){var ax=f(au);if("subjectId" in ab){return ab.subjectId}else{var at=ab.subjectIdPattern.split("{id}"),aw=at[0]?'[id ^= "'+at[0]+'"]':"",av=at[1]?'[id $= "'+at[1]+'"]':"";if(!ax.is(aw+av)){ax=ax.parents(aw+av+":first")}if(at[1]){return ax.attr("id").slice(at[0].length,-at[1].length)}else{return ax.attr("id").slice(at[0].length)}}}function I(at){if(f.isArray(at)){return at.join("."+b+" ")+"."+b}else{return at+"."+b}}function w(at){return b+at}function ap(av,au,ay,aB,aD,aA,az,ax){var aG,aC,at;if(!f.trim(ay)){return}aG=aA?f(aB):S(V(av)).find(aB);au.append(ay);aC=au.children(aB).last();function aF(aH){if(az){av.stop(true,true).addClass(az,ax)}if(aA){aC.fadeIn(aD)}else{aC.slideDown(aD)}aH.preventDefault()}function aE(aH){if(az){av.stop(true,true).removeClass(az,ax)}if(aA){aC.fadeOut(aD)}else{aC.slideUp(aD)}aH.preventDefault()}function aw(aH){if(aC.is(":visible")){aC.trigger(I("hide"))}else{aC.trigger(I("show"))}aH.preventDefault()}aC.bind(I("show"),aF);aC.bind(I("hide"),aE);aC.bind(I("toggle"),aw);if(!aA&&aG.length==1&&aC.parent().get(0)==aG.parent().get(0)){aG.hide().remove();aC.show();return}aG.each(function(){f(this).trigger(I("hide"));f(this).remove()});if(aA){aC.find(".BVDILinkClose").one(I("click"),function(aH){aE(aH)});aC.trigger(I("show"));at=aC.offsetParent().offset();aC.css({left:aA.pageX-at.left,top:aA.pageY-at.top});bvPositionWhereVisible(aC,aA.target,aA.target)}else{aC.trigger(I("show"))}}function s(aA,az,ay,aw,at,ax,av){var au=ad[ay];aA.each(function(){var aB=f(this);aB.find(".BVDI_FVVoting"+ay).each(function(){var aC=f(this);var aD=R(aC);aB.stop(true,true);if(at){aB.removeClass("BVDI_FVVisitedVotes"+ay+aw,w("VisitedVote")).removeClass("BVDI_FVDisabledVotes"+ay,w("DisabledVote"))}else{aB.addClass("BVDI_FVVisitedVotes"+ay+aw,w("VisitedVote")).addClass("BVDI_FVDisabledVotes"+ay,w("DisabledVote"))}aC.fadeOut(av,function(){var aE=E[az][ay];aa(aC,aw,at,aD);if(ax){aE=am(aC,aw,at,aE);z(aC,at,au,aE);y(aC,aw,at,aE)}Y(aC,aw,at,aD,ax,au,aE);aC.fadeIn(av,function(){aC.children(".BVDI_FVVotes").data("fvLocked",false)})})})})}function aa(at,aw,av,au){at.find(".BVDI_FVVote a").each(function(){var ay=f(this),ax=p.asJsOrHtmLink(ay);if(av){D(ay,ax);if(ay.parent().hasClass("BVDI_FV"+aw+"Undo")){ay.parent().removeClass("BVDI_FV"+aw+"Undo")}else{ak(ay)}}else{N(ay,ax);if(au&&ay.parent().hasClass("BVDI_FV"+aw)){ay.parent().addClass("BVDI_FV"+aw+"Undo");ax.setUrl(au)}else{ao(ay);L(ay)}}})}function R(at){return at.find(".BVDI_FVUndo").text()}function ao(at){at.trigger(I("mouseleave")).trigger(I("mouseup"),[true]).trigger(I("keyup"),[true])}function L(at){at.data("fvEnabled",false)}function ak(at){at.data("fvEnabled",true)}function N(at,au){if(au.getUrl()){at.data("fvPrevLink",au.getUrl());au.unsetUrl()}}function D(at,au){if(at.data("fvPrevLink")){au.setUrl(at.data("fvPrevLink"));at.removeData("fvPrevLink")}}function z(at,ay,au,ax){var aw=at.children(".BVDI_FVSum");var av=0;for(var az in ax.values){av+=ax.values[az]*au.values[az].weight
}var aA=au.sum;if(av>2){aw.replaceWith(aA[2])}else{if(av<-2){aw.replaceWith(aA[-2])}else{aw.replaceWith(aA[av])}}aw=at.children(".BVDI_FVSum");var aB=Math.abs(av);aw.find(".BVDINumber").each(function(){var aC=f(this);aC.text(aB);ag(aC.parent(),aB)})}function am(av,aw,au,at){if(!av.data("fvContentProps")){av.data("fvContentProps",f.extend(true,{},at))}at=av.data("fvContentProps");if(au){at.numEntries--;at.values[aw]--}else{at.numEntries++;at.values[aw]++}return at}function y(av,ax,au,at){var aw=av.children(".BVDI_FVCounts");ah(aw,ax,au,at.values[ax]);ah(aw,"Total",au,at.numEntries)}function ah(ax,aw,at,av){var au=ax.children(".BVDI_FV"+aw);au.find(".BVDINumber").each(function(){var ay=f(this);if(ay.children().length>0||isNaN(parseInt(ay.text()))){return}ay.text(av);ag(au,av)})}function Y(aw,ay,av,au,aA,ax,at){var az=aw.children(".BVDI_FVVotes");if(aA){ac(az,ay,av,au,ax,at)}x(az,at)}function ac(ay,ax,av,au,aw,at){ay.find(".BVDI_FV"+ax+" .BVDIValue span").each(function(){var aA=f(this);var az=aw.values[ax].undoLabel;if(!isNaN(parseInt(aA.text()))||!az){return}if(av){aA.html(aA.data("fvLabel"))}else{if(au){aA.data("fvLabel",aA.html());aA.html(az)}}});ah(ay,ax,av,at.values[ax])}function x(aw,at){for(var av in at.values){var ax=aw.children(".BVDI_FV"+av);var au=ax.children("a");if(au.data("fvEnabled")){ag(ax,at.values[av])}else{ag(ax)}}}function ag(at,au){v(at);var av;if(au===undefined){av=0}else{if(au==0){av=1}else{if(au>=1&&au<=4){av=2}else{if(au>=5&&au<=9){av=3}else{av=4}}}}at.addClass("BVDI_FVLevel"+av)}function v(at){for(i=0;i<4;i++){var au="BVDI_FVLevel"+i;if(at.hasClass(au)){at.removeClass(au)}}return at}function C(av,az,ay,ax,au){var at=av+"_"+az+"_"+ay;var aw=ar(az,ay,ax).asCookieValuePrefix();h.set(at,aw,O.cookiePath,au)}return{bindHandlers:X,applyCookies:T}}function o(r){var u,s,t;if(r.props.voting){for(u in r.props.voting.content){s=r.props.voting.content[u];for(t in s){if(s[t].submission){return true}}}}if(r.props.report){for(u in r.props.report.content){s=r.props.report.content[u];for(t in s){if(s[t].submission){return true}}}}return false}var e={};l.onPageLoad=function(v,u,r,s){var t=e[u.id]=e[u.id]||{};if(v==="container"){t.containers=t.containers||[];t.containers.push(f.extend(u.container,{$contentRoot:r}))}else{if(v==="dimensions"){t.props=t.props||{};if(u.voting){t.props.voting=t.props.voting||{};t.props.voting.dimensions=u.voting}}else{if(v==="content"){t.props=t.props||{};if(u.voting){t.props.voting=t.props.voting||{};t.props.voting.content=t.props.voting.content||{};t.props.voting.content[u.contentId]=u.voting}if(u.report){t.props.report=t.props.report||{};t.props.report.content=t.props.report.content||{};t.props.report.content[u.contentId]=u.report}}else{if(v==="onInjection"){delete e[u.id];if(t.containers&&t.props){l.onInjection(f.extend(u.options,{props:t.props,submission:o(t)}),t.containers,s)}}else{if(v==="fingerprint"&&!c){$BV.Internal.require(["deviceFingerprint"],function(w){w.setDeviceFingerprintScriptURL(u.deviceFingerprintScriptURL);w.collectFingerprint(function(x){c={devicefingerprint:x}})})}}}}}}});
$BV.Internal.define("qa/analyticsHooksQA",[window],["jquery.core","analyticsHooks"],function(a,b){b.extend(BVAnalyticsCustomizer,{eventInteractionLegacyHandlerQA:function(e,h,d){if(h){e.interactionType=h.substring(h.lastIndexOf("_")+1)}var c=b(d);var g=c.data("bveventdata");var f={};if(g){if(g.answerIds){f.answerIds=g.answerIds}if(g.questionIds){f.questionIds=g.questionIds}}e.interactionPayload=f},eventSocialConnectQA:function(c,e){c.eName=BVAnalyticsData.E_NAME.socialConnect;var d=e.substr(e.lastIndexOf("_")+1);d=d.substr(0,1).toUpperCase()+d.substr(1);c.socialMedium=d},eventTargetQuestionOrAnswer:function(c,d){if(!c.eventTarget&&(c.eType===BVAnalyticsData.E_TYPE.support||c.eType===BVAnalyticsData.E_TYPE.write)){if(/(Question|QuestionSelect)_/i.test(d)){c.eventTarget=BVAnalyticsData.EVENT_TARGET.question}else{if(/Answer_/i.test(d)){c.eventTarget=BVAnalyticsData.EVENT_TARGET.answer}}}else{if(!c.eventTarget&&c.eType===BVAnalyticsData.E_TYPE.read){c.eventTarget=BVAnalyticsData.EVENT_TARGET.question}}},eventTargetQuestion:function(c){if(!c.eventTarget&&(c.eType===BVAnalyticsData.E_TYPE.support||c.eType===BVAnalyticsData.E_TYPE.write)){c.eventTarget=BVAnalyticsData.EVENT_TARGET.question}}});a.BVQAAnalyticsCustomizers=[new BVAnalyticsCustomizer("SocialBookmark.*",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.support)),new BVAnalyticsCustomizer("SocialBookmark.*",BVAnalyticsCustomizer.linkDestinationLocationExternal),new BVAnalyticsCustomizer("Inappropriate",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.support)),new BVAnalyticsCustomizer("Inappropriate",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.inappropriate)),new BVAnalyticsCustomizer(".*Feedback",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.support)),new BVAnalyticsCustomizer(".*Feedback",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.associate)),new BVAnalyticsCustomizer("SocialBookmark.*",BVAnalyticsCustomizer.eventShoutit),new BVAnalyticsCustomizer("SocialConnect",BVAnalyticsCustomizer.eventSocialConnectQA),new BVAnalyticsCustomizer("AskQuestion",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.write)),new BVAnalyticsCustomizer("AskQuestion",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.write)),new BVAnalyticsCustomizer("AnswerThisQ",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.write)),new BVAnalyticsCustomizer("AnswerThisQ",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.write)),new BVAnalyticsCustomizer("AskQuestion",BVAnalyticsCustomizer.eventTargetQuestion),new BVAnalyticsCustomizer("AnswerThisQ",BVAnalyticsCustomizer.eventTargetQuestion),new BVAnalyticsCustomizer("ReturnToProduct",BVAnalyticsCustomizer.setEventTypeProperty(BVAnalyticsData.E_TYPE.read)),new BVAnalyticsCustomizer("Display_Sort",BVAnalyticsCustomizer.eventSort),new BVAnalyticsCustomizer("searchQuestionExpansion",BVAnalyticsCustomizer.eventInteractionLegacyHandlerQA),new BVAnalyticsCustomizer("questionExpansion",BVAnalyticsCustomizer.eventInteractionLegacyHandlerQA),new BVAnalyticsCustomizer("(Prev|Next)?Page(Number)?",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.paginate)),new BVAnalyticsCustomizer("ProductLink.*",BVAnalyticsCustomizer.setEventNameProperty(BVAnalyticsData.E_NAME.productLink)),new BVAnalyticsCustomizer(".*",BVAnalyticsCustomizer.socialAndButtonElementsDispatcher),new BVAnalyticsCustomizer(".*",BVAnalyticsCustomizer.eventTargetQuestionOrAnswer)]});
$BV.Internal.define("qa/analyticsInternalLegacyHooksQA",[window],["jquery.core","analyticsHooks"],function(b,c){function a(d){if(c.isFunction(b.BVQAOnInteraction)){b.BVQAOnInteraction(d)}if(c.isFunction(b.BVQAInternalUseOnlyCallback)){b.BVQAInternalUseOnlyCallback(d)}}b.BVQAInternalLegacyCallback=function(d){var f=b.BVAnalyticsData;if(d.bvProduct!==f.PRODUCT.qa){return}if((d.eType===f.E_TYPE.write||d.eType===f.E_TYPE.support)&&d.pageName&&c.isFunction(b.BVQASubmissionPageDisplayed)&&d.eventSource===f.EVENT_SOURCE.display){b.BVQASubmissionPageDisplayed(d.pageName,d.submitPageStatus)}if(!c.isFunction(b.BVQAOnInteraction)&&!c.isFunction(b.BVQAInternalUseOnlyCallback)&&!c.isFunction(b.BVQADisplayed)){return}var e=d.leafCategoryId||d.categoryId||"";if(d.sortType&&d.sortDirection){a({interactionType:"sort",productId:d.productId,categoryId:e,sortType:d.sortType,sortDirection:d.sortDirection})}else{if(d.eventSource===f.EVENT_SOURCE.display&&d.eType===f.E_TYPE.read){a({interactionType:"display",numQuestions:d.attributes.numQuestions,numAnswers:d.attributes.numAnswers,productId:d.productId,categoryId:e});if(c.isFunction(b.BVQADisplayed)){b.BVQADisplayed(d.attributes.numQuestions,d.attributes.numAnswers,d.productId,e)}}else{if((d.eType===f.E_TYPE.write||d.eType===f.E_TYPE.support)&&d.eventSource===f.EVENT_SOURCE.display&&d.interactionType){a({interactionType:d.interactionType,productId:d.productId,categoryId:e})}else{if(d.interactionPayload&&d.interactionType){a({interactionType:d.interactionType,questionIds:d.interactionPayload.questionIds,answerIds:d.interactionPayload.answerIds,productId:d.productId,categoryId:e})}}}}}});
$BV.Internal.define("qa/contentDisplayQA",[window,document],["exports","requester","jquery.core","contentDisplay"],function(d,a,c,b,e){d.bvqaSubmitSearch=function(g,f,i){var h=a.getElementById("BVQASearchFormTextInputID").value;if(h!=f){g=g.replace(/__SEARCHTEXT__/,encodeURIComponent(h))}b.get(g,"BVQAFrame",i)};d.bvqaSubmitSearchStandalone=function(g,f){var h=a.getElementById("BVQASearchFormTextInputID").value;if(h!=f){g=g.replace(/__SEARCHTEXT__/,encodeURIComponent(h))}d.location=g};d.bvqaScrollToQuestion=function(f){d.setTimeout(function(){bvScroll.toElement("#BVQASQuestionAndAnswers"+f)},100)};d.bvqaUpdateExpandCollapseToolbarLabel=function(f){if(d.BVQAOpenedQuestionsCounter>0){f.find("#BVToggleDisplayOffSpan").show();f.find("#BVToggleDisplayOnSpan").hide()}else{f.find("#BVToggleDisplayOffSpan").hide();f.find("#BVToggleDisplayOnSpan").show()}};d.bvqaToolbarDisplayShowAll=function(g,f){if(g){e(".BVQAQuestionSubheader:visible").hide()}e(".BVQAQuestionMain:hidden").show();e(".BVQAQuestionHeader").removeClass("BVQAQuestionHeaderClosed").addClass("BVQAQuestionHeaderOpen");d.BVQAOpenedQuestionsCounter=f;bvqaUpdateExpandCollapseToolbarLabel(e("body"))};d.bvqaToolbarDisplayHideAll=function(f){if(f){e(".BVQAQuestionSubheader:hidden").show()}e(".BVQAQuestionMain:visible").hide();e(".BVQAQuestionHeader").addClass("BVQAQuestionHeaderClosed").removeClass("BVQAQuestionHeaderOpen");d.BVQAOpenedQuestionsCounter=0;bvqaUpdateExpandCollapseToolbarLabel(e("body"))};d.bvqaToolbarShowAllNoCount=function(f){if(f){e(".BVQAQuestionSubheader:visible").hide()}e(".BVQAQuestionMain:hidden").show();e(".BVQAQuestionHeader").removeClass("BVQAQuestionHeaderClosed").addClass("BVQAQuestionHeaderOpen")};d.bvqaToolbarHideAllNoCount=function(f){if(f){e(".BVQAQuestionSubheader:hidden").show()}e(".BVQAQuestionMain:visible").hide();e(".BVQAQuestionHeader").addClass("BVQAQuestionHeaderClosed").removeClass("BVQAQuestionHeaderOpen")};d.bvqaUpdateExpandCollapseToolbarLabelValue=function(f){if(e("#BVQAQuestionMain"+f).is(":visible")){d.BVQAOpenedQuestionsCounter=d.BVQAOpenedQuestionsCounter+1}else{d.BVQAOpenedQuestionsCounter=d.BVQAOpenedQuestionsCounter-1}bvqaUpdateExpandCollapseToolbarLabel(e("body"))};d.bvqaToggleVisibleHeader=function(f){e("#BVQAQuestionMain"+f).toggle();e("#BVQAQuestionSubheader"+f).toggle();e("#BVQAQuestionHeader"+f).toggleClass("BVQAQuestionHeaderClosed").toggleClass("BVQAQuestionHeaderOpen")};c.onPageLoad=function(h,g,f){if(h==="initExpandCollapseCount"){d.BVQAOpenedQuestionsCounter=g.count;bvqaUpdateExpandCollapseToolbarLabel(f)}}});
$BV.Internal.define("feedbackStyle1",[],["exports","jquery.core"],function(a,b){b.extend(a,{inactivateYesNo:function(d,c,e){b(d+" "+c+"FeedbackLinkYes").addClass(e);b(d+" "+c+"FeedbackLinkNo").addClass(e);b(d+" "+c+"FeedbackLinkInactiveYes").removeClass(e);b(d+" "+c+"FeedbackLinkInactiveNo").removeClass(e)},inactivateInappropriate:function(d,c,e){b(d+" "+c+"FeedbackLinkInappropriate").addClass(e);b(d+" "+c+"FeedbackLinkInactiveInappropriate").removeClass(e)},showMessage:function(e,c,f,d){b(e+" "+c+"FeedbackMessage").removeClass(f).html(d)}})});
$BV.Internal.define("qa/feedbackStyle1QA",[],["exports","jquery.core","feedbackStyle1","cookies"],function(e,f,d,c){function a(g,j,l,k,h,i){i(function(n){for(var p in n){var m=b().exec(p);if(m){var o="q"==m[1]?"Question":"Answer";e.initFeedback(g,j,m[2],o,m[3],n[p],l,k,h)}}})}function b(){return/^(q|a)(hf|baf|if)_(\d+)$/}e.initFeedback=function(m,g,l,k,j,i,n,o,h){if("baf"==l){d.showMessage("#BVQAAnswer"+i,".BVQABestAnswer","BVQAHidden",h);f("#BVQAAnswer"+i+" .BVQABestAnswerVoting .BVQAActiveFeedback").addClass("BVQAHidden");f("#BVQAAnswer"+i+" .BVQABestAnswerVoting .BVQAInactiveFeedback").removeClass("BVQAHidden")}else{if(g==1){if("hf"==l){d.showMessage("#BVQA"+k+j,".BVQA","BVQAHidden",n);f("#BVQA"+k+j+" .BVQAHelpfulnessFeedback .BVQAActiveFeedback").addClass("BVQAHidden");f("#BVQA"+k+j+" .BVQAHelpfulnessFeedback .BVQAInactiveFeedback").removeClass("BVQAHidden")}else{d.showMessage("#BVQA"+k+j,".BVQA","BVQAHidden",o);f("#BVQA"+k+j+" .BVQAInappropriateFeedback .BVQAActiveFeedback").addClass("BVQAHidden");f("#BVQA"+k+j+" .BVQAInappropriateFeedback .BVQAInactiveFeedback").removeClass("BVQAHidden")}}}};e.onPageLoad=function(j,i,g,h){if(j==="feedbackStatus"){a(g,i.style,i.helpfulnessMessage,i.inappropriateMessage,i.bestAnswerMessage,h)}}});
$BV.Internal.define("qa/injection.qa",[],["exports","jquery.core","injection.shared","requester"],function(b,d,a,c){d.extend(b,a,{getSviRedirectUrl:function(h,r,f){var g=h.length;if(g<5){return null}if(/product|category/.exec(h[g-3])!=null){g=5}else{if(/product|category/.exec(h[g-4])!=null){g=6}else{return null}}if(g>h.length){return null}var e=(h.length-g);if(/product|category/.exec(h[e+2])==null){return null}if((g==5)||(g==6)){var i=(g==6);var j=h[e+1],k=h[e+2],o=h[e+3],m=h[e+4],q="questions",l="";var p;if(j=="questions"){if(f){p=".djs?format=embeddedhtml"}else{p=".htm?format=embedded"}}else{if(j=="social"){q="homepage";if(i){m=h[e+5];l=h[e+4]}if(f){p=".djs?format=embeddedhtml"}else{p=".htm?format=embedded"}}else{if(j=="questionsPage"){if(f){p=".djs?format=bulkembeddedhtml"}else{return null}}else{return null}}}var n=r+k+"/"+m+"/";if(i){n+=l+"/"}n+=q+p;if(o>1){n+="&page="+o}return n}else{return null}}})});
$BV.Internal.define("qa/contentFocusingSupportQA",[window,document],["exports","jquery.core","cookies","contentFocusingSupport","contentDisplay"],function(d,b,f,e,c,a){d.bvShowContentOnReturnQA=function(j,i,g){var h=[];e("#BVQAMainID .BVQAQuestionHeaderOpen").each(function(){h.push(e(this).attr("id").substr(18))});if(h.length>0){c.set("bvOpenedQ"+j,h.join(":"))}a.saveReturnPosition("QA",j,i,g)};f.processDisplayState=function(g){f.processQuestionState(g)};f.processQuestionState=function(h){var i=c.get("bvOpenedQ"+h);if(i){c.remove("bvOpenedQ"+h);var j=i.split(":");for(var g=0;g<j.length;g++){var k=j[g];if(e("#BVQAQuestionMain"+k).is(":hidden")){e("#BVQAQuestionMain"+k).toggle();e("#BVQAQuestionHeader"+k).toggleClass("BVQAQuestionHeaderClosed").toggleClass("BVQAQuestionHeaderOpen")}}}};f.onPageLoad=function(k,j,g,i,h){if(k==="postInjection"){a.postInjection(j,i,h,this)}}});
$BV.Internal.define("alignments",[window,document],["exports","jquery.core"],function(c,a,d,g){function f(){var i=0;var h=g("body");if(h.css("position")=="relative"&&(h.offset().left==0||g.browser.msie)){var j=h.css("left");if(j=="auto"||j=="50%"||(g.browser.mozilla&&j=="0px")){if("getBoundingClientRect" in h[0]){i=-h[0].getBoundingClientRect().left}else{i=-g(c).width()/2+h.width()/2}}else{if(j!=null&&j.length>2&&j.substring(j.length-2,j.length)=="px"){i=-j.substring(0,j.length-2);var k=h.css("marginLeft");if(k!=null&&k.length>2&&k.substring(k.length-2,k.length)=="px"){i-=k.substring(0,k.length-2)}}}}return i}function e(k,j){var i=a.getElementById(j);if(i){var l=g(i);var h=f();g.each(k,function(){var m=g("#"+this);m.css("left",l.offset().left+l.width()/2-m[0].offsetWidth/2+h)})}return k}function b(k,j,h){var l=g("#"+h).parents("#"+j);if(l.length){var i=f();g.each(k,function(){var m=g("#"+this);m.css("left",l.offset().left+l.width()/2-m[0].offsetWidth/2+i)})}return k}g.extend(d,{alignByWidth:e,alignByWidthOfParent:b})});
$BV.Internal.define("popupDisplay",[window,document],["exports","jquery.core","alignments","browserVersion","wrapperDivs","domUtils"],function(d,g,e,c,j,f,h){var i={};d.bvClosePopups=function(){for(var k in i){b(k)}if(d.bvCloseGalleries){d.bvCloseGalleries()}};function b(k){if(i[k]){c.each(i[k],function(l,m){if(c.isFunction(m.closePopup)){m.closePopup()}})}}function a(k,l){if(!i[l]){i[l]=[]}i[l].push(k)}d.BvPopup=function(l,k,m){this.activeDivId=l;this.ieFrameId=k;this.groupName=m;this.activationInProgress=false;this.activePopupId=null;if(m!=null){a(this,m)}};BvPopup.prototype.createPopupDivs=function(l,k){c("#"+l).clone(true).attr("id",this.activeDivId).appendTo("body").show();f.addBrowserClasses({containerId:this.activeDivId});h.addWrapperDivs(this.activeDivId,k);var m=bvGetIEControlsFrame(this.ieFrameId,"");if(m){m.style.position="absolute";c(m).insertBefore("#"+this.activeDivId).show();this.synchronizeSize([this.activeDivId,this.ieFrameId]);return[this.activeDivId,this.ieFrameId]}else{return[this.activeDivId]}};BvPopup.prototype.synchronizeSize=function(k){var m=g.getElementById(k[0]);for(var l=1;l<k.length;l++){var n=g.getElementById(k[l]);n.style.width=m.offsetWidth+"px";n.style.height=m.offsetHeight+"px"}};BvPopup.prototype.toggleActivatePopup=function(k,l){if(this.activationInProgress){return}var m=(c("#"+this.activeDivId).is(":visible")&&this.activePopupId==k);if(this.groupName){b(this.groupName)}else{this.closePopup()}if(m){return}this.activationInProgress=true;l(this,k)};BvPopup.prototype.setPopupActivated=function(k){this.activationInProgress=false;this.activePopupId=k};BvPopup.prototype.closePopup=function(){c("#"+this.activeDivId+", #"+this.ieFrameId).hide();c("#"+this.activeDivId).remove();this.activePopupId=null};BvPopup.prototype.alignByWidth=j.alignByWidth;BvPopup.prototype.alignByWidthOfParent=j.alignByWidthOfParent;BvPopup.prototype.alignByTop=function(l,k){this.setTop(l,bvGetLocation(k).top+10);this.adjustLocationToIncludeScrollOffsetDifference(l,k)};BvPopup.prototype.adjustLocationToIncludeScrollOffsetDifference=function(n,m){var l=0;c("#"+m).parents().each(function(){l+=this.scrollTop});for(var o=0;o<n.length;o++){var p=n[o];var q=0;var k=c("#"+p);k.parents().each(function(){q+=this.scrollTop});k.css("top",bvGetLocation(p).top+q-l+"px")}return n};BvPopup.prototype.alignByHeight=function(n,m){var l=g.getElementById(m);if(l){var k=bvGetLocation(m);c.each(n,function(){var o=c("#"+this);o.css("top",k.top+k.height/2-o[0].offsetHeight/2);e.ensureWindowHeight(o)})}return n};BvPopup.prototype.setTop=function(k,l){c.each(k,function(){var m=c("#"+this);m.css("top",l);e.ensureWindowHeight(m)})};e.BvPopup=BvPopup;e._popupHandlers=i;e.ensureWindowHeight=function(){};e.connectFromSubmitFrame=function(l,k){e.ensureWindowHeight=function(m){k.heightManager.ensureHeight(m.offset().top+m.outerHeight())}}});
$BV.Internal.define("photoDisplay",[window],["jquery.core","domUtils","popupDisplay"],function(a,b){a.BvPhoto=function(d,c,g,f,e){BvPopup.call(this,f,e,"mediapopup");this.popupDivIdPrefix=d;this.popupImageIdPrefix=c;this.captionCssClass=g};BvPhoto.prototype=new BvPopup;BvPhoto.prototype.constructor=BvPhoto;BvPhoto.prototype.createPhotoPopup=function(e,g,h,f,d,c){this.toggleActivatePopup(e,function(i,j){var k=new Image();k.onload=function(){i.setPhotoImage(j,this,h,f,d,c);i.setPopupActivated(j)};k.onerror=function(){i.setPopupActivated(null)};k.src=g})};BvPhoto.prototype.setPhotoImage=function(d,f,g,e,k,c){var h=this.popupDivIdPrefix+d;var i=this.popupImageIdPrefix+d;b("#"+i).attr("src",f.src);b("#"+h+" ."+this.captionCssClass).css("width",Math.max(f.width-10,200));var j=this.createPopupDivs(h,c);if(b.isFunction(k)){k(j)}else{this.alignByWidthOfParent(j,g,e);this.alignByTop(j,e)}}});
$BV.Internal.define("qa/photoDisplayQA",[window],["photoDisplay"],function(a){a.bvqaPhoto=new BvPhoto("BVQAPhotoPopup","BVQAPhotoImage","BVQAPhotoPopupCaption","BVQAActivePhotoID","BVQAPhotoFrameID")});