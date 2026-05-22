const state = {
    currentUrl: '',
    analysisData: null,
    optimizedTemplate: null
};

const elements = {
    urlInput: document.getElementById('urlInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    loading: document.getElementById('loading'),
    results: document.getElementById('results'),
    export: document.getElementById('export'),
    error: document.getElementById('error'),
    errorText: document.getElementById('errorText'),
    featuresList: document.getElementById('featuresList'),
    performanceMetrics: document.getElementById('performanceMetrics'),
    recommendationsList: document.getElementById('recommendationsList'),
    optimizeBtn: document.getElementById('optimizeBtn'),
    previewBtn: document.getElementById('previewBtn'),
    shopifyBtn: document.getElementById('shopifyBtn'),
    htmlBtn: document.getElementById('htmlBtn'),
    backBtn: document.getElementById('backBtn')
};

// Load current tab URL
window.addEventListener('load', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        elements.urlInput.value = tabs[0].url;
    }
});

// Analyze button handler
elements.analyzeBtn.addEventListener('click', async () => {
    const url = elements.urlInput.value.trim();
    
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL');
        return;
    }

    state.currentUrl = url;
    showLoading(true);
    hideError();

    try {
        // Get page content via content script
        const tabs = await chrome.tabs.query({ url: url });
        let pageContent = null;

        if (tabs.length > 0) {
            // Tab is already open, inject content script
            const result = await chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'getPageContent' 
            });
            pageContent = result.content;
        } else {
            // Fetch page content directly
            const response = await fetch(url);
            pageContent = await response.text();
        }

        // Analyze the page
        const analysis = new Analyzer().analyze(pageContent);
        state.analysisData = analysis;

        displayResults(analysis);
        showLoading(false);
    } catch (err) {
        console.error('Analysis error:', err);
        showError(`Error analyzing site: ${err.message}`);
        showLoading(false);
    }
});

// Optimize button handler
elements.optimizeBtn.addEventListener('click', async () => {
    if (!state.analysisData) return;

    try {
        const optimizer = new Optimizer();
        state.optimizedTemplate = optimizer.optimize(state.analysisData);
        
        elements.results.classList.add('hidden');
        elements.export.classList.remove('hidden');
    } catch (err) {
        showError(`Optimization error: ${err.message}`);
    }
});

// Preview button handler
elements.previewBtn.addEventListener('click', () => {
    if (!state.analysisData) return;

    const preview = new Optimizer().generatePreview(state.analysisData);
    const previewWindow = window.open('about:blank', 'preview', 'width=1024,height=768');
    previewWindow.document.write(preview);
    previewWindow.document.close();
});

// Export handlers
elements.shopifyBtn.addEventListener('click', async () => {
    if (!state.optimizedTemplate) return;

    try {
        const shopifyTheme = new ShopifyGenerator().generate(state.optimizedTemplate);
        downloadFile(
            JSON.stringify(shopifyTheme, null, 2),
            'shopify-theme.json',
            'application/json'
        );
    } catch (err) {
        showError(`Shopify export error: ${err.message}`);
    }
});

elements.htmlBtn.addEventListener('click', () => {
    if (!state.optimizedTemplate) return;

    const html = new Optimizer().templateToHtml(state.optimizedTemplate);
    downloadFile(html, 'optimized-store.html', 'text/html');
});

elements.backBtn.addEventListener('click', () => {
    elements.export.classList.add('hidden');
    elements.results.classList.remove('hidden');
});

// Helper functions
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.error.classList.remove('hidden');
}

function hideError() {
    elements.error.classList.add('hidden');
}

function displayResults(analysis) {
    // Features
    elements.featuresList.innerHTML = analysis.features
        .map(feature => `<li><strong>${feature.name}</strong>: ${feature.description}</li>`)
        .join('');

    // Performance metrics
    elements.performanceMetrics.innerHTML = Object.entries(analysis.performance)
        .map(([key, value]) => `
            <div class="metric">
                <span class="metric-label">${key}</span>
                <span class="metric-value">${value}</span>
            </div>
        `).join('');

    // Recommendations
    elements.recommendationsList.innerHTML = analysis.recommendations
        .map(rec => `<li>${rec}</li>`)
        .join('');

    elements.results.classList.remove('hidden');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
