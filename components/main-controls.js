class MainControl extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
      .controlContainer {
        display: flex;
        list-style-type: none;
        padding-left: 1em;
        position: fixed;
      }

      .burgerControl {
        font-size: 1.6em;
        color: rgb(170, 170, 170);
        writing-mode: vertical-rl;
        border: inherit;
        background: inherit;
      }

      .burgerControl:active { border: inherit; background: inherit; }
      #languageDa {border: inherit; background: inherit; }
      #languageEng {border: inherit; background: inherit; }
      .language:active {border: inherit; background: inherit; }
      </style>


      <div class="controlContainer">
        <button type="button" aria-expanded='false' class='burgerControl' alt='Navigation'>
          <img src="../images/burger.svg" alt="Navigation burger" width="20px" height="20">
        </button>
        <button type="button" id="languageDa" aria-pressed='false' lang="da">Dansk</button>
        <button type="button" id="languageEng" aria-pressed='true' lang="en">English</button>
      </div>
    `;
  }
}

customElements.define('main-controls', MainControl);
