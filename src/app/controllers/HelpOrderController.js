import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import HelpOrderAnsweringMail from '../jobs/HelpOrderAnsweringMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  /**
   *
   * Crie uma rota para listar todos pedidos de auxílio de um usuário com base em seu ID de cadastro;
   * Exemplo de requisição: GET https://gympoint.com/students/3/help-orders
   */
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: req.params.studentId,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  /**
   * Crie uma rota para o aluno cadastrar pedidos de auxílio apenas informando seu ID de cadastro (ID do banco de dados);
   * Exemplo de requisição: POST https://gympoint.com/students/3/help-orders
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { question } = req.body;

    /**
     * Create registry and send to database
     */
    const helpOrders = await HelpOrder.create({
      student_id: req.params.studentId,
      question,
      answer: null,
      answer_at: null,
    });

    /* Queue.add(RegistrationMail.key, {
      registry,
    }); */

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.studentId, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { answer } = req.body;

    if (!helpOrder) {
      return res.status(401).json({ error: `Help order doesn't exists.` });
    }

    /**
     * Update registry and send to database
     */

    await helpOrder.update({
      answer,
      answer_at: Date.now(),
    });

    Queue.add(HelpOrderAnsweringMail.key, {
      helpOrder,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
