<?php
/*
Plugin Name: LinkedList
Plugin URI: http://prateekrungta.com/linkedlist/wp-plugin
Description: LinkedList.wp is a simple Wordpress plugin for sorting your blogroll in the order by which the sites on the blogroll were last updated.
Version: 1.1.1
Author: Prateek Rungta
Author URI: http://prateekrungta.com
*/

/*
	Copyright 2007-2008 Prateek Rungta
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

// Globals
$linkedlist_options = array();
$linkedlist_options['name'] = array(
			'key' 		=> 'google_ajax_feed_api_key', 	// the WP option under which the user's API key is stored
			'links'		=> 'linkedlist_links',			// for numberOfLinks
			'entries' 	=> 'linkedlist_entries', 		// for numberOfEntries
			'fade' 		=> 'linkedlist_fade',			// for fadeEntries
			'cookies'	=> 'linkedlist_cookies');		// for useCookies
$linkedlist_options['value'] = array(
			'key' 		=> '',							// Paste your Google API key here to hardcode it.
			'links'		=> '',
			'entries' 	=> '',
			'fade' 		=> '',
			'cookies'	=> '');
$links = array();										// to store all the blogroll links

/*
	Initializing a config page for the plugin in the WordPress admin.
	WordPress Admin > Plugins > LinkedList Config
*/
function linkedlist_menu_init() {
	add_submenu_page('plugins.php', 'LinkedList Config', 'LinkedList Config', 'manage_options', 'linkedlist_config', 'linkedlist_menu');
	add_action('admin_head', 'linkedlist_menu_css');
}

/*
	Adds custom CSS in a style tag in the admin page's header if the requested page
	is the LinkedList Config page. Checks this by looking for linkedlist_config in the
	requested URI string
*/
function linkedlist_menu_css() {
	global $linkedlist_options;
	
	if (!get_option($linkedlist_options['name']['key']) && $linkedlist_options['value']['key'] == '') {
?>
<!-- Custom JS for LinkedList Warning -->
	<script type="text/javascript" charset="utf-8">
		function linkedlist_warn () {
			var warning = document.createElement('div');
			var p = document.createElement('p');
			p.innerHTML = 'LinkedList is <strong>not</strong> active. You must <a href="plugins.php?page=linkedlist_config">enter your Google API Key</a> for it to work.';
			warning.appendChild(p);
			warning.id = "linkedlist_warning";
			warning.className = 'updated fade-ff0000';
			// warning.style.marginTop = "2em";
			// warning.style.marginBottom = "2em";

			var menu = document.getElementById('adminmenu');
			if (document.getElementById('submenu')) menu = document.getElementById('submenu');
			if (document.getElementById('minisub')) menu = document.getElementById('minisub');

			var nextSibling = menu.nextSibling;
			while(nextSibling != null && nextSibling.nodeType != 1) { nextSibling = nextSibling.nextSibling; }

			if (nextSibling == null) { menu.parentNode.appendChild(warning); }
			else { menu.parentNode.insertBefore(warning, nextSibling); }
		}
	</script>
<!-- End of custom JS for LinkedList Warning -->
<?php		
	}
	
	if (strpos($_SERVER['REQUEST_URI'], 'linkedlist_config') === false) {
		return;
	}
?>
	<!-- Custom CSS for the LinkedList Config page -->
	<style type="text/css" media="screen">
		#linkedlist_title a { text-decoration: none; border-bottom: none; }
		#linkedlist_title a:hover span { color: #0CF; }
		#linkedlist_title span { margin-right: -0.05em; text-shadow: #035 1px 1px 0px; }
		#linkedlist_title .tlinked { color: #4575F0; }
		#linkedlist_title .tlist { color: #0099F3; }
	</style>
	<!-- End of custom CSS for the LinkedList Config page -->
<?php
}

