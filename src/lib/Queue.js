import Bee from 'bee-queue';
import RegistrationMail from '../app/jobs/RegistrationMail';
import HelpOrderAnsweringMail from '../app/jobs/HelpOrderAnsweringMail';
import redisConfig from '../config/redis';

const jobs = [RegistrationMail, HelpOrderAnsweringMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Responsable for adding a job to a queue
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  proccessQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
