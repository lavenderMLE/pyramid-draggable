//  Mobile responsive
if ( $(window).width() < 800) {
  $(".slider-container").show();
  $(".leftside").hide();
  
} else {
  $(".slider-container").hide();
  $(".leftside").show();
}

$(window).resize(function () {
  if ($(window).width() < 800) {
    $(".slider-container").show();
    $(".leftside").hide();         
  } else {
    $(".slider-container").hide();
    $(".leftside").show();
  }
});

// Drag and Draop funcion
const sorting = function() {
  
  const columns = document.querySelectorAll(".column");
  
  columns.forEach((column) => {
    new Sortable(column, {
      group: "shared",
      animation: 100,
      ghostClass: "blue-background-class",
    });
  });
}

sorting();

//  mouse event for drag and drop
let sliderContainer = document.querySelector('.slider-container');
let innerSlider = document.querySelector('.inner-slider');

let pressed = false;
let startX;
let x;
let offsetX ;


$('div.slider-container')
  .mouseenter( function() {
    sliderContainer.style.cursor = "grab";
    // $('div.inner-slider').removeClass('column') ;
    // sorting() ;
    
    if( $('div.inner-slider').children().length > 1 ) {
      $('div.inner-slider').width( 'auto' ) ;
    } else {
      $('div.inner-slider').width( $('div.slider-container').width() ) ;
    }
  })
  .mouseleave( function() {    
    pressed = false ;
    sliderContainer.style.cursor = "grab";
    // $('div.inner-slider').addClass('column') ;
    // sorting() ;
  }) ;


sliderContainer.addEventListener("mousedown", (e) => {
  pressed = true;
  offsetX = e.clientX - ($('body').width() - $('div.slider-container').width()) / 2 ;
  startX = offsetX - innerSlider.offsetLeft;
  sliderContainer.style.cursor = "grabbing";
});

sliderContainer.addEventListener("mouseup", () => {
  sliderContainer.style.cursor = "grab";
  pressed = false;      
});

sliderContainer.addEventListener("mousemove", (e) => {
  if (!pressed) return;
  
  e.preventDefault();
  offsetX = e.clientX - ($('body').width() - $('div.slider-container').width()) / 2 ;
  innerSlider.style.left = `${ offsetX - startX}px`;
  checkBoundary();  
});


const checkBoundary = () => {
  let outer = sliderContainer.getBoundingClientRect();
  let inner = innerSlider.getBoundingClientRect();

  // let beforeGap = parseInt( getComputedStyle( innerSlider ).gap );

    
  if (parseInt(innerSlider.style.left) > 0 || 
      parseInt( $('div.inner-slider').width() ) < parseInt( $('div.slider-container').width() )  ) 
  {          
    innerSlider.style.left = "0px";
  }

  // setGap( innerSlider, beforeGap ) ;      
  
  if (inner.right < outer.right) {
      innerSlider.style.left = `-${inner.width - outer.width}px`;
  }
};


// const setGap = ( innerSlider, beforeGap ) => {
  
//   if ( parseInt( $('div.inner-slider').width() ) < parseInt( $('div.slider-container').width() ) ) {
//     let numCard = $('div.card').length 
//     let buffer_newGap = ( parseInt( $('div.slider-container').width() ) - parseInt( $('div.inner-slider').width() ) ) / (numCard - 1);
    
//     innerSlider.style.gap = `${ buffer_newGap + beforeGap }px`;    
//   }
// }


setInterval(() => {
  checkBoundary()
}, 10);



// Mobile actions

 
sliderContainer.addEventListener("touchstart", (e) => {
  pressed = true;
  offsetX = e.touches[0].clientX - ( $('body').width() - $('div.slider-container').width() ) / 2 ;
  startX = offsetX - innerSlider.offsetLeft;
  $('div.inner-slider').addClass('column') ;
  sorting() ;

});

sliderContainer.addEventListener("touchend", () => {
  sliderContainer.style.cursor = "grab";
  pressed = false;    
});

sliderContainer.addEventListener("touchmove", (e) => {
  if (!pressed) return;
  
  e.preventDefault();
  offsetX = e.touches[0].clientX - ($('body').width() - $('div.slider-container').width()) / 2 ;
  innerSlider.style.left = `${ offsetX - startX}px`;
  checkBoundary();  
});

