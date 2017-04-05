---

---
// Initialize lunr with the fields to be searched, plus the boost.
var index = lunr(function () {
  this.field('title')
  this.field('description')
  this.field('tag')
  this.ref('id')
});

{% assign count = 0 %}

{% for collection_item in site.paper_gods %}
  index.add({
    title: {{ collection_item.title | jsonify }},
    description: {{ collection_item.description | jsonify }},
    tag: {{ collection_item.tag | jsonify }},
    id: {{count}}
  });
  {% assign count = count | plus: 1 %}
{% endfor %}

console.log( jQuery.type(index) );

var store = [{% for collection_item in site.paper_gods %}{
  'title': {{ collection_item.title | jsonify }},
  'description': {{ collection_item.description | jsonify }},
  'link': {{ site.baseurl | append:collection_item.url | jsonify }},
  'tag': {{ collection_item.tag | jsonify }}
 }{% unless forloop.last %},{% endunless %}{% endfor %}
]

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);
    // Show results
    resultdiv.empty();
    for (var item in result) {
      var ref = result[item].ref;
      var searchitem = '<div class="result"></br><a href="'+store[ref].link+' " class="post-title" style="font-size:1em;">'+store[ref].title+'</a><p>'+store[ref].description+'</p><p>#'+store[ref].tag+'</p></div>';

      resultdiv.append(searchitem);
    }
  });
});
