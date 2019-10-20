import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'A student is already using this E-mail ' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid)) {
      return res
        .status(400)
        .json({ error: 'There are problems with validation' });
    }

    const { email } = req.body;

    const user = await Student.findByPk(req.userId);

    if (email !== user.email) {
      const studentExists = await Student.findOne({
        where: { email },
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'A student is already using this E-mail ' });
      }
    }

    const { name, age, weight, height } = await Student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
