import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      order: ['id'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: 'A plan is already using this title ' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const { title } = req.body;

    const plan = await Plan.findByPk(req.params.planId);

    if (title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title },
      });

      if (planExists) {
        return res
          .status(400)
          .json({ error: 'A plan is already using this title ' });
      }
    }

    const { duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { planId } = req.params;
    const plan = await Plan.findByPk(planId);

    await plan.destroy({ where: { planId } });

    await plan.save();

    return res.status(400).json({ ok: 'Plan was succesfully deleted!' });
  }
}

export default new PlanController();
