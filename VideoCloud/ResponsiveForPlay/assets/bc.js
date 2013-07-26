// Initial bootstrapping
(function(d, w){
  var
    wr = d.querySelector('.wrap'),
    v = d.querySelector('.video-js'),
    b = document.body;
  v.hidden = null;
  _V_(v, {}, function(){
    var
      p = this,
      fp = function(){
        wr.style.display = 'none';
        p.off('play', fp);
      };
    p.on('play', fp, false);
    p.src({type:'video/mp4', src:"http://video-js.zencoder.com/oceans-clip.mp4"});
  });
})(document, window);

setTimeout(function(){
  document.querySelector('.vjs-mute-control').style.display='none';
}, 25);
// Initial bootstrapping


window.addEventListener('orientationchange', function() {
  var v = document.querySelector('.video-js');
  v.style.width = getComputedStyle(v).width;
  setTimeout(function() {
    v.style.width = '240vh';
  }, 1);
}, false);