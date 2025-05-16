import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { OurContext } from "../context";
import { IncorrectInputError } from "@/errors/IncorrectInputError";
import { ExistingJustificationError } from "@/errors/ExistingJustificationError";
import { Justification } from "@prisma/client";
import { NonExistentJustificationError } from "@/errors/NonExistentJustificationError";
import { messages } from "../notification_absence/messages";

interface JustificationCreationInput {
    absenceId: string;
    description: string;
    media: string;
    comments: string;
}

const justificationResolvers = {
    Mutation: {
        createJustification: async (parent: null, { input }: { input: JustificationCreationInput }, { db }: OurContext) => {
            const absence = await db.absence.findFirst({
                    where: {
                        dbId: input.absenceId,
                    }
                });
            if (!absence)
                throw new AbsenceNotFoundError();

            const existingJustification = await db.justification.findFirst({
                    where: {
                        absenceId: input.absenceId,
                    }
                });
            if (existingJustification)
                throw new ExistingJustificationError();

            if (!input.description)
                throw new IncorrectInputError("The justification must have a description")

            return await db.$transaction(async (tx) => {
                await tx.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        isForBoss: true,
                        hasBeenSeen: false,
                        message: messages.justificationCreation,
                    },
                });

                return await tx.justification.create({
                    data: {
                        ...input,
                        updatedAt: new Date(),
                    }
                });
            });
        },
        // addComment: async (parent: null, { input }: { input: JustificationCreationInput }, { db }: OurContext) => {
        //     const existingJustification = await db.justification.findFirst({
        //             where: {
        //                 absenceId: input.absenceId,
        //             }
        //         });
        //     if (!existingJustification)
        //         throw new NonExistentJustificationError();

        //     if (input.description)
        //         existingJustification.description = input.description;

        //     if (input.media)
        //         existingJustification.media = input.media;

        //     if (input.comments)
        //         existingJustification.comments = input.comments;

        //     db.justification.update({
        //         where: {
        //             absenceId: input.absenceId,
        //         },
        //         data: {
        //             description: existingJustification.description,
        //             media: existingJustification.media,
        //             comments: existingJustification.comments,
        //         },
        //     })
        // }
        // TODO:Add a method to add comments, add method to update the justification
        // TODO: revise that you cannot modify the justification after a decision has been made
    },
    Justification: {
        informalAbsence: async (parent: Justification, args: null, context: OurContext) => {
            return await context.db.informalAbsence.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        },
        spontaneousAbsence: async (parent: Justification, args: null, context: OurContext) => {
            return await context.db.spontaneousAbsence.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        },
    }

};

export { justificationResolvers };