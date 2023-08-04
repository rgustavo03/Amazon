const produtosContainer = [...document.querySelectorAll(`.produtos-container-produtos`)];

  const prevBtn = [...document.querySelectorAll(`.produtos-container-arrow-left`)];
  const nextBtn = [...document.querySelectorAll(`.produtos-container-arrow-right`)];

  let containerWidth
  
  produtosContainer.forEach((item, i) => {
    function checkSizeContainer() {
      let containerDimensions = document.querySelectorAll(`.produtos-container`)[i].getBoundingClientRect();
      containerWidth = containerDimensions.width * 0.85;
    }

    prevBtn[i].addEventListener('click', () => {
      checkSizeContainer()
      item.scrollLeft -= containerWidth;
    })

    nextBtn[i].addEventListener('click', () => {
      checkSizeContainer()
      item.scrollLeft += containerWidth;
    })

    //dragg
    
  });
