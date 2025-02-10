import { ContactRepository } from "@/repositories/contact-repository";

export class ContactService {
  async identify(email: string, phoneNumber: string) {
    const contactRepository = new ContactRepository();

    let contact1;
    let contact2;

    if(email){
      contact1 = await contactRepository.findContactByEmail(email);
    }

    if(phoneNumber){
      contact2 = await contactRepository.findContactByMobileNumber(phoneNumber);
    }

    if(!contact1 && !contact2){
     // create new contact
     const contact = await contactRepository.createContact(email, phoneNumber);
     return contact;
    }
    
    

    const contact = await contactRepository.findContactByEmail(email);
    return contact;
  }
}