document.addEventListener("DOMContentLoaded", ()=> {

  const nav = document.querySelector('#main')
  const titlePic = document.querySelector('#titlePic')
  const fourPic = document.querySelector('#sec4Pic')
  const underline = document.querySelector('#navBar')
  const aNav = document.querySelectorAll('#main ul li a')
  const logo = document.querySelector('.logo')
  const highlight = document.createElement('span')
  const gallery = document.querySelector('#gallery')
  const imgSlider = document.querySelector('#imgSlider')
  const arrows = document.querySelectorAll('img[name="arrow"]')
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
  let sectionCoords
  //needs to be const because need reference to where it is when not bound
  const topOfNav = nav.offsetTop
  let galleryWidth
  let counter = 0

  function resizeNav () {
    sectionCoords = []
    galleryWidth = gallery.offsetWidth
    sections.forEach(section => {
      sectionCoords.push(section.offsetTop +.5)
    })
    navItem = Array.from(aNav)
    firstNav = navItem[0].offsetLeft
    lastNav = navItem[navItem.length-1].offsetLeft + navItem[navItem.length-1].clientWidth
    const navClientWidths = []
    navItem.forEach(nav => navClientWidths.push(nav.clientWidth))
    const sortedClientWidth = navClientWidths.sort(function(a, b) {
      return a - b;
    });
    fix = sortedClientWidth[1]
    aNav.forEach(nav => {
      nav.style.width = `${sortedClientWidth[sortedClientWidth.length-1] + 1}px`
    })
    scrollLocater()
  }

  function scrollLocater() {
    const navWidth = lastNav - (firstNav + fix)
    const navTop = nav.getBoundingClientRect().top + (underline.getBoundingClientRect().height*(5/6))
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentHeight = window.scrollY
    const percentThrough = (currentHeight/totalHeight).toFixed(2)
    let navBar = navWidth*percentThrough
    highlight.style.transform = `translate(${navBar + firstNav}px, ${navTop}px)`;
    highlight.style.width = `${fix}px`
    highlight.style.height = `2px`
    fixNav();
    if (currentHeight < sectionCoords[1]){
      titlePic.style.top = `${-currentHeight}px`
    }
    if (currentHeight > sectionCoords[2]){
      fourPic.style.top = `${-(currentHeight-sectionCoords[2])}px`
    }
  }

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
    const targetValue = parseInt(e.target.id)
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

  function galleryCounter (e) {
    const galleryNum = imgSlider.childElementCount
    let currentLeft = (galleryWidth * (-counter))
    if (e.target.id === 'rightArrow') {
      counter++
      // make function that takes in counter #
      imgSlider.style.left = `${currentLeft-galleryWidth}px`
      if (counter >= (galleryNum - 1)){
        arrows[0].style.opacity = '0'
        setTimeout(() => {arrows[0].style.visibility = 'hidden'},300)
      } else {
        arrows[1].style.visibility = 'visible'
        arrows[1].style.opacity = '1'
      }
      // *************
    }
    if (e.target.id === 'leftArrow') {
      counter--
      // make function that takes in counter #
      imgSlider.style.left = `${currentLeft+galleryWidth}px`
      if (counter <= 0){
        arrows[1].style.opacity = '0'
        setTimeout(() => {arrows[1].style.visibility = 'hidden'},300)
      } else {
        arrows[0].style.visibility = 'visible'
        arrows[0].style.opacity = '1'
      }
      // *************
    }
  }

  // function galleryScrollTo (a) {

  // }

  resizeNav()
  scrollLocater()
  window.addEventListener('scroll', debounce(scrollLocater))
  window.addEventListener("resize", resizeNav);
  navItem.forEach(nav => nav.addEventListener('click', navClickTransition))
  arrows.forEach(arrow => arrow.addEventListener('click', debounce(galleryCounter,300)))
})
