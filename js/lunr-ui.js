---
layout: none
---
$.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(index_json) {
  window.index = new elasticlunr.Index;
  window.store = index_json;
  index.saveDocument(false);
  index.setRef('lunr_id');
  index.addField('pid');
  index.addField('title');
  index.addField('_date');
  index.addField('format');
  index.addField('_name');
  index.addField('subjects');
  index.addField('summary');
  // add docs
  for (i in store) {
    index.addDoc(store[i]);
  }
  $('input#search').on('keyup', function () {
    var results_div = $('#results');
    var query = $(this).val();
    var results = index.search(query, {bool: "AND", expand: true});
    results_div.empty();
    if (results.length > 10){results_div.prepend("<p><small>Displaying 10 of " + results.length + " results.</small></p>");}
    for (var r in results.slice(0, 9)) { // limit visible results to 10
      var ref   = results[r].ref;
      var item  = store[ref];
      var link  = item.link;
      var title = item.title;
      var date  = item._date;
      var fmat  = item.format;
      var subj  = item.subjects;
      var desc  = item.summary.slice(0,60) + "...";
      var meta  = date + ' / ' + subj + ' / ' + fmat + ' / ' + desc  ;
      var result = '<div class="result"><b><a href="' + link + '">' + title + '</a></b><br><p>' + meta +'</p></div>';
      results_div.append(result);
    }
  });
});
