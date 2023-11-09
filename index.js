/*
 * add "active" className to primary nav elements on matching URLs
 */
(function () {

	var elements, element, index, length, linkHref, windowHref;

	elements = document.querySelectorAll(".q-navigation__item > a");
	if (elements) {

		length = elements.length;
		for (index = 0; index < length; index += 1) {

			element = elements[index];
			linkHref = element.getAttribute("href");
			windowHref = window.location.href;
			if (windowHref.match(linkHref)) {

				element.classList.add("active");

			}

		}

	}

})();

/*
 * handle taps in mobile hamburger menu
 */
(function () {

	"use strict";

	function handleMenuClick (event) {

		var container, menu, menuIcon;

		menuIcon = event.currentTarget;
		menu = document.querySelector(".q-hamburger-menu__container");
		container = document.querySelector(".q-header__background");

		if (menuIcon.classList.toggle("active")) {

			menu.classList.add("active");
			container.classList.add("active");

		} else {

			menu.classList.remove("active");
			container.classList.remove("active");

		}

	}

	function handleMenuItemClick (event) {

		event.preventDefault();

		var container, menu, menuIcon;

		menuIcon = event.currentTarget;
		menu = document.querySelector(".q-header__nav-sub");
		container = document.querySelector(".q-header__nav");

		if (menuIcon.classList.toggle("active")) {

			menu.classList.add("active");
			container.classList.add("active");

		} else {

			menu.classList.remove("active");
			container.classList.remove("active");

		}

		return false;

	}

	/*
	 * listen for clicks on the "Back to main menu" link
	 * and remove the active classes form the parent-level menu, icon, and container
	 */
	function handleBackMenuItemClick (event) {

		event.preventDefault();

		var container, menu, menuIcon;

		menuIcon = document.querySelector(".q-header__nav > li:first-child > a");
		menu = document.querySelector(".q-header__nav-sub");
		container = document.querySelector(".q-header__nav");

		menuIcon.classList.remove("active");
		menu.classList.remove("active");
		container.classList.remove("active");

		return false;

	}

	function addEventListeners () {

		if (hamburgerMenuIcon) {
			hamburgerMenuIcon.addEventListener("click", handleMenuClick);
		}
		if (discussionMenuItem) {
			discussionMenuItem.addEventListener("click", handleMenuItemClick);
		}
		if (backMenuItem) {
			backMenuItem.addEventListener("click", handleBackMenuItemClick);
		}

	}

	function removeEventListeners () {

		if (hamburgerMenuIcon) {
			hamburgerMenuIcon.removeEventListener("click", handleMenuClick);
		}
		if (discussionMenuItem) {
			discussionMenuItem.removeEventListener("click", handleMenuItemClick);
		}
		if (backMenuItem) {
			backMenuItem.removeEventListener("click", handleBackMenuItemClick);
		}

	}

	function handleOrientationChange (mediaQueryList) {

		if (mediaQueryList.matches) {

			addEventListeners();

		} else {

			removeEventListeners();

		}

	}

	var backMenuItem, discussionMenuItem, hamburgerMenuIcon, mediaQueryList;

	hamburgerMenuIcon = document.querySelector(".q-hamburger-menu__icon");
	discussionMenuItem = document.querySelector(".q-header__nav > li:nth-child(2) > a");
	backMenuItem = document.querySelector("a.q-header__nav-back");

	mediaQueryList = window.matchMedia("(max-width: 40em)");
	mediaQueryList.addListener(handleOrientationChange);
	handleOrientationChange(mediaQueryList);

})();

/* global Coveo */

