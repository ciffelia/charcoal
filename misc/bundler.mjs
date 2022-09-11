#!/usr/bin/env zx

import { argv } from 'zx'

const esbuild = require('esbuild')

const main = async () => {
  const format =
    argv.format === 'esm' || argv.format === 'cjs' ? argv.format : undefined
  if (format === undefined) {
    console.error(`Unknown format: ${argv.format}`)
    process.exit(1)
  }

  const isAnalyzeMode = argv.analyze === true

  const { metafile } = await esbuild.build({
    logLevel: 'info',
    color: true,

    entryPoints: ['./src/index.ts'],
    outdir: './dist',
    outExtension: {
      '.js': format === 'esm' ? '.mjs' : '.cjs',
    },
    tsconfig: './tsconfig.build.json',
    format,

    bundle: true,
    platform: 'neutral',
    external: ['../../node_modules/*'],
    sourcemap: true,

    minify: isAnalyzeMode,
    metafile: isAnalyzeMode,
    write: !isAnalyzeMode,
  })

  if (isAnalyzeMode && metafile !== undefined) {
    const summary = await esbuild.analyzeMetafile(metafile)
    console.log(summary)
  }
}

main()
