class BurgerMenuControl extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
        .burgerItem {
          display: none;
          border: 3px ridge;
          border-radius: 15px;
          padding: 6px;
          margin: 4px 0px;
        }

        .burgerItem:hover {
          border: 4px groove;
          margin: 3px 0px;
        }

        .burgerHeading {
          display: none;
          border: 3px ridge;
          border-radius: 15px 15px 5px 5px;
          padding: 6px;
          margin: 4px 0px;
        }

        .burgerHeading:hover {
          border: 4px groove;
          margin: 3px 0px;
        }

        .secondLevelBurgerText {
          display: grid;
          justify-content: flex-end;
          padding: .2em;
        }

        #menuContainer {
          position: fixed;
          top: 35px;
          width: 205px;
        }
      </style>

      <div id="menuContainer">
        <div id='FuzzyPlan' class="burgerText burgerItem"  aria-label='FuzzyPlan, a planning tool'> FuzzyPlan (beta) </div>
        <div id='cookbook' class="burgerText burgerItem" aria-label='Step-by-step cookbook'> Step-by-step cookbook </div>
        <div class="burgerHeading">
          <div id='programming' class="burgerText">Programming</div>
          <div id='journey' class='secondLevelBurgerText' lang='en' style='display: none' aria-label='My journey into programming'>My journey</div>
          <div id='python' class='secondLevelBurgerText' lang='en' style='display: none' aria-label='Python'>Pyton</div>
          <div id='rust' class='secondLevelBurgerText' lang='en' style='display: none' aria-label='Rust'>Rust</div>
          <div id='git' class='secondLevelBurgerText' lang='en' style='display: none' aria-label='Git'>Git</div>
        </div>
        <div class="burgerHeading">
          <div id='cooking' class="burgerText">Cooking</div>
          <div id='cookbooks' class='secondLevelBurgerText burgerText' lang='en' style='display: none' aria-label='Cookbooks'>Cookbooks</div>
          <div id='baking' class='secondLevelBurgerText burgerText' lang='en' style='display: none'  aria-label='Baking'>Baking</div>
          <div id='tempMix' class='secondLevelBurgerText burgerText' lang='en' style='display: none'
           aria-label='Temperature mixer for getting 37&deg; hot water for baking'>Temperature mixer</div>
        </div>
        <div id='home' class="burgerText burgerItem" aria-label='Home'> Home </div>
        <div id='about' class="burgerText burgerItem" aria-label='About'> About </div>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
