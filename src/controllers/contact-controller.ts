import { Request, Response } from 'express';
import { ContactService } from '@/services/contact-service';
import { CustomError } from '@/utils/error';
import { StatusCodes } from 'http-status-codes';

class ContactController {
  async identify(req: Request, res: Response) {
    try {
        const { email, phoneNumber } = req.body;
        if (!email && !phoneNumber) {
            throw new CustomError('Email or phone number is required', StatusCodes.BAD_REQUEST , 'invalid_request');
        }
        const contactService = new ContactService();
        const contact = await contactService.identify(email, phoneNumber);
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