const toast = (function() {
    const div = document.createElement('div');
    window.addEventListener('load', () => document.body.appendChild(div));
    
    const shadowRoot = div.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(Object.assign(document.createElement('style'), {
        textContent: `
            :host {
                position: fixed;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                font-family: Arial;
                pointer-events: none;
            }
            :host>span {
                transition: opacity 0.15s linear;
                align-self: flex-end;
                margin-bottom: 2em;
                border-radius: 99999px;
                z-index: 99999;
                color: #444;
                background-color: rgb(245 245 245 / 85%);
                box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
                padding: 0.5em 1em;
                pointer-events: all;
                cursor: pointer;
                opacity: 0;
            }
        `
    }));
    const span = document.createElement('span')
    shadowRoot.appendChild(span);
    
    const durations = {
        'short': 1000,
        'medium': 2000,
        'long': 5000
    }

    const pendingToasts: Promise<void>[] = [];
    
    let resetTimeout = -1;
    function toast(text: string, duration: 'short' | 'medium' | 'long' = 'short') {
        return new Promise<void>(function(resolveReturn) {
            window.requestAnimationFrame(async function() {
                await Promise.all(pendingToasts);
                clearTimeout(resetTimeout)
                pendingToasts.push(new Promise(function(resolveCompleted) {
                    span.textContent = text;
                    span.style.opacity = '1.0';
                    setTimeout(function() {
                        span.style.opacity = '0.0';
                        resetTimeout = setTimeout(function() {
                            span.textContent = '';
                            resolveReturn();
                        }, 250);
                    pendingToasts.shift();
                    resolveCompleted();
                    }, durations[duration] + 250);
                }));
            });
        });
    }

    return toast;
})();