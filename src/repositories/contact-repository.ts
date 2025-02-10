import { Contact } from '@/models/Contact';
import { Op } from 'sequelize';

export class ContactRepository {
  async findContactById(id: number): Promise<Contact | null> {
    try {
      return await Contact.findByPk(id);
    } catch (error) {
      console.error('Error in findContactById:', error);
      throw error;
    }
  }

  async findContactByEmail(email: string): Promise<Contact[]> {
    try {
      return await Contact.findAll({
        where: {
          email: {
            [Op.eq]: email
          }
        }
      });
    } catch (error) {
      console.error('Error in findContactByEmail:', error);
      throw error;
    }
  }

  async findContactByMobileNumber(phoneNumber: string): Promise<Contact[]> {
    try {
      return await Contact.findAll({
        where: {
          phoneNumber: {
            [Op.eq]: phoneNumber
          }
        }
      });
    } catch (error) {
      console.error('Error in findContactByMobileNumber:', error);
      throw error;
    }
  }
}
