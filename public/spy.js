(function() {
  var BASE_URL = 'http://localhost:3000/';
  var CURSOR_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRF////AAAA////fu+PTwAAAAN0Uk5T//8A18oNQQAAAERJREFUeNps0EkOACAIBMGW/z9aUVnGyIGQOgwEwKRg8IKKg8iGLgeaXCgJSEkIiQyvuuMJxZDQNSrs3rbYF4z8whRgAMlMAXWkDcuNAAAAAElFTkSuQmCC';
  var MOUSE_MOVE = 1, MOUSE_CLICK = 2, PAGE_SCROLL = 3, WINDOW_RESIZE = 4;
  
  var event_queue = [];
  var socket;
  var cursor;
  
  window._userspy = window._userspy || {};
  
  function init_live_page() {
    socket.on('connect', function() {
      var page_info = {
        url: location.href,
        domain: location.hostname,
        path: location.pathname,
        window: {
          width: $(window).width(),
          height: $(window).height()
        }
      };
      
      socket.emit('page info', page_info);
      
      setInterval(function() {
        if(event_queue.length == 0)
          return;
        
        var events = event_queue;
        event_queue = [];
        
        socket.emit('events', events);
      }, 150);
    });
    
    // track mouse position
    $(document).mousemove(function(e) {
      event_queue.push([+new Date, MOUSE_MOVE, e.pageX, e.pageY]);
    });
    
    // track mouse clicks
    $(document).click(function(e) {
      event_queue.push([+new Date, MOUSE_CLICK, e.pageX, e.pageY]);
    });
    
    // track scrolls
    $(document).scroll(function(e) {
      event_queue.push([+new Date, PAGE_SCROLL, window.scrollX, window.scrollY]);
    });
    
    // track window resizes
    $(window).resize(function(e) {
      event_queue.push([+new Date, WINDOW_RESIZE, $(this).width(), $(this).height()]);
    });
  }
  
  function init_watch_page() {
    $('form').submit(function() {
      var url = $('#url').val();
      
      $.get('/api/visitors?url=' + encodeURIComponent(url)).success(function(visitors) {
        $('form select').html('<option value="">choose a user</option>');
        
        for(socket_id in visitors) {
          $('form select').append(
            $('<option>').attr('value', socket_id).text(socket_id)
          );
        }
        
        $('#spyframe').attr('src', url);
      });
      
      return false;
    });
    
    $('form select').change(function() {
      var socket_id = $(this).val();
      
      if(socket_id) {
        socket.emit('spy', {url: $('#url').val(), socket_id: socket_id});
      }
    });
    
    socket.on('page info', function(data) {
      $('#spyframe').attr('width', data.window.width)
                    .attr('height', data.window.height);
    });
    
    socket.on('events', function(events) {
      // each event is an array:
      // [current timestamp, type, type-specific args, ...]
      
      events.forEach(function(event) {
        if(event[1] == WINDOW_RESIZE) {
          $('#spyframe').width(event[2])
                        .height(event[3]);
        }
      });
      
      $('#spyframe').get(0).contentWindow.postMessage(JSON.stringify(events), '*');
    });
  }
  
  function init_watch_iframe() {
    cursor = document.createElement('div');
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursor.style.zIndex = '99999999999';
    cursor.style.position = 'absolute';
    cursor.style.background = 'url(' + CURSOR_URL + ')';
    cursor.style.top = '-9999px';
    cursor.style.left = '-99990px';
    document.body.appendChild(cursor);
    
    var event_buffer = [];
    
    $(window).on('message', function(e) {
      var events = JSON.parse(e.originalEvent.data);
      
      event_buffer = event_buffer.concat(events);
    });
    
    setInterval(function() {
      var event = event_buffer.shift();
      
      if(!event)
        return;
      
      switch(event[1]) {
        case MOUSE_CLICK:
          cursor.style.backgroundColor = 'red';
          
          setTimeout(function() {
            cursor.style.backgroundColor = '';
          }, 300);
          // fall-thru to below
        
        case MOUSE_MOVE:
          cursor.style.left = event[2] + 'px';
          cursor.style.top = event[3] + 'px';
          break;
        
        case PAGE_SCROLL:
          window.scrollTo(event[2], event[3]);
          break;
        
        default:
      }
    }, 10);
  }
  
  function init() {
    $(document).ready(function() {
      socket = io.connect(BASE_URL);
      
      if(_userspy.watch) {
        init_watch_page();
      } else if(window == window.top) {
        init_live_page();
      } else {
        init_watch_iframe();
      }
    });
  }

  (function() {
    // load socket.io
    var io = document.createElement('script');
    io.src = BASE_URL + 'socket.io/socket.io.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(io, s);

    // load jQuery if needed
    if(window.jQuery) {
      init();
    } else {
      var jq = document.createElement('script');
      jq.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
      jq.onload = init;
  
      s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(jq, s);
    }
  })();
})();
