const path = require('path')
const fs = require('fs')
const sao = require('sao')
const cac = require('cac')
const chalk = require('chalk');
const envinfo = require('envinfo')
const { version } = require('./package.json');
const gradient = require('gradient-string')
const box = require('./box')
const generator = path.resolve(__dirname, './')

const cli = cac('ArkCalculator');

const showEnvInfo = async () => {
  console.log(chalk.bold('\nMiljøinfo:'))
  const result = await envinfo
    .run({
      System: ['OS', 'CPU'],
      Binaries: ['Node', 'Yarn', 'npm'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
    })
  process.exit(1)
}

const run = async () => {
  cli
    .command('[out-dir]', 'Generer i ein egendefinert mappe eller gjeldende mappe')
    .option('-i, --info', 'Skriv ut feilsøkingsinformasjon knyttet til lokalmiljøet')
    .action((outDir = '.', cliOptions) => {
      if (cliOptions.info) {
        return showEnvInfo()
      }


      const { answers, overwriteDir, verbose } = cliOptions

      const logLevel = verbose ? 4 : 2
      
      sao({ generator, outDir, logLevel, answers, cliOptions })
        .run()
        .catch(err => {
          console.trace(err)
          process.exit(1)
        })
    })


  cli.help()

  cli.version(version)

  cli.parse()
}

try {
  run()
} catch (err) {
  if (err.name === 'CACError' && err.message.startsWith('Unknown option')) {
    console.error(box(4, err.message, "red").join('\n'))
    cli.outputHelp()
  } else {
    console.error(box(4, err, "red"))
  }
}