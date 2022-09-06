#!/usr/bin/env zx

import { baseOptions } from './bundler.mjs'
const esbuild = require('esbuild')

esbuild.build({
  ...baseOptions,
  outExtension: { '.js': '.cjs' },
  format: 'cjs',
}).catch(() => {
  // エラーはesbuildが出力するので、ここでは何も表示せず終了する
  process.exit(1)
})
