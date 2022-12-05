# shiki-plugin-diff

A plugin for [shiki](https://github.com/shikijs/shiki) that adds support for diff syntax highlighting.

> Note: This plugin needs a shiki version >= 0.12, which is not yet released.

## Usage

```js
const shiki = require('shiki')
const diff = require('shiki-plugin-diff')

const highlighter = await getHighlighter({
  theme: 'github-light',
  langs: ['js'],
})

highlighter.usePlugin(diff)

const code = `+ console.log("Hello world");
- console.log("Hello planets");`

const html = highlighter.codeToHtml(code, { lang: 'js' })
```

When used without any options, the plugin will identify added/removed lines by either a `+` or `-` at the beginning of the line.
For added lines it will apply the inline CSS color `#00ff4051`, and for removed lines it will apply `#ff000051`.

If you want to customize it you can pass an options object to the plugin.

## Options

### Diff detection

You can specify the lines that should be detected as added/removed directly as integer array. For this to apply you need to set `useLineNumbers` to `true`.

The first line is line 1.

```js
{
  useLineNumbers: true
  linesAdd: [2, 4, 5, 6]
  linesRemove: [1, 3, 7]
}
```

### Custom inline CSS colors

If you want to override the default inline CSS colors, you can pass the desired colors as options to the plugin.

```js
{
  colorAdd: '#00ff00'
  colorRemove: '#000000'
}
```

Some themes provide colors for added/removed lines, so you can use those instead. If the theme doesn't provide colors for added/removed lines, the plugin will fallback to the default colors (which you can override as mentioned before).

```js
{
  applyThemeColorsForStyles: true
}
```

### CSS classes

If you prefer CSS classes over inline CSS colors, you have to enable this option. This will add the `diff-add` and `diff-remove` classes to the added/removed lines.

```js
{
  useCssClasses: true
}
```

Similar to custom colors you can override the CSS class names.

```js
{
  classAdd: 'added'
  classRemove: 'removed'
}
```
