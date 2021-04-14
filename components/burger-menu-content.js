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

        .burgerHeading {
          display: none;
          border: 3px ridge;
          border-radius: 15px 15px 5px 5px;
          padding: 6px;
          margin: 4px 0px;
        }

        .secondLevelBurgerText {
          display: grid;
          justify-content: flex-end;
          padding: .2em;
        }

        #menuContainer {
          width: 205px;
        }
      </style>

      <div id="menuContainer">
      <div id='FuzzyPlan' class="burgerText burgerItem"> FuzzyPlan (beta) </div>
      <div id='cookbook' class="burgerText burgerItem"> Step-by-step cookbook </div>
      <div class="burgerHeading">
        <div id='programming' class="burgerText">Programming</div>
        <div id='python' class='secondLevelBurgerText' lang='en' style='display: none'>Pyton</div>
        <div id='rust' class='secondLevelBurgerText' lang='en' style='display: none'>Rust</div>
      </div>
      <div class="burgerHeading">
        <div id='cooking' class="burgerText">Cooking</div>
        <div id='cookbooks' class='secondLevelBurgerText burgerText' lang='en' style='display: none'>Cookbooks</div>
        <div id='baking' class='secondLevelBurgerText burgerText' lang='en' style='display: none'>Baking</div>
        <div id='tempMix' class='secondLevelBurgerText burgerText' lang='en' style='display: none'>Temperature mixer</div>
      </div>
      <div id='about' class="burgerText burgerItem"> About </div>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
