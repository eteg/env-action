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

    let content = ''

    Object.keys(secrets).forEach(secret => {
      content += `${secret}=${secrets[secret]}\n`
      /* if(secret.startsWith('VITE_') || secret.startsWith('ZENDESK_')) {
      } */
    })

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