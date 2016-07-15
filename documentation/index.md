---
currentMenu: introduction
---

# [jQuery contextMenu](https://github.com/swisnl/jQuery-contextMenu)

## Contextmenu plugin & polyfill

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features](#features)
- [Authors](#authors)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The contextMenu Plugin was designed for web applications in need of menus on a possibly large amount of objects. Unlike implementations as [a beautiful site's](http://abeautifulsite.net/blog/2008/09/jquery-context-menu-plugin/) or [trendskitchens'](http://www.trendskitchens.co.nz/jquery/contextmenu/) this contextMenu treats the menu as the primary object. That means, that a single menu is defined that can be used by multiple objects. Unlike the mentioned plugins, contextMenu doesn't need to bind itself to triggering objects. This allows injecting and removing triggers without having to re-initialize or update contextMenu.

![context menu rendered by $.contextMenu](screenshots/jquery-contextMenu.subs.png) 

contextMenu can provide a simple list of clickable commands, or offer an in-menu form. This makes very simple attribute modification possible. See the [input example](demo/input.html).

Once a menu is registered, it cannot be altered. That means no commands can be added or removed from the menu. This allows contextMenu to keep a single definition in memory, which enables it to work with hundreds of trigger objects. contextMenu knows the two callbacks _show_ and _hide_ which can be used to update the state of commands within the menu. This allows en/disabling commands, changing icons or updating the values of contained `<input>` elements.

As of version 1.5 context menus can be created dynamically. That means the described behavior (once created, cannot be altered) still applies - but can be circumvented. Menus can be created on demand and they can be different depending on the triggering element.

## Features

*   trigger contextMenu with right-click, [left-click](demo/trigger-left-click.html), [hover](demo/trigger-hover.html) or own [custom trigger](demo/trigger-custom.html) events
*   delegated event handling removing the need for re-initialization when trigger objects are [added / removed](demo/dynamic.html)
*   dynamic [on-demand](demo/dynamic-create.html) menu creation
*   optional icons for commands
*   [input elements](demo/input.html) (text, textarea, checkbox, radio, select) within the menu
*   custom html elements (command free)
*   show/hide callbacks to update the state of commands
*   small memory footprint even with hundreds of trigger objects
*   adjust position of menu to fit in viewport
*   [enable / disable](demo/disabled-changing.html) commands
*   nested [sub-menus](demo/sub-menus.html)
*   full keyboard interaction
*   [HTML5 `<menu>`](demo/html5-import.html) support
*   CSS is for styling, javascript is not...

## Authors

*   [Björn Brala (SWIS)](http://www.swis.nl/over-ons/bjorn-brala)
*   [Rodney Rehm](http://rodneyrehm.de/en/)
*   [Christian Baartse](https://github.com/christiaan) (single callback per menu)
*   [Addy Osmani](https://github.com/addyosmani) (compatibility with native context menu in Firefox 8)

## License

$.contextMenu is published under the [MIT license](http://www.opensource.org/licenses/mit-license).
