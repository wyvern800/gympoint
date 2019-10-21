import * as Yup from 'yup';
import { startOfHour, parseISO, addMonths } from 'date-fns';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registry from '../models/Registry';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

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
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(registries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);

    const hourStart = startOfHour(parseISO(start_date));

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const priceFinal = plan.duration * plan.price;

    /**
     * Create registry and send to database
     */
    const registries = await Registry.create({
      student_id,
      plan_id,
      start_date: hourStart,
      end_date,
      price: priceFinal,
    });

    const registry = await Registry.findOne({
      where: { id: registries.id },

      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
      ],
    });

    Queue.add(RegistrationMail.key, {
      registry,
    });

    return res.json(registries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const { student_id, plan_id, start_date } = req.body;
    const plan = await Plan.findByPk(plan_id);
    const hourStart = startOfHour(parseISO(start_date));

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const priceFinal = plan.duration * plan.price;

    /**
     * Get all values of 'req.body' and unstructures
     */
    await Registry.update(
      { ...req.body, end_date, price: priceFinal },
      {
        where: { id: student_id },
      }
    );

    return res.json({
      student_id: req.params.studentId,
      plan_id,
      start_date: hourStart,
      end_date,
      price: priceFinal,
    });
  }

  async delete(req, res) {
    const { studentId } = req.params;
    const registry = await Registry.findByPk(studentId);

    await registry.destroy({ where: { studentId } });

    await registry.save();

    return res.status(400).json({ ok: 'Registry was succesfully deleted!' });
  }
}

export default new RegistryController();
