const shiki = require('shiki')
const diffPlugin = require('../index')

test('Default configuration', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
+  function Blog({ posts }) {
-  function Blog({ entries }) {
+    if (posts.length === 0) {
-    if (entries.length === 0) {
        return <p>No posts</p> 
     }
   }
`

  highlighter.usePlugin(diffPlugin)

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Custom style colors', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
+  function Blog({ posts }) {
-  function Blog({ entries }) {
+    if (posts.length === 0) {
-    if (entries.length === 0) {
        return <p>No posts</p> 
     }
   }
`

  highlighter.usePlugin(diffPlugin({ colorAdd: 'blue', colorRemove: 'orange' }))

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Theme colors for styles', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
+  function Blog({ posts }) {
-  function Blog({ entries }) {
+    if (posts.length === 0) {
-    if (entries.length === 0) {
        return <p>No posts</p> 
     }
   }
`

  highlighter.usePlugin(
    diffPlugin({
      applyThemeColorsForStyles: true,
    })
  )

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Default classes instead of styles', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
+  function Blog({ posts }) {
-  function Blog({ entries }) {
+    if (posts.length === 0) {
-    if (entries.length === 0) {
        return <p>No posts</p> 
     }
   }
`

  highlighter.usePlugin(
    diffPlugin({
      useCssClasses: true,
    })
  )

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Custom classes', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
+  function Blog({ posts }) {
-  function Blog({ entries }) {
+    if (posts.length === 0) {
-    if (entries.length === 0) {
        return <p>No posts</p> 
     }
   }
`

  highlighter.usePlugin(
    diffPlugin({
      useCssClasses: true,
      classAdd: 'add-me',
      classRemove: 'remove-me',
    })
  )

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Line numbers instead of RegEx', async () => {
  const highlighter = await shiki.getHighlighter({
    theme: 'github-light',
    langs: ['js'],
  })

  const code = `// This is an example of a diff
function Blog({ posts }) {
function Blog({ entries }) {
  if (posts.length === 0) {
  if (entries.length === 0) {
     return <p>No posts</p> 
  }
}
`

  highlighter.usePlugin(
    diffPlugin({
      useLineNumbers: true,
      linesAdd: [2, 4],
      linesRemove: [3, 5],
    })
  )

  const out = highlighter.codeToHtml(code, { lang: 'js' })

  expect(out).toMatchSnapshot()
})
