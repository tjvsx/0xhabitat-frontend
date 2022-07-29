import { exec } from 'child_process'

function run(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
}

async function main(address: string) {
    console.log('📥 Fetching metadata directly from the bytecode, it can take some time...')
    await run(`npm run fetch:metadata ${address}`)
    console.log('Done!')
    console.log('🔌 Generating typechain\'s factories')
    await run(`npm run generate:typechain`)
    console.log('Done!')
    console.log('🤝 Generating useDapp\'s hooks')
    await run(`npm run generate:usedapp`)
    console.log('Done, now you can use the generated hooks in your React components! Simply import them from ./gen/hooks/')
}

var args = process.argv.slice(2)
main(args[0])
