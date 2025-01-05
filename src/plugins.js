const {
    createContainer,
    createGenericContainer,
    specialContainers,
} = require("./containers");
const pluginConfigs = require("./configs.json");

function loadPlugin(requirePath) {
    const plugin = require(requirePath);
    // Special case: markdown-it-github-alert exports an object with alertPlugin
    if (requirePath === 'markdown-it-github-alert') {
        return plugin.alertPlugin;
    }
    return plugin;
}

// Load plugins dynamically
const loadedPlugins = pluginConfigs.plugins.map(({ require: requirePath }) => loadPlugin(requirePath));

module.exports = (instance) => {
    // Apply plugins based on configuration
    pluginConfigs.plugins.forEach(({ config }, index) => {
        const plugin = loadedPlugins[index];
        if (config) {
            instance.use(plugin, config);
        } else {
            instance.use(plugin);
        }
    });

    // Apply container plugins
    const containerPlugin = loadedPlugins[pluginConfigs.plugins.findIndex(p => p.require === 'markdown-it-container')];
    
    // Apply special containers first
    Object.entries(specialContainers).forEach(([name, options]) => {
        instance.use(containerPlugin, name, options);
    });

    // Register generic container handler for any single word name
    instance.use(...createGenericContainer());

    return instance;
};
