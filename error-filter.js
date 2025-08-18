// Error filtering para produção
(function() {
    'use strict';
    
    // Lista de erros que devem ser filtrados (extensões do navegador)
    const FILTERED_ERRORS = [
        'pagead2.googlesyndication.com',
        'chrome-extension',
        'moz-extension',
        'safari-extension',
        'PIN Company Discounts',
        'Vue Devtools',
        'Failed to fetch',
        'A listener indicated an asynchronous response',
        'web_accessible_resources',
        'pinComponent.js',
        'contentscript.js',
        'Empty token!',
        'Invalid data',
        'ERR_FAILED'
    ];
    
    // Interceptar erros do console apenas em produção
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = function(...args) {
            const message = args.join(' ');
            if (!FILTERED_ERRORS.some(filter => message.includes(filter))) {
                originalError.apply(console, args);
            }
        };
        
        console.warn = function(...args) {
            const message = args.join(' ');
            if (!FILTERED_ERRORS.some(filter => message.includes(filter))) {
                originalWarn.apply(console, args);
            }
        };
        
        // Interceptar erros não capturados
        window.addEventListener('error', function(event) {
            const message = event.message || '';
            if (FILTERED_ERRORS.some(filter => message.includes(filter))) {
                event.preventDefault();
                return true;
            }
        });
        
        // Interceptar Promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            const message = event.reason ? event.reason.toString() : '';
            if (FILTERED_ERRORS.some(filter => message.includes(filter))) {
                event.preventDefault();
                return true;
            }
        });
    }
})();
