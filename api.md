## Classes

<dl>
<dt><a href="#ContextMenu">ContextMenu</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#determinePosition">determinePosition($menu)</a></dt>
<dd><p>Determine the position for a root menu</p>
</dd>
<dt><a href="#position">position(e, opt, x, y)</a></dt>
<dd><p>Position the menu</p>
</dd>
<dt><a href="#positionSubmenu">positionSubmenu(e, $menu)</a></dt>
<dd><p>Position a submenu</p>
</dd>
<dt><a href="#inputLabel">inputLabel(node)</a> ⇒ <code>string</code> | <code>JQuery</code></dt>
<dd><p>Get the input label for the given node</p>
</dd>
<dt><a href="#setInputValues">setInputValues(opt, data)</a></dt>
<dd><p>import values into <input> commands</p>
</dd>
<dt><a href="#getInputValues">getInputValues(opt, data)</a> ⇒ <code>Object</code></dt>
<dd><p>export values from <input> commands</p>
</dd>
<dt><a href="#zindex">zindex($t)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#splitAccesskey">splitAccesskey(val)</a> ⇒ <code>Array</code></dt>
<dd><p>Split accesskey according to <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key">http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key</a></p>
</dd>
<dt><a href="#html5builder">html5builder(items, $children, counter)</a> ⇒ <code>number</code></dt>
<dd><p>Helper function for building a menu from a HTML <menu> element</p>
</dd>
<dt><a href="#execute">execute(operation, options)</a> ⇒ <code><a href="#ContextMenu">ContextMenu</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ContextMenuData">ContextMenuData</a> : <code><a href="#ContextMenuSettings">ContextMenuSettings</a></code></dt>
<dd></dd>
<dt><a href="#ContextMenuItem">ContextMenuItem</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContextMenuBuildCallback">ContextMenuBuildCallback</a> ⇒ <code>Object.&lt;string, ContextMenuItem&gt;</code></dt>
<dd></dd>
<dt><a href="#ContextMenuSettings">ContextMenuSettings</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContextMenuEventHandlers">ContextMenuEventHandlers</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ContextMenuOperations">ContextMenuOperations</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="ContextMenu"></a>

