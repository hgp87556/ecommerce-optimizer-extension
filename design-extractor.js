class DesignExtractor {
    static extractBestDesignCombination(analysisData) {
        return {
            colors: this.selectBestColors(analysisData.colors),
            typography: this.selectBestTypography(analysisData.typography),
            layout: this.selectBestLayout(analysisData.layout),
            components: this.extractBestComponents(analysisData.sites)
        };
    }

    static selectBestColors(colorsByRole) {
        const selected = {};
        
        Object.entries(colorsByRole).forEach(([role, colors]) => {
            if (colors.length > 0) {
                // Pick the most common color for this role
                const colorCounts = {};
                colors.forEach(color => {
                    colorCounts[color] = (colorCounts[color] || 0) + 1;
                });
                selected[role] = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a])[0];
            }
        });

        return selected;
    }

    static selectBestTypography(typography) {
        return {
            headingFont: this.getMostCommon(typography.headings) || 'Inter, sans-serif',
            bodyFont: this.getMostCommon(typography.body) || 'Helvetica, sans-serif'
        };
    }

    static selectBestLayout(layouts) {
        return {
            hasSticky Header: layouts.headerStyles.some(h => h?.sticky),
            headerHasSearch: layouts.headerStyles.some(h => h?.hasSearch),
            productGridColumns: Math.round(
                layouts.gridColumns.reduce((a, b) => a + b, 0) / Math.max(layouts.gridColumns.length, 1)
            ) || 3
        };
    }

    static extractBestComponents(sites) {
        const components = {
            headers: [],
            footers: [],
            productCards: [],
            ctaButtons: []
        };

        sites.forEach(site => {
            if (site.elements) {
                components.headers.push(...(site.elements.headings || []));
                components.productCards.push(...site.elements.images.slice(0, 3));
                components.ctaButtons.push(...(site.buttons || []));
            }
        });

        return components;
    }

    static getMostCommon(array) {
        if (array.length === 0) return null;
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    }
}
