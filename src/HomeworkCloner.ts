import { $, chalk, fetch, quiet, question } from 'zx';
import { PullRequest } from './types';
import 'dotenv/config';

const users_names = {
  mckenziecamacho: 'mckenzie',
  trhodes: 'tsani',
  Boscobrand: 'tony',
  'i-j-c': 'jessie',
};

class HomeworkCloner {
  github_url: string = 'https://git.generalassemb.ly/api/v3';
  access_token: string = process.env.GITHUB_PAT;

  async run(): Promise<void> {
    await this.promptUser();
  }

  async promptUser() {
    let cohort: string;
    let unit: string;
    let assignment: string;
    try {
      cohort = await question(`What ${chalk.blue('cohorts')} assignment are your grading? `);
      if(cohort === '') throw new Error('Invalid input for cohort.');

      unit = await question(`Which ${chalk.blue('unit')} are you in currently? (Just a numerical value) `);
      if(!unit || !Boolean(parseInt(unit))) throw new Error('Invalid input for unit.');

      assignment = await question(`Which ${chalk.blue('assignment')} do you want to grade? `);
      if(!assignment || assignment === '') throw new Error('Invalid input for assignment.');
    } catch(e) {
      console.error('Something went wrong with gathering user prompts: ', e.message);
    }
    console.log(cohort, 'unit' + unit, assignment); 
    // this.clonePRs(cohort, 'unit' + unit, assignment);
  }

  // async dependencyInstall() {

  // }

  async clonePRs(cohort: string, unit: string, assignment: string): Promise<void> {
    const pullRequests: PullRequest[] = await this.getPRs(cohort, assignment);

    pullRequests.forEach(async (pr: PullRequest): Promise<void> => {
      try {
        const cloneUrl: string = `https://git.generalassemb.ly/${pr.user.login}/${assignment}.git`
        const studentActualName: string = users_names[pr.user.login];
        console.log(`${chalk.blue('Cloning down')} ${chalk.red(studentActualName)}`)
        await quiet($`git clone ${cloneUrl} ~/Repositories/general_assembly/synchrony/grading/${unit}/${assignment}/${studentActualName} -q`);
      } catch(e) {
        console.error('Something went wrong with the cloning', e.message);
      }
    });
  }

  async getPRs(cohort: string, assignment: string): Promise<PullRequest[]> {
    const res = await fetch(`${this.github_url}/repos/${cohort}/${assignment}/pulls`, {
      method: 'GET',
      headers: {
        Authorization: `token ${this.access_token}`
      }
    });

    const pullRequests: PullRequest[] = JSON.parse(await res.text());

    return pullRequests;
  }
}

export default HomeworkCloner;

