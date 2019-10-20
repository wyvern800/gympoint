import Sequelize, { Model } from 'sequelize';

class Registry extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  /* Associating appointment with 'as' to add 'alias', cause if without, sequelize would
  be lost trying to figure out which was one and which was another */
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.User, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registry;
