function Api() {
  /**
   * Override renderer methods.
   */

  var renderer = new marked.Renderer();

  /**
   * Add page headers.
   */

  renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return (level === 1 ? '<div class="page-header">' : '') +
      '<h' + level + '>' +
        '<a name="' + escapedText + '" ' +
          'class="anchor" ' +
          'href="#' + escapedText + '"><span class="header-link"></span>' +
        '</a>' +
        text +
      '</h' + level + '>' +
    (level === 1 ? '</div>' : '');
  };

  /**
   * Make lists unstyled.
   */

  renderer.list = function (body, ordered) {
    var tag = ordered ? 'ol' : 'ul';
    return '<' + tag + (tag === 'ul' ? ' class="list-unstyled"' : '') + '>' +
      body +
    '</' + tag + '>';
  };

  /**
   * Add Bootstap tables.
   */

  renderer.table = function (header, body) {
    return '<table class="table">' +
      header +
      body +
    '</table>';
  };

  /**
   * Add client and server labels.
   */

  renderer.em = function (text) {
    if (text === 'Client') {
      return '<span class="label label-client">Client</span>';
    }

    if (text === 'Server') {
      return '<span class="label label-server">Server</span>';
    }

    if (text === 'Shared') {
      return '<span class="label label-shared">Shared</span>';
    }

    if (text === 'Unimplemented') {
      return '<span class="label label-danger">Unimplemented</span>';
    }

    return '<em>' + text + '</em>';
  };

  /**
   * Update links.
   */

   function startsWith(haystack, needle) {
     return haystack.lastIndexOf(needle, 0) === 0;
   }

  renderer.link = function(href, title, text) {
    if (!startsWith(href, 'http://') &&
        !startsWith(href, 'https://')) {
      href = href.lastIndexOf('api/', 0) === 0 ? href : 'api/' + href;
    }

    var out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  /**
   * Set marked options.
   */

  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
    renderer: renderer
  });

  /**
   * Retrieve an article.
   */

  var request = new XMLHttpRequest();
  var article = route.params.article;
  request.open('GET', 'https://raw.githubusercontent.com/wiki/Planimeter/grid-sdk/' + article + '.md', true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
     var markdown = this.response;
     document.getElementById('article').innerHTML = marked(markdown);
    } else {
      document.getElementById('article').innerHTML = marked('Cannot GET /grid/docs/' + article + '.md');
    }
  };

  request.onerror = function() {
    document.getElementById('article').innerHTML = marked('Cannot GET /grid/docs/' + article + '.md');
  };

  request.send();
}