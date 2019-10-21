import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

// Crie uma rota para a academia listar todos pedidos de auxílio sem resposta;

class PendingHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
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
}

export default new PendingHelpOrderController();
