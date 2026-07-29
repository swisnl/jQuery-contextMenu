// Regression tests for https://github.com/swisnl/jQuery-contextMenu/issues/811
//
// `inputLabel()` is the fallback name for inputs imported from an HTML5
// `<menu>`. It used to read the associated `<label>` with `.val()`, but a
// `<label>` has no `value` property, so the getter always returned "" and the
// import silently fell back to the input's `name` attribute. Every assertion
// below goes through `$.contextMenu.fromMenu()` (or the `html5` polyfill), so
// the real import path is exercised rather than the private helper.

function issue811BuildMenu(html) {
  return $('<menu type="context"></menu>')
    .html(html)
    .appendTo($('#qunit-fixture'));
}

function issue811FirstItem(html) {
  var items = $.contextMenu.fromMenu(issue811BuildMenu(html));
  var keys = [];

  $.each(items, function(key) {
    keys.push(key);
  });

  return items[keys[0]];
}

QUnit.module('issue 811 - imported inputs use their associated label', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

QUnit.test('a text input is named after its <label for="...">', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-text">My Label</label>' +
    '<input id="issue-811-text" name="fallbackname" type="text" value="v">'
  );

  assert.equal(item.type, 'text', 'the input was imported as a text item');
  assert.equal(item.name, 'My Label', 'the label text is used, not the name attribute');
});

QUnit.test('a checkbox is named after its <label for="...">', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-check">Check me</label>' +
    '<input id="issue-811-check" name="fallbackname" type="checkbox">'
  );

  assert.equal(item.type, 'checkbox', 'the input was imported as a checkbox item');
  assert.equal(item.name, 'Check me', 'the label text is used, not the name attribute');
});

QUnit.test('a radio is named after its <label for="...">', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-radio">Pick me</label>' +
    '<input id="issue-811-radio" name="fallbackname" type="radio" value="a">'
  );

  assert.equal(item.type, 'radio', 'the input was imported as a radio item');
  assert.equal(item.name, 'Pick me', 'the label text is used, not the name attribute');
});

QUnit.test('a select is named after its <label for="...">', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-select">Choose one</label>' +
    '<select id="issue-811-select" name="fallbackname"><option value="a">A</option></select>'
  );

  assert.equal(item.type, 'select', 'the element was imported as a select item');
  assert.equal(item.name, 'Choose one', 'the label text is used, not the name attribute');
});

QUnit.test('a textarea is named after its <label for="...">', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-textarea">Say something</label>' +
    '<textarea id="issue-811-textarea" name="fallbackname"></textarea>'
  );

  assert.equal(item.type, 'textarea', 'the element was imported as a textarea item');
  assert.equal(item.name, 'Say something', 'the label text is used, not the name attribute');
});

QUnit.test('surrounding whitespace in the label is trimmed', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-ws">\n    Spaced out\n  </label>' +
    '<input id="issue-811-ws" name="fallbackname" type="text">'
  );

  assert.equal(item.name, 'Spaced out', 'the label text is trimmed');
});

QUnit.test('an input without a label falls back to its name attribute', function(assert) {
  var item = issue811FirstItem('<input id="issue-811-nolabel" name="fallbackname" type="text">');

  assert.equal(item.name, 'fallbackname', 'the name attribute is used when there is no label');
});

QUnit.test('an input without an id falls back to its name attribute', function(assert) {
  var item = issue811FirstItem('<input name="fallbackname" type="text">');

  assert.equal(item.name, 'fallbackname', 'the name attribute is used when there is no id');
});

QUnit.test('an empty or whitespace-only label falls back to the name attribute', function(assert) {
  var item = issue811FirstItem(
    '<label for="issue-811-empty">   </label>' +
    '<input id="issue-811-empty" name="fallbackname" type="text">'
  );

  assert.equal(item.name, 'fallbackname', 'a label with no text does not blank out the item name');
});

QUnit.test('a label outside the menu is still found', function(assert) {
  $('<label for="issue-811-outside">Outside label</label>').appendTo($('#qunit-fixture'));

  var item = issue811FirstItem('<input id="issue-811-outside" name="fallbackname" type="text">');

  assert.equal(item.name, 'Outside label', 'a label anywhere in the document is used');
});

