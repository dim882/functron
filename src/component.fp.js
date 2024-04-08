var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function createComponent(template, css, attributes) {
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        // #shadowRoot;
        function Component() {
            var _this = _super.call(this) || this;
            _this.attachShadow({
                mode: "open",
                delegatesFocus: true
            });
            _this.shadowRoot.innerHTML = "<style>" + css + "</style>" + template;
            return _this;
        }
        Component.prototype.connectedCallback = function () {
            console.log("Custom element added to page.");
            this.update();
        };
        // static get observedAttributes() {
        //   return attributes;
        // }
        Component.prototype.attributeChangedCallback = function (attrName, oldVal, newVal) {
            console.log("Attribute " + attrName + " changed from " + oldVal + " to " + newVal);
            this.update();
        };
        Component.prototype.update = function () {
            // Update component in response to attribute changes
            if (this.hasAttribute("name")) {
                this.shadowRoot.querySelector('slot[name="title"]').textContent =
                    this.getAttribute("name");
            }
        };
        return Component;
    }(HTMLElement));
    return Component;
}
