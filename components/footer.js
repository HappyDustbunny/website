class Footer extends HTMLElement {
   constructor() {
      super();
  }
  connectedCallback() {
    this.innerHTML = `
    <style>
      footer { position: fixed; left: 0; bottom: 0; width: 100%; color: rgba(0, 0, 0, .2); background-color: rgba(255, 255, 255, 0); }
      #bottomImg  { width: 100%; opacity: 15%; }
      #cookieText { font-size: 0.7em; position: absolute; bottom: 0px; right: 16px; }
    </style>

    <footer>
      <img id='bottomImg' src="../images/vinter_bottom_mobile376x92.jpg" src="../images/vinter_bottom_mobile376x92.jpg 376w,
      ../images/vinter_bottom_small2760x669.jpg 2760w, ../images/vinter_bottom_2760x669.jpg 2760w" sizes="100vw" alt="none" >
      <p id='cookieText'>Cookie policy: No cookies for you!</p>
    </footer>
    `;
  }
}

customElements.define('my-footer', Footer);
