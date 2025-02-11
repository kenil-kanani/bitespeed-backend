import { LinkPrecedence } from "@/models/Contact";
import { ContactRepository } from "@/repositories/contact-repository";
import { CustomError } from "@/utils/error";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Contact } from "@/models/Contact";

export class ContactService {
  async identify(email: string, phoneNumber: string) {
    const contactRepository = new ContactRepository();

    let contact1;
    let contact2;

    if(email && !phoneNumber){
      const contact = await contactRepository.findContactByEmail(email);
      if(!contact){
        return await contactRepository.createContact({
          email,
          phoneNumber,
          linkPrecedence: LinkPrecedence.PRIMARY
        });
      }

      return await calculateResponse(email, phoneNumber);
    }

    if(phoneNumber && !email){
      const contact = await contactRepository.findContactByMobileNumber(phoneNumber);
      if(!contact){
        return await contactRepository.createContact({
          email,
          phoneNumber,
          linkPrecedence: LinkPrecedence.PRIMARY
        });
      }

      return await calculateResponse(email, phoneNumber);
    }

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
      if(contact1.id !== contact2.id  && contact1.email !== contact2.email && contact1.phoneNumber !== contact2.phoneNumber){

        // find old contact and new contact based on createdAt
        const oldContact = contact1.createdAt > contact2.createdAt ? contact2 : contact1;
        const newContact = contact1.createdAt > contact2.createdAt ? contact1 : contact2;

        await contactRepository.updateContact(oldContact.id, {
          linkPrecedence: LinkPrecedence.PRIMARY
        });

        await contactRepository.updateContact(newContact.id, {
          linkedId: oldContact.id,
          linkPrecedence: LinkPrecedence.SECONDARY
        });
      }
    }
    

    return await calculateResponse(email, phoneNumber);
  }
}

async function calculateResponse(email: string, phoneNumber: string) {
  const contactRepository = new ContactRepository();
  
  // find the initial contact by email or phone number
  let contact = await contactRepository.findContactByEmail(email) || 
                await contactRepository.findContactByMobileNumber(phoneNumber);

  if (!contact) {
    throw new CustomError('Contact not found', StatusCodes.NOT_FOUND, 'contact_not_found');
  }

  // find the primary contact
  let primaryContact = contact;
  while (primaryContact.linkPrecedence === LinkPrecedence.SECONDARY && primaryContact.linkedId) {
    const parent = await contactRepository.findContactById(primaryContact.linkedId);
    if (!parent) break;
    primaryContact = parent;
  }

  // Find all contacts in the hierarchy
  const allLinkedContacts = await Contact.findAll({
    where: {
      id: { [Op.in]: await findAllLinkedIds(primaryContact.id) }
    }
  });

  // Initialize sets to store unique values
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds = new Set<number>();

  // Add primary contact details first
  if (primaryContact.email) emails.add(primaryContact.email);
  if (primaryContact.phoneNumber) phoneNumbers.add(primaryContact.phoneNumber);

  // Process all contacts to find the complete chain
  const processedIds = new Set<number>([primaryContact.id]);
  let hasNewLinks = true;

  while (hasNewLinks) {
    hasNewLinks = false;
    for (const contact of allLinkedContacts) {
      if (!processedIds.has(contact.id)) {
        const isLinkedToProcessed = Array.from(processedIds).some(
          id => contact.linkedId === id || 
          allLinkedContacts.some(c => c.id === contact.linkedId && processedIds.has(c.id))
        );

        if (isLinkedToProcessed) {
          if (contact.email) emails.add(contact.email);
          if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
          if (contact.id !== primaryContact.id) secondaryContactIds.add(contact.id);
          processedIds.add(contact.id);
          hasNewLinks = true;
        }
      }
    }
  }

  return {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      secondaryContactIds: Array.from(secondaryContactIds)
    }
  };
}

// Helper function to find all linked ids
async function findAllLinkedIds(primaryId: number): Promise<number[]> {
    const linkedIds: number[] = [];
    const queue = [primaryId];
    
    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const linkedContacts = await Contact.findAll({ where: { linkedId: currentId } });
        
        for (const contact of linkedContacts) {
            if (!linkedIds.includes(contact.id)) {
                linkedIds.push(contact.id);
                queue.push(contact.id);
            }
        }
    }
    
    return linkedIds;
}