const core = require('@actions/core');
const github = require('@actions/github');
//const exec = require('@actions/exec');
const shell = require('shelljs');
const fs = require('fs')

async function run() {
  try {
    const dateTime = (new Date()).toLocaleString('pt-BR');

    const path = core.getInput('PATH');
    const secrets = JSON.parse(core.getInput('SECRETS'));

    if (!fs.existsSync(path)) { 
      throw new Error('Path not found');
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
   
    shell.echo(secrets);

    shell.echo(`🎉 Job has been finished`);

  } catch (error) {
    core.setFailed(error.message);
  }
} 


run();