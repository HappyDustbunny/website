class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
      header {
        position: fixed;
        left: 75%;
        top: 0;
        width: 100%;
        z-index: -1;
       }

      #topImg  {
        width: 25%;
        opacity: .1;
      }
    </style>

    <header>
      <img id="topImg" src="../images/vinter_top_mobile68x62.jpg"
      srcset="../images/vinter_top_mobile68x62.jpg 68w, ../images/vinter_top_small567x519.jpg 567w, ../images/vinter_top567x519.jpg 567w"
      sizes="25vw" alt="none" >
    </header>
    `;
  }
}

customElements.define('my-header', Header);
