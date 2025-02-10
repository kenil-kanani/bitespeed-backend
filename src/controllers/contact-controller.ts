import { Request, Response } from 'express';
import { ContactRepository } from '@/repositories/contact-repository';
import { CustomError } from '@/utils/error';
import { StatusCodes } from 'http-status-codes';

class ContactController {
  async identify(req: Request, res: Response) {
    try {
        const { email, phoneNumber } = req.body;
        if (!email || !phoneNumber) {
            throw new CustomError('Email and phone number are required', StatusCodes.BAD_REQUEST , 'invalid_request');
        }
        const contactRepository = new ContactRepository();
        const contact = await contactRepository.findContactByEmail(email);
        res.send(contact);
    } catch (error : unknown) {
        if (error instanceof CustomError) {
            res.status(error.statusCode)
            .send(error);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(new CustomError('An unknown error occurred', StatusCodes.INTERNAL_SERVER_ERROR, 'unknown_error'));
        }
    }
  }
}

export { ContactController };