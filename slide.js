
imgs = [{img: `slide/s1.jpg`, link: `https://www.youtube.com`}, {img: `slide/s2.jpg`, link: `https://www.youtube.com`}, {img: `slide/s3.jpg`, link: `https://www.google.com`}, {img: `slide/s4.jpg`, link: `https://www.google.com`}, {img: `slide/s5.jpg`, link: `https://www.google.com`}];

for(let img of imgs) {
  document.getElementById(`gallery`).innerHTML += `<a href="${img.link}" class="item"><img src="${img.img}" class="item-img"></a>`;
}

let slideLength = imgs.length;
document.getElementById(`gallery`).style.width = `${slideLength * 100}%`;

//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------

let slideGallery = document.getElementById(`gallery-wrapper`);

async function slide() {
    slideGoing = true // Status slide
    delaySlide = 6000 // 6 secs

    const buttonLeft = document.getElementById(`slide-button-left`);
    const buttonRight = document.getElementById(`slide-button-right`);
    let slideWidth = 0;

    for(i = 0; i < slideLength; i++) {

        function checkSize() {
            slideWidth = slideGallery.getBoundingClientRect().width // slide size width
        }
        checkSize()

        slide = i

        buttonLeft.onclick = function(){
            slideGoing = false
            checkSize()

            if(slide - 1 < 0) {
                slide = 4
            } else {
                slide -= 1
            }
            i = slide
            // scroll
            slideGallery.scrollTo({ top: 0, left: slideWidth * slide });
        }
        buttonRight.onclick = function(){
            slideGoing = false
            checkSize()

            if(slide + 1 > 4) {
                slide = 0
            } else {
                slide += 1
            }
            i = slide
            // scroll
            slideGallery.scrollTo({ top: 0, left: slideWidth * slide });
        }


        window.addEventListener('resize', function(event) {
            checkSize()
            
            slideGallery.style.scrollBehavior = `auto` // Remove Smooth, goes auto

            slideGallery.scrollTo({ top: 0, left: slideWidth * slide });

            slideGallery.style.scrollBehavior = `smooth` // Return smooth
        }, true);


        slideGallery.scrollTo({ top: 0, left: slideWidth * slide });
        
        await new Promise(delay => setTimeout(delay, delaySlide));

        if(i === 4) {
            i = -1
        }
        if(!slideGoing) {
            break
        } else {
            continue
        }
    }
}
