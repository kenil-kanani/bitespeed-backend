import { 
    Model, 
    DataTypes, 
    InferAttributes, 
    InferCreationAttributes,
    CreationOptional 
  } from 'sequelize';
  import sequelize from '../config/databaseConfig';
  
  enum LinkPrecedence {
    PRIMARY = "primary",
    SECONDARY = "secondary"
  }
  
  class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
    declare id: CreationOptional<number>;
    declare phoneNumber: string | null;
    declare email: string | null;
    declare linkedId: number | null;
    declare linkPrecedence: LinkPrecedence;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: Date | null;
  }
  
  Contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      linkPrecedence: {
        type: DataTypes.ENUM(...Object.values(LinkPrecedence)),
        defaultValue: LinkPrecedence.PRIMARY,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'contacts',
      paranoid: true,
      timestamps: true,
    }
  );
  
  export { Contact, LinkPrecedence };