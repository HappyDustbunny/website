class BurgerMenuControl extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
      .burgerText { display: none; border: 3px ridge; border-radius: 0px 5px 15px 5px; padding: 5px; margin: 4px 0px; }

      #menuContainer { width: 205px; }
      </style>

      <div id="menuContainer">
      <div id='FuzzyPlan' class="burgerText"> FuzzyPlan (beta) </div>
      <div id='cookbook' class="burgerText"> Step-by-step cookbook </div>
      <div id='programming' class="burgerText"> Programming </div>
      <div id='cooking' class="burgerText"> Cooking </div>
      <div id='about' class="burgerText"> About </div>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
