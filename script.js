document.addEventListener("DOMContentLoaded", ()=> {

  const nav = document.querySelector('#main')
  const titlePic = document.querySelector('#titlePic')
  const fourPic = document.querySelector('#sec4Pic')
  const underline = document.querySelector('#navBar')
  const aNav = document.querySelectorAll('#main ul li a')
  const logo = document.querySelector('.logo')
  const rubber = logo.querySelector('h2')
  const highlight = document.createElement('span')
  const gallery = document.querySelector('#gallery')
  const imgSlider = document.querySelector('#imgSlider')
  const arrows = document.querySelectorAll('img[name="arrow"]')
  highlight.classList.add('highlight')
  document.body.append(highlight)
  const sections = document.querySelectorAll('section')
  const imageItems = document.querySelectorAll('#imgSlider img')
  const galleryItems = document.querySelector('#galleryItems')
  let innerGalleryDivs //needs to be created before called
  const galleryInfo = document.querySelectorAll('.projectDetails')
  const innerGalleryInfo = document.querySelector('#innerGalleryInfo')
  const nameDiv = document.querySelector('#title')
  const myName = nameDiv.querySelector('h1')

  function mapGallery() {
    const wowz = Array.from(imageItems)
    wowz.forEach((img, i) => {
      let imageTag = img.outerHTML
      let node = document.createElement('div')
      node.classList.add('indGalItem')
      node.setAttribute("name", `${i}`);
      node.innerHTML = imageTag
      galleryItems.appendChild(node)
    })
    innerGalleryDivs = document.querySelectorAll('.indGalItem')
    innerGalleryDivs[0].classList.add('selectedGallery')
    innerGalleryDivs.forEach(div => div.addEventListener('click', gallerySelector))
    galleryInfo[0].classList.add('projectDetailsShow')
  }

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
  const visibilityTime = 300 //also need to change css transitions
  let lastCountnum = 0
  let nameTouchTop = false
  let nameTouchNav = false
  let checked = false
  let oneTenthHeight
  let lastY = 0
  let needToLeftRubber
  rubber.style.left = `${needToLeftRubber}px` //only want it to do this on page load
  let runOnce = true

  function resizeNav () {
    oneTenthHeight = (window.innerHeight)/10
    rubber.style.fontSize = `${oneTenthHeight}px`
    needToLeftRubber = (window.innerWidth/2) - (rubber.getBoundingClientRect().width/2)
    myName.style.fontSize = `${oneTenthHeight}px`
    myName.style.lineHeight = `${(window.innerHeight)/10}px`
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
      const navName = myName.getBoundingClientRect().bottom
      const topName = myName.getBoundingClientRect().top
      const currentNameTop = window.getComputedStyle(myName, null).getPropertyValue('top')
      if (navName <= nav.getBoundingClientRect().top) {
        myName.style.top = `${(currentHeight*.5)}px`
      } else {
        nameTouchNav = true
      }
      if (topName >= 0) {
        myName.style.top = `${(currentHeight*.5)}px`
      } else {
        nameTouchTop = true
      }
      if ((nameTouchTop == true) && (nameTouchNav == false) && (checked == false)) {
        myName.style.top = `${currentNameTop}px`
        checked = true
      }
      const distanceLeft = nav.offsetTop - window.scrollY
      const widthSizeName = (-(distanceLeft/oneTenthHeight)) + 2
      const heightSizeName = distanceLeft/oneTenthHeight
      if((nameTouchTop == true) && (nameTouchNav == true)) {
        myName.style.transform = `scale(${widthSizeName},${heightSizeName})`
        nameTouchNav = false
        nameTouchTop = false
        checked = false
      }
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
      myName.style.display = 'none'
      rubber.classList.add('rubberBand')
      if (runOnce) {
        rubber.style.left = `${needToLeftRubber}px`
        setTimeout(() => {
          rubber.style.left = '0px'
        }, 1000)
        runOnce = false
      }
    } else {
      logo.classList.remove('showLogo')
      rubber.classList.remove('rubberBand')
      rubber.style.fontSize = `${oneTenthHeight}px`
      document.body.classList.remove('fixed-nav')
      document.body.style.paddingTop = 0;
      myName.style.display = 'inline-block'
      myName.style.transform = 'scale(1,1)'
      rubber.style.left = `${needToLeftRubber}px`
      runOnce = true
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
    if (e.target.id === 'rightArrow') {
      counter++
      }
    if (e.target.id === 'leftArrow') {
      counter--
    }
    galleryScrollTo (counter)
  }

  function gallerySelector(e) {
    if (e.target.className === 'indGalItem') return
    const targetName = parseInt(e.target.parentNode.getAttribute("name"))
    galleryScrollTo(targetName)
    counter = targetName
  }

  function galleryScrollTo (countNum) {
    innerGalleryDivs.forEach(item => item.classList.remove('selectedGallery'))
    innerGalleryDivs[countNum].classList.add('selectedGallery')
    const galleryNum = imgSlider.childElementCount
    const currentLeft = (galleryWidth * (-countNum))
    imgSlider.style.left = `${currentLeft}px`
    if (countNum >= (galleryNum - 1)){
      arrows[0].style.opacity = '0'
      setTimeout(() => {arrows[0].style.visibility = 'hidden'},visibilityTime)
      arrows[1].style.visibility = 'visible'
      arrows[1].style.opacity = '1'
    } else if (countNum <= 0){
      arrows[1].style.opacity = '0'
      setTimeout(() => {arrows[1].style.visibility = 'hidden'},visibilityTime)
      arrows[0].style.visibility = 'visible'
      arrows[0].style.opacity = '1'
    } else {
      arrows[1].style.visibility = 'visible'
      arrows[1].style.opacity = '1'
      arrows[0].style.visibility = 'visible'
      arrows[0].style.opacity = '1'
    }
    const windowWidth = window.innerWidth
    const intoToLeft = innerGalleryInfo.getBoundingClientRect().left
    const howMuchToRight = windowWidth - intoToLeft
    innerGalleryInfo.style.left = `${howMuchToRight}px`
    setTimeout(() => {
      galleryInfo[lastCountnum].classList.remove('projectDetailsShow')
      lastCountnum = countNum
      galleryInfo[countNum].classList.add('projectDetailsShow')
      innerGalleryInfo.style.left = '0px'
    },500)
  }



  mapGallery()
  resizeNav()
  scrollLocater()
  window.addEventListener('scroll', debounce(scrollLocater))
  window.addEventListener("resize", resizeNav);
  navItem.forEach(nav => nav.addEventListener('click', navClickTransition))
  arrows.forEach(arrow => arrow.addEventListener('click', debounce(galleryCounter,visibilityTime)))
})
