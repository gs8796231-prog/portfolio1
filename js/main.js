(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  var burger = document.getElementById('burger'), links = document.getElementById('links');
  function closeMenu(){ links.classList.remove('open'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Open menu'); }
  burger.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.addEventListener('click', function(e){ if(e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });

  // Scroll reveal + skill bars
  var items = document.querySelectorAll('.reveal');
  function show(el){
    el.classList.add('in');
    el.querySelectorAll('[data-level]').forEach(function(b){ b.style.width = b.dataset.level + '%'; });
  }
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ show(en.target); io.unobserve(en.target); } });
    }, {threshold:.12});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(show); }

  // Active nav link
  var navLinks = [].slice.call(links.querySelectorAll('a'));
  var secs = navLinks.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  function spy(){
    var y = window.scrollY + 120, cur = 0;
    secs.forEach(function(s,i){ if(s && s.offsetTop <= y) cur = i; });
    navLinks.forEach(function(a,i){ a.classList.toggle('active', i === cur); });
  }
  window.addEventListener('scroll', spy, {passive:true}); spy();

  // Toast
  var toast = document.getElementById('toast'), tt;
  function say(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('show'); }, 2600); }
  document.querySelectorAll('[data-soon]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); say(a.dataset.soon); });
  });

  // Contact form: opens the visitor's email app (no server needed)
  document.getElementById('contact-form').addEventListener('submit', function(e){
    e.preventDefault();
    var f = e.target, n = f.name.value.trim(), m = f.email.value.trim(), msg = f.message.value.trim();
    var note = document.getElementById('form-note');
    if(!n || !/^\S+@\S+\.\S+$/.test(m) || !msg){ note.textContent = 'Please enter your name, a valid email and a message.'; return; }
    var body = msg + '\n\nFrom: ' + n + ' (' + m + ')';
    window.location.href = 'mailto:gs8796231@gmail.com?subject=' + encodeURIComponent('Portfolio message from ' + n) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app. If nothing opens, write to gs8796231@gmail.com.';
  });

  // Background: light neural network (skipped if reduced motion)
  var c = document.getElementById('bg'), ctx = c.getContext('2d'), pts = [], W, H, raf;
  function size(){
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = c.width = innerWidth * d; H = c.height = innerHeight * d; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
    var count = Math.min(60, Math.round(innerWidth / 22));
    pts = []; for(var i=0;i<count;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25*d,vy:(Math.random()-.5)*.25*d});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var link = 140 * (W/innerWidth);
    for(var i=0;i<pts.length;i++){
      var p = pts[i]; p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
      ctx.fillStyle = 'rgba(79,216,255,.55)'; ctx.beginPath(); ctx.arc(p.x,p.y,1.6*(W/innerWidth),0,6.283); ctx.fill();
      for(var j=i+1;j<pts.length;j++){
        var q = pts[j], dx = p.x-q.x, dy = p.y-q.y, dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < link){ ctx.strokeStyle = 'rgba(139,123,255,' + (.18*(1-dist/link)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
      }
    }
    if(!reduce) raf = requestAnimationFrame(draw);
  }
  size(); draw();
  var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ size(); if(reduce) draw(); }, 200); });
  document.addEventListener('visibilitychange', function(){ if(document.hidden) cancelAnimationFrame(raf); else if(!reduce) draw(); });
})();
