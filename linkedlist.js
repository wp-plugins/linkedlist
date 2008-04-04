// =================================================================================================
// 
// 	LinkedList v1.1.3                                                                                                     
//  by Prateek Rungta
//  http://prateekrungta.com
//  
//  For more information visit
//  http://prateekrungta.com/linkedlist
//  
//  Copyright 2007-2008 Prateek Rungta
//
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//	
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//	
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//	
// =================================================================================================

/*
global variables
*/

var gv_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


/*
LinkedList
	class which accepts a list of RSS / Atom URLs and the id of the element where
	they will be displayed
*/

function LinkedList (containerId, numEntries, fadeIn) {
	this.containerId = containerId;
	this.feeds = new Array();
	this.loaded = false;
	this.numLoaded = 0;
	this.numEntries = numEntries;
	this.fadeIn = (fadeIn != false) ? true : false;
	
	//methods
	this.add		= function(feedURL, name, isFeed) { // public method
		if (this.loaded) { return false; } // ensure feeds are not added after the initial ones have been displayed
		this.feeds[this.feeds.length] = new LiveLink(feedURL, name, this.numEntries, isFeed);
	}
	
	this.display	= function() { // public method
		if (this.loaded) { return false; } // or will create duplicate entries in the container element
		this.loaded = true;
		for (var i = this.feeds.length - 1; i >= 0; i--) {
			if (this.feeds[i].isFeed && !window.google) {
				this.showError('Google\'s AJAX Feed API not loaded.');
				return false;
			}
			if (!window.google.feeds || !window.google.feeds.Feed) {
				this.showError('Google\'s AJAX Feed API not loaded. You probably forgot to add google.load(\'feeds\', \'1\');');
				return false;
			}
			this.feeds[i].load(this);
		}
	}
	
	this.loadedFeed	= function(loadedLink) { // private method
		this.numLoaded++;
		
		// sorting the loaded link in the right place
		var j = this.feeds.length - 1;
		while (j > 0 && loadedLink != this.feeds[j]) {
			j--;
		}
		while (j > 0 && loadedLink.published > this.feeds[j-1].published) {
			this.feeds[j] = this.feeds[j-1];
			j--;
		}
		this.feeds[j] = loadedLink;
		
		if (this.numLoaded >= this.feeds.length) { this.show(); }
	}
	
	this.show		= function() { // private method
		var container = document.getElementById(this.containerId);
		if (!container) {
			// container = document.getElementsByTagName('body');
			// container = container[0];
			this.showError('No element with id = ' + this.containerId + ' found.');
			return true;
		}
		
		var linksList = document.createElement('ul');
		linksList.className = 'll-linksList';
		
		for (var i=0; i < this.feeds.length; i++) {
			var feed = this.feeds[i];
			
			if (feed.error) { continue; }

			var feedLi = document.createElement('li');			
			feedLi.appendChild(feed.show());
			linksList.appendChild(feedLi);
		}
		
		if (this.fadeIn) setOpacity (linksList, 0);	// to make the links "fade in"
		
		container.appendChild(linksList);
		
		if (!this.fadeIn) return true;
		// else fade the element
		var currentFrame = 0;
		var totalFrames = 35;
		linksList.currentlyAppearing	=	window.setInterval(
			function ()	{
				setOpacity (linksList, (currentFrame * 10) / totalFrames);
				currentFrame++;
				if(currentFrame > totalFrames)	{
					window.clearInterval(linksList.currentlyAppearing);
				}
			},
			15);
	}
	
	this.showError	= function(errorMessage) { // private method
		var container = document.getElementById(this.containerId);
		if (!container) {
			container = document.getElementsByTagName('body');
			container = container[0];
		}
		
		var p = document.createElement('p');
		var error = document.createElement('div');
		
		p.appendChild(document.createTextNode(errorMessage));
		error.appendChild(p);
		
		p.style.color = '#EEE';
		p.style.fontSize = '0.95em';
		p.style.paddingLeft = '3px';
		p.style.paddingRight = '3px';
		p.style.textAlign = 'center';
		error.style.clear = 'both';
		error.style.marginTop = '5px';
		error.style.marginBottom = '5px';
		error.style.border = '1px solid #666';
		error.style.background = '#930';

		container.appendChild(error);
	}
	
	function LiveLink (feedURL, name, numEntries, isFeed) { // private class
		if (name == false || name == true) {
			isFeed = name;
			name = null;
		}

		this.feedURL = feedURL;
		this.name = name;
		this.numEntries = (numEntries >= 0 && numEntries != null) ? numEntries : 1; // defaults to 1 entry
		this.isFeed = (isFeed != false) ? true : false;
		this.url = (this.isFeed) ? null : this.feedURL;
		this.entries = null;
		this.published = 0;
		this.error = false;

		//methods
		this.load		= function(linkedListObject) {
			var parentObject = this;
			
			// if the link is not a feed, try discovering the page's feed automatically
			if (!this.isFeed) {
				
				// first check if there is a cookie with the feed url saved already
				var cache = readCookie('linkedlist_'+parentObject.url);

				if (cache != null) { // cookie found
					if (cache == 'null') {
						// the page doesn't have a feed associated with it, so display as a normal link
						linkedListObject.loadedFeed(parentObject);
						return true;
					}

					// else 

					// the cookie has the feed url stored so use that
					parentObject.feedURL = cache;
					parentObject.isFeed = true;
					parentObject.loadFeed(linkedListObject);
					return true;
				}

				// no cookie found so ask google to try retrieving the feed url
				google.feeds.lookupFeed(this.url, function (lookupResult) {

					if (lookupResult.error) { 
						// no feed associated with the page, so dispaly as a normal link
						linkedListObject.loadedFeed(parentObject);
					
						// and set a cookie so we don't go looking for a feed url within the next 7 days
						createCookie('linkedlist_'+parentObject.url, 'null', 7);
						return true;
					} 

					// else, Google found a feed for the given link, so load that feed
					parentObject.feedURL = lookupResult.url;
					parentObject.isFeed = true;
					parentObject.loadFeed(linkedListObject);
					
					// and set a cookie so we don't have to look for the url again
					createCookie('linkedlist_'+parentObject.url, parentObject.feedURL, 365);
				} 
				);
				return true;
			}
			
			this.loadFeed(linkedListObject);
		}
		
		this.loadFeed 	= function(linkedListObject) {
			var parentObject = this;
			
			if (!this.isFeed) { return false; }
			
			this.googleFeed = new google.feeds.Feed(this.feedURL);
			this.googleFeed.setNumEntries( (this.numEntries > 0) ? this.numEntries : 1 );
			this.googleFeed.setResultFormat(google.feeds.Feed.MIXED_FORMAT); // to get lastBuildDate incase publishedDate is missing
			this.googleFeed.load( function(result) {
				parentObject.loadedFeed(result, linkedListObject);
			} );
		}

		this.loadedFeed	= function(result, linkedListObject) {
			if (!result.error) {
				this.url = result.feed.link;
				this.entries = result.feed.entries;
				this.name = (this.name == null) ? result.feed.title : this.name;

				if (this.entries.length > 0) {
					var lastUpdatedOn = '';
					
					if (this.entries[0].publishedDate != '') {
						lastUpdatedOn = this.entries[0].publishedDate;
					} else {
						var lastBuildDate = result.xmlDocument.getElementsByTagName('lastBuildDate');
						if (lastBuildDate && lastBuildDate.length > 0) {
							lastUpdatedOn = lastBuildDate[0].childNodes[0].nodeValue;
							this.entries[0].publishedDate = lastUpdatedOn; // assigning the build date to the latest? entry 
						}
					}

					this.published = new Date(lastUpdatedOn);
				}
			} else {
				this.error = true;
				if (this.url != null) {
					// erase the cookie so we DO look for the url again
					eraseCookie('linkedlist_' + this.url);
					this.isFeed = false;
					if (this.name != null) this.error = false; // display as a normal link
				}

			}

			linkedListObject.loadedFeed(this);
		}
		
		this.show		= function() {
			if (this.error) { return false; }

			var link = document.createElement('div');
			link.style.display = "inline";
			var title = document.createElement('a');
			this.name = (this.name == null) ? this.url : this.name;
			// title.appendChild(document.createTextNode(this.name)); because HTML entities are strings in JS
			title.innerHTML = this.name;
			title.href = this.url;
			link.appendChild(title);
			
			if (this.entries != null) {	
				if (this.numEntries != 0) {
					var entriesList = document.createElement('ul');
					entriesList.className = 'll-entriesList';
					for (var j = 0; j < this.entries.length; j++) {
						var entry = this.entries[j];
						var entryLi = document.createElement('li');
						entryLi.appendChild(document.createTextNode(entry.title));
						if (entry.publishedDate != '') entryLi.appendChild(getDateSpan(entry.publishedDate));
					
						entriesList.appendChild(entryLi);
					}
					link.appendChild(entriesList);
				} else {
					link.appendChild(getDateSpan(this.published));
				}
			}
			
			return link;
		}

		function getDateSpan(dateString) {
			var date = new Date(dateString);
			var today = new Date();
			var dateSpan = document.createElement('span');
			dateSpan.className = 'll-entryDate';
			dateSpan.appendChild(document.createTextNode(' - ' + gv_month[date.getMonth()] + ' ' + date.getDate()));
			if (date.getFullYear() != today.getFullYear()) {
				dateSpan.appendChild(document.createTextNode(" '" + String(date.getFullYear()).substr(2) ));
			}
			return dateSpan;
		}
	}

	// helper functions
	
	function setOpacity (element, value) {
		element.style.opacity = value/10;
		element.style.filter = 'alpha(opacity=' + value*10 + ')';
	}
	
	/*
		Cookies script
		Taken from www.quirksmode.org
		http://www.quirksmode.org/js/cookies.html
	*/
	function createCookie (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else { var expires = ""; }
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	function eraseCookie(name) {
		createCookie(name,"",-1);
	}
}
