class TemplateGenerator {
    generateFromAnalysis(analysisData) {
        const design = DesignExtractor.extractBestDesignCombination(analysisData);
        
        return {
            name: 'AI-Optimized E-Commerce Store',
            version: '1.0.0',
            theme: this.createTheme(design),
            sections: this.generateSections(design, analysisData),
            features: analysisData.bestFeatures,
            design: design,
            
            toHTML: function() {
                return this.renderHTML();
            },
            
            toCSS: function() {
                return this.renderCSS();
            },
            
            renderHTML: function() {
                const sections = this.sections.map(s => this.renderSection(s)).join('\n');
                return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.name}</title>
    <link rel="stylesheet" href="optimized-store.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(this.theme.typography.headingFont.split(',')[0])}:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    ${sections}
</body>
</html>`;
            },
            
            renderCSS: function() {
                return this.generateCSSFromTheme();
            },
            
            renderSection: function(section) {
                switch (section.type) {
                    case 'header':
                        return this.renderHeader(section);
                    case 'hero':
                        return this.renderHero(section);
                    case 'featured-products':
                        return this.renderFeaturedProducts(section);
                    case 'product-grid':
                        return this.renderProductGrid(section);
                    case 'testimonials':
                        return this.renderTestimonials(section);
                    case 'newsletter':
                        return this.renderNewsletter(section);
                    case 'footer':
                        return this.renderFooter(section);
                    default:
                        return '';
                }
            },
            
            renderHeader: function(section) {
                return `
                    <header class="header" style="background-color: ${this.theme.colors.primary}; color: ${this.theme.colors.secondary};">
                        <div class="container">
                            <div class="header-content">
                                <div class="logo">Your Store</div>
                                <nav class="nav">
                                    <a href="#">Home</a>
                                    <a href="#">Shop</a>
                                    <a href="#">About</a>
                                    <a href="#">Contact</a>
                                </nav>
                                <div class="header-actions">
                                    <input type="search" placeholder="Search products..." class="search-input">
                                    <button class="cart-btn">🛒 Cart</button>
                                </div>
                            </div>
                        </div>
                    </header>
                `;
            },
            
            renderHero: function(section) {
                return `
                    <section class="hero" style="background: linear-gradient(135deg, ${this.theme.colors.primary}, ${this.theme.colors.accent});">
                        <div class="container hero-content">
                            <h1 style="color: ${this.theme.colors.secondary};">Welcome to Your Store</h1>
                            <p style="color: ${this.theme.colors.secondary};">Discover amazing products curated just for you</p>
                            <button class="btn btn-primary">Shop Now</button>
                        </div>
                    </section>
                `;
            },
            
            renderFeaturedProducts: function(section) {
                const products = Array(4).fill(null).map((_, i) => `
                    <div class="product-card">
                        <div class="product-image">Product ${i + 1}</div>
                        <div class="product-info">
                            <h3>Product Name</h3>
                            <p class="price" style="color: ${this.theme.colors.accent};">$99.99</p>
                            <button class="btn btn-primary">Add to Cart</button>
                        </div>
                    </div>
                `).join('');
                
                return `
                    <section class="featured-products">
                        <div class="container">
                            <h2>Featured Products</h2>
                            <div class="products-grid">
                                ${products}
                            </div>
                        </div>
                    </section>
                `;
            },
            
            renderProductGrid: function(section) {
                return `
                    <section class="product-grid">
                        <div class="container">
                            <h2>All Products</h2>
                            <div class="products-grid">
                                ${Array(8).fill(null).map((_, i) => `
                                    <div class="product-card">
                                        <div class="product-image">Product</div>
                                        <div class="product-info">
                                            <h3>Product ${i + 1}</h3>
                                            <p class="price" style="color: ${this.theme.colors.accent};">$${(50 + i * 10).toFixed(2)}</p>
                                            <button class="btn btn-primary">Add to Cart</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </section>
                `;
            },
            
            renderTestimonials: function(section) {
                return `
                    <section class="testimonials" style="background-color: #f9f9f9;">
                        <div class="container">
                            <h2>What Our Customers Say</h2>
                            <div class="testimonials-grid">
                                ${Array(3).fill(null).map(() => `
                                    <div class="testimonial">
                                        <p>"Excellent products and fast shipping!"</p>
                                        <div class="rating">★★★★★</div>
                                        <p class="author">- Happy Customer</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </section>
                `;
            },
            
            renderNewsletter: function(section) {
                return `
                    <section class="newsletter" style="background-color: ${this.theme.colors.primary}; color: ${this.theme.colors.secondary};">
                        <div class="container">
                            <h2>Subscribe to Our Newsletter</h2>
                            <form class="newsletter-form">
                                <input type="email" placeholder="Enter your email" required>
                                <button class="btn btn-secondary">Subscribe</button>
                            </form>
                        </div>
                    </section>
                `;
            },
            
            renderFooter: function(section) {
                return `
                    <footer class="footer" style="background-color: ${this.theme.colors.primary}; color: ${this.theme.colors.secondary};">
                        <div class="container">
                            <div class="footer-grid">
                                <div><h4>Company</h4>
                                    <ul>
                                        <li><a href="#">About Us</a></li>
                                        <li><a href="#">Blog</a></li>
                                        <li><a href="#">Careers</a></li>
                                    </ul>
                                </div>
                                <div><h4>Support</h4>
                                    <ul>
                                        <li><a href="#">Contact Us</a></li>
                                        <li><a href="#">FAQ</a></li>
                                        <li><a href="#">Returns</a></li>
                                    </ul>
                                </div>
                                <div><h4>Legal</h4>
                                    <ul>
                                        <li><a href="#">Privacy</a></li>
                                        <li><a href="#">Terms</a></li>
                                        <li><a href="#">Security</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>© 2024 Your Store. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                `;
            },
            
            generateCSSFromTheme: function() {
                return `/* Optimized Store CSS - Generated from multiple site analysis */

:root {
    --primary-color: ${this.theme.colors.primary};
    --secondary-color: ${this.theme.colors.secondary};
    --accent-color: ${this.theme.colors.accent};
    --heading-font: ${this.theme.typography.headingFont};
    --body-font: ${this.theme.typography.bodyFont};
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--body-font);
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.header {
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.logo {
    font-size: 24px;
    font-weight: 700;
    font-family: var(--heading-font);
}

.nav {
    display: flex;
    gap: 24px;
}

.nav a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav a:hover {
    opacity: 0.7;
}

.header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

.search-input {
    padding: 8px 12px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
    color: inherit;
}

.hero {
    padding: 100px 0;
    text-align: center;
    color: white;
}

.hero-content h1 {
    font-size: 48px;
    margin-bottom: 24px;
    font-family: var(--heading-font);
}

.hero-content p {
    font-size: 18px;
    margin-bottom: 32px;
}

section {
    padding: 64px 0;
}

section h2 {
    font-size: 36px;
    margin-bottom: 48px;
    text-align: center;
    font-family: var(--heading-font);
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
}

.product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-image {
    width: 100%;
    height: 250px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #999;
}

.product-info {
    padding: 16px;
}

.product-info h3 {
    margin-bottom: 8px;
    font-family: var(--heading-font);
}

.price {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
}

.btn-primary {
    background-color: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    opacity: 0.9;
    transform: scale(1.02);
}

.btn-secondary {
    background-color: var(--secondary-color);
    color: var(--primary-color);
    border: 2px solid var(--secondary-color);
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
}

.testimonial {
    padding: 24px;
    border-left: 4px solid var(--accent-color);
    background: white;
    border-radius: 4px;
}

.testimonial p {
    font-style: italic;
    margin-bottom: 16px;
}

.rating {
    color: var(--accent-color);
    margin-bottom: 8px;
}

.newsletter {
    text-align: center;
    padding: 64px 0;
}

.newsletter h2 {
    color: inherit;
}

.newsletter-form {
    display: flex;
    gap: 12px;
    max-width: 500px;
    margin: 0 auto;
    margin-top: 24px;
}

.newsletter-form input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 4px;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 40px;
}

.footer h4 {
    margin-bottom: 16px;
    font-family: var(--heading-font);
}

.footer ul {
    list-style: none;
}

.footer ul li {
    margin-bottom: 8px;
}

.footer a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.3s;
}

.footer a:hover {
    opacity: 0.7;
}

.footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 12px;
    }

    .hero-content h1 {
        font-size: 32px;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .footer-grid {
        grid-template-columns: 1fr;
    }
}
`;
            }
        };
    }

    createTheme(design) {
        return {
            colors: {
                primary: design.colors.primary || '#000000',
                secondary: design.colors.secondary || '#FFFFFF',
                accent: design.colors.accent || '#FF6B6B'
            },
            typography: {
                headingFont: design.typography.headingFont || 'Arial, sans-serif',
                bodyFont: design.typography.bodyFont || 'Helvetica, sans-serif'
            }
        };
    }

    generateSections(design, analysisData) {
        return [
            { type: 'header' },
            { type: 'hero' },
            { type: 'featured-products' },
            { type: 'product-grid' },
            { type: 'testimonials' },
            { type: 'newsletter' },
            { type: 'footer' }
        ];
    }
}
