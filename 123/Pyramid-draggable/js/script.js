const columns = document.querySelectorAll(".column");

columns.forEach((column) => {
  new Sortable(column, {
    group: "shared",
    animation: 100,
    ghostClass: "blue-background-class",
  });
});

const dragStart = (event) => {
  event.dataTransfer.setData("text/plain", event.target.id);
};

const allowDrop = (event) => {
  event.preventDefault();
  event.currentTarget.style.background = "white";
};

const drop = (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const element = document.querySelector(`#${data}`);
  event.currentTarget.style.background = "white";
  try {
    event.target.appendChild(element);
  } catch (error) {
    console.warn("you can't move the item to the same place");
  }
};

if ($(window).width() < 800) {
  $("#owl-demo").show();
  $(".leftside").hide();
  $("#owl-demo").owlCarousel({
    items: 10, //10 items above 1000px browser width
    itemsDesktop: [1000, 7], //5 items between 1000px and 901px
    itemsDesktopSmall: [900, 6], // betweem 900px and 601px
    itemsTablet: [600, 4], //2 items between 600 and 0;
    itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
  });
} else {
  $("#owl-demo").hide();
  $(".leftside").show();
}

$(window).resize(function () {
  if ($(window).width() < 800) {
    $("#owl-demo").show();
    $(".leftside").hide();
    $("#owl-demo").owlCarousel({
      items: 10, //10 items above 1000px browser width
      itemsDesktop: [1000, 7], //5 items between 1000px and 901px
      itemsDesktopSmall: [900, 6], // betweem 900px and 601px
      itemsTablet: [600, 4], //2 items between 600 and 0;
      itemsMobile: false, // itemsMobile disabled - inherit from itemsTablet option
    });
  } else {
    $("#owl-demo").hide();
    $(".leftside").show();
  }
});
