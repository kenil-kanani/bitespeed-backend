import { Contact, LinkPrecedence } from '@/models/Contact';
import { CustomError } from '@/utils/error';
import { StatusCodes } from 'http-status-codes';
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

  async findContactByEmail(email: string): Promise<Contact | null> {
    try {
      const contact = await Contact.findOne({
        where: {
          email: {
            [Op.eq]: email
          }
        }
      });

      if (!contact) {
        return null;
      }

      return contact;
    } catch (error) {
      throw new CustomError('Error in findContactByEmail', StatusCodes.INTERNAL_SERVER_ERROR, 'internal_server_error');
    }
  }

  async findContactByMobileNumber(phoneNumber: string): Promise<Contact | null> {
    try {
      const contact = await Contact.findOne({
        where: {
          phoneNumber: {
            [Op.eq]: phoneNumber
          }
        }
      });

      if (!contact) {
        return null;
      }

      return contact;
    } catch (error) {
      throw new CustomError('Error in findContactByMobileNumber', StatusCodes.INTERNAL_SERVER_ERROR, 'internal_server_error');
    }
  }

  async createContact({
    email, phoneNumber, linkedId, linkPrecedence
  }: {
    email: string,
    phoneNumber: string,
    linkedId?: number,
    linkPrecedence: LinkPrecedence
  }): Promise<Contact> {
    try {
      const contact = await Contact.create({ email, 
        phoneNumber, 
        linkedId: linkedId || null, 
        linkPrecedence, 
        deletedAt: null 
      });
      return contact;
    } catch (error) {
      throw new CustomError('Error in createContact', StatusCodes.INTERNAL_SERVER_ERROR, 'internal_server_error');
    }
  }
  

  async updateContact(id: number, data: Partial<Contact>): Promise<Contact> {
    try {
      const contact = await Contact.findByPk(id);
      if (!contact) {
        throw new CustomError('Contact not found', StatusCodes.NOT_FOUND, 'contact_not_found');
      }
      await contact.update(data);
      return contact;
    } catch (error) {
      throw new CustomError('Error in updateContact', StatusCodes.INTERNAL_SERVER_ERROR, 'internal_server_error');
    }
  }

}