QUnit.test('a wrapping <label> still wins over the name attribute and is trimmed', function(assert) {
  var item = issue811FirstItem(
    '<label>\n  Wrapped\n  <input id="issue-811-wrapped" name="fallbackname" type="text">\n</label>'
  );

  assert.equal(item.name, 'Wrapped', 'the wrapping label text is used and trimmed');
});

QUnit.test('a whitespace-only wrapping <label> falls back to the name attribute', function(assert) {
  var item = issue811FirstItem(
    '<label>\n  <input id="issue-811-wrapped-empty" name="fallbackname" type="text">\n</label>'
  );

  assert.equal(item.name, 'fallbackname', 'a wrapping label with no text does not blank out the item name');
});

// The id used to be concatenated straight into a selector, so an id holding a
// CSS metacharacter produced a malformed selector and threw.
QUnit.test('an id containing CSS metacharacters does not break the label lookup', function(assert) {
  var weirdId = 'issue-811.weird:id[1]';
  var item = issue811FirstItem(
    '<label for="' + weirdId + '">Weird id label</label>' +
    '<input id="' + weirdId + '" name="fallbackname" type="text">'
  );

  assert.equal(item.name, 'Weird id label', 'the label is found for an id full of metacharacters');
});

QUnit.test('an id containing a quote does not break the label lookup', function(assert) {
  var quotedId = 'issue-811"quoted';
  var $label = $('<label></label>').attr('for', quotedId).text('Quoted id label');
  var $input = $('<input type="text" name="fallbackname">').attr('id', quotedId);
  var $menu = $('<menu type="context"></menu>').append($label, $input).appendTo($('#qunit-fixture'));

  var items = $.contextMenu.fromMenu($menu);

  assert.equal(items.key1.name, 'Quoted id label', 'the label is found for an id containing a quote');
});

QUnit.module('issue 811 - html5 polyfill', {
  afterEach: function() {
    $.contextMenu('destroy');
    var $fixture = $('#qunit-fixture');
    if ($fixture.length) {
      $fixture.html('');
    }
  }
});

// `$.contextMenu('html5')` registers `[contextmenu=<id>]` as the menu's
// selector. That string is deliberately left unquoted and unescaped: it doubles
// as the registration key (`namespaces[o.selector]`), so quoting it would
// silently break anyone passing the old literal back into
// `$.contextMenu('destroy'/'update', ...)`. An id holding a CSS metacharacter
// therefore still throws here, which is a separate concern from the label
// lookup this issue is about - see the secondary item in #811.
QUnit.test('a <menu> is registered and opens through the polyfill', function(assert) {
  var menuId = 'issue-811-menu-id';

  $('<menu type="context"><command label="Rotate"></command></menu>')
    .attr('id', menuId)
    .appendTo($('#qunit-fixture'));
  var $trigger = $('<span>trigger</span>')
    .attr('contextmenu', menuId)
    .appendTo($('#qunit-fixture'));

  $.contextMenu('html5', true);

  $trigger.trigger($.Event('contextmenu'));

  var $menu = $('ul.context-menu-list:visible');
  assert.equal($menu.length, 1, 'the polyfilled menu opened for its trigger');
  assert.equal($menu.find('.context-menu-item').first().text(), 'Rotate', 'the imported command is shown');
});

QUnit.test('an input imported through the html5 polyfill shows its label', function(assert) {
  var menuId = 'issue-811-html5-menu';

  $('<menu type="context">' +
      '<label for="issue-811-html5-input">Polyfilled label</label>' +
      '<input id="issue-811-html5-input" name="fallbackname" type="text">' +
    '</menu>')
    .attr('id', menuId)
    .appendTo($('#qunit-fixture'));
  var $trigger = $('<span>trigger</span>')
    .attr('contextmenu', menuId)
    .appendTo($('#qunit-fixture'));

  $.contextMenu('html5', true);

  $trigger.trigger($.Event('contextmenu'));

  var $menu = $('ul.context-menu-list:visible');
  assert.equal($menu.length, 1, 'the polyfilled menu opened');
  assert.ok($menu.text().indexOf('Polyfilled label') > -1, 'the input is labelled with the label text');
  assert.equal($menu.text().indexOf('fallbackname'), -1, 'the name attribute is not shown');
});
