const PLUGIN_NAME = 'diff'

const AVAILABLE_CONFIG = [
  'applyThemeColorsForStyles',
  'classAdd',
  'classRemove',
  'colorAdd',
  'colorRemove',
  'linesAdd',
  'linesRemove',
  'useCssClasses',
  'useLineNumbers',
]

const DEFAULT_CONFIG = {
  classAdd: 'diff-add',
  classRemove: 'diff-remove',
  colorAdd: '#00ff4051',
  colorRemove: '#ff000051',
}

const TYPE_ADD = 'add'
const TYPE_REMOVE = 'remove'

const REGEX_ADD = /^\+/
const REGEX_REMOVE = /^-/

// Configuration setup
function setup(config) {
  if (typeof config !== 'undefined' && typeof config !== 'object') {
    throw Error(`Config of type "${typeof config}" is not supported.`)
  }

  for (const key in config) {
    if (!AVAILABLE_CONFIG.includes(key)) {
      console.warn(`Config key "${key}" is not supported.`)
    }
  }

  return { ...DEFAULT_CONFIG, ...config, name: PLUGIN_NAME }
}

// If we want to use the color property from the theme for the diff
function getColorFromTheme(type, defaultColor, theme) {
  if (!_config.applyThemeColorsForStyles) return defaultColor

  const schemaProperty =
    type === TYPE_ADD
      ? 'diffEditor.insertedTextBackground'
      : 'diffEditor.removedTextBackground'

  if (!theme.colors?.[schemaProperty]) {
    console.warn(
      `Color value for property ${schemaProperty} not defined in theme. Falling back to default color.`
    )
    return defaultColor
  }
  return theme.colors[schemaProperty]
}

// Helper to apply the CSS class based on diff type
function getCssClasses(type, config) {
  return config.useCssClasses
    ? type === TYPE_ADD
      ? config.classAdd
      : config.classRemove
    : ''
}

// Helper to check for a match, either based on defined line numbers or regex
function isMatch(type, content, context) {
  if (_config.useLineNumbers) {
    if (type === TYPE_ADD && _config.linesAdd.includes(context.index + 1)) {
      return true
    }
    if (
      type === TYPE_REMOVE &&
      _config.linesRemove.includes(context.index + 1)
    ) {
      return true
    }
  } else {
    if (type === TYPE_ADD && content.match(REGEX_ADD)) {
      return true
    }
    if (type === TYPE_REMOVE && content.match(REGEX_REMOVE)) {
      return true
    }
  }
  return false
}

// Constructing the inline style that will be used for the diff
const lineStyle = {
  styles: (context) => {
    const content = context.line['0']?.content
    let bgColor = 'transparent'

    if (content) {
      if (isMatch(TYPE_ADD, content, context)) {
        bgColor = getColorFromTheme(TYPE_ADD, _config.colorAdd, context.theme)
      } else if (isMatch(TYPE_REMOVE, content, context)) {
        bgColor = getColorFromTheme(
          TYPE_REMOVE,
          _config.colorRemove,
          context.theme
        )
      }
    }
    return {
      'background-color': bgColor,
      display: 'inline-block',
      width: '100%',
    }
  },
}

// Constructing the CSS class that will be used for the diff
const lineClass = {
  classNames: (context) => {
    const content = context.line['0']?.content

    let bgColor = ''

    if (content) {
      if (isMatch(TYPE_ADD, content, context)) {
        bgColor = getCssClasses(TYPE_ADD, _config)
      } else if (isMatch(TYPE_REMOVE, content, context)) {
        bgColor = getCssClasses(TYPE_REMOVE, _config)
      }
    }
    return [bgColor]
  },
}

// Define if we want to use CSS classes or inline styles
function defineLineType() {
  if (_config.useCssClasses) {
    return lineClass
  }
  return lineStyle
}

let _config

module.exports = (config) => {
  _config = setup(config)

  return {
    name: _config.name,
    config: {
      requestTheme: _config.applyThemeColorsForStyles,
    },
    tags: { line: defineLineType() },
  }
}
