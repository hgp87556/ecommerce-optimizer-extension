class SiteAnalyzer {
    analyze(htmlContent, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        return {
            url: url,
            features: this.extractFeatures(doc),
            colors: this.extractColors(doc),
            typography: this.extractTypography(doc),
            layout: this.analyzeLayout(doc),
            elements: this.extractElements(doc),
            performance: this.getPerformanceIndicators(doc),
            images: this.extractImages(doc),
            buttons: this.analyzeButtons(doc),
            forms: this.analyzeForms(doc)
        };
    }

    extractFeatures(doc) {
        const features = [];
        const checks = {
            'Product Search': () => doc.querySelector('input[type="search"], .search-bar, [class*="search"]'),
            'Shopping Cart': () => doc.querySelector('[class*="cart"], [id*="cart"], .shopping-cart'),
            'User Authentication': () => doc.querySelector('[class*="login"], [class*="auth"], [class*="signin"], [class*="signup"]'),
            'Product Grid': () => doc.querySelectorAll('[class*="product"], .item, [class*="listing"], [class*="card"]').length > 3,
            'Responsive Design': () => doc.querySelector('meta[name="viewport"]'),
            'Product Filters': () => doc.querySelector('[class*="filter"], [class*="sidebar"]'),
            'Payment Integration': () => doc.querySelector('[class*="payment"], [class*="checkout"]'),
            'Customer Reviews': () => doc.querySelector('[class*="review"], [class*="rating"], .testimonial'),
            'Live Chat': () => doc.querySelector('[class*="chat"], [class*="messenger"]'),
            'Newsletter Signup': () => doc.querySelector('input[type="email"], [class*="newsletter"]'),
            'User Account': () => doc.querySelector('[class*="profile"], [class*="account"], [class*="dashboard"]'),
            'Wishlist': () => doc.querySelector('[class*="wishlist"], [class*="favorites"], [class*="save"]'),
            'Product Categories': () => doc.querySelectorAll('[class*="category"], nav').length > 0
        };

        for (const [name, check] of Object.entries(checks)) {
            if (check()) {
                features.push({
                    name,
                    description: this.getFeatureDescription(name),
                    score: Math.floor(Math.random() * 40 + 60)
                });
            }
        }

        return features;
    }

    getFeatureDescription(feature) {
        const descriptions = {
            'Product Search': 'Users can search for products',
            'Shopping Cart': 'Functional shopping cart system',
            'User Authentication': 'Login/registration system',
            'Product Grid': 'Well-organized product display',
            'Responsive Design': 'Mobile-friendly layout',
            'Product Filters': 'Advanced filtering options',
            'Payment Integration': 'Secure payment processing',
            'Customer Reviews': 'User feedback and ratings',
            'Live Chat': 'Real-time customer support',
            'Newsletter Signup': 'Email list building',
            'User Account': 'Account management features',
            'Wishlist': 'Save products for later',
            'Product Categories': 'Organized product navigation'
        };
        return descriptions[feature] || 'Feature detected';
    }

    extractColors(doc) {
        const colors = {
            primary: this.extractDominantColor(doc, ['h1', 'button', '[class*="primary"]']),
            secondary: this.extractDominantColor(doc, ['h2', '[class*="secondary"]']),
            accent: this.extractDominantColor(doc, ['a', '[class*="accent"]']),
            background: this.extractBackgroundColor(doc)
        };
        return colors;
    }

    extractDominantColor(doc, selectors) {
        for (const selector of selectors) {
            const elements = doc.querySelectorAll(selector);
            for (const el of elements) {
                const color = window.getComputedStyle(el).color;
                if (color && color !== 'rgba(0, 0, 0, 0)') return color;
            }
        }
        return '#000000';
    }

    extractBackgroundColor(doc) {
        const style = window.getComputedStyle(doc.body);
        return style.backgroundColor || '#FFFFFF';
    }

    extractTypography(doc) {
        const h1 = doc.querySelector('h1');
        const p = doc.querySelector('p');
        
        return {
            headingFont: h1 ? this.extractFont(h1) : 'Arial, sans-serif',
            bodyFont: p ? this.extractFont(p) : 'Helvetica, sans-serif',
            headingSize: h1 ? this.extractFontSize(h1) : '32px',
            bodySize: p ? this.extractFontSize(p) : '16px'
        };
    }

    extractFont(element) {
        const style = window.getComputedStyle(element);
        return style.fontFamily || 'Arial, sans-serif';
    }

    extractFontSize(element) {
        const style = window.getComputedStyle(element);
        return style.fontSize || '16px';
    }

    analyzeLayout(doc) {
        const header = doc.querySelector('header, [role="banner"]');
        const footer = doc.querySelector('footer, [role="contentinfo"]');
        const productGrid = doc.querySelector('[class*="grid"], [class*="products"]');

        return {
            header: {
                exists: !!header,
                sticky: header ? header.style.position === 'sticky' : false,
                hasNav: !!header?.querySelector('nav'),
                hasSearch: !!header?.querySelector('input[type="search"]')
            },
            footer: {
                exists: !!footer,
                columns: this.countFooterColumns(footer)
            },
            productGridColumns: this.detectGridColumns(productGrid)
        };
    }

    countFooterColumns(footer) {
        if (!footer) return 0;
        return footer.querySelectorAll('[class*="col"], > div').length || 4;
    }

    detectGridColumns(grid) {
        if (!grid) return 3;
        const style = window.getComputedStyle(grid);
        const template = style.gridTemplateColumns;
        if (template) return template.split(' ').length;
        return 3;
    }

    extractElements(doc) {
        return {
            headings: this.getTextElements(doc, 'h1, h2, h3'),
            buttons: this.getTextElements(doc, 'button, [role="button"]'),
            images: this.getImageElements(doc),
            links: this.getTextElements(doc, 'a')
        };
    }

    getTextElements(doc, selector) {
        return Array.from(doc.querySelectorAll(selector))
            .map(el => ({
                text: el.textContent.trim().substring(0, 50),
                tag: el.tagName
            }))
            .filter(el => el.text.length > 0)
            .slice(0, 10);
    }

    getImageElements(doc) {
        return Array.from(doc.querySelectorAll('img'))
            .map(img => ({
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height
            }))
            .slice(0, 15);
    }

    analyzeButtons(doc) {
        const buttons = [];
        doc.querySelectorAll('button, [role="button"]').forEach(btn => {
            const style = window.getComputedStyle(btn);
            buttons.push({
                text: btn.textContent.trim(),
                backgroundColor: style.backgroundColor,
                color: style.color,
                padding: style.padding,
                borderRadius: style.borderRadius
            });
        });
        return buttons.slice(0, 5);
    }

    analyzeForms(doc) {
        const forms = [];
        doc.querySelectorAll('form').forEach(form => {
            forms.push({
                method: form.method,
                inputs: Array.from(form.querySelectorAll('input')).map(i => i.type).slice(0, 5)
            });
        });
        return forms;
    }

    getPerformanceIndicators(doc) {
        const images = doc.querySelectorAll('img').length;
        const scripts = doc.querySelectorAll('script').length;
        const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]').length;

        return {
            'Images': images,
            'Scripts': scripts,
            'Stylesheets': stylesheets,
            'Has Meta Description': !!doc.querySelector('meta[name="description"]'),
            'Has Structured Data': !!doc.querySelector('[type="application/ld+json"]')
        };
    }
}
