// DON'T MANUALLY EDIT THIS FILE; run `gulp build-icons` instead.
$icons-cachebust: "<%= (0|Math.random()*9e6).toString(36) %>";
$icons: (<% _.each(glyphs, function(glyph) { %>
<%= glyph.name %>: "<%= glyph.unicode %>",<% }); %>
);