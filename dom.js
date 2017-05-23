(function() {
    const nodeMethods = {
        append(child) {
            var childNode = child instanceof Node
                          ? child
                          : document.createElement(child);
            this.appendChild(childNode);
            return this;
        },
        setText(content) {
            this.textContent = content;
            return this;
        },
        clone() {
            return create(this.cloneNode(true));
        },
        hide() {
            this.initialDisplay = this.initialDisplay || this.style.display;
            this.style.display = 'none';
            return this;
        },
        show() {
            if (this.style.display == 'none')
                this.style.display = typeof this.initialDisplay == 'undefined'
                                   ? 'block'
                                   : this.initialDisplay;
            return this;
        },
        toggle() {
            return this.style.display == 'none' ? this.show() : this.hide();
        },
        display(mode) {
            this.style.display = mode;
            return this;
        },
        set() {
            this.setAttribute.apply(this, arguments);
            return this;
        }
    }

    const nodeListMethods = (function() {
        var returnedMethods = {};
        for (let i in nodeMethods) {
            returnedMethods[i] = function(arg) {
                for (let element of this) {
                    element[i](arg || null);
                }
                return this;
            }
        }
        return returnedMethods;
    })();

    function extendNode(obj) {
        return Object.assign(obj, nodeMethods);
    }

    function extendNodeList(obj) {
        return Object.assign(obj, nodeListMethods);
    }

    function create(tag, content, options) {
        var element;
        if (typeof tag === "string") {
            element = extendNode(document.createElement(tag));
            if (content && typeof content == 'string') {
                element.text(content);
            }
        }
        else if (tag && tag instanceof Node) {
            element = extendNode(tag);
        }
        else if (tag && tag instanceof Object) {
            var {tag, content} = tag;
            element = extendNode(document.createElement(tag));
            if (content && typeof content == 'string') {
                element.text(content);
            }
        }
        return element;
    }

    const namedTagFunctions = (function() {
        const tags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'ul', 'li', 'a', 'blockquote'];
        let res = {};
        for (let tag of tags) {
            res[tag] = function(content, options) {
                return create(tag, content || null, options || null);
            }
        }
        return res;
    })();

    function find(selector) {
        let elements = [...document.querySelectorAll(selector)].map(node => extendNode(node));
        return extendNodeList(elements);
    }

    // return create as default function - can be called with dom()
    // expose other methods as properties of dom e.g. dom.find()
    window.dom = Object.assign(create,
        { create, find },
        namedTagFunctions
    );
})();