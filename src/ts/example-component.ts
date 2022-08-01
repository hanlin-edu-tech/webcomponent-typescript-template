class ExampleComponent extends HTMLElement {
    constructor() {
        super();

        this.render();
    }

    // html element based function, called when element attached
    connectedCallback() {
    }

    private render() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = HTML_TEMPLATE;
    }
}

const HTML_TEMPLATE =
    `
        <style>
        </style>

        <p>Hello</p>
    `

window.customElements.define("eh-example-component", ExampleComponent)