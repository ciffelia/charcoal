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
    external: ['../../node_modules/*'],
    sourcemap: true,

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

main()
