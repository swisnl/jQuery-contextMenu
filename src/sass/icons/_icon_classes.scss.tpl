@use "icons/mixins" as *;
<% _.each(glyphs, function(glyph) { %>
.<%= className %>-<%= glyph.name %> {
  @include <%= mixinName %>(<%= glyph.name %>);
}<% }); %>