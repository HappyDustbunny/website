class MainControl extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
      .controlContainer { display: flex; list-style-type: none; padding-left: 1em; }
      .burgerControl { font-size: 1.6em; color: rgb(170, 170, 170); writing-mode: vertical-rl; border: inherit; background: inherit; }
      .burgerControl:active { border: inherit; background: inherit; }
      .languageDa {border: inherit; background: inherit; }
      .languageEng {border: inherit; background: inherit; }
      .language:active {border: inherit; background: inherit; }
      </style>


      <div class="controlContainer">
        <img src="../images/burger.svg" class="burgerControl" alt="Navigation" width="20px" height="20">
        <button type="button" class="languageDa" lang="da">Dansk</button>
        <button type="button" class="languageEng" lang="en">English</button>
      </div>
    `;
  }
}

customElements.define('main-controls', MainControl);
