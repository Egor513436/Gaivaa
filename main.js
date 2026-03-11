document.addEventListener('DOMContentLoaded', function () {

    var BOT_SERVER = 'http://localhost:3000';

    var header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    burger.addEventListener('click', function () {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-aos]').forEach(function (el) {
        observer.observe(el);
    });

    var counters = document.querySelectorAll('.hero-stat-number');
    var countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-count'));
            var duration = 2000;
            var startTime = null;
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target + '+';
                }
            }
            requestAnimationFrame(step);
        });
    }

    var heroObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            setTimeout(animateCounters, 500);
        }
    }, { threshold: 0.5 });

    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);

    var particles = document.getElementById('particles');
    if (particles) {
        var style = document.createElement('style');
        style.textContent = '@keyframes particleFloat{0%,100%{transform:translateY(0) translateX(0);opacity:0.3}25%{transform:translateY(-30px) translateX(15px);opacity:0.8}50%{transform:translateY(-60px) translateX(-10px);opacity:0.5}75%{transform:translateY(-30px) translateX(20px);opacity:0.7}}';
        document.head.appendChild(style);
        for (var i = 0; i < 30; i++) {
            var p = document.createElement('div');
            var size = Math.random() * 3 + 1;
            p.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:rgba(255,107,0,' + (Math.random() * 0.3 + 0.1) + ');border-radius:50%;top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;animation:particleFloat ' + (Math.random() * 8 + 6) + 's ease-in-out infinite ' + (Math.random() * 5) + 's;';
            particles.appendChild(p);
        }
    }

    var track = document.getElementById('reviewsTrack');
    var prevBtn = document.getElementById('reviewPrev');
    var nextBtn = document.getElementById('reviewNext');
    var dotsContainer = document.getElementById('reviewsDots');
    var reviewSlide = 0;

    function getPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getMaxSlide() {
        return Math.max(0, track.querySelectorAll('.review-card').length - getPerView());
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (var i = 0; i <= getMaxSlide(); i++) {
            var dot = document.createElement('div');
            dot.className = 'dot' + (i === reviewSlide ? ' active' : '');
            dot.setAttribute('data-i', i);
            dot.addEventListener('click', function () {
                reviewSlide = parseInt(this.getAttribute('data-i'));
                moveSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function moveSlider() {
        var card = track.querySelector('.review-card');
        if (!card) return;
        var cardWidth = card.offsetWidth + 24;
        track.style.transform = 'translateX(-' + (reviewSlide * cardWidth) + 'px)';
        buildDots();
    }

    prevBtn.addEventListener('click', function () {
        reviewSlide = Math.max(0, reviewSlide - 1);
        moveSlider();
    });

    nextBtn.addEventListener('click', function () {
        reviewSlide = Math.min(getMaxSlide(), reviewSlide + 1);
        moveSlider();
    });

    buildDots();
    window.addEventListener('resize', function () {
        reviewSlide = Math.min(reviewSlide, getMaxSlide());
        moveSlider();
    });

    var dateInput = document.getElementById('date');
    if (dateInput) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        dateInput.min = today.getFullYear() + '-' + mm + '-' + dd;
    }

    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            var val = e.target.value.replace(/\D/g, '');
            if (val.length > 0) {
                if (val[0] === '7' || val[0] === '8') val = val.substring(1);
                var f = '+7';
                if (val.length > 0) f += ' (' + val.substring(0, 3);
                if (val.length >= 3) f += ') ' + val.substring(3, 6);
                if (val.length >= 6) f += '-' + val.substring(6, 8);
                if (val.length >= 8) f += '-' + val.substring(8, 10);
                e.target.value = f;
            }
        });
    }

    var bookingForm = document.getElementById('bookingForm');
    var submitBtn = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('name').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var service = document.getElementById('service').value;
        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var comment = document.getElementById('comment').value.trim();

        if (!name || !phone || !service || !date || !time) return;

        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loader').style.display = 'inline';
        submitBtn.disabled = true;

        fetch(BOT_SERVER + '/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                phone: phone,
                service: service,
                date: date,
                time: time,
                comment: comment
            })
        })
        .then(function (res) {
            if (res.ok) {
                bookingForm.style.display = 'none';
                formSuccess.style.display = 'block';
            } else {
                throw new Error('fail');
            }
        })
        .catch(function () {
            alert('Ошибка! Позвоните: +7 (952) 658-66-46');
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loader').style.display = 'none';
            submitBtn.disabled = false;
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

});