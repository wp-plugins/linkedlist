var gv_month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function LinkedList(F,A,G,C){this.containerId=F;this.feeds=new Array();this.loaded=false;this.numLoaded=0;this.numEntries=A;this.fadeIn=(G!=false)?true:false;this.useCookies=(C==null||C==false)?false:true;this.limit=0;this.dots=0;var B=this;this.limitTo=function(K){if(K>0){this.limit=K}};this.add=function(K,L,M){if(this.loaded){return false}this.feeds[this.feeds.length]=new J(K,L,this.numEntries,M)};this.display=function(){if(this.loaded){return false}this.loaded=true;for(var K=this.feeds.length-1;K>=0;K--){if(this.feeds[K].isFeed&&!window.google){this.showError("Google's AJAX Feed API not loaded.");return false}if(!window.google.feeds||!window.google.feeds.Feed){this.showError("Google's AJAX Feed API not loaded. You probably forgot to add google.load('feeds', '1');");return false}this.feeds[K].load(this)}if(this.fadeIn){this.startLoading()}};this.loadedFeed=function(L){this.numLoaded++;var K=this.feeds.length-1;while(K>0&&L!=this.feeds[K]){K--}while(K>0&&L.published>this.feeds[K-1].published){this.feeds[K]=this.feeds[K-1];K--}this.feeds[K]=L;if(this.numLoaded>=this.feeds.length){this.show()}};this.show=function(){var K,P,N;K=document.getElementById(this.containerId);if(!K){this.showError("No element with id = "+this.containerId+" found.");return true}P=document.createElement("ul");P.className="ll-linksList";N=(this.feeds.length<this.limit)?this.feeds.length:((this.limit!=0)?this.limit:this.feeds.length);for(var O=0;O<N;O++){var R,M;R=this.feeds[O];if(R.error){continue}M=document.createElement("li");M.appendChild(R.show());P.appendChild(M)}if(this.fadeIn){D(P,0)}this.stopLoading();K.appendChild(P);if(!this.fadeIn){return true}var Q=0;var L=35;P.currentlyAppearing=window.setInterval(function(){D(P,(Q*10)/L);Q++;if(Q>L){window.clearInterval(P.currentlyAppearing)}},15)};this.showError=function(M){var K,N,L;K=document.getElementById(this.containerId);if(!K){K=document.getElementsByTagName("body");K=K[0]}N=document.createElement("p");L=document.createElement("div");N.appendChild(document.createTextNode(M));L.appendChild(N);N.style.color="#EEE";N.style.fontSize="0.95em";N.style.paddingLeft="3px";N.style.paddingRight="3px";N.style.textAlign="center";L.style.clear="both";L.style.marginTop="5px";L.style.marginBottom="5px";L.style.border="1px solid #666";L.style.background="#930";K.appendChild(L)};this.startLoading=function(){var K=document.getElementById(B.containerId);if(!K){return false}if(K._loading){K.removeChild(K._loading)}B.dots=B.dots%3;B.dots++;var M="Loading";for(var L=0;L<B.dots;L++){M+="."}K._loading=document.createElement("p");K._loading.appendChild(document.createTextNode(M));K.appendChild(K._loading);B.loading=window.setTimeout(B.startLoading,30)};this.stopLoading=function(){var K=document.getElementById(this.containerId);if(!K){return false}if(K._loading){K.removeChild(K._loading)}window.clearTimeout(this.loading)};function J(K,L,N,M){if(L==false||L==true){M=L;L=null}this.feedURL=K;this.name=L;this.numEntries=(N>=0&&N!=null)?N:1;this.isFeed=(M!=false)?true:false;this.url=(this.isFeed)?null:this.feedURL;this.entries=null;this.published=0;this.error=false;this.load=function(P){var R=this;if(!this.isFeed){var Q=H("linkedlist_"+R.url);if(Q!=null){if(Q=="null"){P.loadedFeed(R);return true}R.feedURL=Q;R.isFeed=true;R.loadFeed(P);return true}google.feeds.lookupFeed(this.url,function(S){if(S.error){P.loadedFeed(R);E("linkedlist_"+R.url,"null",7);return true}R.feedURL=S.url;R.isFeed=true;R.loadFeed(P);E("linkedlist_"+R.url,R.feedURL,365)});return true}this.loadFeed(P)};this.loadFeed=function(P){var Q=this;if(!this.isFeed){return false}this.googleFeed=new google.feeds.Feed(this.feedURL);this.googleFeed.setNumEntries((this.numEntries>0)?this.numEntries:1);this.googleFeed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);this.googleFeed.load(function(R){Q.loadedFeed(R,P)})};this.loadedFeed=function(Q,P){if(!Q.error){this.url=Q.feed.link;this.entries=Q.feed.entries;this.name=(this.name==null)?Q.feed.title:this.name;if(this.entries.length>0){var R="";if(this.entries[0].publishedDate!=""){R=this.entries[0].publishedDate}else{var S=Q.xmlDocument.getElementsByTagName("lastBuildDate");if(S&&S.length>0){R=S[0].childNodes[0].nodeValue;this.entries[0].publishedDate=R}}this.published=new Date(R)}}else{this.error=true;if(this.url!=null){I("linkedlist_"+this.url);this.isFeed=false;if(this.name!=null){this.error=false}}}P.loadedFeed(this)};this.show=function(){if(this.error){return false}var S,U;S=document.createElement("div");S.style.display="inline";U=document.createElement("a");this.name=(this.name==null)?this.url:this.name;U.innerHTML=this.name;U.href=this.url;S.appendChild(U);if(this.entries!=null){if(this.numEntries!=0){var T=document.createElement("ul");T.className="ll-entriesList";for(var P=0;P<this.entries.length;P++){var R,Q;R=this.entries[P];Q=document.createElement("li");Q.appendChild(document.createTextNode(R.title));if(R.publishedDate!=""){Q.appendChild(O(R.publishedDate))}T.appendChild(Q)}S.appendChild(T)}else{S.appendChild(O(this.published))}}return S};function O(T){var R,Q,U,P,S;R=new Date(T);Q=new Date();U=Q-R;P=" - ";if((U=Math.floor(U/1000))<0){P+=gv_month[R.getMonth()]+" "+R.getDate()}else{if(U<60){P+=U+" second"+((U==1)?"":"s")}else{if((U=Math.floor(U/60))<60){P+=U+" minute"+((U==1)?"":"s")}else{if((U=Math.floor(U/60))<24){P+=U+" hour"+((U==1)?"":"s")}else{P+=gv_month[R.getMonth()]+" "+R.getDate();if(R.getFullYear()!=Q.getFullYear()){P+=" '"+String(R.getFullYear()).substr(2)}}}}}S=document.createElement("span");S.className="ll-entryDate";S.appendChild(document.createTextNode(P));return S}}function D(K,L){K.style.opacity=L/10;K.style.filter="alpha(opacity="+L*10+")"}function E(M,N,O){if(!this.useCookies){return }if(O){var L,K;L=new Date();L.setTime(L.getTime()+(O*24*60*60*1000));K="; expires="+L.toGMTString()}else{var K=""}document.cookie=M+"="+N+K+"; path=/"}function H(L){if(!this.useCookies){return null}var N,L,K;N=L+"=";K=document.cookie.split(";");for(var M=0;M<K.length;M++){var O=K[M];while(O.charAt(0)==" "){O=O.substring(1,O.length)}if(O.indexOf(N)==0){return O.substring(N.length,O.length)}}return null}function I(K){E(K,"",-1)}};