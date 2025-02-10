import { ContactRepository } from "@/repositories/contact-repository";

export class ContactService {
  async identify(email: string, phoneNumber: string) {
    const contactRepository = new ContactRepository();
    const contact = await contactRepository.findContactByEmail(email);
    return contact;
  }
}