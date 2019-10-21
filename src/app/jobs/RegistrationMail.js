import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registry } = data;

    console.log('Queue was executed!');

    await Mail.sendMail({
      to: `${registry.student.name} <${registry.student.email}>`,
      subject: 'Thanks for contracting',
      template: 'registration',
      context: {
        student: registry.student.name,
        plan: registry.plan.title,
        price: registry.plan.price * registry.plan.duration,
        duration: registry.plan.duration,
        start_date: format(
          parseISO(registry.start_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registry.end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
