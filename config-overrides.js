module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    })
    config.module.rules.push({
        test: /\.sharedworker\.js$/,
        use: { loader: 'shared-worker-loader' }
    })
    //config.output['globalObject'] = 'this';
    return config;
}
