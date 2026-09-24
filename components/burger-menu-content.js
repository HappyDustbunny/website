class BurgerMenuControl extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
        .burgerItem {
          display: block;
          width: 90%;
          border: 3px ridge black;
          border-radius: 15px;
          padding: 6px;
          margin: 4px 0px;
          text-decoration: none;
          color: black;
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
          text-decoration: none;
          color: black;
        }

        #menuContainer {
          position: relative;
          top: 35px;
          width: 205px;
        }
      </style>

      <div id="menuContainer">
        <a href='https://madshorn.dk/planner/index.html' id='FuzzyPlan' class="burgerText burgerItem" aria-label='FuzzyPlan, a planning tool'> FuzzyPlan </a>
        <a href='https://cookbook.madshorn.dk/cookbook.html' id='cookbook' class="burgerText burgerItem" aria-label='Step-by-step cookbook'> Step-by-step cookbook </a>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='cooking' class="burgerText">Cooking</summary>
            <a href='https://madshorn.dk/cooking/cookbooks.html' id='cookbooks' class='secondLevelBurgerText burgerText' lang='en' aria-label='Cookbooks'>Cookbooks</a>
            <a href='https://madshorn.dk/baking/index.html' id='baking' class='secondLevelBurgerText burgerText' lang='en' aria-label='Baking'>Baking</a>
            <a href='https://madshorn.dk/baking/tempmix/index.html' id='tempMix' class='secondLevelBurgerText burgerText' lang='en'
            aria-label='Temperature mixer for getting 37&deg; hot water for baking'>Temperature mixer</a>
          </details>
        </div>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='programming' class="burgerText">Programming</summary>
            <a href='https://madshorn.dk/programming/index.html' id='journey' class='secondLevelBurgerText' lang='en' aria-label='My journey into programming'>My journey</a>
            <a href='https://madshorn.dk/programming/python.html' id='python' class='secondLevelBurgerText' lang='en' aria-label='Python'>Pyton</a>
            <a href='https://madshorn.dk/programming/rust.html' id='rust' class='secondLevelBurgerText' lang='en' aria-label='Rust'>Rust</a>
            <a href='https://madshorn.dk/programming/git.html' id='git' class='secondLevelBurgerText' lang='en' aria-label='Git'>Intro to Git</a>
            <a href='https://madshorn.dk/programming/cmdline.html' id='cmdline' class='secondLevelBurgerText' lang='en' aria-label='Bash command line tricks'>Bash command line</a>
            <a href='https://madshorn.dk/programming/vscode.html' id='vscode' class='secondLevelBurgerText' lang='en' aria-label='VSCode shortcuts'>VSCode shortcuts</a>
            <a href='https://madshorn.dk/programming/keymap.html' id='key' class='secondLevelBurgerText' lang='en' aria-label='Git'>Remapping keys</a>
            <a href='https://github.com/HappyDustbunny?tab=repositories' id='myGithub' class='secondLevelBurgerText' lang='en' aria-label='My Github repos'>My Github repos</a>
          </details>
        </div>
        <div class="burgerHeading">
          <details name="menuItem">
            <summary id='psychEd' class="burgerText">Psychoeducation</summary>
            <a href='/psychEd/dementia.html' id='dementia' class='secondLevelBurgerText burgerText' lang='en' aria-label='Dementia'>Dementia</a>
            <a href='/psychEd/autismADHD.html' id='autismADHD' class='secondLevelBurgerText burgerText' lang='en' aria-label='AutismAndADHD'>Autism and ADHD</a>
          </details>
        </div>
        <a href='https://madshorn.dk/index.html' id='home' class="burgerText burgerItem" aria-label='Home'> Home </a>
        <a href='https://madshorn.dk/about/about.html' id='about' class="burgerText burgerItem" aria-label='About'> About </a>
      </div>
    `;
  }
}

customElements.define('burger-menu-content', BurgerMenuControl);
