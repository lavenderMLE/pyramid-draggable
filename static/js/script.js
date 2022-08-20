//  mouse event for drag and drop
// Consts
let sliderContainer = document.querySelector('.slider-container');
let innerSlider = document.querySelector('.inner-slider');

let pressed = false;
let startX;
let x;
let offsetX ;




// Drag and Draop funcion
const sorting = function() {
  
  const columns = document.querySelectorAll(".column");
  const base_body = document.querySelector('div.base_body') ;
  
  columns.forEach((column) => {
    new Sortable(column, {
      ghostClass: "ghost",      
      group: {
        // name: "shared",         
        put: function( to, from ) {
          const to_className = to.el.className ;          
          
          if ( to_className.indexOf('inner-slider') > -1 || 
               to_className.indexOf('leftside') > -1 ) 
          {
            return true ;
          }          
          return ( !(to.el.children.length == 2 ) )           
        }
      },
      sort: false,      
      animation: 100,
      handle: '.leftCorner-handle',
      
      onEnd: function(e) {
        const target = e.to ;

        if (  $(window).width() < 800 && 
              target.className.indexOf('inner-slider') > -1 ) 
        {
          let numCards = $('div.inner-slider')[0].children.length ;
          if ( numCards > 1) {
            $('div.inner-slider').width( 'auto' ) ;    
          }                              
        }
      }
      
    });
  });
  
}
sorting();

// Making Cards on the desktop
const drawCards_desktop = function() {  
  let allofCards = ( $('div.list-group-item').length ) ;
  if ( allofCards == 0) {
    for( let i=1; i <=10; i++) {
      const innerHTML = '<div class="list-group-item" ><span class="leftCorner-handle"aria-hidden="true"></span>Card'+i+'</div>' ;
      $('div.leftside').append( innerHTML ) ;
    }
    return
  } else {
    let numofCards_mobile = $('div.inner-slider').text().replace(/\s/g,'').split('Card')  ;
    
    for ( let i = 1; i < numofCards_mobile.length; i ++ ) {
      const innerHTML = '<div class="list-group-item" ><span class="leftCorner-handle"aria-hidden="true"></span>Card'+ numofCards_mobile[i] +'</div>' ;
      $('div.leftside').append( innerHTML ) ;
    }
    $('div.inner-slider').empty() ;    
  }
}

const drawCards_mobile = () => {
  let allofCards = ( $('div.list-group-item').length ) ;
  if ( allofCards == 0) {
    for( let i=1; i <=10; i++) {
      const innerHTML = '<div class="list-group-item" ><span class="leftCorner-handle"aria-hidden="true"></span>Card'+i+'</div>' ;
      $('div.inner-slider').append( innerHTML ) ;
    }
    return
  } else {
    let numofCards_mobile = $('div.leftside').text().replace(/\s/g,'').split('Card')  ;
    
    for ( let i = 1; i < numofCards_mobile.length; i ++ ) {
      const innerHTML = '<div class="list-group-item" ><span class="leftCorner-handle"aria-hidden="true"></span>Card'+ numofCards_mobile[i] +'</div>' ;
      $('div.inner-slider').append( innerHTML ) ;
    }
    $('div.leftside').empty() ;    
  }
}

//  Mobile responsive
if ( $(window).width() < 800) {
  $(".slider-container").show();
  $(".leftside").hide();
  
  drawCards_mobile() ;
  
} else {
  $(".slider-container").hide();
  $(".leftside").show();
  
  drawCards_desktop() ;
}

$(window).resize(function () {
  if ($(window).width() < 800) {
    $(".slider-container").show();
    $(".leftside").hide();        
    drawCards_mobile() ; 
  } else {
    $(".slider-container").hide();
    $(".leftside").show();
    drawCards_desktop() ;
  }
});


// Desktop viewpoint
$('div.slider-container')
  .mouseenter( function() {
    sliderContainer.style.cursor = "grab";
    // $('div.inner-slider').removeClass('column') ;
    // sorting() ;
    
    if( $('div.inner-slider').children().length > 1 ) {
      $('div.inner-slider').width( 'auto' ) ;
    } else {
      $('div.inner-slider').width( '200px' ) ;
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

// Mobile actions 
sliderContainer.addEventListener("touchstart", (e) => {
  pressed = true;
  offsetX = e.touches[0].clientX - ( $('body').width() - $('div.slider-container').width() ) / 2 ;
  startX = offsetX - innerSlider.offsetLeft;
  $('div.inner-slider').addClass('column') ;
  sorting() ;
  
  let numCards = $('div.inner-slider')[0].children.length ;
  if ( numCards > 1) {
    $('div.inner-slider').width( 'auto' ) ;    
  } else {
    $('div.inner-slider').width( '200px' ) ;
  }
  
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

// const setGap = ( innerSlider, beforeGap ) => {
  
//   if ( parseInt( $('div.inner-slider').width() ) < parseInt( $('div.slider-container').width() ) ) {
//     let numCard = $('div.card').length 
//     let buffer_newGap = ( parseInt( $('div.slider-container').width() ) - parseInt( $('div.inner-slider').width() ) ) / (numCard - 1);
    
//     innerSlider.style.gap = `${ buffer_newGap + beforeGap }px`;    
//   }
// }


setInterval(() => {
  checkBoundary();
}, 10);





