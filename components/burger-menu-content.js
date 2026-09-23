class BurgerMenuControl extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
        .burgerItem {
          /*display: none;*/
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
          /*display: none;*/
          border: 3px ridge;
          border-radius: 15px 15px 5px 5px;
          padding: 6px;
          margin: 4px 0px;
        }

        .burgerHeading:hover {
          border: 4px groove;
          margin: 3px 0px;
        }
        
        .burgerHeading:has(details[open]) {
          border-radius: 15px;
        }

        .secondLevelBurgerText {
          display: grid;
          justify-content: flex-end;
          padding: .2em;
        }

        #menuContainer {
          position: relative;
          top: 35px;
          width: 205px;
        }
      </style>

      <div id="menuContainer">
        <div id='FuzzyPlan' class="burgerText burgerItem" aria-label='FuzzyPlan, a planning tool'> FuzzyPlan </div>
        <div id='cookbook' class="burgerText burgerItem" aria-label='Step-by-step cookbook'> Step-by-step cookbook </div>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='programming' class="burgerText">Programming</summary>
            <div id='journey' class='secondLevelBurgerText' lang='en' aria-label='My journey into programming'>My journey</div>
            <div id='python' class='secondLevelBurgerText' lang='en' aria-label='Python'>Pyton</div>
            <div id='rust' class='secondLevelBurgerText' lang='en' aria-label='Rust'>Rust</div>
            <div id='git' class='secondLevelBurgerText' lang='en' aria-label='Git'>Intro to Git</div>
            <div id='cmdline' class='secondLevelBurgerText' lang='en' aria-label='Bash command line tricks'>Bash command line</div>
            <div id='vscode' class='secondLevelBurgerText' lang='en' aria-label='VSCode shortcuts'>VSCode shortcuts</div>
            <div id='key' class='secondLevelBurgerText' lang='en' aria-label='Git'>Remapping keys</div>
            <div id='myGithub' class='secondLevelBurgerText' lang='en' aria-label='My Github repos'>My Github repos</div>
          </details>
        </div>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='cooking' class="burgerText">Cooking</summary>
            <div id='cookbooks' class='secondLevelBurgerText burgerText' lang='en' aria-label='Cookbooks'>Cookbooks</div>
            <div id='baking' class='secondLevelBurgerText burgerText' lang='en' aria-label='Baking'>Baking</div>
            <div id='tempMix' class='secondLevelBurgerText burgerText' lang='en'
            aria-label='Temperature mixer for getting 37&deg; hot water for baking'>Temperature mixer</div>
          </details>
        </div>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='psychEd' class="burgerText">Psychoeducation</summary>
            <div id='dementia' class='secondLevelBurgerText burgerText' lang='en' aria-label='Dementia'>Dementia</div>
            <div id='autismADHD' class='secondLevelBurgerText burgerText' lang='en' aria-label='AutismAndADHD'>Autism and ADHD</div>
          </details>
        </div>
        <div id='home' class="burgerText burgerItem" aria-label='Home'> Home </div>
        <div id='about' class="burgerText burgerItem" aria-label='About'> About </div>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
