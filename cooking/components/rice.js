class Rice extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <button class="insertedRecipe">
      <h3>Ris</h3>
      </button>

      <div class="insertedIngredienser">
      <p class="antal">(3 - 4 personer)		(Start &frac12; time f&oslash;r)</p>
      <b>Ingredienser:</b>

      <p><label><input type="checkbox"> &nbsp;3,75 dL vand (Altid 1,5 dL vand til 1 dL ris)</label></p>
      <p><label><input type="checkbox"> &nbsp; 2,5 dL ris (Skriv ned et sted hvor meget ris dem du laver mad til normalt spiser)</label></p>
      <p><label><input type="checkbox"> &nbsp; 1 tsk salt</label></p>
      </div>

      <div class="insertedHowto"><b>Fremgangsm&aring;de:</b>

      <p><label><input type="checkbox"> &nbsp; Bring 3,75 dL vand i kog i en lille gryde.</label></p>
      <p><label><input type="checkbox"> &nbsp; Skyl imens 2,5 dL ris i en si</label></p>
      <p><label><input type="checkbox"> &nbsp; Kom 1 tsk salt oven i de v&aring;de ris (for ikke at glemme salt)</label></p>
      <p><label><input type="checkbox"> &nbsp; N&aring;r vandet koger kommes risene i, og der r&oslash;res rundt. L&aelig;g l&aring;g p&aring; </label></p>
      <p><label><input type="checkbox"> &nbsp; S&aelig;t minuturet p&aring; 12 minutter og skru ned p&aring; 1 (ud af 9)</label></p>
      <p><label><input type="checkbox"> &nbsp; S&aelig;t evt. tallerkenerne p&aring; l&aring;get s&aring; de kan blive varme</label></p>
      <p><label><input type="checkbox"> &nbsp; N&aring;r minuturet ringer slukkes for blusset, og minuturet s&aelig;ttes igen p&aring; 12 minutter</label></p>
      <p><label><input type="checkbox"> &nbsp; Risen er klar n&aring;r minuturet ringer, men de kan sagtens st&aring; et kvarter mere</label></p>

      <button class="slut">(Slut)</button>

      </div>
    `;
  }
}

customElements.define('rice-recipe', Rice);
