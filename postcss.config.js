const purgeCSS = require('@fullhuman/postcss-purgecss')

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        process.env.NODE_ENV === 'production' &&
        purgeCSS({
            content: ['./src/**/*.html', './public/**/*.html', './src/**/*.js']
        })
    ]
}