/*
	Creates a config page. Has an input field for entering the Google API Key, 
	dropdown for choosing no. of entries and radio buttons for fade options.
*/
function linkedlist_menu() {
	global $linkedlist_options;
	
	$hiddenField = 'linkedlist_config_submit';
	
	$current = array(); // to get the currently stored values from the WP database
	$current['key'] 	= get_option($linkedlist_options['name']['key']);
	$current['links'] 	= get_option($linkedlist_options['name']['links']);
	$current['entries'] = get_option($linkedlist_options['name']['entries']);
	$current['fade'] 	= get_option($linkedlist_options['name']['fade']);
	$current['cookies'] = get_option($linkedlist_options['name']['cookies']);

	$current['links'] 	= ($current['links'] != null)	? $current['links'] : 0;
	$current['entries'] = ($current['entries'] != null)	? $current['entries'] : 0;
	$current['fade'] 	= ($current['fade'] != null)	? $current['fade'] : 'yes';
	$current['cookies'] = ($current['cookies'] != null) ? $current['cookies'] : 'no';

	if (isset($_POST[$hiddenField]) && $_POST[$hiddenField] == '1') {
		$current['key'] 	= $_POST[$linkedlist_options['name']['key']];
		if (is_numeric($_POST[$linkedlist_options['name']['links']]))
		{$current['links'] 	= $_POST[$linkedlist_options['name']['links']];}
		$current['entries'] = $_POST[$linkedlist_options['name']['entries']];
		$current['fade'] 	= $_POST[$linkedlist_options['name']['fade']];
		$current['cookies'] = $_POST[$linkedlist_options['name']['cookies']];
		
		update_option ($linkedlist_options['name']['key'], 		$current['key']); // creates an entry if it doesn't exist
		update_option ($linkedlist_options['name']['links'], 	$current['links']);
		update_option ($linkedlist_options['name']['entries'], 	$current['entries']);
		update_option ($linkedlist_options['name']['fade'], 	$current['fade']);
		update_option ($linkedlist_options['name']['cookies'], 	$current['cookies']);
?>		
	<div id="linkedlist_config_status" class="updated fade">
		<p>LinkedList preferences updated!</p>
	</div>
<?php	
	}
	
?>
	<div class="wrap">
	<h2 id="linkedlist_title"><a href="http://prateekrungta.com/linkedlist/wp-plugin"><span class="tlinked">Linked</span><span class="tlist">List</span></a> Configuration</h2>
	<form action="<?php echo str_replace( '%7E', '~', $_SERVER['REQUEST_URI']); ?>" method="post" accept-charset="utf-8">
	<input type="hidden" name="<?php echo $hiddenField; ?>" value="1" />
	<table class="form-table">
	<tr valign="top">
	<th scope="row">Google AJAX API Key</th>
	<td><input type="text" name="<?php echo $linkedlist_options['name']['key']; ?>" value="<?php echo $current['key']; ?>" size="40" />
	<br />
	<a target="_blank" title="Opens the Google AJAX Feed API Key signup page in a new window" href="http://code.google.com/apis/ajaxfeeds/signup.html">Sign up for one</a> if you haven't got it already.
	</td>
	</tr>
	<tr valign="top">
	<th scope="row">Number of Links</th>
	<td><input type="text" name="<?php echo $linkedlist_options['name']['links']; ?>" value="<?php echo $current['links']; ?>" size="3" />
	<br />
	0 = show all links.
	</td>
	</tr>
	<tr valign="top">
	<th scope="row">Number of Entries (for each link)</th>
	<td><label for="<?php echo $linkedlist_options['name']['entries']; ?>">
	<select name="<?php echo $linkedlist_options['name']['entries']; ?>">
<?php
	for ($i=0; $i < 6; $i++) {
		if ($i == $current['entries']) {
			echo "\t\t<option value=\"$i\" selected=\"selected\">$i</option>\n";
		} else {
			echo "\t\t<option value=\"$i\">$i</option>\n";
		}
	}
?>
	</select></label>
	</td>
	</tr>
	<tr valign="top">
	<th scope="row">Fade In</th>
	<td><label for="<?php echo $linkedlist_options['name']['fade']; ?>">
	<input type="radio" name="<?php echo $linkedlist_options['name']['fade']; ?>" value="yes"<?php if($current['fade'] == 'yes') { echo ' checked="checked"'; } ?> />
	Yes</label><br />
	<label for="<?php echo $linkedlist_options['name']['fade']; ?>">
	<input type="radio" name="<?php echo $linkedlist_options['name']['fade']; ?>" value="no"<?php if($current['fade'] == 'no') { echo ' checked="checked"'; } ?> />
	No</label>
	</td>
	</tr>
	<tr valign="top">
	<th scope="row">Use Cookies</th>
	<td><label for="<?php echo $linkedlist_options['name']['cookies']; ?>">
	<input type="radio" name="<?php echo $linkedlist_options['name']['cookies']; ?>" value="yes"<?php if($current['cookies'] == 'yes') { echo ' checked="checked"'; } ?> />
	Yes</label><br />
	<label for="<?php echo $linkedlist_options['name']['cookies']; ?>">
	<input type="radio" name="<?php echo $linkedlist_options['name']['cookies']; ?>" value="no"<?php if($current['cookies'] == 'no') { echo ' checked="checked"'; } ?> />
	No</label>
	</td>
	</tr>
	</table>
	
	<p class="submit"><input type="submit" name="Submit" value="Save Changes" />
	</p>
	</form>

	</div>
<?php	
}
add_action('admin_menu', 'linkedlist_menu_init');


