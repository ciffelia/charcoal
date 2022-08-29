import { promises as fs, existsSync } from 'fs'
import path from 'path'
import { execp } from './utils'

export const targetDir = path.resolve(process.cwd(), 'packages', 'icons')

/**
 * dir 内で変更があったファイル情報を for await で回せるようにするやつ
 */
export async function* getChangedFiles(dir = targetDir) {
  if (!existsSync(dir))
    throw new Error(`icons-cli: target directory not found (${targetDir})`)
  const gitStatus = await collectGitStatus()
  for (const [relativePath, status] of gitStatus) {
    const fullpath = path.resolve(process.cwd(), relativePath)
    if (!fullpath.startsWith(`${dir}/`)) {
      continue
    }
    if (!existsSync(fullpath))
      throw new Error(`icons-cli: could not load svg (${fullpath})`)
    const content = await fs.readFile(fullpath, { encoding: 'utf-8' })
    yield { relativePath, content, status }
  }
}

async function collectGitStatus() {
  const map = new Map<string, string | null>()
  /**
   * @see https://git-scm.com/docs/git-status#_porcelain_format_version_1
   */
  const gitStatus = await execp(`git status --porcelain`)
  gitStatus.split('\n').forEach((s) => {
    map.set(
      s.slice(3),
      s.startsWith(' M')
        ? 'modified'
        : s.startsWith('??')
        ? 'untracked'
        : s.startsWith(' D')
        ? 'deleted'
        : null
    )
  })
  return map
}
