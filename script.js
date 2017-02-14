document.addEventListener("DOMContentLoaded", ()=> {

  const nav = document.querySelector('#main')
  const underline = document.querySelector('#navBar')
  const aNav = document.querySelectorAll('#main ul li a')
  const logo = document.querySelector('.logo')
  const highlight = document.createElement('span')
  highlight.classList.add('highlight')
  document.body.append(highlight)
  const sections = document.querySelectorAll('section')


  function debounce(func, wait = 10, immediate = true) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  let navItem
  let firstNav
  let lastNav
  let fix
  let sectionCoords = []

  function resizeNav () {
    navItem = Array.from(aNav)
    firstNav = navItem[0].offsetLeft
    lastNav = navItem[navItem.length-1].offsetLeft + navItem[navItem.length-1].clientWidth
    fix = navItem[0].clientWidth
    navLocater()
    sectionCoords = []
    sections.forEach(section => {
      sectionCoords.push(section.offsetTop)
    })
  }


  function navLocater() {
    const navWidth = lastNav - (firstNav + fix)
    const navTop = nav.getBoundingClientRect().top + (underline.getBoundingClientRect().height*(5/6))
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentHeight = window.scrollY
    const percentThrough = (currentHeight/totalHeight).toFixed(2)
    const navBar = navWidth*percentThrough
    highlight.style.transform = `translate(${navBar + firstNav}px, ${navTop}px)`;
    highlight.style.width = `${fix}px`
    highlight.style.height = `2px`
    fixNav();
  }

  const topOfNav = nav.offsetTop
  function fixNav(){
    if(window.scrollY >= topOfNav) {
      document.body.classList.add('fixed-nav')
      logo.classList.add('showLogo')
      document.body.style.paddingTop = nav.offsetHeight + 'px';
    } else {
      logo.classList.remove('showLogo')
      document.body.classList.remove('fixed-nav')
      document.body.style.paddingTop = 0;
    }
  }

  function navClickTransition (e) {
    e.preventDefault()
    const targetValue = parseInt(e.target.name)
    scrollTo(document.body, sectionCoords[targetValue], 1250)
  }

//credit for scrolling function to http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
  function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        increment = 20;
    var animateScroll = function(elapsedTime) {
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
            setTimeout(function() {
                animateScroll(elapsedTime);
            }, increment);
        }
    };
    animateScroll(0);
  }

  function easeInOut(currentTime, start, change, duration) {
      currentTime /= duration / 2;
      if (currentTime < 1) {
          return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }





  resizeNav()
  navLocater()
  window.addEventListener('scroll', debounce(navLocater))
  window.addEventListener("resize", resizeNav);
  navItem.forEach(nav => nav.addEventListener('click', navClickTransition))
})
