/**
 * lmu-seo-components.js
 * Shared template engine for LMU location landing pages.
 *
 * Each page sets, before loading this script:
 *   const LOCATION_NAME = "Watercolor";
 *   window.LMU_PAGE = { preselect: 'WaterColor, FL' };
 */
(function () {
  'use strict';

  /* ── 1. CONFIG ──────────────────────────────────────────────────────────── */
  var loc       = (typeof LOCATION_NAME !== 'undefined' && LOCATION_NAME) ? LOCATION_NAME : 'the Emerald Coast';
  var cfg       = window.LMU_PAGE || {};
  var preselect = cfg.preselect || '';

  /* ── 2. STYLES ──────────────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');",
    /* tokens */
    ':root{--flame:#C8562A;--ember:#A83E18;--sunset:#E08050;--golden:#D4A84B;--sand:#F2E8D5;--cream:#FAF5EC;--warm-white:#FFFDF8;--blush:#E8B89A;--ocean:#5A96A8;--dusk:#28303A;--text-dark:#1C2228;--text-mid:#48545E;--text-light:#8A9098;--white:#FFFFFF;--font-display:\'Cormorant Garamond\',serif;--font-body:\'Jost\',sans-serif;--radius-sm:6px;--radius-md:12px;--radius-lg:24px;--radius-pill:999px;--shadow-soft:0 6px 32px rgba(28,34,40,0.10);--shadow-warm:0 4px 24px rgba(200,86,42,0.18);--transition:0.30s cubic-bezier(0.4,0,0.2,1);}',
    '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}',
    'html{scroll-behavior:smooth;}',
    'body{font-family:var(--font-body);background:var(--cream);color:var(--text-dark);line-height:1.72;overflow-x:hidden;}',
    'a{text-decoration:none;color:inherit;}ul{list-style:none;}img{max-width:100%;display:block;}button,input,select,textarea{font-family:inherit;}',
    '.container{max-width:1160px;margin:0 auto;padding:0 28px;}',
    /* buttons */
    '.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 32px;border-radius:var(--radius-pill);font-family:var(--font-body);font-weight:500;font-size:0.84rem;letter-spacing:0.09em;text-transform:uppercase;cursor:pointer;transition:var(--transition);border:none;}',
    '.btn-primary{background:var(--flame);color:var(--white);box-shadow:var(--shadow-warm);}.btn-primary:hover{background:var(--ember);transform:translateY(-2px);box-shadow:0 8px 32px rgba(200,86,42,0.32);}',
    '.btn-outline{background:transparent;color:var(--flame);border:1.5px solid var(--flame);}.btn-outline:hover{background:var(--flame);color:var(--white);transform:translateY(-2px);}',
    '.btn-ghost{background:rgba(255,255,255,0.14);color:var(--white);border:1.5px solid rgba(255,255,255,0.46);backdrop-filter:blur(8px);}.btn-ghost:hover{background:var(--white);color:var(--flame);}',
    '.btn-white{background:var(--white);color:var(--flame);font-weight:600;}.btn-white:hover{background:var(--sand);transform:translateY(-2px);}',
    '.btn-outline-white{background:transparent;color:var(--white);border:1.5px solid rgba(255,255,255,0.52);}.btn-outline-white:hover{background:rgba(255,255,255,0.12);border-color:var(--white);}',
    /* typography helpers */
    '.section-label{font-family:var(--font-body);font-size:0.72rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:var(--flame);display:block;margin-bottom:10px;}',
    '.section-title{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,3rem);font-weight:400;line-height:1.14;color:var(--text-dark);}.section-title em{font-style:italic;color:var(--flame);}',
    '.section-subtitle{font-size:0.97rem;color:var(--text-mid);max-width:520px;margin-top:13px;font-weight:300;}',
    /* burn ban */
    '.burn-ban-bar{background:#7a2818;color:#fff;font-size:0.80rem;font-weight:500;letter-spacing:0.04em;padding:10px 20px;display:none;align-items:center;justify-content:center;gap:10px;position:relative;z-index:1100;}',
    '.burn-ban-bar.active{display:flex;}.burn-ban-bar .burn-ban-text{line-height:1.4;text-align:center;}',
    '.burn-ban-bar .burn-ban-close{background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.1rem;padding:2px 6px;margin-left:4px;flex-shrink:0;transition:color 0.2s;line-height:1;}.burn-ban-bar .burn-ban-close:hover{color:#fff;}',
    /* logo banner */
    '.logo-banner{background:var(--warm-white);display:flex;align-items:center;gap:18px;padding:11px 28px;border-bottom:1px solid rgba(200,86,42,0.13);}',
    '.logo-banner img.logo-img{height:58px;width:auto;margin:0;display:block;object-fit:contain;flex-shrink:0;}',
    '.logo-banner-text{text-align:left;}.logo-banner .logo-fallback{font-family:var(--font-display);font-size:clamp(1.05rem,2.5vw,1.55rem);font-weight:400;color:var(--text-dark);}.logo-banner .logo-fallback span{color:var(--flame);font-style:italic;}',
    '.logo-banner .logo-tagline{font-family:var(--font-display);font-style:italic;font-size:0.88rem;color:var(--text-mid);margin-top:1px;}.logo-banner .logo-est{font-size:0.60rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--text-light);margin-top:2px;}',
    '@media(max-width:768px){.logo-banner{flex-direction:column;align-items:center;text-align:center;padding:22px 28px 16px;gap:6px;}.logo-banner img.logo-img{height:80px;}.logo-banner-text{text-align:center;}.logo-banner .logo-fallback{font-size:clamp(1.3rem,4vw,1.8rem);}.logo-banner .logo-tagline,.logo-banner .logo-est{display:block;}}',
    /* popup */
    '.lg-overlay{position:fixed;inset:0;background:rgba(28,34,40,0.60);z-index:9000;display:none;align-items:center;justify-content:center;padding:20px;}.lg-overlay.open{display:flex;}',
    '.lg-modal{background:var(--warm-white);border-radius:var(--radius-lg);box-shadow:0 24px 80px rgba(28,34,40,0.32);max-width:500px;width:100%;position:relative;max-height:90vh;overflow-y:auto;}',
    '.lg-modal-img{width:100%;height:180px;object-fit:cover;display:block;border-radius:var(--radius-lg) var(--radius-lg) 0 0;}.lg-modal-body{padding:26px 28px 30px;}',
    '.hs-form-frame{min-height:140px;}',
    '.lg-caption{font-size:0.72rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--ocean);margin-bottom:9px;}',
    '.lg-modal-title{font-family:var(--font-display);font-size:1.55rem;font-weight:400;color:var(--text-dark);line-height:1.2;margin-bottom:9px;}',
    '.lg-modal-sub{font-size:0.88rem;color:var(--text-mid);margin-bottom:20px;line-height:1.65;font-weight:300;}',
    '.lg-form{display:flex;gap:10px;flex-wrap:wrap;}.lg-form input[type="email"]{flex:1;min-width:0;padding:12px 16px;border:1.5px solid #DDD5C5;border-radius:var(--radius-md);font-size:0.93rem;color:var(--text-dark);background:var(--cream);font-family:inherit;transition:border-color 0.2s;}.lg-form input[type="email"]:focus{outline:none;border-color:var(--flame);box-shadow:0 0 0 3px rgba(200,86,42,0.11);}',
    '.lg-close{position:absolute;top:10px;right:12px;background:rgba(28,34,40,0.45);border:none;color:#fff;width:28px;height:28px;border-radius:50%;font-size:0.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;z-index:2;}.lg-close:hover{background:rgba(28,34,40,0.72);}',
    '.lg-success{display:none;text-align:center;padding:16px 0 6px;}.lg-success.show{display:block;}.lg-form-wrap.hide{display:none;}',
    '@media(max-width:480px){.lg-form{flex-direction:column;}.lg-modal-img{height:160px;}}',
    /* header */
    '.site-header{position:sticky;top:0;z-index:1000;background:rgba(250,245,236,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(200,86,42,0.13);transition:box-shadow var(--transition);}',
    '.site-header.scrolled{box-shadow:0 3px 24px rgba(28,34,40,0.10);}',
    '.header-inner{display:flex;align-items:center;justify-content:space-between;padding:13px 28px;max-width:1280px;margin:0 auto;gap:16px;}',
    '.header-nav{display:flex;align-items:center;gap:4px;flex-wrap:wrap;justify-content:center;flex:1;}.header-nav a{font-size:0.80rem;font-weight:500;letter-spacing:0.06em;color:var(--text-mid);padding:7px 12px;border-radius:var(--radius-pill);transition:var(--transition);white-space:nowrap;}.header-nav a:hover{color:var(--flame);background:rgba(200,86,42,0.07);}',
    '.header-actions{flex-shrink:0;}',
    '.nav-toggle{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;border:none;background:transparent;}.nav-toggle span{display:block;width:24px;height:2px;background:var(--text-dark);border-radius:2px;transition:var(--transition);}',
    '.mobile-nav{display:none;flex-direction:column;background:var(--warm-white);border-top:1px solid rgba(200,86,42,0.10);padding:14px 28px 18px;gap:4px;}.mobile-nav.open{display:flex;}',
    '.mobile-nav a{font-size:0.9rem;font-weight:500;color:var(--text-mid);padding:10px 0;border-bottom:1px solid rgba(200,86,42,0.07);transition:color var(--transition);}.mobile-nav a:hover{color:var(--flame);}.mobile-nav .btn{margin-top:12px;justify-content:center;width:100%;}',
    '.nav-item{position:relative;display:inline-block;}.nav-dropdown{display:none;position:absolute;top:100%;left:0;background:var(--warm-white);border:1px solid rgba(200,86,42,0.13);border-radius:var(--radius-md);box-shadow:var(--shadow-soft);min-width:160px;z-index:1100;padding:6px 0;}.nav-item:hover .nav-dropdown{display:block;}.nav-dropdown a{display:block;padding:9px 16px;font-size:0.80rem;font-weight:500;color:var(--text-mid);white-space:nowrap;}.nav-dropdown a:hover{color:var(--flame);background:rgba(200,86,42,0.05);}',
    /* hero */
    '.hero{position:relative;min-height:92vh;display:flex;align-items:center;justify-content:center;overflow:hidden;}',
    '.hero-bg{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(28,34,40,0.18) 0%,rgba(28,34,40,0.52) 55%,rgba(28,34,40,0.80) 100%),url(\'website-images/HomeLandingHero.webp\') center/cover no-repeat;z-index:0;}',
    '.hero-bg::after{content:\'\';position:absolute;inset:0;background:linear-gradient(145deg,rgba(200,86,42,0.14) 0%,transparent 55%);}',
    '.hero-content{position:relative;z-index:1;text-align:center;padding:60px 28px;max-width:860px;}',
    '.hero-eyebrow{font-family:var(--font-body);font-size:0.72rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--golden);display:block;margin-bottom:20px;opacity:0;animation:fadeUp 0.8s 0.2s forwards;}',
    '.hero-title{font-family:var(--font-display);font-size:clamp(2.4rem,6.5vw,5.2rem);font-weight:300;color:var(--white);line-height:1.08;margin-bottom:26px;opacity:0;animation:fadeUp 0.9s 0.38s forwards;}.hero-title em{font-style:italic;color:var(--golden);}',
    '.hero-sub{font-size:1.02rem;color:rgba(255,255,255,0.82);font-weight:300;margin-bottom:42px;max-width:640px;margin-left:auto;margin-right:auto;opacity:0;animation:fadeUp 0.9s 0.55s forwards;}',
    '.hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;opacity:0;animation:fadeUp 0.9s 0.72s forwards;}',
    '.hero-scroll-hint{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:2;display:flex;flex-direction:column;align-items:center;gap:5px;color:rgba(255,255,255,0.44);font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;animation:bounce 2.2s infinite;}',
    '@keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(8px);}}',
    /* social proof bar */
    '.spb{background:var(--text-dark);padding:72px 0;text-align:center;}',
    '.spb-trusted{font-size:0.74rem;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:18px;}',
    '.spb-stat{font-family:var(--font-display);font-size:clamp(2.6rem,5.5vw,4.2rem);font-weight:300;color:var(--golden);line-height:1.1;margin-bottom:48px;}',
    '.spb-stat span{font-style:italic;}',
    '.spb-quotes{display:grid;grid-template-columns:1fr 1fr;gap:22px;max-width:880px;margin:0 auto 48px;}',
    '.spb-quote{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:var(--radius-md);padding:26px 24px;font-family:var(--font-display);font-style:italic;font-size:1.06rem;color:rgba(255,255,255,0.84);line-height:1.62;text-align:left;}',
    '.spb-quote cite{display:block;font-style:normal;font-size:0.70rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--golden);margin-top:14px;}',
    '.spb-logos-ph{border:1px dashed rgba(255,255,255,0.14);border-radius:var(--radius-md);padding:26px;max-width:740px;margin:0 auto 22px;font-size:0.73rem;color:rgba(255,255,255,0.24);letter-spacing:0.10em;min-height:76px;display:flex;align-items:center;justify-content:center;gap:10px;}',
    '.spb-badges-ph{border:1px dashed rgba(255,255,255,0.14);border-radius:var(--radius-md);padding:18px 26px;max-width:380px;margin:0 auto;font-size:0.73rem;color:rgba(255,255,255,0.24);letter-spacing:0.10em;min-height:58px;display:flex;align-items:center;justify-content:center;gap:10px;}',
    /* services */
    '.services-section{padding:104px 0;background:var(--cream);}',
    '.services-header{text-align:center;margin-bottom:58px;}',
    '.svc-list{list-style:none;max-width:860px;margin:0 auto 44px;display:grid;grid-template-columns:1fr 1fr;gap:20px 52px;}',
    '.svc-item{font-size:0.86rem;color:var(--text-mid);line-height:1.70;padding-left:16px;border-left:2px solid var(--flame);}',
    '.svc-item strong{display:block;font-size:0.90rem;font-weight:600;color:var(--text-dark);margin-bottom:5px;}',
    '.services-cta{text-align:center;}',
    /* why us */
    '.why-us-section{padding:72px 0;background:var(--sand);}',
    '.why-us-header{text-align:center;margin-bottom:44px;}',
    '.feat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:0;}',
    '.feat-card{background:var(--warm-white);border-radius:var(--radius-md);padding:22px 20px;text-align:left;box-shadow:var(--shadow-soft);transition:var(--transition);}',
    '.feat-card:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(28,34,40,0.10);}',
    '.feat-name{font-weight:600;font-size:0.88rem;color:var(--text-dark);margin-bottom:7px;letter-spacing:0.02em;}',
    '.feat-desc{font-size:0.80rem;color:var(--text-mid);line-height:1.68;font-weight:300;}',
    '.trust-bullets{display:flex;justify-content:center;gap:36px;flex-wrap:wrap;margin-top:52px;padding-top:40px;border-top:1px solid rgba(200,86,42,0.12);}',
    '.trust-bullets li{font-size:0.86rem;color:var(--text-mid);display:flex;align-items:center;gap:9px;font-weight:500;}',
    '.trust-bullets li::before{content:\'✓\';color:var(--flame);font-weight:700;flex-shrink:0;}',
    /* testimonials */
    '.testimonials-section{padding:104px 0;background:var(--warm-white);border-top:1px solid rgba(200,86,42,0.09);}',
    '.testi-header{text-align:center;margin-bottom:58px;}',
    '.testi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}',
    '.testi-card{background:var(--cream);border:1.5px solid rgba(200,86,42,0.11);border-radius:var(--radius-lg);padding:32px 26px;display:flex;flex-direction:column;transition:var(--transition);}',
    '.testi-card:hover{border-color:var(--flame);transform:translateY(-4px);box-shadow:var(--shadow-warm);}',
    '.testi-stars{color:var(--golden);font-size:0.90rem;letter-spacing:3px;margin-bottom:16px;}',
    '.testi-pull{font-family:var(--font-display);font-size:1.12rem;font-style:italic;color:var(--flame);margin-bottom:14px;line-height:1.4;}',
    '.testi-quote{font-size:0.84rem;color:var(--text-mid);line-height:1.74;font-weight:300;flex:1;}',
    '.testi-reviewer{display:flex;align-items:center;gap:12px;margin-top:24px;}',
    '.testi-avatar{width:40px;height:40px;border-radius:50%;background:var(--sand);border:2px solid rgba(200,86,42,0.18);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.1rem;font-style:italic;color:var(--flame);flex-shrink:0;}',
    '.testi-name{font-size:0.74rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-dark);}',
    '.testi-src{font-size:0.68rem;color:var(--text-light);margin-top:2px;}',
    /* how it works */
    '.hiw-section{padding:104px 0;background:var(--cream);}',
    '.hiw-header{text-align:center;margin-bottom:66px;}',
    '.hiw-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:44px;max-width:960px;margin:0 auto;}',
    '.hiw-step{text-align:center;}',
    '.hiw-num{width:68px;height:68px;border-radius:50%;background:var(--flame);color:var(--white);font-family:var(--font-display);font-size:1.9rem;font-weight:300;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:var(--shadow-warm);}',
    '.hiw-step-title{font-family:var(--font-display);font-size:1.22rem;font-weight:400;font-style:italic;color:var(--text-dark);margin-bottom:11px;}',
    '.hiw-step-desc{font-size:0.84rem;color:var(--text-mid);line-height:1.72;font-weight:300;}',
    '.hiw-closing{text-align:center;margin-top:60px;font-family:var(--font-display);font-style:italic;font-size:1.28rem;color:var(--text-mid);}',
    /* faq */
    '.faq-section{padding:88px 0;background:var(--sand);}.faq-inner{max-width:740px;margin:0 auto;}',
    'details.faq-item{background:var(--warm-white);border-radius:var(--radius-md);padding:20px 22px;border:1px solid rgba(200,86,42,0.11);cursor:pointer;margin-bottom:13px;}',
    'details.faq-item summary{font-weight:600;color:var(--text-dark);font-size:0.92rem;list-style:none;display:flex;justify-content:space-between;align-items:center;}',
    'details.faq-item summary .plus{color:var(--flame);font-size:1.2rem;margin-left:12px;flex-shrink:0;}',
    'details.faq-item p{margin-top:13px;color:var(--text-mid);font-size:0.88rem;font-weight:300;line-height:1.72;}',
    /* final cta */
    '.cta-section{padding:116px 0;text-align:center;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--flame) 0%,var(--ember) 45%,#923218 100%);}',
    '.cta-section::before{content:\'\';position:absolute;inset:0;background:url(\'website-images/HomeLandingHero.webp\') center/cover;opacity:0.07;}',
    '.cta-content{position:relative;z-index:1;}.cta-section .section-label{color:var(--golden);}',
    '.cta-title{font-family:var(--font-display);font-size:clamp(2.1rem,5vw,3.8rem);font-weight:300;color:var(--white);line-height:1.1;margin-bottom:18px;}.cta-title em{font-style:italic;}',
    '.cta-sub{font-size:0.97rem;color:rgba(255,255,255,0.78);font-weight:300;max-width:500px;margin:0 auto 16px;}',
    '.cta-urgency{font-size:0.80rem;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:rgba(255,255,255,0.52);margin-bottom:40px;}',
    '.cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}',
    /* booking + contact */
    '.booking-section{background:var(--sand);padding:88px 0;position:relative;}.booking-section::before{content:\'\';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--golden),var(--flame),var(--blush),var(--ocean));}',
    '.booking-section-header{text-align:center;margin-bottom:52px;}',
    '.booking-wrapper{max-width:700px;margin:0 auto;padding:0 28px;}',
    '.booking-card{background:var(--warm-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);overflow:hidden;}',
    '.progress-bar-wrap{background:var(--sand);padding:26px 34px 0;}.progress-steps{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}',
    '.progress-step{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;position:relative;}',
    '.progress-step:not(:last-child)::after{content:\'\';position:absolute;top:17px;left:55%;width:90%;height:2px;background:#ddd;z-index:0;transition:background var(--transition);}.progress-step.completed:not(:last-child)::after{background:var(--flame);}',
    '.step-dot{width:34px;height:34px;border-radius:50%;background:var(--sand);border:2px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:600;color:var(--text-light);transition:var(--transition);z-index:1;position:relative;}',
    '.progress-step.active .step-dot{background:var(--flame);border-color:var(--flame);color:var(--white);box-shadow:0 0 0 5px rgba(200,86,42,0.16);}.progress-step.completed .step-dot{background:var(--ember);border-color:var(--ember);color:var(--white);}',
    '.step-label{font-size:0.65rem;letter-spacing:0.10em;text-transform:uppercase;color:var(--text-light);font-weight:500;}.progress-step.active .step-label{color:var(--flame);font-weight:600;}.progress-step.completed .step-label{color:var(--ember);}',
    '.form-content{padding:34px 34px 38px;}.form-step{display:none;}.form-step.active{display:block;}',
    '.form-step-title{font-family:var(--font-display);font-size:1.55rem;font-weight:400;color:var(--text-dark);margin-bottom:5px;}.form-step-desc{font-size:0.86rem;color:var(--text-light);margin-bottom:26px;}',
    '.form-group{margin-bottom:20px;}.form-group label{display:block;font-size:0.76rem;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--text-mid);margin-bottom:7px;}.form-group label .req{color:var(--flame);margin-left:2px;}',
    '.form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 16px;border:1.5px solid #DDD5C5;border-radius:var(--radius-md);font-size:0.94rem;color:var(--text-dark);background:var(--cream);transition:border-color var(--transition),box-shadow var(--transition);appearance:none;}',
    '.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:var(--flame);box-shadow:0 0 0 3px rgba(200,86,42,0.11);background:var(--white);}',
    '.form-group select{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M6 9l6 6 6-6\' stroke=\'%238A9098\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;cursor:pointer;}',
    '.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}',
    '.sub-package-wrap{display:none;margin-bottom:20px;}.sub-package-wrap.visible{display:block;}.sub-label{font-size:0.76rem;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--text-mid);margin-bottom:9px;}',
    '.sub-packages{display:flex;flex-direction:column;gap:9px;}',
    '.sub-pkg{border:1.5px solid #DDD5C5;border-radius:var(--radius-md);padding:14px 18px;cursor:pointer;transition:var(--transition);background:var(--cream);display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}.sub-pkg:hover{border-color:var(--sunset);background:var(--warm-white);}.sub-pkg.selected{border-color:var(--flame);background:rgba(200,86,42,0.05);box-shadow:0 0 0 3px rgba(200,86,42,0.12);}.sub-pkg input[type="radio"]{display:none;}',
    '.sub-pkg-name{font-family:var(--font-display);font-size:1.02rem;font-weight:400;color:var(--text-dark);margin-bottom:4px;font-style:italic;}.sub-pkg-details{font-size:0.75rem;color:var(--text-mid);line-height:1.55;}.sub-pkg-price{font-family:var(--font-display);font-size:1.25rem;font-weight:600;color:var(--flame);white-space:nowrap;flex-shrink:0;margin-top:2px;}',
    '.checkbox-group{display:flex;align-items:flex-start;gap:11px;margin-bottom:15px;}.checkbox-group input[type="checkbox"]{width:19px;height:19px;flex-shrink:0;accent-color:var(--flame);margin-top:2px;cursor:pointer;}.checkbox-group label{font-size:0.87rem;color:var(--text-mid);cursor:pointer;text-transform:none;letter-spacing:0;font-weight:400;}.checkbox-group label a{color:var(--flame);text-decoration:underline;}',
    '.form-nav{display:flex;justify-content:space-between;align-items:center;margin-top:30px;gap:11px;}.form-nav .btn{min-width:136px;justify-content:center;}.btn-back{background:transparent;color:var(--text-mid);border:1.5px solid #ccc;}.btn-back:hover{background:var(--sand);border-color:#aaa;transform:none;}',
    '.success-message{text-align:center;padding:48px 28px;display:none;}.success-message.show{display:block;}.success-message h3{font-family:var(--font-display);font-size:2rem;font-weight:400;color:var(--text-dark);margin-bottom:10px;}.success-message p{color:var(--text-mid);}',
    '.form-notice{background:rgba(200,86,42,0.05);border:1px solid rgba(200,86,42,0.16);border-radius:var(--radius-md);padding:16px 18px;font-size:0.83rem;color:var(--text-mid);margin:20px 0;line-height:1.65;}.form-notice strong{color:var(--text-dark);}',
    '.location-suggest{font-size:0.80rem;color:var(--flame);background:rgba(74,125,156,0.07);border:1px solid rgba(74,125,156,0.20);border-radius:var(--radius-sm);padding:9px 14px;margin-top:6px;display:none;}.location-suggest.visible{display:block;}',
    '.addons-checklist{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}',
    '.addon-check-item{display:flex;align-items:center;gap:10px;padding:7px 15px;border:1.5px solid #DDD5C5;border-radius:var(--radius-md);cursor:pointer;background:var(--cream);transition:var(--transition);user-select:none;}.addon-check-item:hover{background:var(--warm-white);border-color:rgba(74,125,156,0.28);}.addon-check-item.checked{border-color:var(--flame);background:rgba(74,125,156,0.06);box-shadow:0 0 0 2px rgba(74,125,156,0.12);}',
    '.addon-check-item input[type="checkbox"]{width:16px;height:16px;accent-color:var(--flame);flex-shrink:0;cursor:pointer;pointer-events:none;}.addon-check-name{font-size:0.96rem;font-weight:500;color:var(--text-dark);flex:1;}.addon-check-note{font-size:0.74rem;color:var(--text-light);}.addon-check-price{display:none!important;}',
    '.pkg-hidden{display:none!important;}.pkg-filter-note{font-size:0.80rem;color:var(--text-light);background:#edf6f9;border:1px solid rgba(74,125,156,0.18);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;line-height:1.6;display:none;}.pkg-filter-note.visible{display:block;}',
    '.addon-hint{font-size:0.78rem;color:var(--text-light);margin-bottom:10px;margin-top:-4px;}',
    /* contact sidebar */
    '.contact-card{background:var(--warm-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);padding:36px 28px;position:sticky;top:88px;}',
    '.contact-card h3{font-family:var(--font-display);font-size:1.45rem;font-weight:400;color:var(--text-dark);margin-bottom:24px;}',
    '.contact-item{display:flex;align-items:flex-start;gap:14px;margin-bottom:22px;}',
    '.contact-icon{width:40px;height:40px;border-radius:var(--radius-sm);background:rgba(200,86,42,0.09);display:flex;align-items:center;justify-content:center;color:var(--flame);flex-shrink:0;font-size:1rem;}',
    '.contact-item-text{font-size:0.87rem;color:var(--text-mid);line-height:1.6;}',
    '.contact-item-text strong{display:block;font-size:0.68rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-light);margin-bottom:3px;}',
    '.contact-social{display:flex;gap:10px;margin-top:28px;}',
    '.contact-social-link{width:42px;height:42px;border-radius:var(--radius-sm);background:rgba(200,86,42,0.09);display:flex;align-items:center;justify-content:center;color:var(--flame);transition:var(--transition);}.contact-social-link:hover{background:var(--flame);color:var(--white);transform:translateY(-2px);}',
    /* footer */
    '.site-footer{background:var(--text-dark);padding:68px 0 34px;}',
    '.footer-top{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:56px;padding-bottom:44px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:32px;}',
    '.footer-brand .brand-name{font-family:var(--font-display);font-size:1.45rem;font-weight:400;color:var(--white);margin-bottom:3px;}.footer-brand .brand-name span{color:var(--golden);font-style:italic;}',
    '.footer-brand .tagline{font-size:0.70rem;letter-spacing:0.20em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:18px;}.footer-brand p{font-size:0.86rem;color:rgba(255,255,255,0.46);line-height:1.72;margin-bottom:22px;font-weight:300;}',
    '.footer-actions{display:flex;gap:10px;flex-wrap:wrap;}',
    '.footer-col h4{font-size:0.70rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.36);margin-bottom:16px;}.footer-col ul li{margin-bottom:9px;}.footer-col ul li a{font-size:0.86rem;color:rgba(255,255,255,0.58);transition:color var(--transition);}.footer-col ul li a:hover{color:var(--golden);}',
    '.social-links{display:flex;gap:9px;margin-top:6px;}.social-link{width:38px;height:38px;border-radius:var(--radius-sm);background:rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.52);font-size:1rem;transition:var(--transition);}.social-link:hover{background:var(--flame);color:var(--white);transform:translateY(-2px);}',
    '.footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}.footer-bottom p{font-size:0.76rem;color:rgba(255,255,255,0.26);}',
    /* responsive */
    '@media(max-width:1024px){.footer-top{grid-template-columns:1fr 1fr;}.footer-top>div:first-child{grid-column:1/-1;}}',
    '@media(max-width:768px){.header-nav,.header-actions{display:none;}.nav-toggle{display:flex;}.spb-quotes{grid-template-columns:1fr;}.hiw-steps{grid-template-columns:1fr;gap:32px;}.trust-bullets{gap:20px;flex-direction:column;align-items:center;text-align:center;}.footer-top{grid-template-columns:1fr;gap:32px;}.footer-bottom{flex-direction:column;text-align:center;}.form-content{padding:22px 18px 26px;}.progress-bar-wrap{padding:18px 18px 0;}.form-row{grid-template-columns:1fr;}.booking-contact-wrap{padding:0 18px;}}',
    '@media(max-width:600px){.svc-grid{grid-template-columns:1fr;}.feat-grid{grid-template-columns:1fr;}.testi-grid{grid-template-columns:1fr;}}',
    '@media(max-width:480px){.hero-actions,.cta-actions{flex-direction:column;align-items:center;}.form-nav{flex-direction:column;}.form-nav .btn{width:100%;}}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── 3. LOCATION DROPDOWN ───────────────────────────────────────────────── */
  function makeOption(val, selected) {
    return '<option' + (selected === val ? ' selected' : '') + '>' + val + '</option>';
  }
  var locationDropdown = [
    '<optgroup label="30A Corridor">',
    makeOption('Seaside, FL', preselect),
    makeOption('Rosemary Beach, FL', preselect),
    makeOption('Alys Beach, FL', preselect),
    makeOption('WaterColor, FL', preselect),
    makeOption('Grayton Beach, FL', preselect),
    makeOption('Blue Mountain Beach, FL', preselect),
    makeOption('Santa Rosa Beach, FL', preselect),
    makeOption('Seagrove Beach, FL', preselect),
    makeOption('Seacrest Beach, FL', preselect),
    makeOption('Inlet Beach, FL', preselect),
    makeOption('Carillon Beach, FL', preselect),
    makeOption('Gulf Place, FL', preselect),
    makeOption('Watersound, FL', preselect),
    '</optgroup>',
    '<optgroup label="Walton County">',
    makeOption('Miramar Beach, FL', preselect),
    makeOption('Dune Allen Beach, FL', preselect),
    makeOption('Sandestin, FL', preselect),
    makeOption('Baytowne Wharf, FL', preselect),
    makeOption('Topsail Hill, FL', preselect),
    makeOption('Point Washington, FL', preselect),
    makeOption('Sunnyside, FL', preselect),
    makeOption('Laguna Beach, FL', preselect),
    makeOption('Bahama Beach, FL', preselect),
    makeOption('South Walton, FL', preselect),
    makeOption('30A, FL', preselect),
    '</optgroup>',
    '<optgroup label="Destin Area">',
    makeOption('Destin, FL', preselect),
    '</optgroup>',
    '<optgroup label="Bay County">',
    makeOption('Panama City Beach, FL', preselect),
    makeOption('Mexico Beach, FL', preselect),
    '</optgroup>',
    '<optgroup label="Gulf County">',
    makeOption('Port Saint Joe, FL', preselect),
    makeOption('Saint Joe Beach, FL', preselect),
    makeOption('Cape San Blas, FL', preselect),
    '</optgroup>'
  ].join('');

  /* ── 4. RENDER PAGE ─────────────────────────────────────────────────────── */
  var root = document.getElementById('lmu-page-root');
  if (!root) return;

  root.innerHTML = [
    /* burn ban */
    '<div class="burn-ban-bar" id="burn-ban-bar" role="alert">',
      '<span class="burn-ban-text" id="burn-ban-text"></span>',
      '<button class="burn-ban-close" onclick="document.getElementById(\'burn-ban-bar\').style.display=\'none\'" aria-label="Dismiss">&#10005;</button>',
    '</div>',
    /* logo banner */
    '<div class="logo-banner">',
      '<img class="logo-img" src="lmu-logo.webp" alt="Light Me Up Beach Bonfires" onerror="this.style.display=\'none\';document.getElementById(\'logo-fallback\').style.display=\'block\';"/>',
      '<div class="logo-banner-text">',
        '<div class="logo-fallback" id="logo-fallback">Light Me <span>Up</span> Beach Bonfires</div>',
        '<div class="logo-tagline">&ldquo;Let us light up your night!&rdquo;</div>',
        '<div class="logo-est">Est. 2015</div>',
      '</div>',
    '</div>',
    /* header */
    '<header class="site-header" id="site-header">',
      '<div class="header-inner">',
        '<nav class="header-nav">',
          '<span class="nav-item"><a href="beach-bonfire.html">Beach Bonfires</a><div class="nav-dropdown"><a href="social-fires.html">Social Fires</a></div></span>',
          '<a href="beach-picnics.html">Beach Picnics</a>',
          '<a href="beach-chairs.html">Beach Chairs &amp; Umbrellas</a>',
          '<a href="event-planning.html">Event Planning</a>',
          '<a href="faq.html">FAQ</a>',
        '</nav>',
        '<div class="header-actions"><a href="#booking" class="btn btn-primary">Book Now</a></div>',
        '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>',
      '</div>',
      '<nav class="mobile-nav" id="mobile-nav">',
        '<a href="beach-bonfire.html">Beach Bonfires</a>',
        '<a href="social-fires.html" style="padding-left:22px;font-size:0.83rem;color:var(--text-light);">&#8627; Social Fires</a>',
        '<a href="beach-picnics.html">Beach Picnics</a>',
        '<a href="beach-chairs.html">Beach Chairs &amp; Umbrellas</a>',
        '<a href="event-planning.html">Event Planning</a>',
        '<a href="faq.html">FAQ</a>',
        '<a href="#booking" class="btn btn-primary">Book Now</a>',
      '</nav>',
    '</header>',

    /* ── SECTION 1: HERO ── */
    '<section class="hero">',
      '<div class="hero-bg"></div>',
      '<div class="hero-content">',
        '<span class="hero-eyebrow">Panama City Beach &middot; Walton County &middot; 30A</span>',
        '<h1 class="hero-title">Beach Bonfires in <em><span data-location=""></span></em> That Feel Effortless From Start to Finish.</h1>',
        '<p class="hero-sub">Slow down. Breathe in the salt air. Let us handle every detail so you can just show up, settle in, and enjoy the night.</p>',
        '<div class="hero-actions">',
          '<a href="#booking" class="btn btn-primary">Book Your Beach Bonfire</a>',
          '<a href="#booking" class="btn btn-ghost">Check Availability</a>',
        '</div>',
      '</div>',
      '<div class="hero-scroll-hint"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Scroll</div>',
    '</section>',

    /* ── SECTION 2: SOCIAL PROOF BAR ── */
    '<section class="spb">',
      '<div class="container">',
        '<p class="spb-trusted">Trusted by Vacationers and Families Visiting <span data-location=""></span></p>',
        '<p class="spb-stat"><span>1,400+</span> Beach Bonfires Last Year</p>',
        '<div class="spb-quotes">',
          '<blockquote class="spb-quote">',
            '&ldquo;Hands down the best beach experience we&rsquo;ve had in <span data-location=""></span>. Everything was perfect from start to finish &mdash; the setup, the fire, the team. I couldn&rsquo;t believe how easy it was.&rdquo;',
            '<cite>&mdash; Sarah M., Verified Guest</cite>',
          '</blockquote>',
          '<blockquote class="spb-quote">',
            '&ldquo;We weren&rsquo;t sure what to expect, but our night in <span data-location=""></span> was absolutely worth every penny. They handled everything so we could just enjoy the moment. Already planning our next one.&rdquo;',
            '<cite>&mdash; Chris R., Verified Guest</cite>',
          '</blockquote>',
        '</div>',
      '</div>',
    '</section>',

    /* ── SECTION 3: SERVICES ── */
    '<section class="services-section" id="services">',
      '<div class="container">',
        '<div class="services-header">',
          '<span class="section-label">What We Offer</span>',
          '<h2 class="section-title">Beach Experiences Available in <span data-location=""></span></h2>',
          '<p class="section-subtitle" style="margin:13px auto 0;text-align:center;">From bonfires to picnics to full event setups &mdash; we handle everything so you can focus on making memories.</p>',
        '</div>',
        '<ul class="svc-list">',
          '<li class="svc-item"><strong>Beach Bonfires</strong> &mdash; Full setup and teardown, s\'mores, tiki torches, chairs, speaker, and beach permit. You bring nothing.</li>',
          '<li class="svc-item"><strong>Sunset Picnics</strong> &mdash; Beautifully styled beach picnics with place settings, low tables, and decor. Perfect for couples, families, or celebrations.</li>',
          '<li class="svc-item"><strong>Chair &amp; Umbrella Rentals</strong> &mdash; Skip the hassle. We set up your chairs and umbrellas before you arrive and take them down when you\'re done.</li>',
          '<li class="svc-item"><strong>Weddings &amp; Special Events</strong> &mdash; Proposals, anniversaries, rehearsal dinners, corporate beach events. Custom quotes available.</li>',
        '</ul>',
        '<div class="services-cta"><a href="beach-bonfire.html" class="btn btn-primary">Explore Packages</a></div>',
      '</div>',
    '</section>',

    /* ── SECTION 4: WHY CHOOSE US ── */
    '<section class="why-us-section" id="why-us">',
      '<div class="container">',
        '<div class="why-us-header">',
          '<span class="section-label">Why Light Me Up</span>',
          '<h2 class="section-title">Why Visitors Choose Light Me Up Beach Bonfires in <span data-location=""></span></h2>',
        '</div>',
        '<div class="feat-grid">',
          '<div class="feat-card">',
            '<div class="feat-name">Fully Done-for-You</div>',
            '<p class="feat-desc">From permits to teardown, we handle every single detail. You bring nothing, stress about nothing, and enjoy everything.</p>',
          '</div>',
          '<div class="feat-card">',
            '<div class="feat-name">Fast Communication</div>',
            '<p class="feat-desc">Quick responses and transparent booking from start to finish. No waiting around, no confusion, no back-and-forth.</p>',
          '</div>',
          '<div class="feat-card">',
            '<div class="feat-name">Experienced Local Team</div>',
            '<p class="feat-desc">10+ years on this beach. We know every access point, every permit requirement, and every sunset angle worth having.</p>',
          '</div>',
          '<div class="feat-card">',
            '<div class="feat-name">Reliable &amp; Professional</div>',
            '<p class="feat-desc">Licensed, insured, and consistently rated 5 stars. We show up when we say we will and leave the beach cleaner than we found it.</p>',
          '</div>',
        '</div>',
      '</div>',
    '</section>',

    /* ── SECTION 5: TESTIMONIALS ── */
    '<section class="testimonials-section" id="testimonials">',
      '<div class="container">',
        '<div class="testi-header">',
          '<span class="section-label">Guest Stories</span>',
          '<h2 class="section-title">What Guests Say About <em>Their Beach Night</em></h2>',
        '</div>',
        '<div class="testi-grid">',
          /* Denyse Russo */
          '<div class="testi-card">',
            '<div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
            '<p class="testi-pull">&ldquo;They totally blew me away!&rdquo;</p>',
            '<p class="testi-quote">We had a beach bonfire as a special &lsquo;last night&rsquo; of our family vacation. Light Me Up made it so easy and fun! Everything from the booking to the day of the bonfire was met with ease and great communication. The guys who set up and maintained our fire were awesome! Cash &amp; Channing made the site so zen like! They were friendly, very polite and efficient! I&rsquo;d seen beach bonfires on previous trips and was so excited for our own! They totally blew me away! Highly recommend Light Me Up for very special memory making!</p>',
            '<div class="testi-reviewer"><div class="testi-avatar">D</div><div><div class="testi-name">Denyse Russo</div><div class="testi-src">&#9733; Google Review</div></div></div>',
          '</div>',
          /* Clay McCann */
          '<div class="testi-card">',
            '<div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
            '<p class="testi-pull">&ldquo;Hands down the best beach bonfire in PCB!&rdquo;</p>',
            '<p class="testi-quote">Hands down the best beach bonfire in PCB! We had an absolute blast celebrating my wife and her besties birthday! Would not have changed anything! They were highly attentive to all our needs. I highly recommend this company!!!!</p>',
            '<div class="testi-reviewer"><div class="testi-avatar">C</div><div><div class="testi-name">Clay McCann</div><div class="testi-src">&#9733; Google Review</div></div></div>',
          '</div>',
          /* Elle Thurman */
          '<div class="testi-card">',
            '<div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
            '<p class="testi-pull">&ldquo;Safe to say, I&rsquo;ll be doing one again.&rdquo;</p>',
            '<p class="testi-quote">An amazing end to the sweetest bachelorette trip celebrating our bride, Caroline! Cooper, Xander, and Jaken were attentive, friendly, and welcoming. I&rsquo;ve come to 30A for years and always wanted to do a bonfire, but never had the opportunity until this trip. Safe to say, I&rsquo;ll be doing one again &mdash; and bringing family with me! Thank you Light Me Up for an incredible experience.</p>',
            '<div class="testi-reviewer"><div class="testi-avatar">E</div><div><div class="testi-name">Elle Thurman</div><div class="testi-src">&#9733; Google Review</div></div></div>',
          '</div>',
          /* Chris Lakin */
          '<div class="testi-card">',
            '<div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>',
            '<p class="testi-pull">&ldquo;Our entire experience was unforgettable.&rdquo;</p>',
            '<p class="testi-quote">We had an incredible experience with Light Me Up Beach Bonfires that truly exceeded our expectations. Grace was remarkable in her efforts to help me set up the perfect proposal. She not only assisted in coordinating every detail of the setup but also went the extra mile to find a photographer when their usual one was unavailable, ensuring we wouldn&rsquo;t miss capturing this special moment. When my fianc&eacute;e saw the setup, she was completely blown away. Our entire experience was unforgettable, and I can&rsquo;t thank Grace enough for her dedication and support.</p>',
            '<div class="testi-reviewer"><div class="testi-avatar">C</div><div><div class="testi-name">Chris Lakin</div><div class="testi-src">&#9733; Google Review</div></div></div>',
          '</div>',
        '</div>',
      '</div>',
    '</section>',

    /* ── SECTION 6: HOW IT WORKS ── */
    '<section class="hiw-section" id="how-it-works">',
      '<div class="container">',
        '<div class="hiw-header">',
          '<span class="section-label">The Process</span>',
          '<h2 class="section-title">Booking Your Beach Night Is <em>Surprisingly Simple</em></h2>',
        '</div>',
        '<div class="hiw-steps">',
          '<div class="hiw-step">',
            '<div class="hiw-num">1</div>',
            '<div class="hiw-step-title">Choose Your Experience</div>',
            '<p class="hiw-step-desc">Browse our bonfire packages, picnics, or chair rentals. Pick what sounds right for your group size and style &mdash; we have options for every kind of night.</p>',
          '</div>',
          '<div class="hiw-step">',
            '<div class="hiw-num">2</div>',
            '<div class="hiw-step-title">Reserve Your Date</div>',
            '<p class="hiw-step-desc">Submit your request and our team confirms within 24 hours. A simple deposit locks in your spot. We handle the permits, the logistics, and all the details from there.</p>',
          '</div>',
          '<div class="hiw-step">',
            '<div class="hiw-num">3</div>',
            '<div class="hiw-step-title">Show Up and Enjoy</div>',
            '<p class="hiw-step-desc">We arrive before you, set everything up perfectly, and clean up after you leave. You bring nothing but yourself and the people you love.</p>',
          '</div>',
        '</div>',
        '<p class="hiw-closing">Honestly, it&rsquo;s probably the easiest thing you&rsquo;ll plan all vacation.</p>',
      '</div>',
    '</section>',

    /* ── SECTION 7: FAQ ── */
    '<section class="faq-section" id="faq">',
      '<div class="container">',
        '<div style="text-align:center;margin-bottom:48px;">',
          '<span class="section-label">FAQ</span>',
          '<h2 class="section-title">Frequently Asked Questions About Beach Bonfires in <span data-location=""></span></h2>',
        '</div>',
        '<div class="faq-inner">',
          '<details class="faq-item"><summary>How far in advance should I book? <span class="plus">+</span></summary><p>We recommend booking at least 3 to 5 days in advance, especially during peak season (June through August). Last-minute requests are sometimes possible &mdash; just reach out and we&rsquo;ll do our best to make it work.</p></details>',
          '<details class="faq-item"><summary>Do you guarantee beach access? <span class="plus">+</span></summary><p>Yes. Every booking includes all required county and local beach permits. We handle the permitting so you never have to think about it &mdash; just show up and your spot will be ready.</p></details>',
          '<details class="faq-item"><summary>What is your weather policy? <span class="plus">+</span></summary><p>Safety always comes first. If weather conditions prevent a safe bonfire &mdash; high winds, lightning, or a red-flag beach day &mdash; we will work with you to reschedule at no extra charge. We never want to cancel; we want to find a better night.</p></details>',
          '<details class="faq-item"><summary>Is a beach bonfire family friendly? <span class="plus">+</span></summary><p>Absolutely. Our bonfires are a favorite for families with kids of all ages. S\'mores, sparklers, and a warm fire on the beach &mdash; it&rsquo;s a night the whole family will remember for years. Our team is experienced with family groups and always creates a safe, welcoming environment.</p></details>',
          '<details class="faq-item"><summary>Can you help with proposals or special occasions? <span class="plus">+</span></summary><p>Yes &mdash; and we love doing them. We have coordinated dozens of proposals, anniversaries, and milestone celebrations. Let us know what you have in mind and we&rsquo;ll help you design something truly unforgettable. We can also help connect you with local photographers and caterers.</p></details>',
          '<details class="faq-item"><summary>Can we bring our own food and drinks? <span class="plus">+</span></summary><p>Of course. You&rsquo;re welcome to bring your own food, drinks, and anything else that makes the night feel like yours. We provide the setup, the fire, and the s\'mores &mdash; you bring the rest of the fun.</p></details>',
          '<!-- LOCATION_SPECIFIC_FAQS: Add any location-specific FAQ items here for this page -->',
        '</div>',
      '</div>',
    '</section>',

    /* ── SECTION 8: FINAL CTA ── */
    '<section class="cta-section">',
      '<div class="container cta-content">',
        '<span class="section-label">Let&rsquo;s Make It Happen</span>',
        '<h2 class="cta-title">Ready to Plan Your Beach Night<br/>in <em><span data-location=""></span></em>?</h2>',
        '<p class="cta-sub">Whether you&rsquo;re dreaming of a quiet bonfire for two or a full gathering with your whole crew, we make it effortless. Just show up and let us handle the rest.</p>',
        '<p class="cta-urgency">Peak dates in <span data-location=""></span> book fast &mdash; reserve your night before it&rsquo;s gone.</p>',
        '<div class="cta-actions">',
          '<a href="#booking" class="btn btn-white">Book Your Bonfire</a>',
          '<a href="tel:9373058087" class="btn btn-outline-white">Call Our Team</a>',
        '</div>',
      '</div>',
    '</section>',

    /* ── SECTION 9: BOOKING FORM + CONTACT ── */
    '<section class="booking-section" id="booking">',
      '<div class="booking-section-header container">',
        '<span class="section-label">Reserve Now</span>',
        '<h2 class="section-title">Secure Your Spot on the <em>Beach</em></h2>',
        '<p class="section-subtitle" style="margin:13px auto 0;text-align:center;">Fill out the form and our team will be in touch within 24 hours to confirm your reservation.</p>',
      '</div>',
      '<div class="booking-wrapper">',
        '<div class="booking-card">',
            '<div class="progress-bar-wrap">',
              '<div class="progress-steps">',
                '<div class="progress-step active"><div class="step-dot">1</div><span class="step-label">Your Info</span></div>',
                '<div class="progress-step"><div class="step-dot">2</div><span class="step-label">When &amp; Where</span></div>',
                '<div class="progress-step"><div class="step-dot">3</div><span class="step-label">Package</span></div>',
                '<div class="progress-step"><div class="step-dot">4</div><span class="step-label">Confirm</span></div>',
              '</div>',
            '</div>',
            '<div class="form-content">',
              /* step 1 */
              '<div class="form-step active" id="step-1">',
                '<h3 class="form-step-title">Tell us about yourself</h3>',
                '<p class="form-step-desc">We&rsquo;d love to know who&rsquo;s joining us on the beach.</p>',
                '<div class="form-group"><label>Full Name <span class="req">*</span></label><input type="text" id="f-name" placeholder="Jane Smith"/></div>',
                '<div class="form-group"><label>Email Address <span class="req">*</span></label><input type="email" id="f-email" placeholder="jane@example.com"/></div>',
                '<div class="form-group"><label>Phone Number <span class="req">*</span></label><input type="tel" id="f-phone" placeholder="(937) 305-8087"/></div>',
                '<div class="form-nav"><span></span><button class="btn btn-primary" onclick="nextStep(1)">Continue</button></div>',
              '</div>',
              /* step 2 */
              '<div class="form-step" id="step-2">',
                '<h3 class="form-step-title">When and where?</h3>',
                '<p class="form-step-desc">Tell us your dates, group size, and where you\'ll be staying so we can set up right on your beach.</p>',
                '<div class="form-group"><label>Rental / Hotel Address</label><input type="text" id="f-rental" placeholder="e.g. 123 Beachside Dr" oninput="suggestLocation(this.value)"/><div class="location-suggest" id="location-suggest"></div></div>',
                '<div class="form-group"><label>Beach / Bonfire Location <span class="req">*</span></label>',
                  '<select id="f-location" onchange="applyLocationPricing(getLocationType(this.value));filterPackages(document.getElementById(\'f-guests\').value);">',
                    '<option value="">Select your beach area</option>',
                    locationDropdown,
                  '</select>',
                '</div>',
                '<div class="form-row"><div class="form-group"><label>Preferred Date 1 <span class="req">*</span></label><input type="date" id="f-date1"/></div><div class="form-group"><label>Preferred Date 2</label><input type="date" id="f-date2"/></div></div>',
                '<div class="form-group"><label>Number of Guests <span class="req">*</span></label><input type="number" id="f-guests" placeholder="How many people?" min="1" max="500" oninput="filterPackages(this.value)"/></div>',
                '<div class="form-nav"><button class="btn btn-back" onclick="prevStep(2)">Back</button><button class="btn btn-primary" onclick="nextStep(2)">Continue</button></div>',
              '</div>',
              /* step 3 */
              '<div class="form-step" id="step-3">',
                '<h3 class="form-step-title">Choose your experience</h3>',
                '<p class="form-step-desc">Select a bonfire package, a picnic only, or add both.</p>',
                '<div class="pkg-filter-note" id="loc-price-note"></div>',
                '<div class="pkg-filter-note" id="pkg-filter-note"></div>',
                '<div class="form-group"><label>Bonfire Package</label></div>',
                '<p style="font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--flame);margin-bottom:14px;">Starting at $549!*</p>',
                '<div class="sub-packages">',
                  '<label class="sub-pkg" id="pkg-all-inclusive" data-pkg="all-inclusive" onclick="selectBonfirePkg(this)" style="border-color:var(--golden);background:rgba(212,168,75,0.06);"><input type="radio" name="bf-pkg" value="all-inclusive"/><div><div class="sub-pkg-name" style="color:var(--golden);">All Inclusive Beach Bonfire</div><div class="sub-pkg-details">The complete LMU experience &mdash; details &amp; pricing coming soon. Contact us to learn more.</div></div><div class="sub-pkg-price" style="color:var(--golden);">Inquire</div></label>',
                  '<label class="sub-pkg" id="pkg-one-love" data-pkg="one-love" onclick="selectBonfirePkg(this)"><input type="radio" name="bf-pkg" value="one-love"/><div><div class="sub-pkg-name">&ldquo;One Love&rdquo;</div><div class="sub-pkg-details">2 hr fire &middot; 2 chairs &middot; Tiki torches &middot; Side table &middot; S&rsquo;mores for 2 &middot; Bluetooth speaker &middot; Permit<br/><em style="color:var(--flame);font-size:0.72rem;">Couples only &mdash; add roses +$60</em></div></div><div class="sub-pkg-price" id="price-one-love"></div></label>',
                  '<label class="sub-pkg" id="pkg-high-tide" data-pkg="high-tide" onclick="selectBonfirePkg(this)"><input type="radio" name="bf-pkg" value="high-tide"/><div><div class="sub-pkg-name">&ldquo;High Tide or Low Tide&rdquo;</div><div class="sub-pkg-details">2 hr fire &middot; Up to 8 chairs &middot; Tiki torches &middot; Side table &middot; S&rsquo;mores for up to 8 &middot; Bluetooth speaker &middot; Permit</div></div><div class="sub-pkg-price" id="price-high-tide"></div></label>',
                  '<label class="sub-pkg" id="pkg-three-birds" data-pkg="three-little-birds" onclick="selectBonfirePkg(this)"><input type="radio" name="bf-pkg" value="three-little-birds"/><div><div class="sub-pkg-name">&ldquo;Three Little Birds&rdquo;</div><div class="sub-pkg-details">3 hr fire &middot; Up to 12 chairs &middot; 6ft table &middot; S&rsquo;mores &middot; Speaker &middot; Sparklers &middot; Chalkboard greeting &middot; Permit</div></div><div class="sub-pkg-price" id="price-three-birds"></div></label>',
                  '<label class="sub-pkg" id="pkg-roots-reggae" data-pkg="roots-rock-reggae" onclick="selectBonfirePkg(this)"><input type="radio" name="bf-pkg" value="roots-rock-reggae"/><div><div class="sub-pkg-name">&ldquo;Roots, Rock, Reggae&rdquo;</div><div class="sub-pkg-details">3 hr fire &middot; Up to 20 chairs &middot; (2) 6ft tables &middot; S&rsquo;mores &middot; Large speaker &middot; Sparklers &middot; Cornhole &middot; Chalkboard &middot; Permit</div></div><div class="sub-pkg-price" id="price-roots-reggae"></div></label>',
                '</div>',
                '<p style="font-size:0.73rem;color:var(--text-light);font-style:italic;margin-top:10px;margin-bottom:18px;">*Pricing varies by location, set up, and group size. Book now to customize your options.</p>',
                '<div style="margin:4px 0 18px;">',
                  '<button type="button" id="picnic-toggle-btn" onclick="togglePicnic()" style="width:100%;text-align:left;padding:14px 18px;background:rgba(74,125,156,0.06);border:1.5px solid rgba(74,125,156,0.20);border-radius:12px;cursor:pointer;font-family:inherit;display:flex;justify-content:space-between;align-items:center;transition:all 0.25s;">',
                    '<span style="font-size:0.88rem;font-weight:600;color:var(--text-mid);">Add a Picnic to your bonfire booking</span>',
                    '<span id="picnic-toggle-icon" style="color:var(--ocean);font-size:1.2rem;font-weight:700;line-height:1;">+</span>',
                  '</button>',
                  '<div id="picnic-options" style="display:none;margin-top:10px;">',
                    '<p style="font-size:0.80rem;color:var(--text-light);margin-bottom:12px;line-height:1.6;">Pricing is sent upon inquiry &mdash; select a package and we\'ll include it in your quote.</p>',
                    '<div class="sub-packages">',
                      '<label class="sub-pkg" onclick="selectSubPkg(this)"><input type="radio" name="picnic-addon-pkg" value="beach-dining"/><div><div class="sub-pkg-name">Beach Dining</div><div class="sub-pkg-details">2 hr &middot; Up to 8 people &middot; 8ft dining table(s) &middot; Bamboo chairs &middot; Place settings &middot; Setup &amp; cleanup &middot; Permitting</div></div><div class="sub-pkg-price">Inquire</div></label>',
                      '<label class="sub-pkg" onclick="selectSubPkg(this)"><input type="radio" name="picnic-addon-pkg" value="beach-picnic"/><div><div class="sub-pkg-name">Beach Picnic</div><div class="sub-pkg-details">2 hr &middot; Up to 8 people &middot; Blankets/rugs &middot; Low picnic table(s) &middot; Place settings &middot; Setup &amp; cleanup &middot; Permitting</div></div><div class="sub-pkg-price">Inquire</div></label>',
                      '<label class="sub-pkg" onclick="selectSubPkg(this)"><input type="radio" name="picnic-addon-pkg" value="picnic-for-2"/><div><div class="sub-pkg-name">Picnic for 2</div><div class="sub-pkg-details">2 hr &middot; 2 people &middot; Rug + table + pillow seating or dining table + bamboo chairs &middot; Place settings &middot; Simple decor</div></div><div class="sub-pkg-price">Inquire</div></label>',
                      '<label class="sub-pkg" onclick="selectSubPkg(this)"><input type="radio" name="picnic-addon-pkg" value="custom-picnic"/><div><div class="sub-pkg-name">Custom / Special Event</div><div class="sub-pkg-details">Weddings, large groups, event coordinating &mdash; call us or describe your vision below.</div></div><div class="sub-pkg-price">Inquire</div></label>',
                    '</div>',
                  '</div>',
                '</div>',
                '<div style="display:flex;align-items:center;gap:14px;margin:22px 0 18px;"><div style="flex:1;height:1px;background:rgba(200,86,42,0.16);"></div><span style="font-size:0.76rem;font-weight:600;letter-spacing:0.15em;color:var(--text-light);text-transform:uppercase;">or</span><div style="flex:1;height:1px;background:rgba(200,86,42,0.16);"></div></div>',
                '<div class="form-group"><label>Picnic Only <span style="font-size:0.72rem;font-weight:400;letter-spacing:0;text-transform:none;color:var(--text-light);">(no bonfire)</span></label></div>',
                '<div class="sub-packages">',
                  '<label class="sub-pkg" onclick="selectPicnicOnly(this)"><input type="radio" name="picnic-only-pkg" value="beach-dining-only"/><div><div class="sub-pkg-name">Beach Dining</div><div class="sub-pkg-details">2 hr &middot; Up to 8 people &middot; 8ft dining table(s) &middot; Bamboo chairs &middot; Place settings &middot; Setup &amp; cleanup &middot; Permitting</div></div><div class="sub-pkg-price">Inquire</div></label>',
                  '<label class="sub-pkg" onclick="selectPicnicOnly(this)"><input type="radio" name="picnic-only-pkg" value="beach-picnic-only"/><div><div class="sub-pkg-name">Beach Picnic</div><div class="sub-pkg-details">2 hr &middot; Up to 8 people &middot; Blankets/rugs &middot; Low picnic table(s) &middot; Place settings &middot; Setup &amp; cleanup &middot; Permitting</div></div><div class="sub-pkg-price">Inquire</div></label>',
                  '<label class="sub-pkg" onclick="selectPicnicOnly(this)"><input type="radio" name="picnic-only-pkg" value="picnic-for-2-only"/><div><div class="sub-pkg-name">Picnic for 2</div><div class="sub-pkg-details">2 hr &middot; 2 people &middot; Choice of seating setup &middot; Place settings &middot; Simple decor &middot; Chalkboard upon request</div></div><div class="sub-pkg-price">Inquire</div></label>',
                  '<label class="sub-pkg" onclick="selectPicnicOnly(this)"><input type="radio" name="picnic-only-pkg" value="custom-picnic-only"/><div><div class="sub-pkg-name">Custom / Special Event</div><div class="sub-pkg-details">Weddings, proposals, corporate events &mdash; call us or describe your vision below.</div></div><div class="sub-pkg-price">Inquire</div></label>',
                '</div>',
                '<div class="form-group" style="margin-top:10px;">',
                  '<label>Add-ons</label>',
                  '<p class="addon-hint">Select anything you\'d like added to your experience.</p>',
                  '<div class="addons-checklist">',
                    '<label class="addon-check-item only-30a" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="smores"/><span class="addon-check-name">S&rsquo;mores Package</span><span class="addon-check-note">per 12, 2 s&rsquo;mores/person</span><span class="addon-check-price">$25</span></label>',
                    '<label class="addon-check-item only-pcb pkg-hidden" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="smores-pcb"/><span class="addon-check-name">Additional S&rsquo;mores</span><span class="addon-check-note">per person</span><span class="addon-check-price">$1/person</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="string-lights"/><span class="addon-check-name">Overhead String Lighting</span><span class="addon-check-note">per strand</span><span class="addon-check-price">$150</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="rose-petals"/><span class="addon-check-name">Rose Petals</span><span class="addon-check-price">$60</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="boho-umbrella"/><span class="addon-check-name">Boho Beach Umbrella</span><span class="addon-check-price">$40</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="cooler-ice"/><span class="addon-check-name">Cooler + Ice</span><span class="addon-check-price">$45</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="table-6ft"/><span class="addon-check-name">6 ft Table</span><span class="addon-check-note">food/drink serving</span><span class="addon-check-price">$30</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="chalkboard"/><span class="addon-check-name">Chalkboard</span><span class="addon-check-note">with personal message</span><span class="addon-check-price">$35</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="cornhole"/><span class="addon-check-name">Cornhole</span><span class="addon-check-price">$30</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="sparklers"/><span class="addon-check-name">Sparklers</span><span class="addon-check-note">12-pack</span><span class="addon-check-price">$10</span></label>',
                    '<label class="addon-check-item addon-roses pkg-hidden" id="addon-roses" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="roses"/><span class="addon-check-name">Roses</span><span class="addon-check-note">One Love only</span><span class="addon-check-price">$60</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="photo-mini"/><span class="addon-check-name">Photography &mdash; Mini Sesh</span><span class="addon-check-note">10 min, 5 edited photos, up to 10 people</span><span class="addon-check-price">$150</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="photo-2"/><span class="addon-check-name">Photography &mdash; Package 2</span><span class="addon-check-note">20 min, 15&ndash;20 edited photos, up to 10 people</span><span class="addon-check-price">$350</span></label>',
                    '<label class="addon-check-item" onclick="toggleAddon(this)"><input type="checkbox" name="addon" value="photo-3"/><span class="addon-check-name">Photography &mdash; Package 3</span><span class="addon-check-note">40 min, 20&ndash;30 edited photos, up to 20 people</span><span class="addon-check-price">$450</span></label>',
                  '</div>',
                '</div>',
                '<div class="form-group"><label>Questions or Requests</label><textarea id="f-notes" rows="3" placeholder="Nearest beach access, landmark, occasion, or anything else that helps us serve you better..."></textarea></div>',
                '<div class="form-nav"><button class="btn btn-back" onclick="prevStep(3)">Back</button><button class="btn btn-primary" onclick="nextStep(3)">Continue</button></div>',
              '</div>',
              /* step 4 */
              '<div class="form-step" id="step-4">',
                '<h3 class="form-step-title">Almost there!</h3>',
                '<p class="form-step-desc">Please review our policies and confirm your booking request.</p>',
                '<div class="checkbox-group"><input type="checkbox" id="f-policy"/><label for="f-policy">I have read and agree to the <a href="faq.html">Light Me Up Beach Bonfires policies</a>, including cancellation, weather, and permit guidelines. <span style="color:var(--flame)">*</span></label></div>',
                '<div class="checkbox-group"><input type="checkbox" id="f-sms"/><label for="f-sms">I agree to receive text messages from Light Me Up Beach Bonfires, including booking confirmations and updates. Message and data rates may apply.</label></div>',
                '<div class="form-notice"><strong>What happens next?</strong><br/>Once you submit, our team will reach out within 24 hours to confirm your date, go over all the details, and collect a deposit to lock in your spot. We can\'t wait to see you on the beach!</div>',
                '<div class="form-nav"><button class="btn btn-back" onclick="prevStep(4)">Back</button><button class="btn btn-primary" onclick="submitForm()">Send My Request</button></div>',
              '</div>',
              /* success */
              '<div class="success-message" id="success-msg">',
                '<h3>You\'re all set! &#127754;</h3>',
                '<p>Thank you for reaching out. The LMU team will be in touch within 24 hours to confirm your beach experience. We can\'t wait to see you!</p>',
                '<p style="margin-top:12px;font-style:italic;font-family:var(--font-display);font-size:1.1rem;color:var(--flame);">Love, The LMU Team</p>',
                '<a href="#" class="btn btn-primary" style="margin-top:26px;display:inline-flex;">Back to Top</a>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    '</section>',

    /* footer */
    '<footer class="site-footer">',
      '<div class="container">',
        '<div class="footer-top">',
          '<div class="footer-brand">',
            '<div class="brand-name">Light Me <span>Up</span> Beach Bonfires</div>',
            '<div class="tagline">Family Owned &amp; Operated &middot; Est. 2015</div>',
            '<p>One of the first beach bonfire companies on the Emerald Coast, serving Panama City Beach, Walton County, and 30A since 2015.</p>',
            '<div class="footer-actions"><a href="#booking" class="btn btn-primary">Book Now</a><a href="mailto:hello@lightmeupbonfires.com" class="btn btn-outline">Contact Us</a></div>',
          '</div>',
          '<div class="footer-col"><h4>Explore</h4><ul>',
            '<li><a href="beach-bonfire.html">Beach Bonfires</a></li>',
            '<li><a href="beach-picnics.html">Beach Picnics</a></li>',
            '<li><a href="beach-chairs.html">Beach Chairs &amp; Umbrellas</a></li>',
            '<li><a href="event-planning.html">Event Planning</a></li>',
            '<li><a href="faq.html">FAQ &amp; Policies</a></li>',
          '</ul></div>',
          '<div class="footer-col"><h4>Follow Along</h4>',
            '<div class="social-links">',
              '<a href="https://www.instagram.com/lightmeupbonfires" target="_blank" rel="noopener" class="social-link" aria-label="Instagram"><svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>',
              '<a href="https://www.facebook.com/lightmeupbonfires" target="_blank" rel="noopener" class="social-link" aria-label="Facebook"><svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>',
            '</div>',
            '<div style="margin-top:26px;"><h4>Contact</h4><p style="font-size:0.86rem;color:rgba(255,255,255,0.50);font-weight:300;line-height:1.72;"><a href="tel:9373058087" style="color:rgba(255,255,255,0.50);">(937) 305-8087</a><br/>hello@lightmeupbonfires.com<br/>Panama City Beach to 30A</p></div>',
          '</div>',
        '</div>',
        '<div class="footer-bottom"><p>&copy; 2025 Light Me Up Beach Bonfires. All rights reserved.</p><p style="font-size:0.70rem;color:rgba(255,255,255,0.18);">Family Owned &amp; Operated &middot; Bay County &middot; Walton County &middot; 30A</p></div>',
      '</div>',
    '</footer>',

    /* popup */
    '<div class="lg-overlay" id="lg-overlay">',
      '<div class="lg-modal">',
        '<button class="lg-close" id="lg-close" aria-label="Close">&#10005;</button>',
        '<img class="lg-modal-img" src="https://www.dropbox.com/scl/fi/58294y21jdgewlwq79kn4/IMG_9595_Original.webp?rlkey=e2orh49nak5d0aeh7f8ozrpcf&st=5d0fbhgd&raw=1" alt="Beautiful beach day on the Emerald Coast"/>',
        '<div class="lg-modal-body">',
          '<div class="lg-caption">Don\'t know what to plan? We\'ve got you!</div>',
          '<h3 class="lg-modal-title">Local\'s Guide to the Perfect Day:<br/>30A &amp; PCB</h3>',
          '<p class="lg-modal-sub">Our free PDF guide covers the best beach spots, local tips, and everything you need to plan an unforgettable trip on the Emerald Coast.</p>',
          '<div class="hs-form-frame" data-region="na1" data-form-id="7891f273-d9bb-4421-bc8d-ba09e74fd964" data-portal-id="50932974"></div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  /* ── 5. INJECT LOCATION NAMES ───────────────────────────────────────────── */
  document.querySelectorAll('[data-location]').forEach(function (el) {
    el.textContent = loc;
  });

  /* ── 6. PRESELECT LOCATION IN DROPDOWN ──────────────────────────────────── */
  if (preselect) {
    var sel = document.getElementById('f-location');
    if (sel) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === preselect || sel.options[i].text === preselect) {
          sel.selectedIndex = i;
          break;
        }
      }
      var lt = getLocationType(preselect);
      if (lt) applyLocationPricing(lt);
    }
  }

  /* ── 7. PAGE JAVASCRIPT ─────────────────────────────────────────────────── */

  /* sticky header */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* mobile nav toggle */
  document.getElementById('nav-toggle').addEventListener('click', function () {
    document.getElementById('mobile-nav').classList.toggle('open');
  });

  /* ── HUBSPOT PROGRESSIVE SYNC ───────────────────────────────────────── */
  var HUBSPOT_PORTAL_ID = '50932974';
  var HUBSPOT_FORM_GUID = '61b14a6f-ce3b-46fa-8d18-fb773087565a';

  function sendToHubSpot(fields) {
    var email = (document.getElementById('f-email') || {}).value || '';
    if (!email) return;

    var payload = {
      fields: [{ name: 'email', value: email }].concat(
        fields
          .filter(function (f) { return f.value !== null && f.value !== undefined && f.value !== ''; })
          .map(function (f) { return { name: f.name, value: String(f.value) }; })
      ),
      context: { pageUri: window.location.href, pageName: document.title }
    };

    fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/' + HUBSPOT_PORTAL_ID + '/' + HUBSPOT_FORM_GUID,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    ).catch(function (err) { console.warn('[HubSpot] Submission error:', err); });
  }

  function collectStep1Fields() {
    var name  = (document.getElementById('f-name')  || {}).value || '';
    var phone = (document.getElementById('f-phone') || {}).value || '';
    var parts = name.trim().split(/\s+/);
    return [
      { name: 'firstname', value: parts[0] || '' },
      { name: 'lastname',  value: parts.slice(1).join(' ') || '' },
      { name: 'phone',     value: phone }
    ];
  }

  function collectStep2Fields() {
    var date1    = (document.getElementById('f-date1')    || {}).value || '';
    var date2    = (document.getElementById('f-date2')    || {}).value || '';
    var guests   = (document.getElementById('f-guests')   || {}).value || '';
    var location = (document.getElementById('f-location') || {}).value || '';
    var rental   = (document.getElementById('f-rental')   || {}).value || '';
    return [
      { name: 'location_detail',  value: location },
      { name: 'rental_address',   value: rental   },
      { name: 'preferred_date_1', value: date1    },
      { name: 'preferred_date_2', value: date2    },
      { name: 'number_of_guests', value: guests   }
    ];
  }

  function collectStep3Fields() {
    var pkgInput = document.querySelector('input[name="bf-pkg"]:checked');
    var pkg      = pkgInput ? pkgInput.value : '';
    var addonInputs = document.querySelectorAll('input[name="addon"]:checked');
    var addons      = Array.prototype.slice.call(addonInputs).map(function (el) { return el.value; }).join(', ');
    var picnicAddonInput = document.querySelector('input[name="picnic-addon-pkg"]:checked');
    var picnicAddon      = picnicAddonInput ? picnicAddonInput.value : '';
    var picnicOnlyInput  = document.querySelector('input[name="picnic-only-pkg"]:checked');
    var picnicOnly       = picnicOnlyInput  ? picnicOnlyInput.value  : '';
    var notes = (document.getElementById('f-notes') || {}).value || '';
    return [
      { name: 'package_selection', value: pkg         },
      { name: 'addon_selections',  value: addons      },
      { name: 'picnic_addon_pkg',  value: picnicAddon },
      { name: 'picnic_only_pkg',   value: picnicOnly  },
      { name: 'additional_notes',  value: notes       }
    ];
  }

  function hubspotStep1() {
    sendToHubSpot(collectStep1Fields());
  }

  function hubspotStep2() {
    sendToHubSpot(collectStep1Fields().concat(collectStep2Fields()));
  }

  function hubspotStep3() {
    sendToHubSpot(collectStep1Fields().concat(collectStep2Fields()).concat(collectStep3Fields()));
  }

  function hubspotStep4() {
    var policyAgreed = (document.getElementById('f-policy') || {}).checked ? 'Yes' : 'No';
    var smsOptIn     = (document.getElementById('f-sms')    || {}).checked ? 'true' : 'false';
    sendToHubSpot(
      collectStep1Fields()
        .concat(collectStep2Fields())
        .concat(collectStep3Fields())
        .concat([
          { name: 'policy_agreed',        value: policyAgreed },
          { name: 'hs_marketable_status', value: smsOptIn     }
        ])
    );
  }
  /* ── END HUBSPOT ────────────────────────────────────────────────────── */

  /* form step navigation */
  window.nextStep = function (current) {
    if (current === 1) {
      if (!document.getElementById('f-name').value.trim() ||
          !document.getElementById('f-email').value.trim() ||
          !document.getElementById('f-phone').value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }
      hubspotStep1();
    }
    if (current === 2) {
      if (!document.getElementById('f-location').value ||
          !document.getElementById('f-date1').value ||
          !document.getElementById('f-guests').value) {
        alert('Please fill in all required fields.');
        return;
      }
      hubspotStep2();
    }
    if (current === 3) {
      hubspotStep3();
    }
    var steps = document.querySelectorAll('.progress-step');
    var formSteps = document.querySelectorAll('.form-step');
    formSteps[current - 1].classList.remove('active');
    formSteps[current].classList.add('active');
    steps[current - 1].classList.remove('active');
    steps[current - 1].classList.add('completed');
    steps[current].classList.add('active');
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.prevStep = function (current) {
    var steps = document.querySelectorAll('.progress-step');
    var formSteps = document.querySelectorAll('.form-step');
    formSteps[current - 1].classList.remove('active');
    formSteps[current - 2].classList.add('active');
    steps[current - 1].classList.remove('active');
    steps[current - 2].classList.remove('completed');
    steps[current - 2].classList.add('active');
  };

  window.selectBonfirePkg = function (el) {
    document.querySelectorAll('#step-3 .sub-packages:first-of-type .sub-pkg').forEach(function (p) { p.classList.remove('selected'); });
    el.classList.add('selected');
    el.querySelector('input[type="radio"]').checked = true;
    var roses = document.getElementById('addon-roses');
    if (roses) roses.classList.toggle('pkg-hidden', el.dataset.pkg !== 'one-love');
    document.querySelectorAll('[name="picnic-only-pkg"]').forEach(function (r) {
      r.closest('.sub-pkg').classList.remove('selected'); r.checked = false;
    });
  };

  window.selectPicnicOnly = function (el) {
    document.querySelectorAll('[name="picnic-only-pkg"]').forEach(function (r) {
      r.closest('.sub-pkg').classList.remove('selected'); r.checked = false;
    });
    el.classList.add('selected');
    el.querySelector('input[type="radio"]').checked = true;
    document.querySelectorAll('[name="bf-pkg"]').forEach(function (r) {
      r.closest('.sub-pkg').classList.remove('selected'); r.checked = false;
    });
  };

  window.selectSubPkg = function (el) {
    var siblings = el.closest('.sub-packages').querySelectorAll('.sub-pkg');
    siblings.forEach(function (p) { p.classList.remove('selected'); });
    el.classList.add('selected');
    el.querySelector('input[type="radio"]').checked = true;
  };

  window.toggleAddon = function (el) {
    el.classList.toggle('checked');
    el.querySelector('input[type="checkbox"]').checked = el.classList.contains('checked');
  };

  window.suggestLocation = function (val) {
    var el = document.getElementById('location-suggest');
    if (!val || val.length < 4) { el.classList.remove('visible'); return; }
    var lower = val.toLowerCase();
    var hints = [
      { k: ['seaside','watercolor','watercolour','grayton','blue mountain','rosemary','alys','inlet','santa rosa','seagrove','seacrest','gulf place','watersound','carillon'], msg: '30A area &mdash; we serve this location!' },
      { k: ['miramar','dune allen','sandestin','baytowne','topsail','point washington','sunnyside','laguna','bahama','south walton'], msg: 'Walton County &mdash; we serve this area!' },
      { k: ['destin'], msg: 'Destin area &mdash; we serve this location!' },
      { k: ['panama city','pcb'], msg: 'Panama City Beach &mdash; we serve this location!' },
      { k: ['mexico beach','port saint joe','saint joe beach','cape san blas'], msg: 'Gulf County &mdash; we serve this area!' }
    ];
    var found = '';
    hints.forEach(function (h) { if (h.k.some(function (k) { return lower.includes(k); })) found = h.msg; });
    if (found) { el.innerHTML = found; el.classList.add('visible'); }
    else { el.classList.remove('visible'); }
  };

  window.getLocationType = function (locValue) {
    var a30 = ['Seaside','Rosemary Beach','Alys Beach','WaterColor','Grayton Beach','Blue Mountain Beach',
               'Santa Rosa Beach','Inlet Beach','Miramar Beach','Dune Allen Beach','Seagrove Beach',
               'Seacrest Beach','Carillon Beach','Gulf Place','Watersound','Sandestin','Baytowne Wharf',
               'Topsail Hill','Point Washington','Sunnyside','Laguna Beach','Bahama Beach','South Walton',
               '30A','Destin'];
    if (a30.some(function (l) { return locValue.includes(l); })) return '30a';
    if (locValue.includes('Panama City Beach') || locValue.includes('Mexico Beach') ||
        locValue.includes('Port Saint Joe') || locValue.includes('Saint Joe Beach') ||
        locValue.includes('Cape San Blas')) return 'pcb';
    return null;
  };

  window.applyLocationPricing = function (type) {
    var prices30a = { 'one-love': '$299', 'high-tide': '$375', 'three-little-birds': '$599', 'roots-rock-reggae': '$799' };
    var pricesPcb = { 'one-love': '$249', 'high-tide': '$299', 'three-little-birds': '$499', 'roots-rock-reggae': '$699' };
    var prices = type === '30a' ? prices30a : (type === 'pcb' ? pricesPcb : null);
    [['one-love','one-love'],['high-tide','high-tide'],['three-birds','three-little-birds'],['roots-reggae','roots-rock-reggae']].forEach(function (pair) {
      var el = document.getElementById('price-' + pair[0]);
      if (el && prices) el.textContent = prices[pair[1]] || '';
    });
    var note = document.getElementById('loc-price-note');
    if (note && type) {
      note.innerHTML = type === '30a'
        ? '30A / Walton County pricing is shown. Prices include setup, breakdown, and permit.'
        : 'Panama City Beach / Gulf County pricing is shown. Prices include setup, breakdown, and permit.';
      note.classList.add('visible');
    }
    document.querySelectorAll('.only-30a').forEach(function (el) { el.classList.toggle('pkg-hidden', type !== '30a'); });
    document.querySelectorAll('.only-pcb').forEach(function (el) { el.classList.toggle('pkg-hidden', type !== 'pcb'); });
  };

  window.filterPackages = function (guests) {
    var n = parseInt(guests, 10);
    var note = document.getElementById('pkg-filter-note');
    if (!n || isNaN(n)) { if (note) note.classList.remove('visible'); return; }
    var msg = n <= 2 ? 'For 1&ndash;2 guests, the <strong>One Love</strong> package is perfect.'
            : n <= 8 ? 'For up to 8 guests, the <strong>High Tide or Low Tide</strong> package is a great fit.'
            : n <= 12 ? 'For up to 12 guests, the <strong>Three Little Birds</strong> package is recommended.'
            : n <= 20 ? 'For up to 20 guests, consider the <strong>Roots, Rock, Reggae</strong> package.'
            : 'For large groups over 20, call us at <strong>(937) 305-8087</strong> so we can build a custom quote.';
    if (note) { note.innerHTML = msg; note.classList.add('visible'); }
  };

  window.togglePicnic = function () {
    var opts = document.getElementById('picnic-options');
    var icon = document.getElementById('picnic-toggle-icon');
    var btn  = document.getElementById('picnic-toggle-btn');
    var open = opts.style.display !== 'none';
    opts.style.display = open ? 'none' : 'block';
    icon.textContent   = open ? '+' : '−';
    btn.style.background = open ? 'rgba(74,125,156,0.06)' : 'rgba(74,125,156,0.12)';
  };

  window.submitForm = function () {
    if (!document.getElementById('f-policy').checked) {
      alert('Please agree to our policies to continue.');
      return;
    }
    hubspotStep4();
    document.querySelectorAll('.form-step').forEach(function (el) { el.classList.remove('active'); });
    document.getElementById('success-msg').classList.add('show');
    document.querySelector('.progress-bar-wrap').style.display = 'none';
  };

  /* popup — HubSpot next-gen form (hs-form-frame) renders on page load via portal script */
  (function () {
    var hs = document.createElement('script');
    hs.src = 'https://js.hsforms.net/forms/embed/50932974.js';
    document.head.appendChild(hs);

    var overlay  = document.getElementById('lg-overlay');
    var closeBtn = document.getElementById('lg-close');
    function openPopup()  { overlay.classList.add('open'); }
    function closePopup() { overlay.classList.remove('open'); }
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });
    setTimeout(openPopup, 3000);
  })();

  /* burn ban */
  (function () {
    var BURN_BAN_ACTIVE = true;
    var bar = document.getElementById('burn-ban-bar');
    if (BURN_BAN_ACTIVE && bar) {
      document.getElementById('burn-ban-text').textContent =
        '⚠️ BURN BANS IN EFFECT: Burn bans are currently in effect and may affect option availability. Contact us to discuss your event options.';
      bar.classList.add('active');
    }
  })();

}());