/*
	Checking if we have an API Key before continuing. Issues a warning if no key is found.
*/
if ( !get_option($linkedlist_options['name']['key']) && $linkedlist_options['value']['key'] == '' && !isset($_POST[$linkedlist_options['name']['key']]) ) {
	function linkedlist_warning() {
		echo "
	<script type=\"text/javascript\">
		<!--
		linkedlist_warn();
		//-->	
	</script>
	<noscript>
		<div id='linkedlist_warning' class='updated fade-ff0000'><p>LinkedList is <strong>not</strong> active. You must <a href=\"plugins.php?page=linkedlist_config\">enter your Google API Key</a> for it to work.</p></div>
		<style type='text/css'>
			#adminmenu { margin-bottom:5em; }
			#linkedlist_warning { position:absolute; top:7em; }
		</style>
	</noscript>
		";
	}
	add_action('admin_footer', 'linkedlist_warning');
	return;
}


/*
	Initilaizes the LinkedList widget by replacing the standard links widget
	Also serves as the pseudo-initilization function for the plugin itself, in effect
	populating $googleAPIKey with a value (if stored beforehand)
*/
function linkedlist_init() {
	global $linkedlist_options;
	
	// $linkedlist_options['value']['key'] = ($linkedlist_options['value']['key'] == '') ? get_option ($linkedlist_options['name']['key']) : $linkedlist_options['value']['key'];
	// retireve the stored options
	foreach ($linkedlist_options['name'] as $key => $name) {
		$linkedlist_options['value'][$key] = ($linkedlist_options['value'][$key] == '') ? get_option($name) : $linkedlist_options['value'][$key];
	}
	
	if ($linkedlist_options['value']['key'] == '') { return; } // aborting
	// apply defaults if not found
	if ($linkedlist_options['value']['entries'] == null) { $linkedlist_options['value']['entries'] = 0; }
	$linkedlist_options['value']['fade'] = ($linkedlist_options['value']['fade'] == 'no') ? 'false' : 'true';
	$linkedlist_options['value']['cookies'] = ($linkedlist_options['value']['cookies'] == 'no') ? 'false' : 'true';
	
	
	if (function_exists('wp_register_sidebar_widget') && function_exists('wp_register_widget_control')) {
		$widget_ops = array('classname' => 'linkedlist_widget', 'description' => __( "Your Blogroll, sorted by LinkedList") );
		wp_register_sidebar_widget('links', __('Links'), 'linkedlist_widget', $widget_ops);
		wp_register_widget_control('links', __('Links'), 'linkedlist_widget_control');
	} else {
		register_sidebar_widget('Links', 'linkedlist_widget');
		register_widget_control('Links', 'linkedlist_widget_control');
	}
}

