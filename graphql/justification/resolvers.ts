import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { OurContext } from "../context";
import { IncorrectInputError } from "@/errors/IncorrectInputError";
import { ExistingJustificationError } from "@/errors/ExistingJustificationError";
import { Justification } from "@prisma/client";

interface JustificationCreationInput {
    absenceId: string;
    description: string;
    media: string;
    comments: string;
}

const justificationResolvers = {
    Mutation: {
        createJustification: async (parent: null, { input }: { input: JustificationCreationInput }, { db }: OurContext) => {
            const justification = await db.absence.findFirst({
                    where: {
                        dbId: input.absenceId,
                    }
                });
            if (!justification)
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

            return await db.justification.create({
                data: {
                    ...input,
                    updatedAt: new Date(),
                }
            });
        },
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