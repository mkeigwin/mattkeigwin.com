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
  const mail = document.querySelector('#mailbutton')
  const nameDiv = document.querySelector('#title')
  const myName = nameDiv.querySelector('h1')
  const letters = document.querySelectorAll('.letter')
  const links = document.querySelectorAll('.links')
  const arrowDown = document.querySelector('.arrowDown')
  const onlyTitle = document.querySelectorAll('.onlyTitle')
  const mySkills = document.querySelector('#mySkills')
  const starPlacement = document.querySelector('.starPlacement')
  const placeOnImage4 = document.querySelector('.placeOnImage4')
  const resumeButton = document.querySelector('.four button')
  const resumeTitle = document.querySelector('.four h2')
  const backgroundScroll = document.createElement("DIV")
  const resumeClose = document.querySelector('.resumeClose')
  const fixedDiv = document.querySelector('.fixedDiv')

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
  let oneTenthHeight
  let oneTenthWidth
  let needToLeftRubber
  rubber.style.left = `${needToLeftRubber}px` //only want it to do this on page load
  let runOnce = true
  let galleryCounterNum = 0

  resumeClose.style.display = 'none'

  function resizeNav () {
    resumeSizing()
    galleryScrollTo(galleryCounterNum)
    imgSlider.style.transition = "none";
    oneTenthHeight = (window.innerHeight)/10
    oneTenthWidth = (window.innerWidth)/10
    if (window.innerWidth/window.innerHeight <= .797){
      rubber.style.fontSize = '4.5vh'
    }else if (window.innerWidth/window.innerHeight <= 1.02) {
      rubber.style.fontSize = '7vh'
    } else {
      rubber.style.fontSize = '8.88vh'
    }
    needToLeftRubber = (window.innerWidth/2) - (rubber.getBoundingClientRect().width/2)
    if (window.innerWidth > 1050) {
      letters.forEach(letter => {
        letter.style.fontSize = `${oneTenthWidth*(2/3)}px`
        letter.style.lineHeight =`${oneTenthWidth*(2/3)}px`
      })
    } else if (window.innerWidth < 1050 && window.innerWidth > 900) {
      letters.forEach(letter => {
        letter.style.fontSize = `${oneTenthWidth*(3/4)}px`
        letter.style.lineHeight =`${oneTenthWidth*(3/4)}px`
      })
    } else if (window.innerWidth < 900) {
      letters.forEach(letter => {
        letter.style.fontSize = `${oneTenthWidth}px`
        letter.style.lineHeight =`${oneTenthWidth}px`
      })
    }
    sectionCoords = []
    galleryWidth = gallery.offsetWidth
    sections.forEach(section => {
      sectionCoords.push(section.offsetTop +.5)
    })
    navItem = Array.from(aNav)
    firstNav = navItem[0].offsetLeft
    lastNav = navItem[navItem.length-1].offsetLeft + navItem[navItem.length-1].getBoundingClientRect().width
    const navClientWidths = []
    navItem.forEach(nav => navClientWidths.push(nav.clientWidth))
    const sortedClientWidth = navClientWidths.sort(function(a, b) {
      return a - b;
    });
    fix = sortedClientWidth[1]
    aNav.forEach(nav => {
      nav.style.width = `${sortedClientWidth[sortedClientWidth.length-1]}px`
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
    if ((titlePic.getBoundingClientRect().height - window.innerHeight) > 2*currentHeight) {
      onlyTitle.forEach(title => title.style.opacity = '1')
    } else {
      onlyTitle.forEach(title => title.style.opacity = '0')
    }
    if (currentHeight < sectionCoords[1]){
      titlePic.style.top = `${-currentHeight}px`
      const navName = myName.getBoundingClientRect().bottom
      const topName = myName.getBoundingClientRect().top
      if (navName <= nav.getBoundingClientRect().top) {
        myName.style.top = `${(currentHeight*.5)}px`
      }
      if (topName >= 0) {
        myName.style.top = `${(currentHeight*.5)}px`
      }
    }
    if (currentHeight > sectionCoords[1]){
      arrowDown.style.display = `none`
    } else {
      arrowDown.style.display = `block`
    }
    if (currentHeight > sectionCoords[2]){
      fourPic.style.top = `${- (currentHeight-sectionCoords[2])}px`
      fixedDiv.style.display = `none`
      placeOnImage4.style.display = `flex`
    } else {
      fixedDiv.style.display = `flex`
      placeOnImage4.style.display = `none`
    }
  }

  function fixNav(){
    if(window.scrollY >= topOfNav) {
      document.body.classList.add('fixed-nav')
      logo.classList.add('showLogo')
      document.body.style.paddingTop = nav.offsetHeight + 'px';
      myName.style.display = 'none'
      myName.style.top = '0'
      rubber.classList.add('rubberBand')
      letters.forEach(letter => letter.style.color = 'white')
      if (runOnce) {
        rubber.style.left = `${needToLeftRubber}px`
        setTimeout(() => {
          rubber.style.left = '0px'
          links.forEach(link => link.style.opacity = '1')
        }, 1000)
        runOnce = false
      }
    } else {
      logo.classList.remove('showLogo')
      rubber.classList.remove('rubberBand')
      document.body.classList.remove('fixed-nav')
      document.body.style.paddingTop = 0;
      rubber.style.left = `${needToLeftRubber}px`
      runOnce = true
      myName.style.display = 'block'
      links.forEach(link => link.style.opacity = '0')
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
    imgSlider.style.transition = "left 1s";
    galleryScrollTo (counter)
    projectDetailMover ()
  }

  function gallerySelector(e) {
    if (e.target.className === 'indGalItem') return
    const targetName = parseInt(e.target.parentNode.getAttribute("name"))
    imgSlider.style.transition = "left 1s";
    galleryScrollTo(targetName)
    counter = targetName
    projectDetailMover ()
  }

  function galleryScrollTo (countNum) {
    galleryCounterNum = countNum
    innerGalleryDivs.forEach(item => item.classList.remove('selectedGallery'))
    innerGalleryDivs[countNum].classList.add('selectedGallery')
    const galleryNum = imgSlider.childElementCount
    const currentLeft = (galleryWidth * (-countNum)) // ***
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
  }

  function projectDetailMover () {
    const windowWidth = window.innerWidth
    const intoToLeft = innerGalleryInfo.getBoundingClientRect().left
    const howMuchToRight = windowWidth - intoToLeft
    innerGalleryInfo.style.left = `${howMuchToRight}px`
    setTimeout(() => {
      galleryInfo[lastCountnum].classList.remove('projectDetailsShow')
      lastCountnum = galleryCounterNum
      galleryInfo[galleryCounterNum].classList.add('projectDetailsShow')
      innerGalleryInfo.style.left = '0px'
    },500)
  }


  function randomLetterColor (e) {
    const colorsILike = ['deepskyblue','cyan','turquoise','mediumturquoise','aqua','darkturquoise','skyblue','lightskyblue','steelblue','dodgerblue','cornflowerblue','royalblue','midnightblue','navy']
    const randNumbColor = Math.floor(Math.random() * colorsILike.length)
    e.target.style.color = `${colorsILike[randNumbColor]}`
  }

  function changeNameColorBack () {
    letters.forEach(letter => letter.style.color = 'crimson')
    setTimeout(()=> {letters.forEach(letter => letter.style.color = 'white')}, 50)
  }

  let titleCounter = 0
  const tibits = ['Full Stack Web Developer', 'Bates College Graduate', 'Accepting Freelance Work', 'Would Rather Be Skiing']
  setTimeout(() => {mySkills.classList.add('flipOut')},2500)
  setInterval(() => {
    titleCounter ++
    mySkills.innerHTML = `-${tibits[titleCounter]}-`
      mySkills.classList.remove('flipOut')
      mySkills.classList.add('flipIn')
    if (titleCounter >= tibits.length -1 ) {
      titleCounter = -1
    }
    setTimeout(() => {
    mySkills.classList.add('flipOut')
    mySkills.classList.remove('flipIn')
    }, 2500)
  }, 3000)

  function mappingStar() {
    // const starData = [{skill:'CSS(3)', star:5},{skill:'HTML(5)', star:5},{skill:'Javascript', star:5},{skill:'Command Line', star:5},{skill:'GitHub', star:5},{skill:'Microsoft Office', star:5},{skill:'JQuery', star:4},{skill:'React', star:4},{skill:'Node.js', star:4},{skill:'Express.js', star:4},{skill:'JSON', star:4},{skill:'MySQL', star:4},{skill:'MongoDB', star:3},{skill:'Redux', star:3},{skill:'Photoshop', star:3},{skill:'Stata', star:2},{skill:'Eviews', star:2},{skill:'Ruby', star:2},{skill:'Rails', star:2}]
    const starData = [{skill:'CSS(3)', star:5},{skill:'HTML(5)', star:5},{skill:'Javascript', star:5},{skill:'Command Line', star:5},{skill:'JQuery', star:4},{skill:'React', star:4},{skill:'Node.js', star:4},{skill:'Express.js', star:4},{skill:'MySQL', star:4},{skill:'Redux', star:3},{skill:'Photoshop', star:3},{skill:'Ruby', star:2},{skill:'Rails', star:2}]

    starData.forEach(star => {
      const skillHolder = document.createElement("DIV")
      skillHolder.classList.add('skillHolder')
      const abilityTitle = document.createElement("SPAN")
      abilityTitle.classList.add('abilityTitle')
      abilityTitle.innerHTML = `${star.skill}`
      skillHolder.appendChild(abilityTitle)
      const abilityScore = document.createElement("SPAN")
      for (i=1; i <= 5; i++) {
        const fiveI = document.createElement("I")
        fiveI.classList.add('fa')
        if (star.star >= i) {
          fiveI.classList.add('fa-star')
        } else {
          fiveI.classList.add('fa-star-o')
        }
        fiveI.classList.add('fa-1x')
        abilityScore.appendChild(fiveI)
      }
      skillHolder.appendChild(abilityScore)
      starPlacement.appendChild(skillHolder)
    })
  }

  function showResume () {
    resumeClose.style.display = 'block'
    const aTagButton = document.createElement('a');
    aTagButton.setAttribute('href',"Pic/MatthewKeigwin.jpg");
    aTagButton.setAttribute('download', 'MatthewKeigwin');
    resumeButton.innerHTML = ''
    aTagButton.innerHTML = "Download Resume";
    resumeButton.appendChild(aTagButton);
    starPlacement.style.width = '95%'
    starPlacement.style.height = '100%'
    resumeTitle.innerHTML = 'Resume'
    while (starPlacement.firstChild) {
      starPlacement.removeChild(starPlacement.firstChild);
    }
    // const closeCoordsX = (starPlacement.getBoundingClientRect().left + starPlacement.getBoundingClientRect().left - resumeClose.getBoundingClientRect().width)
    // const closeCoordsY = (starPlacement.getBoundingClientRect().top)
    // resumeClose.style.top = `${closeCoordsY}px`
    // resumeClose.style.left = `${closeCoordsX}px`
    setTimeout(() => {
        starPlacement.style.backgroundImage = 'url(Pic/MatthewKeigwin.jpg)';
        starPlacement.style.backgroundSize = 'cover'
        starPlacement.style.backgroundAttachment = 'local'
        starPlacement.style.overflowY = 'scroll'
      setTimeout(() => {
        resumeSizing()
        starPlacement.appendChild(backgroundScroll)
      },100)
    }, 500)
  }

  function resumeSizing () {
    starPlacement.style.backgroundSize = 'cover'
    const imageSrc = starPlacement.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
    const image = new Image();
    image.src = imageSrc;
    const width = image.width, height = image.height;
    const widthToHeightVariable = starPlacement.getBoundingClientRect().width/width
    const adjustedHeight = height*widthToHeightVariable
    backgroundScroll.style.height = `${adjustedHeight}px`
    backgroundScroll.style.width = `100%`
  }

  function closeResume () {
    starPlacement.style.backgroundImage = ''
    mappingStar()
    backgroundScroll.style.height = `0px`
    backgroundScroll.style.width = `0px`
    resumeButton.removeChild(resumeButton.firstChild)
    resumeButton.innerHTML = 'Click here to view full resume'
    starPlacement.style.width = '50vw'
    starPlacement.style.height = 'auto'
    resumeClose.style.display = 'none'
    resumeTitle.innerHTML = 'Select Skills'
  }

  mappingStar()
  mapGallery()
  resizeNav()
  scrollLocater()
  window.addEventListener('scroll', debounce(scrollLocater))
  window.addEventListener("resize", resizeNav);
  navItem.forEach(nav => nav.addEventListener('click', debounce(navClickTransition, 1250)))
  arrows.forEach(arrow => arrow.addEventListener('click', debounce(galleryCounter,visibilityTime)))
  mail.addEventListener('click', () => location.href = 'mailto:mattkeigwin@gmail.com?subject=MattKeigwin.com Inquiry')
  letters.forEach(letter => letter.addEventListener('mouseover', randomLetterColor))
  document.body.addEventListener('click', changeNameColorBack)
  arrowDown.addEventListener('click', () => {scrollTo(document.body, sectionCoords[1], 1250)})
  resumeButton.addEventListener('click', showResume)
  resumeClose.addEventListener('click', closeResume)
})
