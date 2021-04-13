class BurgerMenuControl extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
        .burgerText {
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
        }

        #menuContainer {
          width: 205px;
        }
      </style>

      <div id="menuContainer">
      <div id='FuzzyPlan' class="burgerText"> FuzzyPlan (beta) </div>
      <div id='cookbook' class="burgerText"> Step-by-step cookbook </div>
      <div id='programming' class="burgerHeading">
        Programming
        <div id='python' class='secondLevelBurgerText' lang='en'>Pyton</div>
        <div id='rust' class='secondLevelBurgerText' lang='en'>Rust</div>
      </div>
      <div id='cooking' class="burgerHeading">
        Cooking
        <div id='cookbooks' class='secondLevelBurgerText' lang='en'>Cookbooks</div>
        <div id='baking' class='secondLevelBurgerText' lang='en'>Baking</div>
        <div id='tempMix' class='secondLevelBurgerText' lang='en'>Temperature mixer</div>
      </div>
      <div id='about' class="burgerText"> About </div>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
