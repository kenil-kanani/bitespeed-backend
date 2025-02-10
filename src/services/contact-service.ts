import { LinkPrecedence } from "@/models/Contact";
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
     await contactRepository.createContact({
      email,
      phoneNumber,
      linkPrecedence: LinkPrecedence.PRIMARY
     });
    }

    if(contact1 && !contact2){
      // means a contact with same email exists but not with same phone number
      // so we need to create a new contact with same email and new phone number as linkPrecedence='secondary'
      await contactRepository.createContact({
        email,
        phoneNumber,
        linkedId: contact1.id,
        linkPrecedence: LinkPrecedence.SECONDARY
      });
    }

    if(contact2 && !contact1){
      // means a contact with same phone number exists but not with same email
      // so we need to create a new contact with same phone number and new email as linkPrecedence='secondary'
      await contactRepository.createContact({
        email,
        phoneNumber,
        linkedId: contact2.id,
        linkPrecedence: LinkPrecedence.SECONDARY
      });
    }
    
    
    if(contact1 && contact2){

      // if contact1 and contact2 are not same then we need to make old contact as primary
      if(contact1.id !== contact2.id){

        // find old contact and new contact based on createdAt
        const oldContact = contact1.createdAt > contact2.createdAt ? contact1 : contact2;
        const newContact = contact1.createdAt > contact2.createdAt ? contact2 : contact1;

        await contactRepository.updateContact(oldContact.id, {
          linkPrecedence: LinkPrecedence.PRIMARY
        });

        await contactRepository.updateContact(newContact.id, {
          linkedId: oldContact.id,
          linkPrecedence: LinkPrecedence.SECONDARY
        });
      }
    }
    

    const contact = await contactRepository.findContactByEmail(email);
    return contact;
  }
}