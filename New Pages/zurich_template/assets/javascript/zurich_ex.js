const ELS = (sel, par) => (par || document).querySelectorAll(sel);
const EL = (sel, par) => (par || document).querySelector(sel);
const mod = (n, m) => (n % m + m) % m;

setTimeout(function() {
   /*======================== =====================*/
   /*=============== LIST ARTICLE =================*/
   /*======================== =====================*/

   var isMobileVersion = document.getElementsByClassName('article-search');
   if (isMobileVersion.length > 0) {
      var nameSearch = document.getElementsByClassName("search-box-input");
      nameSearch[nameSearch.length-1].placeholder = "Cari kata kunci...";

      var nameSearchPareng = nameSearch[nameSearch.length-1].parentElement.parentElement.parentElement;
      var nameSearchPar = nameSearch[nameSearch.length-1].parentElement.parentElement;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = "search-box-button icon icon--filter-horizontal_24_solid textfield__icon hidden-sm-up";
      nameSearchPareng.append(button);
      nameSearchPareng.style.display = 'flex';
      nameSearchPar.style.flex = 1;

      var functionShowMobile = function() {
         var checklistWrapper = document.getElementsByClassName('checklist-filter-wrapper');
         checklistWrapper[0].style.transform = "translate3d(0%, 0, 0)";
      };
      button.addEventListener('click', functionShowMobile);

      var parentText = nameSearchPareng.parentElement.parentElement;
      var parentH3Div = document.createElement('div');
      parentH3Div.style.padding = 'unset';
      parentH3Div.className = 'col-md-12';
      var parentH3text = document.createElement('h3');
      parentH3text.innerHTML = 'Baca juga informasi menarik lainnya dari Zurich';
      parentH3text.className = "nameSearch";
      parentH3Div.append(parentH3text);
      parentText.prepend(parentH3Div);

      var listTeaser = document.getElementsByClassName("teaser--card");
      for (var i = 0; i < listTeaser.length; i++) {
         listTeaser[i].classList.add("teaserCostume"+i);
      }

      var listTeaser = document.getElementsByClassName("teaser");
      for (var i = 0; i < listTeaser.length; i++) {
         listTeaser[i].classList.add("teaserCostume"+i);
      }
   }

   /*======================== =====================*/
   /*================= END LIST ARTICLE ===========*/
   /*======================== =====================*/

   /*======================== =====================*/
   /*================= END LIST ARTICLE ===========*/
   /*======================== =====================*/
   var isMobileVersion = document.getElementsByClassName('search-page');
   if (isMobileVersion.length > 0) {
      var nameSearch = document.getElementsByClassName("search-box-input");

      var nameSearchPareng = nameSearch[nameSearch.length-1].parentElement.parentElement.parentElement;
      var nameSearchPar = nameSearch[nameSearch.length-1].parentElement.parentElement;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = "search-box-button icon icon--filter-horizontal_24_solid textfield__icon hidden-sm-up";
      nameSearchPareng.append(button);
      nameSearchPareng.style.display = 'flex';
      nameSearchPar.style.flex = 1;

      var functionShowMobile = function() {
         var checklistWrapper = document.getElementsByClassName('checklist-filter-wrapper');
         checklistWrapper[0].style.transform = "translate3d(0%, 0, 0)";
      };
      button.addEventListener('click', functionShowMobile);
   }
   /*======================== =====================*/
   /*=============== LIST ARTICLE =================*/
   /*======================== =====================*/

   ELS(".side-slider").forEach(EL_par => {
      const EL_slider = EL(".product-slider", EL_par);
      const ELS_items = ELS(".product-slider-item", EL_par);
      const ELS_items_width = ELS_items[0].scrollWidth;
      const sub = +EL_par.dataset.items ?? 1;
      const tot = Math.ceil(ELS_items.length / sub);
      let c = 0;

      const anim = () => EL_slider.style.transform = `translateX(-${c*ELS_items_width}px)`;
      const animActive = (evt) => {
         for (var i = 0; i < tot; i++) {
            ELS(".list_dot a", EL_par)[i].classList.remove('active');
         }
         if (evt == null) {
            ELS(".list_dot a", EL_par)[c].classList.add('active');
         }else{
            ELS(".list_dot a", EL_par)[evt.currentTarget.dataset.items].classList.add('active');
         }
      };
      const prev = () => (c = mod(c-1, tot),animActive(), anim());
      const next = () => (c = mod(c+1, tot),animActive(), anim());
      const numberhit = (evt) => (c = mod(evt.currentTarget.dataset.items, tot),animActive(evt), anim());

      for (var i = 0; i < tot; i++) {
         var listdot = document.createElement('a');
         var listspandot = document.createElement('span');
         listspandot.innerHTML = i+1;
         listdot.dataset.items = i;
         if (i == 0) {
            listdot.classList.add('active');
         }
         listdot.append(listspandot);
         listdot.addEventListener("click", numberhit);
         EL(".list_dot", EL_par).append(listdot);
      }

      EL(".prev", EL_par).addEventListener("click", prev);
      EL(".next", EL_par).addEventListener("click", next);
   });

   ELS(".genex-slider").forEach(EL_par => {
      const EL_slider = EL(".genex-list-slider", EL_par);
      const ELS_items = ELS(".genex-list-slider-item", EL_par);
      const ELS_items_width = ELS_items[0].scrollWidth;
      const sub = +EL_par.dataset.items ?? 1;
      const tot = Math.ceil(ELS_items.length / sub);
      let c = 0;

      const anim = () => EL_slider.style.transform = `translateX(-${c*ELS_items_width}px)`;
      const animActive = (evt) => {
         for (var i = 0; i < tot; i++) {
            ELS(".list_dot a", EL_par)[i].classList.remove('active');
         }
         if (evt == null) {
            ELS(".list_dot a", EL_par)[c].classList.add('active');
         }else{
            ELS(".list_dot a", EL_par)[evt.currentTarget.dataset.items].classList.add('active');
         }
      };
      const prev = () => (c = mod(c-1, tot),animActive(), anim());
      const next = () => (c = mod(c+1, tot),animActive(), anim());
      const numberhit = (evt) => (c = mod(evt.currentTarget.dataset.items, tot),animActive(evt), anim());

      for (var i = 0; i < tot; i++) {
         var listdot = document.createElement('a');
         var listspandot = document.createElement('span');
         listspandot.innerHTML = i+1;
         listdot.dataset.items = i;
         if (i == 0) {
            listdot.classList.add('active');
         }
         listdot.append(listspandot);
         listdot.addEventListener("click", numberhit);
         EL(".list_dot", EL_par).append(listdot);
      }

      EL(".prev", EL_par).addEventListener("click", prev);
      EL(".next", EL_par).addEventListener("click", next);
   });


   ELS(".carousel-banner").forEach(EL_par => {
      const EL_slider = EL(".slides", EL_par);
      const ELS_items = ELS(".slide", EL_par);
      const ELS_items_width = ELS_items[0].scrollWidth;
      const sub = +1 ?? 1;
      const tot = Math.ceil(ELS_items.length / sub);
      let c = 0;

      const anim = () => {
         for (var i = 0; i < tot; i++) {
            ELS(".slide", EL_par)[i].style.display = 'none';
         }
         ELS(".slide", EL_par)[c].style.display = 'block';
      };
      const prev = () => (c = mod(c-1, tot), anim());
      const next = () => (c = mod(c+1, tot), anim());

      EL(".prev-text", EL_par).addEventListener("click", prev);
      EL(".next-text", EL_par).addEventListener("click", next);

      anim();

      setInterval(function () {next()}, 5000);
   });


   var x, i, j, l, ll, selElmnt, a, b, c;
   x = document.getElementsByClassName("custom-select");
   l = x.length;
   for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < ll; j++) {
         c = document.createElement("DIV");
         c.innerHTML = selElmnt.options[j].innerHTML;
         c.addEventListener("click", function(e) {
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
               if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  var evt = document.createEvent("HTMLEvents");
                  evt.initEvent("change", false, true);
                  s.dispatchEvent(evt);
                  h.innerHTML = this.innerHTML;
                  y = this.parentNode.getElementsByClassName("same-as-selected");
                  yl = y.length;
                  for (k = 0; k < yl; k++) {
                     y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
               }
            }
            h.click();
         });
         b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
         e.stopPropagation();
         closeAllSelect(this);
         this.nextSibling.classList.toggle("select-hide");
         this.classList.toggle("select-arrow-active");
      });
   }
   function closeAllSelect(elmnt) {
      var x, y, i, xl, yl, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
         if (elmnt == y[i]) {
            arrNo.push(i)
         } else {
            y[i].classList.remove("select-arrow-active");
         }
      }
      for (i = 0; i < xl; i++) {
         if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
         }
      }
   }
   document.addEventListener("click", closeAllSelect);
}, 500);

function updateFieldCustomSelect(element) {
   selElmnt = element;
   ll = selElmnt.length;
   var b = EL(".select-items", element.parentElement);
   var c = EL(".select-selected", element.parentElement);
   b.innerHTML = "";
   c.innerHTML = "Pilih Produk";
   for (j = 1; j < ll; j++) {
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
         var y, i, k, s, h, sl, yl;
         s = this.parentNode.parentNode.getElementsByTagName("select")[0];
         sl = s.length;
         h = this.parentNode.previousSibling;
         for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
               s.selectedIndex = i;
               var evt = document.createEvent("HTMLEvents");
               evt.initEvent("change", false, true);
               s.dispatchEvent(evt);
               h.innerHTML = this.innerHTML;
               y = this.parentNode.getElementsByClassName("same-as-selected");
               yl = y.length;
               for (k = 0; k < yl; k++) {
                  y[k].removeAttribute("class");
               }
               this.setAttribute("class", "same-as-selected");
               break;
            }
         }
         h.click();
      });
      b.appendChild(c);
   }
}