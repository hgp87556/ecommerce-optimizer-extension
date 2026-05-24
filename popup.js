const state = {
    urls: [],
    analysisData: null,
    optimizedTemplate: null
};

const elements = {
    urlInput: document.getElementById('urlInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    loading: document.getElementById('loading'),
    loadingText: document.getElementById('loadingText'),
    results: document.getElementById('results'),
    export: document.getElementById('export'),
    error: document.getElementById('error'),
    errorText: document.getElementById('errorText'),
    analyzedSites: document.getElementById('analyzedSites'),
    designElements: document.getElementById('designElements'),
    bestFeaturesList: document.getElementById('bestFeaturesList'),
    colorAnalysis: document.getElementById('colorAnalysis'),
    templateSummary: document.getElementById('templateSummary'),
    optimizeBtn: document.getElementById('optimizeBtn'),
    previewBtn: document.getElementById('previewBtn'),
    shopifyBtn: document.getElementById('shopifyBtn'),
    htmlBtn: document.getElementById('htmlBtn'),
    cssBtn: document.getElementById('cssBtn'),
    backBtn: document.getElementById('backBtn')
};

// Analyze button handler
elements.analyzeBtn.addEventListener('click', async () => {
    const urlsText = elements.urlInput.value.trim();
    const urls = urlsText.split('\n').map(url => url.trim()).filter(url => url.length > 0);
    
    if (urls.length === 0) {
        showError('Please enter at least one URL');
        return;
    }

    if (!urls.every(isValidUrl)) {
        showError('Please enter valid URLs');
        return;
    }

    state.urls = urls;
    showLoading(true);
    hideError();

    try {
        const analyses = [];
        
        for (let i = 0; i < urls.length; i++) {
            elements.loadingText.textContent = `Analyzing site ${i + 1} of ${urls.length}...`;
            try {
                const html = await fetchSiteContent(urls[i]);
                const analysis = new SiteAnalyzer().analyze(html, urls[i]);
                analyses.push(analysis);
            } catch (err) {
                console.error(`Error analyzing ${urls[i]}:`, err);
                // Continue with next URL
            }
        }

        if (analyses.length === 0) {
            throw new Error('Could not analyze any sites');
        }

        // Combine and rank analyses
        state.analysisData = combineAnalyses(analyses);
        displayResults(state.analysisData);
        showLoading(false);
    } catch (err) {
        console.error('Analysis error:', err);
        showError(`Error analyzing sites: ${err.message}`);
        showLoading(false);
    }
});

// Optimize button handler
elements.optimizeBtn.addEventListener('click', async () => {
    if (!state.analysisData) return;

    try {
        const generator = new TemplateGenerator();
        state.optimizedTemplate = generator.generateFromAnalysis(state.analysisData);
        
        displayTemplateSummary(state.optimizedTemplate);
        elements.results.classList.add('hidden');
        elements.export.classList.remove('hidden');
    } catch (err) {
        showError(`Generation error: ${err.message}`);
    }
});

// Preview button handler
elements.previewBtn.addEventListener('click', () => {
    if (!state.analysisData) return;

    const generator = new TemplateGenerator();
    const template = generator.generateFromAnalysis(state.analysisData);
    const html = template.toHTML();
    
    const previewWindow = window.open('about:blank', 'preview', 'width=1024,height=768');
    previewWindow.document.write(html);
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
    const html = state.optimizedTemplate.toHTML();
    downloadFile(html, 'optimized-store.html', 'text/html');
});

elements.cssBtn.addEventListener('click', () => {
    if (!state.optimizedTemplate) return;
    const css = state.optimizedTemplate.toCSS();
    downloadFile(css, 'optimized-store.css', 'text/css');
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

async function fetchSiteContent(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
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

function combineAnalyses(analyses) {
    return {
        siteCount: analyses.length,
        sites: analyses,
        bestFeatures: rankFeatures(analyses),
        colors: extractColorPalette(analyses),
        typography: extractTypography(analyses),
        layout: analyzeLayouts(analyses),
        performance: averagePerformance(analyses)
    };
}

function rankFeatures(analyses) {
    const featureMap = {};
    
    analyses.forEach(analysis => {
        analysis.features.forEach(feature => {
            if (!featureMap[feature.name]) {
                featureMap[feature.name] = {
                    name: feature.name,
                    description: feature.description,
                    count: 0,
                    examples: []
                };
            }
            featureMap[feature.name].count++;
            featureMap[feature.name].examples.push(feature);
        });
    });

    return Object.values(featureMap)
        .sort((a, b) => b.count - a.count);
}

function extractColorPalette(analyses) {
    const colors = {};
    
    analyses.forEach(analysis => {
        if (analysis.colors) {
            Object.entries(analysis.colors).forEach(([key, color]) => {
                if (!colors[key]) colors[key] = [];
                colors[key].push(color);
            });
        }
    });

    return colors;
}

function extractTypography(analyses) {
    const fonts = { headings: [], body: [] };
    
    analyses.forEach(analysis => {
        if (analysis.typography) {
            if (analysis.typography.headingFont) fonts.headings.push(analysis.typography.headingFont);
            if (analysis.typography.bodyFont) fonts.body.push(analysis.typography.bodyFont);
        }
    });

    return fonts;
}

function analyzeLayouts(analyses) {
    return {
        headerStyles: analyses.map(a => a.layout?.header),
        footerStyles: analyses.map(a => a.layout?.footer),
        gridColumns: analyses.map(a => a.layout?.productGridColumns).filter(Boolean)
    };
}

function averagePerformance(analyses) {
    if (analyses.length === 0) return {};
    
    const avg = {};
    const sampleAnalysis = analyses[0].performance;
    
    Object.keys(sampleAnalysis).forEach(key => {
        const values = analyses
            .map(a => parseFloat(a.performance[key]))
            .filter(v => !isNaN(v));
        avg[key] = values.length > 0 ? (values.reduce((a, b) => a + b) / values.length).toFixed(2) : 'N/A';
    });

    return avg;
}

function displayResults(analysis) {
    // Analyzed sites
    elements.analyzedSites.innerHTML = analysis.sites
        .map((site, i) => `
            <div class="site-result">
                <strong>Site ${i + 1}:</strong> ${site.url}
                <small>${site.features.length} features detected</small>
            </div>
        `).join('');

    // Design elements
    elements.designElements.innerHTML = `
        <div class="design-grid">
            <div><strong>Color Schemes:</strong> ${Object.keys(analysis.colors).length} found</div>
            <div><strong>Font Families:</strong> ${analysis.typography.headings.length} heading + ${analysis.typography.body.length} body</div>
            <div><strong>Layout Styles:</strong> ${analysis.layout.headerStyles.length} variants</div>
        </div>
    `;

    // Best features
    elements.bestFeaturesList.innerHTML = analysis.bestFeatures
        .slice(0, 8)
        .map(feature => `
            <li>
                <strong>${feature.name}</strong> (found in ${feature.count} sites)
                <br><small>${feature.description}</small>
            </li>
        `).join('');

    // Color analysis
    elements.colorAnalysis.innerHTML = Object.entries(analysis.colors)
        .slice(0, 6)
        .map(([role, colors]) => `
            <div class="color-swatch">
                <strong>${role}:</strong>
                ${colors.slice(0, 3).map(color => `
                    <span class="color" style="background: ${color}; width: 30px; height: 30px; display: inline-block; border-radius: 4px; margin: 2px;" title="${color}"></span>
                `).join('')}
            </div>
        `).join('');

    elements.results.classList.remove('hidden');
}

function displayTemplateSummary(template) {
    elements.templateSummary.innerHTML = `
        <div class="summary">
            <h4>Template Summary</h4>
            <p><strong>Sections:</strong> ${template.sections.length}</p>
            <p><strong>Primary Color:</strong> <span style="background: ${template.theme.colors.primary}; padding: 2px 8px; color: white; border-radius: 3px;">${template.theme.colors.primary}</span></p>
            <p><strong>Typography:</strong> ${template.theme.typography.headingFont}</p>
            <p><strong>Features:</strong> ${template.features.length}</p>
        </div>
    `;
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