/*
	The actual widget, consists of a custom title (defaults to "Blogroll") and a div with id="linkedlist"
*/
function linkedlist_widget($args) {
	global $links;
    extract($args);
	$linkedlist_options = get_option('linkedlist_widget');
	$sidebars_widgets = get_option('sidebars_widgets');
	$title = empty($linkedlist_options['title']) ? __('Blogroll') : $linkedlist_options['title'];
?>
        <?php echo $before_widget; ?>
            <?php echo $before_title. $title. $after_title; ?>
				<div id="linkedlist">
				<noscript>
					<ul class="ll-linkedList">
<?php

	foreach ($links as $link) {
		if ($link->link_visible != 'Y') { continue; }
		$link->link_name = wptexturize($link->link_name);
		echo "\t\t\t\t\t<li><a href=\"$link->link_url\">$link->link_name</a></li>";
	}

?>					</ul>
				</noscript>
				</div>
        <?php echo $after_widget; ?>
<?php
}

/*
	Providing the user an option to change the title of the widget.
*/
function linkedlist_widget_control() {
	$options = $newoptions = get_option('linkedlist_widget');
	if ($_POST['linkedlist_widget-submit']) {
		$newoptions['title'] = wptexturize(strip_tags(stripslashes($_POST['linkedlist_widget-title'])));
	}
	if ( $options != $newoptions ) {
		$options = $newoptions;
		update_option('linkedlist_widget', $options);
	}
	$title = attribute_escape($options['title']);
?>
			<p>
			<label for="linkedlist_widget-title"><?php _e('Title:'); ?>
			<input class="widefat" id="linkedlist_widget-title" name="linkedlist_widget-title" type="text" value="<?php echo $title; ?>" />
			</label>
			</p>
			<input type="hidden" id="linkedlist_widget-submit" name="linkedlist_widget-submit" value="1" />
<?php
}
add_action('plugins_loaded', 'linkedlist_init');


function linkedlist_addSource() {
	global $linkedlist_options, $links;
	if ($linkedlist_options['value']['key'] == '' || $links == null) { return; } // aborting
	
	echo '
<!-- LinkedList plugin starts -->
<script type="text/javascript" src="http://www.google.com/jsapi?key='.$linkedlist_options['value']['key'].'"></script>
<script type="text/javascript" src="'; bloginfo('wpurl'); echo '/wp-content/plugins/linkedlist/linkedlist.js" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
google.load("feeds", "1");
google.setOnLoadCallback(function() {
	if (!document.getElementById(\'linkedlist\')) return;'."\n";

	echo "\t".'var links = new LinkedList(\'linkedlist\', '.$linkedlist_options['value']['entries'].', '.$linkedlist_options['value']['fade'].', '.$linkedlist_options['value']['cookies'].');'."\n";
	echo "\t".'links.limitTo('.$linkedlist_options['value']['links'].');'."\n";

	foreach ($links as $link) {
		if ($link->link_visible != 'Y') { continue; }
		
		$link->link_name = wptexturize($link->link_name);
		$link->link_name = str_replace("'", "&#039;", $link->link_name);
		
		if ($link->link_rss != '') {
			echo "\tlinks.add('$link->link_rss', '$link->link_name');\n";
		} else {
			echo "\tlinks.add('$link->link_url', '$link->link_name', false);\n";
		}
	}

	echo '	links.display();
});
</script>
<!-- LinkedList plugin ends -->'."\n";
}

$links = get_bookmarks();
if (count($links) > 0) {
	add_action('wp_head', 'linkedlist_addSource');
}

?>