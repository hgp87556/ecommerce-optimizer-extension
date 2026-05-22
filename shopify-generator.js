class ShopifyGenerator {
    generate(optimizedTemplate) {
        return {
            name: optimizedTemplate.name,
            version: optimizedTemplate.version,
            theme: {
                name: 'Optimized E-Commerce Theme',
                description: 'AI-powered optimized theme for maximum conversions',
                settings: this.generateThemeSettings(optimizedTemplate),
                assets: this.generateAssets(),
                sections: this.generateSections(optimizedTemplate),
                layout: 'theme.liquid'
            },
            config: this.generateConfig(optimizedTemplate)
        };
    }

    generateThemeSettings(template) {
        return {
            colors: {
                primary: {
                    label: 'Primary Color',
                    type: 'color',
                    default: template.theme.colors.primary
                },
                secondary: {
                    label: 'Secondary Color',
                    type: 'color',
                    default: template.theme.colors.secondary
                },
                accent: {
                    label: 'Accent Color',
                    type: 'color',
                    default: template.theme.colors.accent
                }
            },
            typography: {
                headingFont: {
                    label: 'Heading Font',
                    type: 'font_picker',
                    default: template.theme.typography.headingFont
                },
                bodyFont: {
                    label: 'Body Font',
                    type: 'font_picker',
                    default: template.theme.typography.bodyFont
                }
            },
            layout: {
                containerWidth: {
                    label: 'Container Width',
                    type: 'range',
                    min: 1000,
                    max: 1400,
                    step: 10,
                    unit: 'px',
                    default: 1200
                },
                gutter: {
                    label: 'Section Gutter',
                    type: 'range',
                    min: 16,
                    max: 48,
                    step: 4,
                    unit: 'px',
                    default: 24
                }
            }
        };
    }

    generateAssets() {
        return [
            {
                name: 'theme.css',
                type: 'stylesheet'
            },
            {
                name: 'theme.js',
                type: 'script'
            },
            {
                name: 'section-header.js',
                type: 'section'
            },
            {
                name: 'section-hero.js',
                type: 'section'
            },
            {
                name: 'section-products.js',
                type: 'section'
            },
            {
                name: 'section-footer.js',
                type: 'section'
            }
        ];
    }

    generateSections(template) {
        const sections = {};

        template.sections.forEach(section => {
            sections[`section-${section.id}`] = this.generateSection(section);
        });

        return sections;
    }

    generateSection(section) {
        return {
            name: section.id,
            target: `section[data-section-type="${section.id}"]`,
            settings: this.generateSectionSettings(section),
            blocks: section.blocks,
            presets: [
                {
                    name: `Default ${section.type}`,
                    settings: {}
                }
            ]
        };
    }

    generateSectionSettings(section) {
        const settings = [];

        if (section.settings.title) {
            settings.push({
                type: 'text',
                id: 'title',
                label: 'Section Title',
                default: section.settings.title
            });
        }

        if (section.settings.backgroundColor) {
            settings.push({
                type: 'color',
                id: 'bg_color',
                label: 'Background Color',
                default: section.settings.backgroundColor
            });
        }

        return settings;
    }

    generateConfig(template) {
        return {
            'Shopify-Theme': {
                'name': template.name,
                'version': template.version,
                'theme_store_id': null,
                'presets': [
                    {
                        'name': 'Default',
                        'settings': {}
                    }
                ],
                'styles': [
                    {
                        'name': 'Light',
                        'id': 'light',
                        'settings': {
                            'primary-color': template.theme.colors.primary,
                            'secondary-color': template.theme.colors.secondary
                        }
                    },
                    {
                        'name': 'Dark',
                        'id': 'dark',
                        'settings': {
                            'primary-color': '#1a1a1a',
                            'secondary-color': '#ffffff'
                        }
                    }
                ]
            }
        };
    }

    toJSON() {
        return JSON.stringify(this, null, 2);
    }
}
