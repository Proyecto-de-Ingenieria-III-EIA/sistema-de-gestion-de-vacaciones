import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { OurContext } from "../context";
import { IncorrectInputError } from "@/errors/IncorrectInputError";

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

            if (!input.description)
                throw new IncorrectInputError("The justification must have a description")

            return await db.justification.create({
                data: {
                    ...input,
                    updatedAt: new Date(),
                }
            });
        },
    }

};

export { justificationResolvers };