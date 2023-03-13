import type { Plugin } from 'esbuild'
import swc from '@swc/core'

export const styledComponentsPlugin: Plugin = {
  name: 'styled-components',
  setup(build) {
    build.onLoad(
      { filter: /\.(js|cjs|mjs|ts|mts|cts|jsx|tsx)/, namespace: 'file' },
      async (args) => {
        const { code } = await swc.transformFile(args.path, {
          jsc: {
            target: 'esnext',
            keepClassNames: true,
            preserveAllComments: true,
            experimental: {
              plugins: [['@swc/plugin-styled-components', {}]],
            },
          },
          sourceMaps: 'inline',
        })

        return {
          contents: code,
        }
      }
    )
  },
}
