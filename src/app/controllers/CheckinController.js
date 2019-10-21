import { Op } from 'sequelize';
import { subDays, setMinutes, setHours, setSeconds } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkIns = await Checkin.findAll({
      where: {
        student_id: req.params.studentId,
      },
    });

    return res.json(checkIns);
  }

  async store(req, res) {
    const startOfDay = subDays(
      setSeconds(setMinutes(setHours(Date.now(), 0), 0), 0),
      7
    );

    const endOfDay = setSeconds(setMinutes(setHours(Date.now(), 23), 59), 0);

    const checkinsDone = await Checkin.count({
      where: {
        student_id: req.params.studentId,
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (checkinsDone > 5) {
      return res.status(401).json({
        error: 'You can only check-in for 5 times in 7 days',
      });
    }

    const checkIn = await Checkin.create({ student_id: req.params.studentId });

    return res.json(checkIn);
  }
}

export default new CheckinController();
