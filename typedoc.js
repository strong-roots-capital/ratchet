module.exports = {
    inputFiles: [
        './src/ratchet.ts',
    ],
    mode: 'file',
    includeDeclarations: true,
    tsconfig: 'tsconfig.json',
    out: './typedoc',
    excludePrivate: true,
    excludeProtected: true,
    excludeExternals: true,
    excludeNotExported: true,
    readme: './doc/readme.md',
    name: 'ratchet',
    ignoreCompilerErrors: true,
    plugin: 'typedoc-plugin-markdown',
    listInvalidSymbolLinks: true,
    theme: 'markdown'
};
