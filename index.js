const core = require('@actions/core');
const github = require('@actions/github');
const shell = require('shelljs');
const fs = require('fs')

async function run() {
  try {
    const dateTime = (new Date()).toLocaleString('pt-BR');

    const path = core.getInput('PATH');
    const secrets = JSON.parse(core.getInput('SECRETS'));

    if (!fs.existsSync(path)) {
      core.setFailed('Path not found');
    }

    const {
      ref,
      eventName
    } = github.context;

    const {
      repository
    } = github.context.payload


    shell.echo(`💡 Job started at ${dateTime}`);
    shell.echo(`🖥️ Job was automatically triggered by ${eventName} event`);
    shell.echo(`🔎 The name of your branch is ${ref} and your repository is ${repository.name}.`)

    let contentArray = []

    Object.keys(secrets).forEach(secret => {
      if (!secret.includes('AWS_PRIVATE_KEY')) {
        contentArray.push(`${secret}=${secrets[secret]}\n`)
      }
    })

    contentArray.sort(function (a) {
      if (a.startsWith('MONGO')) return -1;
    });

    const content = contentArray.join('')

    fs.writeFile(`${path}/.env`, content, (error) => {
      if (error) {
        core.setFailed('Error writing .env file');
      }
      shell.exec(`cat ${path}/.env`);
      shell.echo(`🎉 Job has been finished`);
    })

    shell.exec(`cat ${path}/.env`);

  } catch (error) {
    core.setFailed(error.message);
  }
}


run();