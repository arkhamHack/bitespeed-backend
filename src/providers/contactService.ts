import { Repository } from "typeorm";
import { Contact } from "../models/contact";
import { PostgresDataSource } from "./db";

interface IfinalizedContact {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

const updatedContactToSecondary = async (
  contactRepo: Repository<Contact>,
  contact: Contact,
  newPrimaryId: number
) => {
  contact.linkedId = newPrimaryId;
  contact.linkPrecedence = "secondary";
  await contactRepo.save(contact);
};

export const findOrCreateContact = async (
  email?: string,
  phoneNumber?: string
): Promise<IfinalizedContact> => {
  const contactsRepo = PostgresDataSource.getRepository(Contact);

  const existingContacts = await contactsRepo
    .createQueryBuilder("contact")
    .where("contact.email = :email", { email })
    .orWhere("contact.phoneNumber = :phoneNumber", { phoneNumber })
    .getMany();

  if (existingContacts.length === 0) {
    const newContact = contactsRepo.create({
      email,
      phoneNumber,
      linkPrecedence: "primary",
    });
    await contactsRepo.save(newContact);
    return {
      primaryContactId: newContact.id,
      emails: [newContact.email].filter(Boolean) as string[],
      phoneNumbers: [newContact.phoneNumber].filter(Boolean) as string[],
      secondaryContactIds: [],
    };
  }

  const primaryContacts = existingContacts.filter(
    (contact) => contact.linkPrecedence === "primary"
  );
  if (primaryContacts.length > 1) {
    const oldestPrimaryDoc = primaryContacts.reduce((prev, curr) =>
      prev.createdAt < curr.createdAt ? prev : curr
    );

    for (const contact of primaryContacts) {
      if (contact.id !== oldestPrimaryDoc.id) {
        await updatedContactToSecondary(
          contactsRepo,
          contact,
          oldestPrimaryDoc.id
        );
      }
    }
  }

  const updatedContacts = await contactsRepo
    .createQueryBuilder("contact")
    .where("contact.email = :email", { email })
    .orWhere("contact.phoneNumber = :phoneNumber", { phoneNumber })
    .getMany();

  const primaryContact =
    updatedContacts.find((contact) => contact.linkPrecedence === "primary") ||
    updatedContacts[0];

  let emails = Array.from(
    new Set(updatedContacts.map((contact) => contact.email).filter(Boolean))
  ) as string[];
  let phoneNumbers = Array.from(
    new Set(
      updatedContacts.map((contact) => contact.phoneNumber).filter(Boolean)
    )
  ) as string[];

  const secondaryContactIds = updatedContacts
    .filter((contact) => contact.linkPrecedence === "secondary")
    .map((contact) => contact.id);

  const isEmailMissing = email && !emails.includes(email);
  const isPhoneNumberMissing =
    phoneNumber && !phoneNumbers.includes(phoneNumber);
  if (isEmailMissing || isPhoneNumberMissing) {
    const secondaryContact = contactsRepo.create({
      email,
      phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: "secondary",
    });
    await contactsRepo.save(secondaryContact);
    secondaryContactIds.push(secondaryContact.id);

    if (isEmailMissing) {
      emails.push(email!);
    }
    if (isPhoneNumberMissing) {
      phoneNumbers.push(phoneNumber!);
    }
  }

  return {
    primaryContactId: primaryContact.id,
    emails,
    phoneNumbers,
    secondaryContactIds,
  };
};
