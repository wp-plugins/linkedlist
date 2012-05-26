=== LinkedList ===
Contributors: rungta
Tags: blogroll, sidebar, links
Requires at least: 2.3
Tested up to: 2.7.1
Stable tag: trunk

NOTE: This plugin is no longer maintained. Sorry for the trouble, and thanks for all the fish!

== Description ==

LinkedList __was__ a simple WordPress plugin for sorting your blogroll in the order by which the sites on the blogroll were last updated. LinkedList __did__ this by using Google's excellent [AJAX Feed API](http://code.google.com/apis/ajaxfeeds/) to discover (if needed) and read the RSS/Atom feeds of the sites on your blogroll.

== Installation ==

LinkedList uses Google's excellent [AJAX Feed API](http://code.google.com/apis/ajaxfeeds/) to read the RSS/Atom feeds, meaning you'll need a valid Google AJAX Feed API Key for the website where you wish to display the links. [Sign up for one](http://code.google.com/apis/ajaxfeeds/signup.html "Sign up for the Google AJAX Feed API - Google AJAX Feed API - Google Code") if you haven't got it already (don't worry there aren't any forms to fill).

Once you have a valid Google AJAX API key,

1.	Upload the `linkedlist` folder to the `/wp-content/plugins/` directory.
2.	Activate the plugin through the 'Plugins' menu in your WordPress admin.
3.	Once activated, you will see a new submenu under plugins — LinkedList Config. Go to that page, fill in your Google API key and save it.
4.	Make sure the 'Links' widget is on your sidebar (found under the Design menu for Wordpress 2.5, under the Presentation menu for earlier versions) and you’re all set.

LinkedList is clever enough to fetch the links from your Blogroll and auto–detect their feeds. You can, however, make its work a little easier by manually entering the feed URLs ( `Manage > Links > Edit Link > Advanced > RSS Address` ).

== Frequently Asked Questions ==

= Does LinkedList work with all themes? =

In an ideal world, it should. If you do bump into a glitch with your theme then [drop me a note](http://prateekrungta.com/linkedlist/wp-plugin#feedback "LinkedList - Feedback") and I’ll try and fix the issue.

= What about using LinkedList in themes without widget support? =

All you need to do (besides activating the plugin) is include this code wherever you want the list to appear:

	<div id="linkedlist"></div>

LinkedList.wp is essentially a wrapper around [LinkedList.js](http://prateekrungta.com/linkedlist "LinkedList - JavaScript blogroll plugin"), so for a more custom implementation, checkout [LinkedList.js](http://prateekrungta.com/linkedlist "LinkedList - JavaScript blogroll plugin").

= What is the answer to Life, the Universe, and Everything? =

42

== Screenshots ==

1. LinkedList Configuration interface.
2. Links widget.
