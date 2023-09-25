module.exports = {
  extends: [
    'alloy',
    'alloy/react',
    'alloy/typescript',
    'plugin:react-hooks/recommended',
    'erb',
    // 'eslint-config-egg/typescript',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
    EASY_ENV_IS_BROWSER: false,
    EASY_ENV_IS_DEV: false,
    EASY_ENV_IS_NODE: false,
    APM_VERSION: false,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    // 自定义你的规则
    'no-undefined': 'warn',
    'no-debugger': 'off',
    semi: 1,
    complexity: ['error', { max: 99 }],
    // 这里填入你的项目需要的个性化配置，比如：
    // @fixable 一个缩进必须用两个空格替代
    indent: [
      1,
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true,
        ignoredNodes: ['VariableDeclaration[declarations.length=0]'], // 修复Eslint在输入"const"时报错的问题
      },
    ],
    // @fixable jsx 的 children 缩进必须为两个空格
    'react/jsx-indent': [1, 2],
    // @fixable jsx 的 props 缩进必须为两个空格
    'react/jsx-indent-props': [1, 2],
    'react/no-string-refs': 1, // 不要使用ref
    'no-template-curly-in-string': 1, // 在string里面不要出现模板符号
    '@eslint/no-unused-vars': 'off',
    'react/no-did-update-set-state': 1,
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    'max-nested-callbacks': ['error', 4],
  },
};
