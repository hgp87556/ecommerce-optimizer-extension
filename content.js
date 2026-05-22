// Content script that runs on web pages
// Listens for messages from popup and injects scripts to extract page data

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const content = {
            url: window.location.href,
            html: document.documentElement.outerHTML,
            title: document.title,
            meta: extractMeta(),
            headings: extractHeadings(),
            images: extractImages(),
            buttons: extractButtons(),
            links: extractLinks(),
            performance: getPerformanceMetrics()
        };
        sendResponse(content);
    }
});

function extractMeta() {
    const meta = {};
    document.querySelectorAll('meta').forEach(tag => {
        const name = tag.getAttribute('name') || tag.getAttribute('property');
        const content = tag.getAttribute('content');
        if (name && content) {
            meta[name] = content;
        }
    });
    return meta;
}

function extractHeadings() {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .slice(0, 20)
        .map(h => ({
            level: h.tagName,
            text: h.textContent.trim(),
            id: h.id,
            className: h.className
        }));
}

function extractImages() {
    return Array.from(document.querySelectorAll('img'))
        .slice(0, 20)
        .map(img => ({
            src: img.src,
            alt: img.alt,
            title: img.title,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            isVisible: isElementVisible(img)
        }));
}

function extractButtons() {
    return Array.from(document.querySelectorAll('button, [role="button"], input[type="submit"]'))
        .slice(0, 20)
        .map(btn => ({
            text: btn.textContent?.trim() || btn.value || '',
            ariaLabel: btn.getAttribute('aria-label'),
            className: btn.className,
            type: btn.type || 'button'
        }));
}

function extractLinks() {
    return Array.from(document.querySelectorAll('a[href]'))
        .slice(0, 30)
        .map(link => ({
            text: link.textContent.trim(),
            href: link.href,
            target: link.target
        }))
        .filter(link => link.text.length > 0);
}

function getPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const t = window.performance.timing;
        return {
            navigationStart: t.navigationStart,
            loadEventEnd: t.loadEventEnd,
            loadTime: (t.loadEventEnd - t.navigationStart) / 1000,
            domReadyTime: (t.domContentLoadedEventEnd - t.navigationStart) / 1000,
            responseTime: (t.responseEnd - t.requestStart) / 1000
        };
    }
    return {};
}

function isElementVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
