/**
 * @type {import('esbuild').BuildOptions}
 */
export const baseOptions = {
  logLevel: 'info',
  color: true,
  entryPoints: ['./src/index.ts'],
  outdir: './dist',
  tsconfig: './tsconfig.build.json',
  bundle: true,
  platform: 'neutral',
  external: ['../../node_modules/*'],
  sourcemap: true,
}
