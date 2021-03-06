const headerHeight = document.querySelector(".header").clientHeight;
const menuItems = document.querySelectorAll(".menu__item");
const menuBtn = document.querySelector(".intro__btn");
const menuList = document.querySelector(".menu__list");

menuBtn.addEventListener("click", function() {
    menuList.classList.toggle("menu__list--active");
    menuList.classList.contains("menu__list--active") ? 
        menuBtn.classList.add("intro__btn--opened")
        : menuBtn.classList.remove("intro__btn--opened");
    });
    
document.addEventListener("scroll", () => {
    window.pageYOffset > 0 ?
        menuBtn.classList.add("intro__btn--scrolled")
        : menuBtn.classList.remove("intro__btn--scrolled");
});

menuItems.forEach( (menuItem) => {
  menuItem.addEventListener("click", function () {
        const sectionOffset = document.querySelector(`.${menuItem.dataset.section}`).offsetTop;
        
        menuBtn.classList.remove("intro__btn--opened");
        window.innerWidth >= 600 ? window.scrollTo({top: (sectionOffset - headerHeight), behavior: "smooth"})
            : window.scrollTo({top: sectionOffset, behavior: "smooth"});
        

        if (menuList.classList.contains("menu__list--active")) {
            menuList.classList.remove("menu__list--active");
        }

    });
});

function testWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
        callback(webP.height == 2);
    }

    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
    
testWebP((support) => {
    if (support) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});
