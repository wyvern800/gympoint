import * as Yup from 'yup';
import { startOfHour, parseISO, addMonths } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registry from '../models/Registry';
/* import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue'; */

class RegistryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registries = await Registry.findAll({
      order: ['start_date'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(registries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);

    const hourStart = startOfHour(parseISO(start_date));

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const priceFinal = plan.duration * plan.price;

    /**
     * Create registry and send to database
     */
    const registries = await Registry.create({
      student_id: req.params.studentId,
      start_date: hourStart,
      end_date,
      price: priceFinal,
    });

    /**
     * Notify appointment provider
     */
    /* const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm 'h'",
      { locale: pt }
    ); */

    /* await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    }); */

    return res.json(registries);
  }

  /* async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    }); */

  /**
   * Will delete only if the deletion-willing user ID is the same as the
   * creator of the appointment
   */
  /* if (appointment.user_id !== req.userId) {
      return res.status(400).json({
        error: 'Insufficient permissions to cancel this appointment',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.cancelled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  } */
}

export default new RegistryController();
