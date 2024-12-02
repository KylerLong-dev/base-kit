// Imports
const pluginEleventyNavigation = require("@11ty/eleventy-navigation");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// Configs
const configCss = require("./src/config/css");
const configJs = require("./src/config/javascript");
const configSitemap = require("./src/config/sitemap");
const configServer = require("./src/config/server");

// Other
const filterPostDate = require("./src/config/postDate");
const isProduction = configServer.isProduction;


const htmlMinifier = require("html-minifier-terser");

module.exports = function (eleventyConfig) {
    /**=====================================================================
          EXTENSIONS - Recognising non-default languages as templates 
    ======================================================================*/
    eleventyConfig.addTemplateFormats("css");
    eleventyConfig.addExtension("css", configCss);

    eleventyConfig.addTemplateFormats("js");
    eleventyConfig.addExtension("js", configJs);
    /**=====================================================================
                                END EXTENSIONS
    ======================================================================*/

    /**=====================================================================
                  PLUGINS - Adds additional eleventy functionality 
    ======================================================================*/
    eleventyConfig.addPlugin(pluginEleventyNavigation);
    eleventyConfig.addPlugin(pluginSitemap, configSitemap);

    /**=====================================================================
                                END PLUGINS
    ======================================================================*/

    /**======================================================================
       PASSTHROUGHS - Copy source files to /public with no 11ty processing
    ========================================================================*/
    eleventyConfig.addPassthroughCopy("./src/assets", {
        filter: [
            "**/*",
            "!**/*.js"
        ]
    });
    eleventyConfig.addPassthroughCopy("./src/admin");
    eleventyConfig.addPassthroughCopy("./src/_redirects");
    /**=====================================================================
                              END PASSTHROUGHS
    ======================================================================*/

    /**======================================================================
               FILTERS - Modify data in template files at build time
    ========================================================================*/
    eleventyConfig.addFilter("postDate", filterPostDate);
    /**=====================================================================
                                    END FILTERS
    =======================================================================*/

    /**======================================================================
                  SHORTCODES - Output data using JS at build time
    ========================================================================*/
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    /**=====================================================================
                                END SHORTCODES
    =======================================================================*/

    /**=====================================================================
                                SERVER SETTINGS
    ======================================================================*/
    eleventyConfig.setServerOptions(configServer);
    /**=====================================================================
                              END SERVER SETTINGS
    ======================================================================*/

    // Add the HTML minification transform (only for HTML files)

    if (isProduction) {
        eleventyConfig.addTransform("htmlmin", async (content, outputPath) => {
            if (outputPath && outputPath.endsWith(".html")) {
                const minified = await htmlMinifier.minify(content, {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                });
                return minified;
            }
            return content;
        });
    }

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
    };
};