document.addEventListener("DOMContentLoaded", function () {

	var PUBLIC_API_KEY, options, search, searchbox, searchPageURI, site;

	site = document.querySelector("#site_data");
	try {
		site = JSON.parse(site.innerText);
	} catch (err) {
		/* eslint-disable no-console */
		console.warn(err);
		/* eslint-enable no-console */
		site = {};
	}

	if (site.coveo && site.coveo.public && site.coveo.public.api) {
		PUBLIC_API_KEY = site.coveo.public.api.key;
	} else {
		throw new Error("Public API Key for Coveo not found.");
	}
	searchbox = document.querySelector("#searchbox");
	search = document.querySelector("#search");

	Coveo.SearchEndpoint.configureCloudV2Endpoint(
		"",
		PUBLIC_API_KEY,
		"https://platform.cloud.coveo.com/rest/search",
		{
			"queryStringArguments": {
				"searchHub": "CommunitySearch"
			}
		}
	);

	if (search) {

		// bind custom event callbacks before initialization
		search.addEventListener("newResultDisplayed", hideShowMoreLink);

		// add an external component to the initialization options
		// to link the external search box to the search results
		Coveo.init(search, {
			"externalComponents": [searchbox]
		});

	} else {

		searchPageURI = "https://community.qualys.com/search/";
		options = {
			"Omnibox": {
				"placeholder": "Search"
			}
		};

		if (location.pathname.match(/^\/vulnerability-detection-pipeline/)) {
			searchPageURI = "https://community.qualys.com" + "/search/";
			options.Omnibox.placeholder = "Search Discussions, Blog Posts, Training, Docs and Support";
		}

		if (location.pathname.match(/^\/documentation/)) {

			// searching from a Docs page
			searchPageURI = "https://community.qualys.com" + "/search/#t=Docs";
			options.Omnibox.placeholder = "Search documentation";

		}

		if (location.pathname.match(/^\/training/)) {

			// searching from a Training page
			searchPageURI = "https://community.qualys.com" + "/search/#t=Training";
			options.Omnibox.placeholder = "Search training";

		}

		// call initSearchBox to setup the standalone search box
		Coveo.initSearchbox(searchbox, searchPageURI, options);

	}


	// helper function to hide "Show more" links when there are no more results to show
	function hideShowMoreLink (event) {

		var result = event.detail.result;
		var item = event.detail.item;
		var totalNumberOfChildResults = result.raw.jivereplycount || result.raw.wpcommentcount || 0;
		var numberOfChildResultsShown = result.childResults.length;
		var numberOfChildResultsRemaining = totalNumberOfChildResults - numberOfChildResultsShown;

		if (numberOfChildResultsRemaining < 1) {

			// hide Show more link
			var coveoFoldingFooter = item.querySelector(".coveo-folding-footer");
			if (coveoFoldingFooter) {
				coveoFoldingFooter.classList.add("hidden");
			}

		}

	}

});


/*
 * manage Choose a Topic navigation
 */
(function () {

	/*
	 * move arrow to clicked element
	 * and reveal menu for clicked element
	 */
	function handleClick (event) {

		var active, container, heading, index, menu;

		heading = event.currentTarget;
		menu = heading.parentNode;
		container = menu.parentNode;

		// check if the current menu is active so we can toggle
		active = menu.classList.contains("active");

		// do nothing if already active
		if (active ) {
			return;
		}

		// remove all selected-index-* class names
		for (index = 0; index < 6; index += 1) {
			container.classList.remove(`selected-index-${index}`);
		}

		// get index of clicked element
		index = menu.getAttribute("data-index");
		container.classList.add(`selected-index-${index}`);

		// un mark all menus
		for (index = 0; index < container.childNodes.length; index += 1) {
			menu = container.childNodes[index];
			if (menu && menu.classList) {
				menu.classList.toggle("active", active);
			}
		}

		// mark active menu
		menu = heading.parentNode;
		menu.classList.toggle("active", !active);

	}

	var headings, heading, index;

	headings = document.querySelectorAll(".q-topic-tab_link");
	if (headings) {

		for (index = 0; index < headings.length; index += 1) {

			heading = headings.item(index);
			heading.addEventListener("click", handleClick);
		}
	}
	// toggle apps menu in mobile

	var appHeading = document.querySelectorAll(".q-nav-by-topic__heading");

	Array.prototype.forEach.call(appHeading, function(el){
		el.addEventListener("click", function(){

			// toggle the minus class

			el.classList.toggle("active");
			el.nextElementSibling.classList.toggle("show");
		});
	});

}());