## ContextMenu
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| defaults | [<code>ContextMenuSettings</code>](#ContextMenuSettings) | 
| handle | [<code>ContextMenuEventHandlers</code>](#ContextMenuEventHandlers) | 
| op | [<code>ContextMenuOperations</code>](#ContextMenuOperations) | 
| menus | <code>Object.&lt;string, ContextMenuData&gt;</code> | 
| counter | <code>number</code> | 
| initialized | <code>boolean</code> | 
| initialized | <code>boolean</code> | 

<a name="determinePosition"></a>

## determinePosition($menu)
Determine the position for a root menu

**Kind**: global function  

| Param | Type |
| --- | --- |
| $menu | <code>JQuery</code> | 

<a name="position"></a>

## position(e, opt, x, y)
Position the menu

**Kind**: global function  

| Param | Type |
| --- | --- |
| e | <code>JQuery.Event</code> | 
| opt | [<code>ContextMenuData</code>](#ContextMenuData) | 
| x | <code>number</code> \| <code>string</code> | 
| y | <code>number</code> \| <code>string</code> | 

<a name="positionSubmenu"></a>

## positionSubmenu(e, $menu)
Position a submenu

**Kind**: global function  

| Param | Type |
| --- | --- |
| e | <code>JQuery.Event</code> | 
| $menu | <code>JQuery</code> | 

<a name="inputLabel"></a>

## inputLabel(node) ⇒ <code>string</code> \| <code>JQuery</code>
Get the input label for the given node

**Kind**: global function  

| Param |
| --- |
| node | 

<a name="setInputValues"></a>

## setInputValues(opt, data)
import values into <input> commands

**Kind**: global function  

| Param | Type |
| --- | --- |
| opt | [<code>ContextMenuData</code>](#ContextMenuData) | 
| data | <code>Object</code> | 

<a name="getInputValues"></a>

## getInputValues(opt, data) ⇒ <code>Object</code>
export values from <input> commands

**Kind**: global function  

| Param | Type |
| --- | --- |
| opt | [<code>ContextMenuData</code>](#ContextMenuData) | 
| data | <code>Object</code> | 

<a name="zindex"></a>

## zindex($t) ⇒ <code>number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| $t | <code>JQuery</code> | 

<a name="splitAccesskey"></a>

## splitAccesskey(val) ⇒ <code>Array</code>
Split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key

**Kind**: global function  

| Param | Type |
| --- | --- |
| val | <code>string</code> | 

<a name="html5builder"></a>

## html5builder(items, $children, counter) ⇒ <code>number</code>
Helper function for building a menu from a HTML <menu> element

**Kind**: global function  

| Param | Type |
| --- | --- |
| items | <code>Object.&lt;string, ContextMenuItem&gt;</code> | 
| $children | <code>JQuery</code> | 
| counter | <code>number</code> | 

<a name="execute"></a>

## execute(operation, options) ⇒ [<code>ContextMenu</code>](#ContextMenuManager)
**Kind**: global function  

| Param | Type |
| --- | --- |
| operation | <code>string</code> \| [<code>ContextMenuSettings</code>](#ContextMenuSettings) | 
| options | <code>string</code> \| [<code>ContextMenuSettings</code>](#ContextMenuSettings) | 

<a name="ContextMenuData"></a>

## ContextMenuData : [<code>ContextMenuSettings</code>](#ContextMenuSettings)
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $menu | <code>JQuery</code> | The menu element for this menu part. Eg. the root menu, or a single submenu |
| $layer | <code>JQuery</code> | The opened layer when the menu is opened |
| $node | <code>JQuery</code> | The menu item node |
| $trigger | <code>JQuery</code> | The element that triggered opening the menu |
| $selected | <code>JQuery</code> \| <code>null</code> | Currently selected menu item, or input inside menu item |
| hasTypes | <code>boolean</code> | The menu has ContextMenuItem which are of a selectable type |
| hovering | <code>boolean</code> | Currently hovering, root menu only. |

<a name="ContextMenuItem"></a>

## ContextMenuItem : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> |  |
| icon | <code>string</code> \| <code>function</code> |  |
| isHtmlName | <code>boolean</code> | Should this item be called with .html() instead of .text() |
| items | <code>Object.&lt;string, ContextMenuItem&gt;</code> |  |

<a name="ContextMenuBuildCallback"></a>

## ContextMenuBuildCallback ⇒ <code>Object.&lt;string, ContextMenuItem&gt;</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>JQuery.Event</code> | Event that trigged the menu |
| $currentTrigger | <code>JQuery</code> | Element that trigged the menu |

<a name="ContextMenuSettings"></a>

## ContextMenuSettings : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>null</code> \| <code>string</code> |  | selector of contextMenu trigger |
| appendTo | <code>null</code> \| <code>string</code> |  | where to append the menu to |
| trigger | <code>string</code> | <code>&quot;left&quot;</code> | method to trigger context menu ["right", "left", "hover"] |
| autoHide | <code>boolean</code> | <code>true</code> | hide menu when mouse leaves trigger / menu elements |
| delay | <code>number</code> | <code>200</code> | ms to wait before showing a hover-triggered context menu |
| reposition | <code>boolean</code> | <code>true</code> | flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu as long as the trigger happened on one of the trigger-element's child nodes |
| hideOnSecondTrigger | <code>boolean</code> | <code>false</code> | Flag denoting if a second trigger should close the menu, as long as the trigger happened on one of the trigger-element's child nodes. This overrides the reposition option. |
| selectableSubMenu | <code>boolean</code> | <code>false</code> | ability to select submenu |
| className | <code>string</code> |  | Class to be appended to the root menu. |
| classNames | <code>Object</code> |  | Default classname configuration to be able avoid conflicts in frameworks |
| classNames.hover | <code>string</code> | <code>&quot;context-menu-hover&quot;</code> |  |
| classNames.disabled | <code>string</code> | <code>&quot;context-menu-disabled&quot;</code> |  |
| classNames.visible | <code>string</code> | <code>&quot;context-menu-visible&quot;</code> |  |
| classNames.notSelectable | <code>string</code> | <code>&quot;context-menu-not-selectable&quot;</code> |  |
| classNames.icon | <code>string</code> | <code>&quot;context-menu-icon&quot;</code> |  |
| classNames.iconEdit | <code>string</code> | <code>&quot;context-menu-icon-edit&quot;</code> |  |
| classNames.iconCut | <code>string</code> | <code>&quot;context-menu-icon-cut&quot;</code> |  |
| classNames.iconCopy | <code>string</code> | <code>&quot;context-menu-icon-copy&quot;</code> |  |
| classNames.iconPaste | <code>string</code> | <code>&quot;context-menu-icon-paste&quot;</code> |  |
| classNames.iconDelete | <code>string</code> | <code>&quot;context-menu-icon-delete&quot;</code> |  |
| classNames.iconAdd | <code>string</code> | <code>&quot;context-menu-icon-add&quot;</code> |  |
| classNames.iconQuit | <code>string</code> | <code>&quot;context-menu-icon-quit&quot;</code> |  |
| classNames.iconLoadingClass | <code>string</code> | <code>&quot;context-menu-icon-loading&quot;</code> |  |
| zIndex | <code>number</code> | <code>1</code> | offset to add to zIndex |
| animation | <code>Object</code> |  | Animation settings |
| animation.duration | <code>number</code> | <code>50,</code> |  |
| animation.show | <code>string</code> | <code>&quot;&#x27;slideDown&#x27;&quot;</code> |  |
| animation.hide | <code>string</code> | <code>&quot;&#x27;slideUp&#x27;&quot;</code> |  |
| events | <code>Object</code> |  | Event callbacks |
| events.show | <code>function</code> |  |  |
| events.hide | <code>function</code> |  |  |
| events.activated | <code>function</code> |  |  |
| callback | <code>function</code> |  |  |
| determinePosition | [<code>determinePosition</code>](#determinePosition) \| <code>function</code> |  |  |
| position | [<code>position</code>](#position) \| <code>function</code> |  |  |
| positionSubmenu | [<code>positionSubmenu</code>](#positionSubmenu) \| <code>function</code> |  |  |
| items | <code>Object.&lt;string, ContextMenuItem&gt;</code> |  |  |
| build | [<code>ContextMenuBuildCallback</code>](#ContextMenuBuildCallback) | <code>false</code> |  |

<a name="ContextMenuEventHandlers"></a>

## ContextMenuEventHandlers : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| $currentTrigger | <code>JQuery</code> | 
| hoveract | <code>Object</code> | 

<a name="ContextMenuOperations"></a>

## ContextMenuOperations : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| handle | <code>Object</code> | 

