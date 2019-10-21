import Mail from '../../lib/Mail';

class HelpOrderAnsweringMail {
  get key() {
    return 'HelpOrderAnsweringMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    console.log('Queue was executed!');

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Thanks for asking us!',
      template: 'helporderanswer',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderAnsweringMail();
