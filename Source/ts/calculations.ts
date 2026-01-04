// Dark City, Shining Babel - Sheet Worker Calculations
// Auto-calculation functions for derived values

/**
 * Helper function to set attributes only if they've changed
 */
const mySetAttrs = (setting: {[key: string]: AttributeContent}, v: {[key: string]: string}, options?: {silent?: boolean}, callback?: () => void): void => {
    const finalSetting: {[key: string]: AttributeContent} = {};
    for (const key in setting) {
        if (String(v[key]) !== String(setting[key])) {
            finalSetting[key] = setting[key];
        }
    }
    if (Object.keys(finalSetting).length > 0) {
        setAttrs(finalSetting, options, callback);
    } else if (callback) {
        callback();
    }
};

// TODO: Add calculation functions for:
// - Action dice pools
// - Load totals
// - Stress calculations
// - Cybernetic slot management
