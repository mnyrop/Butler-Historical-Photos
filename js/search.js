---
layout: null
---
// Initialize lunr with the fields to be searched, plus the boost.


var index = lunr(function () {
  this.field('title').ignoreCase
  this.field('summary').ignoreCase
  this.field('format').ignoreCase
  this.field('subjects').ignoreCase
  this.field('name').ignoreCase
  this.ref('id')
});

{% assign count = 0 %}

{% for item in site.photos %}
  index.add({
    title: {{ item.title | jsonify }},
    summary: {{ item.summary | strip_html |jsonify }},
    format: {{ item.format | strip_html | jsonify }},
    subjects: {{ item.subjects | strip_html | jsonify }},
    name: {{ item.name | jsonify }},
    link: {{ site.baseurl | append:item.url | jsonify }},
    id: {{count}}
  });
  {% assign count = count | plus: 1 %}
{% endfor %}

console.log( jQuery.type(index) );

var store = [{% for item in site.photos %}{
  'title': {{ item.title | jsonify }},
  'summary': {{ item.summary | strip_html | truncatewords: 36 | jsonify }},
  'format': {{ item.format | strip_html | jsonify }},
  'subjects': {{ item.subjects | strip_html | jsonify }},
  'name': {{ item.name | jsonify }},
  'link': {{ site.baseurl | append:item.url | jsonify }},
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
      var searchitem = '<div class="result"></br><a href="'+store[ref].link+' " class="post-title" style="font-size:1em;">'+store[ref].title+'</a><p style="font-size:.8em"><i>'+store[ref].summary+'</i></p></div>';

      resultdiv.append(searchitem);
    }
  });
});
