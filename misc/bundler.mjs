#!/usr/bin/env zx

import { argv } from 'zx'

const esbuild = require('esbuild')

const main = async () => {
  const { format, platform } = argv
  const isAnalyzeMode = argv.analyze === true

  const { metafile } = await esbuild.build({
    logLevel: 'info',
    color: true,

    entryPoints: ['./src/index.ts'],
    outdir: './dist',
    outExtension: {
      '.js': format === 'cjs' ? '.cjs' : '.mjs',
    },
    tsconfig: './tsconfig.build.json',
    format,

    bundle: true,
    platform,
    sourcemap: true,
    plugins: [makeAllPackagesExternalPlugin],

    minify: isAnalyzeMode,
    keepNames: !isAnalyzeMode,
    write: !isAnalyzeMode,
    metafile: isAnalyzeMode,
  })

  if (isAnalyzeMode && metafile !== undefined) {
    const summary = await esbuild.analyzeMetafile(metafile)
    console.log(summary)
  }
}

/**
 * A plugin to mark all packages as external so that they are not bundled.
 * @see https://github.com/evanw/esbuild/issues/619#issuecomment-751995294
 * @type {esbuild.Plugin}
 */
const makeAllPackagesExternalPlugin = {
  name: 'make-all-packages-external',
  setup(build) {
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({ path: args.path, external: true }))
  },
}

main()
