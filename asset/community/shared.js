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
